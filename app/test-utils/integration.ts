/**
 * Integration testing utilities for vizualni-admin
 * Provides utilities for testing end-to-end flows and API integration
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { http } from "msw";
import { setupServer } from "msw/node";
import React, { ReactElement } from "react";
import { vi, expect } from "vitest";

// Mock server setup
export const createMockServer = (handlers: any[]) => {
  const server = setupServer(...handlers);
  return {
    ...server,
    close: () => server.close(),
    listen: () => server.listen({ onUnhandledRequest: "error" }),
  };
};

// API response mock handlers
export const mockApiHandlers = {
  // Authentication endpoints
  login: http.post("/api/auth/login", async ({ res, ctx }: any) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: { id: "1", email: "test@example.com", name: "Test User" },
        token: "mock-jwt-token",
      })
    );
  }),

  logout: http.post("/api/auth/logout", async ({ res, ctx }: any) => {
    return res(ctx.status(200), ctx.json({ success: true }));
  }),

  getUser: http.get("/api/auth/user", async ({ res, ctx }: any) => {
    return res(
      ctx.status(200),
      ctx.json({ id: "1", email: "test@example.com", name: "Test User" })
    );
  }),

  // Dataset endpoints
  getDatasets: http.get("/api/datasets", async ({ res, ctx }: any) => {
    return res(
      ctx.status(200),
      ctx.json({
        datasets: [
          {
            id: "1",
            name: "Population Data",
            description: "Population data by region",
            rows: 1500,
            createdAt: "2023-01-01T00:00:00Z",
          },
          {
            id: "2",
            name: "Economic Indicators",
            description: "Key economic indicators",
            rows: 800,
            createdAt: "2023-01-15T00:00:00Z",
          },
        ],
      })
    );
  }),

  getDataset: http.get("/api/datasets/:id", async ({ req, res, ctx }: any) => {
    const { id } = (req as any).params;
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: `Dataset ${id}`,
        description: `Description for dataset ${id}`,
        columns: [
          { name: "year", type: "number" },
          { name: "value", type: "number" },
          { name: "region", type: "string" },
        ],
        rows: Array.from({ length: 100 }, (_, i) => ({
          year: 2020 + Math.floor(i / 10),
          value: Math.random() * 1000,
          region: `Region ${i % 10}`,
        })),
      })
    );
  }),

  createDataset: http.post("/api/datasets", async ({ req, res, ctx }: any) => {
    const body = await (req as any).json();
    return res(
      ctx.status(201),
      ctx.json({
        id: "new-dataset-id",
        ...body,
        createdAt: new Date().toISOString(),
      })
    );
  }),

  updateDataset: http.put(
    "/api/datasets/:id",
    async ({ req, res, ctx }: any) => {
      const { id } = (req as any).params;
      const body = await (req as any).json();
      return res(
        ctx.status(200),
        ctx.json({
          id,
          ...body,
          updatedAt: new Date().toISOString(),
        })
      );
    }
  ),

  // Chart endpoints
  generateChart: http.post(
    "/api/charts/generate",
    async ({ req, res, ctx }: any) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "chart-123",
          imageUrl: "/api/charts/chart-123/image",
          config: await (req as any).json(),
          generatedAt: new Date().toISOString(),
        })
      );
    }
  ),

  getChart: http.get("/api/charts/:id", async ({ req, res, ctx }: any) => {
    const { id } = (req as any).params;
    return res(
      ctx.status(200),
      ctx.json({
        id,
        type: "bar",
        title: "Generated Chart",
        config: {
          datasetId: "1",
          xAxis: "year",
          yAxis: "value",
          groupBy: "region",
        },
      })
    );
  }),

  // Dashboard endpoints
  getDashboard: http.get("/api/dashboard", async ({ res, ctx }: any) => {
    return res(
      ctx.status(200),
      ctx.json({
        widgets: [
          {
            id: "widget-1",
            type: "chart",
            title: "Total Datasets",
            data: { value: 25 },
          },
          {
            id: "widget-2",
            type: "chart",
            title: "Recent Activity",
            data: { activities: [] },
          },
        ],
      })
    );
  }),
};

// Mock response overrides for error testing
export const mockErrorHandlers = {
  unauthorized: http.get("*", async ({ res, ctx }: any) => {
    return res(ctx.status(401), ctx.json({ error: "Unauthorized access" }));
  }),

  serverError: http.get("*", async ({ res, ctx }: any) => {
    return res(ctx.status(500), ctx.json({ error: "Internal server error" }));
  }),

  networkError: http.get("*", async ({ res }: any) => {
    return (res as any).networkError("Network error");
  }),

  timeout: http.get("*", async ({ res, ctx }: any) => {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Long delay
    return res(ctx.status(200), ctx.json({}));
  }),
};

// Integration test helpers
export const renderWithProviders = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  );
};

// User flow testing helper
export const testUserFlow = async (
  steps: Array<{
    action?: () => Promise<void>;
    expectation?: () => Promise<void>;
    description: string;
  }>
) => {
  for (const step of steps) {
    try {
      if (step.action) {
        await step.action();
      }
      if (step.expectation) {
        await step.expectation();
      }
    } catch (error) {
      throw new Error(`Failed in step: ${step.description}. Error: ${error}`);
    }
  }
};

// API flow testing helper
export const testApiFlow = async (
  action: () => Promise<void>,
  options: {
    onSuccess?: () => Promise<void>;
    onError?: (error: Error) => Promise<void>;
  }
) => {
  try {
    await action();
    if (options.onSuccess) {
      await options.onSuccess();
    }
  } catch (error) {
    if (options.onError) {
      await options.onError(error as Error);
    } else {
      throw error;
    }
  }
};

// Form submission helper
export const testFormSubmission = async (
  form: HTMLElement,
  data: Record<string, any>,
  submitButton: HTMLElement,
  _options: { shouldSucceed?: boolean } = { shouldSucceed: true }
) => {
  const user = userEvent.setup();

  // Fill form fields
  for (const [fieldName, value] of Object.entries(data)) {
    const field = form.querySelector(
      `[name="${fieldName}"], [id="${fieldName}"]`
    ) as HTMLElement;
    if (field) {
      if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
        await user.clear(field);
        await user.type(field, String(value));
      } else if (field.tagName === "SELECT") {
        await user.selectOptions(field, String(value));
      }
    }
  }

  // Submit form
  await user.click(submitButton);

  return submitButton;
};

// Performance testing helpers
export const measureUserFlowPerformance = async (
  userFlow: () => Promise<void>
) => {
  const startTime = performance.now();
  await userFlow();
  const endTime = performance.now();

  return {
    duration: endTime - startTime,
    startTime,
    endTime,
  };
};

// Accessibility testing for flows
export const testFlowAccessibility = async (
  flowSteps: Array<() => Promise<void>>
) => {
  const violations: any[] = [];

  for (const step of flowSteps) {
    await step();
    // Check accessibility after each step
    const { axe } = await import("./index");
    const results = await axe(document.body);
    violations.push(...results.violations);
  }

  return violations;
};

// Memory testing utilities
export const testMemoryUsage = async (testFunction: () => Promise<void>) => {
  const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

  await testFunction();

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
  const memoryIncrease = finalMemory - initialMemory;

  return {
    initialMemory,
    finalMemory,
    memoryIncrease,
    withinLimits: memoryIncrease < 50 * 1024 * 1024, // 50MB limit
  };
};

// Error boundary testing helper
export const testErrorBoundary = async (
  component: ReactElement,
  expectedError: Error
) => {
  const { ErrorBoundary } = await import("react-error-boundary");
  const onError = vi.fn();

  const TestComponent = () =>
    React.createElement(
      ErrorBoundary,
      {
        fallback: React.createElement("div", null, "Error occurred"),
        onError: onError,
      },
      component
    );

  renderWithProviders(React.createElement(TestComponent, null));

  // Wait for error boundary to catch the error
  await waitFor(() => {
    expect(onError).toHaveBeenCalledWith(expectedError, expect.any(Object));
  });

  (expect(screen.getByText("Error occurred")) as any).toBeInTheDocument();
};

// Re-export utilities
// test utility functions are already exported inline above
// mockApiHandlers, mockErrorHandlers, createMockServer are already exported inline above
