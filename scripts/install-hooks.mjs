#!/usr/bin/env node

import { chmodSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const hookSource = path.join(repoRoot, ".githooks", "pre-commit");

function getHooksDir() {
  try {
    return execSync("git rev-parse --git-path hooks", {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

function main() {
  if (!existsSync(hookSource)) {
    process.stderr.write("[hooks] missing .githooks/pre-commit\n");
    process.exit(1);
  }

  const hooksDir = getHooksDir();
  if (!hooksDir) {
    process.stdout.write("[hooks] skipped: not inside a git repository\n");
    process.exit(0);
  }

  mkdirSync(hooksDir, { recursive: true });

  const destination = path.join(hooksDir, "pre-commit");
  copyFileSync(hookSource, destination);
  chmodSync(destination, 0o755);

  process.stdout.write(`[hooks] installed pre-commit hook at ${destination}\n`);
}

main();
