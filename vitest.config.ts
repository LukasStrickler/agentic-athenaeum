/**
 * Vitest config: three projects (unit, integration, e2e) so levels can be run separately.
 * - unit: packages and dev __tests__ *.unit.test.ts, tests/unit
 * - integration: dev __tests__ *.integration.test.ts (run built skills/ scripts)
 * - e2e: dev __tests__ *.e2e.test.ts, tests/e2e
 * See docs/testing.md for layout and commands.
 */
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // CI: GitHub Actions reporter for failure annotations in PRs
    reporters:
      process.env.GITHUB_ACTIONS === "true" ? (["default", "github-actions"] as const) : "default",
    projects: [
      {
        test: {
          name: "unit",
          include: [
            "packages/**/*.test.ts",
            "dev/**/__tests__/**/*.unit.test.ts",
            "tests/unit/**/*.test.ts",
          ],
          environment: "node",
        },
      },
      {
        test: {
          name: "integration",
          include: ["dev/**/__tests__/**/*.integration.test.ts"],
          environment: "node",
        },
      },
      {
        test: {
          name: "e2e",
          include: ["dev/**/__tests__/**/*.e2e.test.ts", "tests/e2e/**/*.test.ts"],
          environment: "node",
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html"],
      include: ["packages/**/src/**/*.ts", "dev/**/scripts/**/*.ts"],
      exclude: ["**/*.test.ts", "**/__tests__/**", "**/node_modules/**"],
    },
  },
});
