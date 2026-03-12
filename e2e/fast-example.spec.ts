/**
 * Example test using shared context fixture for fast headed testing
 *
 * Run with: yarn e2e:fast e2e/fast-example.spec.ts
 * Watch mode: yarn e2e:watch e2e/fast-example.spec.ts
 */
import { setup, BASE_URL, clearAuthState } from "./fixtures/shared-context";

const { test, expect, describe } = setup();

describe("Fast E2E Example", () => {
  test("homepage loads quickly with shared context", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Vizualni/);
  });

  test("navigation works", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const links = page.locator("a[href]");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  // Example of clearing auth state for fresh login tests
  describe("with fresh auth", () => {
    test.beforeEach(() => {
      clearAuthState();
    });

    test("works without auth", async ({ page }) => {
      await page.goto(BASE_URL);
      await expect(page.locator("body")).toBeVisible();
    });
  });
});
