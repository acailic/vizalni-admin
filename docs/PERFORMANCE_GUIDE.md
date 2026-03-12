// tsup.config.ts
export default defineConfig({
  // ... other options
  treeshake: true,
  minify: true,
  splitting: true,
});
```

### External Dependencies

Avoid bundling large libraries that are likely already available:

```typescript
// tsup.config.ts
export default defineConfig({
  external: ['react', 'react-dom', 'd3'],
});
```

### Dynamic Imports

Use dynamic imports for heavy libraries:

```typescript
const d3 = await import('d3');
```

### Bundle Analysis

Use tools like `webpack-bundle-analyzer` or `rollup-plugin-visualizer` to identify large dependencies:

```bash
npm run analyze
```

Target bundle sizes:
- Main bundle: <300KB gzipped
- Individual chunks: <100KB gzipped
- Total size: <500KB gzipped

## Code Splitting Strategies

Code splitting allows loading only the necessary code for each route or feature.

### Route-Based Splitting

Split code by routes in Next.js:

```typescript
// pages/dashboard.tsx
const Dashboard = lazy(() => import('../components/Dashboard'));

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

### Component-Based Splitting

Split large components:

```typescript
const HeavyChart = lazy(() => import('../components/HeavyChart'));

function ChartContainer() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart />
    </Suspense>
  );
}
```

### Vendor Splitting

Separate vendor libraries:

```typescript
// next.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

## Lazy Loading Patterns

Lazy loading defers loading of non-critical resources.

### Image Lazy Loading

Use native lazy loading for images:

```tsx
<img
  src={imageSrc}
  loading="lazy"
  alt="Description"
/>
```

### Component Lazy Loading

Lazy load heavy components:

```typescript
import { lazy, Suspense } from 'react';

const LazyChart = lazy(() => import('./HeavyChart'));

function App() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <LazyChart />
    </Suspense>
  );
}
```

### Data Lazy Loading

Load data on demand:

```typescript
const [data, setData] = useState(null);

useEffect(() => {
  if (inView) {
    fetchData().then(setData);
  }
}, [inView]);
```

## Data Loading Optimization

Efficient data loading is critical for performance, especially with large datasets.

### Pagination and Virtual Scrolling

For large datasets, implement pagination or virtual scrolling:

```typescript
// Use react-window for virtual scrolling
import { FixedSizeList as List } from 'react-window';

function VirtualizedTable({ data }) {
  return (
    <List
      height={400}
      itemCount={data.length}
      itemSize={35}
    >
      {({ index, style }) => (
        <div style={style}>
          {data[index].name}
        </div>
      )}
    </List>
  );
}
```

### Data Prefetching

Prefetch likely-needed data:

```typescript
// In Next.js
<Link href="/dashboard">
  <a onMouseEnter={() => router.prefetch('/dashboard')}>Dashboard</a>
</Link>
```

### Optimize SPARQL Queries

Avoid loading all dimension values upfront. Instead, implement lazy loading for filter options:

```typescript
// Instead of loading all values initially
const [filterOptions, setFilterOptions] = useState([]);

const loadFilterOptions = async (searchTerm) => {
  const options = await fetchFilterOptions(searchTerm);
  setFilterOptions(options);
};
```

See [PERFORMANCE.md](./PERFORMANCE.md) for details on the cube initialization bottleneck.

### Separate Data Fetching from UI Updates

Use React Query or SWR for efficient data fetching:

```typescript
import { useQuery } from 'react-query';

function ChartComponent() {
  const { data, isLoading } = useQuery('chartData', fetchChartData);

  if (isLoading) return <Skeleton />;

  return <Chart data={data} />;
}
```

## Rendering Performance Tips

Optimize rendering to ensure smooth interactions.

### Memoization

Use React.memo, useMemo, and useCallback:

```typescript
const MemoizedChart = React.memo(function Chart({ data }) {
  return <div>{/* chart implementation */}</div>;
});

function Dashboard() {
  const processedData = useMemo(() => processData(rawData), [rawData]);

  const handleClick = useCallback(() => {
    // handle click
  }, []);

  return <MemoizedChart data={processedData} onClick={handleClick} />;
}
```

### Avoid Unnecessary Re-renders

Use key props for list items to prevent full re-renders:

```tsx
{items.map(item => (
  <Chart key={item.id} data={item} />
))}
```

### Optimize Chart Rendering

For D3-based charts, use enter/update/exit pattern:

```typescript
function updateChart(data) {
  const circles = svg.selectAll('circle').data(data);

  circles.enter().append('circle')
    .merge(circles)
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y));

  circles.exit().remove();
}
```

### Debounce User Input

Debounce search inputs and filter changes:

```typescript
import { useDebounce } from 'use-debounce';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

## Caching Strategies

Implement caching to reduce redundant data fetching and computations.

### Browser Caching

Configure appropriate cache headers for static assets:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Application-Level Caching

Use React Query for client-side caching:

```typescript
import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### Service Worker Caching

Implement service worker for offline functionality:

```javascript
// public/sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('vizualni-admin-v1').then(cache => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css',
      ]);
    })
  );
});
```

### Memoization of Expensive Computations

Cache results of data transformations:

```typescript
const processedDataCache = new Map();

function getProcessedData(rawData) {
  const key = JSON.stringify(rawData);
  if (processedDataCache.has(key)) {
    return processedDataCache.get(key);
  }

  const processed = expensiveTransformation(rawData);
  processedDataCache.set(key, processed);
  return processed;
}
```

## Benchmarks and Measurement Tools

Regular benchmarking helps track performance improvements and regressions.

### Bundle Size Monitoring

Use `bundlesize` to monitor bundle sizes:

```json
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/*.js",
      "maxSize": "300 kB"
    }
  ]
}
```

Run with: `npm run test:bundle-size`

### Performance Budgets

Set performance budgets in Lighthouse or WebPageTest:

```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

### Runtime Performance Monitoring

Use Performance API for runtime measurements:

```typescript
// Measure chart rendering time
const start = performance.now();

renderChart(data);

const end = performance.now();
console.log(`Chart rendered in ${end - start} milliseconds`);
```

### Memory Usage Tracking

Monitor memory usage with performance.memory:

```typescript
if ('memory' in performance) {
  console.log('Memory usage:', performance.memory);
}