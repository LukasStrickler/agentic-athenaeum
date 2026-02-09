#!/usr/bin/env node
/**
 * Run tests for a single skill: unit, integration, and/or e2e.
 * Usage: pnpm run test:skill <skillName> [unit|integration|e2e] [-- vitest-args...]
 * List skills with tests: pnpm run test:skill -- --list
 * Build runs automatically before integration/e2e (or when no level is specified).
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const devRoot = path.join(repoRoot, "dev");

const VALID_LEVELS = new Set(["unit", "integration", "e2e"]);
const pnpmCmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function listSkillsWithTests() {
  if (!existsSync(devRoot) || !statSync(devRoot).isDirectory()) {
    return [];
  }
  const entries = readdirSync(devRoot, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const testsDir = path.join(devRoot, entry.name, "__tests__");
    if (existsSync(testsDir) && statSync(testsDir).isDirectory()) {
      skills.push(entry.name);
    }
  }
  return skills.sort();
}

function main() {
  const rawArgs = process.argv.slice(2);
  const listFlag = rawArgs.some((a) => a === "--list" || a === "-l");
  const args = rawArgs.filter((a) => a !== "--list" && a !== "-l");
  const first = args[0];
  if (listFlag || first === "--list" || first === "-l") {
    const skills = listSkillsWithTests();
    process.stdout.write("Skills with tests (dev/<name>/__tests__/):\n");
    if (skills.length === 0) {
      process.stdout.write("  (none)\n");
    } else {
      for (const name of skills) {
        process.stdout.write(`  ${name}\n`);
      }
      process.stdout.write("\nRun: pnpm run test:skill <name> [unit|integration|e2e]\n");
    }
    process.exitCode = 0;
    return;
  }

  const skillName = first;
  const level = VALID_LEVELS.has(args[1]) ? args[1] : undefined;
  const extraArgs = VALID_LEVELS.has(args[1]) ? args.slice(2) : args.slice(1);

  if (!skillName) {
    const skills = listSkillsWithTests();
    process.stderr.write(
      "Usage: pnpm run test:skill <skillName> [unit|integration|e2e]\n" +
        "       pnpm run test:skill --list   list skills that have tests\n\n" +
        "  skillName: directory under dev/ (e.g. placeholder)\n" +
        "  level: optional; run only this test level for the skill\n\n"
    );
    if (skills.length > 0) {
      process.stderr.write("Skills with tests: " + skills.join(", ") + "\n");
    }
    process.exitCode = 1;
    return;
  }

  const skillDir = path.join(devRoot, skillName);
  if (!existsSync(skillDir) || !statSync(skillDir).isDirectory()) {
    process.stderr.write(`Error: dev/${skillName}/ does not exist. Cannot run skill tests.\n`);
    process.exitCode = 1;
    return;
  }

  const testsDir = path.join(skillDir, "__tests__");
  if (!existsSync(testsDir) || !statSync(testsDir).isDirectory()) {
    process.stderr.write(
      `Error: dev/${skillName}/__tests__/ does not exist. No tests for this skill.\n`
    );
    process.exitCode = 1;
    return;
  }

  const needsBuild = !level || level === "integration" || level === "e2e";
  if (needsBuild) {
    const buildResult = spawnSync(pnpmCmd, ["run", "build:skills"], {
      cwd: repoRoot,
      stdio: "inherit",
      shell: false,
    });
    if (buildResult.status !== 0) {
      process.exitCode = buildResult.status ?? 1;
      return;
    }
  }

  const testsPath = path.relative(repoRoot, testsDir);
  const vitestArgs = ["run", testsPath];
  if (level) {
    vitestArgs.push("--project", level);
  }
  vitestArgs.push(...extraArgs);

  const result = spawnSync(pnpmCmd, ["exec", "vitest", ...vitestArgs], {
    cwd: repoRoot,
    stdio: "inherit",
    shell: false,
  });

  process.exitCode = result.status ?? 1;
}

main();
