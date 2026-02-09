# Development Workflow

For the short operational version, see `docs/release-runbook.md`.

## Overview

```text
dev/ (source of truth) -> build:skills -> skills/ (generated runtime)
```

The generated `skills/` directory is **release-managed**:

- Normal contributor PRs: source changes only (`dev/`, scripts, docs, etc.)
- Release automation PRs: generated `skills/` updates

## Daily Contributor Flow

1. Edit in `dev/<skill-name>/`.
2. Run verification:

```bash
pnpm run verify
```

`pnpm install` runs `prepare`, which installs the local `pre-commit` guard.

3. Optional local runtime test:

```bash
pnpm run build:skills

# Install locally into detected agents
npx skills add "$(pwd)" --all -y
```

4. Open PR without `skills/` changes.

If `skills/` changes were generated locally, discard them before pushing:

```bash
git restore --source origin/main skills
```

## CI Workflows

### `verify-generated.yml` (PR verification)

- Runs `pnpm run verify` for relevant PR changes.
- Does not require contributor PRs to commit generated output.

### `protect-generated-skills.yml` (PR guard)

- Blocks PRs that modify `skills/**`.
- Exception: release automation PRs from `automation/release-generated-v*` by trusted bot actors.
- Trusted bot actors include `github-actions[bot]` plus optional repository variable `RELEASE_TRUSTED_ACTORS`.

### `release.yml` (manual)

Supports two modes via `workflow_dispatch`:

- `mode=prepare`: builds generated output and opens/updates release PR with `skills/**` changes.
- `mode=publish`: validates `main`, ensures generated output is synced, creates tag, publishes release with JS/TS zip assets.

## Release Runbook

1. Prepare generated PR:

```bash
gh workflow run release.yml -f mode=prepare -f version=1.2.3
```

2. Merge PR `automation/release-generated-v1.2.3` into `main`.
3. Publish release:

```bash
gh workflow run release.yml -f mode=publish -f version=1.2.3
```

4. Release assets produced:

- `agentic-athenaeum-v1.2.3-skills-js.zip`
- `agentic-athenaeum-v1.2.3-skills-ts.zip`
- `agentic-athenaeum-v1.2.3-checksums.txt`

## Install Channels

- Stable default (broad users): `npx skills add LukasStrickler/agentic-athenaeum`
- Explicit release tag install (advanced):

```bash
npx skills add https://github.com/LukasStrickler/agentic-athenaeum/tree/v1.2.3
```

Use `/tree/<tag>` for pinned installs; `owner/repo#tag` is not supported by the skills CLI.
