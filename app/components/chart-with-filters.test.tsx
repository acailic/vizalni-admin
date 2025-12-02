/**
 * Tests for ChartWithFilters component
 * Tests chart rendering, filter interactions, and state management
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

// Mock API hooks with explicit function declarations
const mockUseDataCubesObservationsQuery = vi.fn(() => ({
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
}));

const mockUseDataCubesComponentsQuery = vi.fn(() => ({
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
}));

vi.mock('@/graphql/hooks', () => ({
  useDataCubesObservationsQuery: mockUseDataCubesObservationsQuery,
  useDataCubesComponentsQuery: mockUseDataCubesComponentsQuery,
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

  it('should render chart and filters', () => {
    renderWithProviders(<ChartWithFilters cubeIri="test-cube" />);

    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByTestId('interactive-filters')).toBeInTheDocument();
  });

  it('should display chart data count', () => {
    renderWithProviders(<ChartWithFilters cubeIri="test-cube" />);

    expect(screen.getByTestId('chart-data-count')).toHaveTextContent('4');
  });

  it('should render available dimension filters', () => {
    renderWithProviders(<ChartWithFilters cubeIri="test-cube" />);

    expect(screen.getByTestId('filter-year')).toBeInTheDocument();
    expect(screen.getByTestId('filter-region')).toBeInTheDocument();
  });

  it('should handle filter changes', async () => {
    const onFiltersChange = vi.fn();

    renderWithProviders(
      <ChartWithFilters
        cubeIri="test-cube"
        onFiltersChange={onFiltersChange}
      />
    );

    const yearSelect = screen.getByTestId('select-year');
    await user.selectOptions(yearSelect, 'option1');

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ year: 'option1' })
    );
  });

  it('should show loading state', () => {
    mockUseDataCubesObservationsQuery.mockReturnValue({
      data: null,
      fetching: true,
      error: null,
    });

    renderWithProviders(<ChartWithFilters cubeIri="test-cube" />);

    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseDataCubesObservationsQuery.mockReturnValue({
      data: null,
      fetching: false,
      error: new Error('Test error'),
    });

    renderWithProviders(<ChartWithFilters cubeIri="test-cube" />);

    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});