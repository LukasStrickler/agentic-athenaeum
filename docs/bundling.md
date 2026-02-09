# Bundling and workspace packages

How skill scripts are built and how shared packages (`@agentic-athenaeum/contracts`, `@agentic-athenaeum/queries`) are inlined so each output is self-contained.

## Pipeline

| Step        | What happens                                                                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Copy        | `dev/` → `skills/`: non-TS files copied; `SKILL.dev.md` → `SKILL.md`.                                                                               |
| Bundle      | Each `dev/<skill>/scripts/*.ts` is an **esbuild** entry → one `skills/<skill>/scripts/*.js` (CJS, Node).                                            |
| Shared code | Imports from `@agentic-athenaeum/contracts` and `@agentic-athenaeum/queries` are **resolved and inlined**; no runtime dependency on those packages. |

Build script: `scripts/build-skills.mjs`. No plugins; single esbuild config per entry.

## Key options (sanity check)

Aligned with [esbuild API](https://esbuild.github.io/api/):

| Option          | Value                                                                                  | Purpose                                                                                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bundle`        | `true`                                                                                 | Inline all imports ([Bundle](https://esbuild.github.io/api/#bundle)).                                                                                                                     |
| `platform`      | `"node"`                                                                               | Node resolution and output ([Platform](https://esbuild.github.io/api/#platform)).                                                                                                         |
| `packages`      | `"bundle"`                                                                             | With `platform: "node"`, esbuild 0.22+ defaults to externalizing packages; we force bundling so workspace and npm deps are inlined ([Packages](https://esbuild.github.io/api/#packages)). |
| `absWorkingDir` | repo root                                                                              | Resolution and paths from repo root ([Working directory](https://esbuild.github.io/api/#working-directory)).                                                                              |
| `alias`         | `@agentic-athenaeum/contracts` → `packages/contracts/src/index.ts`, same for `queries` | Resolve workspace packages to source so they are bundled ([Alias](https://esbuild.github.io/api/#alias)).                                                                                 |

Workspace: [pnpm workspaces](https://pnpm.io/workspaces) (`pnpm-workspace.yaml` + `packages/*`). Root depends on `@agentic-athenaeum/contracts` and `@agentic-athenaeum/queries` via `workspace:*`. TypeScript uses `tsconfig` `paths` so those packages resolve for typechecking.

## Using shared packages

In any `dev/<skill>/scripts/<action>.ts`:

```ts
import { loadEnv, normalizeInputText } from "@agentic-athenaeum/contracts";
import { studyGuidePrompt } from "@agentic-athenaeum/queries";

loadEnv(); // optional: load local then global .env (see docs/environment-variables.md)
```

Run `pnpm run build:skills`. The generated `.js` contains the inlined code (no runtime dependency on those packages). Run `pnpm run verify` to typecheck, lint, and build.

## Best-practice alignment

| Practice                     | Our setup                                                                                                  | Reference                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Bundle internal packages     | Workspace packages inlined; no runtime `node_modules/@agentic-athenaeum/*`.                                | [esbuild Bundle](https://esbuild.github.io/api/#bundle), monorepo guidance (bundle workspace deps). |
| Node: bundle deps explicitly | `packages: "bundle"` so Node builds don’t externalize by default.                                          | [esbuild Packages](https://esbuild.github.io/api/#packages) (platform node default).                |
| Self-contained outputs       | Single CJS file per action; `node script.js` needs no extra install.                                       | —                                                                                                   |
| Source as package entry      | `main`/`types` → `./src/index.ts`; bundler compiles, no pre-build.                                         | “Internal package” pattern (e.g. Turbo).                                                            |
| Stable import paths          | `@agentic-athenaeum/contracts` / `@agentic-athenaeum/queries` in code; tsconfig paths + build alias match. | [Alias](https://esbuild.github.io/api/#alias).                                                      |

## References

- [esbuild — API](https://esbuild.github.io/api/): Bundle, Platform, Packages, Alias, Working directory.
- [pnpm — Workspaces](https://pnpm.io/workspaces): workspace protocol and layout.
