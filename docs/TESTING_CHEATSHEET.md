# Testing Cheatsheet

Quick reference for common testing patterns and commands in vizualni-admin.

## Commands

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run specific test types
yarn test:integration
yarn test:accessibility
yarn test:performance
yarn test:visual

# Watch mode for development
yarn test:watch

# Run E2E tests
yarn e2e

# Quality gates
node scripts/quality-gates.js

# Linting and type checking
yarn lint
yarn typecheck
```

## Basic Component Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByTestId('my-component')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should be accessible', async () => {
    const { axe } = await import('jest-axe');
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Mock Patterns

### Mocking External Libraries

```typescript
// Mock API client
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: mockData, loading: false, error: null }),
  useMutation: () => ({ mutate: vi.fn(), isLoading: false }),
}));

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
  }),
}));
```

### Mocking GraphQL

```typescript
vi.mock('@/graphql/hooks', () => ({
  useDatasetsQuery: () => ({
    data: { datasets: mockDatasets },
    loading: false,
    error: null,
  }),
  useCreateDatasetMutation: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
}));
```

## Integration Test Template

```typescript
import { renderWithProviders, testUserFlow } from '@/test-utils/integration';

it('should complete user workflow', async () => {
  renderWithProviders(<MyWorkflow />);

  await testUserFlow([
    {
      action: async () => await user.click(screen.getByText('Start')),
      description: 'Click start button',
    },
    {
      expectation: async () => {
        await waitFor(() => {
          expect(screen.getByText('Step 1')).toBeInTheDocument();
        });
      },
      description: 'Step 1 should appear',
    },
  ]);
});
```

## Performance Testing Template

```typescript
import { measureRenderPerformance, detectMemoryLeaks } from '@/test-utils/performance';

it('should render within performance thresholds', async () => {
  const performance = await measureRenderPerformance(<MyComponent />, 5);
  expect(performance.averageTime).toBeLessThan(16); // 60fps
});

it('should not leak memory', async () => {
  const memoryTest = await detectMemoryLeaks(() => render(<MyComponent />));
  expect(memoryTest.hasLeaks).toBe(false);
});
```

## Accessibility Testing Template

```typescript
it('should be keyboard accessible', async () => {
  render(<InteractiveComponent />);

  const firstElement = screen.getByRole('button');
  firstElement.focus();
  expect(firstElement).toHaveFocus();

  await user.tab();
  expect(screen.getByRole('textbox')).toHaveFocus();
});

it('should have proper ARIA labels', () => {
  render(<ChartComponent />);
  expect(screen.getByRole('img')).toHaveAttribute('aria-label');
});
```

## Error Testing Template

```typescript
it('should handle API errors gracefully', async () => {
  const onRetry = vi.fn();
  render(<DataComponent onRetry={onRetry} error={new Error('API Error')} />);

  expect(screen.getByText(/api error/i)).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /retry/i }));
  expect(onRetry).toHaveBeenCalled();
});
```

## Form Testing Template

```typescript
it('should handle form submission', async () => {
  const onSubmit = vi.fn();
  render(<MyForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Name'), 'Test Name');
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    name: 'Test Name',
    email: 'test@example.com',
  });
});
```

## Data Loading Template

```typescript
it('should show loading state then data', async () => {
  render(<DataComponent />);

  expect(screen.getByTestId('loading')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByTestId('data-content')).toBeInTheDocument();
  });

  expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
});
```

## Serbian Language Testing Template

```typescript
it('should display Serbian text correctly', () => {
  render(<Component locale="sr" />);
  expect(screen.getByText('Подаци о становништву')).toBeInTheDocument();
});

it('should handle date formatting in Serbian', () => {
  render(<DateDisplay date={new Date('2024-01-15')} locale="sr" />);
  expect(screen.getByText('15. јануар 2024.')).toBeInTheDocument();
});
```

## Common Test Selectors

```typescript
// By test ID (preferred)
screen.getByTestId('component-name')

// By accessible role
screen.getByRole('button', { name: /submit/i })
screen.getByRole('heading', { level: 2 })

// By accessible name
screen.getByLabelText('Email address')
screen.getByPlaceholderText('Enter name')

// By text content
screen.getByText('Submit Form')
screen.getByText(/welcome/i) // regex

// Multiple elements
screen.getAllByRole('listitem')
screen.queryAllByText(/error/i)
```

## Async Testing Patterns

```typescript
// waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });

// findBy queries (built-in waiting)
expect(await screen.findByText('Async Content')).toBeInTheDocument();

// Manual waiting (avoid if possible)
await new Promise(resolve => setTimeout(resolve, 1000));
```

## Mocking Time

```typescript
import { vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should handle timeouts', async () => {
  render(<ComponentWithTimeout />);

  vi.advanceTimersByTime(1000);

  await waitFor(() => {
    expect(screen.getByText('Timeout occurred')).toBeInTheDocument();
  });
});
```

## MSW (Mock Service Worker) Setup

```typescript
import { setupServer, rest } from 'msw/node';

const server = setupServer(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.json({ data: mockData }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Environment Variables in Tests

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'test',
      API_URL: 'http://localhost:3001',
    },
  },
});
```

## Test File Organization

```
component/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
└── index.ts
```

## Debugging Tests

```typescript
// Print current DOM
screen.debug();

// Print specific element
screen.debug(screen.getByTestId('my-element'));

// Check if element exists
const element = screen.queryByRole('button');
if (element) {
  console.log('Button found:', element);
}

// Check mock calls
console.log(vi.mocked(apiClient.get).mock.calls);
```

## Coverage Tips

```typescript
// Test all branches
it('should handle both success and error cases', async () => {
  // Success case
  render(<Component success={true} />);
  expect(screen.getByText('Success')).toBeInTheDocument();

  // Error case
  render(<Component success={false} />);
  expect(screen.getByText('Error')).toBeInTheDocument();
});
```

## Common Pitfalls to Avoid

❌ Testing implementation details
```typescript
// Don't do this
expect(component.state.isLoading).toBe(false);
expect(componentInternalFunction()).toHaveBeenCalled();

// Do this instead
expect(screen.getByText('Loading complete')).toBeInTheDocument();
```

❌ Forgetting to cleanup
```typescript
// Always cleanup
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
```

❌ brittle selectors
```typescript
// Don't use CSS classes
expect(screen.getByClassName('btn-primary')).toBeInTheDocument();

// Use semantic selectors
expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
```

## Quick Commands for Development

```bash
# Run tests for current file
yarn test path/to/file.test.ts

# Run tests in watch mode
yarn test path/to/file.test.ts --watch

# Generate coverage report
yarn test:coverage

# Run a specific test
yarn test -t "should render correctly"

# Run tests matching pattern
yarn test --testNamePattern="accessibility"
```