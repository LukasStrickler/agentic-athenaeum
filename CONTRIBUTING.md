# Contributing to Agentic Athenaeum

Thanks for contributing. This guide is for first-time contributors and anyone contributing from a fork.

## Quick start

```bash
git clone https://github.com/LukasStrickler/agentic-athenaeum.git
cd agentic-athenaeum
corepack enable pnpm
pnpm install
pnpm run verify
```

A pre-commit hook (installed with `pnpm install`) will stop you from accidentally committing generated files.

## Where to edit

| Edit here                                                                                             | Don’t edit                            |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `dev/<skill-name>/` — skill definitions and scripts                                                   | `skills/` — generated at release time |
| `packages/contracts` and `packages/queries` — shared logic (see [docs/bundling.md](docs/bundling.md)) |                                       |

Your PR should only touch `dev/` and/or `packages/`. Never include changes under `skills/`.

## Workflow

1. **Edit** in `dev/` or `packages/`.
2. **Check** with `pnpm run verify` (includes typecheck, lint, format, and tests).
3. **(Optional)** Run `pnpm run build:skills` to generate `skills/` locally and test with your agent.
4. **Open a PR** with source changes only.

If you accidentally have `skills/` changes in your branch:

```bash
git restore --source origin/main skills
```

The pre-commit hook will also unstage `skills/` changes so they don’t get committed.

## Submitting a PR

1. Fork, clone your fork, then: `git checkout -b feat/my-change` (or `fix/...`, `docs/...`).
2. Make changes in `dev/` and/or `packages/`, run `pnpm run verify` (includes tests), then commit and push.
3. Open a PR to `main`.

CI runs the same checks. PRs that change `skills/` are rejected (only release automation may update
that directory). For test layout and how to add tests, see [docs/testing.md](docs/testing.md).

## After your PR is merged

Merging to `main` does **not** yet make your changes available for end users. A maintainer must run a **release** to regenerate `skills/` and publish installable assets. Until that release is done, users installing via e.g. `npx skills add LukasStrickler/agentic-athenaeum` will not see your changes. Release process: [docs/release-runbook.md](docs/release-runbook.md).

## Questions

Open an issue or discussion on the repository.
