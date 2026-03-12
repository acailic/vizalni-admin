import { setup } from "./common";

const { test, describe, expect } = setup();

describe("Demo gallery navigation", () => {
  test("can open showcase from demos index", async ({ page, screen }) => {
    await page.goto("/demos");
    await screen.findByText(/Demo|Galerija|Visualization/i);

    const cta = await screen.findByText(/showcase/i);
    await cta.click();

    await screen.findByText(/Demo Showcase|Showcase/i);
    expect(page.url()).toContain("/demos/showcase");
  });

  test("can open demographics demo and see charts", async ({
    page,
    screen,
  }) => {
    await page.goto("/demos");
    await screen.findByText(/Demograf/i);
    await screen.getByText(/Demograf/i).click();

    // Verify page loads and contains SVG charts
    const svgs = page.locator("svg");
    await expect(svgs.first()).toBeVisible();
  });
});

describe("Demo charts interactions", () => {
  test("showcase charts render and respond to hover", async ({ page }) => {
    await page.goto("/demos/showcase");
    const firstChart = page.locator("svg").first();
    await firstChart.waitFor({ state: "visible" });
    await firstChart.hover();
    await expect(firstChart).toBeVisible();
  });

  test("responsive layout works on mobile viewport", async ({
    page,
    screen,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demos/showcase");
    await screen.findByText(/Demo Showcase/);
    await expect(page.locator("body")).toBeVisible();
  });
});

describe("Performance and stability", () => {
  test("demos load within reasonable time and without console errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        // Filter out known deprecation warnings that are expected
        if (!text.includes("legacyBehavior")) {
          errors.push(text);
        }
      }
    });

    await page.goto("/demos");
    await page.waitForLoadState("networkidle");
    const nav = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      return entry ? entry.duration : 0;
    });

    expect(nav).toBeLessThan(6000);
    expect(errors).toHaveLength(0);
  });
});
