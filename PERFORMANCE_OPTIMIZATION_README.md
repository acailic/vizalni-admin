# Performance Optimization - Task 2D

Comprehensive performance optimization system for handling large datasets (100K+ rows) with progressive loading, virtual scrolling, multi-level caching, and memory management.

## Overview

This implementation provides a complete performance optimization stack for the Vizualni Admin application, enabling smooth handling of datasets with 100K-1M rows while maintaining memory usage under 500MB.

## Components

### Hooks

#### `use-progressive-data.ts`
Progressive data loading hook that loads large datasets in chunks.

**Features:**
- Configurable chunk size (default: 5000 rows)
- Automatic or manual chunk loading
- Progress tracking
- Infinite scroll support

**Usage:**
```tsx
const { data, loading, loadNext, hasMore, progress } = useProgressiveData(
  async (chunk, size) => {
    const response = await fetch(`/api/data?page=${chunk}&size=${size}`);
    return response.json();
  },
  { chunkSize: 5000 }
);
```

#### `use-virtual-scroll.ts`
Virtual scrolling hook for rendering only visible items.

**Features:**
- 1D (list) and 2D (grid) virtualization
- Configurable overscan
- Smooth scrolling
- Scroll-to-index support

**Usage:**
```tsx
const { visibleItems, containerRef, offsetY, totalHeight } = useVirtualScroll(
  data.length,
  { itemHeight: 50, viewportHeight: 600 }
);
```

#### `use-data-cache.ts`
Multi-level caching hook with memory and IndexedDB layers.

**Features:**
- L1 (Memory) + L2 (IndexedDB) caching
- Automatic cache invalidation (TTL)
- Memory limit enforcement (50MB)
- Cache hit/miss tracking

**Usage:**
```tsx
const { data, loading, fromCache, invalidate } = useDataCache(
  async () => fetch('/api/data').then(r => r.json()),
  { key: 'my-data', ttl: 5 * 60 * 1000 }
);
```

### Data Utilities

#### `progressive-loader.ts`
Class-based progressive data loader with concurrent chunk loading.

**Features:**
- Concurrent chunk loading (max 3)
- Progress callbacks
- Retry logic with exponential backoff
- Streaming support

**Usage:**
```ts
const loader = new ProgressiveLoader({
  chunkSize: 5000,
  maxConcurrent: 3,
  onProgress: (loaded, total) => console.log(`${loaded}/${total}`),
});

const data = await loader.load(async (offset, limit) => {
  return fetchData(offset, limit);
});
```

#### `data-sampler.ts`
Intelligent sampling strategies for large datasets.

**Strategies:**
- Random sampling
- Systematic sampling (every nth item)
- Stratified sampling (maintain proportions)
- Reservoir sampling (streaming)
- First/Last N items

**Usage:**
```ts
const sampler = new DataSampler();
const sample = sampler.sample(largeDataset, {
  strategy: 'systematic',
  sampleSize: 1000,
});
```

#### `memory-manager.ts`
Memory usage monitoring and management.

**Features:**
- Track object sizes
- Enforce memory limits (500MB default)
- Automatic cleanup (LRU)
- Memory statistics
- Warning callbacks

**Usage:**
```ts
const manager = getMemoryManager({ maxMemory: 500 * 1024 * 1024 });

manager.track('dataset-1', largeData, priority);
const stats = manager.getStats();
console.log(`Memory: ${formatBytes(stats.used)} / ${formatBytes(stats.limit)}`);
```

### Cache System

#### `multi-level-cache.ts`
Multi-level cache with L1 (Memory), L2 (IndexedDB), L3 (Network).

**Features:**
- Automatic promotion (L2 → L1)
- LRU eviction
- TTL expiration
- Cache statistics

**Usage:**
```ts
const cache = new MultiLevelCache({
  l1MaxSize: 50 * 1024 * 1024,
  l2MaxSize: 200 * 1024 * 1024,
  defaultTTL: 5 * 60 * 1000,
});

await cache.set('key', data);
const cached = await cache.get('key');
```

#### `indexeddb-cache.ts`
Simplified IndexedDB wrapper.

#### `cache-config.ts`
Cache configuration constants.

### Components

#### `VirtualizedTable.tsx`
High-performance table component with virtual scrolling.

**Features:**
- Virtual scrolling for large datasets
- Custom column rendering
- Row click handlers
- Configurable styling

**Usage:**
```tsx
<VirtualizedTable
  data={largeDataset}
  columns={[
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name', render: (v) => <strong>{v}</strong> },
  ]}
  rowHeight={50}
  height={600}
  onRowClick={(row) => console.log(row)}
/>
```

#### `ProgressIndicator.tsx`
Loading progress indicators (linear and circular).

**Usage:**
```tsx
<ProgressIndicator
  progress={75}
  message="Loading data..."
  showPercentage
  color="primary"
/>

<CircularProgress progress={50} size={40} />
```

## Performance Targets

| Dataset Size | Load Time | Render Time | Memory |
|-------------|-----------|-------------|--------|
| <10K rows   | <500ms    | <200ms      | <50MB  |
| 10K-100K    | <2s       | <1s         | <200MB |
| 100K-1M     | <5s       | <2s         | <500MB |

## Usage Examples

### Complete Example: Large Dataset Visualization

```tsx
import { useProgressiveData } from '@/hooks/use-progressive-data';
import { VirtualizedTable } from '@/components/VirtualizedTable';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { adaptiveSample } from '@/lib/data/data-sampler';

function LargeDatasetDemo() {
  const { data, loading, progress, hasMore, loadNext } = useProgressiveData(
    async (chunk, size) => {
      const response = await fetch(
        `/api/data?offset=${chunk * size}&limit=${size}`
      );
      return response.json();
    },
    {
      chunkSize: 5000,
      onProgress: (loaded, total) => {
        console.log(`Loaded ${loaded}/${total} rows`);
      },
    }
  );

  // Sample for preview
  const sampledData = adaptiveSample(data, 1000, {
    strategy: 'systematic',
  });

  if (loading && data.length === 0) {
    return <ProgressIndicator progress={progress} message="Loading data..." />;
  }

  return (
    <div>
      <ProgressIndicator progress={progress} message={`${data.length} rows loaded`} />

      <VirtualizedTable
        data={sampledData}
        columns={[
          { key: 'id', header: 'ID', width: 100 },
          { key: 'name', header: 'Name', width: 200 },
          { key: 'value', header: 'Value', width: 150 },
        ]}
        rowHeight={50}
        height={600}
      />

      {hasMore && (
        <button onClick={loadNext} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
}
```

### Memory-Aware Data Loading

```tsx
import { getMemoryManager, formatBytes } from '@/lib/data/memory-manager';
import { useDataCache } from '@/hooks/use-data-cache';

function MemoryAwareComponent() {
  const manager = getMemoryManager({
    maxMemory: 500 * 1024 * 1024,
    onWarning: (stats) => {
      console.warn(`Memory warning: ${stats.usagePercent.toFixed(1)}%`);
    },
  });

  const { data, loading } = useDataCache(
    async () => {
      const response = await fetch('/api/large-dataset');
      const data = await response.json();

      // Track in memory manager
      manager.track('large-dataset', data, 1);

      return data;
    },
    { key: 'large-dataset', ttl: 10 * 60 * 1000 }
  );

  const stats = manager.getStats();

  return (
    <div>
      <div>Memory: {formatBytes(stats.used)} / {formatBytes(stats.limit)}</div>
      {/* Render data */}
    </div>
  );
}
```

## Best Practices

### 1. Progressive Loading
- Use chunk size of 5000-10000 rows
- Load initial chunk immediately
- Load additional chunks on demand or scroll

### 2. Virtual Scrolling
- Always use for lists/tables >1000 rows
- Set appropriate overscan (3-5 items)
- Use fixed item heights for best performance

### 3. Caching
- Cache expensive computations
- Use appropriate TTL (5-10 minutes for data)
- Monitor cache hit rate (target >70%)

### 4. Memory Management
- Track large objects (>1MB)
- Set appropriate priorities
- Monitor memory usage
- Enable auto-cleanup

### 5. Sampling
- Use systematic sampling for previews
- Use stratified sampling to maintain proportions
- Sample 1-10% of large datasets for charts

## Performance Monitoring

```tsx
import { getCacheStats } from '@/hooks/use-data-cache';
import { getMemoryManager } from '@/lib/data/memory-manager';
import { getBrowserMemoryInfo } from '@/lib/data/memory-manager';

function PerformanceMonitor() {
  const cacheStats = getCacheStats();
  const memoryStats = getMemoryManager().getStats();
  const browserMemory = getBrowserMemoryInfo();

  return (
    <div>
      <h3>Cache Performance</h3>
      <div>Hit Rate: {cacheStats.hitRate.toFixed(1)}%</div>
      <div>Memory Entries: {cacheStats.memoryEntries}</div>

      <h3>Memory Usage</h3>
      <div>Used: {formatBytes(memoryStats.used)}</div>
      <div>Limit: {formatBytes(memoryStats.limit)}</div>
      <div>Usage: {memoryStats.usagePercent.toFixed(1)}%</div>

      {browserMemory && (
        <>
          <h3>Browser Memory</h3>
          <div>Heap: {formatBytes(browserMemory.usedJSHeapSize!)}</div>
        </>
      )}
    </div>
  );
}
```

## Testing

Test with various dataset sizes:

```tsx
// Test with 10K rows
const small = generateTestData(10000);

// Test with 100K rows
const medium = generateTestData(100000);

// Test with 1M rows
const large = generateTestData(1000000);
```

## Troubleshooting

### High Memory Usage
- Reduce chunk size
- Enable auto-cleanup
- Clear caches periodically
- Use sampling for large datasets

### Slow Rendering
- Increase virtual scroll overscan
- Reduce number of rendered columns
- Simplify cell rendering
- Use memoization

### Cache Misses
- Increase TTL
- Check cache key generation
- Monitor IndexedDB quota

## Future Enhancements

- Web Workers for data processing
- Compression for cached data
- Predictive prefetching
- Adaptive chunk sizing
- GPU acceleration for charts

## License

BSD-3-Clause
