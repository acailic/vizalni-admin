# Demo Pages E2E Testing Design

**Date:** 2026-02-25 **Status:** Approved **Scope:** Functional + Visual
regression tests for demo pages

## Overview

Comprehensive E2E testing for all 24 demo pages, covering:

- **Functional tests**: All interactive components (buttons, links, charts,
  dropdowns, modals)
- **Visual regression tests**: Full-page screenshots at desktop viewport
  (1280px)

**Out of scope:** Deployment gates, CI workflow changes

## Architecture

### File Structure

```
e2e/
├── demo-functional.spec.ts    # Comprehensive interactive component tests
├── demo-visual.spec.ts        # Screenshot comparisons (generated from DEMO_CONFIGS)
├── demo-pages.spec.ts         # Keep existing (smoke/navigation)
├── fixtures/
│   └── demo-fixtures.ts       # Shared test utilities and helpers
└── screenshots/
    └── demos/                 # Local baseline screenshots (git-tracked)
```

### Test Execution

```bash
yarn test:e2e:demo              # Run all demo-related tests
yarn test:e2e:demo-functional   # Run functional tests only
yarn test:e2e:demo-visual       # Run visual regression tests only
yarn test:e2e:visual:update     # Update visual baselines locally
```

## Functional Tests (`demo-functional.spec.ts`)

Tests are dynamically generated from `DEMO_CONFIGS` to cover all 24 demos
automatically.

### Test Categories

#### 2.1 Chart Components

- Chart renders (SVG/canvas visible)
- Chart has data (not empty/placeholder)
- Tooltips appear on hover/click
- Legend items are clickable (toggle series visibility)
- Axis labels are present and readable

#### 2.2 Navigation Elements

- Header navigation links work
- Breadcrumbs display correct path
- "Back to demos" link works
- Demo pagination (if applicable)

#### 2.3 Action Buttons

- **Share button** - Opens share modal with correct URL
- **Embed button** - Opens embed modal with code snippet
- **Export buttons** - PNG/SVG/PDF download triggers
- **Fullscreen button** - Toggles fullscreen mode

#### 2.4 Filter/Control Components

- Language selector toggles sr/en
- Any dropdown filters change chart data
- Date range pickers update visualization
- Any toggle switches work correctly

#### 2.5 Error States

- Page handles missing data gracefully
- Error boundaries show fallback UI
- No console errors (except known static hosting errors)

### Test Pattern

```typescript
import { test, expect } from "@playwright/test";
import { DEMO_CONFIGS } from "@/lib/demos/config";
import {
  BASE_URL,
  waitForChartReady,
  assertNoCriticalErrors,
} from "../fixtures/demo-fixtures";

for (const [demoId, config] of Object.entries(DEMO_CONFIGS)) {
  test.describe(`Demo: ${demoId}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/demos/${demoId}`);
      await waitForChartReady(page);
    });

    test("chart renders with data", async ({ page }) => {
      const chart = page.locator("svg, canvas");
      await expect(chart).toBeVisible();
    });

    test("share button works", async ({ page }) => {
      const shareBtn = page.locator('button:has-text("Share")');
      if (await shareBtn.isVisible()) {
        await shareBtn.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
      }
    });

    // ... more tests per category
  });
}
```

## Visual Regression Tests (`demo-visual.spec.ts`)

### Screenshot Strategy

- **Viewport:** 1280x800 (desktop)
- **Scope:** Full-page screenshots for each demo
- **Naming:** `demos-{demoId}-desktop.png`
- **Storage:** `e2e/screenshots/demos/` (git-tracked)

### Test Pattern

```typescript
import { test, expect } from "@playwright/test";
import { DEMO_CONFIGS } from "@/lib/demos/config";
import { BASE_URL, waitForChartReady } from "../fixtures/demo-fixtures";

test.use({ viewport: { width: 1280, height: 800 } });

for (const [demoId] of Object.entries(DEMO_CONFIGS)) {
  test(`visual: ${demoId}`, async ({ page }) => {
    await page.goto(`${BASE_URL}/demos/${demoId}`);
    await waitForChartReady(page);
    await expect(page).toHaveScreenshot(`demos-${demoId}-desktop.png`);
  });
}
```

### Local Workflow

1. Run `yarn test:e2e:demo-visual`
2. If diff detected, review and either:
   - Fix the UI bug, or
   - Run `yarn test:e2e:visual:update` to accept new baseline
3. Commit updated screenshots with code changes

### CI Behavior

- Visual tests run but **don't fail the build** on diff
- Missing screenshots DO fail (ensures new demos have baselines)
- Diff reports uploaded as artifacts for review

## Test Fixtures (`fixtures/demo-fixtures.ts`)

```typescript
import { Page } from "@playwright/test";
import { DEMO_CONFIGS } from "@/lib/demos/config";

export const BASE_URL = "https://acailic.github.io/vizualni-admin";

// Filter out expected static hosting errors
export const isStaticHostingError = (error: string) =>
  error.includes("404") ||
  error.includes("405") ||
  error.includes("next-auth") ||
  error.includes("CLIENT_FETCH_ERROR");

// Wait for chart to fully render
export const waitForChartReady = async (page: Page) => {
  await page.waitForSelector("svg, canvas", { timeout: 10000 });
  await page.waitForTimeout(500); // Let animations settle
};

// Assert no critical console errors
export const assertNoCriticalErrors = (errors: string[]) => {
  const critical = errors.filter((e) => !isStaticHostingError(e));
  return critical;
};

// Get all demo IDs from config
export const getDemoIds = () => Object.keys(DEMO_CONFIGS);
```

## Package.json Scripts

```json
{
  "scripts": {
    "test:e2e:demo": "playwright test --grep demo",
    "test:e2e:demo-functional": "playwright test e2e/demo-functional.spec.ts",
    "test:e2e:demo-visual": "playwright test e2e/demo-visual.spec.ts",
    "test:e2e:visual:update": "playwright test e2e/demo-visual.spec.ts --update-snapshots"
  }
}
```

## Playwright Config Updates

Minor updates to `playwright.config.ts`:

- Ensure consistent viewport for visual tests
- Configure snapshot path template
- No changes to existing reporter configuration

## Summary

| Deliverable                     | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `e2e/demo-functional.spec.ts`   | ~200 tests covering all interactive components across 24 demos |
| `e2e/demo-visual.spec.ts`       | 24 screenshot tests (one per demo)                             |
| `e2e/fixtures/demo-fixtures.ts` | Shared helpers and utilities                                   |
| `e2e/screenshots/demos/`        | Baseline screenshot directory                                  |
| `playwright.config.ts`          | Minor config adjustments                                       |
| `package.json`                  | New test scripts                                               |

**Estimated test count:** ~225 tests total
