# Framework-Agnostic Core Architecture Design

**Date:** 2026-02-19 **Status:** Approved **Author:** Design session

## Overview

Re-architect vizualni-admin as a framework-agnostic visualization library with
React bindings. The new ecosystem will exist in parallel to
`@acailic/vizualni-admin`, allowing gradual adoption without breaking existing
users.

## Goals

- **Bundle size / performance** - Smaller payloads, tree-shaking, future Canvas
  support
- **Reusability** - Use in non-React contexts (Vue, vanilla, server-side)
- **Maintainability** - Clean boundaries, simpler codebase, better testability

## Current State Analysis

| Aspect         | Current State                                                 |
| -------------- | ------------------------------------------------------------- |
| **Size**       | ~275k lines (48k charts, 28k configurator)                    |
| **Framework**  | Next.js app + library bundled together                        |
| **Data Layer** | RDF/SPARQL → GraphQL → React (semantic web stack)             |
| **State**      | Zustand + Context + use-immer reducer (3 patterns)            |
| **Types**      | io-ts codecs, complex union types, `@ts-nocheck` on key files |
| **Charts**     | 11 chart types, SVG/D3, chart-specific state classes          |

**Key issues:**

- Monolithic structure with deep coupling
- React/Next.js tied throughout
- Multiple state management patterns
- Complex type hierarchies

## Package Structure

```
@vizualni/core          # Framework-agnostic core
├── scales/             # Scale computation (pure functions)
├── transforms/         # Data transformations
├── config/             # Schema + validation (zod, not io-ts)
├── layout/             # Chart layout algorithms
├── formatters/         # Number/date formatting
├── types/              # Shared TypeScript types
└── index.ts

@vizualni/react         # React bindings
├── charts/             # Chart components
├── hooks/              # useChart, useScales, etc.
├── context/            # Providers
└── index.ts

@vizualni/d3-renderer   # SVG renderer (optional)
├── svg/                # SVG element generators
└── canvas/             # Canvas renderer

@vizualni/connectors    # Data connectors (optional)
├── csv/
├── json/
├── sparql/             # RDF/SPARQL (current data layer)
└── rest/
```

**Key principle:** `@vizualni/core` has **zero dependencies** on React, DOM, or
runtime environments. It's pure TypeScript that can run anywhere.

## Core API Design

The core exports **pure functions** that take data + config and return
**rendering instructions** — never DOM elements.

```typescript
// @vizualni/core

// 1. Config schema (zod for smaller bundles + better DX than io-ts)
export const ChartConfigSchema = z.discriminatedUnion("type", [
  LineChartConfigSchema,
  BarChartConfigSchema,
  // ...
]);
export type ChartConfig = z.infer<typeof ChartConfigSchema>;

// 2. Scale computation (pure)
export function computeScales(
  data: Datum[],
  config: ChartConfig,
  options: { width: number; height: number }
): Scales {
  // Returns xScale, yScale, colorScale, etc.
  // No side effects, no DOM
}

// 3. Layout computation (pure)
export function computeLayout(
  data: Datum[],
  scales: Scales,
  config: ChartConfig
): Layout {
  // Returns positions for axes, legends, title, chart area
  // Handles margins, padding, label rotation, etc.
}

// 4. Rendering instructions (pure)
export function computeChart(
  data: Datum[],
  config: ChartConfig,
  options: ChartOptions
): ChartResult {
  const scales = computeScales(data, config, options);
  const layout = computeLayout(data, scales, config);
  const shapes = computeShapes(data, scales, config); // paths, rects, etc.

  return { scales, layout, shapes };
}
```

### Example Result

```typescript
{
  scales: {
    x: { type: 'time', domain: [Date, Date], range: [0, 600] },
    y: { type: 'linear', domain: [0, 100], range: [400, 0] },
    color: { type: 'ordinal', domain: ['A', 'B'], range: ['#4e79a7', '#f28e2c'] }
  },
  layout: {
    chartArea: { x: 60, y: 30, width: 600, height: 400 },
    margins: { top: 30, right: 20, bottom: 50, left: 60 }
  },
  shapes: [
    { type: 'line', path: 'M60,200 L120,180...', stroke: '#4e79a7' },
    { type: 'line', path: 'M60,220 L120,160...', stroke: '#f28e2c' }
  ]
}
```

The renderer (React/SVG/Canvas) consumes this output. The core doesn't care how
it's rendered.

## React Bindings (`@vizualni/react`)

The React package is a thin layer that:

1. Calls core functions in hooks
2. Renders the output to SVG/Canvas
3. Handles interactivity (hover, tooltips, zoom)

```typescript
// @vizualni/react

// Headless hook - returns all chart data, no rendering
export function useChart(config: ChartConfig, data: Datum[]) {
  const { width, height, ref } = useResizeObserver();

  const result = useMemo(
    () => computeChart(data, config, { width, height }),
    [data, config, width, height]
  );

  return { ref, ...result };
}

// Ready-made components for convenience
export function LineChart({ config, data }: LineChartProps) {
  const { scales, layout, shapes, ref } = useChart(config, data);
  const [hovered, setHovered] = useState<Shape | null>(null);

  return (
    <svg ref={ref} width={layout.width} height={layout.height}>
      <Axes scales={scales} layout={layout} />
      {shapes.map((shape, i) => (
        <Shape
          key={i}
          shape={shape}
          onMouseEnter={() => setHovered(shape)}
        />
      ))}
      <Tooltip data={hovered} />
    </svg>
  );
}
```

### Headless Pattern

```typescript
// Consumer wants full control
function MyCustomChart() {
  const { scales, shapes, layout } = useChart(config, data);

  return (
    <Canvas>
      {shapes.map(s => <CustomShape {...s} />)}
    </Canvas>
  );
}
```

**State management:** Single Zustand store per chart instance (no more Context +
reducer + multiple stores).

## Data Connectors (`@vizualni/connectors`)

Decouple data fetching from visualization. Connectors are **async functions**
that return data in a standard format.

```typescript
// @vizualni/connectors

interface DataConnector<TConfig = unknown> {
  readonly type: string;
  fetch(config: TConfig): Promise<ConnectorResult>;
  getSchema?(config: TConfig): Promise<DataSchema>;
}

interface ConnectorResult {
  data: Datum[];
  schema: DataSchema;
  meta?: Record<string, unknown>;
}

interface DataSchema {
  fields: FieldSchema[];
}

interface FieldSchema {
  name: string;
  type: "string" | "number" | "date" | "boolean";
  title?: string;
  description?: string;
}
```

### Built-in Connectors

```typescript
// CSV
export const csvConnector: DataConnector<CsvConfig>;

// JSON/REST API
export const jsonConnector: DataConnector<JsonConfig>;

// SPARQL (current RDF layer, extracted)
export const sparqlConnector: DataConnector<SparqlConfig>;

// data.gov.rs (Serbian open data)
export const dataGovRsConnector: DataConnector<DataGovRsConfig>;
```

### Usage in React

```typescript
function MyChart() {
  const { data, schema, loading, error } = useConnector(csvConnector, {
    url: 'https://example.com/data.csv'
  });

  if (loading) return <Skeleton />;
  if (error) return <Error />;

  return <LineChart config={config} data={data} />;
}
```

**Key benefit:** Charts don't know about SPARQL, CSV, or REST. They just receive
`Datum[]`.

## Migration Strategy

Since we're keeping `@acailic/vizualni-admin` and releasing `@vizualni/*` in
parallel:

### Phase 1: Core Foundation (2-3 weeks)

- Create monorepo structure (pnpm workspaces or Turborepo)
- Build `@vizualni/core` with scales, transforms, config
- Write comprehensive tests (current codebase as reference)
- Publish as `0.1.0-alpha`

### Phase 2: React Layer (2-3 weeks)

- Build `@vizualni/react` with headless hooks
- Implement 2-3 chart types (line, bar, pie)
- Add `@vizualni/d3-renderer` for SVG output
- Publish as `0.2.0-alpha`

### Phase 3: Connectors (1-2 weeks)

- Extract CSV connector from existing code
- Build SPARQL connector (most complex)
- Add `useConnector` hook
- Publish as `0.3.0-alpha`

### Phase 4: Feature Parity (ongoing)

- Port remaining chart types (map, combo, scatterplot)
- Add configurator components
- Interactive filters
- Accessibility (a11y table, keyboard nav)

### Phase 5: Stabilization

- API review, breaking changes before 1.0
- Documentation site
- Migration guide for existing users
- Deprecation notices in old package

## Key Decisions

| Decision       | Choice                           | Rationale                                        |
| -------------- | -------------------------------- | ------------------------------------------------ |
| **Validation** | Zod                              | Smaller bundle, better DX than io-ts             |
| **State**      | Zustand (single store per chart) | Simpler than Context + reducer + multiple stores |
| **Rendering**  | Pure functions → shapes          | Framework-agnostic, testable, Canvas-ready       |
| **Data layer** | Connector interface              | Decoupled, extensible, async-friendly            |
| **Monorepo**   | pnpm workspaces                  | Fast, efficient, good DX                         |
| **Build**      | tsup                             | ESM + CJS, zero config, fast                     |
| **Testing**    | Vitest                           | Fast, already in use                             |
| **Publishing** | Changesets                       | Version management, changelogs                   |

## Out of Scope (YAGNI)

- No Canvas renderer initially (SVG is enough to start)
- No server-side rendering helpers (add when needed)
- No theme system (use CSS custom properties)
- No plugin architecture (keep it simple)

## Open Questions

1. Should we support animation in core or leave it to React layer?
2. How to handle i18n in a framework-agnostic way?
3. Should configurator UI be part of React package or separate?

## Next Steps

1. Create monorepo structure
2. Initialize `@vizualni/core` package
3. Port scale computation from existing codebase
4. Set up CI/CD with Changesets
