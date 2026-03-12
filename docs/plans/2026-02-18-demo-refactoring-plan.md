# Demo Quality Refactoring Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Improve demo code quality by fixing TypeScript issues, enhancing
accessibility, and reducing code duplication.

**Architecture:** Incremental refactoring of existing demo components without
breaking functionality. Changes are isolated to specific files and tested
incrementally.

**Tech Stack:** TypeScript, React, D3.js, Next.js, Lingui, MUI

---

## Task 1: Remove @ts-nocheck from demographics.tsx

**Files:**

- Modify: `app/pages/demos/demographics.tsx`
- Test: `app/__tests__/demos/demographics.spec.tsx`

**Step 1: Remove the directive and identify errors**

Remove `// @ts-nocheck` from line 1, then run TypeScript check:

```bash
cd /home/nistrator/Documents/github/vizualni-admin && npx tsc --noEmit -p ./app 2>&1 | grep demographics
```

Expected: List of TypeScript errors in demographics.tsx

**Step 2: Fix each TypeScript error**

Common fixes needed:

- Add proper types for `agePopulationData.reduce` callbacks
- Type the `populationTrends` array access
- Add type annotations for `region.region` and `region.regionEn`

```tsx
// Fix: Add explicit types for reduce callbacks
const totalMale = agePopulationData.reduce(
  (sum: number, age: { male: number }) => sum + age.male,
  0
);
const totalFemale = agePopulationData.reduce(
  (sum: number, age: { female: number }) => sum + age.female,
  0
);
```

**Step 3: Run TypeScript check**

```bash
npx tsc --noEmit -p ./app
```

Expected: No errors in demographics.tsx

**Step 4: Run existing tests**

```bash
cd app && vitest run __tests__/demos/demographics.spec.tsx
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add app/pages/demos/demographics.tsx
git commit -m "fix(demos): remove @ts-nocheck and fix TypeScript errors in demographics"
```

---

## Task 2: Fix hardcoded URL in showcase.tsx

**Files:**

- Modify: `app/pages/demos/showcase.tsx:830-855`

**Step 1: Replace raw anchor with Next.js Link**

Find the hardcoded link at line ~833-853 and replace:

```tsx
// Before:
<Box
  component="a"
  href="/vizualni-admin/demos"
  sx={{...}}
>
  {text.cta}
</Box>

// After:
<Link href="/demos" passHref legacyBehavior>
  <Box
    component="a"
    sx={{
      textDecoration: "none",
      padding: "12px 24px",
      borderRadius: "12px",
      background: "#0ea5e9",
      color: "white",
      fontWeight: 600,
      boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.3)",
      transition: "all 0.2s",
      display: "inline-flex",
      alignItems: "center",
      "&:hover": {
        background: "#0284c7",
        transform: "translateY(-1px)",
        boxShadow: "0 6px 8px -1px rgba(14, 165, 233, 0.4)",
      },
    }}
  >
    {text.cta}
  </Box>
</Link>
```

**Step 2: Verify the import exists**

Ensure `Link from "next/link"` is imported (it should already be at line 16).

**Step 3: Run TypeScript check**

```bash
npx tsc --noEmit -p ./app
```

Expected: No errors

**Step 4: Run showcase tests**

```bash
cd app && vitest run __tests__/demos/showcase.spec.tsx
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add app/pages/demos/showcase.tsx
git commit -m "fix(demos): use Next.js Link instead of hardcoded anchor in showcase CTA"
```

---

## Task 3: Extract chart constants to shared module

**Files:**

- Create: `app/components/demos/charts/constants.ts`
- Modify: `app/components/demos/charts/LineChart.tsx`
- Modify: `app/components/demos/ChartVisualizer.tsx`

**Step 1: Create constants file**

Create `app/components/demos/charts/constants.ts`:

```typescript
/**
 * Shared constants for demo chart components
 */

/** Default chart dimensions */
export const CHART_DIMENSIONS = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 400,
  DEFAULT_MARGIN: { top: 20, right: 30, bottom: 60, left: 80 },
} as const;

/** Maximum rows to display in auto-visualizations */
export const CHART_DATA_LIMITS = {
  /** Max rows for general chart visualization */
  MAX_VISIBLE_ROWS: 20,
  /** Max rows for pie chart slices */
  MAX_PIE_SLICES: 10,
  /** Max rows for ChartVisualizer display */
  VISUALIZER_MAX_ROWS: 25,
} as const;

/** Professional color palette for charts */
export const CHART_COLORS = {
  PRIMARY: "#6366f1",
  PROFESSIONAL_PALETTE: [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#ec4899", // Pink
    "#84cc16", // Lime
  ],
  GRID_STROKE: "#e5e7eb",
  AXIS_STROKE: "#d1d5db",
  TEXT_PRIMARY: "#1f2937",
  TEXT_SECONDARY: "#6b7280",
} as const;

/** Animation settings */
export const CHART_ANIMATION = {
  DEFAULT_DURATION: 1200,
  DOT_DELAY_MULTIPLIER: 30,
  DOT_TRANSITION_DURATION: 400,
} as const;

/** Accessibility settings */
export const CHART_ACCESSIBILITY = {
  TOOLTIP_Z_INDEX: 100,
  FOCUS_OUTLINE_COLOR: "#0ea5e9",
} as const;
```

**Step 2: Update ChartVisualizer to use constants**

Modify `app/components/demos/ChartVisualizer.tsx`:

```typescript
// Add import at top
import { CHART_DATA_LIMITS } from "./charts/constants";

// Replace line 74:
// function prepareDataForVisualization(data: any[], maxRows: number = 20)
// With:
function prepareDataForVisualization(data: any[], maxRows: number = CHART_DATA_LIMITS.MAX_VISIBLE_ROWS)

// Replace line 92:
// const preparedData = prepareDataForVisualization(data, 25);
// With:
const preparedData = prepareDataForVisualization(data, CHART_DATA_LIMITS.VISUALIZER_MAX_ROWS);

// Replace line 176:
// data={preparedData.slice(0, 10)}
// With:
data={preparedData.slice(0, CHART_DATA_LIMITS.MAX_PIE_SLICES)}
```

**Step 3: Update LineChart to use constants**

Modify `app/components/demos/charts/LineChart.tsx`:

```typescript
// Add import at top
import {
  CHART_DIMENSIONS,
  CHART_COLORS,
  CHART_ANIMATION,
} from "./constants";

// Replace defaults in props (lines 63-75):
width = CHART_DIMENSIONS.DEFAULT_WIDTH,
height = CHART_DIMENSIONS.DEFAULT_HEIGHT,
margin = CHART_DIMENSIONS.DEFAULT_MARGIN,
color = CHART_COLORS.PRIMARY,
colors = CHART_COLORS.PROFESSIONAL_PALETTE,
animationDuration = CHART_ANIMATION.DEFAULT_DURATION,
```

**Step 4: Run TypeScript check**

```bash
npx tsc --noEmit -p ./app
```

Expected: No errors

**Step 5: Run chart tests**

```bash
cd app && vitest run components/demos/charts/
```

Expected: All tests pass

**Step 6: Commit**

```bash
git add app/components/demos/charts/constants.ts app/components/demos/charts/LineChart.tsx app/components/demos/ChartVisualizer.tsx
git commit -m "refactor(demos): extract chart constants to shared module"
```

---

## Task 4: Add accessibility attributes to chart components

**Files:**

- Modify: `app/components/demos/charts/LineChart.tsx`
- Modify: `app/components/demos/charts/ColumnChart.tsx`
- Modify: `app/components/demos/charts/PieChart.tsx`
- Modify: `app/components/demos/charts/BarChart.tsx`

**Step 1: Add accessibility to LineChart**

In `LineChart.tsx`, update the SVG element (around line 478-483):

```tsx
// Before:
<svg
  ref={svgRef}
  width={width}
  height={height}
  style={{ maxWidth: "100%", height: "auto", overflow: "visible" }}
/>

// After:
<svg
  ref={svgRef}
  width={width}
  height={height}
  role="img"
  aria-label={title || `Line chart showing ${xLabel} vs ${yLabel}`}
  style={{ maxWidth: "100%", height: "auto", overflow: "visible" }}
/>
```

Also add a description for screen readers before the svg:

```tsx
<Box
  component="span"
  sx={{
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  }}
>
  {description ||
    `Chart displays ${data.length} data points. ${xLabel}: ${xKey}, ${yLabel}: ${yKey}.`}
</Box>
```

**Step 2: Add accessibility to ColumnChart**

Apply the same pattern to `ColumnChart.tsx`:

```tsx
<svg
  ref={svgRef}
  width={width}
  height={height}
  role="img"
  aria-label={title || `Column chart showing ${xLabel} vs ${yLabel}`}
  style={{ maxWidth: "100%", height: "auto" }}
/>
```

**Step 3: Add accessibility to PieChart**

In `PieChart.tsx`, add:

```tsx
<svg
  ref={svgRef}
  width={width}
  height={height}
  role="img"
  aria-label={title || `Pie chart with ${data.length} segments`}
  style={{ maxWidth: "100%", height: "auto" }}
/>
```

**Step 4: Add accessibility to BarChart**

Apply the same pattern to `BarChart.tsx`.

**Step 5: Run accessibility tests**

```bash
cd app && vitest run --testNamePattern="a11y|accessibility"
```

Expected: All accessibility tests pass

**Step 6: Run full test suite**

```bash
cd app && vitest run components/demos/charts/
```

Expected: All tests pass

**Step 7: Commit**

```bash
git add app/components/demos/charts/
git commit -m "feat(demos): add ARIA accessibility attributes to chart components"
```

---

## Task 5: Add keyboard focus handling to chart tooltips

**Files:**

- Modify: `app/components/demos/charts/LineChart.tsx`

**Step 1: Add keyboard navigation support**

Add keyboard event handlers after the mouse events (around line 370):

```tsx
// After the mouseleave handler, add:
.on("focus", function () {
  // Show first data point tooltip on focus
  if (data.length > 0) {
    const d = data[0];
    const xPosSnapped = xScale(String(d[xKey])) || 0;
    crosshair.style("display", null);
    crosshair.select(".crosshair-line").attr("x1", xPosSnapped).attr("x2", xPosSnapped);

    const tooltipValues: Array<{ key: string; value: number; color: string }> = [];
    seriesKeys.forEach((key, index) => {
      const value = Number(d[key]) || 0;
      const seriesColor = seriesKeys.length > 1 ? colors[index % colors.length] : color;
      crosshair
        .select(`.hover-dot-${index}`)
        .attr("cx", xPosSnapped)
        .attr("cy", yScale(value));
      tooltipValues.push({ key, value, color: seriesColor });
    });

    if (showTooltip && containerRef.current) {
      setTooltip({
        x: xPosSnapped + margin.left + 15,
        y: Math.min(yScale(Number(d[seriesKeys[0]]) || 0) + margin.top, innerHeight / 2 + margin.top),
        xValue: String(d[xKey]),
        values: tooltipValues,
      });
    }
  }
})
.on("blur", function () {
  crosshair.style("display", "none");
  setTooltip(null);
});
```

**Step 2: Make overlay focusable**

Update the overlay rect to be keyboard-focusable:

```tsx
g.append("rect")
  .attr("class", "overlay")
  .attr("width", innerWidth)
  .attr("height", innerHeight)
  .attr("fill", "transparent")
  .attr("tabindex", 0) // Add this
  .attr("role", "application") // Add this
  .attr(
    "aria-label",
    `Interactive chart. Use Tab to focus, data points: ${data.length}`
  )
  .style("cursor", "crosshair");
// ... existing event handlers
```

**Step 3: Run tests**

```bash
cd app && vitest run components/demos/charts/LineChart.spec.tsx
```

Expected: All tests pass

**Step 4: Commit**

```bash
git add app/components/demos/charts/LineChart.tsx
git commit -m "feat(demos): add keyboard focus handling to LineChart tooltips"
```

---

## Task 6: Create demo page factory utility

**Files:**

- Create: `app/lib/demos/demo-page-factory.tsx`
- Modify: None (additive only)

**Step 1: Create the factory utility**

Create `app/lib/demos/demo-page-factory.tsx`:

```tsx
/**
 * Factory utility for creating consistent demo pages
 * Reduces boilerplate across demo category pages
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { ReactNode } from "react";

import type { DemoConfig, DemoLocale } from "@/types/demos";

export interface DemoPageConfig {
  demoId: string;
  customContent?: ReactNode;
  showStats?: boolean;
  showLivePanel?: boolean;
}

export interface DemoPageText {
  title: string;
  description: string;
}

/**
 * Hook to get locale-aware text for demo pages
 */
export function useDemoPageText(
  demoId: string,
  config: DemoConfig
): DemoPageText {
  const { i18n } = useLingui();
  const locale: DemoLocale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  return {
    title: config.title[locale],
    description: config.description[locale],
  };
}

/**
 * Hook to get current demo locale
 */
export function useDemoLocale(): DemoLocale {
  const { i18n } = useLingui();
  return i18n.locale?.startsWith("sr") ? "sr" : "en";
}

/**
 * Format a number for display in demo cards
 */
export function formatDemoNumber(
  value: number,
  locale: DemoLocale,
  options?: Intl.NumberFormatOptions
): string {
  return value.toLocaleString(locale === "sr" ? "sr-RS" : "en-US", options);
}

/**
 * Get locale-aware label from a record
 */
export function getLocaleLabel<T>(
  record: Record<string, T>,
  locale: DemoLocale,
  fallbackKey: string = "en"
): T | undefined {
  return record[locale] ?? record[fallbackKey];
}
```

**Step 2: Export from lib/demos/index.ts**

Add to `app/lib/demos/index.ts`:

```tsx
// Add at end of file
export * from "./demo-page-factory";
```

**Step 3: Run TypeScript check**

```bash
npx tsc --noEmit -p ./app
```

Expected: No errors

**Step 4: Commit**

```bash
git add app/lib/demos/demo-page-factory.tsx app/lib/demos/index.ts
git commit -m "feat(demos): add demo page factory utilities for consistent page creation"
```

---

## Task 7: Add unit tests for chart constants

**Files:**

- Create: `app/components/demos/charts/constants.spec.ts`

**Step 1: Create test file**

Create `app/components/demos/charts/constants.spec.ts`:

```tsx
import { describe, expect, it } from "vitest";

import {
  CHART_ANIMATION,
  CHART_COLORS,
  CHART_DATA_LIMITS,
  CHART_DIMENSIONS,
} from "./constants";

describe("Chart Constants", () => {
  describe("CHART_DIMENSIONS", () => {
    it("should have default width", () => {
      expect(CHART_DIMENSIONS.DEFAULT_WIDTH).toBe(800);
    });

    it("should have default height", () => {
      expect(CHART_DIMENSIONS.DEFAULT_HEIGHT).toBe(400);
    });

    it("should have valid margins", () => {
      expect(CHART_DIMENSIONS.DEFAULT_MARGIN).toEqual({
        top: 20,
        right: 30,
        bottom: 60,
        left: 80,
      });
    });
  });

  describe("CHART_DATA_LIMITS", () => {
    it("should limit visible rows to 20", () => {
      expect(CHART_DATA_LIMITS.MAX_VISIBLE_ROWS).toBe(20);
    });

    it("should limit pie slices to 10", () => {
      expect(CHART_DATA_LIMITS.MAX_PIE_SLICES).toBe(10);
    });

    it("should set visualizer max to 25", () => {
      expect(CHART_DATA_LIMITS.VISUALIZER_MAX_ROWS).toBe(25);
    });
  });

  describe("CHART_COLORS", () => {
    it("should have primary color", () => {
      expect(CHART_COLORS.PRIMARY).toBe("#6366f1");
    });

    it("should have 8 colors in palette", () => {
      expect(CHART_COLORS.PROFESSIONAL_PALETTE).toHaveLength(8);
    });

    it("should have valid hex colors in palette", () => {
      CHART_COLORS.PROFESSIONAL_PALETTE.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe("CHART_ANIMATION", () => {
    it("should have default duration of 1200ms", () => {
      expect(CHART_ANIMATION.DEFAULT_DURATION).toBe(1200);
    });
  });
});
```

**Step 2: Run tests**

```bash
cd app && vitest run components/demos/charts/constants.spec.ts
```

Expected: All 12 tests pass

**Step 3: Commit**

```bash
git add app/components/demos/charts/constants.spec.ts
git commit -m "test(demos): add unit tests for chart constants"
```

---

## Verification

After completing all tasks, run the full verification:

```bash
# Type check
npx tsc --noEmit -p ./app

# Run all demo-related tests
cd app && vitest run __tests__/demos/ components/demos/

# Run accessibility tests
cd app && vitest run --testNamePattern="a11y|accessibility"

# Run lint
yarn lint
```

Expected: All checks pass with no errors.

---

## Summary

| Task               | Impact | Risk   |
| ------------------ | ------ | ------ |
| Remove @ts-nocheck | High   | Low    |
| Fix hardcoded URL  | Medium | Low    |
| Extract constants  | Medium | Low    |
| Add chart a11y     | High   | Low    |
| Keyboard tooltips  | Medium | Medium |
| Demo page factory  | Low    | Low    |
| Constant tests     | Low    | None   |

**Total estimated effort:** 2-3 hours
