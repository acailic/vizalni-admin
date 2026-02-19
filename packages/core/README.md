# @vizualni/core

Framework-agnostic visualization library core. Pure TypeScript functions for
scale computation, layout, and shape generation.

## Installation

```bash
npm install @vizualni/core
# or
yarn add @vizualni/core
```

## Features

- **Scale computation** - Linear, time, band, and ordinal scales
- **Layout calculation** - Chart dimensions and margins
- **Shape generation** - SVG rendering instructions for charts
- **Zod validation** - Runtime config validation
- **Zero framework dependencies** - Works with React, Vue, vanilla JS, etc.

## Quick Start

```typescript
import { computeChart } from "@vizualni/core";

const data = [
  { date: new Date("2024-01-01"), value: 10 },
  { date: new Date("2024-02-01"), value: 20 },
  { date: new Date("2024-03-01"), value: 30 },
];

const result = computeChart(
  data,
  {
    type: "line",
    x: { field: "date", type: "date" },
    y: { field: "value", type: "number" },
  },
  { width: 600, height: 400 }
);

// result.scales - x, y, color scales
// result.layout - chart dimensions
// result.shapes - SVG rendering instructions
```

## API

### `computeChart(data, config, options)`

Main entry point. Computes scales, layout, and shapes for a chart.

### `computeScales(data, config, options)`

Compute x, y, and color scales from data.

### `computeLayout(config, options)`

Compute chart dimensions including margins and chart area.

### `computeShapes(data, config, { scales, layout })`

Generate SVG rendering instructions.

## Chart Types

### Line Chart

```typescript
{
  type: 'line',
  x: { field: 'date', type: 'date' },
  y: { field: 'value', type: 'number' },
  segment?: { field: 'category', type: 'string' },
  showDots?: boolean,
  curve?: 'linear' | 'step' | 'cardinal' | 'monotone'
}
```

### Bar Chart

```typescript
{
  type: 'bar',
  x: { field: 'category', type: 'string' },
  y: { field: 'value', type: 'number' },
  segment?: { field: 'group', type: 'string' },
  orientation?: 'vertical' | 'horizontal',
  stack?: 'none' | 'stacked' | 'grouped'
}
```

### Pie Chart

```typescript
{
  type: 'pie',
  value: { field: 'value', type: 'number' },
  category: { field: 'label', type: 'string' },
  innerRadius?: number // 0-1, for donut charts
}
```

## License

MIT
