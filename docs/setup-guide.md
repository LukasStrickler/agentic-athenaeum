# Setup guide (end users)

This guide is for **people who install and use** these skills (e.g. via `npx skills add LukasStrickler/agentic-athenaeum`). If you are **contributing to the repo** (editing skills, running tests), see [Development setup](dev-setup.md) instead.

**Quick links:** [Prerequisites](#prerequisites) · [Install](#install) · [Environment variables](#environment-variables) · [Per-skill requirements](#per-skill-requirements)

---

## Prerequisites

| Requirement | Version   | Check            |
| ----------- | --------- | ---------------- |
| Node.js     | >= 22.6.0 | `node --version` |

Your AI agent (Cursor, Windsurf, Claude Code, etc.) must be able to run `node` and execute the skill scripts. No other runtime install is required; skills are distributed as bundled JavaScript.

---

## Install

```bash
npx skills add LukasStrickler/agentic-athenaeum
```

- **Latest release:** run the same command again to update.
- **Pinned version:** install from a tag, e.g.  
  `npx skills add https://github.com/LukasStrickler/agentic-athenaeum/tree/v1.2.3`.
  (Use `/tree/<tag>` syntax; `owner/repo#tag` is not supported by the skills CLI.)

After install, your agent will see the skills and can invoke them. Configure any [environment variables](#environment-variables) your skills need (many skills use API keys or similar). Each skill lists what it requires in **metadata.env** in its SKILL.md.

---

## Environment variables

Many skills need configuration (e.g. API keys). You can provide it in one of three ways. **Existing environment variables always win** over files.

### 1. Local `.env` (project-specific)

Put a `.env` file in the **current working directory** where you (or your agent) run from—usually your **project root**.

- Create `.env` in that directory.
- Add lines like `VARIABLE_NAME=value` (no spaces around `=`).
- Do not commit `.env` if it contains secrets.

Skills load this file automatically when they run.

### 2. Global `.env` (one place for all projects)

Use a single `.env` in a standard config directory so all projects can use the same keys without a `.env` in each repo.

| Platform          | Create this directory         | Then add a file `.env` inside it   |
| ----------------- | ----------------------------- | ---------------------------------- |
| **macOS / Linux** | `~/.config/agentic-athenaeum` | `~/.config/agentic-athenaeum/.env` |
| **Windows**       | `%APPDATA%\agentic-athenaeum` | `%APPDATA%\agentic-athenaeum\.env` |

**macOS / Linux:**

```bash
mkdir -p ~/.config/agentic-athenaeum
# Edit ~/.config/agentic-athenaeum/.env and add your variables
```

**Windows (PowerShell):**

```powershell
New-Item -ItemType Directory -Force $env:APPDATA\agentic-athenaeum
# Create %APPDATA%\agentic-athenaeum\.env and add your variables
```

If a variable is not set in your project’s local `.env`, the skill will fall back to this global file.

### 3. Export in shell or set in agent config

Set variables in your shell (e.g. `export OPENAI_API_KEY=sk-...`) or in your agent’s environment/IDE settings. These take precedence over any `.env` file.

---

## Per-skill requirements

Each skill declares which environment variables it needs in its **frontmatter** under **metadata.env** (the standard metadata field in SKILL.md):

- **Required** — The skill will fail or warn if these are missing. Set them in a local `.env`, the global `.env`, or export them.
- **Optional** — Used when present (e.g. for optional features or overrides).

After install, open the skill’s **SKILL.md** and check **metadata.env** in the YAML frontmatter. Each entry has `name`, `required`, and `description`. Empty `metadata.env: []` means the skill needs no variables.

**Example:** If a skill says it requires `OPENAI_API_KEY`, add to your project’s `.env` or global `.env`:

```bash
OPENAI_API_KEY=sk-your-key-here
```

Or export it before starting your agent:

```bash
export OPENAI_API_KEY=sk-your-key-here
```

---

## Optional: disable telemetry

The skills CLI may collect anonymous telemetry. To opt out:

```bash
export DISABLE_TELEMETRY=1
```

(Or add `DISABLE_TELEMETRY=1` to your `.env`.)

---

## More detail

- **Env precedence and implementation:** [Environment variables](environment-variables.md).
- **Contributing / development:** [Development setup](dev-setup.md) and [CONTRIBUTING.md](../CONTRIBUTING.md).
