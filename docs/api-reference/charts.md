# Chart Components API

Complete reference for all chart components exported from
`@acailic/vizualni-admin/charts`.

## Overview

All chart components are standalone React components that can be used in any
React application. They accept data as props and render interactive
visualizations.

## Installation

```bash
npm install @acailic/vizualni-admin
```

## Import

```typescript
// Import from main package
import { LineChart, BarChart, PieChart } from "@acailic/vizualni-admin";

// Import from sub-path (recommended for tree-shaking)
import { LineChart, BarChart, PieChart } from "@acailic/vizualni-admin/charts";
```

## Available Components

### LineChart

Line and area chart component for time series and continuous data.

**Props:**

```typescript
interface LineChartProps {
  data: DataPoint[];
  config: {
    xAxis: string;
    yAxis: string;
    groupBy?: string;
    colorBy?: string;
  };
  width?: number | string;
  height?: number;
  locale?: Locale;
  theme?: ChartTheme;
}
```

**Example:**

```tsx
import { LineChart } from "@acailic/vizualni-admin/charts";

<LineChart
  data={[
    { date: "2024-01", value: 100 },
    { date: "2024-02", value: 120 },
  ]}
  config={{
    xAxis: "date",
    yAxis: "value",
  }}
  locale="sr-Latn"
/>;
```

### BarChart

Vertical and horizontal bar chart component.

**Props:**

```typescript
interface BarChartProps {
  data: DataPoint[];
  config: {
    xAxis: string;
    yAxis: string;
    groupBy?: string;
    orientation?: "vertical" | "horizontal";
    stacked?: boolean;
  };
  width?: number | string;
  height?: number;
}
```

**Example:**

```tsx
import { BarChart } from "@acailic/vizualni-admin/charts";

<BarChart
  data={categoryData}
  config={{
    xAxis: "category",
    yAxis: "value",
    orientation: "vertical",
  }}
/>;
```

### ColumnChart

Column chart for categorical data comparison.

**Props:**

```typescript
interface ColumnChartProps {
  data: DataPoint[];
  config: {
    xAxis: string;
    yAxis: string;
    groupBy?: string;
    stacked?: boolean;
  };
  width?: number | string;
  height?: number;
}
```

### PieChart

Pie and donut chart component.

**Props:**

```typescript
interface PieChartProps {
  data: DataPoint[];
  config: {
    nameKey: string;
    valueKey: string;
    innerRadius?: number;
    outerRadius?: number;
  };
  width?: number | string;
  height?: number;
}
```

**Example:**

```tsx
import { PieChart } from "@acailic/vizualni-admin/charts";

<PieChart
  data={[
    { category: "A", value: 30 },
    { category: "B", value: 70 },
  ]}
  config={{
    nameKey: "category",
    valueKey: "value",
    innerRadius: 60,
  }}
/>;
```

### AreaChart

Area chart component with fill.

**Props:**

```typescript
interface AreaChartProps {
  data: DataPoint[];
  config: {
    xAxis: string;
    yAxis: string;
    groupBy?: string;
    colorBy?: string;
  };
  width?: number | string;
  height?: number;
}
```

### MapChart

Geographic map visualization component.

**Props:**

```typescript
interface MapChartProps {
  data: GeoDataPoint[];
  config: {
    regionKey: string;
    valueKey: string;
    colorScale?: ColorScale;
  };
  width?: number | string;
  height?: number;
}
```

## Plugin System

### Registering Custom Charts

Extend the chart library with custom chart types:

```typescript
import {
  registerChartPlugin,
  IChartPlugin,
} from "@acailic/vizualni-admin/charts";

const customPlugin: IChartPlugin = {
  id: "my-custom-chart",
  name: "My Custom Chart",
  version: "1.0.0",

  metadata: {
    description: "A custom chart implementation",
    author: "Your Name",
    supportedTypes: ["custom"],
  },

  hooks: {
    beforeRender: (config) => {
      console.log("Rendering with config:", config);
    },
  },

  validate: (config) => {
    if (!config.dataSource) {
      return { valid: false, errors: ["dataSource required"] };
    }
    return { valid: true };
  },
};

registerChartPlugin(customPlugin);
```

### Chart Registry Functions

- `chartRegistry` - Global registry instance
- `registerChartPlugin()` - Register a new plugin
- `unregisterChartPlugin()` - Remove a plugin
- `getChartPlugin()` - Get specific plugin
- `listChartPlugins()` - List all plugins
- `hasChartPlugin()` - Check if plugin exists
- `clearChartPlugins()` - Clear all plugins
- `getChartPluginStats()` - Get registry statistics

## Common Props

All chart components support these common properties:

```typescript
interface BaseChartProps {
  data: DataPoint[];
  config: ChartConfig;
  width?: number | string;
  height?: number;
  locale?: Locale;
  theme?: ChartTheme;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (dataPoint: DataPoint) => void;
  onHover?: (dataPoint: DataPoint | null) => void;
}
```

## Data Format

Charts expect data in this format:

```typescript
interface DataPoint {
  [key: string]: string | number | boolean | null;
}

// Example
const data = [
  { year: 2020, category: "A", value: 100 },
  { year: 2021, category: "A", value: 120 },
  { year: 2020, category: "B", value: 80 },
  { year: 2021, category: "B", value: 90 },
];
```

## Configuration Options

### Chart Config

```typescript
interface ChartConfig {
  // Axis configuration
  xAxis: string;
  yAxis: string;

  // Grouping
  groupBy?: string;
  colorBy?: string;

  // Styling
  colors?: string[];
  theme?: "light" | "dark";

  // Localization
  locale?: Locale;

  // Interactivity
  interactive?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}
```

### Chart Theme

```typescript
interface ChartTheme {
  background: string;
  grid: string;
  text: string;
  colors: string[];
  fontFamily: string;
}
```

## Examples

### Time Series Chart

```tsx
import { LineChart } from "@acailic/vizualni-admin/charts";

const timeSeriesData = [
  { date: "2024-01-01", value: 100 },
  { date: "2024-02-01", value: 120 },
  { date: "2024-03-01", value: 140 },
];

<LineChart
  data={timeSeriesData}
  config={{
    xAxis: "date",
    yAxis: "value",
  }}
  width={800}
  height={400}
/>;
```

### Grouped Bar Chart

```tsx
import { BarChart } from "@acailic/vizualni-admin/charts";

const groupedData = [
  { category: "A", group: "X", value: 100 },
  { category: "B", group: "X", value: 120 },
  { category: "A", group: "Y", value: 80 },
  { category: "B", group: "Y", value: 90 },
];

<BarChart
  data={groupedData}
  config={{
    xAxis: "category",
    yAxis: "value",
    groupBy: "group",
    stacked: false,
  }}
/>;
```

### Responsive Chart

```tsx
import { LineChart } from "@acailic/vizualni-admin/charts";

function ResponsiveChart({ data }) {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <LineChart
        data={data}
        config={{
          xAxis: "date",
          yAxis: "value",
        }}
        width="100%"
        height="100%"
      />
    </div>
  );
}
```

## Best Practices

1. **Data Validation**: Ensure data is properly formatted before passing to
   charts
2. **Locale Support**: Pass locale prop for proper formatting
3. **Responsive Design**: Use percentage-based widths for responsive charts
4. **Performance**: Use memoization for large datasets
5. **Accessibility**: Add proper ARIA labels and descriptions

## Type Safety

All components are fully typed. Import types for use in your code:

```typescript
import type {
  DataPoint,
  ChartConfig,
  ChartTheme,
  LineChartProps,
  BarChartProps,
} from "@acailic/vizualni-admin/charts";
```

## See Also

- [React Hooks](/api-reference/hooks) - Data fetching hooks
- [Utilities](/api-reference/utilities) - Data transformation utilities
- [Plugin Guide](/api-reference/plugins) - Creating custom plugins
