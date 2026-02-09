# ADR 0003: Environment variables and setup guide

## Status

Accepted.

## Context

Skill actions need configuration (e.g. API keys) for both contributors (dev/tests) and end users who install via `npx skills add`. We need:

- A single, predictable way to supply env vars that works for local development, CI, and 3rd-party users without requiring extra tools (e.g. dotenv-cli) or agent-specific configuration.
- A fallback when no project-local `.env` exists (e.g. users who prefer one shared config across projects).
- Clear documentation so users know where to put vars and so each skill declares what it requires.
- A clear split between documentation for **end users** (install, env, per-skill requirements) and **contributors** (dev environment, tests, build).

## Decision

### Environment loading

- A shared **`loadEnv()`** in `@agentic-athenaeum/contracts` is called at the start of each skill action (bundled into every `skills/<skill>/scripts/*.js`). It optionally loads `.env` from:
  1. **Local:** current working directory (`./.env`) — project or repo root.
  2. **Global:** a platform-standard config directory — `~/.config/agentic-athenaeum/.env` (macOS/Linux, or `$XDG_CONFIG_HOME/agentic-athenaeum/.env`) and `%APPDATA%\agentic-athenaeum\.env` (Windows).
- Order: local is loaded first, then global. Existing `process.env` is **never** overwritten (Node `process.loadEnvFile` semantics; same as Twelve-Factor).
- Implementation uses Node’s built-in `process.loadEnvFile(path)` when available (Node 22.6+); missing files are ignored (try/catch). No runtime dependency on dotenv.
- `.env` and `.env.local` are in `.gitignore`; `.env.example` is committed with placeholder keys only.

### Per-skill documentation

- Environment variable requirements are declared in **frontmatter under the
  standard `metadata` field**, not in the skill body. The
  [Agent Skills / SKILL.md specification](https://agentskills.io/specification)
  defines `metadata` as an optional map for additional properties; we use
  **`metadata.env`** in `SKILL.dev.md` (and thus in generated `SKILL.md`). Each
  entry has `name`, `required` (boolean), and `description`. Empty list means
  the skill needs no env vars. Example:

  ```yaml
  metadata:
    env:
      - name: OPENAI_API_KEY
        required: true
        description: API key for OpenAI.
      - name: API_BASE_URL
        required: false
        description: Optional override for API base URL.
  ```

  **Why metadata:** Machine-readable for agents and tooling; consistent schema. Aligns with the skill standard (metadata is the documented extension point). Where to set vars is documented once in the Setup guide. The build may optionally render an “Environment variables” section from `metadata.env`; the canonical contract is the frontmatter.

### User-facing vs contributor documentation

- **Setup guide** (`docs/setup-guide.md`): for **end users** — prerequisites (Node), install (`npx skills add`), the three ways to provide env (local `.env`, global `.env`, export), per-skill requirements (point to each skill’s SKILL.md), and optional telemetry opt-out. Linked from README Install and from the documentation table as the primary entry for “how to use after install”.
- **Development setup** (`docs/dev-setup.md`): for **contributors** — Node, pnpm, repo clone, verify, editor, and troubleshooting. Explicitly states that end users should use the Setup guide instead.
- **Environment variables** (`docs/environment-variables.md`): reference for precedence and implementation; linked from setup guide and AGENTS.md.

## Consequences

- Contributors put a `.env` at repo root for tests; 3rd-party users put `.env` at project root or use the global file or export. One mental model: “env wins, then local .env, then global .env.”
- Skills that need API keys or other config declare them in **metadata.env**; tooling and users read the same structure in every skill.
- New skills must include **metadata.env** in frontmatter (use `metadata.env: []` when the skill needs no variables).
- Release assets and install flow are unchanged; the loader is part of the bundled action code. No extra end-user install steps for .env support.
