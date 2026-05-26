import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      reportsDirectory: "coverage-report",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});
