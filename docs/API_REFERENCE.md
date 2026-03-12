# API Reference Guide

Complete guide to the Vizualni Admin API exports and how to use them.

## Overview

Vizualni Admin provides a modular API that allows you to import only what you
need. All exports are available from the main package, but you can also import
from specific sub-paths for better tree-shaking.

## Installation

```bash
npm install @acailic/vizualni-admin
# or
yarn add @acailic/vizualni-admin
```

## Export Structure

```
@acailic/vizualni-admin
├── exports/
│   ├── charts/       # Chart components
│   ├── hooks/        # React hooks
│   ├── utils/        # Utility functions
│   ├── core.ts       # Core functionality
│   └── client.ts     # DataGov.rs API client
```

## Main Package Export

Import everything from the main package:

```typescript
import {
  // Chart components
  LineChart,
  BarChart,
  ColumnChart,
  PieChart,
  AreaChart,
  MapChart,

  // Hooks
  useDataGovRs,
  useChartConfig,
  useLocale,

  // Utilities
  formatNumber,
  formatDate,
  transformData,

  // Core
  validateConfig,
  DEFAULT_CONFIG,
  locales,

  // Client
  DataGovRsClient,
  createDataGovRsClient,
} from "@acailic/vizualni-admin";
```

## Sub-Path Imports (Recommended)

For better tree-shaking, import from specific sub-paths:

### Chart Components (`@acailic/vizualni-admin/charts`)

```typescript
import {
  LineChart,
  BarChart,
  ColumnChart,
  PieChart,
  AreaChart,
  MapChart,
  chartRegistry,
  registerChartPlugin,
} from "@acailic/vizualni-admin/charts";
```

**Components:**

- **LineChart** - Line and area charts for time series data
- **BarChart** - Vertical and horizontal bar charts
- **ColumnChart** - Column charts for categorical data
- **PieChart** - Pie and donut charts
- **AreaChart** - Area charts with fill
- **MapChart** - Geographic visualizations

**Plugin System:**

- `chartRegistry` - Global chart plugin registry
- `registerChartPlugin()` - Register custom chart plugins
- `unregisterChartPlugin()` - Remove chart plugins
- `getChartPlugin()` - Get registered plugin
- `listChartPlugins()` - List all plugins
- `hasChartPlugin()` - Check if plugin exists

**Example:**

```tsx
import { LineChart } from "@acailic/vizualni-admin/charts";

function MyChart() {
  const data = [
    { year: 2020, value: 100 },
    { year: 2021, value: 120 },
    { year: 2022, value: 140 },
  ];

  return (
    <LineChart
      data={data}
      config={{
        xAxis: "year",
        yAxis: "value",
      }}
    />
  );
}
```

### React Hooks (`@acailic/vizualni-admin/hooks`)

```typescript
import {
  useDataGovRs,
  useChartConfig,
  useLocale,
} from "@acailic/vizualni-admin/hooks";
```

**Hooks:**

- **useDataGovRs** - Fetch data from Serbian Open Data Portal
- **useChartConfig** - Manage chart configuration
- **useLocale** - Handle locale/translations

**Example:**

```tsx
import { useDataGovRs } from "@acailic/vizualni-admin/hooks";

function DatasetViewer({ datasetId }) {
  const { data, loading, error } = useDataGovRs(datasetId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### Utilities (`@acailic/vizualni-admin/utils`)

```typescript
import {
  formatNumber,
  formatDate,
  transformData,
  normalizeData,
  aggregateData,
} from "@acailic/vizualni-admin/utils";
```

**Functions:**

- **formatNumber** - Format numbers with locale support
- **formatDate** - Format dates according to locale
- **transformData** - Transform data structures
- **normalizeData** - Normalize data for charts
- **aggregateData** - Aggregate data by dimensions

**Example:**

```typescript
import { formatNumber, formatDate } from "@acailic/vizualni-admin/utils";

const formatted = formatNumber(1234.56, { locale: "sr-Latn" });
// Returns: "1.234,56"

const date = formatDate(new Date(), { format: "long", locale: "sr-Cyrl" });
// Returns: "12. јануар 2024."
```

### Core API (`@acailic/vizualni-admin/core`)

```typescript
import {
  validateConfig,
  DEFAULT_CONFIG,
  locales,
  parseLocaleString,
  i18n,
} from "@acailic/vizualni-admin/core";
```

**Functions:**

- **validateConfig** - Validate configuration objects
- **DEFAULT_CONFIG** - Default configuration values
- **locales** - Available locales
- **parseLocaleString** - Parse locale strings
- **i18n** - Internationalization utilities

**Types:**

- `Locale` - Locale type definition
- `VizualniAdminConfig` - Configuration interface
- `ValidationIssue` - Validation issue type

**Example:**

```typescript
import { validateConfig, DEFAULT_CONFIG } from "@acailic/vizualni-admin/core";

const config = {
  ...DEFAULT_CONFIG,
  locale: "sr-Latn",
  theme: "light",
};

const validation = validateConfig(config);
if (!validation.isValid) {
  console.error("Invalid config:", validation.issues);
}
```

### DataGov.rs Client (`@acailic/vizualni-admin/client`)

```typescript
import {
  DataGovRsClient,
  createDataGovRsClient,
  dataGovRsClient,
} from "@acailic/vizualni-admin/client";
```

**Classes/Functions:**

- **DataGovRsClient** - API client class
- **createDataGovRsClient()** - Create configured client
- **dataGovRsClient** - Default client instance

**Types:**

- `DatasetMetadata` - Dataset metadata structure
- `Organization` - Organization information
- `Resource` - Data resource structure
- `PaginatedResponse` - Paginated response type
- `SearchParams` - Search parameters
- `DataGovRsConfig` - Client configuration
- `ApiError` - API error structure

**Example:**

```typescript
import { createDataGovRsClient } from "@acailic/vizualni-admin/client";

const client = createDataGovRsClient({
  baseUrl: "https://data.gov.rs/api/1",
  apiKey: process.env.DATA_GOV_RS_API_KEY,
});

const dataset = await client.getDataset("dataset-id");
const resources = await client.listResources("dataset-id");
```

## Type Definitions

### Chart Config Types

```typescript
interface ChartConfig {
  xAxis: string;
  yAxis: string;
  groupBy?: string;
  colorBy?: string;
  locale?: Locale;
  theme?: "light" | "dark";
}

interface LineChartConfig extends ChartConfig {
  curve?: "linear" | "monotone" | "step";
  showDots?: boolean;
  fillArea?: boolean;
}

interface BarChartConfig extends ChartConfig {
  orientation?: "vertical" | "horizontal";
  stacked?: boolean;
}
```

### Data Types

```typescript
interface DataPoint {
  [key: string]: string | number | boolean | null;
}

interface Dataset {
  id: string;
  title: string;
  description?: string;
  data: DataPoint[];
  metadata?: Record<string, any>;
}
```

## Plugin System

Create custom chart plugins:

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
      console.log("Rendering chart with config:", config);
    },

    afterRender: (chart) => {
      console.log("Chart rendered:", chart);
    },
  },

  validate: (config) => {
    if (!config.dataSource) {
      return { valid: false, errors: ["dataSource is required"] };
    }
    return { valid: true };
  },
};

registerChartPlugin(customPlugin);
```

## Locale Support

Available locales:

- `sr` - Serbian (Latin script)
- `sr-Cyrl` - Serbian (Cyrillic script)
- `en` - English
- `de` - German
- `fr` - French

Using locales:

```typescript
import { useLocale } from '@acailic/vizualni-admin/hooks';

function MyComponent() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div>
      <button onClick={() => setLocale('sr-Latn')}>Srpski</button>
      <button onClick={() => setLocale('en')}>English</button>
      <p>{t('chart.title')}</p>
    </div>
  );
}
```

## Configuration

### Default Configuration

```typescript
import { DEFAULT_CONFIG } from "@acailic/vizualni-admin/core";

console.log(DEFAULT_CONFIG);
// {
//   locale: 'sr',
//   theme: 'light',
//   animation: true,
//   responsive: true,
//   ... }
```

### Custom Configuration

```typescript
import { validateConfig } from "@acailic/vizualni-admin/core";

const customConfig = {
  locale: "sr-Cyrl",
  theme: "dark",
  animation: {
    duration: 500,
    easing: "easeInOut",
  },
  colors: {
    primary: "#3c8772",
    secondary: "#6c5ce7",
  },
};

const validation = validateConfig(customConfig);
if (validation.isValid) {
  // Apply configuration
}
```

## API Documentation Links

For detailed API documentation, see the automatically generated reference:

- [Main API Reference](/api-reference/) - Complete API overview
- [Chart Components](/api-reference/charts) - Chart component APIs
- [React Hooks](/api-reference/hooks) - Hook documentation
- [Utilities](/api-reference/utilities) - Utility function reference
- [Core API](/api-reference/core) - Core functionality
- [DataGov.rs Client](/api-reference/client) - API client documentation
- [Configuration](/api-reference/configuration) - Configuration options
- [Types](/api-reference/types) - TypeScript type definitions

## Examples

### Complete Dashboard Example

```tsx
import React from "react";
import { LineChart, BarChart } from "@acailic/vizualni-admin/charts";
import { useDataGovRs } from "@acailic/vizualni-admin/hooks";
import { formatNumber } from "@acailic/vizualni-admin/utils";

function Dashboard() {
  const { data: budgetData, loading } = useDataGovRs("budzet-srbije");

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Budžet Srbije</h1>
      <LineChart
        data={budgetData}
        config={{
          xAxis: "godina",
          yAxis: "iznos",
          locale: "sr-Cyrl",
        }}
      />
    </div>
  );
}
```

### Custom Chart with Plugin

```tsx
import { registerChartPlugin } from "@acailic/vizualni-admin/charts";

// Register custom plugin
registerChartPlugin({
  id: "custom-heatmap",
  name: "Custom Heatmap",
  version: "1.0.0",
  metadata: {
    description: "Custom heatmap implementation",
  },
});

// Use in component
function HeatmapChart({ data }) {
  // Custom heatmap implementation
  return <div>Heatmap visualization</div>;
}
```

## Best Practices

1. **Use Sub-Path Imports**: Import from specific sub-paths for better
   tree-shaking

   ```typescript
   // Good
   import { LineChart } from "@acailic/vizualni-admin/charts";

   // Avoid (larger bundle)
   import { LineChart } from "@acailic/vizualni-admin";
   ```

2. **Validate Configuration**: Always validate configuration before use

   ```typescript
   const validation = validateConfig(config);
   if (!validation.isValid) {
     console.error(validation.issues);
   }
   ```

3. **Handle Loading States**: Use hooks' loading and error states

   ```typescript
   const { data, loading, error } = useDataGovRs(datasetId);

   if (loading) return <Spinner />;
   if (error) return <ErrorDisplay error={error} />;
   ```

4. **Use Locale-Aware Formatting**: Format data according to user locale

   ```typescript
   const formatted = formatNumber(value, { locale: userLocale });
   ```

5. **Register Plugins Once**: Register plugins at application startup
   ```typescript
   // In app initialization
   registerChartPlugin(customPlugin);
   ```

## Contributing

When adding new exports:

1. Add JSDoc comments to all public APIs
2. Export from appropriate sub-path
3. Update TypeDoc configuration if adding new entry points
4. Run `npm run docs:api:build` to regenerate documentation
5. Test imports from both main package and sub-paths

## Support

- **Documentation**: [Full API Reference](/api-reference/)
- **Issues**: [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- **Discussions**:
  [GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions)

## License

BSD-3-Clause - See LICENSE file for details
