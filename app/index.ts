/**
 * Entry point for @acailic/vizualni-admin package
 *
 * This package provides utilities for Serbian open data visualization,
 * including locale management, configuration validation, and data access.
 *
 * @packageDocumentation
 */

// Package version information
/** Current package version */
export const version = "1.0.0";

// Re-export from @lingui/react for convenience
/**
 * I18nProvider component from @lingui/react for internationalization support.
 * Use this to wrap your app for locale management.
 */
export { I18nProvider } from "@lingui/react";

// Export locale utilities (these are standalone and don't depend on Next.js)
/**
 * Default locale for the application (Serbian Latin).
 */
export { defaultLocale } from "./locales/locales";

/**
 * Array of supported locales.
 */
export { locales } from "./locales/locales";

/**
 * Parses a locale string and returns a valid Locale.
 * Falls back to defaultLocale if parsing fails.
 *
 * @param localeString - Locale string from Accept-Language header or similar
 * @returns Parsed Locale
 */
export { parseLocaleString } from "./locales/locales";

/**
 * Lingui i18n instance for internationalization.
 */
export { i18n } from "./locales/locales";

/**
 * Gets D3 time format locale object for the specified locale.
 * Used for formatting dates and times in charts.
 *
 * @param locale - Locale string ('sr-Latn', 'sr-Cyrl', or 'en')
 * @returns D3 TimeLocaleObject
 */
export { getD3TimeFormatLocale } from "./locales/locales";

/**
 * Gets D3 format locale object for number formatting.
 * Used for formatting numbers in Serbian locale.
 *
 * @returns D3 FormatLocaleObject
 */
export { getD3FormatLocale } from "./locales/locales";

/** Supported locale type */
export type { Locale } from "./locales/locales";

// Export chart configuration types for external consumers
/**
 * Chart configuration types and utilities.
 * Includes all chart config types, filters, and validation functions.
 */
export * from "./config-types";

// Export data transformation utilities
/**
 * Validates a VizualniAdmin configuration object against JSON schema.
 * Returns validation result with either the validated data or error details.
 *
 * @param input - Configuration object to validate
 * @returns Validation result
 */
export { validateConfig } from "./lib/config/validator";

/** Type for configuration validation issues */
export type { ValidationIssue } from "./lib/config/validator";

/**
 * Default configuration object for VizualniAdmin.
 * Use this as a starting point for custom configurations.
 */
export { DEFAULT_CONFIG } from "./lib/config/defaults";

/** Type for VizualniAdmin configuration */
export type { VizualniAdminConfig } from "./lib/config/types";

// Export data.gov.rs API client utilities
/**
 * Client for accessing Serbian Open Data Portal (data.gov.rs) API.
 * Provides methods for searching datasets, organizations, and downloading resources.
 */
export { DataGovRsClient } from "./domain/data-gov-rs/client";

/**
 * Creates a new DataGovRsClient instance with custom configuration.
 *
 * @param config - Client configuration options
 * @returns Configured DataGovRsClient instance
 */
export { createDataGovRsClient } from "./domain/data-gov-rs/client";

/**
 * Default DataGovRsClient instance with standard configuration.
 * Ready to use for most common operations.
 */
export { dataGovRsClient } from "./domain/data-gov-rs/client";

// Re-export types from data.gov.rs client for convenience
export type {
  DatasetMetadata,
  Organization,
  Resource,
  PaginatedResponse,
  SearchParams,
  DataGovRsConfig,
  ApiError,
} from "./domain/data-gov-rs/types";

// Export data connectors
/**
 * Data connectors for fetching data from various sources.
 * Includes CSV URL connector and extensible connector interface.
 *
 * @example
 * ```ts
 * import { CsvUrlConnector } from '@acailic/vizualni-admin/connectors';
 *
 * const connector = new CsvUrlConnector({
 *   id: 'my-data',
 *   url: 'https://example.com/data.csv',
 * });
 * ```
 */
export {
  // Types and interfaces
  type IDataConnector,
  type BaseConnectorConfig,
  type DataSchema,
  type DataType,
  type ConnectorResult,
  type PaginatedResult,
  type HealthCheckResult,
  type ConnectorCapabilities,
  type ConnectorErrorCode,
  type ConnectorFactory,
  ConnectorError,
  // CSV connector
  CsvUrlConnector,
  createCsvUrlConnector,
  type CsvUrlConnectorConfig,
  type CsvRow,
  // Registry
  ConnectorRegistry,
  registerConnector,
  unregisterConnector,
  createConnector,
  getConnector,
  listConnectors,
  destroyConnector,
} from "./exports/connectors";

// Note: Configurator, ConfiguratorStateProvider, and other components
// are not exported in this release as they have deep dependencies on the
// Next.js app structure. They will be refactored for standalone use
// in a future release.

// Export chart components (both classic and zero-config)
/**
 * Chart components for data visualization.
 *
 * Zero-config components (recommended):
 * - Line, Bar, Column, Pie - Work with just `data` prop
 *
 * Classic components (full config control):
 * - LineChart, BarChart, ColumnChart, PieChart, AreaChart, MapChart
 *
 * @example
 * ```tsx
 * import { Line } from '@acailic/vizualni-admin';
 *
 * <Line data={[{ year: '2020', value: 100 }]} />
 * ```
 */
export {
  // Zero-config components (shorter names)
  Line,
  Bar,
  Column,
  Pie,
  // Classic components
  LineChart,
  BarChart,
  ColumnChart,
  PieChart,
  AreaChart,
  MapChart,
} from "./exports/charts";

// Export chart types
export type {
  ChartProps,
  BaseChartConfig,
  LineChartProps,
  BarChartProps,
  ColumnChartProps,
  PieChartProps,
} from "./exports/charts";
