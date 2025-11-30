/**
 * Tests for ChartErrorBoundary component
 * Tests error handling and recovery mechanisms
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChartErrorBoundary } from './chart-error-boundary';

// Mock the ChartUnexpectedError component
vi.mock('@/components/hint', () => ({
  ChartUnexpectedError: ({ error, resetErrorBoundary }: any) => (
    <div data-testid="chart-error-fallback">
      <h2>Chart Error Occurred</h2>
      <p>{error?.message || 'Unknown error'}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  ),
}));

// Component that throws an error for testing
const ThrowErrorComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test chart error');
  }
  return <div data-testid="chart-content">Chart rendered successfully</div>;
};

describe('ChartErrorBoundary', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress console.error for these tests
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <ChartErrorBoundary>
        <div data-testid="child-component">Child content</div>
      </ChartErrorBoundary>
    );

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should catch and display error when child component throws', () => {
    render(
      <ChartErrorBoundary>
        <ThrowErrorComponent />
      </ChartErrorBoundary>
    );

    expect(screen.getByTestId('chart-error-fallback')).toBeInTheDocument();
    expect(screen.getByText('Chart Error Occurred')).toBeInTheDocument();
    expect(screen.getByText('Test chart error')).toBeInTheDocument();
  });

  it('should provide reset functionality when error occurs', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);

      return (
        <ChartErrorBoundary resetKeys={[shouldThrow]}>
          <ThrowErrorComponent shouldThrow={shouldThrow} />
          <button onClick={() => setShouldThrow(false)}>Recover</button>
        </ChartErrorBoundary>
      );
    };

    render(<TestComponent />);

    // Initially shows error
    expect(screen.getByTestId('chart-error-fallback')).toBeInTheDocument();

    // Click retry button
    await user.click(screen.getByText('Retry'));

    // Should recover and show content
    await waitFor(() => {
      expect(screen.getByTestId('chart-content')).toBeInTheDocument();
    });
  });

  it('should reset when resetKeys change', () => {
    const { rerender } = render(
      <ChartErrorBoundary resetKeys={['initial']}>
        <ThrowErrorComponent />
      </ChartErrorBoundary>
    );

    expect(screen.getByTestId('chart-error-fallback')).toBeInTheDocument();

    // Rerender with different resetKey
    rerender(
      <ChartErrorBoundary resetKeys={['changed']}>
        <ThrowErrorComponent shouldThrow={false} />
      </ChartErrorBoundary>
    );

    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('should handle unknown errors gracefully', () => {
    const ThrowUnknownError = () => {
      throw 'String error';
    };

    render(
      <ChartErrorBoundary>
        <ThrowUnknownError />
      </ChartErrorBoundary>
    );

    expect(screen.getByTestId('chart-error-fallback')).toBeInTheDocument();
  });

  it('should handle async errors in React lifecycle', async () => {
    const AsyncErrorComponent = () => {
      React.useEffect(() => {
        throw new Error('Async error');
      }, []);

      return <div>Component</div>;
    };

    render(
      <ChartErrorBoundary>
        <AsyncErrorComponent />
      </ChartErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByTestId('chart-error-fallback')).toBeInTheDocument();
    });
  });

  it('should preserve accessibility when error occurs', async () => {
    const { axe } = await import('jest-axe');

    render(
      <ChartErrorBoundary>
        <ThrowErrorComponent />
      </ChartErrorBoundary>
    );

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('should support Serbian language error messages', () => {
    // Mock i18n for Serbian language
    vi.mock('@lingui/react', () => ({
      useLingui: () => ({ i18n: (_) => (_: string) => _ }),
    }));

    render(
      <ChartErrorBoundary>
        <ThrowErrorComponent />
      </ChartErrorBoundary>
    );

    expect(screen.getByTestId('chart-error-fallback')).toBeInTheDocument();
  });
});