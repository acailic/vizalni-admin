// e2e/fixtures/demo-fixtures.ts
import { Page } from "@playwright/test";

import { DEMO_CONFIGS } from "@/lib/demos/config";

export const BASE_URL = "https://acailic.github.io/vizualni-admin";

// Filter out expected static hosting errors
export const isStaticHostingError = (error: string) =>
  error.includes("404") ||
  error.includes("405") ||
  error.includes("next-auth") ||
  error.includes("CLIENT_FETCH_ERROR") ||
  error.includes("Unexpected token") ||
  error.includes("DOCTYPE");

// Wait for chart to fully render
export const waitForChartReady = async (page: Page) => {
  await page.waitForSelector("svg, canvas", { timeout: 10000 });
  await page.waitForTimeout(500); // Let animations settle
};

// Assert no critical console errors
export const getCriticalErrors = (errors: string[]) => {
  return errors.filter((e) => !isStaticHostingError(e));
};

// Get all demo IDs from config
export const getDemoIds = () => Object.keys(DEMO_CONFIGS);

// Get demo config by ID
export const getDemoConfig = (id: string) => DEMO_CONFIGS[id] || null;
