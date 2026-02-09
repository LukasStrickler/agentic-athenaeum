# Release Runbook

**Release workflow vs changelog config:** The release **workflow** (prepare/publish) is in [.github/workflows/release.yml](../.github/workflows/release.yml). The file [.github/release.yml](../.github/release.yml) is GitHub’s **changelog config** for `gh release create --generate-notes` (categories and exclusions), not a workflow.

## Policy (non-negotiable)

- `dev/` is the source of truth.
- `skills/` is generated runtime output.
- Normal contributor PRs must not modify `skills/**`.
- Only release automation PRs (`automation/release-generated-v*`) may update `skills/**`.
- `skills/` stays tracked for release commits; enforcement is done by PR guards (not by ignoring tracked files).

## Contributor DX (daily)

```bash
pnpm install
pnpm run verify
```

`pnpm install` runs `prepare`, which installs the local `pre-commit` guard.

If you need to reinstall hooks manually:

```bash
pnpm run hooks:install
```

Local guard behavior:

- Blocks staged `skills/**` files in normal branches.
- Auto-unstages blocked files and prints a fix message.
- Allows release branch pattern `automation/release-generated-v*`.
- Supports explicit local override: `ALLOW_SKILLS_COMMIT=1 git commit ...`.

Optional local runtime validation:

```bash
pnpm run build:skills
npx skills add "$(pwd)" --all -y
```

If local generated drift appears before opening a normal PR:

```bash
git restore --source origin/main skills
```

## Release flow (manual only)

1. Prepare generated PR:

```bash
gh workflow run release.yml -f mode=prepare -f version=1.2.3
```

2. Prepare mode opens/updates branch `automation/release-generated-v1.2.3` and PRs only `skills/**` changes.

3. Merge `automation/release-generated-v1.2.3`.

4. Publish tag + release assets:

```bash
gh workflow run release.yml -f mode=publish -f version=1.2.3
```

### Do I always need `prepare` first?

- **Recommended:** yes. Run `prepare`, merge the generated PR, then run `publish`.
- **Possible to run `publish` directly:** only if `main` is already perfectly synced (`pnpm run build:skills` produces no `skills/` diff) and tag/release checks pass.
- If `main` is not synced, `publish` fails with the guard telling you to run `prepare` first.

Release PR actor precedence (who opens the PR):

1. `RELEASE_BOT_APP_ID` + `RELEASE_BOT_APP_PRIVATE_KEY` (GitHub App, preferred)
2. `RELEASE_BOT_TOKEN` (fallback token)
3. `github.token` (`github-actions[bot]`)

The PR guard allows `skills/**` only when all are true:

- PR head branch matches `automation/release-generated-v<semver>`
- PR comes from the same repository
- actor is trusted (`github-actions[bot]` plus optional `RELEASE_TRUSTED_ACTORS`)

## Release assets

- `agentic-athenaeum-v<version>-skills-js.zip` (runtime bundle)
- `agentic-athenaeum-v<version>-skills-ts.zip` (authoring/source bundle)
- `agentic-athenaeum-v<version>-checksums.txt` (SHA256 integrity file)

Both bundles contain `SKILL.md` (never `SKILL.dev.md`).

Integrity verification example:

```bash
sha256sum -c agentic-athenaeum-v1.2.3-checksums.txt
```

## Guardrails

- `protect-generated-skills.yml` fails normal PRs touching `skills/**`.
- `verify-generated.yml` runs `pnpm run verify` on relevant PR changes.
- `release.yml` publish mode fails if `skills/` is not in sync with `dev/` on `main`.
- Require `Verify Project` and `Protect Generated Skills` checks in branch protection/rulesets.
- Optional ruleset hardening can restrict `skills/**` updates to release bot bypass actors only.
