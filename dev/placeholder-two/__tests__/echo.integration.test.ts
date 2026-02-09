import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const echoScript = path.join(repoRoot, "skills", "placeholder-two", "scripts", "echo.js");

describe("placeholder-two echo (integration)", () => {
  it("runs echo.js and returns exit code 0", () => {
    const result = spawnSync("node", [echoScript, "--input", "hello two"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
  });

  it("stdout contains Placeholder Two Output", () => {
    const result = spawnSync("node", [echoScript, "--input", "integration"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Placeholder Two Output");
    expect(result.stdout).toContain("integration");
  });
});
