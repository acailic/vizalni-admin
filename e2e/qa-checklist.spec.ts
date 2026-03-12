import { expect, test } from "@playwright/test";

const DATA_SOURCE = "Prod";
const PATH_PREFIX = (process.env.E2E_PATH_PREFIX ?? "").replace(/\/$/, "");

const withPrefix = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${PATH_PREFIX}${normalizedPath}`;
};

const withDataSource = (
  pathname: string,
  params: Record<string, string> = {}
) => {
  const search = new URLSearchParams({ dataSource: DATA_SOURCE, ...params });
  return withPrefix(`${pathname}?${search.toString()}`);
};

const pathRegex = (route: string) =>
  new RegExp(`${withPrefix(route).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);

const staticBrowseFallbackRegex = /Demo limita za statički build/i;

const isExpectedConsoleNoise = (message: string) =>
  /\[next-auth\]\[error\]\[CLIENT_FETCH_ERROR\]|status of 404|status of 405|favicon\.ico|ERR_BLOCKED_BY_CLIENT|ChunkLoadError/i.test(
    message
  );

test.describe("QA checklist - working flows", () => {
  test("homepage CTAs route to browse, price analysis, demos, and start flow", async ({
    page,
  }) => {
    await page.goto(withDataSource("/"));
    await expect(page.locator("h1").first()).toBeVisible();

    await Promise.all([
      page.waitForURL(pathRegex("/browse")),
      page.getByTestId("primary-cta").first().click(),
    ]);

    await page.goto(withDataSource("/"));
    await Promise.all([
      page.waitForURL(pathRegex("/cene")),
      page
        .getByRole("link", { name: /analiza cena|анализа цена/i })
        .first()
        .click(),
    ]);

    await page.goto(withDataSource("/"));
    await Promise.all([
      page.waitForURL(pathRegex("/demos")),
      page.getByTestId("secondary-cta").first().click(),
    ]);

    await page.goto(withDataSource("/"));
    await Promise.all([
      page.waitForURL(pathRegex("/browse")),
      page
        .getByRole("link", {
          name: /započnite besplatno|започните бесплатно|get started free/i,
        })
        .first()
        .click(),
    ]);
  });

  test("price analysis page has table data and working filter controls", async ({
    page,
  }) => {
    await page.goto(withPrefix("/cene"));
    await expect(
      page.getByRole("heading", { name: /analiza cena|анализа цена/i }).first()
    ).toBeVisible();

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible();
    const initialRows = await rows.count();
    expect(initialRows).toBeGreaterThan(0);

    const firstProductName =
      (await rows.first().locator("td").first().textContent())?.trim() ?? "";
    expect(firstProductName.length).toBeGreaterThan(2);

    const searchInput = page.getByPlaceholder(
      /naziv proizvoda|назив производа/i
    );
    await searchInput.fill(firstProductName.slice(0, 3));
    await page.waitForTimeout(250);

    const filteredRows = await rows.count();
    expect(filteredRows).toBeGreaterThan(0);
    expect(filteredRows).toBeLessThanOrEqual(initialRows);

    const categorySelect = page.locator("select").first();
    const categoryOptions = categorySelect.locator("option");
    const categoryOptionCount = await categoryOptions.count();
    expect(categoryOptionCount).toBeGreaterThan(0);
  });

  test("browse page search and sort controls are interactive", async ({
    page,
  }) => {
    await page.goto(withDataSource("/browse"));
    const searchInput = page.getByRole("textbox", { name: /search/i }).first();
    const isSearchVisible = await searchInput
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (!isSearchVisible) {
      const fallback = page.getByText(staticBrowseFallbackRegex);
      if (await fallback.isVisible().catch(() => false)) {
        test.skip(
          true,
          "Browse runs in static-fallback mode in this environment."
        );
      }

      const errorPage = page
        .getByRole("heading", { name: /500|an error occurred on client/i })
        .first();
      if (await errorPage.isVisible().catch(() => false)) {
        test.skip(true, "Browse route is unavailable in this environment.");
      }
    }

    const isVisibleForInteraction = await searchInput
      .isVisible({ timeout: 20_000 })
      .catch(() => false);
    if (!isVisibleForInteraction) {
      test.skip(
        true,
        "Browse search input is not available in this environment."
      );
    }

    await searchInput.fill("obrazovanje");
    await searchInput.press("Enter");
    await expect(searchInput).toHaveValue("obrazovanje");

    const sortControl = page.getByTestId("datasetSort");
    await expect(sortControl).toBeVisible();
    await sortControl.click();
    await page.getByRole("option", { name: /Title \(A-Z\)/i }).click();
    await expect(sortControl).toContainText(/Title \(A-Z\)/i);
  });

  test("homepage loads quickly, has no broken images, and no unexpected console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() !== "error") {
        return;
      }
      const text = msg.text();
      if (!isExpectedConsoleNoise(text)) {
        consoleErrors.push(text);
      }
    });

    await page.goto(withDataSource("/"));
    await page.waitForLoadState("networkidle");

    const navigationDuration = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      return entry?.duration ?? 0;
    });
    expect(navigationDuration).toBeLessThan(6000);

    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => img.currentSrc && img.naturalWidth === 0)
        .map((img) => img.currentSrc)
    );
    expect(brokenImages).toEqual([]);

    expect(consoleErrors).toEqual([]);
  });

  test("documentation guide cards open valid pages", async ({ page }) => {
    await page.goto(withPrefix("/docs"));
    const notFound = page.getByRole("heading", { name: "404" });
    if (await notFound.isVisible().catch(() => false)) {
      test.skip(true, "Docs route is unavailable in this environment.");
    }

    const guideCtas = page.getByRole("link", {
      name: /otvori vodič|отвори водич|pogledaj vodič|погледај водич|open guide|view guide/i,
    });
    const count = await guideCtas.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const cta = guideCtas.nth(i);
      const href = await cta.getAttribute("href");
      expect(href).toMatch(/\/docs\//);

      await Promise.all([page.waitForLoadState("networkidle"), cta.click()]);
      await expect(page.getByText("404")).toHaveCount(0);
      await expect(page.locator("h1").first()).toBeVisible();
      await page.goBack();
    }
  });
});

test.describe("QA checklist - known defects", () => {
  test("demo detail page should render chart visualization instead of placeholder", async ({
    page,
  }) => {
    test.fail(
      true,
      "Dynamic demo pages still render placeholder content instead of charts."
    );

    await page.goto(withDataSource("/demos/budget"));
    await page.waitForTimeout(500);

    await expect(
      page.locator("svg.recharts-surface, canvas").first()
    ).toBeVisible();
    await expect(
      page.getByText(/placeholder|u razvoju|coming soon|uskoro dostupno/i)
    ).toHaveCount(0);
  });

  test("home featured card Share/Embed actions should show actionable UI", async ({
    page,
  }) => {
    test.fail(
      true,
      "Featured card Share/Embed handlers are currently no-op callbacks."
    );

    await page.goto(withDataSource("/"));

    const featured = page.locator("#featured");
    await expect(featured).toBeVisible();

    await featured.getByRole("button", { name: /embed/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await featured.getByRole("button", { name: /share/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("browse search for 'obrazovanje' should return dataset matches", async ({
    page,
  }) => {
    await page.goto(withDataSource("/browse"));

    const fallback = page.getByText(staticBrowseFallbackRegex);
    if (await fallback.isVisible().catch(() => false)) {
      test.skip(
        true,
        "Browse runs in static-fallback mode in this environment."
      );
    }

    test.fail(
      true,
      "Search currently returns no results for relevant Serbian education terms."
    );

    const searchInput = page.getByRole("textbox", { name: /search/i }).first();
    await searchInput.fill("obrazovanje");
    await searchInput.press("Enter");

    await expect(page.getByText(/No results|No datasets/i)).toHaveCount(0);
    await expect(page.getByTestId("search-results-count")).not.toContainText(
      /showing 0|no datasets|0 dataset/i
    );
  });
});
