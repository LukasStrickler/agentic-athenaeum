# Testing guide

This document describes the test setup, layout, naming, and how to run and write tests. For a quick
command reference, see [dev-setup.md](dev-setup.md#available-commands).

## Overview

- **Runner:** [Vitest](https://vitest.dev/) with Node environment.
- **Projects:** Three Vitest projects — `unit`, `integration`, `e2e` — so you can run levels
  separately (e.g. fast unit-only during development).
- **Coverage:** Optional; use `pnpm run test:coverage`. Report is written to `coverage/` (git-ignored).

Full verification (including tests) is `pnpm run verify`. CI runs the same checks and uses the
`github-actions` reporter so failed tests appear as PR annotations.

## Where tests live

| Location                                      | Project     | Description                                              |
| --------------------------------------------- | ----------- | -------------------------------------------------------- |
| `packages/**/*.test.ts`                       | unit        | Package unit tests (e.g. contracts, helpers)             |
| `dev/<skill>/__tests__/*.unit.test.ts`        | unit        | Skill unit tests (no built scripts)                      |
| `dev/<skill>/__tests__/*.integration.test.ts` | integration | Skill tests that run built `skills/<skill>/scripts/*.js` |
| `dev/<skill>/__tests__/*.e2e.test.ts`         | e2e         | Skill end-to-end (scripts + layout under `skills/`)      |
| `tests/unit/**/*.test.ts`                     | unit        | Repo-level unit tests                                    |
| `tests/e2e/**/*.test.ts`                      | e2e         | Repo-level e2e tests                                     |

Skill tests under `dev/<skill>/__tests__/` are **not** copied to `skills/` or into release bundles.
Shared fixture files live in [tests/fixtures/](../tests/fixtures/) (see [Fixtures](#fixtures)).

## File naming

- **Unit:** `*.unit.test.ts` under `dev/**/__tests__/`, or any `*.test.ts` under `packages/**` or
  `tests/unit/**`.
- **Integration:** `*.integration.test.ts` under `dev/**/__tests__/`.
- **E2E:** `*.e2e.test.ts` under `dev/**/__tests__/` or `tests/e2e/**`.

Vitest selects tests by glob; the suffix (`.unit`, `.integration`, `.e2e`) determines the project.

## Commands

| Command                              | What it does                                                      |
| ------------------------------------ | ----------------------------------------------------------------- |
| `pnpm run test`                      | Build `dev/` → `skills/`, then run all tests once                 |
| `pnpm run test:watch`                | Build then run tests in watch mode (re-runs on file changes)      |
| `pnpm run test:ci`                   | Alias for `test` (single run, e.g. CI)                            |
| `pnpm run test:unit`                 | Unit tests only; does **not** run build                           |
| `pnpm run test:integration`          | Build then integration tests only                                 |
| `pnpm run test:e2e`                  | Build then e2e tests only                                         |
| `pnpm run test:coverage`             | Build then all tests with coverage (text + HTML in `coverage/`)   |
| `pnpm run test:verbose`              | Build then all tests with verbose reporter                        |
| `pnpm run test:skill <name> [level]` | Tests for one skill; build runs automatically for integration/e2e |

List skills that have tests:

```bash
pnpm run test:skill -- --list
```

Pass extra arguments to Vitest after the skill name (and optional level):

```bash
pnpm run test:skill placeholder -- --reporter=verbose
pnpm run test:skill placeholder unit -- --reporter=dot
```

## Writing tests

### Unit test (package)

Place next to source or in a test file under `packages/<pkg>/src/`:

```ts
import { describe, it, expect } from "vitest";
import { normalizeInputText } from "./study-material";

describe("normalizeInputText", () => {
  it("returns trimmed non-empty string as-is", () => {
    expect(normalizeInputText("  hello  ")).toBe("hello");
  });
});
```

### Unit test (skill)

In `dev/<skill>/__tests__/<name>.unit.test.ts`. Use workspace packages; do **not** depend on built
`skills/` output:

```ts
import { describe, it, expect } from "vitest";
import { normalizeInputText } from "@agentic-athenaeum/contracts";

describe("my-skill (unit)", () => {
  it("normalized input is used in output format", () => {
    const normalized = normalizeInputText("  demo  ");
    expect(normalized).toBe("demo");
  });
});
```

### Integration test (skill)

In `dev/<skill>/__tests__/<name>.integration.test.ts`. Run the **built** script under
`skills/<skill>/scripts/*.js` (e.g. with `spawnSync`). Requires `pnpm run build:skills` to have been
run (or use `pnpm run test` / `pnpm run test:integration`, which run the build first):

```ts
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const script = path.join(repoRoot, "skills", "my-skill", "scripts", "echo.js");

describe("my-skill script (integration)", () => {
  it("runs and returns exit code 0", () => {
    const result = spawnSync("node", [script, "--input", "hello"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("hello");
  });
});
```

### E2E test (skill)

In `dev/<skill>/__tests__/<name>.e2e.test.ts`. Assert that `skills/<skill>/` exists and the script
runs (layout + runtime):

```ts
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const skillDir = path.join(repoRoot, "skills", "my-skill");
const script = path.join(skillDir, "scripts", "echo.js");

describe("my-skill (e2e)", () => {
  it("skill layout exists and script runs", () => {
    expect(existsSync(skillDir)).toBe(true);
    expect(existsSync(script)).toBe(true);
    const result = spawnSync("node", [script, "--input", "e2e"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("e2e");
  });
});
```

## Fixtures

Shared fixture files (sample PDFs, Markdown, expected snippets) live in [tests/fixtures/](../tests/fixtures/).
Resolve paths from the repo root in tests:

```ts
import path from "node:path";

const repoRoot = process.cwd();
const fixturePath = path.join(repoRoot, "tests", "fixtures", "sample.txt");
```

See [tests/fixtures/README.md](../tests/fixtures/README.md) for details.

## CI and PRs

- **Before opening a PR:** Run `pnpm run verify`. It runs typecheck, lint, format check, and tests
  (with a prior build for integration/e2e).
- **CI:** The `verify-generated` workflow runs `pnpm run verify`. Failed tests are reported via the
  `github-actions` reporter so you see annotations in the PR.
- **Checklist:** In the PR template, confirm that `pnpm run verify` passes and add or update tests
  when you change behavior.

## Troubleshooting

| Problem                                     | Solution                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| Tests fail with "skills/... does not exist" | Run `pnpm run build:skills` (or use `pnpm run test`, which builds first).             |
| "No projects matched the filter"            | Use project name `unit`, `integration`, or `e2e`. Run without `--project` to run all. |
| Want to re-run only affected tests          | Use `pnpm run test:watch`; Vitest watches and re-runs on save.                        |
| Need verbose output                         | `pnpm run test:verbose` or `pnpm run test:skill <name> -- --reporter=verbose`.        |

More: [dev-setup.md](dev-setup.md#troubleshooting).
