# Development Setup

This page is for **contributors** (developers working on the repo). If you are **installing and using** skills (e.g. via `npx skills add LukasStrickler/agentic-athenaeum`), see the [Setup guide](setup-guide.md) instead.

## Prerequisites

| Requirement | Version   | Check            |
| ----------- | --------- | ---------------- |
| Node.js     | >= 22.6.0 | `node --version` |
| pnpm        | >= 10.0.0 | `pnpm --version` |

CI uses **Node 24**; the minimum supported runtime is **Node 22.6** (see `engines` in package.json).

Optional (contributor convenience):

- **Bun** - Faster TypeScript execution during development
- **tsx** - TypeScript execution without compilation

## Installation

```bash
# Clone the repository
git clone https://github.com/LukasStrickler/agentic-athenaeum.git
cd agentic-athenaeum

# Enable pnpm via corepack (once per machine)
corepack enable pnpm

# Install dependencies
pnpm install

# Verify setup
pnpm run verify
```

## Editor Setup

### VS Code (Recommended)

Install extensions:

- **ESLint** - Linting
- **Prettier** - Formatting
- **TypeScript** - Language support

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Project Structure

```text
.
├── dev/                    # Source skills (edit here)
├── skills/                 # Generated skills (release-managed)
├── packages/
│   ├── contracts/          # Shared types and helpers
│   └── queries/            # Shared prompts
├── scripts/                # Build automation
├── docs/                   # Documentation
└── .github/                # CI/CD
```

Shared packages are bundled into each skill script; see [docs/bundling.md](./bundling.md) for usage and options.

## Available Commands

| Command                              | Description                                                             |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `pnpm run build:skills`              | Build dev/ → skills/                                                    |
| `pnpm run typecheck`                 | TypeScript validation                                                   |
| `pnpm run lint`                      | ESLint (code quality)                                                   |
| `pnpm run lint:md`                   | Markdown lint (standard style)                                          |
| `pnpm run format`                    | Prettier (format and overwrite)                                         |
| `pnpm run format:check`              | Prettier (format check)                                                 |
| `pnpm run test`                      | Build from dev/ then run all tests once                                 |
| `pnpm run test:watch`                | Build then run tests in **watch mode** (re-runs on file changes)        |
| `pnpm run test:ci`                   | Alias for `test` (explicit single run, e.g. for CI configs)             |
| `pnpm run test:unit`                 | Unit tests only; no build                                               |
| `pnpm run test:integration`          | Build then run integration tests                                        |
| `pnpm run test:e2e`                  | Build then run E2E tests                                                |
| `pnpm run test:coverage`             | Build then run all tests with **coverage** (text + HTML in `coverage/`) |
| `pnpm run test:verbose`              | Build then run all tests with verbose reporter                          |
| `pnpm run test:skill <name> [level]` | Tests for one skill; use `pnpm run test:skill -- --list` to list        |
| `pnpm run verify`                    | Full verification (typecheck, lint, format check, then test)            |

`test`, `test:integration`, and `test:e2e` run `build:skills` first so we always test the current
`dev/` output. `test:skill` also builds before running integration, e2e, or all levels. Per-skill
tests live in `dev/<skill>/__tests__/` and are excluded from build and release.

Full testing guide (layout, naming, writing unit/integration/e2e tests, fixtures):
[docs/testing.md](testing.md).

### Test DX tips

- **Watch mode:** Use `pnpm run test:watch` while editing; Vitest re-runs affected tests on save. Exit with Ctrl+C.
- **List skills:** Run `pnpm run test:skill` with no arguments to see usage and which skills have tests; or `pnpm run test:skill -- --list` to only list skill names.
- **Pass options to Vitest:** e.g. `pnpm run test:skill placeholder -- --reporter=verbose` or `pnpm run test -- --reporter=dot`.
- **CI:** In GitHub Actions, the workflow uses the `github-actions` reporter so failed tests show up as PR annotations.

## Generated Output Policy

- `dev/` is source of truth.
- `skills/` is generated and must not be edited manually.
- Normal contributor PRs should not include `skills/` changes.
- Release automation creates a dedicated PR for generated output.

### Local Runtime Testing

When you need to test generated runtime behavior locally:

```bash
pnpm run build:skills

# Install from local repository path into detected agents
npx skills add "$(pwd)" --all -y
```

This is for local validation only. Before opening a regular PR, remove local generated drift:

```bash
git restore --source origin/main skills
```

## Troubleshooting

### Build fails with "esbuild not found"

```bash
pnpm install
```

### TypeScript errors in packages/

```bash
pnpm run typecheck
```

### Generated output doesn't match

```bash
pnpm run build:skills
git diff skills/
```

If this diff appears in a normal feature PR, reset it:

```bash
git restore --source origin/main skills
```

### Environment variables for local dev or tests

Optional: create a `.env` file at the repo root for local development or tests
(e.g. API keys). It is gitignored. Skills load **local** `.env` (from the
current working directory) first, then a **global** `.env` from a standard
config directory (e.g. `~/.config/agentic-athenaeum/.env` on macOS/Linux,
`%APPDATA%\agentic-athenaeum\.env` on Windows). See
[Environment variables](environment-variables.md) for precedence and
implementation; [Setup guide](setup-guide.md) for global paths and user setup.

### Tests fail with "skills/... does not exist"

Integration and e2e tests run the built scripts under `skills/`. Run a build first:

```bash
pnpm run build:skills
pnpm run test
```

Or use `pnpm run test` (it runs `build:skills` before tests).

### "No projects matched the filter" when using --project

Ensure you're using a valid project name: `unit`, `integration`, or `e2e`. Run `pnpm run test` without `--project` to run all.
