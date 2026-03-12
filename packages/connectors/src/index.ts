/**
 * @vizualni/connectors - Data connectors for fetching data from various sources
 *
 * @remarks
 * This package provides connectors for CSV, JSON, and other data sources.
 * All connectors implement the {@link DataConnector} interface, ensuring
 * consistent behavior across different data sources.
 *
 * @packageDocumentation
 */

// ============================================================================
// Types
// ============================================================================

export type {
  DataConnector,
  ConnectorResult,
  DataSchema,
  FieldSchema,
  FieldType,
  SchemaInferenceOptions,
  UseConnectorOptions,
  BaseConnectorConfig,
} from "./types";

// ============================================================================
// Error Classes
// ============================================================================

export {
  ConnectorError,
  ConnectorFetchError,
  ConnectorParseError,
  ConnectorValidationError,
} from "./types";

// ============================================================================
// CSV Connector
// ============================================================================

export { csvConnector } from "./csv";
export type { CsvConfig } from "./csv";

// ============================================================================
// JSON Connector
// ============================================================================

export { jsonConnector } from "./json";
export type { JsonConfig } from "./json";
