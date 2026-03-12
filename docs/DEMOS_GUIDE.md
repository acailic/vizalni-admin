# Demo Visualizations Guide

## Overview

The Vizualni Admin demo gallery showcases real-time data visualizations using
datasets from the Serbian Open Data Portal (data.gov.rs). Each demo
automatically fetches and visualizes real government data, demonstrating
different visualization techniques and use cases.

This implementation provides a solid foundation for data.gov.rs visualizations
that works seamlessly on GitHub Pages. The architecture is extensible,
maintainable, and user-friendly.

Key achievements:

- **Dynamic data visualization on a static hosting platform** through
  client-side fetching
- **Lightweight charting** with pure SVG (no external chart libraries needed)
- **Automatic data mapping** that works with any CSV/JSON structure
- **Production-ready demos** with real data from data.gov.rs API

## Live Demos

Access the demos at:
[https://acailic.github.io/vizualni-admin/demos](https://acailic.github.io/vizualni-admin/demos)

## Available Demos

### 1. 💰 Budget (Budžet Republike Srbije)

- **Type**: Column Chart
- **Data**: State budget and public finance data
- **Use Case**: Financial tracking and budget analysis
- **Tags**: finances, public-finance, budget

### 2. 🌍 Air Quality (Kvalitet vazduha)

- **Type**: Line Chart
- **Data**: Air quality monitoring from Serbian cities
- **Use Case**: Environmental monitoring and pollution tracking
- **Tags**: environment, ecology, air-quality

### 3. 👥 Demographics (Demografija i stanovništvo)

- **Type**: Bar Chart
- **Data**: Population statistics by region
- **Use Case**: Demographic analysis and population trends
- **Tags**: population, statistics, demographics

### 4. 🎓 Education (Obrazovanje)

- **Type**: Column Chart
- **Data**: Student enrollment and school statistics
- **Use Case**: Educational planning and resource allocation
- **Tags**: education, schools, students

### 5. 🚗 Traffic & Safety (Saobraćaj i bezbednost)

- **Type**: Column Chart
- **Data**: Traffic accidents and road safety statistics
- **Use Case**: Safety analysis and traffic planning
- **Tags**: traffic, safety, accidents

### 6. 🏥 Healthcare (Zdravstvo)

- **Type**: Bar Chart
- **Data**: Hospital data, patients, medical services
- **Use Case**: Healthcare resource planning
- **Tags**: healthcare, medicine, hospitals

### 7. 💼 Employment (Zaposlenost i tržište rada)

- **Type**: Line Chart
- **Data**: Employment, unemployment, job vacancies
- **Use Case**: Labor market analysis
- **Tags**: employment, labor, economy

### 8. ⚡ Energy (Energetika)

- **Type**: Column Chart
- **Data**: Energy production and consumption
- **Use Case**: Energy planning and sustainability analysis
- **Tags**: energy, electricity, renewable

### 9. 🌾 Agriculture (Poljoprivreda)

- **Type**: Bar Chart
- **Data**: Agricultural production, crops, livestock
- **Use Case**: Agricultural planning and food security
- **Tags**: agriculture, food-industry, rural-development

### 10. ✈️ Tourism (Turizam)

- **Type**: Line Chart
- **Data**: Tourist arrivals, overnight stays, spending
- **Use Case**: Tourism industry analysis
- **Tags**: tourism, hospitality, culture

### 11. 🎭 Culture & Arts (Kultura i umetnost)

- **Type**: Pie Chart
- **Data**: Cultural institutions, events, heritage sites
- **Use Case**: Cultural resource management
- **Tags**: culture, arts, museums

### 12. 🏗️ Infrastructure (Infrastruktura)

- **Type**: Column Chart
- **Data**: Public infrastructure - roads, water, sewerage
- **Use Case**: Infrastructure planning and maintenance
- **Tags**: infrastructure, public-works, construction

## Demo Structure

### File Structure

```
app/
├── lib/
│   └── demos/
│       ├── config.ts          # Demo configurations
│       └── index.ts           # Exports
├── hooks/
│   ├── use-data-gov-rs.ts     # Data fetching hook
│   └── index.ts               # Exports
├── components/
│   └── demos/
│       ├── demo-layout.tsx    # Layout components
│       └── index.ts           # Exports
└── pages/
    └── demos/
        ├── index.tsx          # Gallery page
        └── [category].tsx     # Dynamic demo page
```

### Components

#### Demo Configuration System

**File**: `app/lib/demos/config.ts`

Defines demo categories with:

- Bilingual titles and descriptions (Serbian/English)
- Search query for finding datasets
- Recommended chart type
- Tags for categorization
- Icon for visual identification

#### Custom React Hook

**File**: `app/hooks/use-data-gov-rs.ts`

Two hooks for data fetching:

##### `useDataGovRs(options)`

Primary hook for fetching and parsing datasets:

```typescript
const { dataset, resource, data, loading, error, refetch } = useDataGovRs({
  searchQuery: "budzet",
  autoFetch: true,
});
```

Features:

- Fetches dataset by ID or search query
- Automatically selects best resource for visualization
- Parses CSV and JSON formats
- Handles loading and error states
- Supports manual refetch

##### `useDataGovRsSearch()`

Helper hook for searching datasets:

```typescript
const { datasets, total, loading, error, search } = useDataGovRsSearch();
search("kvalitet vazduha");
```

#### Demo Layout Components

**File**: `app/components/demos/demo-layout.tsx`

Four reusable components:

##### `<DemoLayout>`

Main layout wrapper with:

- Consistent header and navigation
- Back button to demo gallery
- Dataset metadata display
- Footer with data source attribution

##### `<DemoLoading>`

Loading state with animated spinner

##### `<DemoError>`

Error state with retry button

##### `<DemoEmpty>`

Empty state for no data scenarios

#### Dynamic Demo Page

**File**: `app/pages/demos/[category].tsx`

Key features:

- **Static generation** with `getStaticPaths` and `getStaticProps`
- **Client-side data fetching** using `useDataGovRs` hook
- **Works on GitHub Pages** without server-side rendering
- Displays dataset info, data table preview, and chart placeholder
- Bilingual support (Serbian/English)

#### Demo Gallery Index

**File**: `app/pages/demos/index.tsx`

Features:

- Grid layout of all available demos
- Interactive cards with hover effects
- Statistics about data.gov.rs (6,162 resources, 93 organizations)
- Bilingual content
- Direct links to individual demos

## Creating New Demos

To add a new demo category:

### 1. Update Demo Config

Edit `/app/lib/demos/config.ts`:

```typescript
export const DEMO_CONFIGS: Record<string, DemoConfig> = {
  // ... existing demos
  myNewDemo: {
    id: "myNewDemo",
    title: {
      sr: "Moj novi demo",
      en: "My New Demo",
    },
    description: {
      sr: "Opis na srpskom",
      en: "English description",
    },
    searchQuery: "search terms for data.gov.rs",
    chartType: "column", // or 'line', 'bar', 'pie'
    tags: ["tag1", "tag2"],
    icon: "🎯",
  },
};
```

### 2. Build Static Pages

The new demo will automatically be included when you run:

```bash
yarn build:static
```

This generates static HTML for all demos defined in `DEMO_CONFIGS`.

### 3. Test Locally

```bash
yarn dev
# Visit http://localhost:3000/demos/myNewDemo
```

## Implementation Examples

### Step 1: Create Demo Configuration

```typescript
// app/lib/demos/config.ts
export interface DemoConfig {
  id: string;
  title: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  searchQuery: string;
  chartType: "line" | "bar" | "column" | "area" | "pie" | "map" | "scatterplot";
  defaultDatasetId?: string; // Optional pre-selected dataset
  tags?: string[];
}

export const DEMO_CONFIGS: Record<string, DemoConfig> = {
  budget: {
    id: "budget",
    title: {
      sr: "Budžet Republike Srbije",
      en: "Republic of Serbia Budget",
    },
    description: {
      sr: "Interaktivna vizualizacija državnog budžeta",
      en: "Interactive visualization of state budget",
    },
    searchQuery: "budzet",
    chartType: "column",
    tags: ["finansije", "javne-finansije"],
  },
  environment: {
    id: "environment",
    title: {
      sr: "Kvalitet vazduha",
      en: "Air Quality",
    },
    description: {
      sr: "Praćenje kvaliteta vazduha u gradovima Srbije",
      en: "Monitor air quality in Serbian cities",
    },
    searchQuery: "kvalitet vazduha",
    chartType: "line",
    tags: ["zivotna-sredina", "ekologija"],
  },
  demographics: {
    id: "demographics",
    title: {
      sr: "Demografija",
      en: "Demographics",
    },
    description: {
      sr: "Stanovništvo Srbije po regionima",
      en: "Serbian population by region",
    },
    searchQuery: "stanovnistvo",
    chartType: "bar",
    tags: ["stanovnistvo", "statistika"],
  },
};
```

### Step 2: Create Custom Hook

```typescript
// app/hooks/useDataGovRs.ts
import { useState, useEffect } from "react";
import {
  dataGovRsClient,
  getBestVisualizationResource,
} from "@/domain/data-gov-rs";
import type { DatasetMetadata, Resource } from "@/domain/data-gov-rs";

interface UseDataGovRsOptions {
  datasetId?: string;
  searchQuery?: string;
  autoFetch?: boolean;
}

interface UseDataGovRsReturn {
  dataset: DatasetMetadata | null;
  resource: Resource | null;
  data: any;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDataGovRs(options: UseDataGovRsOptions): UseDataGovRsReturn {
  const { datasetId, searchQuery, autoFetch = true } = options;

  const [dataset, setDataset] = useState<DatasetMetadata | null>(null);
  const [resource, setResource] = useState<Resource | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedDataset: DatasetMetadata;

      if (datasetId) {
        // Fetch by ID
        fetchedDataset = await dataGovRsClient.getDataset(datasetId);
      } else if (searchQuery) {
        // Search for datasets
        const results = await dataGovRsClient.searchDatasets({
          q: searchQuery,
          page_size: 1,
        });

        if (results.data.length === 0) {
          throw new Error(`No datasets found for query: ${searchQuery}`);
        }

        fetchedDataset = results.data[0];
      } else {
        throw new Error("Either datasetId or searchQuery must be provided");
      }

      setDataset(fetchedDataset);

      // Get best resource for visualization
      const bestResource = getBestVisualizationResource(fetchedDataset);

      if (!bestResource) {
        throw new Error("No suitable resource found for visualization");
      }

      setResource(bestResource);

      // Fetch resource data
      let resourceData: any;

      if (bestResource.format === "JSON") {
        resourceData = await dataGovRsClient.getResourceJSON(bestResource);
      } else if (bestResource.format === "CSV") {
        const csvText = await dataGovRsClient.getResourceData(bestResource);
        resourceData = parseCSV(csvText);
      } else {
        throw new Error(`Unsupported format: ${bestResource.format}`);
      }

      setData(resourceData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && (datasetId || searchQuery)) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetId, searchQuery, autoFetch]);

  return {
    dataset,
    resource,
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// NOTE: This is a simplified CSV parser that doesn't handle:
// - Commas within quoted fields
// - Newlines within quoted fields
// - Escaped quotes
// For production use, consider using a library like 'papaparse' or 'csv-parse'
function parseCSV(csv: string): any[] {
  const lines = csv.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1);

  return rows.map((row) => {
    const values = row.split(",").map((v) => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
}
```

### Step 3: Create Demo Layout Component

```typescript
// app/components/demos/DemoLayout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface DemoLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function DemoLayout({ children, title, description }: DemoLayoutProps) {
  const router = useRouter();

  return (
    <div className="demo-layout">
      <nav className="demo-nav">
        <Link href="/demos">← Back to Demos</Link>
      </nav>

      <header className="demo-header">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </header>

      <main className="demo-content">
        {children}
      </main>

      <footer className="demo-footer">
        <p>
          Data source: <a href="https://data.gov.rs" target="_blank" rel="noopener noreferrer">
            data.gov.rs
          </a>
        </p>
      </footer>

      <style jsx>{`
        .demo-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .demo-nav {
          margin-bottom: 2rem;
        }

        .demo-nav a {
          color: #0070f3;
          text-decoration: none;
        }

        .demo-nav a:hover {
          text-decoration: underline;
        }

        .demo-header {
          margin-bottom: 3rem;
        }

        .demo-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .demo-header p {
          font-size: 1.25rem;
          color: #666;
        }

        .demo-content {
          min-height: 400px;
        }

        .demo-footer {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid #eee;
          text-align: center;
          color: #666;
        }

        .demo-footer a {
          color: #0070f3;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
```

### Step 4: Create Individual Demo Page

```typescript
// app/pages/demos/[category].tsx
import { useRouter } from 'next/router';
import { DemoLayout } from '@/components/demos/DemoLayout';
import { DEMO_CONFIGS } from '@/lib/demos/config';
import { useDataGovRs } from '@/hooks/useDataGovRs';
import { ChartColumn } from '@/charts/column/chart-column';
import { ChartLine } from '@/charts/line/chart-lines';
import { ChartBar } from '@/charts/bar/chart-bar';

export default function DemoPage() {
  const router = useRouter();
  const { category } = router.query;

  // Get demo configuration
  const config = category ? DEMO_CONFIGS[category as string] : null;

  // Fetch data using custom hook
  const { dataset, data, loading, error } = useDataGovRs({
    searchQuery: config?.searchQuery,
    autoFetch: !!config
  });

  if (!config) {
    return (
      <DemoLayout title="Demo Not Found">
        <p>The requested demo category does not exist.</p>
      </DemoLayout>
    );
  }

  const locale = router.locale || 'sr';
  const title = config.title[locale as 'sr' | 'en'];
  const description = config.description[locale as 'sr' | 'en'];

  return (
    <DemoLayout title={title} description={description}>
      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading data from data.gov.rs...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <h3>Error Loading Data</h3>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {dataset && data && (
        <div className="demo-visualization">
          <div className="dataset-info">
            <h2>{dataset.title}</h2>
            <p>{dataset.description}</p>
            <div className="metadata">
              <span>Organization: {dataset.organization.title || dataset.organization.name}</span>
              <span>Updated: {new Date(dataset.updated_at).toLocaleDateString('sr-RS')}</span>
            </div>
          </div>

          <div className="chart-container">
            {renderChart(config.chartType, data)}
          </div>

          <div className="data-table">
            <h3>Raw Data (Preview)</h3>
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0] || {}).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row: any, i: number) => (
                  <tr key={i}>
                    {Object.values(row).map((value: any, j: number) => (
                      <td key={j}>{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .loading-state {
          text-align: center;
          padding: 4rem 0;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
        }

        .error-state h3 {
          color: #c00;
          margin-bottom: 1rem;
        }

        .error-state button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .dataset-info {
          margin-bottom: 2rem;
        }

        .metadata {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .chart-container {
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .data-table {
          margin-top: 3rem;
        }

        .data-table table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .data-table th,
        .data-table td {
          border: 1px solid #ddd;
          padding: 0.5rem;
          text-align: left;
        }

        .data-table th {
          background: #f5f5f5;
          font-weight: 600;
        }

        .data-table tr:hover {
          background: #f9f9f9;
        }
      `}</style>
    </DemoLayout>
  );
}

function renderChart(type: string, data: any) {
  // This is a simplified example - you'll need to transform data
  // to match the chart component's expected format

  const chartData = {
    // Transform your data here
    observations: data,
    // ... other required fields
  };

  switch (type) {
    case 'column':
      return <ChartColumn data={chartData} />;
    case 'line':
      return <ChartLine data={chartData} />;
    case 'bar':
      return <ChartBar data={chartData} />;
    default:
      return <p>Chart type not implemented yet</p>;
  }
}

// CRITICAL: This makes it work on GitHub Pages
export async function getStaticPaths() {
  const categories = Object.keys(DEMO_CONFIGS);

  return {
    paths: categories.map(category => ({
      params: { category }
    })),
    fallback: false // Don't generate unknown routes
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: {
      category: params.category
    }
  };
}
```

### Step 5: Create Demo Gallery Index

```typescript
// app/pages/demos/index.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DEMO_CONFIGS } from '@/lib/demos/config';
import { DemoLayout } from '@/components/demos/DemoLayout';

export default function DemosIndex() {
  const router = useRouter();
  const locale = router.locale || 'sr';

  return (
    <DemoLayout
      title={locale === 'sr' ? 'Demo Vizualizacije' : 'Demo Visualizations'}
      description={
        locale === 'sr'
          ? 'Istražite različite vizualizacije otvorenih podataka iz Srbije'
          : 'Explore different visualizations of Serbian open data'
      }
    >
      <div className="demo-grid">
        {Object.entries(DEMO_CONFIGS).map(([key, config]) => (
          <Link key={key} href={`/demos/${key}`} className="demo-card">
            <div className="demo-card-icon">
              {getIconForChartType(config.chartType)}
            </div>
            <h3>{config.title[locale as 'sr' | 'en']}</h3>
            <p>{config.description[locale as 'sr' | 'en']}</p>
            <div className="demo-card-meta">
              <span className="chart-type">{config.chartType}</span>
              {config.tags && (
                <span className="tags">{config.tags.join(', ')}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .demo-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }

        .demo-card:hover {
          border-color: #0070f3;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .demo-card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .demo-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .demo-card p {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .demo-card-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #999;
        }

        .chart-type {
          background: #f0f0f0;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .tags {
          font-style: italic;
        }
      `}</style>
    </DemoLayout>
  );
}

function getIconForChartType(type: string): string {
  const icons: Record<string, string> = {
    line: '📈',
    bar: '📊',
    column: '📊',
    area: '📉',
    pie: '🥧',
    map: '🗺️',
    scatterplot: '⚫'
  };
  return icons[type] || '📊';
}

export async function getStaticProps() {
  return {
    props: {}
  };
}
```

### Step 6: Test and Deploy

```bash
# 1. Test development build
yarn dev

# 2. Test static export
yarn build:static

# 3. Test the static files locally
npx serve app/out

# 4. Push to GitHub
git add .
git commit -m "Add demo visualizations"
git push origin your-branch-name

# 5. Deploy to GitHub Pages (automatic via GitHub Actions)
```

## Best Practices

### Technical Decisions

#### ✅ Client-Side Fetching

**Why**: Works on GitHub Pages, always shows fresh data, simple deployment

**Trade-off**: Slower initial render, requires JavaScript

#### ✅ Static Route Pre-generation

**Why**: Fast page loads, SEO friendly, reliable deployment

**Trade-off**: Need to know all routes at build time

#### ✅ Custom Hook for Data

**Why**: Reusable, testable, separates concerns

**Trade-off**: Additional abstraction layer

#### ✅ Material-UI Components

**Why**: Already in project, consistent design

**Trade-off**: Bundle size (mitigated by tree shaking)

### Performance Considerations

- **Initial Load**: ~2-3s (static HTML instant, data fetch adds latency)
- **Data Size**: Limit to first 20 rows for preview
- **API Calls**: One per demo page visit (could add caching)
- **Bundle Size**: ~500KB (mostly existing dependencies)

### Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **IE11**: Not supported (uses modern JavaScript)
- **Mobile**: Fully responsive, works on all screen sizes

### Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly
- High contrast support

### Security

- No API keys exposed (data.gov.rs is public)
- CORS handled by data.gov.rs
- No user data collection
- No external tracking

### Chart Type Selection Guide

Choose chart types based on your data:

| Chart Type | Best For                          | Example                                     |
| ---------- | --------------------------------- | ------------------------------------------- |
| **Line**   | Trends over time                  | Temperature, stock prices, employment rates |
| **Bar**    | Comparing categories (horizontal) | Regional comparisons, rankings              |
| **Column** | Comparing categories (vertical)   | Budget allocations, enrollment numbers      |
| **Pie**    | Part-to-whole relationships       | Budget distribution, market share           |

### Data Requirements

#### Optimal Data Format

For best results, datasets should have:

- **CSV or JSON format**: Automatically parsed
- **Clear headers**: Column names should be descriptive
- **Numeric values**: At least one numeric column for charts
- **Category labels**: At least one text column for labels
- **Reasonable size**: 10-10,000 rows (larger datasets are sampled)

#### Example Data Structure

```csv
Region,Population,Year
Beograd,1680000,2023
Novi Sad,350000,2023
Niš,250000,2023
```

### Customization

#### Changing Colors

Edit chart component props:

```typescript
<BarChart
  data={data}
  color="#custom-color"
  // ... other props
/>
```

#### Adjusting Chart Size

```typescript
<LineChart
  width={1000}
  height={500}
  margin={{ top: 30, right: 40, bottom: 70, left: 90 }}
/>
```

#### Custom Data Processing

Override column detection in `ChartVisualizer.tsx` or pass specific columns to
chart components.

## Troubleshooting

### Data Not Loading

1. Check browser console for errors
2. Verify data.gov.rs API is accessible
3. Check network tab for failed requests
4. Try different search query

### Build Errors

1. Ensure all dependencies installed: `yarn install`
2. Check TypeScript errors: `yarn typecheck`
3. Clear Next.js cache: `rm -rf app/.next`
4. Rebuild: `yarn build:static`

### 404 on GitHub Pages

1. Verify `fallback: false` in `getStaticPaths`
2. Check all routes are pre-generated
3. Ensure `NEXT_PUBLIC_BASE_PATH` is set correctly
4. Wait for GitHub Pages deployment to complete

### Demo Shows "No Data"

1. Check if data.gov.rs API is accessible
2. Verify search query returns results
3. Check browser console for errors
4. Try a different demo to isolate issue

### Chart Not Rendering

1. Ensure data is in correct format (array of objects)
2. Check that data has both numeric and text columns
3. Verify browser supports SVG rendering
4. Check for JavaScript errors in console

### Slow Loading

1. Dataset may be very large - sampling is automatic
2. Network connection to data.gov.rs may be slow
3. Try refreshing the page
4. Check browser network tab for slow requests

## API Reference

### useDataGovRs Hook

```typescript
const { dataset, resource, data, loading, error, refetch } = useDataGovRs({
  searchQuery: "your search term",
  autoFetch: true,
  parseCSV: true,
});
```

### ChartVisualizer Component

```typescript
<ChartVisualizer
  data={arrayOfObjects}
  chartType="column"
  title="Optional Chart Title"
/>
```

## Contributing

To contribute new chart types or improvements:

1. Add chart component to `/app/components/demos/charts/`
2. Export from `index.ts`
3. Add to ChartVisualizer switch statement
4. Update this documentation
5. Submit pull request

## License

BSD-3-Clause - See LICENSE file

## Resources

- **Data Source**: https://data.gov.rs
- **API Docs**: https://data.gov.rs/apidoc/
- **Dashboard**: https://data.gov.rs/sr/dashboard/
- **Budget Example**: https://budzeti.data.gov.rs/
- [data.gov.rs](https://data.gov.rs) - Serbian Open Data Portal
- [data.gov.rs API Docs](https://data.gov.rs/apidoc/) - API Documentation
- [D3.js](https://d3js.org/) - Visualization library
- [Next.js](https://nextjs.org/) - React framework
- [GitHub Repository](https://github.com/acailic/vizualni-admin)

## Support

For issues or questions:

- [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- [data.gov.rs Support](https://data.gov.rs)
