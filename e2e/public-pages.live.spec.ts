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

const normalizePathname = (value: string) => value.replace(/\/+$/, "") || "/";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const QA_ENGLISH_DEMO_CASES = [
  {
    demoId: "energy",
    heading: /Energy mix and transition/i,
    forbiddenDatasetTitle: /Proizvodnja i uvoz energije \(primer podaci\)/i,
    forbiddenChartLabels: [/Godina/, /Ugalj/, /Obnovljivi/, /Uvoz/],
  },
  {
    demoId: "education",
    heading: /Education Statistics/i,
    forbiddenDatasetTitle: /Upis učenika i studenata \(primer podaci\)/i,
    forbiddenChartLabels: [/Godina/, /Osnovno/, /Srednje/, /Visoko/],
  },
  {
    demoId: "healthcare",
    heading: /Healthcare system/i,
    forbiddenDatasetTitle: /Zdravstveni kapaciteti \(primer podaci\)/i,
    forbiddenChartLabels: [/Godina/, /PacijentiNaCekanju/, /Lekari/],
  },
  {
    demoId: "economy",
    heading: /Economic indicators/i,
    forbiddenDatasetTitle: /Makroekonomski indikatori \(primer podaci\)/i,
    forbiddenChartLabels: [/Godina/, /Period/, /BDPRealniRast/],
  },
] as const;

const attachConsoleCollector = (page: Page) => {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
};

const getStatCardValue = async (page: Page, label: string) => {
  const card = page
    .locator("div.bg-white.rounded-lg.shadow.p-6")
    .filter({
      has: page.locator("h3", {
        hasText: new RegExp(`^${escapeRegExp(label)}$`),
      }),
    })
    .first();

  await expect(card).toBeVisible();
  return ((await card.locator("p").first().textContent()) ?? "").trim();
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
    await expect(page.locator('a[href*="/docs"]')).toHaveCount(0);
    await expect(page.locator('a[href*="/tutorials"]')).toHaveCount(0);
  });

  test("homepage renders global navigation and visible how-it-works step titles", async ({
    page,
  }) => {
    await page.goto(withDataSource("/"));

    await expect(page.getByTestId("header")).toBeVisible();
    await expect(
      page.getByText(/Izaberite dataset|Choose a dataset/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Prilagodite grafikon|Customize your chart/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Podelite ili ugradite|Share or embed/i)
    ).toBeVisible();
  });

  test("homepage primary CTA avoids a disabled browse dead-end", async ({
    page,
  }) => {
    await page.goto(withDataSource("/"));

    const primaryCta = page.getByTestId("primary-cta");
    await expect(primaryCta).toBeVisible();

    const href = (await primaryCta.getAttribute("href")) ?? "";
    expect(href).toMatch(/\/(browse|demos\/showcase)/);

    await Promise.all([
      page.waitForURL(/\/(browse|demos\/showcase)/, { timeout: 30_000 }),
      primaryCta.click(),
    ]);

    if (/\/browse/.test(page.url())) {
      await expect(
        page.getByRole("textbox", { name: /Search|Pretraga/i }).first()
      ).toBeVisible({ timeout: 20_000 });
      await expect(
        page.getByText(/Demo limita za statički build/i)
      ).toHaveCount(0);
      return;
    }

    await expect(page).toHaveURL(/\/demos\/showcase/);
    await expect(page.locator("h1").first()).toBeVisible();
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

    const firstTopicCard = page
      .getByRole("link", { name: /Ekonomija|Economy/i })
      .first();
    await firstTopicCard.click();

    await expect(page).toHaveURL(/\/topics\/[a-z-]+/);
    const topicHeading = page.locator("h1").first();
    await expect(topicHeading).toBeVisible();
    await expect(topicHeading).not.toContainText(/[А-Яа-яЉЊЋЏЂЈ]/);
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

    await Promise.all([
      page.waitForURL(/\/embed\?/, { timeout: 30_000 }),
      openVisualizationLink.click(),
    ]);
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
    await expect(
      page.getByText("Chart params from URL:", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("chartId: budget")).toBeVisible();
    await expect(page.getByText("type: bar")).toBeVisible();
    await expect(page.getByText("dataset: budget")).toBeVisible();
    await expect(page.getByText("dataSource: Prod")).toBeVisible();
    await expect(page.getByText(/Target route:/)).toContainText("/embed/demo");
    await expect(
      page.getByRole("button", { name: /Copy embed code|Code copied/i })
    ).toBeVisible();

    const previewLink = page.getByRole("link", { name: "Preview embed" });
    const previewHref = (await previewLink.getAttribute("href")) ?? "";

    expect(previewHref).toContain("/embed/demo?");
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
    await expect(inlinePreview).toHaveAttribute(
      "sandbox",
      "allow-scripts allow-same-origin"
    );
    const inlineSrc = (await inlinePreview.getAttribute("src")) ?? "";

    expect(inlineSrc).toContain("/embed/demo?");
    expect(inlineSrc).toContain("chartId=budget");
    expect(inlineSrc).toContain("type=bar");
    expect(inlineSrc).toContain("dataset=budget");
    expect(inlineSrc).toContain("dataSource=Prod");
    expect(inlineSrc).toContain("theme=dark");
    expect(inlineSrc).toContain("lang=en");
  });

  test("homepage featured embed action opens the embed generator inside the app base path", async ({
    page,
  }) => {
    await page.goto(withDataSource("/"));

    const embedButton = page
      .getByRole("button", {
        name: /Ugradite|Уградите|Embed/i,
      })
      .first();
    await expect(embedButton).toBeVisible();

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      embedButton.click(),
    ]);

    await popup.waitForLoadState("domcontentloaded");

    const popupUrl = new URL(popup.url());
    const expectedEmbedPath = normalizePathname(
      new URL(withPrefix("/embed/"), "https://example.com").pathname
    );

    expect(popupUrl.origin).toBe(new URL(page.url()).origin);
    expect(normalizePathname(popupUrl.pathname)).toBe(expectedEmbedPath);
    expect(popupUrl.searchParams.get("type")).toBeTruthy();
    await expect(popup.getByText("404")).toHaveCount(0);
  });

  test("embed preview reflects requested chart and dataset", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=bar&dataset=budget&dataSource=Prod&theme=light&lang=en"
      )
    );

    await expect(page.getByText("Runtime Error")).toHaveCount(0);
    await expect(page.locator("body")).toContainText(/Dataset:/i);
  });

  test("embed generator inline preview keeps requested params and avoids the generic error boundary", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-02: inline embed preview still falls back to demo data instead of the requested dataset."
    );

    await page.goto(
      withPrefix(
        "/embed?type=bar&dataset=age&dataSource=Prod&theme=light&lang=sr"
      )
    );

    await expect(page.getByText(/Something went wrong|TRY AGAIN/i)).toHaveCount(
      0
    );

    const inlinePreview = page.locator('iframe[title="Embed preview"]');
    await expect(inlinePreview).toHaveAttribute("src", /dataset=age/);

    const previewFrame = page.frameLocator('iframe[title="Embed preview"]');
    await expect(previewFrame.locator("body")).toContainText(
      /Dataset:\s*age/i,
      {
        timeout: 20_000,
      }
    );
  });

  test("embed preview shows fallback copy for unknown dataset while staying functional", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=line&dataset=unknown-dataset&dataSource=Prod&theme=light&lang=en"
      )
    );

    await expect(page.getByText("Runtime Error")).toHaveCount(0);
    await expect(page.locator("body")).toContainText(/Dataset:/i);
  });

  test("embed generator route remains stable while adjusting controls", async ({
    page,
  }) => {
    await page.goto(
      withPrefix("/embed?type=line&dataset=air&dataSource=Prod&lang=en")
    );

    await expect(page).toHaveURL(/\/embed(\?|$)/);
    await page.waitForTimeout(1200);
    await expect(page).toHaveURL(/\/embed(\?|$)/);

    await page.getByLabel("Width").fill("85%");
    await page.getByLabel("Height").fill("480px");

    await expect(page).toHaveURL(/\/embed(\?|$)/);
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

  test("language picker updates the page copy and picker label across locales", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-05: the language picker interaction does not currently change locale on the rendered page."
    );

    await page.goto(withDataSource("/"));

    const languageButton = page.getByRole("button", {
      name: /Language selector/i,
    });
    await expect(languageButton).toContainText("Srpski (Latinica)");

    await page
      .locator("#language-picker-button")
      .evaluate((button) => (button as HTMLButtonElement).click());
    await expect(page.locator("#language-picker-menu")).toBeVisible();
    await page.locator("#language-picker-menu").evaluate((menu) => {
      const target = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"]')
      ).find((item) => item.textContent?.trim() === "English");
      target?.click();
    });

    await expect(languageButton).toContainText("English");
    await expect(page.locator("h1").first()).toContainText(
      /Transform data\.gov\.rs datasets into beautiful charts/i
    );
    await expect(page).toHaveURL(/(\/en(?:\/|\?|$)|uiLocale=en)/);

    await page
      .locator("#language-picker-button")
      .evaluate((button) => (button as HTMLButtonElement).click());
    await expect(page.locator("#language-picker-menu")).toBeVisible();
    await page.locator("#language-picker-menu").evaluate((menu) => {
      const target = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"]')
      ).find((item) => item.textContent?.trim() === "Српски (Ћирилица)");
      target?.click();
    });

    await expect(languageButton).toContainText("Српски (Ћирилица)");
    await expect(page.locator("h1").first()).toContainText(/[А-Яа-яЉЊЋЏЂЈ]/);
    await expect(page).toHaveURL(/(\/sr-Cyrl(?:\/|\?|$)|uiLocale=sr-Cyrl)/);
  });

  test("showcase language switch preserves the static base path", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-01: switching locales on showcase drops the /vizualni-admin static base path."
    );

    await page.goto(withDataSource("/demos/showcase"));

    const languageButton = page.getByRole("button", {
      name: /Language selector/i,
    });
    await expect(languageButton).toBeVisible({ timeout: 20_000 });

    const initialUrl = new URL(page.url());
    const expectedPathname = normalizePathname(withPrefix("/demos/showcase"));
    expect(normalizePathname(initialUrl.pathname)).toBe(expectedPathname);

    await page.locator("#language-picker-button").click();
    const englishOption = page.getByRole("menuitem", { name: "English" });
    await expect(englishOption).toBeVisible();
    await Promise.all([
      page.waitForURL(/uiLocale=en/, { timeout: 20_000 }),
      englishOption.click({ force: true }),
    ]);

    await expect(page.locator("h1").first()).toBeVisible();

    const switchedUrl = new URL(page.url());
    expect(switchedUrl.origin).toBe(initialUrl.origin);
    expect(normalizePathname(switchedUrl.pathname)).toBe(expectedPathname);
    expect(switchedUrl.pathname.startsWith(`${PATH_PREFIX}/`)).toBe(
      Boolean(PATH_PREFIX)
    );
  });

  test("BUG-02/08/09 English demo pages localize back link, dataset title, and chart info labels", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-02/08/09: English demo pages still expose Serbian back-link, dataset-title, or chart info copy."
    );

    for (const demoCase of QA_ENGLISH_DEMO_CASES) {
      await page.goto(
        withDataSource(`/demos/${demoCase.demoId}`, { uiLocale: "en" })
      );

      await expect(page.locator("h1").first()).toContainText(demoCase.heading, {
        timeout: 20_000,
      });
      await expect(
        page.getByRole("link", { name: /Back to demo gallery/i }).first()
      ).toBeVisible();
      await expect(page.getByText(/Nazad na demo galeriju/i)).toHaveCount(0);

      await expect(page.getByText(/^Showing:/)).toBeVisible();
      await expect(page.getByText(/^Category:/)).toBeVisible();
      await expect(page.getByText(/^Value:/)).toBeVisible();
      await expect(page.getByText(/^Data source:/)).toBeVisible();
      await expect(page.getByText(/^Prikazano:/)).toHaveCount(0);
      await expect(page.getByText(/^Kategorija:/)).toHaveCount(0);
      await expect(page.getByText(/^Vrednost:/)).toHaveCount(0);
      await expect(page.getByText(/^Izvor podataka:/)).toHaveCount(0);

      await expect(page.getByText(demoCase.forbiddenDatasetTitle)).toHaveCount(
        0
      );
    }
  });

  test("BUG-03/04/05/06/07 English demo pages translate chart labels instead of showing Serbian field names", async ({
    page,
  }) => {
    for (const demoCase of QA_ENGLISH_DEMO_CASES) {
      await page.goto(
        withDataSource(`/demos/${demoCase.demoId}`, { uiLocale: "en" })
      );

      await expect(page.locator("h1").first()).toContainText(demoCase.heading, {
        timeout: 20_000,
      });
      await expect(page.locator("svg").first()).toBeVisible();

      const body = page.locator("body");
      for (const forbiddenLabel of demoCase.forbiddenChartLabels) {
        await expect(body).not.toContainText(forbiddenLabel);
      }
    }
  });

  test("showcase modal uses localized action copy and keeps a rendered preview", async ({
    page,
  }) => {
    await page.goto(withPrefix("/demos/showcase"));

    const previewTrigger = page
      .getByLabel(/Brzi pregled grafikona|Quick preview chart/i)
      .first();
    await expect(previewTrigger).toBeVisible({ timeout: 20_000 });
    await previewTrigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("demos.showcase.modal.close")).toHaveCount(0);
    await expect(dialog.getByText("demos.showcase.modal.viewDemo")).toHaveCount(
      0
    );
    await expect(
      dialog.getByRole("button", { name: /Zatvori|Close/i })
    ).toBeVisible();
    await expect(
      dialog.getByRole("link", { name: /Pogledaj ceo demo|View Full Demo/i })
    ).toBeVisible();
    await expect(dialog.locator("svg").first()).toBeVisible();
  });

  test("homepage share action uses the share payload instead of navigating to the topic page", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window.navigator, "share", {
        configurable: true,
        value: async (payload: unknown) => {
          (
            window as Window & {
              __lastSharedPayload?: unknown;
            }
          ).__lastSharedPayload = payload;
        },
      });
    });

    await page.goto(withDataSource("/"));

    const initialUrl = page.url();
    const shareButton = page
      .getByRole("button", {
        name: /Podeli|Подели|Share/i,
      })
      .first();
    await expect(shareButton).toBeVisible();
    await shareButton.click();

    await expect(page).toHaveURL(initialUrl);

    const sharedUrl = await page.evaluate(() => {
      const payload = (
        window as Window & {
          __lastSharedPayload?: { url?: string };
        }
      ).__lastSharedPayload;
      return payload?.url ?? "";
    });

    expect(sharedUrl).toMatch(/\/topics\//);
  });

  test("price analysis keeps Latin UI labels and synchronized summary stats after filtering", async ({
    page,
  }) => {
    await page.goto(withPrefix("/cene"));

    await expect(page.locator("h1").first()).toHaveText(/Analiza cena/);
    await expect(page.getByText(/^Kategorije$/)).toBeVisible();
    await expect(page.getByText(/^Proizvođači$/)).toBeVisible();
    await expect(page.getByText("Категорије")).toHaveCount(0);
    await expect(page.getByText("Произвођачи")).toHaveCount(0);

    await page.getByPlaceholder(/Naziv proizvoda/i).fill("Dell");

    await expect
      .poll(() => getStatCardValue(page, "Ukupno proizvoda"))
      .toBe("1");
    await expect.poll(() => getStatCardValue(page, "Kategorije")).toBe("1");
    await expect.poll(() => getStatCardValue(page, "Proizvođači")).toBe("1");
  });

  test("BUG-10 English landing page translates the price-analysis CTA", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-10: the price-analysis CTA remains Serbian on the English landing page."
    );

    await page.goto(withDataSource("/", { uiLocale: "en" }));

    await expect(page.locator("h1").first()).toContainText(/Transform/i, {
      timeout: 20_000,
    });
    await expect(
      page.getByRole("link", { name: /Price Analysis/i })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Analiza cena" })).toHaveCount(
      0
    );
  });

  test("BUG-11 /demos/traffic resolves to the traffic demo instead of a fallback page", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-11: /demos/traffic does not resolve to the transport demo route."
    );

    await page.goto(withDataSource("/demos/traffic", { uiLocale: "en" }));

    await expect(page).toHaveURL(/\/demos\/transport(?:\/|\?|$)/);
    await expect(page.locator("h1").first()).toContainText(/Road safety/i, {
      timeout: 20_000,
    });
    await expect(page.getByText(/Redirecting/i)).toHaveCount(0);
    await expect(page.getByText(/^404$/)).toHaveCount(0);
  });

  test("public pages do not emit next-auth client fetch errors on load", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    const errors = attachConsoleCollector(page);
    const routes = [
      withDataSource("/"),
      withPrefix("/embed?type=bar&dataset=budget&dataSource=Prod"),
    ];

    for (const route of routes) {
      errors.length = 0;
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);

      const nextAuthErrors = errors.filter((error) =>
        /(CLIENT_FETCH_ERROR|Unexpected token '<'|<!DOCTYPE)/i.test(error)
      );

      expect(
        nextAuthErrors,
        `Unexpected auth/session errors on ${route}`
      ).toEqual([]);
    }
  });
});

test.describe("Embed datasets", () => {
  test("embed preview with air dataset renders line chart", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=line&dataset=air&dataSource=Prod&theme=light&lang=en"
      )
    );

    // Wait for chart to render
    await expect(page.getByText(/Dataset:\s*air/)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Source:\s*Prod/)).toBeVisible();

    // Verify line chart renders (SVG)
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10_000 });
  });

  test("embed preview with students dataset renders bar chart", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=bar&dataset=students&dataSource=Prod&theme=light&lang=en"
      )
    );

    // Wait for chart to render
    await expect(page.getByText(/Dataset:\s*students/)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Source:\s*Prod/)).toBeVisible();

    // Verify bar chart renders (SVG)
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Locale/i18n", () => {
  test("topics page with sr-Cyrl locale shows Cyrillic script", async ({
    page,
  }) => {
    // Navigate with sr-Cyrl locale prefix
    await page.goto(withPrefix("/sr-Cyrl/topics/environment?dataSource=Prod"));

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 });

    // Verify Cyrillic characters are present in the heading
    const headingText = await page.locator("h1").first().innerText();
    expect(headingText).toMatch(/[А-Яа-яЉЊЋЏЂЈ]/);
  });

  test("dataset cards show correct locale labels for sr-Latn", async ({
    page,
  }) => {
    // Default locale is sr-Latn
    await page.goto(withDataSource("/topics/environment"));

    // Verify "Ažurirano:" label (Latin script, not English or Cyrillic)
    const updatedLine = page.getByTestId("dataset-updated").first();
    await expect(updatedLine).toBeVisible({ timeout: 15_000 });

    const updatedText = await updatedLine.innerText();
    // Should contain "Ažurirano:" (Latin) not "Updated:" (English) or "Ажурирано:" (Cyrillic)
    expect(updatedText).toContain("Ažurirano:");
    expect(updatedText).not.toContain("Updated:");
    expect(updatedText).not.toContain("Ажурирано:");
  });

  test("dataset cards show correct locale labels for sr-Cyrl", async ({
    page,
  }) => {
    await page.goto(withPrefix("/sr-Cyrl/topics/environment?dataSource=Prod"));

    // Verify "Ажурирано:" label (Cyrillic script)
    const updatedLine = page.getByTestId("dataset-updated").first();
    await expect(updatedLine).toBeVisible({ timeout: 15_000 });

    const updatedText = await updatedLine.innerText();
    // Should contain "Ажурирано:" (Cyrillic) not "Updated:" (English) or "Ažurirano:" (Latin)
    expect(updatedText).toContain("Ажурирано:");
    expect(updatedText).not.toContain("Updated:");
    expect(updatedText).not.toContain("Ažurirano:");
  });
});

test.describe("QA Report Coverage (2026-03-07)", () => {
  test("BUG-03 topic CTA does not route users to a disabled dataset-browser dead end", async ({
    page,
  }) => {
    await page.goto(withDataSource("/topics/environment"));

    const cta = page
      .getByRole("link", {
        name: /Istražite sve skupove podataka|View featured demos|Explore all datasets/i,
      })
      .first();
    await expect(cta).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/(browse|demos\/showcase)/, { timeout: 30_000 }),
      cta.click(),
    ]);

    if (/\/browse/.test(page.url())) {
      await expect(
        page.getByText(/Demo limita za statički build/i)
      ).toHaveCount(0);
    } else {
      await expect(page).toHaveURL(/\/demos\/showcase/);
    }
  });

  test("BUG-07 and BUG-25 homepage featured cards show non-empty previews with localized action labels", async ({
    page,
  }) => {
    await page.goto(withDataSource("/"));

    const featuredSection = page.locator("#featured");
    await expect(featuredSection).toBeVisible();
    await expect(
      featuredSection
        .getByRole("button", { name: /Ugradite|Уградите/i })
        .first()
    ).toBeVisible();
    await expect(
      featuredSection.getByRole("button", { name: /Podeli|Подели/i }).first()
    ).toBeVisible();
    await expect(
      featuredSection.locator(".MuiCard-root").first().locator("svg").first()
    ).toBeVisible();
  });

  test("BUG-09 playground default dataset renders meaningful sample values", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-09: the playground still renders broken default sample data on initial load."
    );

    await page.goto(withPrefix("/demos/playground"));

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText(/^undefined$/)).toHaveCount(0);
    await expect(page.getByText("0.000000")).toHaveCount(0);
    await expect(page.locator("body")).toContainText(/Jan|Feb|Mar|Apr/);
  });

  test("BUG-12 /cene content stays inside a padded container", async ({
    page,
  }) => {
    await page.goto(withPrefix("/cene"));

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    const box = await heading.boundingBox();
    expect(box?.x ?? 0).toBeGreaterThan(8);
  });

  test("BUG-13 embed generator is localized in Serbian on the default locale", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-13: the embed generator still ships multiple English strings on the Serbian locale."
    );

    await page.goto(
      withPrefix("/embed?type=bar&dataset=budget&dataSource=Prod&lang=sr")
    );

    await expect(
      page.getByText(/Generate iframe code for vizualni-admin charts/i)
    ).toHaveCount(0);
    await expect(page.getByText(/^Settings$/)).toHaveCount(0);
    await expect(page.getByText(/^Inline preview$/)).toHaveCount(0);
  });

  test("BUG-14 showcase page avoids mixed English copy in Serbian locale", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-14: showcase copy still contains English strings on the Serbian locale."
    );

    await page.goto(withPrefix("/demos/showcase"));

    await expect(page.getByText(/Back to demo gallery/i)).toHaveCount(0);
    await expect(
      page.getByText(/Explore key visualizations from Serbian open data/i)
    ).toHaveCount(0);
    await expect(page.getByText(/^Featured Charts$/)).toHaveCount(0);
    await expect(page.getByText(/^Data Source$/)).toHaveCount(0);
  });

  test("BUG-15 demo detail pages keep the back button localized", async ({
    page,
  }) => {
    for (const demoId of ["energy", "healthcare"]) {
      await page.goto(withPrefix(`/demos/${demoId}`));
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 20_000 });
      await expect(page.getByText(/Back to demo gallery/i)).toHaveCount(0);
    }
  });

  test("BUG-16 embed demo route does not show the English generic error fallback", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=bar&dataset=age&dataSource=Prod&theme=light&lang=sr"
      )
    );

    await expect(page.getByText("Something went wrong")).toHaveCount(0);
    await expect(
      page.getByText(
        "An unexpected error occurred. Please try refreshing the page."
      )
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "TRY AGAIN" })).toHaveCount(
      0
    );
  });

  test("BUG-17 playground control labels are localized in Serbian", async ({
    page,
  }) => {
    await page.goto(withPrefix("/demos/playground"));

    await expect(page.getByText(/^Tip grafikona$/)).toBeVisible();
    await expect(page.getByText(/^Izvor podataka$/)).toBeVisible();
    await expect(page.getByText(/^Tema$/)).toBeVisible();
    await expect(page.getByRole("tab", { name: /^Pregled$/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /^Kod$/ })).toBeVisible();
  });

  test("BUG-18 docs chart type headings are translated for Serbian", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-18: chart type guide headings still use English chart-type names."
    );

    await page.goto(withPrefix("/docs/chart-types-guide?dataSource=Prod"));

    await expect(page.getByText(/^Bar\/Column$/)).toHaveCount(0);
    await expect(page.getByText(/^Line\/Area$/)).toHaveCount(0);
    await expect(page.getByText(/^Pie$/)).toHaveCount(0);
  });

  test("BUG-20 homepage featured demos are not contradicted as coming soon on the demos index", async ({
    page,
  }) => {
    await page.goto(withDataSource("/demos"));

    await expect(page.getByText(/Uskoro|Coming Soon/i)).toHaveCount(0);
  });

  test("BUG-21 live demo pages avoid exposing fallback-data badges as the primary state", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-21: energy/healthcare demo routes still expose fallback-data badges."
    );

    for (const demoId of ["energy", "healthcare"]) {
      await page.goto(withPrefix(`/demos/${demoId}`));
      await expect(
        page.getByText(/Fallback podaci|Fallback data/i)
      ).toHaveCount(0);
    }
  });

  test("BUG-23 missing discount values are explained when the price table shows a dash", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-23: the price table still shows unexplained '-' values for missing discount prices."
    );

    await page.goto(withPrefix("/cene"));

    await expect(page.locator("body")).toContainText(/Vileda|Nektar/);
    await expect(page.locator("body")).toContainText(
      /nema popusta|bez popusta|discount not available/i
    );
  });

  test("BUG-24 healthcare uses a healthcare icon instead of a warning siren", async ({
    page,
  }) => {
    await page.goto(withPrefix("/demos/healthcare"));

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible({ timeout: 20_000 });
    await expect(heading).toContainText("🏥");
    await expect(heading).not.toContainText("🚨");
  });

  test("BUG-26 topic chart-type pills are translated instead of raw BAR/LINE labels", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-26: topic visualization pills still render raw English BAR/LINE labels."
    );

    for (const topic of ["demographics", "education", "transport", "economy"]) {
      await page.goto(withDataSource(`/topics/${topic}`));
      await expect(page.getByText(/^BAR$/)).toHaveCount(0);
      await expect(page.getByText(/^LINE$/)).toHaveCount(0);
    }
  });

  test("BUG-27 embed code block metadata is localized in Serbian", async ({
    page,
  }) => {
    test.fail(
      true,
      "BUG-27: the embed code block still exposes raw 'embed.html' and 'HTML' labels."
    );

    await page.goto(
      withPrefix("/embed?type=bar&dataset=budget&dataSource=Prod&lang=sr")
    );

    await expect(page.getByText(/^embed\.html$/)).toHaveCount(0);
    await expect(page.getByText(/^HTML$/)).toHaveCount(0);
  });
});
