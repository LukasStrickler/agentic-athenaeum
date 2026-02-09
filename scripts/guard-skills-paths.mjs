#!/usr/bin/env node

import { execSync, spawnSync } from "node:child_process";
import path from "node:path";

const RELEASE_BRANCH_PATTERN =
  /^automation\/release-generated-v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const OVERRIDE_ENVS = ["ALLOW_SKILLS_COMMIT", "RELEASE_AUTOMATION"];

function run(command) {
  return execSync(command, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function isOverrideEnabled() {
  return OVERRIDE_ENVS.some((name) => {
    const value = process.env[name];
    return value === "1" || value === "true";
  });
}

function isReleaseBranch(branch) {
  return RELEASE_BRANCH_PATTERN.test(branch);
}

function listForbiddenPaths() {
  const output = execSync("git diff --cached --name-only --diff-filter=ACMRD -z", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const files = output.split("\u0000").filter(Boolean);
  const skillsFiles = files.filter((filePath) => filePath.startsWith("skills/"));
  const misplacedSkillMd = files.filter((filePath) => {
    const fileName = path.basename(filePath).toLowerCase();
    return (fileName === "skill.md" || fileName === "skills.md") && !filePath.startsWith("skills/");
  });

  return { skillsFiles, misplacedSkillMd };
}

function unstageFiles(paths) {
  if (paths.length === 0) {
    return;
  }

  spawnSync("git", ["restore", "--staged", "--", ...paths], {
    stdio: "ignore",
  });
}

function printBlockedMessage(skillsFiles, misplacedSkillMd, branch) {
  const overrideHint = "ALLOW_SKILLS_COMMIT=1 git commit ...";
  const lines = [];

  if (skillsFiles.length > 0) {
    lines.push("[guard] blocked staged changes under skills/");
    lines.push("");
    lines.push("Generated runtime files are release-managed.");
    lines.push(`Current branch: ${branch}`);
    lines.push("");
    lines.push("The following files were unstaged:");
    skillsFiles.forEach((p) => lines.push(`- ${p}`));
    lines.push("");
  }

  if (misplacedSkillMd.length > 0) {
    lines.push("[guard] blocked misplaced SKILL.md/Skills.md files");
    lines.push("");
    lines.push("SKILL.md/Skills.md must only exist in generated skills/ directory.");
    lines.push("Source files in dev/ must be named SKILL.dev.md.");
    lines.push("");
    lines.push("The following files were unstaged:");
    misplacedSkillMd.forEach((p) => lines.push(`- ${p}`));
    lines.push("");
  }

  lines.push("How to proceed:");
  lines.push("1) Commit source changes from dev/ only.");
  lines.push("2) If this is release generation, use branch automation/release-generated-v*.");
  lines.push(`3) For intentional local override, run: ${overrideHint}`);
  lines.push("");

  process.stderr.write(lines.join("\n"));
}

function main() {
  let branch = "";

  try {
    branch = run("git rev-parse --abbrev-ref HEAD");
  } catch {
    process.exit(0);
  }

  if (isReleaseBranch(branch) || isOverrideEnabled()) {
    process.exit(0);
  }

  const { skillsFiles, misplacedSkillMd } = listForbiddenPaths();
  if (skillsFiles.length === 0 && misplacedSkillMd.length === 0) {
    process.exit(0);
  }

  unstageFiles([...skillsFiles, ...misplacedSkillMd]);
  printBlockedMessage(skillsFiles, misplacedSkillMd, branch);
  process.exit(1);
}

main();
