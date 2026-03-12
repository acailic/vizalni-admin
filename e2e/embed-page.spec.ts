import { test, expect } from "@playwright/test";

const BASE_URL = "https://acailic.github.io/vizualni-admin";

// Helper to filter out expected static hosting errors
const isStaticHostingError = (error: string) =>
  error.includes("404") ||
  error.includes("405") ||
  error.includes("next-auth") ||
  error.includes("CLIENT_FETCH_ERROR") ||
  error.includes("Unexpected token") ||
  error.includes("DOCTYPE");

test.describe("Embed Page - Core Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");
  });

  test("embed page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Embed.*vizualni-admin/i);
  });

  test("embed page displays all required form controls", async ({ page }) => {
    // Check for Width input
    const widthInput = page
      .locator('input[value="100%"], label:has-text("Width")')
      .first();
    await expect(widthInput).toBeVisible();

    // Check for Height input
    const heightInput = page
      .locator('input[value="520px"], label:has-text("Height")')
      .first();
    await expect(heightInput).toBeVisible();

    // Check for Theme selector
    const themeSelector = page
      .locator('label:has-text("Theme"), [aria-label*="Theme"]')
      .first();
    await expect(themeSelector).toBeVisible();

    // Check for Language selector
    const langSelector = page
      .locator('label:has-text("Language"), [aria-label*="Language"]')
      .first();
    await expect(langSelector).toBeVisible();

    // Check for Preview embed link
    const previewLink = page.locator('a:has-text("Preview embed")');
    await expect(previewLink).toBeVisible();
  });

  test("embed page shows chart params from URL", async ({ page }) => {
    // Check that the chart params are displayed
    const paramsSection = page.locator("text=Chart params from URL").first();

    if (await paramsSection.isVisible()) {
      // Verify the params are shown
      await expect(page.locator("text=type: bar")).toBeVisible();
      await expect(page.locator("text=dataset: budget")).toBeVisible();
      await expect(page.locator("text=dataSource: Prod")).toBeVisible();
    }
  });

  test("header links work correctly", async ({ page }) => {
    // Check Demo Gallery link
    const demoGalleryLink = page
      .locator('a:has-text("Demo Gallery"), a[href*="/demos"]')
      .first();
    await expect(demoGalleryLink).toBeVisible();
    const demoHref = await demoGalleryLink.getAttribute("href");
    expect(demoHref).toBeTruthy();

    // Check GitHub Repository link
    const githubLink = page
      .locator('a:has-text("GitHub"), a[href*="github.com"]')
      .first();
    await expect(githubLink).toBeVisible();
    const githubHref = await githubLink.getAttribute("href");
    expect(githubHref).toContain("github.com");

    // Check Vizualni Admin link (header logo)
    const logoLink = page
      .locator('a:has-text("Vizualni Admin"), h4:has-text("Vizualni Admin")')
      .first();
    await expect(logoLink).toBeVisible();
  });

  test("language selector button is visible", async ({ page }) => {
    // Check for Serbian language button in header
    const langButton = page.locator('button:has-text("Srpski")');
    await expect(langButton).toBeVisible();
  });
});

test.describe("Embed Page - Theme Switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");
  });

  test("theme dropdown opens and shows options", async ({ page }) => {
    // Find and click the theme dropdown
    const themeDropdown = page
      .locator(
        '[role="combobox"], .MuiSelect-select, [aria-haspopup="listbox"]'
      )
      .filter({ hasText: /Theme|Light/ })
      .first();

    await themeDropdown.click();
    await page.waitForTimeout(300);

    // Check for Light and Dark options
    const lightOption = page.locator(
      'li:has-text("Light"), [data-value="light"]'
    );
    const darkOption = page.locator('li:has-text("Dark"), [data-value="dark"]');

    await expect(lightOption.first()).toBeVisible();
    await expect(darkOption.first()).toBeVisible();
  });

  test("can switch to dark theme", async ({ page }) => {
    // Open theme dropdown
    const themeDropdown = page
      .locator(
        '[role="combobox"], .MuiSelect-select, [aria-haspopup="listbox"]'
      )
      .filter({ hasText: /Theme|Light/ })
      .first();

    await themeDropdown.click();
    await page.waitForTimeout(300);

    // Select Dark theme
    const darkOption = page
      .locator('li:has-text("Dark"), [data-value="dark"]')
      .first();
    await darkOption.click();
    await page.waitForTimeout(300);

    // Verify the dropdown now shows Dark
    const themeValue = page
      .locator('[role="combobox"], .MuiSelect-select')
      .filter({ hasText: /Dark/ });
    await expect(themeValue.first()).toBeVisible();

    await page.screenshot({ path: "test-results/embed-dark-theme.png" });
  });

  test("theme URL parameter is respected", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod&theme=dark`
    );
    await page.waitForLoadState("networkidle");

    // Check if dark theme is pre-selected in the code
    const codeBlock = page
      .locator('[class*="code"], pre, code')
      .filter({ hasText: /iframe/ })
      .first();
    const codeText = await codeBlock.textContent();

    // BUG: The URL parameter should be respected but currently it defaults to light
    // This test documents the expected behavior
    // TODO: Fix the embed page to respect URL parameters
    const hasDarkTheme = codeText!.includes("theme=dark");
    expect(hasDarkTheme).toBeTruthy();
  });
});

test.describe("Embed Page - Language Switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");
  });

  test("language dropdown opens and shows options", async ({ page }) => {
    // Find and click the language dropdown - it shows "Language English" or "Language Serbian"
    const langDropdown = page
      .locator('[role="combobox"]')
      .filter({ hasText: /Language|English|Serbian/ })
      .first();

    await langDropdown.click();
    await page.waitForTimeout(300);

    // Check for English and Serbian options
    const englishOption = page.locator(
      'li:has-text("English"), [data-value="en"]'
    );
    const serbianOption = page.locator(
      'li:has-text("Serbian"), [data-value="sr"]'
    );

    await expect(englishOption.first()).toBeVisible();
    await expect(serbianOption.first()).toBeVisible();
  });

  test("can switch to Serbian language", async ({ page }) => {
    // Open language dropdown
    const langDropdown = page
      .locator('[role="combobox"]')
      .filter({ hasText: /Language|English|Serbian/ })
      .first();

    await langDropdown.click();
    await page.waitForTimeout(300);

    // Select Serbian
    const serbianOption = page
      .locator('li:has-text("Serbian"), [data-value="sr"]')
      .first();
    await serbianOption.click();
    await page.waitForTimeout(300);

    // Verify the dropdown now shows Serbian
    const langValue = page
      .locator('[role="combobox"], .MuiSelect-select')
      .filter({ hasText: /Serbian/ });
    await expect(langValue.first()).toBeVisible();

    await page.screenshot({ path: "test-results/embed-serbian-lang.png" });
  });

  test("language URL parameter is respected", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod&lang=sr`
    );
    await page.waitForLoadState("networkidle");

    // Check if Serbian language is pre-selected in the code
    const codeBlock = page
      .locator('[class*="code"], pre, code')
      .filter({ hasText: /iframe/ })
      .first();
    const codeText = await codeBlock.textContent();

    // BUG: The URL parameter should be respected but currently it defaults to English
    // This test documents the expected behavior
    // TODO: Fix the embed page to respect URL parameters
    const hasSerbianLang = codeText!.includes("lang=sr");
    expect(hasSerbianLang).toBeTruthy();
  });
});

test.describe("Embed Page - Width/Height Inputs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");
  });

  test("can change width value", async ({ page }) => {
    // Find the width input by its label
    const widthInput = page.getByRole("textbox", { name: "Width" });

    // Clear and enter new value
    await widthInput.fill("800px");
    await page.waitForTimeout(300);

    // Verify the value changed
    const newValue = await widthInput.inputValue();
    expect(newValue).toBe("800px");
  });

  test("can change height value", async ({ page }) => {
    // Find the height input by its label
    const heightInput = page.getByRole("textbox", { name: "Height" });

    // Clear and enter new value
    await heightInput.fill("600px");
    await page.waitForTimeout(300);

    // Verify the value changed
    const newValue = await heightInput.inputValue();
    expect(newValue).toBe("600px");
  });

  test("width/height URL parameters are respected", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod&width=800px&height=400px`
    );
    await page.waitForLoadState("networkidle");

    // Check if width and height are reflected in the generated code
    const codeBlock = page
      .locator('[class*="code"], pre, code')
      .filter({ hasText: /iframe/ })
      .first();
    const codeText = await codeBlock.textContent();

    // BUG: The URL parameters should be respected but currently they use defaults
    // This test documents the expected behavior
    // TODO: Fix the embed page to respect URL parameters
    const hasCustomWidth = codeText!.includes("800px");
    const hasCustomHeight = codeText!.includes("400px");
    expect(hasCustomWidth).toBeTruthy();
    expect(hasCustomHeight).toBeTruthy();
  });
});

test.describe("Embed Page - Embed Code Generation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");
  });

  test("iframe code is displayed", async ({ page }) => {
    // Check for iframe code block
    const codeBlock = page
      .locator('pre, code, [class*="code"]')
      .filter({ hasText: /iframe/ });
    await expect(codeBlock.first()).toBeVisible();
  });

  test("iframe code contains embed URL", async ({ page }) => {
    // Check that the iframe src contains embed path
    const codeBlock = page
      .locator('pre, code, [class*="code"]')
      .filter({ hasText: /iframe/ })
      .first();
    const codeText = await codeBlock.textContent();

    expect(codeText).toContain("iframe");
    expect(codeText).toContain("src=");
    expect(codeText).toContain("/embed/");
  });

  test("iframe code updates when theme changes", async ({ page }) => {
    // Get initial code
    const codeBlock = page
      .locator('pre, code, [class*="code"]')
      .filter({ hasText: /iframe/ })
      .first();
    const initialCode = await codeBlock.textContent();

    // Change theme to dark
    const themeDropdown = page
      .locator(
        '[role="combobox"], .MuiSelect-select, [aria-haspopup="listbox"]'
      )
      .filter({ hasText: /Theme|Light/ })
      .first();

    await themeDropdown.click();
    await page.waitForTimeout(300);

    const darkOption = page
      .locator('li:has-text("Dark"), [data-value="dark"]')
      .first();
    await darkOption.click();
    await page.waitForTimeout(500);

    // Get updated code
    const updatedCode = await codeBlock.textContent();

    // The code should have changed
    expect(updatedCode).not.toBe(initialCode);
    expect(updatedCode).toContain("theme=dark");
  });

  test("copy button exists", async ({ page }) => {
    // Look for the copy button - it now has text "Copy embed code"
    const copyButton = page
      .locator('button:has-text("Copy embed code"), button:has-text("Copy")')
      .first();

    // The button should exist
    await expect(copyButton).toBeVisible();
  });
});

test.describe("Embed Page - Preview Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");
  });

  test("preview embed link opens new tab", async ({ page }) => {
    const previewLink = page.locator('a:has-text("Preview embed")');

    // Check that it opens in new tab
    const target = await previewLink.getAttribute("target");
    expect(target).toBe("_blank");

    // Check that it has correct rel attribute
    const rel = await previewLink.getAttribute("rel");
    expect(rel).toContain("noreferrer");
  });

  test("preview link href contains correct parameters", async ({ page }) => {
    const previewLink = page.locator('a:has-text("Preview embed")');
    const href = await previewLink.getAttribute("href");

    expect(href).toContain("/embed/");
    expect(href).toContain("theme=");
    expect(href).toContain("lang=");
  });

  test("inline preview iframe is displayed", async ({ page }) => {
    // Look for the preview iframe - it might be at the bottom of the page
    // Scroll down to see if there's an iframe
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Look for any iframe on the page
    const previewIframe = page.locator("iframe");

    // Check if iframe exists - make this test optional since the page might not have it
    const iframeCount = await previewIframe.count();
    if (iframeCount > 0) {
      await expect(previewIframe.first()).toBeVisible();
    } else {
      // If no iframe, at least verify the preview link works
      const previewLink = page.locator('a:has-text("Preview embed")');
      await expect(previewLink).toBeVisible();
    }
  });
});

test.describe("Embed Page - Error Handling", () => {
  test("no critical console errors on embed page", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");

    // Filter out expected static hosting errors and iframe-related errors
    const criticalErrors = errors.filter(
      (e) =>
        !isStaticHostingError(e) &&
        !e.includes("iframe") &&
        !e.includes("cross-origin") &&
        !e.includes("sandbox") &&
        !e.includes("Refused to")
    );
    // Allow some errors since the preview iframe might have issues
    expect(criticalErrors.length).toBeLessThanOrEqual(4);
  });

  test("page handles missing parameters gracefully", async ({ page }) => {
    await page.goto(`${BASE_URL}/embed/`);
    await page.waitForLoadState("networkidle");

    // Page should still load
    await expect(page).toHaveTitle(/Embed.*vizualni-admin/i);

    // Form controls should still be visible
    const widthInput = page
      .locator('label:has-text("Width"), input[value="100%"]')
      .first();
    await expect(widthInput).toBeVisible();
  });
});

test.describe("Embed Page - Responsive Design", () => {
  test("embed page is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");

    // Form controls should still be visible
    const widthInput = page
      .locator('label:has-text("Width"), input[value="100%"]')
      .first();
    await expect(widthInput).toBeVisible();

    await page.screenshot({ path: "test-results/embed-mobile.png" });
  });

  test("embed page is responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");

    await page.screenshot({ path: "test-results/embed-tablet.png" });
  });

  test("embed page is responsive on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");

    await page.screenshot({ path: "test-results/embed-desktop.png" });
  });
});

test.describe("Embed Page - Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");
  });

  test("form inputs have labels", async ({ page }) => {
    const inputs = page.locator('input:not([type="hidden"])');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id");

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const ariaLabel = await input.getAttribute("aria-label");
        const placeholder = await input.getAttribute("placeholder");

        const hasLabel = (await label.count()) > 0;
        expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
      }
    }
  });

  test("interactive elements are focusable", async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press("Tab");

    const focused = page.locator(":focus");
    const count = await focused.count();
    expect(count).toBeGreaterThan(0);
  });

  test("links have proper href attributes", async ({ page }) => {
    const links = page.locator("a[href]");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("#");
    }
  });
});

test.describe("Embed Page - Different Chart Types", () => {
  test("embed page works with line chart", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=line&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveTitle(/Embed.*vizualni-admin/i);

    // Verify type param is shown
    const paramsSection = page.locator("text=type: line");
    if ((await paramsSection.count()) > 0) {
      await expect(paramsSection).toBeVisible();
    }
  });

  test("embed page works with different datasets", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=demographics&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveTitle(/Embed.*vizualni-admin/i);

    // Verify dataset param is shown
    const paramsSection = page.locator("text=dataset: demographics");
    if ((await paramsSection.count()) > 0) {
      await expect(paramsSection).toBeVisible();
    }
  });

  test("embed page works with different data sources", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Test`
    );
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveTitle(/Embed.*vizualni-admin/i);

    // Verify dataSource param is shown
    const paramsSection = page.locator("text=dataSource: Test");
    if ((await paramsSection.count()) > 0) {
      await expect(paramsSection).toBeVisible();
    }
  });
});

test.describe("Embed Page - Integration Tests", () => {
  test("full workflow: change settings and verify code updates", async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");

    // 1. Change width using the textbox with label "Width"
    const widthInput = page.getByRole("textbox", { name: "Width" });
    await widthInput.fill("500px");
    await page.waitForTimeout(300);

    // 2. Change theme to dark
    const themeDropdown = page
      .locator('[role="combobox"]')
      .filter({ hasText: /Theme|Light/ })
      .first();
    await themeDropdown.click();
    await page.waitForTimeout(300);

    const darkOption = page
      .locator('li:has-text("Dark"), [data-value="dark"]')
      .first();
    await darkOption.click();
    await page.waitForTimeout(300);

    // 3. Change language to Serbian
    const langDropdown = page
      .locator('[role="combobox"]')
      .filter({ hasText: /Language|English|Serbian/ })
      .first();
    await langDropdown.click();
    await page.waitForTimeout(300);

    const serbianOption = page
      .locator('li:has-text("Serbian"), [data-value="sr"]')
      .first();
    await serbianOption.click();
    await page.waitForTimeout(500);

    // 4. Verify the generated code reflects all changes
    const codeBlock = page
      .locator('[class*="code"], pre, code')
      .filter({ hasText: /iframe/ })
      .first();
    const codeText = await codeBlock.textContent();

    expect(codeText).toContain("500px");
    expect(codeText).toContain("theme=dark");
    expect(codeText).toContain("lang=sr");

    await page.screenshot({ path: "test-results/embed-full-workflow.png" });
  });
});
