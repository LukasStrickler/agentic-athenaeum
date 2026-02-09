import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const skillsPlaceholder = path.join(repoRoot, "skills", "placeholder");
const echoScript = path.join(skillsPlaceholder, "scripts", "echo.js");

describe("placeholder echo (e2e)", () => {
  it("skills/placeholder exists and echo.js runs successfully", () => {
    expect(existsSync(skillsPlaceholder)).toBe(true);
    expect(existsSync(echoScript)).toBe(true);
    const result = spawnSync("node", [echoScript, "--input", "e2e test"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("e2e test");
  });
});
