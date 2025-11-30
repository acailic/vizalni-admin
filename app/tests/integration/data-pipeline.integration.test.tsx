/**
 * Integration tests for data pipeline
 * Tests complete data flow from API client through state management to UI
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { renderWithProviders, testUserFlow, testApiFlow } from '@/test-utils/integration';

// Mock API server setup
const server = setupServer(
  // Dataset endpoints
  rest.get('/api/datasets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        datasets: [
          {
            id: 'population-data',
            name: 'Podaci o stanovništvu',
            description: 'Demografski podaci po regionima Srbije',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-15T00:00:00Z',
            rows: 1250,
          },
          {
            id: 'economic-indicators',
            name: 'Ekonomski pokazatelji',
            description: 'GDP i drugi ekonomski indikatori',
            created: '2024-01-05T00:00:00Z',
            updated: '2024-01-20T00:00:00Z',
            rows: 850,
          },
        ],
        total: 2,
      })
    );
  }),

  rest.get('/api/datasets/:id', (req, res, ctx) => {
    const { id } = req.params;

    if (id === 'population-data') {
      return res(
        ctx.status(200),
        ctx.json({
          id,
          name: 'Podaci o stanovništvu',
          description: 'Demografski podaci po regionima Srbije',
          columns: [
            { name: 'godina', type: 'integer', label: 'Godina' },
            { name: 'vrednost', type: 'number', label: 'Vrednost' },
            { name: 'region', type: 'string', label: 'Region' },
            { name: 'pol', type: 'string', label: 'Pol' },
          ],
          rows: [
            { godina: 2020, vrednost: 6898530, region: 'Srbija', pol: 'M' },
            { godina: 2020, vrednost: 6984120, region: 'Srbija', pol: 'Ž' },
            { godina: 2021, vrednost: 6884120, region: 'Srbija', pol: 'M' },
            { godina: 2021, vrednost: 6965410, region: 'Srbija', pol: 'Ž' },
          ],
        })
      );
    }

    return res(ctx.status(404), ctx.json({ error: 'Dataset not found' }));
  }),

  // Chart generation endpoint
  rest.post('/api/charts', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'chart-' + Date.now(),
        type: 'bar',
        url: '/api/charts/placeholder.png',
        config: req.body,
        created: new Date().toISOString(),
      })
    );
  }),

  // Dashboard widgets endpoint
  rest.get('/api/dashboard/widgets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        widgets: [
          {
            id: 'total-datasets',
            type: 'statistic',
            title: 'Ukupno skupova podataka',
            value: 25,
            trend: '+5%',
          },
          {
            id: 'recent-activity',
            type: 'list',
            title: 'Nedavna aktivnost',
            items: [
              { action: 'Kreiran grafik', timestamp: '2024-01-30T10:00:00Z' },
              { action: 'Ažuriran dataset', timestamp: '2024-01-30T09:30:00Z' },
            ],
          },
        ],
      })
    );
  }),

  // Error scenarios
  rest.get('/api/datasets/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal server error' })
    );
  }),

  rest.get('/api/datasets/timeout', (req, res, ctx) => {
    return res(
      ctx.delay(10000), // 10 second delay
      ctx.status(200),
      ctx.json({ datasets: [] })
    );
  })
);

// Mock components for testing
const DatasetExplorer = () => {
  const { data, loading, error } = useDatasetsQuery();
  const [selectedDataset, setSelectedDataset] = React.useState(null);

  if (loading) return <div data-testid="loading">Učitavanje...</div>;
  if (error) return <div data-testid="error">Greška pri učitavanju</div>;

  return (
    <div data-testid="dataset-explorer">
      <h1 data-testid="page-title">Istraživač skupova podataka</h1>
      <div data-testid="datasets-list">
        {data?.datasets?.map(dataset => (
          <div
            key={dataset.id}
            data-testid={`dataset-${dataset.id}`}
            onClick={() => setSelectedDataset(dataset.id)}
            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', margin: '5px' }}
          >
            <h3 data-testid={`dataset-name-${dataset.id}`}>{dataset.name}</h3>
            <p data-testid={`dataset-desc-${dataset.id}`}>{dataset.description}</p>
            <span data-testid={`dataset-rows-${dataset.id}`}>{dataset.rows} redova</span>
          </div>
        ))}
      </div>
      {selectedDataset && (
        <div data-testid="selected-dataset">
          <h2>Izabrani dataset: {selectedDataset}</h2>
        </div>
      )}
    </div>
  );
};

const ChartBuilder = ({ datasetId }: { datasetId: string }) => {
  const { data, loading, error } = useDatasetQuery(datasetId);
  const [chartConfig, setChartConfig] = React.useState({
    type: 'bar',
    xColumn: 'godina',
    yColumn: 'vrednost',
  });

  if (loading) return <div data-testid="loading">Učitavanje dataseta...</div>;
  if (error) return <div data-testid="error">Greška pri učitavanju dataseta</div>;

  const generateChart = async () => {
    try {
      const response = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId,
          config: chartConfig,
          data: data.rows,
        }),
      });

      if (response.ok) {
        const chart = await response.json();
        window.alert(`Grafik kreiran: ${chart.id}`);
      }
    } catch (error) {
      window.alert('Greška pri kreiranju grafika');
    }
  };

  return (
    <div data-testid="chart-builder">
      <h1 data-testid="page-title">Kreator grafika</h1>
      <div data-testid="dataset-info">
        <h2>{data.name}</h2>
        <p>{data.description}</p>
      </div>

      <div data-testid="chart-config">
        <label>
          Tip grafika:
          <select
            data-testid="chart-type"
            value={chartConfig.type}
            onChange={(e) => setChartConfig(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="bar">Stupčasti</option>
            <option value="line">Linijski</option>
            <option value="pie">Tortni</option>
          </select>
        </label>

        <label>
          X osa:
          <select
            data-testid="x-axis"
            value={chartConfig.xColumn}
            onChange={(e) => setChartConfig(prev => ({ ...prev, xColumn: e.target.value }))}
          >
            {data.columns?.map(col => (
              <option key={col.name} value={col.name}>{col.label}</option>
            ))}
          </select>
        </label>

        <label>
          Y osa:
          <select
            data-testid="y-axis"
            value={chartConfig.yColumn}
            onChange={(e) => setChartConfig(prev => ({ ...prev, yColumn: e.target.value }))}
          >
            {data.columns?.map(col => (
              <option key={col.name} value={col.name}>{col.label}</option>
            ))}
          </select>
        </label>
      </div>

      <button data-testid="generate-chart" onClick={generateChart}>
        Generiši grafik
      </button>
    </div>
  );
};

// Mock hooks
const useDatasetsQuery = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/datasets')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

const useDatasetQuery = (id: string) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (id) {
      fetch(`/api/datasets/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Dataset not found');
          return res.json();
        })
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [id]);

  return { data, loading, error };
};

describe('Data Pipeline Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let queryClient: QueryClient;

  beforeEach(() => {
    user = userEvent.setup();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('Dataset Discovery and Selection Flow', () => {
    it('should complete full dataset discovery workflow', async () => {
      renderWithProviders(<DatasetExplorer />);

      await testUserFlow([
        {
          expectation: async () => {
            expect(screen.getByTestId('page-title')).toHaveTextContent('Istraživač skupova podataka');
          },
          description: 'Page should load with correct title',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByTestId('dataset-population-data')).toBeInTheDocument();
              expect(screen.getByTestId('dataset-economic-indicators')).toBeInTheDocument();
            });
          },
          description: 'Datasets should be displayed',
        },
        {
          expectation: async () => {
            expect(screen.getByTestId('dataset-name-population-data')).toHaveTextContent('Podaci o stanovništvu');
            expect(screen.getByTestId('dataset-desc-population-data')).toHaveTextContent('Demografski podaci');
            expect(screen.getByTestId('dataset-rows-population-data')).toHaveTextContent('1250');
          },
          description: 'Dataset information should be displayed correctly in Serbian',
        },
        {
          action: async () => {
            await user.click(screen.getByTestId('dataset-population-data'));
          },
          description: 'Click on population dataset',
        },
        {
          expectation: async () => {
            expect(screen.getByTestId('selected-dataset')).toBeInTheDocument();
            expect(screen.getByTestId('selected-dataset')).toHaveTextContent('population-data');
          },
          description: 'Dataset should be selected',
        },
      ]);
    });

    it('should handle dataset loading errors gracefully', async () => {
      server.use(
        rest.get('/api/datasets', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ error: 'Server error' })
          );
        })
      );

      renderWithProviders(<DatasetExplorer />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.getByTestId('error')).toHaveTextContent('Greška pri učitavanju');
      });
    });
  });

  describe('Chart Creation Pipeline', () => {
    it('should complete end-to-end chart creation workflow', async () => {
      renderWithProviders(<ChartBuilder datasetId="population-data" />);

      await testUserFlow([
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByTestId('page-title')).toHaveTextContent('Kreator grafika');
            });
          },
          description: 'Chart builder should load',
        },
        {
          expectation: async () => {
            expect(screen.getByTestId('dataset-info')).toBeInTheDocument();
            expect(screen.getByTestId('dataset-info')).toHaveTextContent('Podaci o stanovništvu');
          },
          description: 'Dataset information should be displayed',
        },
        {
          expectation: async () => {
            expect(screen.getByTestId('chart-type')).toBeInTheDocument();
            expect(screen.getByTestId('x-axis')).toBeInTheDocument();
            expect(screen.getByTestId('y-axis')).toBeInTheDocument();
          },
          description: 'Chart configuration options should be available',
        },
        {
          action: async () => {
            await user.selectOptions(screen.getByTestId('chart-type'), 'line');
            await user.selectOptions(screen.getByTestId('x-axis'), 'godina');
            await user.selectOptions(screen.getByTestId('y-axis'), 'vrednost');
          },
          description: 'Configure chart settings',
        },
        {
          action: async () => {
            window.alert = vi.fn(); // Mock alert
            await user.click(screen.getByTestId('generate-chart'));
          },
          description: 'Generate chart',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(window.alert).toHaveBeenCalledWith(
                expect.stringMatching(/Grafik kreiran: chart-\d+/)
              );
            });
          },
          description: 'Chart should be generated successfully',
        },
      ]);
    });

    it('should handle chart creation with invalid dataset', async () => {
      renderWithProviders(<ChartBuilder datasetId="nonexistent" />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.getByTestId('error')).toHaveTextContent('Greška pri učitavanju dataseta');
      });
    });
  });

  describe('State Management Integration', () => {
    it('should maintain state consistency across components', async () => {
      // Test that shared state (like selected dataset) is consistent
      const TestApp = () => {
        const [selectedDataset, setSelectedDataset] = React.useState(null);

        return (
          <div>
            <DatasetExplorer onSelect={setSelectedDataset} />
            {selectedDataset && <ChartBuilder datasetId={selectedDataset} />}
          </div>
        );
      };

      renderWithProviders(<TestApp />);

      // Select a dataset
      await user.click(screen.getByTestId('dataset-population-data'));

      // Verify chart builder receives the selected dataset
      await waitFor(() => {
        expect(screen.getByTestId('chart-builder')).toBeInTheDocument();
        expect(screen.getByTestId('dataset-info')).toHaveTextContent('Podaci o stanovništvu');
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle network timeouts', async () => {
      server.use(
        rest.get('/api/datasets', (req, res, ctx) => {
          return res(
            ctx.delay(6000), // 6 second delay (longer than default timeout)
            ctx.status(200),
            ctx.json({ datasets: [] })
          );
        })
      );

      renderWithProviders(<DatasetExplorer />);

      await waitFor(() => {
        // Should show timeout error
        expect(screen.getByText(/timeout|vreme isteklo/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });

    it('should handle API rate limiting', async () => {
      let requestCount = 0;

      server.use(
        rest.get('/api/datasets', (req, res, ctx) => {
          requestCount++;
          if (requestCount > 5) {
            return res(
              ctx.status(429),
              ctx.json({ error: 'Rate limit exceeded' })
            );
          }
          return res(
            ctx.status(200),
            ctx.json({ datasets: [] })
          );
        })
      );

      // Make multiple rapid requests
      for (let i = 0; i < 6; i++) {
        renderWithProviders(<DatasetExplorer />);
      }

      await waitFor(() => {
        expect(screen.getByText(/rate limit/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Synchronization', () => {
    it('should handle concurrent data updates', async () => {
      const TestComponent = () => {
        const { data, refetch } = useDatasetsQuery();

        return (
          <div>
            <button data-testid="refresh-button" onClick={() => refetch()}>
              Osveži
            </button>
            <div data-testid="datasets-count">
              {data?.datasets?.length || 0} skupova
            </div>
          </div>
        );
      };

      renderWithProviders(<TestComponent />);

      // Trigger multiple refreshes
      const refreshButton = screen.getByTestId('refresh-button');

      for (let i = 0; i < 3; i++) {
        await user.click(refreshButton);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Should still show consistent data
      await waitFor(() => {
        expect(screen.getByTestId('datasets-count')).toHaveTextContent('2 skupova');
      });
    });
  });

  describe('Performance Under Load', () => {
    it('should handle large datasets efficiently', async () => {
      server.use(
        rest.get('/api/datasets/large', (req, res, ctx) => {
          const largeDataset = {
            id: 'large-dataset',
            name: 'Veliki dataset',
            rows: Array.from({ length: 10000 }, (_, i) => ({
              id: i,
              value: Math.random() * 1000,
              category: `Category ${i % 100}`,
            })),
          };

          return res(ctx.status(200), ctx.json(largeDataset));
        })
      );

      const startTime = performance.now();

      renderWithProviders(<ChartBuilder datasetId="large-dataset" />);

      await waitFor(() => {
        expect(screen.getByTestId('chart-builder')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Should load within acceptable time even with large dataset
      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility throughout data flows', async () => {
      const { axe } = await import('jest-axe');

      renderWithProviders(<DatasetExplorer />);

      await waitFor(() => {
        expect(screen.getByTestId('datasets-list')).toBeInTheDocument();
      });

      const results = await axe(document.body);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Internationalization Integration', () => {
    it('should maintain Serbian language throughout flows', async () => {
      renderWithProviders(<DatasetExplorer />);

      await waitFor(() => {
        expect(screen.getByTestId('page-title')).toHaveTextContent('Istraživač skupova podataka');
      });

      // Check that all UI text is in Serbian
      expect(screen.getByText(/skupova podataka/i)).toBeInTheDocument();
      expect(screen.getByText(/godina/i)).toBeInTheDocument();
      expect(screen.getByText(/vrednost/i)).toBeInTheDocument();
    });
  });
});