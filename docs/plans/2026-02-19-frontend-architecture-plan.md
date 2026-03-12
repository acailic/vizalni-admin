# Frontend Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Introduce three structural improvements — an explicit D3 boundary
contract, a unified Zustand slice store, and a chart-type feature registry —
validated end-to-end on the bar chart before rolling out to other chart types.

**Architecture:** Incremental adoption. Each phase leaves the app working. The
D3 boundary wraps existing calls without breaking them. The Zustand slice runs
alongside the existing reducer until trusted, then replaces it. The bar chart
moves into a feature folder as a proof-of-concept; remaining chart types follow
the same pattern.

**Tech Stack:** TypeScript, React, D3 (d3-selection, d3-array, d3-scale),
Zustand 5 (immer middleware built-in), Zod, Vitest

---

## Phase 1 — Explicit D3 Boundary

### Task 1: Create `d3-boundary.ts` with types and hook

**Files:**

- Create: `app/charts/shared/d3-boundary.ts`
- Create: `app/charts/shared/__tests__/d3-boundary.spec.ts`

**Context:** Currently every chart hands a raw DOM ref to D3 inside `useEffect`
with no shared contract. This task introduces `D3RenderFn<TData>` and
`useD3Render` — the typed boundary every chart will implement.

The existing `RenderOptions` in `app/charts/shared/rendering-utils.ts` is:

```typescript
export type RenderOptions = {
  transition: Pick<TransitionStore, "enable" | "duration">;
};
```

Import and re-use it rather than inventing a new type.

**Step 1: Write the failing test**

```typescript
// app/charts/shared/__tests__/d3-boundary.spec.ts
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useD3Render } from "@/charts/shared/d3-boundary";

describe("useD3Render", () => {
  it("calls renderFn with a d3 selection when ref is attached", () => {
    const renderFn = vi.fn();
    const data = [{ key: "a", value: 1 }];
    const opts = { transition: { enable: false, duration: 0 } };

    const { result } = renderHook(() => {
      const ref = useRef<SVGGElement>(null);
      // Attach a real element so the ref is not null
      Object.defineProperty(ref, "current", {
        value: document.createElementNS("http://www.w3.org/2000/svg", "g"),
        writable: true,
      });
      useD3Render(ref, renderFn, data, opts);
      return ref;
    });

    expect(renderFn).toHaveBeenCalledOnce();
    expect(renderFn.mock.calls[0][1]).toBe(data);
    expect(renderFn.mock.calls[0][2]).toBe(opts);
  });

  it("does not call renderFn when ref is null", () => {
    const renderFn = vi.fn();
    const data: unknown[] = [];
    const opts = { transition: { enable: false, duration: 0 } };

    renderHook(() => {
      const ref = useRef<SVGGElement>(null);
      // ref.current stays null (not attached to DOM)
      useD3Render(ref, renderFn, data, opts);
    });

    expect(renderFn).not.toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/charts/shared/__tests__/d3-boundary.spec.ts
```

Expected: FAIL — `Cannot find module '@/charts/shared/d3-boundary'`

**Step 3: Write the implementation**

```typescript
// app/charts/shared/d3-boundary.ts
import { select, Selection } from "d3-selection";
import { RefObject, useEffect } from "react";

import { RenderOptions } from "@/charts/shared/rendering-utils";

export type D3Selection = Selection<SVGGElement, unknown, null, undefined>;

/**
 * The contract every chart's render function must satisfy.
 * A pure TypeScript function — no React, no hooks.
 * Testable with jsdom and no React wrapper.
 */
export type D3RenderFn<TData> = (
  g: D3Selection,
  data: TData,
  opts: RenderOptions
) => void;

/**
 * Manages the useEffect lifecycle at the React/D3 boundary.
 * Every chart that renders with D3 calls this hook exactly once.
 */
export function useD3Render<TData>(
  ref: RefObject<SVGGElement>,
  renderFn: D3RenderFn<TData>,
  data: TData,
  opts: RenderOptions
): void {
  useEffect(() => {
    if (!ref.current) return;
    renderFn(select(ref.current) as D3Selection, data, opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, opts, renderFn]);
}
```

**Step 4: Run test to verify it passes**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/charts/shared/__tests__/d3-boundary.spec.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/shared/d3-boundary.ts app/charts/shared/__tests__/d3-boundary.spec.ts
git commit -m "feat(charts): add D3RenderFn contract and useD3Render hook"
```

---

### Task 2: Wrap bar chart `ErrorWhiskers` with `useD3Render`

**Files:**

- Modify: `app/charts/bar/bars.tsx`

**Context:** `bars.tsx` is the first chart component to adopt the new boundary.
`ErrorWhiskers` is the simplest self-contained D3 render call in that file — it
calls `renderContainer` inside `useEffect`. This task replaces that pattern with
`useD3Render` to prove the contract works in production code without breaking
anything.

Look at `bars.tsx` — the `ErrorWhiskers` component contains:

```typescript
const ref = useRef<SVGGElement>(null);
useEffect(() => {
  // ... calls renderContainer with ref.current
}, [...]);
```

**Step 1: No test needed** — the existing E2E tests and Vitest integration tests
cover rendering. Instead verify the TypeScript compiles cleanly.

**Step 2: Update `ErrorWhiskers` in `bars.tsx`**

Find the `ErrorWhiskers` component. Replace the `useEffect` + `renderContainer`
call with `useD3Render`. The render logic stays identical — only the lifecycle
wrapper changes.

```typescript
// In ErrorWhiskers, replace:
useEffect(() => {
  if (!ref.current) return;
  renderContainer(ref.current, {
    id: "error-whiskers",
    // ...
  });
}, [...deps]);

// With:
import { useD3Render, D3Selection } from "@/charts/shared/d3-boundary";

const renderErrorWhiskers: D3RenderFn<RenderHorizontalWhiskerDatum[]> = (
  g,
  data,
  opts
) => {
  // same logic, but `g` is the d3 Selection instead of ref.current
  renderHorizontalWhisker(g, data, opts);
};

useD3Render(ref, renderErrorWhiskers, whiskerData, renderOpts);
```

**Step 3: Verify TypeScript**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn typecheck 2>&1 | grep bars.tsx
```

Expected: no errors on `bars.tsx`

**Step 4: Run existing tests**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/charts
```

Expected: all passing

**Step 5: Commit**

```bash
git add app/charts/bar/bars.tsx
git commit -m "refactor(charts): adopt useD3Render in ErrorWhiskers"
```

---

## Phase 2 — Zustand Configurator Slice

### Task 3: Create the configurator Zustand slice

**Files:**

- Create: `app/stores/slices/configurator.ts`
- Create: `app/stores/slices/__tests__/configurator.spec.ts`

**Context:** The existing `useImmerReducer` + Context pattern lives in
`app/configurator/configurator-state/reducer.tsx` (1,623 lines). This task
creates a parallel Zustand slice that models the same state machine. The slice
is not wired into the app yet — that happens in Task 5. The goal here is to
prove the slice logic is correct in isolation.

The configurator phases map directly from the existing reducer:

- `"selecting-dataset"` ← `SELECTING_DATASET`
- `"configuring"` ← `CONFIGURING_CHART`
- `"layouting"` ← `LAYOUTING`
- `"publishing"` ← `PUBLISHING`
- `"published"` ← `PUBLISHED`

Zustand 5 ships with immer middleware — no new dependency needed. Import from
`zustand/middleware/immer`.

**Step 1: Write the failing test**

```typescript
// app/stores/slices/__tests__/configurator.spec.ts
import { describe, it, expect, beforeEach } from "vitest";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createConfiguratorSlice,
  ConfiguratorSlice,
} from "@/stores/slices/configurator";

// Minimal store wrapping just the slice
const createTestStore = () =>
  create<ConfiguratorSlice>()(
    immer((...args) => createConfiguratorSlice(...args))
  );

describe("configuratorSlice", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it("starts in selecting-dataset phase", () => {
    expect(store.getState().phase).toBe("selecting-dataset");
    expect(store.getState().chartConfigs).toHaveLength(0);
  });

  it("selectDataset moves to configuring phase", () => {
    store.getState().selectDataset("https://example.com/cube");
    expect(store.getState().phase).toBe("configuring");
    expect(store.getState().chartConfigs).toHaveLength(1);
    expect(store.getState().chartConfigs[0].cubeIri).toBe(
      "https://example.com/cube"
    );
  });

  it("setActiveChart updates activeChartKey", () => {
    store.getState().selectDataset("https://example.com/cube");
    const key = store.getState().chartConfigs[0].key;
    store.getState().setActiveChart(key);
    expect(store.getState().activeChartKey).toBe(key);
  });

  it("setChartType updates the chart type on the active chart", () => {
    store.getState().selectDataset("https://example.com/cube");
    const key = store.getState().chartConfigs[0].key;
    store.getState().setActiveChart(key);
    store.getState().setChartType(key, "bar");
    const chart = store.getState().chartConfigs.find((c) => c.key === key);
    expect(chart?.chartType).toBe("bar");
  });

  it("publish moves to published phase", () => {
    store.getState().selectDataset("https://example.com/cube");
    store.getState().publish();
    expect(store.getState().phase).toBe("published");
  });

  it("reset returns to selecting-dataset", () => {
    store.getState().selectDataset("https://example.com/cube");
    store.getState().reset();
    expect(store.getState().phase).toBe("selecting-dataset");
    expect(store.getState().chartConfigs).toHaveLength(0);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/stores/slices/__tests__/configurator.spec.ts
```

Expected: FAIL — `Cannot find module '@/stores/slices/configurator'`

**Step 3: Write the implementation**

```typescript
// app/stores/slices/configurator.ts
import { StateCreator } from "zustand";

export type ConfiguratorPhase =
  | "selecting-dataset"
  | "configuring"
  | "layouting"
  | "publishing"
  | "published";

export type SlimChartConfig = {
  key: string;
  cubeIri: string;
  chartType: string;
  fields: Record<string, { componentId: string }>;
};

export type ConfiguratorSlice = {
  phase: ConfiguratorPhase;
  chartConfigs: SlimChartConfig[];
  activeChartKey: string | null;

  selectDataset: (cubeIri: string) => void;
  setActiveChart: (key: string) => void;
  setChartType: (key: string, chartType: string) => void;
  setField: (key: string, field: string, componentId: string) => void;
  publish: () => void;
  reset: () => void;
};

const createKey = () => Math.random().toString(36).slice(2);

export const createConfiguratorSlice: StateCreator<
  ConfiguratorSlice,
  [["zustand/immer", never]],
  [],
  ConfiguratorSlice
> = (set) => ({
  phase: "selecting-dataset",
  chartConfigs: [],
  activeChartKey: null,

  selectDataset: (cubeIri) =>
    set((draft) => {
      const key = createKey();
      draft.chartConfigs = [{ key, cubeIri, chartType: "column", fields: {} }];
      draft.activeChartKey = key;
      draft.phase = "configuring";
    }),

  setActiveChart: (key) =>
    set((draft) => {
      draft.activeChartKey = key;
    }),

  setChartType: (key, chartType) =>
    set((draft) => {
      const chart = draft.chartConfigs.find((c) => c.key === key);
      if (!chart) return;
      chart.chartType = chartType;
      chart.fields = {}; // reset fields on type change
    }),

  setField: (key, field, componentId) =>
    set((draft) => {
      const chart = draft.chartConfigs.find((c) => c.key === key);
      if (!chart) return;
      chart.fields[field] = { componentId };
    }),

  publish: () =>
    set((draft) => {
      draft.phase = "published";
    }),

  reset: () =>
    set((draft) => {
      draft.phase = "selecting-dataset";
      draft.chartConfigs = [];
      draft.activeChartKey = null;
    }),
});
```

**Step 4: Run test to verify it passes**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/stores/slices/__tests__/configurator.spec.ts
```

Expected: all 6 tests PASS

**Step 5: Commit**

```bash
git add app/stores/slices/configurator.ts app/stores/slices/__tests__/configurator.spec.ts
git commit -m "feat(stores): add Zustand configurator slice with immer middleware"
```

---

### Task 4: Create the combined app store

**Files:**

- Create: `app/stores/app-store.ts`
- Create: `app/stores/slices/__tests__/app-store.spec.ts`

**Context:** Combine the configurator slice with the existing data-source store
logic into one Zustand store. Do **not** delete existing stores yet — they stay
in place. This new store is the target state; wiring happens in Task 5.

**Step 1: Write the failing test**

```typescript
// app/stores/slices/__tests__/app-store.spec.ts
import { describe, it, expect } from "vitest";
import { useAppStore } from "@/stores/app-store";

describe("appStore", () => {
  it("exposes configurator slice actions", () => {
    const state = useAppStore.getState();
    expect(typeof state.selectDataset).toBe("function");
    expect(typeof state.setField).toBe("function");
    expect(typeof state.publish).toBe("function");
  });

  it("initial configurator phase is selecting-dataset", () => {
    expect(useAppStore.getState().phase).toBe("selecting-dataset");
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/stores/slices/__tests__/app-store.spec.ts
```

Expected: FAIL — `Cannot find module '@/stores/app-store'`

**Step 3: Write the implementation**

```typescript
// app/stores/app-store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  ConfiguratorSlice,
  createConfiguratorSlice,
} from "@/stores/slices/configurator";

export type AppStore = ConfiguratorSlice;

export const useAppStore = create<AppStore>()(
  immer((...args) => ({
    ...createConfiguratorSlice(...args),
  }))
);

// Selectors — co-located with the store, not scattered
export const selectPhase = (s: AppStore) => s.phase;
export const selectActiveChart = (s: AppStore) =>
  s.chartConfigs.find((c) => c.key === s.activeChartKey) ?? null;
export const selectChartConfigs = (s: AppStore) => s.chartConfigs;
```

**Step 4: Run test to verify it passes**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/stores/slices/__tests__/app-store.spec.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/stores/app-store.ts app/stores/slices/__tests__/app-store.spec.ts
git commit -m "feat(stores): add combined app store with selectors"
```

---

## Phase 3 — Chart-Type Code Ownership (Bar Chart)

### Task 5: Create `app/chart-types/bar/config.ts`

**Files:**

- Create: `app/chart-types/bar/config.ts`
- Create: `app/chart-types/bar/__tests__/config.spec.ts`

**Context:** Zod is not yet installed. Install it first. Then create the Zod
schema for bar chart config. This replaces the bar-chart-relevant slice of
`app/config-types.ts` (1,544 lines, uses io-ts). The Zod schema is the single
source of truth for bar chart config — TypeScript types are derived from it, not
written separately.

**Step 1: Install Zod**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn add zod
```

**Step 2: Write the failing test**

```typescript
// app/chart-types/bar/__tests__/config.spec.ts
import { describe, it, expect } from "vitest";
import { barChartSchema, type BarChartConfig } from "@/chart-types/bar/config";

describe("barChartSchema", () => {
  it("parses a valid bar chart config", () => {
    const input = {
      key: "abc123",
      chartType: "bar",
      cubeIri: "https://example.com/cube",
      fields: {
        x: { componentId: "dimension-1" },
        y: { componentId: "measure-1" },
      },
    };
    const result = barChartSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.chartType).toBe("bar");
    }
  });

  it("rejects config missing required fields", () => {
    const result = barChartSchema.safeParse({ chartType: "bar" });
    expect(result.success).toBe(false);
  });

  it("rejects config with wrong chart type", () => {
    const result = barChartSchema.safeParse({
      key: "abc",
      chartType: "line", // wrong
      cubeIri: "https://example.com/cube",
      fields: { x: { componentId: "d1" }, y: { componentId: "m1" } },
    });
    expect(result.success).toBe(false);
  });
});
```

**Step 3: Run test to verify it fails**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/chart-types/bar/__tests__/config.spec.ts
```

Expected: FAIL — `Cannot find module '@/chart-types/bar/config'`

**Step 4: Write the implementation**

```typescript
// app/chart-types/bar/config.ts
import { z } from "zod";

const fieldSchema = z.object({
  componentId: z.string(),
});

export const barChartSchema = z.object({
  key: z.string(),
  chartType: z.literal("bar"),
  cubeIri: z.string().url(),
  fields: z.object({
    x: fieldSchema,
    y: fieldSchema,
    segment: fieldSchema.optional(),
  }),
  sorting: z
    .object({
      sortingType: z.enum(["byDimensionLabel", "byMeasure", "byAuto"]),
      sortingOrder: z.enum(["asc", "desc"]),
    })
    .optional(),
});

export type BarChartConfig = z.infer<typeof barChartSchema>;

export const getInitialBarConfig = (cubeIri: string): BarChartConfig => ({
  key: Math.random().toString(36).slice(2),
  chartType: "bar",
  cubeIri,
  fields: {
    x: { componentId: "" },
    y: { componentId: "" },
  },
});
```

**Step 5: Run test to verify it passes**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/chart-types/bar/__tests__/config.spec.ts
```

Expected: all 3 tests PASS

**Step 6: Commit**

```bash
git add app/chart-types/bar/config.ts app/chart-types/bar/__tests__/config.spec.ts
git commit -m "feat(chart-types): add bar chart Zod schema and config"
```

---

### Task 6: Create the chart registry

**Files:**

- Create: `app/chart-registry.ts`
- Create: `app/chart-types/bar/index.ts`
- Create: `app/__tests__/unit/chart-registry.spec.ts`

**Context:** The registry is the single file that knows all chart types exist.
Each chart type exports a `ChartDefinition` object. The registry provides
`getChartDefinition(type)` — replacing the massive switch statements currently
scattered across `charts/index.ts` and `config-form.tsx`.

For now the registry registers only bar chart. Other chart types are added
incrementally by repeating Task 5–6 per type.

**Step 1: Write the failing test**

```typescript
// app/__tests__/unit/chart-registry.spec.ts
import { describe, it, expect } from "vitest";
import {
  chartRegistry,
  getChartDefinition,
  isRegisteredChartType,
} from "@/chart-registry";

describe("chartRegistry", () => {
  it("contains the bar chart", () => {
    const types = chartRegistry.map((c) => c.type);
    expect(types).toContain("bar");
  });

  it("getChartDefinition returns the correct definition", () => {
    const def = getChartDefinition("bar");
    expect(def.type).toBe("bar");
    expect(typeof def.schema.parse).toBe("function");
    expect(typeof def.getInitialConfig).toBe("function");
  });

  it("isRegisteredChartType returns true for bar", () => {
    expect(isRegisteredChartType("bar")).toBe(true);
  });

  it("isRegisteredChartType returns false for unknown type", () => {
    expect(isRegisteredChartType("unknown-type")).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/__tests__/unit/chart-registry.spec.ts
```

Expected: FAIL — `Cannot find module '@/chart-registry'`

**Step 3: Create the bar chart definition**

```typescript
// app/chart-types/bar/index.ts
import { ChartDefinition } from "@/chart-registry";
import {
  BarChartConfig,
  barChartSchema,
  getInitialBarConfig,
} from "@/chart-types/bar/config";

export const barChart: ChartDefinition<BarChartConfig> = {
  type: "bar",
  label: { en: "Bar chart", sr: "Trakasti grafikon" },
  schema: barChartSchema,
  getInitialConfig: getInitialBarConfig,
};
```

**Step 4: Create the registry**

```typescript
// app/chart-registry.ts
import { ZodTypeAny } from "zod";

import { barChart } from "@/chart-types/bar";

export type ChartDefinition<TConfig = unknown> = {
  type: string;
  label: { en: string; sr: string };
  schema: ZodTypeAny;
  getInitialConfig: (cubeIri: string) => TConfig;
};

export const chartRegistry: ChartDefinition[] = [barChart];

export const getChartDefinition = (type: string): ChartDefinition => {
  const def = chartRegistry.find((c) => c.type === type);
  if (!def) throw new Error(`No chart definition registered for type: ${type}`);
  return def;
};

export const isRegisteredChartType = (type: string): boolean =>
  chartRegistry.some((c) => c.type === type);

export type RegisteredChartType = (typeof chartRegistry)[number]["type"];
```

**Step 5: Run test to verify it passes**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test app/__tests__/unit/chart-registry.spec.ts
```

Expected: all 4 tests PASS

**Step 6: Commit**

```bash
git add app/chart-registry.ts app/chart-types/bar/index.ts app/__tests__/unit/chart-registry.spec.ts
git commit -m "feat(chart-registry): add chart registry with bar chart definition"
```

---

### Task 7: Verify everything compiles and tests pass

**Files:** None modified.

**Context:** Run the full test suite and typecheck to confirm the three phases
haven't broken anything. This is the integration checkpoint before wiring up.

**Step 1: Run full test suite**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn test
```

Expected: all existing tests pass, new tests pass

**Step 2: Run typecheck**

```bash
cd /home/nistrator/Documents/github/vizualni-admin && yarn typecheck
```

Expected: no new errors introduced

**Step 3: If errors exist**

Errors are most likely from:

- The `@/chart-types/bar/index.ts` referencing `ChartDefinition` before the
  registry file is compiled. Fix by checking import ordering —
  `chart-registry.ts` exports `ChartDefinition`, `bar/index.ts` imports it.
- tsconfig path aliases not covering `app/chart-types/`. Check
  `app/tsconfig.json` and add `"@/chart-types/*": ["chart-types/*"]` if missing.

**Step 4: Commit cleanup if needed**

```bash
git add -p
git commit -m "fix(chart-types): fix tsconfig path alias for chart-types"
```

---

## Next Steps (out of scope for this plan)

Once the above passes:

1. **Migrate remaining chart types** — repeat Task 5–6 for `line`, `area`,
   `column`, `pie`, `scatterplot`, `map`, `table`, and the three combo types.
   Each is independent.

2. **Wire `useAppStore` into the configurator** — replace
   `useConfiguratorState()` calls with `useAppStore(selectPhase)`, etc. Do one
   component at a time, running tests between each.

3. **Delete the old reducer** — once all call sites use `useAppStore`, delete
   `app/configurator/configurator-state/reducer.tsx`, `context.tsx`, and
   `local-storage.tsx`.

4. **Delete io-ts** — once all chart schemas are in Zod, remove `io-ts` and
   `fp-ts` from `package.json`.

5. **Adopt `useD3Render` across remaining chart components** — repeat Task 2 for
   `lines.tsx`, `columns.tsx`, `areas.tsx`, etc.
