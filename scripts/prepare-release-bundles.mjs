import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const devRoot = path.resolve("dev");
const generatedRoot = path.resolve("skills");
const bundleRoot = path.resolve("dist", "release-assets");
const jsBundleRoot = path.join(bundleRoot, "js", "skills");
const tsBundleRoot = path.join(bundleRoot, "ts", "skills");

const isForbiddenArtifact = (name, allowSkillMd = false) => {
  const lowerName = name.toLowerCase();

  const isSkillMd = lowerName === "skill.md";
  const isSkillsMd = lowerName === "skills.md";

  if (isSkillMd && allowSkillMd) {
    return false;
  }

  return (
    lowerName === ".env" ||
    lowerName.startsWith(".env.") ||
    lowerName.endsWith(".pem") ||
    lowerName.endsWith(".key") ||
    lowerName.endsWith(".sqlite") ||
    lowerName.endsWith(".log") ||
    isSkillMd ||
    isSkillsMd
  );
};

const ensureDirectory = async (directoryPath, label) => {
  let directoryStats;

  try {
    directoryStats = await stat(directoryPath);
  } catch {
    throw new Error(`${label} directory is missing: ${directoryPath}`);
  }

  if (!directoryStats.isDirectory()) {
    throw new Error(`${label} path is not a directory: ${directoryPath}`);
  }
};

const copyDevTreeWithSkillRename = async (sourcePath, destinationPath) => {
  await mkdir(destinationPath, { recursive: true });
  const entries = await readdir(sourcePath, { withFileTypes: true });

  for (const entry of entries) {
    const sourceEntryPath = path.join(sourcePath, entry.name);
    const destinationEntryPath = path.join(destinationPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__") continue;
      await copyDevTreeWithSkillRename(sourceEntryPath, destinationEntryPath);
      continue;
    }

    if (!entry.isFile()) continue;

    if (isForbiddenArtifact(entry.name)) {
      throw new Error(`Forbidden artifact in dev tree: ${path.relative(devRoot, sourceEntryPath)}`);
    }

    if (entry.name === "SKILL.dev.md") {
      await cp(sourceEntryPath, path.join(destinationPath, "SKILL.md"));
      continue;
    }

    await cp(sourceEntryPath, destinationEntryPath);
  }
};

const listSkillDirectories = async () => {
  const entries = await readdir(devRoot, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
};

const assertNoForbiddenArtifactsInTree = async (rootPath, currentPath = rootPath) => {
  const entries = await readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      await assertNoForbiddenArtifactsInTree(rootPath, entryPath);
      continue;
    }

    if (!entry.isFile()) continue;

    if (isForbiddenArtifact(entry.name, rootPath === generatedRoot)) {
      throw new Error(`Forbidden artifact found: ${path.relative(rootPath, entryPath)}`);
    }
  }
};

const validateTsBundleMetadata = async (skillNames) => {
  for (const skillName of skillNames) {
    const skillBundlePath = path.join(tsBundleRoot, skillName);
    const skillMdPath = path.join(skillBundlePath, "SKILL.md");
    const skillDevMdPath = path.join(skillBundlePath, "SKILL.dev.md");

    try {
      const skillMdStats = await stat(skillMdPath);
      if (!skillMdStats.isFile()) {
        throw new Error(`SKILL.md is not a file for ${skillName}`);
      }
    } catch {
      throw new Error(`Missing SKILL.md in TypeScript bundle for ${skillName}`);
    }

    try {
      await stat(skillDevMdPath);
      throw new Error(`SKILL.dev.md must not exist in TypeScript bundle for ${skillName}`);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }
};

const main = async () => {
  await ensureDirectory(devRoot, "dev");
  await ensureDirectory(generatedRoot, "skills");

  const skillNames = await listSkillDirectories();
  if (skillNames.length === 0) {
    throw new Error("No skills found in dev/");
  }

  await rm(bundleRoot, { recursive: true, force: true });
  await mkdir(path.dirname(bundleRoot), { recursive: true });

  await mkdir(path.dirname(jsBundleRoot), { recursive: true });
  await assertNoForbiddenArtifactsInTree(generatedRoot);
  await cp(generatedRoot, jsBundleRoot, { recursive: true });

  await copyDevTreeWithSkillRename(devRoot, tsBundleRoot);
  await validateTsBundleMetadata(skillNames);

  console.log(`Prepared release assets at ${bundleRoot}`);
  console.log(`- JavaScript bundle root: ${jsBundleRoot}`);
  console.log(`- TypeScript bundle root: ${tsBundleRoot}`);
};

main().catch((error) => {
  console.error(`prepare-release-bundles failed: ${error.message}`);
  process.exitCode = 1;
});
