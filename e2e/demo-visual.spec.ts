// e2e/demo-visual.spec.ts
import { test, expect } from "@playwright/test";

import {
  BASE_URL,
  getDemoIds,
  waitForChartReady,
} from "./fixtures/demo-fixtures";

// Force consistent viewport for all visual tests
test.use({ viewport: { width: 1280, height: 800 } });

// Generate visual tests for each demo
const demoIds = getDemoIds();

for (const demoId of demoIds) {
  test(`visual: ${demoId} - full page screenshot`, async ({ page }) => {
    // Navigate to demo page
    await page.goto(`${BASE_URL}/demos/${demoId}`);

    // Wait for chart to be ready
    await waitForChartReady(page);

    // Take full page screenshot
    await expect(page).toHaveScreenshot(`demos/${demoId}-desktop.png`, {
      fullPage: true,
      maxDiffPixels: 1000, // Allow small variations
    });
  });
}

// Additional visual tests for demo index page
test.describe("Demo Index Visual", () => {
  test("visual: demos index page", async ({ page }) => {
    await page.goto(`${BASE_URL}/demos`);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("demos/index-desktop.png", {
      fullPage: true,
      maxDiffPixels: 1000,
    });
  });
});
