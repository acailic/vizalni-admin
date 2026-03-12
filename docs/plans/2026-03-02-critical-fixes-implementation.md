# Critical Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 4 critical bugs that will cause runtime failures in @vizualni packages before release.

**Architecture:** Follow TDD approach - write failing tests first, then implement minimal fixes. Each fix is isolated to specific functions with clear test coverage.

**Tech Stack:** TypeScript, Vitest, d3-scale, d3-shape, React 18

---

## Task 1: Fix Empty Data Crash in computeLineScales

**Files:**
- Modify: `packages/core/src/scales/index.ts:59-98`
- Test: `packages/core/test/scales/index.test.ts`

**Step 1: Write the failing test**

Add to `packages/core/test/scales/index.test.ts` inside the `describe("computeScales", ...)` block, in the `"edge cases"` describe block:

```typescript
it("should handle empty data array for line chart without crashing", () => {
  const emptyData: Datum[] = [];
  const config: ChartConfig = {
    type: "line",
    x: { field: "date", type: "date" },
    y: { field: "value", type: "number" },
  };

  // Should not throw and return valid scales
  const scales = computeScales(emptyData, config, {
    width: 600,
    height: 400,
  });

  expect(scales.x).toBeDefined();
  expect(scales.y).toBeDefined();
  expect(typeof scales.x).toBe("function");
  expect(typeof scales.y).toBe("function");
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/core && npm test -- --run --reporter=verbose 2>&1 | head -50`
Expected: Test fails or produces undefined behavior

**Step 3: Write minimal implementation**

Modify `packages/core/src/scales/index.ts` - update `computeLineScales` function (lines 59-98):

```typescript
function computeLineScales(
  data: Datum[],
  config: Extract<ChartConfig, { type: "line" }>,
  chartWidth: number,
  chartHeight: number
): Scales {
  // Handle empty data - return default scales
  if (data.length === 0) {
    const now = new Date();
    return {
      x: createTimeScale({
        domain: [now, now],
        range: [0, chartWidth],
      }),
      y: createLinearScale({
        domain: [0, 1],
        range: [chartHeight, 0],
      }),
    };
  }

  // X scale (time)
  const xExtent = extent(data, (d) => d[config.x.field] as Date);
  const xScale = createTimeScale({
    domain: xExtent as [Date, Date],
    range: [0, chartWidth],
    nice: true,
  });

  // Y scale (linear) - handle negative values
  const yExtent = extent(data, (d) => d[config.y.field] as number);
  const yMin = yExtent[0] ?? 0;
  const yMax = yExtent[1] ?? 0;

  // Include 0 in domain if all values are positive, otherwise use actual extent
  const yDomain: [number, number] =
    yMin >= 0 ? [0, yMax] : [yMin, Math.max(yMax, 0)];

  const yScale = createLinearScale({
    domain: yDomain,
    range: [chartHeight, 0],
    nice: true,
  });

  // Color scale (optional)
  let colorScale;
  if (config.segment) {
    colorScale = createColorScale({
      data,
      field: config.segment.field,
      range: getDefaultColors(),
    });
  }

  return { x: xScale, y: yScale, color: colorScale };
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/core && npm test -- --run --reporter=verbose`
Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/core/src/scales/index.ts packages/core/test/scales/index.test.ts
git commit -m "fix(core): handle empty data in computeLineScales

Add guard for empty data array that returns valid default scales
instead of passing undefined to d3.extent results to scaleTime.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Fix Empty Data Crash in computeBarScales

**Files:**
- Modify: `packages/core/src/scales/index.ts:101-143`
- Test: `packages/core/test/scales/index.test.ts`

**Step 1: Write the failing test**

Add to `packages/core/test/scales/index.test.ts` in the `"edge cases"` describe block:

```typescript
it("should handle empty data array for bar chart without crashing", () => {
  const emptyData: Datum[] = [];
  const config: ChartConfig = {
    type: "bar",
    x: { field: "category", type: "string" },
    y: { field: "value", type: "number" },
  };

  const scales = computeScales(emptyData, config, {
    width: 600,
    height: 400,
  });

  expect(scales.x).toBeDefined();
  expect(scales.y).toBeDefined();
  expect(typeof scales.x).toBe("function");
  expect(typeof scales.y).toBe("function");
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/core && npm test -- --run --reporter=verbose`
Expected: Test fails or produces undefined behavior

**Step 3: Write minimal implementation**

Modify `packages/core/src/scales/index.ts` - update `computeBarScales` function (lines 101-143):

```typescript
function computeBarScales(
  data: Datum[],
  config: Extract<ChartConfig, { type: "bar" }>,
  chartWidth: number,
  chartHeight: number
): Scales {
  // Handle empty data - return default scales
  if (data.length === 0) {
    return {
      x: createBandScale({
        domain: [],
        range: [0, chartWidth],
      }),
      y: createLinearScale({
        domain: [0, 1],
        range: [chartHeight, 0],
      }),
    };
  }

  // Extract categories from x field
  const categories = [...new Set(data.map((d) => String(d[config.x.field])))];

  // X scale (band for categorical data)
  const xScale = createBandScale({
    domain: categories,
    range: [0, chartWidth],
    padding: 0.2,
  });

  // Y scale (linear) - handle negative values
  const yExtent = extent(data, (d) => d[config.y.field] as number);
  const yMin = yExtent[0] ?? 0;
  const yMax = yExtent[1] ?? 0;

  // Include 0 in domain if all values are positive, otherwise use actual extent
  const yDomain: [number, number] =
    yMin >= 0 ? [0, yMax] : [yMin, Math.max(yMax, 0)];

  const yScale = createLinearScale({
    domain: yDomain,
    range: [chartHeight, 0],
    nice: true,
  });

  // Color scale (optional)
  let colorScale;
  if (config.segment) {
    colorScale = createColorScale({
      data,
      field: config.segment.field,
      range: getDefaultColors(),
    });
  }

  return { x: xScale, y: yScale, color: colorScale };
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/core && npm test -- --run --reporter=verbose`
Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/core/src/scales/index.ts packages/core/test/scales/index.test.ts
git commit -m "fix(core): handle empty data in computeBarScales

Add guard for empty data array that returns valid default scales.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Fix Negative Bar Height Calculation

**Files:**
- Modify: `packages/core/src/shapes/index.ts:126-168`
- Test: Create `packages/core/test/shapes/index.test.ts`

**Step 1: Write the failing test**

Create `packages/core/test/shapes/index.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { computeShapes } from "../../src/shapes/index";
import { computeScales } from "../../src/scales/index";
import { computeLayout } from "../../src/layout/index";
import type { ChartConfig, Datum } from "../../src/types";

describe("computeShapes", () => {
  describe("bar chart", () => {
    it("should correctly calculate bar height for positive values", () => {
      const data: Datum[] = [
        { category: "A", value: 100 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, { width: 600, height: 400, ...layout });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(1);
      const bar = shapes[0];
      expect(bar.type).toBe("bar");
      if (bar.type === "bar") {
        expect(bar.height).toBeGreaterThan(0);
        expect(bar.y).toBeGreaterThanOrEqual(0);
        expect(bar.y + bar.height).toBeLessThanOrEqual(layout.chartArea.height);
      }
    });

    it("should correctly calculate bar height for negative values", () => {
      const data: Datum[] = [
        { category: "A", value: -50 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, { width: 600, height: 400, ...layout });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(1);
      const bar = shapes[0];
      expect(bar.type).toBe("bar");
      if (bar.type === "bar") {
        // Negative bars should extend downward from y=0 line
        expect(bar.height).toBeGreaterThan(0);
        // For negative values, bar.y should be at or below the zero line
        expect(bar.y).toBeGreaterThanOrEqual(layout.chartArea.y);
      }
    });

    it("should correctly handle mixed positive and negative values", () => {
      const data: Datum[] = [
        { category: "A", value: 100 },
        { category: "B", value: -50 },
        { category: "C", value: 75 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, { width: 600, height: 400, ...layout });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(3);

      // All bars should have positive height
      shapes.forEach((shape) => {
        if (shape.type === "bar") {
          expect(shape.height).toBeGreaterThan(0);
        }
      });

      // Positive bar (A) should be above negative bar (B)
      const barA = shapes.find((s) => s.type === "bar" && "category" in s && s.category === "A");
      const barB = shapes.find((s) => s.type === "bar" && "category" in s && s.category === "B");

      if (barA?.type === "bar" && barB?.type === "bar") {
        expect(barA.y).toBeLessThan(barB.y); // Positive bar is higher (smaller y)
      }
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/core && npm test -- --run --reporter=verbose test/shapes/index.test.ts`
Expected: Tests fail with incorrect bar heights for negative values

**Step 3: Write minimal implementation**

Modify `packages/core/src/shapes/index.ts` - update `computeBarShapes` function (lines 126-168):

```typescript
function computeBarShapes(
  data: Datum[],
  config: Extract<ChartConfig, { type: "bar" }>,
  scales: Scales,
  layout: Layout
): Shape[] {
  const { chartArea } = layout;
  const xScale = scales.x as ScaleBand<string>;
  const bandwidth = xScale.bandwidth();
  const shapes: Shape[] = [];

  // Get the y position of zero (the baseline for bars)
  const yZero = scales.y(0);

  data.forEach((d, i) => {
    const category = String(d[config.x.field]);
    const value = d[config.y.field] as number;

    const x = chartArea.x + (xScale(category) ?? 0);

    let barY: number;
    let barHeight: number;

    if (value >= 0) {
      // Positive values: bar goes from value down to zero
      barY = scales.y(value);
      barHeight = yZero - barY;
    } else {
      // Negative values: bar goes from zero down to value
      barY = yZero;
      barHeight = scales.y(value) - yZero;
    }

    const color = scales.color
      ? scales.color(
          config.segment ? String(d[config.segment.field]) : category
        )
      : getDefaultColor(i);

    shapes.push({
      type: "bar",
      x,
      y: barY,
      width: bandwidth,
      height: barHeight,
      category,
      fill: color,
      stroke: "#fff",
      strokeWidth: 1,
      datum: d,
      index: i,
    } as BarShape);
  });

  return shapes;
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/core && npm test -- --run --reporter=verbose test/shapes/index.test.ts`
Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/core/src/shapes/index.ts packages/core/test/shapes/index.test.ts
git commit -m "fix(core): correct bar height calculation for negative values

Use y=0 as baseline and calculate bar position/height based on value sign.
Positive bars extend upward from baseline, negative bars extend downward.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Add CSV Field Length Protection

**Files:**
- Modify: `packages/connectors/src/csv/index.ts:21-42`
- Test: `packages/connectors/test/csv/index.test.ts`

**Step 1: Write the failing test**

Add to `packages/connectors/test/csv/index.test.ts`:

```typescript
describe("edge cases", () => {
  it("should throw on excessively long field", async () => {
    // Create a CSV with a very long field (200KB)
    const longValue = "a".repeat(200000);
    const mockCsv = `name,value\n"${longValue}",100`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    await expect(
      csvConnector.fetch({ url: "https://example.com/data.csv" })
    ).rejects.toThrow("CSV field exceeds maximum length");
  });

  it("should accept fields at maximum length", async () => {
    // Create a CSV with a field at the limit (100KB - some margin for header)
    const longValue = "a".repeat(90000);
    const mockCsv = `name,value\n"${longValue}",100`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/data.csv",
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe(longValue);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/connectors && npm test -- --run --reporter=verbose test/csv/index.test.ts`
Expected: Test fails - no error thrown for long fields

**Step 3: Write minimal implementation**

Modify `packages/connectors/src/csv/index.ts`:

Add constant at top of file after imports:

```typescript
/** Maximum allowed length for a single CSV field (100KB) */
const MAX_FIELD_LENGTH = 100000;
```

Update `parseCsv` function (lines 21-42):

```typescript
/**
 * Parse CSV text into rows
 * @throws Error if a field exceeds MAX_FIELD_LENGTH
 */
function parseCsv(text: string, delimiter = ","): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line, lineIndex) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
        if (current.length > MAX_FIELD_LENGTH) {
          throw new Error(
            `CSV field exceeds maximum length of ${MAX_FIELD_LENGTH} characters at line ${lineIndex + 1}`
          );
        }
      }
    }
    result.push(current);
    return result;
  });
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/connectors && npm test -- --run --reporter=verbose test/csv/index.test.ts`
Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/connectors/src/csv/index.ts packages/connectors/test/csv/index.test.ts
git commit -m "fix(connectors): add field length protection to CSV parser

Add MAX_FIELD_LENGTH limit (100KB) to prevent memory exhaustion from
malformed CSVs with excessively long quoted fields.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Fix LineChart Type Safety

**Files:**
- Modify: `packages/react/src/charts/LineChart.tsx`
- Test: `packages/react/test/charts/LineChart.test.tsx`

**Step 1: Write the failing test**

Add to `packages/react/test/charts/LineChart.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineChart } from "../../src/charts/LineChart";
import type { Datum } from "@vizualni/core";

describe("LineChart", () => {
  const mockData: Datum[] = [
    { date: new Date("2024-01-01"), value: 10 },
    { date: new Date("2024-02-01"), value: 20 },
    { date: new Date("2024-03-01"), value: 30 },
  ];

  it("should render without crashing", () => {
    const config = {
      type: "line" as const,
      x: { field: "date", type: "date" as const },
      y: { field: "value", type: "number" as const },
    };

    const { container } = render(
      <LineChart data={mockData} config={config} width={600} height={400} />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render with aria-label", () => {
    const config = {
      type: "line" as const,
      x: { field: "date", type: "date" as const },
      y: { field: "value", type: "number" as const },
    };

    render(
      <LineChart data={mockData} config={config} width={600} height={400} />
    );

    expect(screen.getByRole("img", { name: /line chart/i })).toBeInTheDocument();
  });

  it("should handle empty data gracefully", () => {
    const config = {
      type: "line" as const,
      x: { field: "date", type: "date" as const },
      y: { field: "value", type: "number" as const },
    };

    const { container } = render(
      <LineChart data={[]} config={config} width={600} height={400} />
    );

    // Should still render SVG structure even with empty data
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should use continuous scale accessor for x values", () => {
    const config = {
      type: "line" as const,
      x: { field: "date", type: "date" as const },
      y: { field: "value", type: "number" as const },
    };

    // This test ensures the component doesn't crash with valid config
    const { container } = render(
      <LineChart data={mockData} config={config} width={600} height={400} />
    );

    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify current behavior**

Run: `cd packages/react && npm test -- --run --reporter=verbose test/charts/LineChart.test.tsx`
Expected: Tests may pass or fail depending on current implementation

**Step 3: Write minimal implementation**

Modify `packages/react/src/charts/LineChart.tsx`:

```typescript
import type { ScaleTime, ScaleLinear } from "d3-scale";
import { useChart } from "../hooks/useChart";
import { XAxis, YAxis } from "../svg/Axes";
import { LinePath } from "../svg/LinePath";
import type { LineChartConfig, Datum } from "@vizualni/core";

export interface LineChartProps {
  data: Datum[];
  config: LineChartConfig;
  width: number;
  height: number;
  className?: string;
}

/**
 * Type guard to check if scale is a continuous scale (time or linear)
 */
function isContinuousScale(
  scale: unknown
): scale is ScaleTime<number, number> | ScaleLinear<number, number> {
  return (
    typeof scale === "function" &&
    "invert" in scale &&
    typeof (scale as { invert: unknown }).invert === "function"
  );
}

/**
 * Line chart component
 */
export function LineChart({
  data,
  config,
  width,
  height,
  className,
}: LineChartProps) {
  const { scales, layout } = useChart(data, config, { width, height });

  // Validate that we have a continuous scale for x-axis
  if (!isContinuousScale(scales.x)) {
    console.warn(
      "LineChart expects a continuous x-scale (time or linear). " +
        "Ensure config.x.type is 'date' or 'number'."
    );
  }

  // Type-safe accessor that works with any continuous scale
  const getX = (d: Datum) => {
    const val = d[config.x.field];
    // scales.x is typed to accept Date | number for continuous scales
    return scales.x(val as Date | number);
  };

  const getY = (d: Datum) => scales.y(d[config.y.field] as number);

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Line chart"
    >
      <g transform={`translate(${layout.chartArea.x}, ${layout.chartArea.y})`}>
        <LinePath data={data} x={getX} y={getY} />
      </g>
      <XAxis scale={scales.x as ScaleTime<number, number>} height={layout.chartArea.height} />
      <YAxis scale={scales.y} />
    </svg>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/react && npm test -- --run --reporter=verbose test/charts/LineChart.test.tsx`
Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/react/src/charts/LineChart.tsx packages/react/test/charts/LineChart.test.tsx
git commit -m "fix(react): add type safety to LineChart scale handling

Add type guard for continuous scales and dev warning for incorrect config.
Use type-safe accessor that works with Date | number x-values.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Run Full Test Suite and Fix Any Regressions

**Files:**
- All packages

**Step 1: Run all tests**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && yarn test`
Expected: All tests pass

**Step 2: Run type checking**

Run: `cd packages/core && npm run typecheck && cd ../connectors && npm run typecheck && cd ../react && npm run typecheck`
Expected: No TypeScript errors

**Step 3: Commit any fixes**

If any issues found:
```bash
git add -A
git commit -m "fix: address test regressions from critical fixes

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Create Summary Commit and Tag

**Step 1: Create summary**

Run: `git log --oneline HEAD~5..HEAD`

**Step 2: Create annotated tag**

```bash
git tag -a v0.1.0-alpha.1 -m "Critical fixes for pre-release

- Fix empty data crash in computeLineScales
- Fix empty data crash in computeBarScales
- Fix negative bar height calculation
- Add CSV field length protection
- Add LineChart type safety"
```

---

## Acceptance Criteria

Before marking complete:

- [ ] `yarn test` passes in all packages
- [ ] `npm run typecheck` passes in all packages
- [ ] Empty data doesn't crash any chart type
- [ ] Negative bar values render correctly
- [ ] CSV parser rejects excessively long fields
- [ ] LineChart handles scale types gracefully
