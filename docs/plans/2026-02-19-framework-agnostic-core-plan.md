# Framework-Agnostic Core Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Create `@vizualni/core` - a framework-agnostic visualization library
with pure functions for scale computation, data transforms, and layout.

**Architecture:** Pure TypeScript functions that take data + config and return
rendering instructions. Zero dependencies on React, DOM, or runtime
environments.

**Tech Stack:** TypeScript, Zod, d3-scale, d3-array, Vitest, tsup, pnpm
workspaces

---

## Phase 1: Project Setup

### Task 1: Create Monorepo Structure

**Files:**

- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/vitest.config.ts`
- Create: `pnpm-workspace.yaml`
- Modify: `package.json` (add workspaces config)

**Step 1: Create pnpm workspace config**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
```

**Step 2: Create packages directory structure**

```bash
mkdir -p packages/core/src packages/core/test
```

**Step 3: Create core package.json**

Create `packages/core/package.json`:

```json
{
  "name": "@vizualni/core",
  "version": "0.1.0-alpha.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "d3-array": "^3.2.0",
    "d3-scale": "^4.0.2",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/d3-array": "^3.2.1",
    "@types/d3-scale": "^4.0.8",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^3.2.4"
  }
}
```

**Step 4: Create core tsconfig.json**

Create `packages/core/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

**Step 5: Create vitest config**

Create `packages/core/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    globals: true,
  },
});
```

**Step 6: Install dependencies**

```bash
pnpm install
```

**Step 7: Commit**

```bash
git add pnpm-workspace.yaml packages/core/
git commit -m "feat(core): initialize @vizualni/core package"
```

---

### Task 2: Create Core Types

**Files:**

- Create: `packages/core/src/types/index.ts`
- Create: `packages/core/test/types.test.ts`

**Step 1: Write the failing test**

Create `packages/core/test/types.test.ts`:

```typescript
import { describe, it, expectTypeOf } from "vitest";
import type { Datum, ChartData, Field } from "../src/types";

describe("Core Types", () => {
  it("Datum should accept record of values", () => {
    const datum: Datum = {
      x: new Date("2024-01-01"),
      y: 42,
      category: "A",
    };
    expectTypeOf(datum).toMatchTypeOf<Datum>();
  });

  it("Field should define field schema", () => {
    const field: Field = {
      name: "x",
      type: "date",
      title: "Date",
    };
    expectTypeOf(field).toMatchTypeOf<Field>();
  });

  it("ChartData should accept data and schema", () => {
    const chartData: ChartData = {
      data: [{ x: 1, y: 2 }],
      schema: {
        fields: [
          { name: "x", type: "number" },
          { name: "y", type: "number" },
        ],
      },
    };
    expectTypeOf(chartData).toMatchTypeOf<ChartData>();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && pnpm test
```

Expected: FAIL with "Cannot find module '../src/types'"

**Step 3: Write minimal implementation**

Create `packages/core/src/types/index.ts`:

```typescript
/**
 * A single data point - a record of arbitrary values
 */
export type Datum = Record<string, unknown>;

/**
 * Field type enumeration
 */
export type FieldType = "string" | "number" | "date" | "boolean";

/**
 * Schema for a single field/column
 */
export interface Field {
  /** Field name/key in data */
  name: string;
  /** Data type */
  type: FieldType;
  /** Human-readable title */
  title?: string;
  /** Description */
  description?: string;
}

/**
 * Schema describing data structure
 */
export interface DataSchema {
  fields: Field[];
}

/**
 * Chart data with schema
 */
export interface ChartData {
  /** Array of data records */
  data: Datum[];
  /** Schema describing the data */
  schema: DataSchema;
}

/**
 * Margin dimensions
 */
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Rectangle dimensions
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Chart dimensions
 */
export interface Dimensions {
  /** Total width */
  width: number;
  /** Total height */
  height: number;
  /** Margins */
  margins: Margins;
  /** Chart area (excluding margins) */
  chartArea: Rect;
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && pnpm test
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/types/ packages/core/test/types.test.ts
git commit -m "feat(core): add core types (Datum, Field, Schema)"
```

---

### Task 3: Create Chart Config Schema with Zod

**Files:**

- Create: `packages/core/src/config/index.ts`
- Create: `packages/core/test/config.test.ts`

**Step 1: Write the failing test**

Create `packages/core/test/config.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { ChartConfigSchema, LineChartConfigSchema } from "../src/config";

describe("Chart Config Schema", () => {
  describe("LineChartConfigSchema", () => {
    it("should validate a minimal line chart config", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should require x and y fields", () => {
      const config = {
        type: "line",
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it("should accept optional segment field", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
        segment: { field: "category", type: "string" },
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  describe("ChartConfigSchema", () => {
    it("should discriminate between chart types", () => {
      const lineConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };
      const result = ChartConfigSchema.safeParse(lineConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("line");
      }
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && pnpm test
```

Expected: FAIL with "Cannot find module '../src/config'"

**Step 3: Write minimal implementation**

Create `packages/core/src/config/index.ts`:

```typescript
import { z } from "zod";

/**
 * Encoding field schema (x, y, segment, etc.)
 */
const EncodingFieldSchema = z.object({
  /** Field name in data */
  field: z.string(),
  /** Field type */
  type: z.enum(["string", "number", "date", "boolean"]),
  /** Human-readable label */
  label: z.string().optional(),
  /** Custom format string */
  format: z.string().optional(),
});

export type EncodingField = z.infer<typeof EncodingFieldSchema>;

/**
 * Line chart configuration
 */
export const LineChartConfigSchema = z.object({
  type: z.literal("line"),
  x: EncodingFieldSchema,
  y: EncodingFieldSchema,
  segment: EncodingFieldSchema.optional(),
  /** Show dots on line */
  showDots: z.boolean().optional(),
  /** Curve type */
  curve: z.enum(["linear", "step", "cardinal", "monotone"]).optional(),
});

export type LineChartConfig = z.infer<typeof LineChartConfigSchema>;

/**
 * Bar chart configuration
 */
export const BarChartConfigSchema = z.object({
  type: z.literal("bar"),
  x: EncodingFieldSchema,
  y: EncodingFieldSchema,
  segment: EncodingFieldSchema.optional(),
  /** Bar orientation */
  orientation: z
    .enum(["vertical", "horizontal"])
    .optional()
    .default("vertical"),
  /** Stack mode */
  stack: z.enum(["none", "stacked", "grouped"]).optional().default("none"),
});

export type BarChartConfig = z.infer<typeof BarChartConfigSchema>;

/**
 * Pie chart configuration
 */
export const PieConfigSchema = z.object({
  type: z.literal("pie"),
  value: EncodingFieldSchema,
  category: EncodingFieldSchema,
  /** Inner radius for donut charts (0-1 as proportion) */
  innerRadius: z.number().min(0).max(1).optional(),
});

export type PieConfig = z.infer<typeof PieConfigSchema>;

/**
 * Union of all chart configuration types
 */
export const ChartConfigSchema = z.discriminatedUnion("type", [
  LineChartConfigSchema,
  BarChartConfigSchema,
  PieConfigSchema,
]);

export type ChartConfig = z.infer<typeof ChartConfigSchema>;
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && pnpm test
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/config/ packages/core/test/config.test.ts
git commit -m "feat(core): add chart config schema with Zod"
```

---

## Phase 2: Scale Computation

### Task 4: Create Linear Scale Factory

**Files:**

- Create: `packages/core/src/scales/linear.ts`
- Create: `packages/core/test/scales/linear.test.ts`

**Step 1: Write the failing test**

Create `packages/core/test/scales/linear.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { createLinearScale } from "../../src/scales/linear";

describe("createLinearScale", () => {
  it("should create a linear scale with domain and range", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
    });

    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(250);
    expect(scale(100)).toBe(500);
  });

  it("should handle inverted range", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [400, 0],
    });

    expect(scale(0)).toBe(400);
    expect(scale(50)).toBe(200);
    expect(scale(100)).toBe(0);
  });

  it("should handle negative domain values", () => {
    const scale = createLinearScale({
      domain: [-50, 50],
      range: [0, 100],
    });

    expect(scale(-50)).toBe(0);
    expect(scale(0)).toBe(50);
    expect(scale(50)).toBe(100);
  });

  it("should clamp values when clamp is true", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
      clamp: true,
    });

    expect(scale(-10)).toBe(0);
    expect(scale(110)).toBe(500);
  });

  it("should return nice values for nice option", () => {
    const scale = createLinearScale({
      domain: [3, 97],
      range: [0, 500],
      nice: true,
    });

    // Nice should round to clean values
    const domain = scale.domain();
    expect(domain[0]).toBeLessThanOrEqual(3);
    expect(domain[1]).toBeGreaterThanOrEqual(97);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && pnpm test
```

Expected: FAIL with "Cannot find module '../../src/scales/linear'"

**Step 3: Write minimal implementation**

Create `packages/core/src/scales/linear.ts`:

```typescript
import { scaleLinear } from "d3-scale";

export interface LinearScaleOptions {
  /** Input domain [min, max] */
  domain: [number, number];
  /** Output range [min, max] */
  range: [number, number];
  /** Clamp output to range */
  clamp?: boolean;
  /** Round domain to nice values */
  nice?: boolean | number;
}

/**
 * Creates a linear scale function
 */
export function createLinearScale(options: LinearScaleOptions) {
  const { domain, range, clamp = false, nice = false } = options;

  const scale = scaleLinear().domain(domain).range(range).clamp(clamp);

  if (nice) {
    scale.nice(typeof nice === "number" ? nice : 10);
  }

  return scale;
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && pnpm test
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/scales/ packages/core/test/scales/
git commit -m "feat(core): add linear scale factory"
```

---

### Task 5: Create Time Scale Factory

**Files:**

- Create: `packages/core/src/scales/time.ts`
- Create: `packages/core/test/scales/time.test.ts`

**Step 1: Write the failing test**

Create `packages/core/test/scales/time.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { createTimeScale } from "../../src/scales/time";

describe("createTimeScale", () => {
  it("should create a time scale with date domain", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
    });

    expect(scale(new Date("2024-01-01"))).toBe(0);
    expect(scale(new Date("2024-12-31"))).toBeCloseTo(500, 1);
  });

  it("should map mid-year date correctly", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
    });

    // July 2nd should be approximately middle
    const midYear = scale(new Date("2024-07-02"));
    expect(midYear).toBeGreaterThan(240);
    expect(midYear).toBeLessThan(260);
  });

  it("should handle inverted range for y-axis", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [400, 0],
    });

    expect(scale(new Date("2024-01-01"))).toBe(400);
    expect(scale(new Date("2024-12-31"))).toBeCloseTo(0, 1);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && pnpm test
```

Expected: FAIL

**Step 3: Write minimal implementation**

Create `packages/core/src/scales/time.ts`:

```typescript
import { scaleTime } from "d3-scale";

export interface TimeScaleOptions {
  /** Input domain [min date, max date] */
  domain: [Date, Date];
  /** Output range [min, max] */
  range: [number, number];
  /** Clamp output to range */
  clamp?: boolean;
  /** Round domain to nice intervals */
  nice?:
    | boolean
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "year";
}

/**
 * Creates a time scale function
 */
export function createTimeScale(options: TimeScaleOptions) {
  const { domain, range, clamp = false, nice = false } = options;

  const scale = scaleTime().domain(domain).range(range).clamp(clamp);

  if (nice) {
    if (typeof nice === "string") {
      const intervalMap: Record<string, number> = {
        second: 1,
        minute: 2,
        hour: 3,
        day: 4,
        week: 5,
        month: 6,
        year: 7,
      };
      scale.nice(intervalMap[nice] || 10);
    } else {
      scale.nice();
    }
  }

  return scale;
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && pnpm test
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/scales/time.ts packages/core/test/scales/time.test.ts
git commit -m "feat(core): add time scale factory"
```

---

### Task 6: Create Ordinal/Color Scale Factory

**Files:**

- Create: `packages/core/src/scales/ordinal.ts`
- Create: `packages/core/test/scales/ordinal.test.ts`

**Step 1: Write the failing test**

Create `packages/core/test/scales/ordinal.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { createOrdinalScale, createColorScale } from "../../src/scales/ordinal";

describe("createOrdinalScale", () => {
  it("should map domain values to range", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B", "C"],
      range: [10, 20, 30],
    });

    expect(scale("A")).toBe(10);
    expect(scale("B")).toBe(20);
    expect(scale("C")).toBe(30);
  });

  it("should handle unknown values by cycling", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B"],
      range: [10, 20],
    });

    expect(scale("A")).toBe(10);
    expect(scale("D")).toBe(10); // Cycles back
  });
});

describe("createColorScale", () => {
  it("should create a color scale from domain", () => {
    const scale = createColorScale({
      domain: ["A", "B", "C"],
      range: ["#4e79a7", "#f28e2c", "#e15759"],
    });

    expect(scale("A")).toBe("#4e79a7");
    expect(scale("B")).toBe("#f28e2c");
    expect(scale("C")).toBe("#e15759");
  });

  it("should infer domain from data when not provided", () => {
    const scale = createColorScale({
      data: [{ cat: "A" }, { cat: "B" }, { cat: "A" }, { cat: "C" }],
      field: "cat",
      range: ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2"],
    });

    expect(scale.domain()).toEqual(["A", "B", "C"]);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && pnpm test
```

Expected: FAIL

**Step 3: Write minimal implementation**

Create `packages/core/src/scales/ordinal.ts`:

```typescript
import { scaleOrdinal } from "d3-scale";
import { uniq } from "d3-array";
import type { Datum } from "../types";

export interface OrdinalScaleOptions {
  /** Input domain (categories) */
  domain?: string[];
  /** Output range */
  range: (string | number)[];
}

export interface ColorScaleOptions {
  /** Pre-defined domain */
  domain?: string[];
  /** Data to infer domain from */
  data?: Datum[];
  /** Field key for domain inference */
  field?: string;
  /** Color palette */
  range: string[];
}

/**
 * Creates an ordinal scale function
 */
export function createOrdinalScale(options: OrdinalScaleOptions) {
  const { domain = [], range } = options;

  return scaleOrdinal<string, string | number>().domain(domain).range(range);
}

/**
 * Creates a color scale (ordinal scale with color range)
 */
export function createColorScale(options: ColorScaleOptions) {
  const { domain: providedDomain, data, field, range } = options;

  // Infer domain from data if not provided
  let domain = providedDomain;
  if (!domain && data && field) {
    domain = uniq(data.map((d) => String(d[field])));
  }

  return scaleOrdinal<string, string>()
    .domain(domain || [])
    .range(range);
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && pnpm test
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/scales/ordinal.ts packages/core/test/scales/ordinal.test.ts
git commit -m "feat(core): add ordinal and color scale factories"
```

---

### Task 7: Create Scale Index Barrel Export

**Files:**

- Create: `packages/core/src/scales/index.ts`
- Create: `packages/core/test/scales/index.test.ts`

**Step 1: Write the failing test**

Create `packages/core/test/scales/index.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { computeScales } from "../../src/scales";
import type { ChartConfig, Datum } from "../../src/types";

describe("computeScales", () => {
  const data: Datum[] = [
    { date: new Date("2024-01-01"), value: 10, category: "A" },
    { date: new Date("2024-02-01"), value: 20, category: "B" },
    { date: new Date("2024-03-01"), value: 30, category: "A" },
  ];

  it("should compute scales for line chart", () => {
    const config: ChartConfig = {
      type: "line",
      x: { field: "date", type: "date" },
      y: { field: "value", type: "number" },
    };

    const scales = computeScales(data, config, { width: 600, height: 400 });

    expect(scales.x).toBeDefined();
    expect(scales.y).toBeDefined();
    expect(scales.x.domain().length).toBe(2);
    expect(scales.y.domain()[0]).toBe(0);
    expect(scales.y.domain()[1]).toBeGreaterThanOrEqual(30);
  });

  it("should compute color scale when segment is present", () => {
    const config: ChartConfig = {
      type: "line",
      x: { field: "date", type: "date" },
      y: { field: "value", type: "number" },
      segment: { field: "category", type: "string" },
    };

    const scales = computeScales(data, config, { width: 600, height: 400 });

    expect(scales.color).toBeDefined();
    expect(scales.color?.domain()).toEqual(["A", "B"]);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && pnpm test
```

Expected: FAIL

**Step 3: Write minimal implementation**

Create `packages/core/src/scales/index.ts`:

```typescript
import { extent, max } from "d3-array";
import type { ChartConfig, Datum, Dimensions } from "../types";
import { createLinearScale } from "./linear";
import { createTimeScale } from "./time";
import { createColorScale } from "./ordinal";

export * from "./linear";
export * from "./time";
export * from "./ordinal";

export interface Scales {
  x: ReturnType<typeof createTimeScale> | ReturnType<typeof createLinearScale>;
  y: ReturnType<typeof createLinearScale>;
  color?: ReturnType<typeof createColorScale>;
}

export interface ComputeScalesOptions extends Dimensions {}

/**
 * Computes all scales needed for a chart based on data and config
 */
export function computeScales(
  data: Datum[],
  config: ChartConfig,
  options: ComputeScalesOptions
): Scales {
  const {
    width,
    height,
    margins = { top: 30, right: 30, bottom: 50, left: 60 },
  } = options;

  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  if (config.type === "line") {
    return computeLineScales(data, config, chartWidth, chartHeight);
  }

  if (config.type === "bar") {
    return computeBarScales(data, config, chartWidth, chartHeight);
  }

  if (config.type === "pie") {
    return computePieScales(data, config);
  }

  throw new Error(`Unknown chart type: ${(config as { type: string }).type}`);
}

function computeLineScales(
  data: Datum[],
  config: Extract<ChartConfig, { type: "line" }>,
  chartWidth: number,
  chartHeight: number
): Scales {
  // X scale (time)
  const xExtent = extent(data, (d) => d[config.x.field] as Date);
  const xScale = createTimeScale({
    domain: xExtent as [Date, Date],
    range: [0, chartWidth],
    nice: true,
  });

  // Y scale (linear)
  const yMax = max(data, (d) => d[config.y.field] as number) ?? 0;
  const yScale = createLinearScale({
    domain: [0, yMax],
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

function computeBarScales(
  data: Datum[],
  config: Extract<ChartConfig, { type: "bar" }>,
  chartWidth: number,
  chartHeight: number
): Scales {
  const yMax = max(data, (d) => d[config.y.field] as number) ?? 0;
  const yScale = createLinearScale({
    domain: [0, yMax],
    range: [chartHeight, 0],
    nice: true,
  });

  // For bar charts, x is typically categorical - simplified for now
  const xScale = createLinearScale({
    domain: [0, data.length],
    range: [0, chartWidth],
  });

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

function computePieScales(
  data: Datum[],
  config: Extract<ChartConfig, { type: "pie" }>
): Scales {
  const colorScale = createColorScale({
    data,
    field: config.category.field,
    range: getDefaultColors(),
  });

  // Pie doesn't need x/y scales, return dummy scales
  const dummyScale = createLinearScale({
    domain: [0, 1],
    range: [0, 1],
  });

  return { x: dummyScale, y: dummyScale, color: colorScale };
}

/**
 * Default color palette (tableau10)
 */
function getDefaultColors(): string[] {
  return [
    "#4e79a7",
    "#f28e2c",
    "#e15759",
    "#76b7b2",
    "#59a14f",
    "#edc949",
    "#af7aa1",
    "#ff9da7",
    "#9c755f",
    "#bab0ab",
  ];
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && pnpm test
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/scales/index.ts packages/core/test/scales/index.test.ts
git commit -m "feat(core): add computeScales function for chart scale computation"
```

---

## Phase 3: Layout Computation

### Task 8: Create Layout Computation

**Files:**

- Create: `packages/core/src/layout/index.ts`
- Create: `packages/core/test/layout/index.test.ts`

**Step 1: Write the failing test**

Create `packages/core/test/layout/index.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { computeLayout } from "../../src/layout";
import type { ChartConfig } from "../../src/config";

describe("computeLayout", () => {
  it("should compute chart dimensions with default margins", () => {
    const config: ChartConfig = {
      type: "line",
      x: { field: "date", type: "date" },
      y: { field: "value", type: "number" },
    };

    const layout = computeLayout(config, { width: 600, height: 400 });

    expect(layout.width).toBe(600);
    expect(layout.height).toBe(400);
    expect(layout.margins.left).toBe(60);
    expect(layout.margins.bottom).toBe(50);
    expect(layout.chartArea.x).toBe(60);
    expect(layout.chartArea.width).toBe(600 - 60 - 30); // width - left - right
  });

  it("should compute chart area correctly", () => {
    const config: ChartConfig = {
      type: "line",
      x: { field: "date", type: "date" },
      y: { field: "value", type: "number" },
    };

    const layout = computeLayout(config, { width: 800, height: 500 });

    expect(layout.chartArea.x).toBe(layout.margins.left);
    expect(layout.chartArea.y).toBe(layout.margins.top);
    expect(layout.chartArea.width).toBe(
      800 - layout.margins.left - layout.margins.right
    );
    expect(layout.chartArea.height).toBe(
      500 - layout.margins.top - layout.margins.bottom
    );
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && pnpm test
```

Expected: FAIL

**Step 3: Write minimal implementation**

Create `packages/core/src/layout/index.ts`:

```typescript
import type { ChartConfig, Dimensions, Margins, Rect } from "../types";

export interface Layout extends Dimensions {}

export interface ComputeLayoutOptions {
  width: number;
  height: number;
  margins?: Partial<Margins>;
}

/**
 * Default margins for charts
 */
const DEFAULT_MARGINS: Margins = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 60,
};

/**
 * Computes chart layout dimensions
 */
export function computeLayout(
  config: ChartConfig,
  options: ComputeLayoutOptions
): Layout {
  const { width, height, margins: customMargins } = options;

  const margins: Margins = {
    ...DEFAULT_MARGINS,
    ...customMargins,
  };

  const chartArea: Rect = {
    x: margins.left,
    y: margins.top,
    width: width - margins.left - margins.right,
    height: height - margins.top - margins.bottom,
  };

  return {
    width,
    height,
    margins,
    chartArea,
  };
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && pnpm test
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/layout/ packages/core/test/layout/
git commit -m "feat(core): add layout computation"
```

---

## Phase 4: Main Entry Point

### Task 9: Create Main Index Export

**Files:**

- Create: `packages/core/src/index.ts`

**Step 1: Create barrel export**

Create `packages/core/src/index.ts`:

```typescript
// Types
export * from "./types";

// Config
export * from "./config";

// Scales
export * from "./scales";

// Layout
export * from "./layout";
```

**Step 2: Verify build works**

```bash
cd packages/core && pnpm build
```

Expected: No errors, creates dist/

**Step 3: Run all tests**

```bash
cd packages/core && pnpm test
```

Expected: All tests pass

**Step 4: Commit**

```bash
git add packages/core/src/index.ts
git commit -m "feat(core): add main entry point exports"
```

---

## Phase 5: CI/CD Setup

### Task 10: Add Changesets Configuration

**Files:**

- Create: `.changeset/config.json`
- Create: `packages/core/CHANGELOG.md`

**Step 1: Create changeset config**

Create `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**Step 2: Create initial changelog**

Create `packages/core/CHANGELOG.md`:

```markdown
# @vizualni/core

## 0.1.0-alpha.0

### Initial Release

- Core types: Datum, Field, DataSchema, Dimensions
- Chart config schema with Zod validation
- Scale factories: linear, time, ordinal, color
- `computeScales` function for chart scale computation
- `computeLayout` function for chart dimensions
```

**Step 3: Add changeset scripts to root package.json**

Add to root `package.json` scripts:

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

**Step 4: Commit**

```bash
git add .changeset/ packages/core/CHANGELOG.md package.json
git commit -m "chore: add changesets configuration"
```

---

## Summary

This plan creates the foundation for `@vizualni/core`:

| Phase      | Tasks | Deliverable                                  |
| ---------- | ----- | -------------------------------------------- |
| 1. Setup   | 1-3   | Monorepo, types, config schema               |
| 2. Scales  | 4-7   | Linear, time, ordinal scales + computeScales |
| 3. Layout  | 8     | computeLayout function                       |
| 4. Exports | 9     | Main entry point                             |
| 5. CI/CD   | 10    | Changesets configuration                     |

**Estimated time:** 2-3 days

**Next phases (not in this plan):**

- Phase 2: React bindings (`@vizualni/react`)
- Phase 3: Data connectors (`@vizualni/connectors`)
- Phase 4: Feature parity (maps, combos, scatterplots)
