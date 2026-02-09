import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const echoScript = path.join(repoRoot, "skills", "placeholder", "scripts", "echo.js");

describe("placeholder echo script (integration)", () => {
  it("runs echo.js and returns exit code 0", () => {
    const result = spawnSync("node", [echoScript, "--input", "hello"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
  });

  it("includes normalized input in stdout", () => {
    const result = spawnSync("node", [echoScript, "--input", " test input "], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("test input");
    expect(result.stdout).toContain("Placeholder Output");
  });

  it("writes to file when --output is given", async () => {
    const { mkdir } = await import("node:fs/promises");
    const outDir = path.join(repoRoot, "dist", "test-output");
    await mkdir(outDir, { recursive: true });
    const outputPath = path.join(outDir, "echo-out-integration.txt");
    const result = spawnSync("node", [echoScript, "--input", "file test", "--output", outputPath], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("[placeholder] Wrote to");
    const { readFile } = await import("node:fs/promises");
    const content = await readFile(outputPath, "utf8");
    expect(content).toContain("file test");
    expect(content).toContain("Placeholder Output");
  });
});
