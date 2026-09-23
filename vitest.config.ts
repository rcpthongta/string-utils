import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
    environment: "node",
    benchmark: {
      include: ["**/*.bench.ts"]
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["**/index.ts", "**/*.spec.ts", "**/*.bench.ts"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      },
      reportsDirectory: "./coverage"
    }
  }
});
