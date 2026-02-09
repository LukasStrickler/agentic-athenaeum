<div align="center">

# **Agentic Athenaeum** <br> _Eliminating study preparation._

</div>

**An agentic framework that handles extraction, transformation, verification, and cross-referencing so you can focus on understanding, learning, and application.**

## 📖 The Philosophy

Traditional studying forces you to act as a data clerk before you can even begin real learning: formatting notes, scrubbing audio, and manually creating flashcards. **Agentic Athenaeum** removes that preparation burden by design.

This repository orchestrates a suite of AI agents to act as your **Academic Architects**. They ingest raw, messy inputs (unstructured PDFs, mumbled lectures), transform them into standardized knowledge material, and verify output quality in the pipeline. The human role is shifted from _preparation_ to _mastery_.

## 🏗 Architecture & Workflow

The system operates in a linear pipeline designed to transform unstructured chaos into high-fidelity learning assets.

### Phase 1: Ingestion & Sanitation (The Clean-Up)

Before learning begins, data must be normalized.

- **PDF Analysis:**
  - **Visual Logic:** Agents analyze extracted images to classify them as "Content" (diagrams, tables) or "Noise" (footers, decorative logos). Noise is discarded.
  - **OCR & Markdown:** Converts PDF layers into clean Markdown, embedding only the semantic images.

- **Audio Scrubbing:**
  - **Transcription Cleaning:** Agents process lecture audio to remove disfluencies, repetitions, coughing, and filler words, resulting in a grammatically sound text transcript.

### Phase 2: Knowledge Architecture (The Deep Dive)

Agents restructure the cleaned content into a **Standardized Explanation Module** (LaTeX-formatted).

- **Chapter 0 (Prerequisites):** Agents scan the content for jargon and concepts not explicitly defined. They generate a "Chapter 0" containing concise definitions of these prerequisites, ensuring the learner is ready before reading.
- **Standardized Structure:** The content is rewritten into a hierarchical format optimized for learning, not just reading.
- **LaTeX Hyperlinking:** Extensive use of `\ref` and `\label` allows for instant navigation between concepts, definitions, and examples.

### Phase 3: Synthesis (The Summary)

Once the explanation is generated, a second agent layer distills it.

- **Compression:** Generates a summary that is ~5-10% of the explanation's length.
- **Core Logic:** Strips away examples and flowery text, retaining only core principles and logic chains.
- **Visual Filling:** If a concept is abstract and lacks a visual, the system uses **Image Generation Models** to generate coherent diagrams or illustrations that fit the document's style.

### Phase 4: Active Recall (The Anki Generator)

The final output is a deck of advanced, atomic Anki cards.

- **Atomic Cards:** Principles and definitions broken down into single-fact cards.
- **Image Occlusion & Reasoning:** Agents use image editing tools to redact labels or key parts of diagrams, asking the user to identify or reason about the missing piece.
- **Advanced Linguistics:** For language subjects, cards are generated with:
  - Word / Grammar Rule
  - IPA Pronunciation
  - Contextual Example Sentence
  - Audio Synthesis of the example

## ⚡ Key Features

| Feature             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| **Visual Sieve**    | Heuristic analysis to discard "junk" images (logos/footers) and keep "content" images. |
| **Chapter Zero**    | Automatic detection and definition of prerequisite knowledge gaps.                     |
| **Generative Fill** | Uses Image Gen AI to create missing diagrams for abstract concepts.                    |
| **Smart Redaction** | Intelligently edits images to create "Fill in the blank" visual flashcards.            |
| **Audio Polish**    | Turning muddled speech into publication-ready transcripts.                             |

## Install

```bash
npx skills add LukasStrickler/agentic-athenaeum
```

**First-time setup:** See the **[Setup guide](docs/setup-guide.md)** for Node version, environment variables (local or global `.env`, or export), and per-skill requirements (`metadata.env` in each skill’s SKILL.md).

## Updating

- **Latest release:** run the same install command again; the skills CLI will use the latest published release.
- **Pinned version:** install from a ref, e.g. `npx skills add https://github.com/LukasStrickler/agentic-athenaeum/tree/v1.2.3` (`owner/repo#tag` is not supported by the skills CLI).
- **Integrity:** release assets include a checksum file. After downloading a zip, verify with:
  ```bash
  sha256sum -c agentic-athenaeum-v1.2.3-checksums.txt
  ```

End users should use the JavaScript runtime bundle; the TypeScript bundle is for authors who want to inspect or extend source.

## Development

To work on the repo (edit skills, run tests, open a PR), see **[CONTRIBUTING.md](./CONTRIBUTING.md)** and **[docs/dev-setup.md](./docs/dev-setup.md)**.

## Documentation

| Doc                                                              | Description                                                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [**Setup guide**](./docs/setup-guide.md)                         | **End users:** install, Node, env vars (local/global `.env` or export), per-skill `metadata.env` |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                             | How to contribute and submit a PR                                                                |
| [docs/dev-setup.md](./docs/dev-setup.md)                         | Development environment (Node, pnpm, editor) — for contributors                                  |
| [docs/environment-variables.md](./docs/environment-variables.md) | Env reference: precedence, global paths, implementation                                          |
| [docs/bundling.md](./docs/bundling.md)                           | How skill scripts are bundled; `@agentic-athenaeum/contracts` and `@agentic-athenaeum/queries`   |
| [docs/architecture.md](./docs/architecture.md)                   | System architecture                                                                              |
| [docs/workflow.md](./docs/workflow.md)                           | Development workflow                                                                             |
| [docs/release-runbook.md](./docs/release-runbook.md)             | Release process and contributor DX (maintainers)                                                 |
| [AGENTS.md](./AGENTS.md)                                         | Project contract and agent guidance                                                              |

## License

MIT. See [LICENSE](./LICENSE).

---

> _"If you want to teach people a new way of thinking, don't bother trying to teach them. Instead, give them a tool, the use of which will lead to new ways of thinking."_ — R. Buckminster Fuller (c. 1960s–70s)
>
> These skills are the tool. The thinking is yours to do.
