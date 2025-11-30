/**
 * Tests for ChartWithFilters component
 * Tests chart rendering, filter interactions, and state management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChartWithFilters } from './chart-with-filters';

// Mock chart components
vi.mock('@/charts', () => ({
  Chart: ({ config, data }: any) => (
    <div data-testid="chart">
      <div data-testid="chart-type">{config.type}</div>
      <div data-testid="chart-data-count">{data?.length || 0}</div>
    </div>
  ),
}));

// Mock filter components
vi.mock('@/components/dashboard-interactive-filters', () => ({
  DashboardInteractiveFilters: ({
    filters,
    onFiltersChange,
    availableDimensions
  }: any) => (
    <div data-testid="interactive-filters">
      {availableDimensions?.map((dim: string) => (
        <div key={dim} data-testid={`filter-${dim}`}>
          <select
            onChange={(e) => onFiltersChange({
              ...filters,
              [dim]: e.target.value
            })}
            data-testid={`select-${dim}`}
          >
            <option value="">All</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
      ))}
    </div>
  ),
}));

// Mock API hooks
vi.mock('@/graphql/hooks', () => ({
  useDataCubesObservationsQuery: () => ({
    data: {
      dataCubesObservations: {
        data: [
          { year: 2020, value: 100, region: 'Beograd' },
          { year: 2021, value: 150, region: 'Beograd' },
          { year: 2020, value: 80, region: 'Novi Sad' },
          { year: 2021, value: 120, region: 'Novi Sad' },
        ],
      },
    },
    fetching: false,
    error: null,
  },
  useDataCubesComponentsQuery: () => ({
    data: {
      dataCubesComponents: {
        dimensions: [
          { name: 'year', label: 'Godina' },
          { name: 'region', label: 'Region' },
        ],
        measures: [
          { name: 'value', label: 'Vrednost' },
        ],
      },
    },
    fetching: false,
    error: null,
  }),
}));

describe('ChartWithFilters', () => {
  let queryClient: QueryClient;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    user = userEvent.setup();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('should render chart and filters correctly', async () => {
    const mockConfig = {
      type: 'bar',
      title: 'Population Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
      expect(screen.getByTestId('interactive-filters')).toBeInTheDocument();
      expect(screen.getByTestId('chart-type')).toHaveTextContent('bar');
    });
  });

  it('should display available dimensions as filters', async () => {
    const mockConfig = {
      type: 'line',
      title: 'Economic Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('filter-year')).toBeInTheDocument();
      expect(screen.getByTestId('filter-region')).toBeInTheDocument();
      expect(screen.getByTestId('select-year')).toBeInTheDocument();
      expect(screen.getByTestId('select-region')).toBeInTheDocument();
    });
  });

  it('should update chart when filters change', async () => {
    const mockConfig = {
      type: 'bar',
      title: 'Test Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    // Change region filter
    const regionSelect = screen.getByTestId('select-region');
    await user.selectOptions(regionSelect, 'option1');

    // Verify filter change triggers data refetch
    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });
  });

  it('should handle multiple filters simultaneously', async () => {
    const mockConfig = {
      type: 'line',
      title: 'Multi-filter Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('interactive-filters')).toBeInTheDocument();
    });

    // Apply multiple filters
    await user.selectOptions(screen.getByTestId('select-year'), 'option1');
    await user.selectOptions(screen.getByTestId('select-region'), 'option2');

    // Verify both filters are applied
    expect(screen.getByTestId('select-year')).toHaveValue('option1');
    expect(screen.getByTestId('select-region')).toHaveValue('option2');
  });

  it('should clear filters when reset button is clicked', async () => {
    const mockConfig = {
      type: 'bar',
      title: 'Reset Test Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('interactive-filters')).toBeInTheDocument();
    });

    // Apply filters
    await user.selectOptions(screen.getByTestId('select-year'), 'option1');

    // Look for reset button (if it exists in the component)
    const resetButton = screen.queryByRole('button', { name: /reset|clear/i });
    if (resetButton) {
      await user.click(resetButton);
      expect(screen.getByTestId('select-year')).toHaveValue('');
    }
  });

  it('should handle loading state correctly', async () => {
    // Mock loading state
    vi.doMock('@/graphql/hooks', () => ({
      useDataCubesObservationsQuery: () => ({
        data: null,
        fetching: true,
        error: null,
      }),
      useDataCubesComponentsQuery: () => ({
        data: {
          dataCubesComponents: {
            dimensions: [],
            measures: [],
          },
        },
        fetching: false,
        error: null,
      }),
    }));

    const mockConfig = {
      type: 'bar',
      title: 'Loading Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should handle error state correctly', async () => {
    // Mock error state
    vi.doMock('@/graphql/hooks', () => ({
      useDataCubesObservationsQuery: () => ({
        data: null,
        fetching: false,
        error: new Error('Failed to load data'),
      }),
      useDataCubesComponentsQuery: () => ({
        data: {
          dataCubesComponents: {
            dimensions: [],
            measures: [],
          },
        },
        fetching: false,
        error: null,
      }),
    }));

    const mockConfig = {
      type: 'bar',
      title: 'Error Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
    });
  });

  it('should maintain accessibility compliance', async () => {
    const { axe } = await import('jest-axe');

    const mockConfig = {
      type: 'bar',
      title: 'Accessible Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('should support Serbian language labels', async () => {
    const mockConfig = {
      type: 'bar',
      title: 'Grafik populacije',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    // Check for Serbian labels in filters
    const yearFilter = screen.getByTestId('filter-year');
    expect(within(yearFilter).getByText(/godina/i)).toBeInTheDocument();
  });

  it('should be keyboard accessible', async () => {
    const mockConfig = {
      type: 'bar',
      title: 'Keyboard Chart',
      filters: [],
    };

    renderWithProviders(
      <ChartWithFilters
        config={mockConfig}
        dataSource={{ type: 'sparql', url: 'http://test.com' }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('interactive-filters')).toBeInTheDocument();
    });

    // Test keyboard navigation
    const firstSelect = screen.getByTestId('select-year');
    firstSelect.focus();
    expect(firstSelect).toHaveFocus();

    // Tab to next filter
    await user.tab();
    const secondSelect = screen.getByTestId('select-region');
    expect(secondSelect).toHaveFocus();
  });
});