# Shared test fixtures

Place shared fixture inputs here for use by skill tests and regression tests. For example:

- Sample PDFs or images for transcription/parsing skills
- Minimal Markdown or text files for contract tests
- Expected output snippets for snapshot or assertion tests

Reference fixtures from tests using paths relative to the repository root, e.g.:

```ts
import path from "node:path";

const repoRoot = process.cwd();
const fixturePath = path.join(repoRoot, "tests", "fixtures", "sample.txt");
```

Or use `import.meta.url` for resolution relative to the test file when needed.
