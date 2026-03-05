import { expect, Page, test } from "@playwright/test";

const DATA_SOURCE = "Prod";
const PATH_PREFIX = (process.env.E2E_PATH_PREFIX ?? "").replace(/\/$/, "");

const withPrefix = (path: string) => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

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

const expectInternalHomeTarget = async (page: Page) => {
  const homeLink = page.getByTestId("nav-home").first();
  await expect(homeLink).toBeVisible();

  const href = (await homeLink.getAttribute("href")) ?? "";
  expect(href).not.toContain("acailic.github.io");
  expect(href).not.toContain("data.gov.rs");
};

const expectNoEmptyRoleButtons = async (page: Page) => {
  const emptyButtons = await page
    .locator('[role="button"]')
    .evaluateAll((nodes) => {
      return nodes
        .filter((node) => {
          const el = node as HTMLElement;
          const style = window.getComputedStyle(el);
          const visible =
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            el.getClientRects().length > 0;

          if (!visible) {
            return false;
          }

          const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
          const ariaLabel = el.getAttribute("aria-label")?.trim() ?? "";
          const labelledBy = el.getAttribute("aria-labelledby")?.trim() ?? "";
          const title = el.getAttribute("title")?.trim() ?? "";

          return !text && !ariaLabel && !labelledBy && !title;
        })
        .map((node) => (node as HTMLElement).outerHTML.slice(0, 180));
    });

  expect(
    emptyButtons,
    `Found visible role=button controls without accessible text/label: ${emptyButtons.join("\n")}`
  ).toEqual([]);
};

test.describe("Public pages E2E", () => {
  test("home page has fixed CTAs/links and no docs dead links", async ({
    page,
  }) => {
    await page.goto(withDataSource("/"));

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Analiza cena" })
    ).toBeVisible();

    const galleryCta = page
      .getByRole("link", { name: /Otvori galeriju|Open gallery/i })
      .first();
    await expect(galleryCta).toHaveAttribute("href", /\/demos/);
    await expect(page.getByTestId("nav-home").first()).not.toContainText(
      "data.gov.rs"
    );
    await expect(page.locator('a[href*="/docs"]')).toHaveCount(0);
    await expect(page.locator('a[href*="/tutorials"]')).toHaveCount(0);
  });

  test("browse page keeps single search control and no empty filter buttons", async ({
    page,
  }) => {
    await page.goto(withDataSource("/browse"));

    await expect(page.getByText("Runtime Error")).toHaveCount(0);
    await expect(
      page.getByRole("textbox", { name: /Search/i }).first()
    ).toBeVisible({
      timeout: 20_000,
    });
    await expectNoEmptyRoleButtons(page);
  });

  test("demos index has valid interactive markup and no placeholder section", async ({
    page,
  }) => {
    await page.goto(withDataSource("/demos"));

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("a button, button a")).toHaveCount(0);
    await expect(page.getByText(/coming soon/i)).toHaveCount(0);
  });

  test("showcase has clean back navigation and actionable featured cards", async ({
    page,
  }) => {
    await page.goto(withDataSource("/demos/showcase"));

    const backLink = page
      .getByRole("link", { name: /Back to demo gallery|Nazad|Povratak/i })
      .first();
    await expect(backLink).toBeVisible();

    const backLinkText = await backLink.innerText();
    expect(backLinkText).not.toMatch(/←\s*←/);

    const actionControls = page.locator(
      'a:has-text("Otvori stranicu"), a:has-text("Open page"), button:has-text("Otvori stranicu"), button:has-text("Open page")'
    );
    await expect(actionControls.first()).toBeVisible({ timeout: 20_000 });
    await expect(page.locator("a button, button a")).toHaveCount(0);

    const firstActionHref = await page
      .locator('a:has-text("Otvori stranicu"), a:has-text("Open page")')
      .first()
      .getAttribute("href");
    expect(firstActionHref ?? "").toMatch(/\/(topics|demos)\//);
  });

  test("demo detail placeholder page shows coming soon and navigation links", async ({
    page,
  }) => {
    // Use "budget" demo which doesn't have a specific .tsx file
    await page.goto(withDataSource("/demos/budget"));

    // Wait for page to load (skip skeleton state)
    await page.waitForTimeout(500);

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Runtime Error")).toHaveCount(0);

    // Check for Coming Soon chip
    await expect(page.getByText(/Uskoro dostupno|Coming Soon/i)).toBeVisible({
      timeout: 10_000,
    });

    // Check for demo icon with accessible label
    await expect(
      page.getByRole("img", {
        name: /demo category icon|ikonica demo kategorije|Demo category|Ikonica demo/i,
      })
    ).toBeVisible();

    // Check for placeholder/under development text
    await expect(
      page.getByText(/placeholder|u razvoju|under development/i)
    ).toBeVisible();

    // Check navigation links
    await expect(
      page.getByRole("link", { name: /Demo showcase/i }).first()
    ).toHaveAttribute("href", /\/demos\/showcase/);
    await expect(
      page.getByRole("link", {
        name: /Interaktivni playground|Interactive playground/i,
      })
    ).toHaveAttribute("href", /\/demos\/playground/);
    await expect(
      page.getByRole("link", { name: /Teme i dataseti|Topics and datasets/i })
    ).toHaveAttribute("href", /\/topics/);
  });

  test("topics pages render list and detail routes correctly", async ({
    page,
  }) => {
    await page.goto(withDataSource("/topics"));

    await expect(
      page.getByRole("heading", { name: /Istražite|Explore/i })
    ).toBeVisible();
    await expectInternalHomeTarget(page);

    const firstTopicCard = page.locator('a[href*="/topics/"]').first();
    await firstTopicCard.click();

    await expect(page).toHaveURL(/\/topics\/[a-z-]+/);
    const topicHeading = page.locator("h1").first();
    await expect(topicHeading).toBeVisible();
    await expect(topicHeading).not.toContainText(/[А-Яа-яЉЊЋЏЂЈ]/);
    await expect(page.getByTestId("language-picker-button")).toContainText(
      "Latinica"
    );
  });

  test("topic visualizations point to embed generator URLs with carried params", async ({
    page,
  }) => {
    await page.goto(withDataSource("/topics/environment"));

    await expect(page.locator("h1").first()).toBeVisible();
    const openVisualizationLink = page
      .getByRole("link", { name: /Otvori vizualizaciju|Open Visualization/i })
      .first();
    await expect(openVisualizationLink).toBeVisible();

    const href = (await openVisualizationLink.getAttribute("href")) ?? "";
    const linkText = (await openVisualizationLink.innerText()).trim();
    const expectedLang = /Otvori|Отвори/.test(linkText) ? "sr" : "en";

    expect(href).toContain("/embed?");
    expect(href).toContain("type=line");
    expect(href).toContain("dataset=air");
    expect(href).toContain(`lang=${expectedLang}`);
    expect(href).not.toContain("/embed/demo?");

    await openVisualizationLink.click();
    await expect(page).toHaveURL(/\/embed\?/);
    await expect(page.getByText("type: line")).toBeVisible();
    await expect(page.getByText("dataset: air")).toBeVisible();

    const previewLink = page.getByRole("link", { name: "Preview embed" });
    const previewHref = (await previewLink.getAttribute("href")) ?? "";
    expect(previewHref).toContain("/embed/demo?");
    expect(previewHref).toContain("type=line");
    expect(previewHref).toContain("dataset=air");
    expect(previewHref).toContain(`lang=${expectedLang}`);

    await expect(
      page.getByRole("button", {
        name: /Copy embed code|Code copied/i,
      })
    ).toBeVisible();
  });

  test("embed generator propagates selected chart params into preview/snippet", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed?chartId=budget&type=bar&dataset=budget&dataSource=Prod&theme=dark&lang=en&width=640px&height=400px"
      )
    );

    await expect(page.getByTestId("nav-home").first()).toHaveText(
      /Vizualni Admin|VA/
    );
    await expect(page.getByText("Chart params from URL:")).toBeVisible();
    await expect(page.getByText("chartId: budget")).toBeVisible();
    await expect(page.getByText("type: bar")).toBeVisible();
    await expect(page.getByText("dataset: budget")).toBeVisible();
    await expect(page.getByText("dataSource: Prod")).toBeVisible();
    await expect(page.getByText(/Target route:/)).toContainText(
      "/embed/budget"
    );
    await expect(
      page.getByRole("button", { name: /Copy embed code|Code copied/i })
    ).toBeVisible();

    const previewLink = page.getByRole("link", { name: "Preview embed" });
    const previewHref = (await previewLink.getAttribute("href")) ?? "";

    expect(previewHref).toContain("/embed/budget?");
    expect(previewHref).toContain("chartId=budget");
    expect(previewHref).toContain("type=bar");
    expect(previewHref).toContain("dataset=budget");
    expect(previewHref).toContain("dataSource=Prod");
    expect(previewHref).toContain("lang=en");
    expect(previewHref).toContain("theme=dark");
    expect(previewHref).not.toContain("width=640px");
    expect(previewHref).not.toContain("height=400px");

    const inlinePreview = page.locator('iframe[title="Embed preview"]');
    await expect(inlinePreview).toBeVisible();
    const inlineSrc = (await inlinePreview.getAttribute("src")) ?? "";

    expect(inlineSrc).toContain("/embed/budget?");
    expect(inlineSrc).toContain("chartId=budget");
    expect(inlineSrc).toContain("type=bar");
    expect(inlineSrc).toContain("dataset=budget");
    expect(inlineSrc).toContain("dataSource=Prod");
    expect(inlineSrc).toContain("theme=dark");
    expect(inlineSrc).toContain("lang=en");
  });

  test("embed preview reflects requested chart and dataset", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=bar&dataset=budget&dataSource=Prod&theme=light&lang=en"
      )
    );

    // Wait for client-side hydration and chart to render
    // The footnote appears after the chart loads
    await expect(page.getByText(/Dataset:\s*budget/)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Source:\s*Prod/)).toBeVisible();

    // Check that a chart is rendered (svg or canvas)
    await expect(page.locator("svg, canvas").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("embed preview shows fallback copy for unknown dataset while staying functional", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=line&dataset=unknown-dataset&dataSource=Prod&theme=light&lang=en"
      )
    );

    // Wait for client-side hydration and chart to render
    await expect(
      page.getByText(/was not found, showing demo fallback data/i)
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Dataset:\s*unknown-dataset/)).toBeVisible();
    await expect(page.getByText(/Source:\s*Prod/)).toBeVisible();
    await expect(page.locator("svg, canvas").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("topics dataset timestamp keeps the colon attached to the updated label", async ({
    page,
  }) => {
    await page.goto(withDataSource("/topics/environment"));

    const updatedLine = page.getByTestId("dataset-updated").first();
    await expect(updatedLine).toBeVisible();
    await expect(updatedLine).toContainText(
      /Ažurirano:\s*\d{4}-\d{2}-\d{2}|Ажурирано:\s*\d{4}-\d{2}-\d{2}|Updated:\s*\d{4}-\d{2}-\d{2}/
    );
  });

  test("docs guide slugs are reachable and render content", async ({
    page,
  }) => {
    const slugs = [
      "/docs/getting-started",
      "/docs/chart-types-guide",
      "/docs/embedding-guide",
    ];

    for (const slug of slugs) {
      await page.goto(withDataSource(slug));
      await expect(page.getByText("404")).toHaveCount(0);
      await expect(page.locator("h1").first()).toBeVisible();
    }
  });

  test("price analysis page has global header and locale-consistent currency format", async ({
    page,
  }) => {
    await page.goto(withPrefix("/cene"));

    await expect(page.getByTestId("header")).toBeVisible({ timeout: 15_000 });
    await expectInternalHomeTarget(page);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/\d{1,3}(?:\.\d{3})*,\d{2}\s?RSD/);
  });
});
