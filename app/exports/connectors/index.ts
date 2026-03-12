/**
 * Data Connectors Export
 *
 * Exports all connector-related functionality including:
 * - Type definitions and interfaces
 * - CSV URL connector implementation
 * - Connector registry for managing connectors
 *
 * @packageDocumentation
 */

// Export types and interfaces
export type {
  // Base types
  BaseConnectorConfig,
  DataSchema,
  DataType,
  PaginationParams,
  PaginationMeta,
  ConnectorResult,
  PaginatedResult,
  HealthCheckResult,
  ConnectorCapabilities,

  // Error types
  ConnectorErrorCode,

  // Main interface
  IDataConnector,

  // Factory type
  ConnectorFactory,
} from "./types";

// Export the ConnectorError class
export { ConnectorError } from "./types";

// Export CSV URL connector
export { CsvUrlConnector, createCsvUrlConnector } from "./CsvUrlConnector";

export type { CsvUrlConnectorConfig, CsvRow } from "./CsvUrlConnector";

// Export registry
export {
  ConnectorRegistry,
  registerConnector,
  unregisterConnector,
  createConnector,
  getConnector,
  listConnectors,
  destroyConnector,
} from "./registry";

// Re-export for convenience
export { ConnectorRegistry as default } from "./registry";
