/**
 * Test wrapper that provides all necessary context providers for component testing
 * Including I18nProvider for Lingui and other common providers
 */

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ComponentProps, ReactElement, ReactNode } from "react";

// Initialize i18n for tests
i18n.load("en", {});
i18n.activate("en");
const providerI18n = i18n as unknown as ComponentProps<
  typeof I18nProvider
>["i18n"];

// Create a test query client with disabled retries
const createTestQueryClient = () =>
  new QueryClient({
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

interface TestWrapperProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

/**
 * Wrapper component that provides all context providers needed for tests
 */
export function TestWrapper({ children, queryClient }: TestWrapperProps) {
  const client = queryClient || createTestQueryClient();

  return (
    <I18nProvider i18n={providerI18n}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </I18nProvider>
  );
}

/**
 * Custom render function that wraps components with all necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { queryClient?: QueryClient }
) {
  const { queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
    ),
    ...renderOptions,
  });
}

// Re-export everything from testing library
export * from "@testing-library/react";
export { renderWithProviders as render };
