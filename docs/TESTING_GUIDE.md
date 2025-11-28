// app/__tests__/unit/config-validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateConfig } from '../../lib/config/validator';

describe('Config Validation', () => {
  it('should validate a correct configuration', () => {
    const validConfig = {
      title: 'Test Dashboard',
      datasets: [
        {
          id: 'test-dataset',
          url: 'https://data.gov.rs/api/datasets/test',
          format: 'json'
        }
      ]
    };

    const result = validateConfig(validConfig);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject configuration with missing required fields', () => {
    const invalidConfig = {
      datasets: []
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('title is required');
  });

  it('should handle edge cases gracefully', () => {
    const edgeCaseConfig = {
      title: '',
      datasets: null
    };

    const result = validateConfig(edgeCaseConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('title cannot be empty');
    expect(result.errors).toContain('datasets must be an array');
  });
});
```

### Integration Test Example

```typescript
// app/__tests__/integration/chart-rendering.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BarChart } from '../../components/charts/BarChart';
import { I18nProvider } from '../../locales/I18nProvider';

describe('Chart Rendering Integration', () => {
  it('should render bar chart with data', async () => {
    const testData = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 }
    ];

    render(
      <I18nProvider locale="en">
        <BarChart data={testData} />
      </I18nProvider>
    );

    // Wait for chart to render
    await screen.findByRole('img', { name: /bar chart/i });

    // Verify chart elements
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(
      <I18nProvider locale="en">
        <BarChart data={[]} />
      </I18nProvider>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// e2e/dashboard-interaction.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Interactions', () => {
  test('should load dashboard and display charts', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Vizualni Admin');

    // Check if charts are rendered
    await expect(page.locator('[data-testid="chart-container"]')).toBeVisible();

    // Interact with a chart
    await page.locator('[data-testid="bar-chart"]').click();

    // Verify chart interaction
    await expect(page.locator('[data-testid="tooltip"]')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');

    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });
});
```

## Running Tests

### Local Development

Run all tests:
```bash
npm test
```

Run unit tests only:
```bash
npm run test:unit
```

Run integration tests:
```bash
npm run test:integration
```

Run E2E tests:
```bash
npm run test:e2e
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run specific test file:
```bash
npx vitest run path/to/test/file.test.ts
```

Watch mode for development:
```bash
npx vitest --watch
```

### Test Configuration

Unit and integration tests use Vitest with the following configuration (`app/vitest.config.ts`):

- Environment: jsdom for DOM simulation
- Coverage: v8 provider with HTML, JSON, and LCOV reports
- Thresholds: 50% minimum coverage for lines, functions, branches, and statements
- Exclusions: node_modules, build outputs, config files, and test files themselves

E2E tests use Playwright with the following configuration (`playwright.config.ts`):

- Browser: Chromium (desktop)
- Timeout: 45 seconds per test
- Parallel execution: Disabled for stability
- Screenshots: Captured on failure
- Traces: Collected on first retry

## Coverage Requirements

We maintain high test coverage to ensure code reliability:

- **Overall Coverage**: 80% minimum
- **Per-File Coverage**: 70% minimum
- **Critical Paths**: 90% minimum (core logic, data processing, rendering)

Coverage is measured using Vitest's built-in coverage tools and reported to Codecov in CI.

### Coverage Reports

Coverage reports are generated in multiple formats:
- HTML: `coverage/index.html` (human-readable)
- JSON: `coverage/coverage.json` (machine-readable)
- LCOV: `coverage/lcov.info` (CI integration)

### Improving Coverage

To improve coverage:
1. Identify uncovered code using coverage reports
2. Add unit tests for missing scenarios
3. Consider integration tests for complex interactions
4. Use code coverage tools to guide test writing

## Mocking Strategies

### API Mocking

For external API calls, we use Mock Service Worker (MSW):

```typescript
// app/__tests__/unit/data-gov-rs-client.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { searchDatasets } from '../../domain/data-gov-rs/client';

const server = setupServer(
  rest.get('https://data.gov.rs/api/search', (req, res, ctx) => {
    return res(ctx.json({
      datasets: [
        { id: '1', title: 'Test Dataset', organization: 'Test Org' }
      ]
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Data.gov.rs Client', () => {
  it('should search datasets successfully', async () => {
    const results = await searchDatasets('test');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Test Dataset');
  });
});
```

### Component Mocking

For complex component dependencies:

```typescript
import { vi } from 'vitest';

// Mock external components
vi.mock('../../components/MapComponent', () => ({
  MapComponent: ({ data }) => <div data-testid="mock-map">{data.length} items</div>
}));
```

### Utility Function Mocking

For utility functions and helpers:

```typescript
import { vi } from 'vitest';

// Mock utility functions
vi.mock('../../utils/formatters', () => ({
  formatNumber: vi.fn((num) => `formatted-${num}`),
  formatDate: vi.fn((date) => `formatted-${date}`)
}));