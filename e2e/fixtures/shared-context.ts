import {
  test as base,
  chromium,
  Browser,
  BrowserContext,
  Page,
  PlaywrightTestOptions,
} from "@playwright/test";
import {
  locatorFixtures as fixtures,
  LocatorFixtures as TestingLibraryFixtures,
} from "@playwright-testing-library/test/fixture";
import { existsSync, mkdirSync, unlinkSync, rmSync } from "fs";
import { join } from "path";

import { createActions, Actions } from "../actions";
import { createSelectors, Selectors } from "../selectors";
import { slugify } from "../slugify";

// Shared instances (persist across tests for speed)
let browser: Browser | null = null;
let context: BrowserContext | null = null;

// Storage path for auth persistence
const STORAGE_DIR = join(process.cwd(), ".playwright-state");
const AUTH_FILE = join(STORAGE_DIR, "auth.json");

// Ensure storage directory exists
if (!existsSync(STORAGE_DIR)) {
  mkdirSync(STORAGE_DIR, { recursive: true });
}

// Resource-efficient launch options
const launchOptions = {
  headless: false,
  args: [
    "--disable-extensions",
    "--disable-plugins",
    "--disable-background-networking",
    "--disable-sync",
    "--no-first-run",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-sandbox",
  ],
};

// Context options
const contextOptions: PlaywrightTestOptions["contextOptions"] = {
  ignoreHTTPSErrors: true,
};

/**
 * Fast test setup with shared browser context
 * - Reuses single browser instance
 * - Shares context across tests (auth persisted)
 * - Blocks images/fonts for speed
 */
const setup = () => {
  const test = base.extend<TestingLibraryFixtures>(fixtures).extend<{
    selectors: Selectors;
    actions: Actions;
  }>({
    // Shared browser (launched once, reused)
    browser: async ({}, use) => {
      if (!browser) {
        browser = await chromium.launch(launchOptions);
        // Cleanup on exit
        const cleanup = async () => {
          if (context) {
            try {
              await context.storageState({ path: AUTH_FILE });
            } catch {
              // Ignore if context already closed
            }
          }
          await browser?.close();
          browser = null;
          context = null;
        };
        process.on("exit", cleanup);
        process.on("SIGINT", cleanup);
        process.on("SIGTERM", cleanup);
      }
      await use(browser);
    },

    // Shared context (auth state persisted)
    context: async ({ browser }, use) => {
      if (!context) {
        // Restore auth state if exists
        const stateOptions = existsSync(AUTH_FILE)
          ? { storageState: AUTH_FILE }
          : {};

        context = await browser.newContext({
          ...contextOptions,
          ...stateOptions,
        });

        // Block heavy resources for speed
        await context.route(
          "**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2,mp4,webm}",
          (route) => route.abort()
        );
      }
      await use(context);
    },

    // Fresh page per test (from shared context)
    page: async ({ context }, use) => {
      const page = await context.newPage();
      await use(page);
      await page.close();
    },

    selectors: async ({ page, screen, within }, use) => {
      const ctx = { page, screen, within };
      const selectors = createSelectors(ctx);
      await use(selectors);
    },

    actions: async ({ page, screen, selectors, within }, use) => {
      const ctx = { page, screen, selectors, within };
      const actions = createActions(ctx);
      await use(actions);
    },
  });

  // Pause on failure for debugging
  test.afterEach(async ({ page }, testInfo) => {
    // Save auth state after each test
    if (context) {
      try {
        await context.storageState({ path: AUTH_FILE });
      } catch {
        // Ignore if context already closed
      }
    }

    if (!process.env.CI && testInfo.status !== testInfo.expectedStatus) {
      process.stderr.write(
        `❌ ❌ PLAYWRIGHT TEST FAILURE ❌ ❌\n${testInfo.error?.stack || testInfo.error}\n`
      );
      testInfo.setTimeout(0);
      await page.pause();
    }
  });

  const { expect, describe } = test;
  const it = test;

  return { test, expect, describe, it };
};

/**
 * Clear auth state (for tests needing fresh login)
 */
export const clearAuthState = () => {
  if (existsSync(AUTH_FILE)) {
    unlinkSync(AUTH_FILE);
  }
};

/**
 * Reset entire context (for watch mode)
 */
export const resetContext = async () => {
  await context?.close();
  context = null;
};

/**
 * Full cleanup (browser + context + state)
 */
export const fullCleanup = async () => {
  await context?.close();
  await browser?.close();
  browser = null;
  context = null;
  if (existsSync(STORAGE_DIR)) {
    rmSync(STORAGE_DIR, { recursive: true, force: true });
  }
};

export { setup };
export const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";
