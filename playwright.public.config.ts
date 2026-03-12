import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.E2E_BASE_URL;
const localPort = Number(process.env.E2E_PORT || 3100);
const baseURL = externalBaseURL || `http://localhost:${localPort}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: /public-pages\.live\.spec\.ts/,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: process.env.CI
    ? [["blob"], ["html", { open: "never" }]]
    : [["list"], ["html"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    extraHTTPHeaders: {
      "x-vercel-skip-toolbar": "1",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: `NEXT_TELEMETRY_DISABLED=1 npx next dev ./app -p ${localPort}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180 * 1000,
        stdout: "pipe",
        stderr: "pipe",
      },
});
