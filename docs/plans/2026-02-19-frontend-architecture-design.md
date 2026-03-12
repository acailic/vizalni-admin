# Frontend Architecture Design

**Date:** 2026-02-19 **Scope:** Three structural improvements to the frontend
architecture — D3 boundary contract, unified state management, and chart-type
code ownership.

---

## Problem Statement

The current codebase has three architectural issues that compound over time:

1. **No explicit D3 boundary** — `useEffect` hands raw DOM refs to D3 with no
   typed contract. React has no visibility into what D3 does inside. Debugging
   requires switching mental models mid-stack.

2. **Two state management patterns** — Zustand handles simple stores
   (data-source, interactive-filters, transitions) while `useImmerReducer` +
   Context handles the configurator. The reducer grew to 1,623 lines with
   `setAutoFreeze(false)` bypassing immer's safety guarantees. Its spec file is
   54,707 lines; its mock file is 78,880 lines. This is the cost of a
   hand-rolled state machine with no encapsulation ceiling.

3. **No chart-type encapsulation** — `config-form.tsx` is 17,618 lines.
   `charts/index.ts` is 3,093 lines. `config-types.ts` is 1,544 lines. Every
   chart type's config, rendering, form options, and types live in shared files.
   A change to bar charts can break scatter plots.

---

## Design

### 1 — Explicit D3 Boundary

Introduce a `D3RenderFn<TData>` interface. Every chart's rendering becomes a
plain TypeScript function — no React, no hooks, no hidden dependencies — that
implements this interface. A single `useD3Render` hook manages the `useEffect`
lifecycle at the boundary.

```typescript
// app/charts/shared/d3-boundary.ts

type D3Selection = d3.Selection<SVGGElement, unknown, null, undefined>;

export type RenderOptions = {
  bounds: Bounds;
  xScale: d3.Scale<any, number>;
  yScale: d3.Scale<any, number>;
  transition: { enable: boolean; duration: number };
};

export type D3RenderFn<TData> = (
  g: D3Selection,
  data: TData,
  opts: RenderOptions
) => void;

export function useD3Render<TData>(
  ref: React.RefObject<SVGGElement>,
  renderFn: D3RenderFn<TData>,
  data: TData,
  opts: RenderOptions
) {
  useEffect(() => {
    if (!ref.current) return;
    renderFn(d3.select(ref.current), data, opts);
  }, [data, opts]);
}
```

Each chart's render function is a plain function:

```typescript
// app/chart-types/bar/render.ts
export const renderBars: D3RenderFn<BarDatum[]> = (g, data, opts) => {
  g.selectAll("rect")
    .data(data, (d) => d.key)
    .join("rect")
    .attr("x", (d) => opts.xScale(d.x))
    .attr("y", (d) => opts.yScale(d.y))
    .attr("height", (d) => opts.bounds.height - opts.yScale(d.y));
};
```

Usage in a component:

```typescript
useD3Render(svgRef, renderBars, barData, renderOpts);
```

**Benefits:**

- The D3 boundary is one grep away — every call site is `useD3Render(...)`.
- `renderBars` is unit-testable with jsdom and no React wrapper.
- New chart types have a clear contract to implement.

---

### 2 — Zustand Everywhere, Sliced

Replace the `useImmerReducer` + Context pattern with Zustand using immer
middleware. One store, multiple slices. Each slice owns its state shape,
actions, and selectors.

```typescript
// app/stores/index.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createConfiguratorSlice } from "./slices/configurator";
import { createFiltersSlice } from "./slices/filters";
import { createDataSourceSlice } from "./slices/data-source";

export const useStore = create<AppStore>()(
  immer((...args) => ({
    ...createConfiguratorSlice(...args),
    ...createFiltersSlice(...args),
    ...createDataSourceSlice(...args),
  }))
);
```

The configurator slice replaces the 1,623-line reducer with named actions:

```typescript
// app/stores/slices/configurator.ts
export const createConfiguratorSlice: SliceCreator<ConfiguratorSlice> = (
  set
) => ({
  phase: "selecting-dataset" as ConfiguratorPhase,
  chartConfigs: [] as ChartConfig[],
  activeChartKey: null as string | null,

  selectDataset: (cubeIri: string) =>
    set((draft) => {
      draft.phase = "configuring";
      draft.chartConfigs = [getInitialConfig(cubeIri, "column")];
    }),

  setField: (chartKey: string, field: string, componentId: string) =>
    set((draft) => {
      const chart = draft.chartConfigs.find((c) => c.key === chartKey);
      if (!chart) return;
      chart.fields[field] = { componentId };
      deriveFilters(chart);
    }),

  changeChartType: (chartKey: string, type: ChartType) =>
    set((draft) => {
      const chart = draft.chartConfigs.find((c) => c.key === chartKey);
      if (!chart) return;
      Object.assign(chart, getChartDefinition(type).getInitialConfig());
    }),

  publish: () =>
    set((draft) => {
      draft.phase = "published";
    }),
});
```

Selectors live next to their slice:

```typescript
export const selectActiveChart = (state: AppStore) =>
  state.chartConfigs.find((c) => c.key === state.activeChartKey);

export const selectPhase = (state: AppStore) => state.phase;
```

Components subscribe to only what they need:

```typescript
const phase = useStore(selectPhase);
const activeChart = useStore(selectActiveChart);
```

**Before vs After:**

|                    | Current                                | Proposed                         |
| ------------------ | -------------------------------------- | -------------------------------- |
| Configurator state | `useImmerReducer` + Context            | Zustand slice                    |
| Action dispatch    | `dispatch({ type: "SET_FIELD", ... })` | `store.setField(key, field, id)` |
| `setAutoFreeze`    | Disabled globally                      | Not needed                       |
| Spec file          | 54,707 lines                           | ~200 lines per slice             |
| Learning surface   | Zustand + useImmerReducer + Context    | Zustand only                     |

---

### 3 — Chart-Type Code Ownership

Each chart type becomes a self-contained folder that exports one
`ChartDefinition` object. A central registry is the only file that knows all
chart types exist.

**Folder structure:**

```
app/
  chart-types/
    bar/
      config.ts        ← BarChartConfig type + Zod schema
      state.ts         ← scale/axis computation
      render.ts        ← D3RenderFn implementation
      form.tsx         ← config panel UI
      index.ts         ← ChartDefinition export
    line/
    area/
    column/
    combo-line-single/
    combo-line-dual/
    combo-line-column/
    pie/
    scatterplot/
    map/
    table/
    shared/
      d3-boundary.ts
      axes.tsx
      legend.tsx
      tooltip.tsx
  chart-registry.ts
```

Each chart exports one object:

```typescript
// app/chart-types/bar/index.ts
export const barChart: ChartDefinition<BarChartConfig> = {
  type: "bar",
  label: { en: "Bar chart", sr: "Trakasti grafikon" },
  schema: barChartSchema, // Zod schema
  getInitialConfig,
  computeState: computeBarState,
  renderFn: renderBars, // satisfies D3RenderFn<BarDatum[]>
  FormComponent: BarChartForm,
};
```

The registry is the only global:

```typescript
// app/chart-registry.ts
import { barChart } from "./chart-types/bar";
import { lineChart } from "./chart-types/line";
// ... one import per chart type

export const chartRegistry = [barChart, lineChart /* ... */] as const;

export type ChartType = (typeof chartRegistry)[number]["type"];

export const getChartDefinition = (type: ChartType) =>
  chartRegistry.find((c) => c.type === type)!;
```

The configurator form renders itself generically — replaces 17,618 lines with
~50:

```typescript
// app/components/chart-config-form.tsx
const { FormComponent } = getChartDefinition(chartConfig.chartType);
return <FormComponent config={chartConfig} onChange={store.setField} />;
```

Zod replaces io-ts. Each chart owns its own schema:

```typescript
// app/chart-types/bar/config.ts
import { z } from "zod";

export const barChartSchema = z.object({
  type: z.literal("bar"),
  fields: z.object({
    x: fieldSchema,
    y: fieldSchema,
    segment: fieldSchema.optional(),
  }),
  sorting: sortingSchema.optional(),
});

export type BarChartConfig = z.infer<typeof barChartSchema>;
```

Runtime parsing replaces `fold(onLeft, onRight)(decoder.decode(config))`:

```typescript
const result = barChartSchema.safeParse(rawConfig);
if (!result.success) {
  /* handle */
}
```

**Adding a new chart type:**

1. Create `app/chart-types/my-chart/`
2. Export a `ChartDefinition`
3. Add one import to `chart-registry.ts`
4. Nothing else changes

**Removing a chart type:**

1. Delete the folder
2. Remove the import
3. Nothing else changes

---

## How the Three Parts Connect

The three improvements are designed to reinforce each other:

- Section 1 (D3 boundary) defines `D3RenderFn<TData>` — the type that each
  chart's `render.ts` implements.
- Section 3 (chart ownership) puts `render.ts` inside each chart's folder —
  ownership makes the contract useful.
- Section 2 (Zustand slices) provides `store.setField` — what `FormComponent`
  calls on change, and what the chart registry's `ChartDefinition` is wired to.

Together they replace the current implicit, sprawling architecture with three
explicit contracts: how charts render, how state changes, and what a chart type
is.

---

## Migration Strategy

These changes are large. The recommended approach is incremental adoption:

1. **Start with one chart type** — migrate bar chart to the new structure
   end-to-end. Validate the pattern works before touching others.
2. **Introduce the D3 boundary** — add `useD3Render` as a wrapper around
   existing calls. No breaking change; just a typed surface.
3. **Add the Zustand slice alongside the reducer** — run both in parallel for
   one sprint. Once the slice is trusted, delete the reducer.
4. **Migrate chart types one by one** — each migration is independent. The
   registry can hold both old and new chart definitions during the transition.

---

## Files Replaced / Deleted

| File                                              | Lines  | Fate                                   |
| ------------------------------------------------- | ------ | -------------------------------------- |
| `app/configurator/configurator-state/reducer.tsx` | 1,623  | Replaced by Zustand slices             |
| `app/configurator/configurator-state/context.tsx` | 1,124  | Deleted                                |
| `app/configurator/config-form.tsx`                | 17,618 | Replaced by generic form (~50 lines)   |
| `app/config-types.ts`                             | 1,544  | Split into per-chart `config.ts` files |
| `app/charts/index.ts`                             | 3,093  | Replaced by `chart-registry.ts`        |
| `app/charts/chart-config-ui-options.js`           | 49,638 | Replaced by per-chart `form.tsx` files |
| `app/utils/chart-config/versioning.ts`            | 2,384  | Simplified (Zod schemas are additive)  |

---

## Dependencies Added / Removed

|                            | Action         | Reason                               |
| -------------------------- | -------------- | ------------------------------------ |
| `zod`                      | Add            | Replaces `io-ts` + `fp-ts`           |
| `io-ts`                    | Remove         | Replaced by Zod                      |
| `fp-ts`                    | Remove         | No longer needed                     |
| `use-immer`                | Remove         | Zustand immer middleware replaces it |
| `zustand/middleware/immer` | Add (built-in) | Already in Zustand, just enabled     |
