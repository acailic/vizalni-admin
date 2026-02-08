# @acailic/vizualni-admin

> Serbian Open Data visualization toolkit for React. Beta, but usable today.

[![npm version](https://img.shields.io/npm/v/@acailic/vizualni-admin.svg)](https://www.npmjs.com/package/@acailic/vizualni-admin)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://github.com/acailic/vizualni-admin/blob/main/LICENSE)

## Why This Package

- Ready-to-use chart components backed by D3
- `data.gov.rs` API client and React hooks
- Locale helpers and Serbian-friendly formatters
- Utilities for transforming data before charting

## Quick Start (Charts)

```bash
npm install @acailic/vizualni-admin
```

```tsx
import { LineChart } from "@acailic/vizualni-admin/charts";

const data = [
  { year: "2019", value: 72 },
  { year: "2020", value: 54 },
  { year: "2021", value: 63 },
  { year: "2022", value: 81 },
];

export function MyChart() {
  return (
    <LineChart
      data={data}
      config={{ xAxis: "year", yAxis: "value", title: "Employment Recovery" }}
      height={360}
      width="100%"
    />
  );
}
```

## Entry Points (Cheat Sheet)

| Import                               | What You Get                         |
| ------------------------------------ | ------------------------------------ |
| `@acailic/vizualni-admin/charts`     | Chart components + chart types       |
| `@acailic/vizualni-admin/hooks`      | React hooks like `useDataGovRs`      |
| `@acailic/vizualni-admin/client`     | Data.gov.rs client + types           |
| `@acailic/vizualni-admin/core`       | Locale helpers + config validation   |
| `@acailic/vizualni-admin/utils`      | Formatters + data transforms         |
| `@acailic/vizualni-admin/connectors` | CSV connector + registry             |
| `@acailic/vizualni-admin`            | Core exports + client + config types |

## Charts

### Multi-series Line Chart

```tsx
import { LineChart } from "@acailic/vizualni-admin/charts";

const data = [
  { year: "2020", revenue: 120, profit: 40 },
  { year: "2021", revenue: 180, profit: 65 },
  { year: "2022", revenue: 160, profit: 55 },
];

<LineChart
  data={data}
  config={{
    xAxis: "year",
    yAxis: ["revenue", "profit"],
    title: "Revenue vs Profit",
  }}
  height={360}
  showTooltip
/>;
```

### Bar and Pie Charts

```tsx
import { BarChart, PieChart } from "@acailic/vizualni-admin/charts";

<BarChart
  data={[
    { label: "2019", value: 180 },
    { label: "2020", value: 140 },
  ]}
  config={{ xAxis: "label", yAxis: "value", title: "New Jobs" }}
  height={320}
/>;

<PieChart
  data={[
    { label: "Solar", value: 18 },
    { label: "Wind", value: 22 },
  ]}
  config={{ xAxis: "label", yAxis: "value", title: "Energy Mix" }}
  height={320}
/>;
```

## Data.gov.rs

### React Hook

```tsx
import { useDataGovRs } from "@acailic/vizualni-admin/hooks";

export function DatasetSearch() {
  const { data, count, isLoading, error } = useDataGovRs({
    params: { q: "ekonomija", page_size: 10 },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {count} results
      {data?.map((d) => (
        <div key={d.id}>{d.title}</div>
      ))}
    </div>
  );
}
```

### Client (Non-React)

```ts
import { DataGovRsClient } from "@acailic/vizualni-admin/client";

const client = new DataGovRsClient({ timeout: 8000 });
const result = await client.searchDatasets({ q: "budzet" });
console.log(result.data.length, result.total);
```

## Locale and Formatting

```ts
import { defaultLocale, parseLocaleString } from "@acailic/vizualni-admin/core";
import { formatNumber, formatDate } from "@acailic/vizualni-admin/utils";

const locale = parseLocaleString("sr-Cyrl");
console.log(defaultLocale);
console.log(formatNumber(1234567.89, locale));
console.log(formatDate(new Date(), locale));
```

## I18n (Optional)

```tsx
import { I18nProvider, i18n } from "@acailic/vizualni-admin";

export function App({ children }: { children: React.ReactNode }) {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
```

## CSV Connector

```ts
import { CsvUrlConnector } from "@acailic/vizualni-admin/connectors";

const connector = new CsvUrlConnector({
  id: "demo",
  name: "Demo CSV",
  url: "https://example.com/data.csv",
});

const { data, schema } = await connector.fetch();
console.log(schema.fields);
```

## TypeScript Tips

- Use `ChartData` and `BaseChartConfig` from `@acailic/vizualni-admin/charts`.
- `useDataGovRs` is fully typed and returns `DatasetMetadata[]`.
- The config validator is in `@acailic/vizualni-admin/core`.

## Supported Locales

- `sr-Latn` (default)
- `sr-Cyrl`
- `en`

## Requirements

- Node.js 18+
- React 18 or 19

## Optional Dependencies

If you use Lingui integration, install:

```bash
npm install @lingui/core @lingui/react
```

## Links

- npm: https://www.npmjs.com/package/@acailic/vizualni-admin
- Repo: https://github.com/acailic/vizualni-admin
- Live demo: https://acailic.github.io/vizualni-admin/
- Issues: https://github.com/acailic/vizualni-admin/issues

## Changelog

See `CHANGELOG.md` in the repository root.
