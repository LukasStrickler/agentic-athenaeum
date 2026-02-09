import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const sourceRoot = path.resolve("dev");
const outputRoot = path.resolve("skills");

const shouldCopyFile = (name) => !name.endsWith(".ts") && !name.endsWith(".tsx");
const isForbiddenArtifact = (name) => {
  const lowerName = name.toLowerCase();

  return (
    lowerName === ".env" ||
    lowerName.startsWith(".env.") ||
    lowerName.endsWith(".pem") ||
    lowerName.endsWith(".key") ||
    lowerName.endsWith(".sqlite") ||
    lowerName.endsWith(".log") ||
    lowerName === "skills.md" ||
    lowerName === "skill.md"
  );
};
const isActionScriptPath = (sourcePath) => {
  const relativePath = path.relative(sourceRoot, sourcePath);
  const segments = relativePath.split(path.sep);

  return segments.length === 3 && segments[1] === "scripts" && segments[2].endsWith(".ts");
};

const actionEntries = [];

const ensureSourceExists = async () => {
  try {
    const sourceStats = await stat(sourceRoot);
    if (!sourceStats.isDirectory()) {
      throw new Error("dev exists but is not a directory");
    }
  } catch {
    throw new Error("dev directory is missing");
  }
};

const copyNonTypeScriptFiles = async (srcDir, destDir) => {
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(srcDir, entry.name);
    const destinationPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__") continue;
      await copyNonTypeScriptFiles(sourcePath, destinationPath);
      continue;
    }

    if (!entry.isFile()) continue;

    if (isForbiddenArtifact(entry.name)) {
      throw new Error(`Forbidden artifact in dev tree: ${path.relative(sourceRoot, sourcePath)}`);
    }

    if (isActionScriptPath(sourcePath)) {
      const outputFileName = `${path.parse(entry.name).name}.js`;
      actionEntries.push({
        entry: sourcePath,
        outfile: path.join(destDir, outputFileName),
      });
      continue;
    }

    if (!shouldCopyFile(entry.name)) continue;

    if (entry.name === "SKILL.dev.md") {
      await cp(sourcePath, path.join(destDir, "SKILL.md"));
      continue;
    }

    await cp(sourcePath, destinationPath);
  }
};

const repoRoot = path.resolve();
const bundleActionScripts = async () => {
  for (const action of actionEntries) {
    await build({
      entryPoints: [action.entry],
      outfile: action.outfile,
      bundle: true,
      platform: "node",
      format: "cjs",
      target: "node22",
      sourcemap: false,
      logLevel: "silent",
      packages: "bundle",
      absWorkingDir: repoRoot,
      alias: {
        "@agentic-athenaeum/contracts": path.join(repoRoot, "packages/contracts/src/index.ts"),
        "@agentic-athenaeum/queries": path.join(repoRoot, "packages/queries/src/index.ts"),
      },
    });
  }
};

const main = async () => {
  await ensureSourceExists();
  await rm(outputRoot, { recursive: true, force: true });
  await copyNonTypeScriptFiles(sourceRoot, outputRoot);
  await bundleActionScripts();
};

main().catch((error) => {
  console.error(`build-skills failed: ${error.message}`);
  process.exitCode = 1;
});
