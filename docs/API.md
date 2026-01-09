# Vizualni Admin API Documentation

Complete reference for all components, hooks, and utilities in Vizualni Admin.

---

## 📚 Table of Contents

- [Installation](#installation)
- [Chart Components](#chart-components)
- [Data Hooks](#data-hooks)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)
- [Configuration](#configuration)
- [Examples](#examples)

---

## Installation

```bash
npm install @acailic/vizualni-admin
# or
yarn add @acailic/vizualni-admin
```

---

## Chart Components

### LineChart

Creates line and area charts for time series and continuous data.

```jsx
import { LineChart } from '@acailic/vizualni-admin';

<LineChart
  data={data}
  xKey="date"
  yKey="value"
  title="Revenue Over Time"
  width={800}
  height={400}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `DataPoint[]` | **Required** | Array of data points |
| `xKey` | `string` | **Required** | Key for x-axis values |
| `yKey` | `string` | **Required** | Key for y-axis values |
| `width` | `number \| string` | 800 | Chart width |
| `height` | `number` | 400 | Chart height |
| `title` | `string` | - | Chart title |
| `color` | `string` | '#0090ff' | Line color |
| `curve` | `'linear' \| 'monotone' \| 'step'` | 'linear' | Line curve type |
| `showGrid` | `boolean` | true | Show grid lines |
| `showTooltip` | `boolean` | true | Show tooltips |
| `showLegend` | `boolean` | true | Show legend |
| `strokeWidth` | `number` | 2 | Line stroke width |
| `fill` | `boolean \| string` | false | Fill area under line |
| `locale` | `string` | 'sr' | Localization (sr, sr-Latn, sr-Cyrl, en) |
| `theme` | `ChartTheme` | defaultTheme | Chart theme |

#### Example

```jsx
const temperatureData = [
  { date: '2024-01', temp: 5 },
  { date: '2024-02', temp: 7 },
  { date: '2024-03', temp: 12 },
  { date: '2024-04', temp: 18 },
];

<LineChart
  data={temperatureData}
  xKey="date"
  yKey="temp"
  title="Temperature Trend"
  color="#ff6b6b"
  fill="gradient"
  locale="sr"
/>
```

### BarChart

Creates vertical and horizontal bar charts for comparisons.

```jsx
import { BarChart } from '@acailic/vizualni-admin';

<BarChart
  data={data}
  xKey="category"
  yKey="value"
  orientation="vertical"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `DataPoint[]` | **Required** | Array of data points |
| `xKey` | `string` | **Required** | Key for category axis |
| `yKey` | `string` | **Required** | Key for value axis |
| `orientation` | `'vertical' \| 'horizontal'` | 'vertical' | Bar orientation |
| `colors` | `string[]` | ['#0090ff'] | Bar colors |
| `barRadius` | `number` | 0 | Bar border radius |
| `showValues` | `boolean` | true | Show values on bars |
| `sortBars` | `boolean` | false | Sort bars by value |
| `...` | *LineChart props* | - | Inherits all LineChart props |

### PieChart

Creates pie and donut charts for proportional data.

```jsx
import { PieChart } from '@acailic/vizualni-admin';

<PieChart
  data={data}
  nameKey="category"
  valueKey="percentage"
  innerRadius={60}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `DataPoint[]` | **Required** | Array of data points |
| `nameKey` | `string` | **Required** | Key for segment names |
| `valueKey` | `string` | **Required** | Key for segment values |
| `innerRadius` | `number` | 0 | Inner radius (for donut chart) |
| `outerRadius` | `number` | 100 | Outer radius |
| `startAngle` | `number` | 0 | Starting angle |
| `endAngle` | `number` | 360 | Ending angle |
| `showLabels` | `boolean` | true | Show segment labels |
| `showPercentages` | `boolean` | true | Show percentages |
| `colors` | `string[]` | defaultColors | Color palette |

### SerbiaMap

Creates a map of Serbia with regional data visualization.

```jsx
import { SerbiaMap } from '@acailic/vizualni-admin';

<SerbiaMap
  data={regionalData}
  regionKey="okrug"
  valueKey="population"
  colorScale="blues"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `RegionData[]` | **Required** | Regional data array |
| `regionKey` | `string` | **Required** | Key for region names |
| `valueKey` | `string` | **Required** | Key for values |
| `colorScale` | `ColorScale` | 'blues' | Color scheme |
| `showTooltip` | `boolean` | true | Show tooltips |
| `showLabels` | `boolean` | true | Show region labels |
| `interactive` | `boolean` | true | Enable zoom/pan |

### DataTable

Sortable and filterable data table component.

```jsx
import { DataTable } from '@acailic/vizualni-admin';

<DataTable
  data={data}
  columns={columns}
  sortable={true}
  filterable={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | **Required** | Table data |
| `columns` | `Column[]` | **Required** | Column definitions |
| `sortable` | `boolean` | true | Enable sorting |
| `filterable` | `boolean` | true | Enable filtering |
| `pagination` | `boolean` | true | Enable pagination |
| `pageSize` | `number` | 10 | Rows per page |

---

## Data Hooks

### useDataGovRs

Fetches data from the Serbian Open Data Portal (data.gov.rs).

```jsx
import { useDataGovRs } from '@acailic/vizualni-admin';

function MyComponent() {
  const { data, loading, error, refetch } = useDataGovRs('dataset-id', {
    format: 'json',
    limit: 1000,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <Chart data={data} />;
}
```

#### Parameters

- `datasetId: string` - The ID of the dataset on data.gov.rs
- `options?: UseDataGovRsOptions` - Configuration options

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `'json' \| 'csv' \| 'xml'` | 'json' | Response format |
| `limit` | `number` | 100 | Maximum records |
| `offset` | `number` | 0 | Pagination offset |
| `filters` | `Record<string, any>` | - | Query filters |
| `refreshInterval` | `number` | - | Auto-refresh in ms |

#### Returns

```typescript
{
  data: any[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

### useSerbianStats

Fetches Serbian statistical data.

```jsx
const { data } = useSerbianStats('population', {
  year: 2023,
  region: 'srbija',
});
```

### useLocalStorage

Saves and retrieves data from localStorage.

```jsx
const [savedCharts, setSavedCharts] = useLocalStorage('my-charts', []);
```

---

## Utility Functions

### formatSerbianNumber

Formats numbers according to Serbian conventions.

```jsx
import { formatSerbianNumber } from '@acailic/vizualni-admin/utils';

formatSerbianNumber(1234.56); // "1.234,56"
formatSerbianNumber(1234567, { currency: 'RSD' }); // "1.234.567 RSD"
```

#### Parameters

- `value: number` - Number to format
- `options?: FormatOptions` - Formatting options

#### Options

```typescript
interface FormatOptions {
  decimals?: number;
  currency?: string;
  unit?: string;
  locale?: 'sr-Latn' | 'sr-Cyrl';
}
```

### formatSerbianDate

Formats dates for Serbian locale.

```jsx
import { formatSerbianDate } from '@acailic/vizualni-admin/utils';

formatSerbianDate(new Date()); // "12.12.2024."
formatSerbianDate('2024-12-12', { format: 'long' }); // "12. децембар 2024."
```

### translateToSerbian

Translates text to Serbian.

```jsx
import { translateToSerbian } from '@acailic/vizualni-admin/utils';

translateToSerbian('Revenue', 'sr-Latn'); // "Prihod"
translateToSerbian('Revenue', 'sr-Cyrl'); // "Приход"
```

### validateSerbianData

Validates data against Serbian data standards.

```jsx
import { validateSerbianData } from '@acailic/vizualni-admin/utils';

const validation = validateSerbianData(data, {
  requiredFields: ['godina', 'vrednost'],
  dateFormat: 'DD.MM.YYYY',
});

if (validation.isValid) {
  // Data is valid
} else {
  console.log(validation.errors);
}
```

---

## Type Definitions

### DataPoint

```typescript
interface DataPoint {
  [key: string]: any;
}
```

### ChartTheme

```typescript
interface ChartTheme {
  background: string;
  grid: string;
  text: string;
  colors: string[];
  fontFamily: string;
}
```

### RegionData

```typescript
interface RegionData {
  [region: string]: {
    [metric: string]: number | string;
  };
}
```

### Column

```typescript
interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any) => ReactNode;
}
```

---

## Configuration

### Default Theme

```jsx
import { setTheme } from '@acailic/vizualni-admin';

setTheme({
  background: '#ffffff',
  grid: '#e0e0e0',
  text: '#333333',
  colors: ['#0090ff', '#00d4ff', '#7c4dff', '#ff6b6b'],
  fontFamily: 'NotoSans, sans-serif',
});
```

### Localization

```jsx
import { setLocale, addTranslations } from '@acailic/vizualni-admin';

setLocale('sr');

addTranslations('sr', {
  'chart.title': 'Naslov grafikona',
  'data.loading': 'Učitavanje...',
  'export.png': 'Izvezi kao PNG',
});
```

### API Configuration

```jsx
import { configureApi } from '@acailic/vizualni-admin';

configureApi({
  dataGovRs: {
    baseUrl: 'https://data.gov.rs/api/1',
    apiKey: process.env.DATA_GOV_RS_API_KEY,
  },
  cache: {
    ttl: 300000, // 5 minutes
  },
});
```

---

## Examples

### Complete Dashboard Example

```jsx
import React from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  useDataGovRs,
} from '@acailic/vizualni-admin';

function Dashboard() {
  const { data: budgetData, loading: loadingBudget } = useDataGovRs('budzet-srbije');
  const { data: populationData, loading: loadingPopulation } = useDataGovRs('stanovnistvo');

  if (loadingBudget || loadingPopulation) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Serbian Data Dashboard</h1>

      <div className="chart-grid">
        <div className="chart-container">
          <LineChart
            data={budgetData}
            xKey="godina"
            yKey="iznos"
            title="Буџет кроз године"
            width={600}
            height={300}
            locale="sr-Cyrl"
          />
        </div>

        <div className="chart-container">
          <BarChart
            data={populationData}
            xKey="region"
            yKey="population"
            title="Становништво по регионима"
            orientation="horizontal"
            colors={['#0090ff']}
            locale="sr-Cyrl"
          />
        </div>
      </div>
    </div>
  );
}
```

### Custom Chart Component

```jsx
import React, { useState } from 'react';
import { LineChart, useLocalStorage } from '@acailic/vizualni-admin';

function CustomLineChart({ initialData }) {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useLocalStorage('chart-config', {
    color: '#0090ff',
    showGrid: true,
    curve: 'linear',
  });

  const handleDataPointClick = (point) => {
    alert(`Value: ${point.value}`);
  };

  return (
    <div>
      <div className="controls">
        <label>
          Color:
          <input
            type="color"
            value={config.color}
            onChange={(e) => setConfig({...config, color: e.target.value})}
          />
        </label>

        <label>
          Show Grid:
          <input
            type="checkbox"
            checked={config.showGrid}
            onChange={(e) => setConfig({...config, showGrid: e.target.checked})}
          />
        </label>
      </div>

      <LineChart
        data={data}
        xKey="date"
        yKey="value"
        onClick={handleDataPointClick}
        {...config}
      />
    </div>
  );
}
```

---

## Next Steps

- [Examples Gallery](./EXAMPLES.md) - More code examples
- [Deployment Guide](./DEPLOYMENT.md) - How to deploy
- [Contributing](../CONTRIBUTING.md) - How to contribute

---

## Support

For API questions and issues:
- 📧 [Email Support](mailto:api@vizualni-admin.rs)
- 💬 [GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions)
- 🐛 [Report Bug](https://github.com/acailic/vizualni-admin/issues)