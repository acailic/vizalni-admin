# Chart Plugin Development Guide

This guide explains how to create and publish custom chart plugins for
vizualni-admin. Plugins allow you to add new chart types without modifying the
core bundle, keeping the library lean and maintainable.

## What is a Chart Plugin?

A chart plugin is a self-contained chart component that can be dynamically
registered with the vizualni-admin chart registry. Plugins:

- **Don't increase core bundle size** - only loaded when used
- **Support tree-shaking** - unused code is eliminated
- **Can be published separately** - third-party ecosystem
- **Follow a standard interface** - consistent API across plugins

## Quick Start

### 1. Create a Plugin

Create a new file for your plugin:

```tsx
// MyCustomChartPlugin.tsx
import type {
  IChartPlugin,
  ChartPluginMetadata,
  ChartPluginHooks,
  ChartValidationResult,
} from "@acailic/vizualni-admin/charts";
import type {
  BaseChartConfig,
  ChartData,
} from "@acailic/vizualni-admin/charts";

// 1. Define your chart configuration
export interface MyCustomChartConfig extends BaseChartConfig {
  // Add custom config options
  showLegend?: boolean;
  animationDuration?: number;
}

// 2. Create your chart component
export const MyCustomChart = ({ data, config, height, width, ...props }) => {
  // Implement your chart using D3, React, or any library
  return <div style={{ height, width }}>{/* Your chart implementation */}</div>;
};

// 3. Define plugin metadata
const metadata: ChartPluginMetadata = {
  id: "my-custom-chart",
  name: "My Custom Chart",
  version: "1.0.0",
  author: "Your Name <your.email@example.com>",
  description: "A brief description of what your chart does",
  category: "custom",
  tags: ["custom", "specialized", "visualization"],
  homepage: "https://github.com/yourname/my-custom-chart-plugin",
  repository: "https://github.com/yourname/my-custom-chart-plugin",
  license: "MIT",
  minCoreVersion: "0.1.0-beta.1",
  externalDependencies: [],
};

// 4. Optional: Define hooks
const hooks: ChartPluginHooks = {
  validateData: (
    data: ChartData[],
    config: MyCustomChartConfig
  ): ChartValidationResult => {
    // Validate data before rendering
    const errors = [];
    const warnings = [];

    if (data.length === 0) {
      errors.push({
        path: "data",
        message: "Data array cannot be empty",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  },
  onRegister: () => {
    console.log("My Custom Chart plugin registered!");
  },
};

// 5. Export the plugin definition
export const myCustomChartPlugin: IChartPlugin<MyCustomChartConfig> = {
  ...metadata,
  component: MyCustomChart,
  defaultConfig: {
    showLegend: true,
    animationDuration: 1000,
  },
  hooks,
  exampleData: [
    { x: "A", y: 10 },
    { x: "B", y: 20 },
  ],
  exampleConfig: {
    xAxis: "x",
    yAxis: "y",
    showLegend: true,
  },
};
```

### 2. Register the Plugin

```tsx
// app.tsx or component file
import { registerChartPlugin } from "@acailic/vizualni-admin/charts";
import { myCustomChartPlugin } from "./MyCustomChartPlugin";

// Register the plugin
const result = registerChartPlugin(myCustomChartPlugin);

if (result.success) {
  console.log(`Plugin '${result.pluginId}' registered successfully!`);
} else {
  console.error(`Registration failed: ${result.error}`);
}
```

### 3. Use the Plugin

```tsx
import { getChartPlugin } from "@acailic/vizualni-admin/charts";

// Get the registered plugin
const plugin = getChartPlugin("my-custom-chart");
const MyChart = plugin.component;

// Use the chart
function MyComponent() {
  const data = [
    { category: "A", value: 10 },
    { category: "B", value: 20 },
    { category: "C", value: 15 },
  ];

  const config = {
    xAxis: "category",
    yAxis: "value",
    color: "#6366f1",
    showLegend: true,
  };

  return <MyChart data={data} config={config} height={400} />;
}
```

## Plugin Interface

### Required Properties

Every plugin must implement `IChartPlugin<TConfig>` with:

| Property         | Type                  | Description                                                    |
| ---------------- | --------------------- | -------------------------------------------------------------- |
| `id`             | `string`              | Unique identifier (lowercase letters, numbers, hyphens only)   |
| `name`           | `string`              | Human-readable plugin name                                     |
| `version`        | `string`              | Semver version (e.g., "1.0.0")                                 |
| `author`         | `string`              | Plugin author/maintainer                                       |
| `description`    | `string`              | Brief description of the chart                                 |
| `category`       | `string`              | Chart category (e.g., "scientific", "financial", "geospatial") |
| `tags`           | `string[]`            | Discoverability tags                                           |
| `license`        | `string`              | SPDX license identifier (e.g., "MIT", "BSD-3-Clause")          |
| `minCoreVersion` | `string`              | Minimum compatible vizualni-admin version                      |
| `component`      | `React.ComponentType` | The chart component                                            |

### Optional Properties

| Property               | Type               | Description                             |
| ---------------------- | ------------------ | --------------------------------------- |
| `homepage`             | `string`           | Plugin homepage URL                     |
| `repository`           | `string`           | Repository URL                          |
| `externalDependencies` | `string[]`         | List of npm packages users must install |
| `defaultConfig`        | `Partial<TConfig>` | Default configuration values            |
| `hooks`                | `ChartPluginHooks` | Lifecycle hooks                         |
| `configSchema`         | `unknown`          | Configuration schema for validation     |
| `exampleData`          | `ChartData[]`      | Example data for demos                  |
| `exampleConfig`        | `TConfig`          | Example configuration                   |

### Component Props

Your chart component will receive these props:

```typescript
interface ChartComponentProps {
  data: ChartData[];
  config: YourConfigType;
  height?: number;
  width?: number | "100%";
  locale?: "sr-Latn" | "sr-Cyrl" | "en";
  className?: string;
  style?: React.CSSProperties;
  onDataPointClick?: (data: ChartData, index: number) => void;
  renderTooltip?: (data: ChartData) => React.ReactNode;
  showTooltip?: boolean;
  animated?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  error?: Error | null;
  id?: string;
  ariaLabel?: string;
  description?: string;
}
```

## Lifecycle Hooks

### validateData

Validate data before rendering:

```typescript
hooks: {
  validateData: (
    data: ChartData[],
    config: YourConfigType
  ): ChartValidationResult => {
    const errors = [];
    const warnings = [];

    // Check for required data structure
    if (!data || data.length === 0) {
      errors.push({
        path: "data",
        message: "Data array is required",
      });
    }

    // Check for minimum data points
    if (data.length < 3) {
      warnings.push({
        path: "data",
        message: "Chart works best with at least 3 data points",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  };
}
```

### transformData

Transform data before rendering:

```typescript
hooks: {
  transformData: (data: ChartData[], config: YourConfigType): ChartData[] => {
    // Normalize data structure
    return data.map((d) => ({
      ...d,
      // Add computed fields
      normalizedValue: d.value / 100,
    }));
  };
}
```

### transformConfig

Transform configuration before rendering:

```typescript
hooks: {
  transformConfig: (config: YourConfigType): YourConfigType => {
    // Apply defaults or normalize config
    return {
      ...config,
      animationDuration: config.animationDuration ?? 1000,
    };
  };
}
```

### onRegister / onUnregister

Initialization and cleanup:

```typescript
hooks: {
  onRegister: () => {
    console.log('Plugin registered!');
    // Initialize resources, event listeners, etc.
  },
  onUnregister: () => {
    console.log('Plugin unregistered!');
    // Cleanup resources, event listeners, etc.
  }
}
```

## Best Practices

### 1. Plugin ID Convention

Use descriptive IDs with prefixes:

```typescript
// Good
id: "myorg-radar-chart";
id: "company-scientific-heatmap";

// Avoid
id: "chart"; // Too generic
id: "MyChart"; // Invalid (uppercase)
```

### 2. Category Selection

Choose from common categories or create your own:

- `statistical` - Histograms, box plots, scatter plots
- `scientific` - Heatmaps, contour plots, 3D visualizations
- `financial` - Candlestick, OHLC, stock charts
- `geospatial` - Choropleth, flow maps, cartograms
- `network` - Force-directed, Sankey, node-link diagrams
- `time-series` - Gantt, calendar, timeline
- `hierarchical` - Treemap, sunburst, icicle
- `custom` - Everything else

### 3. Version Compatibility

Always specify `minCoreVersion`:

```typescript
import { version } from '@acailic/vizualni-admin/package.json';

minCoreVersion: '0.1.0-beta.1',  // Minimum version that works
```

### 4. Accessibility

Include ARIA labels and descriptions:

```tsx
<div
  role="img"
  aria-label={ariaLabel || title || "My chart"}
  aria-describedby={description ? `${id}-desc` : undefined}
>
  {description && (
    <span id={`${id}-desc`} style={{ display: "none" }}>
      {description}
    </span>
  )}
  {/* Chart content */}
</div>
```

### 5. Responsive Design

Handle responsive widths:

```tsx
const containerRef = useRef<HTMLDivElement>(null);
const [containerWidth, setContainerWidth] = useState(800);

useEffect(() => {
  if (typeof width === "string" && containerRef.current) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }
}, [width]);
```

### 6. Error Handling

Gracefully handle edge cases:

```tsx
if (!data || data.length === 0) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      No data available
    </div>
  );
}

if (error) {
  return (
    <div style={{ color: "red", padding: "1rem" }}>Error: {error.message}</div>
  );
}
```

## Publishing a Plugin

### 1. Create a Package

```bash
mkdir my-custom-chart-plugin
cd my-custom-chart-plugin
npm init -y
```

### 2. Add Dependencies

```bash
npm install @acailic/vizualni-admin react d3-select d3-scale
npm install -D typescript @types/react @types/d3-select @types/d3-scale
```

### 3. Configure TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 4. Export the Plugin

```tsx
// index.ts
export { myCustomChartPlugin } from "./MyCustomChartPlugin";
export { MyCustomChart } from "./MyCustomChartPlugin";
export type { MyCustomChartConfig } from "./MyCustomChartPlugin";
```

### 5. Publish to npm

```bash
npm publish
```

### 6. Users Install and Use

```bash
npm install my-custom-chart-plugin
```

```tsx
import { registerChartPlugin } from "@acailic/vizualni-admin/charts";
import { myCustomChartPlugin } from "my-custom-chart-plugin";

registerChartPlugin(myCustomChartPlugin);
```

## Example Plugins

See the complete example plugin:

- **Radar Chart**:
  `/home/nistrator/Documents/github/vizualni-admin/app/exports/charts/examples/RadarChartPlugin.tsx`

This example demonstrates:

- D3-based rendering
- Responsive design
- Tooltip interaction
- Data validation
- Lifecycle hooks
- Complete metadata

## Registry API Reference

### registerChartPlugin

```typescript
function registerChartPlugin<TConfig extends BaseChartConfig>(
  plugin: IChartPlugin<TConfig>,
  options?: {
    force?: boolean; // Skip validation
    override?: boolean; // Replace existing plugin
  }
): PluginRegistrationResult;
```

### getChartPlugin

```typescript
function getChartPlugin<TConfig extends BaseChartConfig>(
  pluginId: string
): ChartRegistryEntry<TConfig> | undefined;
```

### unregisterChartPlugin

```typescript
function unregisterChartPlugin(pluginId: string): boolean;
```

### listChartPlugins

```typescript
function listChartPlugins(): ChartRegistryEntry[];
```

### hasChartPlugin

```typescript
function hasChartPlugin(pluginId: string): boolean;
```

### clearChartPlugins

```typescript
function clearChartPlugins(): void; // Removes all external plugins
```

### getChartPluginStats

```typescript
function getChartPluginStats(): {
  total: number;
  builtin: number;
  external: number;
  byCategory: Record<string, number>;
};
```

## Troubleshooting

### Plugin not registering

- Check that plugin ID is unique
- Verify `minCoreVersion` compatibility
- Ensure all required metadata fields are present
- Check browser console for validation errors

### Chart not rendering

- Verify data structure matches expected format
- Check that `xAxis` and `yAxis` config values match data keys
- Ensure component handles empty data gracefully
- Check for TypeScript/JavaScript errors in console

### Bundle size concerns

- Plugin code is only included when imported
- Use dynamic imports for conditional plugin loading:
  ```tsx
  const { myCustomChartPlugin } = await import("my-custom-chart-plugin");
  registerChartPlugin(myCustomChartPlugin);
  ```

## Resources

- Plugin types:
  `/home/nistrator/Documents/github/vizualni-admin/app/exports/charts/plugin-types.ts`
- Registry implementation:
  `/home/nistrator/Documents/github/vizualni-admin/app/exports/charts/chart-registry.ts`
- Example plugin:
  `/home/nistrator/Documents/github/vizualni-admin/app/exports/charts/examples/RadarChartPlugin.tsx`
- Architecture docs:
  `/home/nistrator/Documents/github/vizualni-admin/docs/ARCHITECTURE.md`

## Support

- Issues: https://github.com/acailic/vizualni-admin/issues
- Discussions: https://github.com/acailic/vizualni-admin/discussions
- Docs: https://github.com/acailic/vizualni-admin/tree/main/docs
