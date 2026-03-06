// Debug why charts aren't rendering
import { test } from "@playwright/test";

const BASE_URL = "https://acailic.github.io/vizualni-admin";

test("debug: check playground chart rendering", async ({ page }) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
    if (msg.type() === "warning") {
      warnings.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    errors.push(`PageError: ${err.message}`);
  });

  console.log("\n=== Debugging Playground ===");
  await page.goto(`${BASE_URL}/demos/playground?dataSource=Prod`);
  await page.waitForLoadState("networkidle");

  // Wait longer for charts
  await page.waitForTimeout(5000);

  // Check for SVG/canvas elements
  const svgCount = await page.locator("svg").count();
  const canvasCount = await page.locator("canvas").count();

  console.log(`SVG elements found: ${svgCount}`);
  console.log(`Canvas elements found: ${canvasCount}`);

  // Check for chart containers
  const chartContainers = await page
    .locator("[class*='chart'], [class*='Chart']")
    .count();
  console.log(`Chart containers found: ${chartContainers}`);

  // Check for error messages on page
  const errorTexts = await page
    .locator(":text('Error'), :text('error'), :text('Failed')")
    .count();
  console.log(`Error text elements: ${errorTexts}`);

  // Check for loading states
  const loadingElements = await page
    .locator(":text('Loading'), :text('loading'), [class*='skeleton']")
    .count();
  console.log(`Loading/skeleton elements: ${loadingElements}`);

  console.log("\n=== Console Errors ===");
  errors.forEach((e) => console.log(`  ERROR: ${e}`));

  console.log("\n=== Console Warnings ===");
  warnings.slice(0, 10).forEach((w) => console.log(`  WARN: ${w}`));

  // Take screenshot
  await page.screenshot({ path: "debug-playground.png", fullPage: true });

  // Get page HTML for analysis
  const html = await page.content();
  const hasRecharts = html.includes("recharts") || html.includes("Recharts");
  const hasChartRenderer = html.includes("ChartRenderer");
  console.log(`\nHTML contains 'recharts': ${hasRecharts}`);
  console.log(`HTML contains 'ChartRenderer': ${hasChartRenderer}`);
});

test("debug: check showcase chart rendering", async ({ page }) => {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  console.log("\n=== Debugging Showcase ===");
  await page.goto(`${BASE_URL}/demos/showcase?dataSource=Prod`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(5000);

  const svgCount = await page.locator("svg").count();
  console.log(`SVG elements: ${svgCount}`);

  // Check featured chart cards
  const cards = await page.locator("[class*='card'], [class*='Card']").count();
  console.log(`Card elements: ${cards}`);

  console.log("\nErrors:");
  errors.forEach((e) => console.log(`  ${e}`));

  await page.screenshot({ path: "debug-showcase.png", fullPage: true });
});

test("debug: check demo-energy chart rendering", async ({ page }) => {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  console.log("\n=== Debugging demo-energy ===");
  await page.goto(`${BASE_URL}/demos/energy?dataSource=Prod`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(5000);

  const svgCount = await page.locator("svg").count();
  const canvasCount = await page.locator("canvas").count();
  console.log(`SVG: ${svgCount}, Canvas: ${canvasCount}`);

  // Check if there's a "coming soon" message
  const comingSoon = await page
    .locator(":text('Coming'), :text('Uskoro')")
    .count();
  console.log(`Coming soon elements: ${comingSoon}`);

  // Check for data load status
  const dataStatus = await page
    .locator(":text('No data'), :text('Error'), :text('Failed')")
    .count();
  console.log(`Data error elements: ${dataStatus}`);

  console.log("\nErrors:");
  errors.forEach((e) => console.log(`  ${e}`));

  await page.screenshot({ path: "demo-energy.png", fullPage: true });
});
