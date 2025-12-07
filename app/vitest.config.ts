import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      urql: path.resolve(__dirname, "./graphql/urql-compat.ts"),
      "@urql/core": path.resolve(__dirname, "./graphql/urql-core-compat.ts"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      ".storybook/**",
      "**/*.config.{js,ts}",
      "**/vitest.setup.ts",
      "**/*.stories.{js,jsx,ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
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
