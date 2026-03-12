yarn benchmark
```

This command executes `vitest run benchmarks` from the `app` directory, running all `.bench.ts` files in this directory.

For development, you can run benchmarks in watch mode:

```bash
cd app
vitest benchmarks
```

## Interpreting Results

### Vitest Benchmarks (Chart Rendering)

Vitest benchmarks output results in the following format:

```
✓ Chart Rendering Benchmarks > Line Chart > Line Chart with 100 data points
  1,234 ops/sec ±0.45% (12 runs, 1.2s)
```

- **ops/sec**: Operations per second (higher is better)
- **±X%**: Margin of error
- **runs**: Number of benchmark iterations
- **time**: Total time taken

Memory usage is logged separately as JSON output for analysis.

### Benchmark.js Benchmarks (Data Loading)

Benchmark.js outputs results like:

```
CSV 1024 bytes - PapaParse x 1,234 ops/sec ±0.45% (12 runs sampled)
```

- **x ops/sec**: Operations per second
- **±X%**: Statistical margin of error
- **runs sampled**: Number of iterations

Additional metrics like throughput (MB/s) are logged for data processing benchmarks.

## Performance Targets

Current performance targets (subject to review and adjustment):

### Chart Rendering
- **Minimum ops/sec**: 500 for 100 data points, 100 for 10,000 data points
- **Maximum memory usage**: 50MB for 100,000 data points
- **Frame rate**: Maintain 60 FPS for interactive charts (measured separately)

### Data Loading
- **CSV parsing**: > 10 MB/s for 1MB files
- **JSON parsing**: > 50 MB/s for 1MB files
- **API loading**: < 100ms for 100KB responses

Benchmarks will fail CI if targets are not met.

## Historical Trends

To track performance over time:

1. Run benchmarks regularly (e.g., in CI on main branch)
2. Store results in a dedicated file (e.g., `benchmark-results.json`)
3. Use tools like [Bencher](https://bencher.dev/) or [CodSpeed](https://codspeed.io/) for trend analysis
4. Compare results across commits/PRs to identify regressions

Example of storing results:

```bash
yarn benchmark > benchmark-results-$(date +%Y%m%d-%H%M%S).txt
```

## Adding New Benchmarks

To add a new benchmark:

1. Create a new `.bench.ts` file in this directory
2. Use Vitest's `bench()` function for simple benchmarks:

```typescript
import { bench, describe } from 'vitest';

describe('My Benchmark', () => {
  bench('my test case', () => {
    // Code to benchmark
  });
});
```

3. For more complex benchmarks, use Benchmark.js:

```typescript
import Benchmark from 'benchmark';

const suite = new Benchmark.Suite('My Suite');
suite.add('Test Case', () => {
  // Code to benchmark
}).run({ async: true });