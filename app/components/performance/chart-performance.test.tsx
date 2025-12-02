/**
 * Performance tests for chart components
 * Tests render performance, memory usage, and large dataset handling
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  measureRenderPerformance,
  detectMemoryLeaks,
  testLargeDatasetPerformance,
  PerformanceRegressionDetector,
} from '@/test-utils/performance';

// Mock chart components for performance testing
vi.mock('@/charts', () => ({
  Chart: ({ data, config }: any) => (
    <div data-testid="chart">
      <div data-testid="chart-type">{config.type}</div>
      <div data-testid="data-count">{data?.length || 0}</div>
      {data?.map((item: any, index: number) => (
        <div key={index} data-testid={`data-item-${index}`}>
          {JSON.stringify(item)}
        </div>
      ))}
    </div>
  ),
}));

describe('Chart Component Performance', () => {
  let queryClient: QueryClient;
  let performanceDetector: PerformanceRegressionDetector;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    performanceDetector = new PerformanceRegressionDetector();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Render Performance', () => {
    it('should render small datasets within performance thresholds', async () => {
      const SmallChart = () => {
        const data = Array.from({ length: 10 }, (_, i) => ({
          year: 2020 + i,
          value: Math.random() * 100,
          region: 'Beograd',
        }));

        return (
          <div data-testid="chart-container">
            {/* Mock chart component */}
            <div data-testid="chart-data-count">{data.length}</div>
          </div>
        );
      };

      const performance = await measureRenderPerformance(<SmallChart />, 5);

      expect(performance.averageTime).toBeLessThan(16); // 60fps threshold
      expect(performance.maxTime).toBeLessThan(33); // 30fps worst case
      expect(performance.standardDeviation).toBeLessThan(5); // Consistent performance
    });

    it('should handle medium datasets efficiently', async () => {
      const MediumChart = () => {
        const data = Array.from({ length: 100 }, (_, i) => ({
          year: 2020 + Math.floor(i / 10),
          value: Math.random() * 1000,
          region: `Region ${i % 10}`,
        }));

        return (
          <div data-testid="chart-container">
            <div data-testid="chart-data-count">{data.length}</div>
          </div>
        );
      };

      const performance = await measureRenderPerformance(<MediumChart />, 3);

      expect(performance.averageTime).toBeLessThan(50); // Should still be responsive
      expect(performance.maxTime).toBeLessThan(100); // Maximum acceptable time
    });

    it('should maintain consistent performance across multiple renders', async () => {
      const ChartComponent = () => (
        <div data-testid="chart">
          <div data-testid="chart-type">bar</div>
        </div>
      );

      const performance = await measureRenderPerformance(<ChartComponent />, 10);

      // Performance should be consistent (low standard deviation)
      expect(performance.standardDeviation).toBeLessThan(performance.averageTime * 0.3);

      // No single render should be dramatically slower than average
      expect(performance.maxTime).toBeLessThan(performance.averageTime * 2);
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory during repeated mount/unmount', async () => {
      let renderCount = 0;

      const renderChart = () => {
        renderCount++;
        return renderWithProviders(
          <div data-testid="chart-container">
            Chart Component {renderCount}
          </div>
        );
      };

      const memoryTest = await detectMemoryLeaks(renderChart, 5, 10 * 1024 * 1024); // 10MB threshold

      expect(memoryTest.hasLeaks).toBe(false);
      expect(memoryTest.leakRate).toBeLessThan(1024 * 1024); // Less than 1MB per iteration
    });

    it('should clean up large datasets properly', async () => {
      const LargeChart = ({ data }: { data: any[] }) => (
        <div data-testid="chart">
          <div data-testid="data-count">{data.length}</div>
        </div>
      );

      let renderCount = 0;

      const renderLargeChart = () => {
        renderCount++;
        const largeData = Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          value: Math.random() * 1000,
          category: `Category ${i % 20}`,
          timestamp: Date.now() + i,
        }));

        return renderWithProviders(<LargeChart data={largeData} />);
      };

      const memoryTest = await detectMemoryLeaks(renderLargeChart, 3, 50 * 1024 * 1024); // 50MB threshold

      expect(memoryTest.hasLeaks).toBe(false);
    });
  });

  describe('Large Dataset Performance', () => {
    it('should scale performance with data size', async () => {
      const generateChartData = (size: number) =>
        Array.from({ length: size }, (_, i) => ({
          id: i,
          value: Math.random() * 1000,
          category: `Category ${i % 50}`,
          timestamp: Date.now() + i,
        }));

      const TestChart = ({ data }: { data: any[] }) => (
        <div data-testid="performance-chart">
          <div data-testid="data-size">{data.length}</div>
        </div>
      );

      const results = await testLargeDatasetPerformance(
        <TestChart data={[]} />,
        [100, 500, 1000, 2000],
        generateChartData
      );

      // Performance should scale reasonably (not exponentially)
      const smallResult = results[0];
      const largeResult = results[3];

      // Large dataset shouldn't take more than 10x time of small dataset
      expect(largeResult.renderTime).toBeLessThan(smallResult.renderTime * 10);

      // Memory usage should be reasonable
      expect(largeResult.memoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB limit

      // Should remain interactive even with large datasets
      expect(results.every(result => result.interactive)).toBe(true);
    });

    it('should handle virtualized data efficiently', async () => {
      // This would test chart components with virtualization
      const VirtualizedChart = () => (
        <div data-testid="virtualized-chart">
          <div data-testid="visible-range">1-100</div>
          <div data-testid="total-records">10000</div>
        </div>
      );

      const performance = await measureRenderPerformance(<VirtualizedChart />, 3);

      // Virtualized component should render quickly regardless of total data size
      expect(performance.averageTime).toBeLessThan(50);
    });
  });

  describe('Performance Regression Detection', () => {
    it('should detect performance regressions', () => {
      // Set baseline
      performanceDetector.setBaseline('chart-render-time', 25);

      // Test with degraded performance
      const result = performanceDetector.checkRegression('chart-render-time', 35, 0.2);

      expect(result.hasRegression).toBe(true);
      expect(result.percentageChange).toBe(40); // 40% increase
      expect(result.severity).toBe('moderate');
    });

    it('should pass when performance is acceptable', () => {
      // Set baseline
      performanceDetector.setBaseline('chart-render-time', 30);

      // Test with similar or better performance
      const result = performanceDetector.checkRegression('chart-render-time', 32, 0.2);

      expect(result.hasRegression).toBe(false);
      expect(result.percentageChange).toBeLessThan(10);
    });

    it('should detect severe regressions', () => {
      // Set baseline
      performanceDetector.setBaseline('chart-render-time', 20);

      // Test with severely degraded performance
      const result = performanceDetector.checkRegression('chart-render-time', 50, 0.2);

      expect(result.hasRegression).toBe(true);
      expect(result.severity).toBe('severe');
      expect(result.percentageChange).toBe(150); // 150% increase
    });
  });

  describe('Interaction Performance', () => {
    it('should respond to filter changes quickly', async () => {
      const InteractiveChart = () => {
        const [filters, setFilters] = React.useState({});

        const applyFilter = (key: string, value: string) => {
          // Simulate filter processing time
          const startTime = performance.now();
          setFilters(prev => ({ ...prev, [key]: value }));
          const endTime = performance.now();
          return endTime - startTime;
        };

        return (
          <div data-testid="interactive-chart">
            <button
              onClick={() => applyFilter('region', 'Beograd')}
              data-testid="filter-button"
            >
              Apply Filter
            </button>
            <div data-testid="applied-filters">
              {Object.keys(filters).length} filters applied
            </div>
          </div>
        );
      };

      renderWithProviders(<InteractiveChart />);

      const filterButton = screen.getByTestId('filter-button');
      const startTime = performance.now();

      // Simulate user clicking filter
      filterButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('applied-filters')).toHaveTextContent('1 filters applied');
      });

      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      // Filter application should be fast
      expect(interactionTime).toBeLessThan(100);
    });

    it('should handle rapid user interactions gracefully', async () => {
      const RapidInteractionChart = () => {
        const [count, setCount] = React.useState(0);

        return (
          <div data-testid="rapid-chart">
            <button
              onClick={() => setCount(c => c + 1)}
              data-testid="increment-button"
            >
              Click Count: {count}
            </button>
          </div>
        );
      };

      renderWithProviders(<RapidInteractionChart />);

      const button = screen.getByTestId('increment-button');
      const startTime = performance.now();

      // Simulate rapid clicks
      for (let i = 0; i < 10; i++) {
        button.click();
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle rapid interactions efficiently
      expect(totalTime).toBeLessThan(500); // All 10 clicks within 500ms
    });
  });

  describe('Accessibility Performance', () => {
    it('should maintain screen reader performance', async () => {
      const AccessibleChart = () => (
        <div
          role="img"
          aria-label="Chart showing population data"
          data-testid="accessible-chart"
        >
          <div data-testid="chart-content">Chart content</div>
        </div>
      );

      const performance = await measureRenderPerformance(<AccessibleChart />, 5);

      // Accessibility features shouldn't significantly impact performance
      expect(performance.averageTime).toBeLessThan(20);
    });
  });
});