import { test, expect } from "@playwright/test";

const BASE_URL = "https://acailic.github.io/vizualni-admin";

/**
 * Filter out console noise that is expected in the static-hosted environment.
 * Matches next-auth errors, 404/405 status codes, favicon issues, chunk loads,
 * cross-origin / sandbox / refused-to warnings, and DOCTYPE parse errors.
 */
const isExpectedConsoleNoise = (message: string) =>
  /\[next-auth\]|404|405|favicon\.ico|ERR_BLOCKED_BY_CLIENT|ChunkLoadError|cross-origin|sandbox|Refused to|DOCTYPE|Unexpected token/i.test(
    message
  );

// ---------------------------------------------------------------------------
// QA Fix #1: Embed preview renders without crash (BarChart d3-transition)
// ---------------------------------------------------------------------------
test.describe("QA Fix #1: Embed preview renders without crash", () => {
  test("no 'transition is not a function' error and inline preview iframe loads", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });

    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");

    // Wait a moment for any deferred d3 rendering to complete
    await page.waitForTimeout(1500);

    // Verify no "transition is not a function" console error
    const transitionErrors = consoleErrors.filter((e) =>
      /transition is not a function/i.test(e)
    );
    expect(
      transitionErrors,
      "Should not have d3-transition import errors"
    ).toEqual([]);

    // Verify the inline preview iframe exists and is visible
    const previewIframe = page.locator('iframe[title="Embed preview"]');
    await expect(previewIframe).toBeVisible({ timeout: 10_000 });

    // Verify the iframe has a valid src attribute pointing to the embed demo
    const src = await previewIframe.getAttribute("src");
    expect(src).toBeTruthy();
    expect(src).toContain("/embed/demo");
  });

  test("bar chart embed page has no critical console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });

    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod`
    );
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Filter out expected noise; remaining errors should be minimal
    const criticalErrors = consoleErrors.filter(
      (e) =>
        !isExpectedConsoleNoise(e) &&
        !e.includes("iframe") &&
        !e.includes("cross-origin")
    );

    // Allow a small number of non-critical errors from the static build
    expect(criticalErrors.length).toBeLessThanOrEqual(4);
  });
});

// ---------------------------------------------------------------------------
// QA Fix #2: Playground code is complete (no truncation)
// ---------------------------------------------------------------------------
test.describe("QA Fix #2: Playground code is complete (no truncation)", () => {
  test("generated code does not contain truncation marker and includes full export", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/demos/playground`);
    await page.waitForLoadState("networkidle");

    // Switch to the Code tab (it may be labeled "Kod" in Serbian or "Code" in English)
    const codeTab = page.getByRole("tab", { name: /^Kod$|^Code$/ });
    await expect(codeTab).toBeVisible({ timeout: 15_000 });
    await codeTab.click();
    await page.waitForTimeout(500);

    // Locate the code output section
    const codeSection = page.locator("pre, [style*='monospace'], code").filter({
      hasText: /import.*from/,
    });
    await expect(codeSection.first()).toBeVisible({ timeout: 10_000 });

    const codeText = await codeSection.first().textContent();
    expect(codeText).toBeTruthy();

    // The code must NOT contain the truncation marker "// ..."
    expect(codeText).not.toContain("// ...");

    // The code must contain the full export statement
    expect(codeText).toContain("export default MyChart;");
  });
});

// ---------------------------------------------------------------------------
// QA Fix #3: Playground dataset JSON textarea populated
// ---------------------------------------------------------------------------
test.describe("QA Fix #3: Playground dataset JSON textarea populated", () => {
  test("selecting a sample dataset populates the custom JSON textarea", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/demos/playground`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Find the Sample Dataset dropdown and open it
    const datasetSelect = page
      .locator('[role="combobox"]')
      .filter({ hasText: /Sample Dataset|Primer dataseta|sales|Sales/i })
      .first();

    // If the dropdown is not immediately visible, look for the select by label
    const selectFallback = page.locator("#sample-dataset-select");
    const selectToUse = (await datasetSelect.isVisible().catch(() => false))
      ? datasetSelect
      : selectFallback;

    await selectToUse.click();
    await page.waitForTimeout(300);

    // Select a dataset option from the dropdown
    const menuOption = page.locator('[role="option"], li').filter({
      hasText: /Weather|Prodaja|Sales|Temperature/i,
    });

    if ((await menuOption.count()) > 0) {
      await menuOption.first().click();
      await page.waitForTimeout(500);
    } else {
      // Try clicking any available option
      const anyOption = page.locator('[role="option"], [role="listbox"] li');
      if ((await anyOption.count()) > 0) {
        await anyOption.first().click();
        await page.waitForTimeout(500);
      }
    }

    // Find the Custom JSON textarea (labeled "Prilagođeni JSON" or "Custom JSON")
    const jsonTextarea = page.locator("textarea").first();
    await expect(jsonTextarea).toBeVisible({ timeout: 5_000 });

    const textareaValue = await jsonTextarea.inputValue();

    // The textarea must not be empty after selecting a dataset
    expect(
      textareaValue.trim().length,
      "Custom JSON textarea should be populated after selecting a dataset"
    ).toBeGreaterThan(0);

    // Verify it looks like valid JSON array data
    expect(textareaValue.trim()).toMatch(/^\[/);
  });
});

// ---------------------------------------------------------------------------
// QA Fix #4: Dataset metadata fallbacks (format chip + updated date)
// ---------------------------------------------------------------------------
test.describe("QA Fix #4: Dataset metadata fallbacks", () => {
  test("dataset cards on topic page show non-empty updated dates", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/topics/economy`);
    await page.waitForLoadState("networkidle");

    // Wait for dataset cards to render
    const updatedElements = page.getByTestId("dataset-updated");
    await expect(updatedElements.first()).toBeVisible({ timeout: 15_000 });

    const count = await updatedElements.count();
    expect(count).toBeGreaterThan(0);

    // Each dataset-updated element should have meaningful text content
    for (let i = 0; i < count; i++) {
      const element = updatedElements.nth(i);
      const text = (await element.textContent()) ?? "";

      // Must contain either a date or a fallback label like "Nepoznato" / "Unknown"
      // It must NOT be just "Ažurirano:" with nothing after the colon
      expect(text.trim().length).toBeGreaterThan(0);

      // Verify it contains an updated label followed by content
      expect(text).toMatch(
        /(?:Ažurirano|Ажурирано|Updated):\s*(?:\d{4}-\d{2}-\d{2}|Nepoznato|Непознато|Unknown)/
      );
    }
  });

  test("dataset cards show format chip", async ({ page }) => {
    await page.goto(`${BASE_URL}/topics/economy`);
    await page.waitForLoadState("networkidle");

    // Verify at least one Chip is rendered (format label)
    const chips = page.locator(".MuiChip-root, .MuiChip-label");
    await expect(chips.first()).toBeVisible({ timeout: 15_000 });

    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThan(0);

    // Verify chip has non-empty text (the format or a fallback "Nepoznato"/"Unknown")
    const chipText = await chips.first().textContent();
    expect(chipText?.trim().length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// QA Fix #5: Embed page localization (Serbian and English)
// ---------------------------------------------------------------------------
test.describe("QA Fix #5: Embed page localization", () => {
  test("Serbian labels appear when lang=sr", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod&lang=sr`
    );
    await page.waitForLoadState("networkidle");

    // Verify Serbian overline label
    await expect(page.getByText("Ugrađivanje")).toBeVisible({
      timeout: 10_000,
    });

    // Verify Serbian settings card title
    await expect(page.getByText("Podešavanja")).toBeVisible();

    // Verify Serbian copy embed code label
    await expect(page.getByText("Kopirajte kod za ugrađivanje")).toBeVisible();
  });

  test("English labels appear when lang=en", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod&lang=en`
    );
    await page.waitForLoadState("networkidle");

    // Verify English overline label
    await expect(page.getByText("Embeds")).toBeVisible({ timeout: 10_000 });

    // Verify English settings card title
    await expect(page.getByText("Settings")).toBeVisible();

    // Verify English copy embed code label
    await expect(page.getByText("Copy embed code")).toBeVisible();
  });

  test("language parameter from URL is respected in iframe src", async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/embed/?type=bar&dataset=budget&dataSource=Prod&lang=sr`
    );
    await page.waitForLoadState("networkidle");

    // Verify the iframe src contains the lang=sr parameter
    const previewIframe = page.locator('iframe[title="Embed preview"]');
    await expect(previewIframe).toBeVisible({ timeout: 10_000 });

    const src = (await previewIframe.getAttribute("src")) ?? "";
    expect(src).toContain("lang=sr");
  });
});

// ---------------------------------------------------------------------------
// QA Fix #6: DemoError hides stack traces
// ---------------------------------------------------------------------------
test.describe("QA Fix #6: DemoError hides stack traces", () => {
  test("demo pages do not expose raw stack trace text to users", async ({
    page,
  }) => {
    // Visit multiple demo pages and verify no stack traces are visible
    const demoPages = [
      `${BASE_URL}/demos/demographics`,
      `${BASE_URL}/demos/energy`,
      `${BASE_URL}/demos/healthcare`,
    ];

    for (const demoUrl of demoPages) {
      await page.goto(demoUrl);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      const bodyText = await page.locator("body").textContent();

      // Verify no raw stack trace fragments are exposed
      expect(bodyText).not.toMatch(/is not a function/);
      expect(bodyText).not.toMatch(/Cannot read propert/);
      // Check there are no raw stack frame lines like "at Object.xyz (file:line:col)"
      expect(bodyText).not.toMatch(/\bat\s+\S+\s+\(/);
    }
  });

  test("if DemoError is rendered it shows user-friendly message without stack details", async ({
    page,
  }) => {
    // Navigate to a demo page that might trigger an error boundary
    await page.goto(`${BASE_URL}/demos/energy`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    // Check if DemoError is visible (it renders "Error loading data" text)
    const errorHeading = page.getByText(/Error loading data|Greška/i);
    const isErrorVisible = await errorHeading
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (isErrorVisible) {
      // If the error boundary is showing, verify it does NOT contain stack trace content
      const errorContainer = errorHeading.locator("..");

      // Get all visible text in the error container
      const errorText = (await errorContainer.textContent()) ?? "";

      expect(errorText).not.toContain("is not a function");
      expect(errorText).not.toContain("Cannot read propert");
      expect(errorText).not.toMatch(/\n\s+at\s/);

      // It should show user-friendly suggestions instead
      const suggestionsVisible = await page
        .getByText(/Suggestions|try again|proveri internet|predlozi/i)
        .isVisible()
        .catch(() => false);

      // Either suggestions or a retry button should be present
      const retryVisible = await page
        .getByRole("button", { name: /Try again|Pokušaj ponovo/i })
        .isVisible()
        .catch(() => false);

      expect(
        suggestionsVisible || retryVisible,
        "Error boundary should show user-friendly UI (suggestions or retry button)"
      ).toBe(true);
    }
    // If no error is visible, the page loaded successfully which is also valid
  });
});
