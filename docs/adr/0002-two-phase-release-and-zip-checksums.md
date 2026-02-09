# ADR 0002: Two-phase release and zip + checksums

## Status

Accepted.

## Context

We need a release process that:

- Updates generated `skills/` in a controlled way (no accidental commits in normal PRs).
- Produces installable artifacts (zip archives) with integrity verification (checksums).
- Supports both runtime users (JavaScript bundle) and authors who may want TypeScript (source bundle).

## Decision

**Two-phase release (prepare then publish):**

1. **Prepare:** Maintainer runs `release.yml` with `mode=prepare` and a SemVer version. The workflow builds from `dev/`, updates `skills/`, and opens (or updates) a PR from branch `automation/release-generated-v<version>`. Only that PR may legitimately change `skills/`; CI and pre-commit block `skills/` changes elsewhere.
2. **Publish:** After the prepare PR is merged to `main`, maintainer runs `release.yml` with `mode=publish` and the same version. The workflow verifies `skills/` is in sync with `dev/`, creates the tag, and publishes a GitHub Release with two zip assets plus a checksum file.

**Release assets:**

- **JavaScript bundle** (`agentic-athenaeum-v<version>-skills-js.zip`): Compiled skills (SKILL.md + .js actions) for end users; no extra installs required.
- **TypeScript bundle** (`agentic-athenaeum-v<version>-skills-ts.zip`): Source skills (SKILL.md + .ts from dev/) for authors or custom builds.
- **Checksums** (`agentic-athenaeum-v<version>-checksums.txt`): SHA256 of both zips so users can verify integrity with `sha256sum -c ...`.

## Consequences

- Releases are manual and auditable; no automatic publish on merge.
- Users can install via `npx skills add LukasStrickler/agentic-athenaeum` (defaults to latest) or pin to a tag and verify downloads with the checksum file.
- Optional secret `RELEASE_BOT_TOKEN` and variable `RELEASE_TRUSTED_ACTORS` allow hardening for dedicated release identities.
