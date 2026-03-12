# @vizualni/react

React bindings for @vizualni/core. Chart components and hooks for React
applications.

## Installation

```bash
npm install @vizualni/react @vizualni/core
# or
yarn add @vizualni/react @vizualni/core
```

Peer dependencies: `react >= 18.0.0`, `react-dom >= 18.0.0`

## Quick Start

```tsx
import { LineChart, BarChart, PieChart } from "@vizualni/react";

function App() {
  const data = [
    { date: new Date("2024-01-01"), value: 10 },
    { date: new Date("2024-02-01"), value: 20 },
    { date: new Date("2024-03-01"), value: 30 },
  ];

  return (
    <LineChart
      data={data}
      config={{
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      }}
      width={600}
      height={400}
    />
  );
}
```

## Components

### `<LineChart />`

```tsx
<LineChart
  data={data}
  config={{
    type: "line",
    x: { field: "date", type: "date" },
    y: { field: "value", type: "number" },
  }}
  width={600}
  height={400}
  className="my-chart"
/>
```

### `<BarChart />`

```tsx
<BarChart
  data={data}
  config={{
    type: "bar",
    x: { field: "category", type: "string" },
    y: { field: "value", type: "number" },
  }}
  width={600}
  height={400}
/>
```

### `<PieChart />`

```tsx
<PieChart
  data={data}
  config={{
    type: "pie",
    value: { field: "value", type: "number" },
    category: { field: "label", type: "string" },
    innerRadius: 0.5, // Donut chart
  }}
  width={400}
  height={400}
/>
```

## Hooks

### `useChart(data, config, options)`

Headless hook for full control over rendering.

```tsx
import { useChart } from "@vizualni/react";

function CustomChart({ data }) {
  const { scales, layout, error } = useChart(
    data,
    {
      type: "line",
      x: { field: "x", type: "date" },
      y: { field: "y", type: "number" },
    },
    { width: 600, height: 400 }
  );

  if (error) return <div>Error: {error}</div>;

  // Custom rendering with scales and layout
  return (
    <svg width={layout.width} height={layout.height}>
      {/* Your custom SVG elements */}
    </svg>
  );
}
```

### `useConnector(connector, config)`

Fetch data from various sources.

```tsx
import { useConnector } from "@vizualni/react";
import { csvConnector } from "@vizualni/connectors";

function MyChart() {
  const { data, schema, loading, error } = useConnector(csvConnector, {
    url: "https://example.com/data.csv",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <LineChart data={data} config={config} width={600} height={400} />;
}
```

## Error Handling

Charts display error messages for invalid data:

```tsx
// Empty data shows "Data array is empty"
// Missing fields show "Required field 'x' not found in data"
```

## License

MIT
