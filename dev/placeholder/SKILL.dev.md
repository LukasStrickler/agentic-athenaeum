---
name: placeholder
description: Placeholder skill for repository structure demonstration. Does nothing - replace with actual skills.
version: 0.0.1
compatibility:
  node: ">=22.6.0"
metadata:
  env: []
actions:
  - name: echo
    script: scripts/echo.js
    description: Echo input back as output (demonstration only)
references:
  - references/REFERENCE.md
---

# Placeholder Skill

This is a placeholder skill that demonstrates the repository structure. It does nothing useful and should be replaced with actual educational skills.

## Purpose

- Validates build pipeline works correctly
- Demonstrates skill directory structure
- Provides template for new skill creation

## Usage

```bash
# This skill is for demonstration only
node skills/placeholder/scripts/echo.js "Hello, World!"
```

## Structure

```text
placeholder/
├── SKILL.dev.md      # This file (source)
├── scripts/
│   └── echo.ts       # Action script (TypeScript source)
└── references/
    └── REFERENCE.md  # Output format reference
```

## Next Steps

Replace this placeholder with actual educational skills:

- `study-guide-markdown` - Generate Markdown study guides
- `transcription-to-notes` - Convert transcriptions to structured notes
- `anki-card-sync` - Sync flashcards with Anki
- `pdf-dissection` - Extract study content from PDFs
