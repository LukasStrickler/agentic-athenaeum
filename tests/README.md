# Repository test layout

This directory holds **repository-wide** test locations and shared fixtures. Skill-specific
tests live under `dev/<skill-name>/__tests__/` (see [docs/testing.md](../docs/testing.md)).

## Structure

| Path                      | Purpose                                              | Vitest project |
| ------------------------- | ---------------------------------------------------- | -------------- |
| `tests/unit/**/*.test.ts` | Repo-level unit tests (e.g. shared scripts)          | unit           |
| `tests/e2e/**/*.test.ts`  | Repo-level end-to-end tests                          | e2e            |
| `tests/fixtures/`         | Shared fixture files for skills and regression tests | —              |

- **Unit tests** for packages live in `packages/<pkg>/src/**/*.test.ts`.
- **Skill tests** (unit, integration, e2e) live in `dev/<skill>/__tests__/*.{unit,integration,e2e}.test.ts`.

See [docs/testing.md](../docs/testing.md) for naming rules, how to run tests, and examples.
