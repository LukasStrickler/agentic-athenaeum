# Architecture

## Design Philosophy

**Eliminating the friction of study preparation.**

Traditional studying forces you to act as a data clerk before real learning starts: formatting notes, scrubbing audio, and manually creating flashcards. Agentic Athenaeum removes this preparation burden.

This repository orchestrates AI agents as **Academic Architects** that:

1. Ingest raw, messy inputs (PDFs, lectures, notes)
2. Transform them into standardized knowledge infrastructure
3. Generate optimized study materials (flashcards, summaries, guides)

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Agentic Athenaeum                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Ingestion  │─▶│ Architecture│─▶│  Synthesis  │         │
│  │  (Clean)    │  │  (Structure)│  │  (Output)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Processing Phases

### Phase 1: Ingestion & Sanitation

**Input:** Raw PDFs, audio, images
**Output:** Clean, normalized content

- **PDF Analysis:** OCR, image classification (content vs noise)
- **Audio Scrubbing:** Remove disfluencies, normalize transcripts
- **Image Processing:** Extract diagrams, discard decorative elements

### Phase 2: Knowledge Architecture

**Input:** Clean content
**Output:** Structured learning modules

- **Prerequisite Detection:** Generate "Chapter 0" for undefined concepts
- **Hierarchical Structure:** Rewrite for learning, not reading
- **Cross-References:** Link related concepts

### Phase 3: Synthesis

**Input:** Structured modules
**Output:** Study materials

- **Summaries:** 5-10% compression, core logic only
- **Visual Generation:** AI-generated diagrams for abstract concepts
- **Flashcards:** Atomic Anki cards with image occlusion

## Skill Architecture

### Skill = Atomic Capability

Each skill provides one focused capability:

```text
skill/
├── SKILL.md          # Definition + metadata
├── scripts/          # Action entrypoints
│   └── action.js     # Bundled, self-contained
└── references/       # Output format docs
```

### Action = Single Function

Actions are:

- **Self-contained:** All dependencies bundled
- **Deterministic:** Same input → same output
- **CLI-friendly:** `node action.js <args>`

### Bundling Strategy

```
┌────────────────┐     ┌────────────────┐
│  action.ts     │     │  action.js     │
│  + imports     │ ──▶ │  (bundled)     │
│  + node_modules│     │  (no deps)     │
└────────────────┘     └────────────────┘
```

Uses esbuild to:

1. Bundle all npm dependencies
2. Tree-shake unused code
3. Output single .js file
4. Leave Node built-ins external

## Data Flow

```
User Input          Skill Processing         Output
───────────         ────────────────         ──────

PDF file     ──▶    pdf-dissection    ──▶    Markdown
Audio file   ──▶    transcription     ──▶    Clean text
Notes        ──▶    study-guide       ──▶    LaTeX/MD
Content      ──▶    anki-generator    ──▶    .apkg deck
```

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Language     | TypeScript (source) → JavaScript (dist) |
| Bundler      | esbuild                                 |
| Runtime      | Node.js >= 22.6.0                       |
| Distribution | skills.sh / npx skills add              |
| CI/CD        | GitHub Actions                          |

## Architecture decisions

Design choices are documented as ADRs in [docs/adr/](adr/) (see [index](adr/README.md)):

- [0001: dev/ as source of truth, skills/ as generated output](adr/0001-dev-as-source-skills-as-generated.md)
- [0002: Two-phase release and zip + checksums](adr/0002-two-phase-release-and-zip-checksums.md)

## Extension Points

### Adding a New Skill

1. Create `dev/<skill-name>/`
2. Write `SKILL.dev.md` with frontmatter (include **metadata.env** for required/optional environment variables; see [AGENTS.md](../AGENTS.md) SKILL.md rules).
3. Implement action scripts in TypeScript (call `loadEnv()` from `@agentic-athenaeum/contracts` at startup so local/global `.env` is loaded).
4. Add reference documentation
5. Run `pnpm run verify`
6. Commit source changes only in normal PRs

### Shared Code

Use packages for cross-skill logic:

- `packages/contracts/` - TypeScript types
- `packages/queries/` - Prompt templates

### Future Capabilities

- **Image Generation:** Nano Banana / Stable Diffusion
- **Vision Analysis:** GPT-4o / Gemini for image classification
- **Audio Processing:** Whisper for transcription
