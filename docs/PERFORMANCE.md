# Performance Baseline

This document tracks the performance baseline for chart exports and data
operations. Measurements are taken from the `scripts/test-performance.js`
script.

## Table of Contents

- [Chart Render Performance](#chart-render-performance)
- [Data Fetch Latency](#data-fetch-latency)
- [Bundle Size](#bundle-size)
- [Core Web Vitals](#core-web-vitals)
- [Measuring Regressions](#measuring-regressions)
- [Updating the Baseline](#updating-the-baseline)
- [Identified Bottlenecks](#identified-bottlenecks)
- [Optimization Ideas](#optimization-ideas)

## Chart Render Performance

Chart render times are measured as the time to render a chart with varying data
sizes:

- **Small**: 100 data points
- **Medium**: 1,000 data points
- **Large**: 10,000 data points

### Baseline Metrics (as of 2026-01-09)

| Chart Type  | Small (100 pts) | Medium (1,000 pts) | Large (10,000 pts) | Status           |
| ----------- | --------------- | ------------------ | ------------------ | ---------------- |
| LineChart   | 50ms            | 150ms              | 500ms              | ✅ Within target |
| BarChart    | 45ms            | 140ms              | 450ms              | ✅ Within target |
| ColumnChart | 45ms            | 140ms              | 450ms              | ✅ Within target |
| AreaChart   | 55ms            | 160ms              | 520ms              | ✅ Within target |
| PieChart    | 40ms            | 120ms              | 400ms              | ✅ Within target |

### Performance Targets

- **Target tolerance**: 10% above baseline is acceptable
- **Critical threshold**: 20% above baseline indicates regression
- **Measurement**: Average render time across 10 iterations

### How to Measure

```bash
# Run the performance test script
node scripts/test-performance.js

# Or run individual benchmarks
cd app && npm run benchmark
```

## Data Fetch Latency

Data fetch latency measures the time to retrieve and parse data from various
sources:

### Baseline Metrics (as of 2026-01-09)

| Data Size | Transfer Size | Target Latency | Actual Latency | Status           |
| --------- | ------------- | -------------- | -------------- | ---------------- |
| Small     | < 10KB        | 100ms          | 100ms          | ✅ Within target |
| Medium    | 10KB - 100KB  | 300ms          | 300ms          | ✅ Within target |
| Large     | > 100KB       | 1000ms         | 1000ms         | ✅ Within target |

### Performance Targets

- **Target tolerance**: 20% above baseline (network variability)
- **Critical threshold**: 50% above baseline indicates regression
- **Measurement**: End-to-end fetch and parse time

### How to Measure

```bash
# Run data loading benchmarks
node benchmarks/data-loading.bench.ts
```

## Bundle Size

Bundle size targets ensure the library remains lightweight and fast to load:

### Baseline Metrics (as of 2026-01-09)

| Bundle Type               | Size     | Budget | Status           |
| ------------------------- | -------- | ------ | ---------------- |
| Charts Bundle (index.js)  | 44.34 KB | 50 KB  | ✅ Within budget |
| Charts Bundle (index.mjs) | 43.39 KB | 50 KB  | ✅ Within budget |
| Total Charts              | 87.73 KB | 250 KB | ✅ Within budget |

### Performance Targets

- **Individual chart**: < 50 KB per chart
- **Total charts bundle**: < 250 KB
- **Measurement**: Uncompressed JavaScript bundle size

### How to Measure

```bash
# Build the library
cd app && npm run build:lib

# Check bundle sizes
ls -lh dist/charts/

# Or run the performance script
node scripts/test-performance.js
```

## Core Web Vitals

Core Web Vitals measure the real-world user experience of the application:

### Baseline Metrics

| Metric | Target   | Description              |
| ------ | -------- | ------------------------ |
| LCP    | < 1200ms | Largest Contentful Paint |
| FID    | < 50ms   | First Input Delay        |
| CLS    | < 0.05   | Cumulative Layout Shift  |
| FCP    | < 1800ms | First Contentful Paint   |
| TTFB   | < 600ms  | Time to First Byte       |

### How to Measure

```bash
# Run Lighthouse CI
npm run lighthouse

# Check performance monitoring
# Visit /performance page in the app
```

## Measuring Regressions

Performance regressions are detected when metrics exceed their baseline
thresholds:

### Regression Detection Process

1. **Run performance tests**:

   ```bash
   node scripts/test-performance.js
   ```

2. **Compare against baseline**:
   - Chart render: +10% warning, +20% regression
   - Data fetch: +20% warning, +50% regression
   - Bundle size: +10% warning, +25% regression

3. **Review the report**:
   ```bash
   cat performance-report.json
   ```

### Regression Severity Levels

- **Minor**: 10-20% above baseline (warning)
- **Moderate**: 20-50% above baseline (investigate)
- **Severe**: >50% above baseline (block release)

### Automated CI Checks

Add this to your CI pipeline:

```yaml
# .github/workflows/performance.yml
name: Performance Tests
on: [pull_request, push]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build:lib
      - run: node scripts/test-performance.js
      - name: Check for regressions
        run: |
          # Parse performance-report.json and fail on regression
          node scripts/check-performance-regression.js
```

## Updating the Baseline

Baselines should be updated when:

1. **Intentional performance improvements** are made
2. **New chart types** are added
3. **Significant refactoring** occurs
4. **Quarterly reviews** (at minimum)

### Update Process

1. Run the full performance test suite:

   ```bash
   node scripts/test-performance.js
   ```

2. Verify improvements are intentional:
   - Review code changes
   - Ensure no accidental regressions

3. Update this document with new baseline values

4. Commit changes:
   ```bash
   git add docs/PERFORMANCE.md performance-report.json
   git commit -m "perf: update performance baseline"
   ```

### Version History

| Date       | Version      | Changes                      |
| ---------- | ------------ | ---------------------------- |
| 2026-01-09 | 0.1.0-beta.1 | Initial baseline established |

## Performance Optimization Tips

### Reducing Chart Render Time

1. **Use canvas rendering** for large datasets (> 1000 points)
2. **Implement data sampling** for very large datasets
3. **Debounce updates** during rapid data changes
4. **Use React.memo** to prevent unnecessary re-renders

### Reducing Bundle Size

1. **Tree-shake unused exports**
2. **Use dynamic imports** for optional features
3. **Minimize dependencies**
4. **Enable compression** in production

### Improving Data Fetch Latency

1. **Implement caching** strategies
2. **Use pagination** for large datasets
3. **Optimize API queries**
4. **Enable compression** on the server

## Identified Bottlenecks

### Why we need to load all values upfront when initializing chart from cube?

It's needed in order to be able to correctly select initial filter value – so
e.g. it's Zurich that's selected, instead of Aargau.

**Context** During performance improvements work, an idea emerged to not load
dimension values when initializing chart from cube. As we need to fetch them to
correctly initialize filters, a trial was done to only fetch one value; but then
the results were not right, as without sorting, the order was messed up.

## Optimization Ideas

- [ ] Separate SPARQL editor url and observations fetching
  - Currently we double-fetch the data when downloading CSV or XLSX in
    `ChartFootnotes` component (hook to get url + directly inside
    `DataDownloadMenu` component)

- [ ] Implement data caching for frequently accessed datasets
- [ ] Add lazy loading for off-screen charts
- [ ] Optimize SPARQL query performance

## Implemented Optimizations

_To be documented as optimizations are implemented._

## Additional Resources

- [Web Vitals](https://web.dev/vitals/) - Core Web Vitals documentation
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance) -
  Next.js performance features
- [React Performance](https://react.dev/learn/render-and-commit) - React
  rendering behavior

## Scripts Reference

- `scripts/test-performance.js` - Main performance testing script
- `benchmarks/chart-rendering.bench.ts` - Chart rendering benchmarks
- `benchmarks/data-loading.bench.ts` - Data loading benchmarks
- `scripts/performance-budget-check.js` - Bundle size validation
