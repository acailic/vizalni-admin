import { defineConfig, devices } from "@playwright/test";

/**
 * Fast E2E configuration for local headed testing
 * - Single browser instance reused
 * - Auth state persisted
 * - Heavy resources blocked
 * - Minimal reporters
 */
export default defineConfig({
  testDir: "./e2e",

  // Faster timeouts
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },

  // Single worker for shared context
  fullyParallel: false,
  workers: 1,

  // No retries for speed
  retries: 0,

  // Skip slow reporters
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-fast-report" }],
  ],

  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",

    // Disable artifacts for speed
    trace: "off",
    screenshot: "off",
    video: "off",

    // Faster actions
    actionTimeout: 5000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: "chromium-fast",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--disable-extensions",
            "--disable-plugins",
            "--disable-background-networking",
            "--no-first-run",
          ],
        },
      },
    },
  ],

  // Output folder
  outputDir: "e2e-screenshots-fast/",
});
