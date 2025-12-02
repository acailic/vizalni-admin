/**
 * Tests for DashboardInteractiveFilters component
 * Tests filter functionality, state management, and user interactions
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { DashboardInteractiveFilters } from './dashboard-interactive-filters';

// Mock the filter components
vi.mock('@/components/multi-select', () => ({
  MultiSelect: ({
    options,
    value,
    onChange,
    placeholder
  }: any) => (
    <div data-testid="multi-select">
      <select
        data-testid={`select-${placeholder?.toLowerCase()}`}
        multiple
        value={value || []}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value);
          onChange(selected);
        }}
      >
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

// Mock GraphQL hooks
vi.mock('@/graphql/hooks', () => ({
  useDataCubesComponentsQuery: () => ({
    data: {
      dataCubesComponents: {
        dimensions: [
          {
            iri: 'http://example.org/dim/year',
            label: 'Godina',
            values: [
              { value: '2020', label: '2020' },
              { value: '2021', label: '2021' },
              { value: '2022', label: '2022' },
            ]
          },
          {
            iri: 'http://example.org/dim/region',
            label: 'Region',
            values: [
              { value: 'beograd', label: 'Beograd' },
              { value: 'novi-sad', label: 'Novi Sad' },
              { value: 'nis', label: 'Niš' },
            ]
          },
        ],
        measures: [
          {
            iri: 'http://example.org/meas/population',
            label: 'Populacija'
          },
        ],
      },
    },
    fetching: false,
    error: null,
  }),
}));

describe('DashboardInteractiveFilters', () => {
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

  it('should render filters with available dimensions', async () => {
    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
          { iri: 'http://example.org/dim/region', label: 'Region' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('multi-select')).toBeInTheDocument();
      expect(screen.getByText(/godina/i)).toBeInTheDocument();
      expect(screen.getByText(/region/i)).toBeInTheDocument();
    });
  });

  it('should call onFiltersChange when filter values change', async () => {
    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-godina')).toBeInTheDocument();
    });

    const select = screen.getByTestId('select-godina');
    await user.selectOptions(select, '2020');

    expect(onFiltersChange).toHaveBeenCalledWith({
      'http://example.org/dim/year': ['2020'],
    });
  });

  it('should handle multiple selections in filters', async () => {
    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-godina')).toBeInTheDocument();
    });

    const select = screen.getByTestId('select-godina');
    await user.selectOptions(select, ['2020', '2021']);

    expect(onFiltersChange).toHaveBeenCalledWith({
      'http://example.org/dim/year': ['2020', '2021'],
    });
  });

  it('should clear filter when no options selected', async () => {
    const onFiltersChange = vi.fn();
    const initialFilters = {
      'http://example.org/dim/year': ['2020'],
    };

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={initialFilters}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-godina')).toBeInTheDocument();
    });

    const select = screen.getByTestId('select-godina');
    await user.selectOptions(select, []);

    expect(onFiltersChange).toHaveBeenCalledWith({});
  });

  it('should handle Serbian language dimension labels', async () => {
    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Година' },
          { iri: 'http://example.org/dim/region', label: 'Регион' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/година/i)).toBeInTheDocument();
      expect(screen.getByText(/регион/i)).toBeInTheDocument();
    });
  });

  it('should maintain filter state when re-rendering with same filters', async () => {
    const onFiltersChange = vi.fn();
    const filters = {
      'http://example.org/dim/year': ['2021'],
    };

    const { rerender } = renderWithProviders(
      <DashboardInteractiveFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-godina')).toBeInTheDocument();
    });

    // Rerender with same filters
    rerender(
      <DashboardInteractiveFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    expect(screen.getByTestId('select-godina')).toHaveValue(['2021']);
  });

  it('should be keyboard accessible', async () => {
    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
          { iri: 'http://example.org/dim/region', label: 'Region' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-godina')).toBeInTheDocument();
    });

    // Test keyboard navigation
    const firstSelect = screen.getByTestId('select-godina');
    firstSelect.focus();
    expect(firstSelect).toHaveFocus();

    // Navigate to next filter
    await user.tab();
    const secondSelect = screen.getByTestId('select-region');
    expect(secondSelect).toHaveFocus();
  });

  it('should handle loading state', async () => {
    // Mock loading state
    vi.doMock('@/graphql/hooks', () => ({
      useDataCubesComponentsQuery: () => ({
        data: null,
        fetching: true,
        error: null,
      }),
    }));

    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[]}
        cubeIri="http://example.org/cube/population"
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should handle error state gracefully', async () => {
    // Mock error state
    vi.doMock('@/graphql/hooks', () => ({
      useDataCubesComponentsQuery: () => ({
        data: null,
        fetching: false,
        error: new Error('Failed to load dimensions'),
      }),
    }));

    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should maintain accessibility compliance', async () => {
    const { axe } = await import('jest-axe');
    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
          { iri: 'http://example.org/dim/region', label: 'Region' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('multi-select')).toBeInTheDocument();
    });

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('should handle empty availableDimensions', async () => {
    const onFiltersChange = vi.fn();

    renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/no filters available/i)).toBeInTheDocument();
    });
  });

  it('should update filter options based on cube selection', async () => {
    const onFiltersChange = vi.fn();

    const { rerender } = renderWithProviders(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/year', label: 'Godina' },
        ]}
        cubeIri="http://example.org/cube/population"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/godina/i)).toBeInTheDocument();
    });

    // Change cube and dimensions
    rerender(
      <DashboardInteractiveFilters
        filters={{}}
        onFiltersChange={onFiltersChange}
        availableDimensions={[
          { iri: 'http://example.org/dim/category', label: 'Kategorija' },
        ]}
        cubeIri="http://example.org/cube/economic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/kategorija/i)).toBeInTheDocument();
    });
  });
});