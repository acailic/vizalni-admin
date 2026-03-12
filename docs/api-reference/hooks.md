# React Hooks API

Complete reference for all React hooks exported from
`@acailic/vizualni-admin/hooks`.

## Overview

Custom React hooks for data fetching, configuration management, and locale
handling in Vizualni Admin applications.

## Import

```typescript
// Import from main package
import {
  useDataGovRs,
  useChartConfig,
  useLocale,
} from "@acailic/vizualni-admin";

// Import from sub-path (recommended for tree-shaking)
import {
  useDataGovRs,
  useChartConfig,
  useLocale,
} from "@acailic/vizualni-admin/hooks";
```

## Available Hooks

### useDataGovRs

Fetch data from the Serbian Open Data Portal (data.gov.rs).

**Signature:**

```typescript
function useDataGovRs(
  datasetId: string,
  options?: UseDataGovRsOptions
): UseDataGovRsResult;
```

**Parameters:**

- `datasetId: string` - The ID of the dataset on data.gov.rs
- `options?: UseDataGovRsOptions` - Configuration options

**Options:**

```typescript
interface UseDataGovRsOptions {
  format?: "json" | "csv" | "xml";
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  refreshInterval?: number;
  enabled?: boolean;
}
```

**Returns:**

```typescript
interface UseDataGovRsResult {
  data: any[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  isValidating: boolean;
}
```

**Example:**

```tsx
import { useDataGovRs } from "@acailic/vizualni-admin/hooks";

function DatasetViewer({ datasetId }) {
  const { data, loading, error, refetch } = useDataGovRs(datasetId, {
    format: "json",
    limit: 1000,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

**Features:**

- Automatic caching and revalidation
- Pagination support
- Real-time data refresh
- Error handling
- Loading states

### useChartConfig

Manage chart configuration with validation and defaults.

**Signature:**

```typescript
function useChartConfig(
  initialConfig?: Partial<ChartConfig>
): UseChartConfigResult;
```

**Parameters:**

- `initialConfig?: Partial<ChartConfig>` - Initial configuration values

**Returns:**

```typescript
interface UseChartConfigResult {
  config: ChartConfig;
  updateConfig: (updates: Partial<ChartConfig>) => void;
  resetConfig: () => void;
  validate: () => ValidationResult;
  isValid: boolean;
}
```

**Example:**

```tsx
import { useChartConfig } from "@acailic/vizualni-admin/hooks";

function ChartEditor() {
  const { config, updateConfig, isValid } = useChartConfig({
    xAxis: "date",
    yAxis: "value",
    locale: "sr-Latn",
  });

  return (
    <div>
      <select
        value={config.xAxis}
        onChange={(e) => updateConfig({ xAxis: e.target.value })}
      >
        <option value="date">Date</option>
        <option value="category">Category</option>
      </select>

      {!isValid && <div>Invalid configuration</div>}
    </div>
  );
}
```

**Features:**

- Configuration validation
- Default value merging
- Reset to defaults
- Type-safe updates

### useLocale

Handle locale/translations in components.

**Signature:**

```typescript
function useLocale(): UseLocaleResult;
```

**Returns:**

```typescript
interface UseLocaleResult {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLocales: Locale[];
  isRTL: boolean;
}
```

**Example:**

```tsx
import { useLocale } from "@acailic/vizualni-admin/hooks";

function LocaleSelector() {
  const { locale, setLocale, t, availableLocales } = useLocale();

  return (
    <div>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
      >
        {availableLocales.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <h1>{t("chart.title")}</h1>
      <p>{t("chart.description", { count: 42 })}</p>
    </div>
  );
}
```

**Features:**

- Translation function with interpolation
- Locale switching
- RTL support detection
- Available locales list

## Hook Patterns

### Conditional Data Fetching

```tsx
function ConditionalChart({ datasetId, enabled }) {
  const { data } = useDataGovRs(datasetId, {
    enabled, // Only fetch when enabled is true
  });

  if (!data) return null;
  return <Chart data={data} />;
}
```

### Auto-Refreshing Data

```tsx
function LiveDashboard({ datasetId }) {
  const { data } = useDataGovRs(datasetId, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  return <Dashboard data={data} />;
}
```

### Configuration Persistence

```tsx
function PersistentChart() {
  const { config, updateConfig } = useChartConfig();

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("chart-config", JSON.stringify(config));
  }, [config]);

  return <Chart config={config} />;
}
```

### Locale-Aware Components

```tsx
function LocalizedChart({ data }) {
  const { locale, t } = useLocale();
  const { config } = useChartConfig({
    locale,
    title: t("chart.defaultTitle"),
  });

  return <Chart data={data} config={config} />;
}
```

## Best Practices

1. **Error Handling**: Always handle loading and error states

   ```tsx
   const { data, loading, error } = useDataGovRs(id);
   if (loading) return <Spinner />;
   if (error) return <ErrorDisplay error={error} />;
   ```

2. **Memoization**: Memoize callbacks to prevent unnecessary re-renders

   ```tsx
   const handleRefetch = useCallback(() => {
     refetch();
   }, [refetch]);
   ```

3. **Cleanup**: Clean up resources in useEffect

   ```tsx
   useEffect(() => {
     return () => {
       // Cleanup
     };
   }, []);
   ```

4. **Type Safety**: Use proper TypeScript types

   ```tsx
   interface MyData {
     id: string;
     value: number;
   }

   const { data } = useDataGovRs<MyData>(datasetId);
   ```

## Integration Examples

### Complete Data Viewer

```tsx
import { useDataGovRs, useLocale } from "@acailic/vizualni-admin/hooks";
import { LineChart } from "@acailic/vizualni-admin/charts";

function DataViewer({ datasetId }) {
  const { data, loading, error } = useDataGovRs(datasetId);
  const { locale } = useLocale();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <LineChart
      data={data}
      config={{
        xAxis: "date",
        yAxis: "value",
        locale,
      }}
    />
  );
}
```

### Configurable Chart Builder

```tsx
import { useChartConfig, useLocale } from "@acailic/vizualni-admin/hooks";
import { LineChart, BarChart } from "@acailic/vizualni-admin/charts";

function ChartBuilder({ data, chartType }) {
  const { config, updateConfig, isValid } = useChartConfig();
  const { t } = useLocale();

  const ChartComponent = chartType === "line" ? LineChart : BarChart;

  return (
    <div>
      <ChartConfigEditor config={config} onUpdate={updateConfig} />

      {isValid && <ChartComponent data={data} config={config} />}
    </div>
  );
}
```

## Type Definitions

```typescript
// Locale type
type Locale = "sr" | "sr-Latn" | "sr-Cyrl" | "en" | "de" | "fr";

// Chart config
interface ChartConfig {
  xAxis: string;
  yAxis: string;
  groupBy?: string;
  colorBy?: string;
  locale?: Locale;
  theme?: "light" | "dark";
}

// Validation result
interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}
```

## See Also

- [Chart Components](/api-reference/charts) - Chart component APIs
- [Utilities](/api-reference/utilities) - Data transformation utilities
- [Core API](/api-reference/core) - Core functionality
