import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const skillsDir = path.join(repoRoot, "skills", "placeholder-two");
const echoScript = path.join(skillsDir, "scripts", "echo.js");

describe("placeholder-two echo (e2e)", () => {
  it("skills/placeholder-two exists and echo.js runs", () => {
    expect(existsSync(skillsDir)).toBe(true);
    expect(existsSync(echoScript)).toBe(true);
    const result = spawnSync("node", [echoScript, "--input", "e2e two"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("e2e two");
  });
});
