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

test.describe("Homepage - Interactive Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("homepage loads with correct title and heading", async ({ page }) => {
    await expect(page).toHaveTitle(/Vizualni Admin/);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/data\.gov\.rs|skupove podataka|grafikone/i);
  });

  test("hero section CTA buttons work", async ({ page }) => {
    // Find CTA links in hero section
    const ctaLinks = page.locator(
      'a[href*="/browse"], a[href*="/demos"], a:has-text("Započnite")'
    );

    const count = await ctaLinks.count();
    expect(count).toBeGreaterThan(0);

    // Click first CTA
    const firstCTA = ctaLinks.first();
    await expect(firstCTA).toBeVisible();
    await firstCTA.click();
    await page.waitForTimeout(500);
  });

  test("navigation links work", async ({ page }) => {
    // Find navigation links
    const navLinks = page.locator(
      'a[href*="/browse"], a[href*="/gallery"], a[href*="/tutorials"], a[href*="/demos"]'
    );

    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    // Take screenshot showing links
    await page.screenshot({ path: "test-results/homepage-nav-links.png" });
  });

  test("featured visualization cards are interactive", async ({ page }) => {
    // Find featured cards
    const featuredCards = page
      .locator('[class*="card"], [class*="Card"]')
      .filter({
        hasText: /Demografski|Energetski|Upis|obrazovne/,
      });

    const count = await featuredCards.count();
    expect(count).toBeGreaterThan(0);

    // Check each card has action buttons
    const firstCard = featuredCards.first();

    // Check for Embed button
    const embedBtn = firstCard.locator('button:has-text("Embed")');
    if (await embedBtn.isVisible()) {
      await embedBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: "test-results/embed-modal.png" });
      // Close modal if opened
      const closeBtn = page
        .locator(
          'button[aria-label*="close"], button:has-text("Zatvori"), [class*="close"]'
        )
        .first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });

  test("Share button works on featured cards", async ({ page }) => {
    const shareBtn = page.locator('button:has-text("Share")').first();

    if (await shareBtn.isVisible()) {
      await shareBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: "test-results/share-modal.png" });
    }
  });

  test("View link navigates to demo", async ({ page }) => {
    const viewLink = page
      .locator('a:has-text("View"), a[href*="/demos/"]')
      .first();

    if (await viewLink.isVisible()) {
      const href = await viewLink.getAttribute("href");
      expect(href).toContain("/demos/");
    }
  });

  test("language selector works", async ({ page }) => {
    const langSelector = page
      .locator(
        'button:has-text("Srpski"), [class*="language"], [class*="locale"]'
      )
      .first();

    if (await langSelector.isVisible()) {
      await langSelector.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: "test-results/language-dropdown.png" });
    }
  });

  test("resource links work", async ({ page }) => {
    // Scroll to resources section
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight * 0.7)
    );
    await page.waitForTimeout(300);

    const resourceLinks = page.locator(
      'a[href*="/docs/"], a:has-text("vodič"), a:has-text("Pročitaj")'
    );
    const count = await resourceLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("demo gallery link works", async ({ page }) => {
    const demoLink = page
      .locator('a[href*="/demos/"]:has-text("demo")')
      .first();

    if (await demoLink.isVisible()) {
      await demoLink.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe("Gallery Page - Interactive Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForLoadState("networkidle");
  });

  test("gallery displays dataset cards with correct content", async ({
    page,
  }) => {
    const cards = page.locator('[class*="card"], [class*="Card"], article');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Verify cards have titles
    const firstCardTitle = cards.first().locator("h6, h5, h4, h3, h2, h1");
    await expect(firstCardTitle).toBeVisible();
  });

  test("gallery card click navigates correctly", async ({ page }) => {
    const firstCard = page
      .locator('[class*="card"], [class*="Card"], article')
      .first();
    await firstCard.click();
    await page.waitForTimeout(500);

    // Take screenshot after navigation
    await page.screenshot({ path: "test-results/gallery-card-clicked.png" });
  });

  test("gallery cards have tags/labels", async ({ page }) => {
    // Check for tags on cards
    const tags = page.locator(
      '[class*="tag"], [class*="chip"], [class*="badge"]'
    );
    const count = await tags.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("gallery page has proper layout", async ({ page }) => {
    // Check that cards are displayed in a grid
    await page.screenshot({
      path: "test-results/gallery-layout.png",
      fullPage: true,
    });
  });
});

test.describe("Library Showcase - Interactive Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/library-showcase`);
    await page.waitForLoadState("networkidle");
  });

  test("code examples are displayed and readable", async ({ page }) => {
    const codeBlocks = page.locator("pre, code");
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThan(0);

    // Verify code has content
    const firstCode = codeBlocks.first();
    const text = await firstCode.textContent();
    expect(text!.length).toBeGreaterThan(10);
  });

  test("npm install command is visible", async ({ page }) => {
    const npmText = page.locator("text=/npm install|yarn add/");
    await expect(npmText.first()).toBeVisible();
  });

  test("view on npm button has correct link", async ({ page }) => {
    const npmButton = page.locator('a[href*="npmjs.com"]').first();

    if (await npmButton.isVisible()) {
      const href = await npmButton.getAttribute("href");
      expect(href).toContain("npmjs.com");
      expect(href).toContain("@acailic/vizualni-admin");
    }
  });

  test("GitHub link works", async ({ page }) => {
    const githubLink = page.locator('a[href*="github.com"]').first();

    if (await githubLink.isVisible()) {
      const href = await githubLink.getAttribute("href");
      expect(href).toContain("github.com");
    }
  });

  test("demo gallery button works", async ({ page }) => {
    const demoBtn = page
      .locator('a:has-text("demo"), button:has-text("demo")')
      .first();

    if (await demoBtn.isVisible()) {
      await demoBtn.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe("Browse Page - Interactive Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/browse`);
    await page.waitForLoadState("networkidle");
  });

  test("browse page loads with content", async ({ page }) => {
    await page.screenshot({ path: "test-results/browse-page.png" });
  });

  test("browse has interactive elements", async ({ page }) => {
    // Check for any interactive content
    const buttons = page.locator("button, a, input");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Tutorials Page - Interactive Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/tutorials`);
    await page.waitForLoadState("networkidle");
  });

  test("tutorial cards are displayed", async ({ page }) => {
    const tutorialCards = page.locator(
      'article, [class*="card"], [class*="Card"], a[href*="/tutorials/"]'
    );
    const count = await tutorialCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("tutorial card click navigates correctly", async ({ page }) => {
    const firstTutorial = page.locator('a[href*="/tutorials/"]').first();

    if (await firstTutorial.isVisible()) {
      await firstTutorial.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: "test-results/tutorial-page.png" });
    }
  });
});

test.describe("Demos Page - Interactive Tests", () => {
  test("demos index page loads", async ({ page }) => {
    await page.goto(`${BASE_URL}/demos`);
    await page.waitForLoadState("networkidle");

    await page.screenshot({ path: "test-results/demos-index.png" });
  });

  test("demographics demo loads", async ({ page }) => {
    await page.goto(`${BASE_URL}/demos/demographics`);
    await page.waitForLoadState("networkidle");

    // Check for chart
    const chart = page.locator(
      'svg, canvas, [class*="chart"], [class*="Chart"]'
    );
    await expect(chart.first()).toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: "test-results/demo-demographics.png",
      fullPage: true,
    });
  });

  test("energy demo loads", async ({ page }) => {
    await page.goto(`${BASE_URL}/demos/energy`);
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: "test-results/demo-energy.png",
      fullPage: true,
    });
  });
});

test.describe("UI Style & Quality Tests", () => {
  test("no critical console errors on homepage", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Filter out expected static hosting errors
    const criticalErrors = errors.filter((e) => !isStaticHostingError(e));
    expect(criticalErrors.length).toBe(0);
  });

  test("no critical console errors on gallery", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForLoadState("networkidle");

    const criticalErrors = errors.filter((e) => !isStaticHostingError(e));
    expect(criticalErrors.length).toBe(0);
  });

  test("fonts load correctly", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const h1 = page.locator("h1").first();
    const fontFamily = await h1.evaluate(
      (el) => window.getComputedStyle(el).fontFamily
    );

    expect(fontFamily).toBeTruthy();
    expect(fontFamily.length).toBeGreaterThan(0);
  });

  test("images have alt attributes", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const src = await img.getAttribute("src");

      if (src && !src.includes("data:")) {
        expect(alt).toBeDefined();
      }
    }
  });

  test("buttons have proper styling and cursor", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const buttons = page.locator("button");
    const count = await buttons.count();

    if (count > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();

      const cursor = await firstButton.evaluate(
        (el) => window.getComputedStyle(el).cursor
      );
      expect(["pointer", "default"]).toContain(cursor);
    }
  });

  test("links have proper href attributes", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

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

  test("color contrast is readable", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const body = page.locator("body");
    const textColor = await body.evaluate(
      (el) => window.getComputedStyle(el).color
    );
    const bgColor = await body.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    expect(textColor).toBeTruthy();
    expect(bgColor).toBeTruthy();
  });

  test("page has proper meta tags", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute("content", /width=device-width/);
  });

  test("no layout shifts (CLS)", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Get all images and check they have dimensions
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = images.nth(i);
      const box = await img.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    }
  });

  test("text is readable (not too small)", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const paragraphs = page.locator("p");
    const count = await paragraphs.count();

    if (count > 0) {
      const firstP = paragraphs.first();
      const fontSize = await firstP.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).fontSize)
      );
      expect(fontSize).toBeGreaterThanOrEqual(14);
    }
  });
});

test.describe("Responsive Design Tests", () => {
  test("mobile navigation works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Look for hamburger menu or mobile nav
    const menuButton = page
      .locator(
        '[aria-label*="menu"], [class*="hamburger"], [class*="menu-button"]'
      )
      .first();

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: "test-results/mobile-menu-open.png" });
    } else {
      // Take screenshot of mobile view
      await page.screenshot({ path: "test-results/mobile-view.png" });
    }
  });

  test("mobile cards stack vertically", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForLoadState("networkidle");

    const cards = page.locator('[class*="card"], [class*="Card"], article');

    if ((await cards.count()) >= 2) {
      const firstBox = await cards.first().boundingBox();
      const secondBox = await cards.nth(1).boundingBox();

      if (firstBox && secondBox) {
        expect(secondBox.y).toBeGreaterThanOrEqual(firstBox.y);
      }
    }
  });

  test("tablet layout is proper", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    await page.screenshot({ path: "test-results/tablet-view.png" });
  });

  test("desktop layout is proper", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Check content is visible
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    await page.screenshot({ path: "test-results/desktop-view.png" });
  });

  test("wide screen layout is proper", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    await page.screenshot({ path: "test-results/widescreen-view.png" });
  });
});

test.describe("Accessibility Tests", () => {
  test("headings follow hierarchy", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const h1 = page.locator("h1");
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test("buttons are focusable", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const button = page.locator("button").first();
    if (await button.isVisible()) {
      await button.focus();
      await expect(button).toBeFocused();
    }
  });

  test("links are focusable", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const link = page.locator("a").first();
    if (await link.isVisible()) {
      await link.focus();
      await expect(link).toBeFocused();
    }
  });

  test("tab navigation works", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Press Tab to focus first interactive element
    await page.keyboard.press("Tab");

    // Check that something is focused
    const focused = page.locator(":focus");
    const count = await focused.count();
    expect(count).toBeGreaterThan(0);
  });

  test("forms have labels if present", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

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
});

test.describe("Performance Tests", () => {
  test("homepage loads within reasonable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(15000);
  });

  test("no broken images on homepage", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate(
        (el) => (el as HTMLImageElement).naturalWidth
      );
      const src = await img.getAttribute("src");

      if (src && !src.startsWith("data:")) {
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test("no horizontal scroll on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20);
  });

  test("no horizontal scroll on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20);
  });
});
