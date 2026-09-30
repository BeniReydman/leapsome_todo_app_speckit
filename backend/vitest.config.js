import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.js"],
      thresholds: { lines: 70, functions: 70, statements: 70, branches: 70 },
    },
  },
});
