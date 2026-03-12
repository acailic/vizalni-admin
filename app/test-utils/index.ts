/**
 * Testing utilities for the vizualni-admin project
 * Provides common testing patterns, mocks, and utilities for unit and integration tests
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { configureAxe } from "jest-axe";
import React, { ReactElement, ReactNode } from "react";
import { vi } from "vitest";

// Mock state management (Zustand)
vi.mock("@/store", () => ({
  useAppStore: () => ({
    theme: "light",
    language: "sr",
    setTheme: vi.fn(),
    setLanguage: vi.fn(),
    // Add other store methods as needed
  }),
}));

// Mock API client
vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  createApiClient: () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
}));

// Mock Next.js router
vi.mock("next/router", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: {},
    asPath: "/",
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
    isLocaleDomain: true,
    isReady: true,
    defaultLocale: "sr",
    domainLocales: [],
    isPreview: false,
  }),
}));

// Configure axe for accessibility testing
const axe = configureAxe({
  rules: {
    // WCAG 2.1 AA compliance
    "color-contrast": { enabled: true },
    "keyboard-navigation": { enabled: true },
    "aria-labels": { enabled: true },
    "heading-order": { enabled: true },
    "alt-text": { enabled: true },
    "form-field-multiple-labels": { enabled: true },
    "focus-order-semantics": { enabled: true },
  },
});

// Test providers wrapper
const AllTheProviders = ({ children }: { children: ReactNode }) => {
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

  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const createMockChartConfig = (overrides = {}) => ({
  id: "test-chart-1",
  type: "bar",
  title: "Test Chart",
  description: "A test chart for unit testing",
  cubes: [],
  filters: [],
  ...overrides,
});

export const createMockDataset = (overrides = {}) => ({
  id: "test-dataset-1",
  name: "Test Dataset",
  description: "A test dataset for unit testing",
  columns: [
    { name: "year", type: "number" },
    { name: "value", type: "number" },
    { name: "region", type: "string" },
  ],
  rows: [
    { year: 2020, value: 100, region: "Beograd" },
    { year: 2021, value: 150, region: "Beograd" },
    { year: 2020, value: 80, region: "Novi Sad" },
    { year: 2021, value: 120, region: "Novi Sad" },
  ],
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: "test-user-1",
  email: "test@example.com",
  name: "Test User",
  role: "user",
  ...overrides,
});

// Mock GraphQL responses
export const createMockGraphQLResponse = (data: any, errors?: any[]) => ({
  data,
  errors,
  extensions: {},
  status: 200,
  headers: new Headers(),
});

// Performance testing utilities
export const measureRenderTime = async (
  component: ReactElement,
  iterations = 1
) => {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    customRender(component);
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    times,
  };
};

// Accessibility testing utilities
export const testAccessibility = async (container: HTMLElement) => {
  const results = await axe(container);
  return results;
};

// Form testing utilities
export const fillForm = async (
  user: any,
  formData: Record<string, string | number>
) => {
  for (const [field, value] of Object.entries(formData)) {
    const element =
      user.getByLabelText(new RegExp(field, "i")) ||
      user.getByPlaceholderText(new RegExp(field, "i")) ||
      user.getByDisplayValue(new RegExp(field, "i"));

    if (element) {
      await user.clear(element);
      await user.type(element, String(value));
    }
  }
};

// Mock intersection observer for infinite scroll testing
export const mockIntersectionObserver = () => {
  const mockObserve = vi.fn();
  const mockUnobserve = vi.fn();
  const mockDisconnect = vi.fn();

  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }));

  return { mockObserve, mockUnobserve, mockDisconnect };
};

// Internationalization testing utilities
export const createMockTranslations = (locale = "sr") => {
  const translations = {
    sr: {
      "common.save": "Sačuvaj",
      "common.cancel": "Otkaži",
      "common.delete": "Obriši",
      "common.edit": "Izmeni",
      // Add more translations as needed
    },
    en: {
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      // Add more translations as needed
    },
  };

  return translations[locale as keyof typeof translations] || translations.sr;
};

// Re-export testing library utilities
export * from "@testing-library/react";
export * from "@testing-library/user-event";
export { customRender as render };
export { axe };

// Export all mock data generators
// All mock functions are already exported inline above

// Performance and accessibility utilities
// All utility functions are already exported inline above
