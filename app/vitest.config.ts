import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react() as any],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["./**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: [
      "./node_modules/**",
      "./.git/**",
      "./.next/**",
      "./out/**",
      "./dist/**",
      "./build/**",
      "./.storybook/**",
      "./**/*.config.{js,ts}",
      "./**/vitest.setup.ts",
      "./**/*.stories.{js,jsx,ts,tsx}",
      // Visual/playwright tests should be run by Playwright, not Vitest
      "./tests/visual/**",
      "./tests/integration/**/*.integration.test.tsx",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      // Vitest 4: coverage.all and coverage.extensions are removed
      // Use include to specify source files for coverage
      include: ["**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "dist/**",
        "build/**",
        "public/**",
        ".storybook/**",
        "**/*.config.{js,ts}",
        "**/vitest.setup.ts",
        "**/*.stories.{js,jsx,ts,tsx}",
        "**/*.d.ts",
        "**/coverage/**",
        "**/*.spec.{js,jsx,ts,tsx}",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/__mocks__/**",
        "**/types/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
