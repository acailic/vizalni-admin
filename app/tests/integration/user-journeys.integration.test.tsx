/**
 * Integration tests for critical user journeys
 * Tests end-to-end flows that span multiple components and API calls
 */

import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';


// Mock components for testing (these would be your actual components)
import { LoginForm } from '@/components/auth/LoginForm';
import { ChartBuilder } from '@/components/charts/ChartBuilder';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { DatasetExplorer } from '@/components/data/DatasetExplorer';
import {
  renderWithProviders,
  testUserFlow,
  testApiFlow,
  testFormSubmission,
  mockApiHandlers,
  createMockServer,
} from '@/test-utils/integration';

describe('Critical User Journeys - Integration Tests', () => {
  let mockServer: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    mockServer = createMockServer([
      mockApiHandlers.login,
      mockApiHandlers.logout,
      mockApiHandlers.getUser,
      mockApiHandlers.getDatasets,
      mockApiHandlers.getDataset,
      mockApiHandlers.createDataset,
      mockApiHandlers.updateDataset,
      mockApiHandlers.generateChart,
    ]);
  });

  afterEach(() => {
    mockServer.close();
  });

  describe('Authentication Flow', () => {
    it('should allow user to log in successfully', async () => {
      const user = userEvent.setup();

      renderWithProviders(<LoginForm />);

      await testUserFlow([
        {
          action: async () => {
            await user.type(screen.getByLabelText(/email/i), 'test@example.com');
          },
          description: 'Enter email',
        },
        {
          action: async () => {
            await user.type(screen.getByLabelText(/password/i), 'password123');
          },
          description: 'Enter password',
        },
        {
          action: async () => {
            await user.click(screen.getByRole('button', { name: /sign in/i }));
          },
          description: 'Submit login form',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/welcome/i)).toBeInTheDocument();
            });
          },
          description: 'Verify successful login',
        },
      ]);
    });

    it('should show error message on failed login', async () => {
      // Override login handler to simulate error
      mockServer.use(
        mockApiHandlers.login.override(
          async (req, res, ctx) => {
            return res(
              ctx.status(401),
              ctx.json({ error: 'Invalid credentials' })
            );
          }
        )
      );

      const user = userEvent.setup();

      renderWithProviders(<LoginForm />);

      await testUserFlow([
        {
          action: async () => {
            await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
            await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
            await user.click(screen.getByRole('button', { name: /sign in/i }));
          },
          description: 'Submit invalid credentials',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
            });
          },
          description: 'Verify error message shown',
        },
      ]);
    });
  });

  describe('Data Explorer Journey', () => {
    it('should allow user to browse and view datasets', async () => {
      const user = userEvent.setup();

      renderWithProviders(<DatasetExplorer />);

      await testUserFlow([
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/population data/i)).toBeInTheDocument();
              expect(screen.getByText(/economic indicators/i)).toBeInTheDocument();
            });
          },
          description: 'Datasets should load',
        },
        {
          action: async () => {
            await user.click(screen.getByText(/population data/i));
          },
          description: 'Click on dataset',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/year/i)).toBeInTheDocument();
              expect(screen.getByText(/value/i)).toBeInTheDocument();
              expect(screen.getByText(/region/i)).toBeInTheDocument();
            });
          },
          description: 'Dataset details should load',
        },
        {
          action: async () => {
            await user.click(screen.getByRole('button', { name: /edit/i }));
          },
          description: 'Start editing dataset',
        },
        {
          expectation: async () => {
            expect(screen.getByDisplayValue(/dataset 1/i)).toBeInTheDocument();
          },
          description: 'Edit form should be visible',
        },
      ]);
    });

    it('should allow user to create new dataset', async () => {
      const user = userEvent.setup();

      renderWithProviders(<DatasetExplorer />);

      await testUserFlow([
        {
          action: async () => {
            await user.click(screen.getByRole('button', { name: /new dataset/i }));
          },
          description: 'Click new dataset button',
        },
        {
          expectation: async () => {
            expect(screen.getByLabelText(/dataset name/i)).toBeInTheDocument();
          },
          description: 'Create form should appear',
        },
        {
          action: async () => {
            await testFormSubmission(
              screen.getByRole('form'),
              {
                name: 'Test Dataset',
                description: 'A test dataset for integration testing',
              },
              screen.getByRole('button', { name: /create/i }),
              { shouldSucceed: true }
            );
          },
          description: 'Submit form to create dataset',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/dataset created successfully/i)).toBeInTheDocument();
            });
          },
          description: 'Success message should appear',
        },
      ]);
    });
  });

  describe('Chart Creation Journey', () => {
    it('should allow user to create a chart from dataset', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ChartBuilder datasetId="1" />
      );

      await testUserFlow([
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/chart builder/i)).toBeInTheDocument();
            });
          },
          description: 'Chart builder should load',
        },
        {
          action: async () => {
            await user.selectOptions(
              screen.getByLabelText(/chart type/i),
              'bar'
            );
          },
          description: 'Select chart type',
        },
        {
          action: async () => {
            await user.selectOptions(
              screen.getByLabelText(/x-axis/i),
              'year'
            );
          },
          description: 'Select X-axis column',
        },
        {
          action: async () => {
            await user.selectOptions(
              screen.getByLabelText(/y-axis/i),
              'value'
            );
          },
          description: 'Select Y-axis column',
        },
        {
          action: async () => {
            await user.click(screen.getByRole('button', { name: /generate chart/i }));
          },
          description: 'Generate chart',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByAltText(/generated chart/i)).toBeInTheDocument();
            }, { timeout: 10000 });
          },
          description: 'Chart should be generated and displayed',
        },
        {
          action: async () => {
            await user.click(screen.getByRole('button', { name: /save chart/i }));
          },
          description: 'Save chart',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/chart saved successfully/i)).toBeInTheDocument();
            });
          },
          description: 'Success message should appear',
        },
      ]);
    });
  });

  describe('Dashboard Integration Journey', () => {
    it('should display comprehensive dashboard with multiple widgets', async () => {
      const user = userEvent.setup();

      renderWithProviders(<Dashboard />);

      await testUserFlow([
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
              expect(screen.getByText(/total datasets/i)).toBeInTheDocument();
              expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
            });
          },
          description: 'Dashboard should load with widgets',
        },
        {
          action: async () => {
            await user.click(screen.getByText(/refresh data/i));
          },
          description: 'Refresh dashboard data',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/data updated/i)).toBeInTheDocument();
            }, { timeout: 5000 });
          },
          description: 'Data should be refreshed',
        },
        {
          action: async () => {
            await user.click(screen.getByRole('button', { name: /add widget/i }));
          },
          description: 'Add new widget',
        },
        {
          expectation: async () => {
            expect(screen.getByText(/select widget type/i)).toBeInTheDocument();
          },
          description: 'Widget selector should appear',
        },
      ]);
    });
  });

  describe('Search and Filter Journey', () => {
    it('should allow user to search and filter datasets', async () => {
      const user = userEvent.setup();

      renderWithProviders(<DatasetExplorer />);

      await testUserFlow([
        {
          action: async () => {
            await user.type(screen.getByPlaceholderText(/search datasets/i), 'population');
          },
          description: 'Search for datasets',
        },
        {
          action: async () => {
            await user.click(screen.getByRole('button', { name: /search/i }));
          },
          description: 'Submit search',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/result for population/i)).toBeInTheDocument();
            });
          },
          description: 'Search results should appear',
        },
        {
          action: async () => {
            await user.selectOptions(
              screen.getByLabelText(/filter by type/i),
              'dataset'
            );
          },
          description: 'Apply filter',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getAllByText(/dataset/i).length).toBeGreaterThan(0);
            });
          },
          description: 'Filtered results should update',
        },
        {
          action: async () => {
            await user.click(screen.getByRole('button', { name: /clear filters/i }));
          },
          description: 'Clear filters',
        },
        {
          expectation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/population data/i)).toBeInTheDocument();
              expect(screen.getByText(/economic indicators/i)).toBeInTheDocument();
            });
          },
          description: 'All datasets should be shown again',
        },
      ]);
    });
  });

  describe('API Integration Flow Tests', () => {
    it('should handle API errors gracefully', async () => {
      // Override handlers to simulate API errors
      mockServer.use(
        mockApiHandlers.getDatasets.override(
          async (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ error: 'Internal server error' })
            );
          }
        )
      );

      renderWithProviders(<DatasetExplorer />);

      await testApiFlow(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
        },
        {
          onError: async (error) => {
            expect(screen.getByText(/failed to load datasets/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
          },
        }
      );
    });

    it('should handle network timeouts', async () => {
      // Override handlers to simulate timeout
      mockServer.use(
        mockApiHandlers.getDatasets.override(
          async (req, res, ctx) => {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Long delay
            return res(ctx.status(200), ctx.json({ datasets: [] }));
          }
        )
      );

      renderWithProviders(<DatasetExplorer />);

      await testApiFlow(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
        },
        {
          onError: async (error) => {
            expect(screen.getByText(/request timeout/i)).toBeInTheDocument();
          },
        }
      );
    });
  });

  describe('Performance Integration Tests', () => {
    it('should render dashboard within acceptable time limits', async () => {
      const startTime = performance.now();

      renderWithProviders(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Dashboard should render within 3 seconds
      expect(renderTime).toBeLessThan(3000);
    });

    it('should handle large dataset rendering efficiently', async () => {
      // Override handler to return large dataset
      mockServer.use(
        mockApiHandlers.getDataset.override(
          async (req, res, ctx) => {
            const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
              year: 2020 + Math.floor(i / 100),
              value: Math.random() * 1000,
              region: `Region ${i % 10}`,
            }));

            return res(
              ctx.status(200),
              ctx.json({
                id: '1',
                name: 'Large Dataset',
                description: 'Large dataset for performance testing',
                rows: largeDataset,
              })
            );
          }
        )
      );

      const startTime = performance.now();

      renderWithProviders(<ChartBuilder datasetId="1" />);

      await waitFor(() => {
        expect(screen.getByText(/1000 rows/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Large dataset should render within 5 seconds
      expect(renderTime).toBeLessThan(5000);
    });
  });
});