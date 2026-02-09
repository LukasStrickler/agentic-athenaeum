# Environment variables (reference)

How skill actions load configuration. **To set variables:** use a local `.env`
(project root), a global `.env` (see
[Setup guide](setup-guide.md#environment-variables)), or export them — see the
[Setup guide](setup-guide.md). Which vars each skill needs are in
**metadata.env** in its SKILL.md
([per-skill requirements](setup-guide.md#per-skill-requirements)).
Contributors: `.env` at repo root is documented in
[Development setup](dev-setup.md).

---

## Precedence

1. **Highest:** Variables already in the environment (shell, CI, agent). Never overwritten by files.
2. **Then:** Local `.env` in the current working directory (e.g. project or repo root).
3. **Then:** Global `.env` in a platform config directory (see Setup guide for paths and how to create).
4. **Lowest:** Defaults in code (if any).

Local overrides global; environment overrides both. Node’s loader does not overwrite existing `process.env`.

---

## Implementation

- **`@agentic-athenaeum/contracts`** exports `loadEnv()` and `getGlobalEnvPath()`. Each skill action calls `loadEnv()` at startup; it is bundled into `skills/<skill>/scripts/*.js`.
- Uses Node’s **`process.loadEnvFile(path)`** (Node 22.6+) when available; missing files are ignored. On older Node, `loadEnv()` is a no-op.
- **Global path:** Windows: `%APPDATA%\agentic-athenaeum\.env`. macOS/Linux: `~/.config/agentic-athenaeum/.env` (or `$XDG_CONFIG_HOME/agentic-athenaeum/.env`).

---

## Security

- `.env` and `.env.local` are in `.gitignore`. Commit only `.env.example` with placeholder keys.

---

## References

- [Node.js — process.loadEnvFile](https://nodejs.org/api/process.html#processloadenvfilepath)
- [XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
- [Twelve-Factor — Config](https://12factor.net/config)
