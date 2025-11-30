# Testing Guidelines for vizualni-admin

This document provides comprehensive guidelines for testing the vizualni-admin application, covering unit tests, integration tests, performance testing, and quality assurance practices.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Pyramid](#testing-pyramid)
- [Setup and Configuration](#setup-and-configuration)
- [Testing Patterns](#testing-patterns)
- [Component Testing](#component-testing)
- [Integration Testing](#integration-testing)
- [Performance Testing](#performance-testing)
- [Accessibility Testing](#accessibility-testing)
- [Internationalization Testing](#internationalization-testing)
- [Quality Gates](#quality-gates)
- [Troubleshooting](#troubleshooting)

## Testing Philosophy

Our testing approach follows the principle of **strategic coverage** rather than 100% coverage. We focus on:

- **Critical paths**: Core user journeys and data flows
- **Error scenarios**: API failures, network issues, validation errors
- **Edge cases**: Boundary conditions, empty states, large datasets
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Responsive UI and memory efficiency

### Core Principles

1. **Test behavior, not implementation**: Focus on what the component does, not how it does it
2. **Fast feedback loop**: Tests should run quickly and provide clear feedback
3. **Maintainable tests**: Keep tests simple, readable, and easy to understand
4. **Realistic scenarios**: Test with realistic data and user interactions
5. **Serbian language support**: All tests should verify Serbian language functionality

## Testing Pyramid

Our testing strategy follows the 60-30-10 pyramid:

```
          ┌─────────────────┐
          │   E2E Tests     │ 10% - Critical user journeys
          │    (Playwright)  │
          └─────────────────┘
        ┌───────────────────────┐
        │  Integration Tests     │ 30% - Component interactions
        │      (Vitest + MSW)     │
        └───────────────────────┘
      ┌─────────────────────────────────┐
      │       Unit Tests                 │ 60% - Isolated component tests
      │         (Vitest)                 │
      └─────────────────────────────────┘
```

## Setup and Configuration

### Required Dependencies

```bash
# Core testing framework
yarn add -D vitest @testing-library/react @testing-library/user-event

# API mocking
yarn add -D msw

# Accessibility testing
yarn add -D jest-axe axe-core

# Performance testing
yarn add -D @next/bundle-analyzer

# E2E testing
yarn add -D playwright @playwright/test
```

### Test Configuration

The project uses Vitest for unit and integration testing:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

### Test Setup

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import { configureAxe, toHaveNoViolations } from 'jest-axe';

// Configure accessibility testing
const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'aria-labels': { enabled: true },
  },
});

expect.extend(toHaveNoViolations);
```

## Testing Patterns

### Component Test Pattern

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should render correctly with default props', () => {
    render(<MyComponent />);
    expect(screen.getByTestId('my-component')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const onAction = vi.fn();
    render(<MyComponent onAction={onAction} />);

    await user.click(screen.getByRole('button', { name: /action/i }));
    expect(onAction).toHaveBeenCalled();
  });

  it('should be accessible', async () => {
    const { axe } = await import('jest-axe');
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Mock Pattern

```typescript
// Mock external dependencies
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock GraphQL hooks
vi.mock('@/graphql/hooks', () => ({
  useDataQuery: () => ({
    data: mockData,
    loading: false,
    error: null,
  }),
}));
```

## Component Testing

### When to Test Components

- **Critical components**: Charts, forms, navigation, error boundaries
- **Interactive components**: Buttons, filters, data tables
- **Data visualization**: Charts, graphs, dashboards
- **Form components**: Validation, submission, error handling

### Test Categories

#### 1. Rendering Tests

```typescript
it('should render the component with correct structure', () => {
  render(<ChartComponent data={mockData} />);
  expect(screen.getByRole('img', { name: /chart/i })).toBeInTheDocument();
});
```

#### 2. Interaction Tests

```typescript
it('should handle filter changes', async () => {
  const onFilterChange = vi.fn();
  render(<FilterableChart onFilterChange={onFilterChange} />);

  await user.selectOptions(screen.getByLabelText('Region'), 'Beograd');
  expect(onFilterChange).toHaveBeenCalledWith({ region: 'Beograd' });
});
```

#### 3. State Tests

```typescript
it('should update state when data changes', async () => {
  const { rerender } = render(<DataComponent data={initialData} />);
  expect(screen.getByText('Initial')).toBeInTheDocument();

  rerender(<DataComponent data={updatedData} />);
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

#### 4. Error Handling Tests

```typescript
it('should display error message when data fails to load', () => {
  render(<DataComponent error={new Error('Failed to load')} />);
  expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
});
```

## Integration Testing

### Test Utilities

Use the provided integration testing utilities:

```typescript
import { renderWithProviders, testUserFlow, mockApiHandlers } from '@/test-utils/integration';

// Test complete user flows
testUserFlow([
  {
    action: async () => await user.click(screen.getByText('Load Dataset')),
    description: 'Click load dataset button',
  },
  {
    expectation: async () => expect(screen.getByText('Dataset loaded')).toBeInTheDocument(),
    description: 'Dataset should load successfully',
  },
]);
```

### Common Integration Scenarios

#### 1. Data Pipeline Tests

```typescript
it('should load data from API and display in chart', async () => {
  renderWithProviders(<Dashboard />);

  await waitFor(() => {
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
  });
});
```

#### 2. State Management Tests

```typescript
it('should sync state across components', async () => {
  const TestApp = () => (
    <Provider store={store}>
      <ComponentA />
      <ComponentB />
    </Provider>
  );

  renderWithProviders(<TestApp />);

  // Test state synchronization
});
```

#### 3. Error Recovery Tests

```typescript
it('should recover from API errors and retry successfully', async () => {
  server.use(
    rest.get('/api/data', (req, res, ctx) => res(ctx.status(500)))
  );

  renderWithProviders(<DataComponent />);

  // Simulate error, then success
});
```

## Performance Testing

### Performance Testing Patterns

```typescript
import { measureRenderPerformance, detectMemoryLeaks } from '@/test-utils/performance';

it('should render within performance thresholds', async () => {
  const performance = await measureRenderPerformance(<LargeChart />, 5);
  expect(performance.averageTime).toBeLessThan(16); // 60fps
});

it('should not leak memory during mount/unmount', async () => {
  const memoryTest = await detectMemoryLeaks(() => render(<Component />));
  expect(memoryTest.hasLeaks).toBe(false);
});
```

### Bundle Analysis

```typescript
it('should maintain bundle size within limits', async () => {
  const bundleStats = await analyzeBundle();
  expect(bundleStats.totalSize).toBeLessThan(2 * 1024 * 1024); // 2MB
});
```

## Accessibility Testing

### Automated Accessibility Tests

```typescript
it('should meet WCAG 2.1 AA standards', async () => {
  const { axe } = await import('jest-axe');
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Keyboard Navigation Tests

```typescript
it('should be fully keyboard accessible', async () => {
  render(<InteractiveComponent />);

  const firstElement = screen.getByRole('button');
  firstElement.focus();
  expect(firstElement).toHaveFocus();

  await user.tab();
  expect(screen.getByRole('textbox')).toHaveFocus();
});
```

### Screen Reader Tests

```typescript
it('should have proper ARIA labels', () => {
  render(<ChartComponent />);
  expect(screen.getByRole('img')).toHaveAttribute('aria-label');
  expect(screen.getByRole('button')).toHaveAccessibleName();
});
```

## Internationalization Testing

### Serbian Language Tests

```typescript
it('should display Serbian text correctly', () => {
  render(<Component locale="sr" />);
  expect(screen.getByText('Подаци о становништву')).toBeInTheDocument();
});

it('should handle Cyrillic and Latin scripts', async () => {
  renderWithProviders(<Component />);

  // Test both scripts
  await user.click(screen.getByText('Ћирилица'));
  expect(screen.getByText('Подаци')).toBeInTheDocument();

  await user.click(screen.getByText('Latinica'));
  expect(screen.getByText('Podaci')).toBeInTheDocument();
});
```

## Quality Gates

### Local Quality Gates

Run quality gates before committing:

```bash
# Run all quality checks
node scripts/quality-gates.js

# Or run individual checks
yarn test              # Unit tests
yarn test:integration # Integration tests
yarn test:accessibility # Accessibility tests
yarn test:performance   # Performance tests
yarn lint              # Code linting
yarn typecheck         # TypeScript checking
```

### Coverage Thresholds

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 75%
- **Statements**: 80%

### Performance Thresholds

- **Render time**: <16ms for small components
- **Memory growth**: <10MB per component cycle
- **Bundle size**: <2MB total

## Troubleshooting

### Common Issues

#### 1. Tests Time Out

```typescript
// Increase timeout for slow tests
it('should handle large datasets', async () => {
  // test implementation
}, { timeout: 10000 });
```

#### 2. Mock Setup Issues

```typescript
// Clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

#### 3. Async Test Issues

```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Debugging Tips

1. **Use screen.debug()**: Inspect the rendered DOM
2. **Check mock calls**: `vi.mocked(apiClient.get).mock.calls`
3. **Log test state**: `console.log(screen.getByTestId('element'))`
4. **Use queryByRole**: More resilient than text-based queries

### Test File Organization

```
app/
├── components/
│   ├── component-name/
│   │   ├── component-name.tsx
│   │   ├── component-name.test.tsx      # Unit tests
│   │   └── component-name.stories.tsx   # Storybook stories
│   └── ...
├── tests/
│   ├── integration/                     # Integration tests
│   └── visual/                         # Visual regression tests
├── test-utils/                         # Testing utilities
└── vitest.config.ts
```

### Running Tests

```bash
# All tests
yarn test

# Coverage report
yarn test:coverage

# Specific test patterns
yarn test -- --testNamePattern="accessibility"
yarn test -- --testNamePattern="performance"
yarn test -- --testNamePattern="integration"

# Watch mode
yarn test:watch

# E2E tests
yarn e2e
```

## Best Practices

### DOs ✅

- **Test user behavior**, not implementation details
- **Use realistic test data** that mirrors production
- **Test error states** and edge cases
- **Include accessibility checks** for interactive components
- **Test Serbian language** functionality
- **Keep tests simple** and focused
- **Use meaningful test names** that describe what is being tested

### DON'Ts ❌

- **Test CSS classes** or inline styles
- **Mock everything** - only mock external dependencies
- **Write brittle tests** that break with minor implementation changes
- **Ignore performance** and accessibility
- **Skip error handling** tests
- **Create complex test setups** that are hard to maintain

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Playwright Documentation](https://playwright.dev/)
- [axe-core Documentation](https://www.deque.com/axe/core-documentation/)