# Agent Operating Contract

This repository uses a fixed, decided workflow. Do not pivot away from it.

## Non-negotiable decisions

- Skills are distributed through `skills.sh` with `npx skills add LukasStrickler/agentic-athenaeum`.
- Authoring language for executable logic is TypeScript.
- Distribution runtime is Node.js JavaScript action files (`node skills/<skill>/scripts/<action>.js`).
- Development package manager is pnpm (>= 10.0.0).
- Bun and `tsx` are contributor conveniences only, not end-user requirements.
- `dev/` is source-of-truth; `skills/` is generated output.
- `skills/` updates are release-managed, not contributor-managed.

## Directory contract

- `dev/`: editable source skill definitions and TypeScript action scripts.
- `skills/`: generated install-ready skills (bundled JS action entrypoints, copied docs/assets), updated only via release automation PRs from branch `automation/release-generated-v<version>`.
- `scripts/build-skills.mjs`: copies non-TS assets, maps `SKILL.dev.md -> SKILL.md`, and bundles actions (esbuild; workspace packages `@agentic-athenaeum/contracts` and `@agentic-athenaeum/queries` inlined).
- `packages/contracts/`: shared input/output contracts used by skill actions; exports `loadEnv()` and `getGlobalEnvPath()` for optional local/global `.env` loading (see [docs/environment-variables.md](docs/environment-variables.md)).
- `packages/queries/`: shared prompt/query templates used by skill actions.
- `tests/fixtures/`: shared fixture inputs for per-skill and regression tests.

## Skill structure contract

Each skill in `dev/` must follow:

```text
dev/<skill-name>/
├── SKILL.dev.md
├── scripts/
│   ├── generate.ts
│   ├── transcribe.ts
│   └── ...
├── __tests__/          # optional; skill tests (*.unit.test.ts, *.integration.test.ts, *.e2e.test.ts); excluded from build and release
├── references/
└── assets/
```

Skill tests under `dev/<skill>/__tests__/` are not copied to `skills/` or into release bundles.

Generated output in `skills/` must follow:

```text
skills/<skill-name>/
├── SKILL.md
├── scripts/
│   ├── generate.js
│   ├── transcribe.js
│   └── ...
├── references/
└── assets/
```

Rules:

- Source skills in `dev/` must not contain `SKILL.md`.
- Only generated skills in `skills/` may contain `SKILL.md`.
- Each top-level `scripts/*.ts` file is treated as an installable action and bundled to `scripts/*.js`.

## SKILL.md rules

- `name` must exactly match folder name.
- Include `description` that helps agent triggering.
- Add `compatibility` when runtime/system dependencies are non-default.
- Use relative paths from skill root (for example `references/REFERENCE.md`).
- **Environment variables:** Each skill must declare required and optional
  environment variables in frontmatter under the standard **`metadata.env`**
  field (per the [Agent Skills spec](https://agentskills.io/specification)): a
  list of `{ name, required (boolean), description }`. Use `metadata.env: []`
  when the skill needs none. Where to set vars (local `.env`, global `.env`,
  export) is documented in the [Setup guide](docs/setup-guide.md) and
  [Environment variables](docs/environment-variables.md) reference; do not
  duplicate that in the skill body.

## Build and verify commands

- Build generated skills: `pnpm run build:skills`
- Typecheck authoring sources: `pnpm run typecheck`
- Lint (ESLint): `pnpm run lint`
- Markdown lint (standard format): `pnpm run lint:md`
- Format check (Prettier): `pnpm run format:check`
- Tests: `pnpm run test`, `pnpm run test:watch`, `pnpm run test:ci`, `pnpm run test:unit`, `pnpm run test:integration`, `pnpm run test:e2e`, `pnpm run test:coverage`, `pnpm run test:verbose`, or `pnpm run test:skill <name> [level]`. List skills: `pnpm run test:skill -- --list`. Commands that need built scripts run `build:skills` first. CI uses `github-actions` reporter for PR annotations.
- Full local verification: `pnpm run verify` (typecheck, lint, format check, then test; test runs build then all tests).

CI runs on Node 24; minimum supported runtime is Node >= 22.6.

## Dependency handling policy

- Action outputs in `skills/<skill>/scripts/*.js` are bundled with their npm dependencies.
- End users should not need extra runtime package installs for bundled dependencies.
- Node built-ins remain runtime-provided (not bundled).
- Heavy external system dependencies must be documented in each skill's `compatibility` field.

## CI and release policy

- **PR verification** (`verify-generated.yml`): runs `pnpm run verify` on relevant changes.
- **PR guard** (`protect-generated-skills.yml`): blocks PRs that modify `skills/**`. Exception: PRs from branch `automation/release-generated-v<semver>` by trusted actors (e.g. `github-actions[bot]`, or `RELEASE_TRUSTED_ACTORS`).
- **Release** (`release.yml`): two-phase manual release. **Prepare** (`mode=prepare`, version) builds from `dev/`, updates `skills/`, opens/updates PR from `automation/release-generated-v<version>`. **Publish** (`mode=publish`, same version) after merge: tag and GitHub Release with zip assets and checksums. Optional: `RELEASE_BOT_TOKEN`, `RELEASE_BOT_APP_ID`/`RELEASE_BOT_APP_PRIVATE_KEY`, `RELEASE_TRUSTED_ACTORS`.
- **Release assets**: `agentic-athenaeum-v<version>-skills-js.zip` (runtime), `agentic-athenaeum-v<version>-skills-ts.zip` (source), `agentic-athenaeum-v<version>-checksums.txt` (SHA256). Verify with `sha256sum -c ...`.

## Local guard (pre-commit)

- `pnpm install` runs `prepare`, which installs the pre-commit hook (`scripts/guard-skills-paths.mjs`).
- The hook blocks staged `skills/**` on non-release branches, unstages those files, and prints a fix message.
- Allowed: branch name `automation/release-generated-v*`. Override for one commit: `ALLOW_SKILLS_COMMIT=1 git commit ...`.
- Reinstall hooks manually: `pnpm run hooks:install`.

## Author workflow

1. Edit or add skills in `dev/`.
2. Run `pnpm run verify`.
3. Optional local runtime test: `pnpm run build:skills` then `npx skills add "$(pwd)" --all -y`. Before opening a normal PR, discard drift: `git restore --source origin/main skills` ([docs/dev-setup.md](docs/dev-setup.md)).
4. Commit source changes only (no `skills/` in normal PRs).
5. Open PR.

## Design target for educational skills

- Focus domains: image creation, transcription, PDF dissection, Anki generation/sync, Markdown/LaTeX study outputs.
- Prefer deterministic IO contracts and explicit output formats.
- Keep runtime prerequisites minimal for end users.

## Documentation and ADRs

- **Architecture and workflow:** [docs/architecture.md](docs/architecture.md), [docs/workflow.md](docs/workflow.md), [docs/release-runbook.md](docs/release-runbook.md).
- **Build and shared packages:** [docs/bundling.md](docs/bundling.md). Use `@agentic-athenaeum/contracts` and `@agentic-athenaeum/queries` in action scripts; they are inlined at bundle time.
- **Setup:** [docs/setup-guide.md](docs/setup-guide.md) (end users / external installation). **Development:** [docs/dev-setup.md](docs/dev-setup.md) (contributors). **Testing (layout, commands, examples):** [docs/testing.md](docs/testing.md).
- **Environment variables:** [docs/environment-variables.md](docs/environment-variables.md) (precedence, implementation).
- **Decisions:** [docs/adr/](docs/adr/) — ADR 0001 (dev/skills split), ADR 0002 (two-phase release, zip + checksums), ADR 0003 (environment variables and setup guide).
