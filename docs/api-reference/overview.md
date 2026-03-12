# API Reference

Complete reference for all Vizualni Admin exports and APIs.

## Quick Navigation

- [API Reference Guide](/API_REFERENCE.md) - Comprehensive API guide with
  examples
- [Interactive TypeDoc Documentation](/api/) - Auto-generated API docs

## Export Categories

### [Chart Components](charts)

Standalone React chart components for visualizing data.

- **LineChart** - Line and area charts
- **BarChart** - Vertical and horizontal bar charts
- **ColumnChart** - Column charts for categorical data
- **PieChart** - Pie and donut charts
- **AreaChart** - Area charts with fill
- **MapChart** - Geographic visualizations
- **Plugin System** - Custom chart extensions

### [React Hooks](hooks)

Custom React hooks for data fetching and state management.

- **useDataGovRs** - Fetch from Serbian Open Data Portal
- **useChartConfig** - Chart configuration management
- **useLocale** - Locale and translation handling

### [Utilities](utilities-guide)

Data transformation and formatting utilities.

- **formatNumber** - Locale-aware number formatting
- **formatDate** - Date formatting
- **transformData** - Data structure transformation
- **normalizeData** - Data normalization
- **aggregateData** - Data aggregation
- **validateData** - Data validation

### [Core API](core)

Core utilities for configuration and internationalization.

- **validateConfig** - Configuration validation
- **DEFAULT_CONFIG** - Default configuration
- **locales** - Available locales
- **parseLocaleString** - Locale parsing
- **i18n** - Translation utilities
- **getD3TimeFormatLocale** - D3 time locale
- **getD3FormatLocale** - D3 number locale

### [DataGov.rs Client](client)

API client for Serbian Open Data Portal.

- **DataGovRsClient** - Main client class
- **createDataGovRsClient** - Factory function
- **dataGovRsClient** - Default instance
- Search, fetch, and list methods

## Installation

```bash
npm install @acailic/vizualni-admin
# or
yarn add @acailic/vizualni-admin
```

## Import Patterns

### Main Package Import

Import everything from the main package:

```typescript
import {
  LineChart,
  BarChart,
  useDataGovRs,
  formatNumber,
  validateConfig,
  DataGovRsClient,
} from "@acailic/vizualni-admin";
```

### Sub-Path Imports (Recommended)

For better tree-shaking, import from specific sub-paths:

```typescript
// Charts
import { LineChart } from "@acailic/vizualni-admin/charts";

// Hooks
import { useDataGovRs } from "@acailic/vizualni-admin/hooks";

// Utilities
import { formatNumber } from "@acailic/vizualni-admin/utils";

// Core
import { validateConfig } from "@acailic/vizualni-admin/core";

// Client
import { DataGovRsClient } from "@acailic/vizualni-admin/client";
```

## Quick Example

```tsx
import { LineChart } from "@acailic/vizualni-admin/charts";
import { useDataGovRs } from "@acailic/vizualni-admin/hooks";

function Dashboard({ datasetId }) {
  const { data, loading, error } = useDataGovRs(datasetId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <LineChart
      data={data}
      config={{
        xAxis: "date",
        yAxis: "value",
        locale: "sr-Latn",
      }}
    />
  );
}
```

## TypeScript Support

All exports are fully typed. Import types for use in your code:

```typescript
import type {
  DataPoint,
  ChartConfig,
  Locale,
  DatasetMetadata,
  ValidationResult,
} from "@acailic/vizualni-admin";
```

## Auto-Generated Documentation

For detailed, auto-generated API documentation, see the [TypeDoc output](/api/).

## Export Structure

```
@acailic/vizualni-admin
├── exports/
│   ├── charts/       # Chart components
│   ├── hooks/        # React hooks
│   ├── utils/        # Utility functions
│   ├── core.ts       # Core functionality
│   └── client.ts     # DataGov.rs client
```

## Documentation

- [API Reference Guide](/API_REFERENCE.md) - Complete API guide
- [TypeDoc Generated Docs](/api/) - Interactive API reference
- [Examples](/examples/) - Code examples
- [Guides](/guide/) - Usage guides

## Support

- **Issues**: [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- **Discussions**:
  [GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions)
- **Email**: support@vizualni-admin.rs

## License

BSD-3-Clause - See LICENSE file for details
