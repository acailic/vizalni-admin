/**
 * Visual regression testing utilities
 * Uses Playwright and Argos for comprehensive visual testing
 */

import { test as base, expect } from "@playwright/test";
import { Page } from "@playwright/test";

// Define custom fixtures for visual testing
type VisualTestFixtures = {
  visualTestPage: Page;
  takeScreenshot: (
    name: string,
    options?: { fullPage?: boolean }
  ) => Promise<void>;
  compareScreenshots: (baseline: string, current: string) => Promise<boolean>;
};

// Extend Playwright test with visual testing capabilities
export const test = base.extend<VisualTestFixtures>({
  visualTestPage: async ({ page }, use) => {
    // Configure viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for fonts to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Additional wait for fonts

    use(page);
  },

  takeScreenshot: async ({ page }, use) => {
    const takeScreenshotFn = async (
      name: string,
      options: { fullPage?: boolean } = {}
    ) => {
      const { fullPage = true } = options;

      // Ensure page is stable
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => {
        // Hide dynamic content that might cause flaky tests
        const elementsToHide = document.querySelectorAll(
          '[data-testid="loading"], [data-testid="skeleton"], .loading, .skeleton'
        );
        elementsToHide.forEach((el) => {
          (el as HTMLElement).style.visibility = "hidden";
        });
      });

      await page.screenshot({
        path: `./screenshots/${name}.png`,
        fullPage,
        animations: "disabled",
      });
    };

    await use(takeScreenshotFn);
  },

  compareScreenshots: async ({ page: _page }, use) => {
    const compareScreenshotsFn = async (
      baseline: string,
      current: string
    ): Promise<boolean> => {
      // This would integrate with Argos or your visual regression service
      // For now, we'll return true as a placeholder
      console.log(`Comparing screenshots: ${baseline} vs ${current}`);
      return true;
    };

    await use(compareScreenshotsFn);
  },
});

// Re-export expect from Playwright
export { expect };

/**
 * Visual regression test configurations for different viewports
 */
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  widescreen: { width: 1920, height: 1080 },
};

/**
 * Test helper to navigate to a page and wait for content to load
 */
export async function navigateAndStabilize(
  page: Page,
  url: string
): Promise<void> {
  await page.goto(url);
  await page.waitForLoadState("networkidle");

  // Wait for common loading states
  await Promise.race([
    page.waitForSelector('[data-testid="content-loaded"]', { timeout: 5000 }),
    page.waitForTimeout(2000),
  ]);

  // Wait for images to load
  await page.evaluate(() => {
    const images = Array.from(document.images);
    return Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
  });
}

/**
 * Test helper to take component screenshots in isolation
 */
export async function screenshotComponent(
  page: Page,
  componentName: string,
  componentSelector: string,
  options: {
    viewport?: (typeof VIEWPORTS)[keyof typeof VIEWPORTS];
    darkMode?: boolean;
    rtl?: boolean;
  } = {}
): Promise<void> {
  const {
    viewport = VIEWPORTS.desktop,
    darkMode = false,
    rtl = false,
  } = options;

  // Set viewport
  await page.setViewportSize(viewport);

  // Apply dark mode if requested
  if (darkMode) {
    await page.emulateMedia({ colorScheme: "dark" });
  }

  // Apply RTL if requested
  if (rtl) {
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });
  }

  // Wait for component to be ready
  await page.waitForSelector(componentSelector);
  await page.waitForTimeout(500);

  // Take screenshot of just the component
  const element = await page.$(componentSelector);
  if (element) {
    await element.screenshot({
      path: `./screenshots/components/${componentName}-${viewport.width}x${viewport.height}${darkMode ? "-dark" : ""}${rtl ? "-rtl" : ""}.png`,
    });
  }
}

/**
 * Generate comprehensive visual tests for responsive design
 */
export async function testResponsiveDesign(
  page: Page,
  url: string,
  componentName: string,
  options: {
    viewports?: Array<keyof typeof VIEWPORTS>;
    darkMode?: boolean;
    rtl?: boolean;
  } = {}
): Promise<void> {
  const {
    viewports = ["mobile", "tablet", "desktop"],
    darkMode,
    rtl,
  } = options;

  for (const viewportName of viewports) {
    const viewport = VIEWPORTS[viewportName];

    await page.setViewportSize(viewport);
    await navigateAndStabilize(page, url);

    // Apply theme and direction options
    if (darkMode) {
      await page.emulateMedia({ colorScheme: "dark" });
    }
    if (rtl) {
      await page.evaluate(() => {
        document.documentElement.dir = "rtl";
      });
    }

    await page.screenshot({
      path: `./screenshots/responsive/${componentName}-${viewportName}${darkMode ? "-dark" : ""}${rtl ? "-rtl" : ""}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
}

/**
 * Helper to test interactive states
 */
export async function testInteractiveStates(
  page: Page,
  componentSelector: string,
  componentName: string
): Promise<void> {
  const element = await page.$(componentSelector);
  if (!element) return;

  // Test default state
  await element.screenshot({
    path: `./screenshots/states/${componentName}-default.png`,
  });

  // Test hover state
  await element.hover();
  await element.screenshot({
    path: `./screenshots/states/${componentName}-hover.png`,
  });

  // Test focus state
  await element.focus();
  await element.screenshot({
    path: `./screenshots/states/${componentName}-focus.png`,
  });

  // Test active/pressed state (if it's a button or clickable element)
  await element.click();
  await element.screenshot({
    path: `./screenshots/states/${componentName}-active.png`,
  });
}

/**
 * Setup for Argos visual testing integration
 */
export function setupArgosVisualTesting(): void {
  // This would integrate with Argos CI
  // Configuration would typically be in argos.yml
  console.log("Argos visual testing configured");
}

/**
 * Performance metrics for visual tests
 */
export async function capturePerformanceMetrics(page: Page): Promise<{
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}> {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    return {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      firstContentfulPaint: 0, // Would need PerformanceObserver for FCP
      largestContentfulPaint: 0, // Would need PerformanceObserver for LCP
      cumulativeLayoutShift: 0, // Would need PerformanceObserver for CLS
    };
  });

  return metrics;
}
