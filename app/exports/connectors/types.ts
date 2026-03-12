/**
 * Data Connector Types and Interfaces
 *
 * Defines the generic connector interface for supporting multiple data sources
 * beyond data.gov.rs. Connectors provide a standardized way to fetch data from
 * various sources like CSV URLs, CKAN instances, Socrata APIs, and databases.
 *
 * @packageDocumentation
 */

/**
 * Base configuration for all data connectors
 */
export interface BaseConnectorConfig {
  /**
   * Unique identifier for this connector instance
   */
  id: string;

  /**
   * Human-readable name for this connector
   */
  name: string;

  /**
   * Optional description of the data source
   */
  description?: string;

  /**
   * Request timeout in milliseconds
   * @default 10000
   */
  timeout?: number;

  /**
   * Maximum number of retry attempts for failed requests
   * @default 3
   */
  maxRetries?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Schema information for a dataset
 */
export interface DataSchema {
  /**
   * List of column/field names
   */
  columns: string[];

  /**
   * Column types mapping
   */
  columnTypes: Record<string, DataType>;

  /**
   * Primary key column(s)
   */
  primaryKeys?: string[];

  /**
   * Nullable columns
   */
  nullableColumns?: string[];
}

/**
 * Supported data types
 */
export type DataType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "datetime"
  | "json"
  | "unknown";

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /**
   * Page number (1-indexed)
   */
  page: number;

  /**
   * Number of items per page
   */
  pageSize: number;
}

/**
 * Pagination result metadata
 */
export interface PaginationMeta {
  /**
   * Current page number
   */
  page: number;

  /**
   * Number of items per page
   */
  pageSize: number;

  /**
   * Total number of items
   */
  total: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a next page
   */
  hasNext: boolean;

  /**
   * Whether there is a previous page
   */
  hasPrevious: boolean;
}

/**
 * Standard result type for connector operations
 */
export interface ConnectorResult<TData, TMeta = unknown> {
  /**
   * The fetched data
   */
  data: TData;

  /**
   * Optional metadata about the result
   */
  meta?: TMeta;

  /**
   * Cache key for the result (if applicable)
   */
  cacheKey?: string;
}

/**
 * Paginated result type
 */
export type PaginatedResult<TData> = ConnectorResult<TData[], PaginationMeta>;

/**
 * Error types for connector operations
 */
export class ConnectorError extends Error {
  constructor(
    message: string,
    public code: ConnectorErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = "ConnectorError";
  }
}

/**
 * Standard error codes for connectors
 */
export type ConnectorErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "PARSING_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMIT_EXCEEDED"
  | "INVALID_REQUEST"
  | "UNSUPPORTED_FORMAT"
  | "UNKNOWN_ERROR";

/**
 * Result of a health check
 */
export interface HealthCheckResult {
  /**
   * Whether the connector is healthy
   */
  healthy: boolean;

  /**
   * Health status message
   */
  message: string;

  /**
   * Optional additional details
   */
  details?: Record<string, unknown>;

  /**
   * Timestamp of the health check
   */
  timestamp: string;
}

/**
 * Connector capabilities
 */
export interface ConnectorCapabilities {
  /**
   * Whether the connector supports pagination
   */
  supportsPagination: boolean;

  /**
   * Whether the connector supports filtering
   */
  supportsFiltering: boolean;

  /**
   * Whether the connector supports sorting
   */
  supportsSorting: boolean;

  /**
   * Whether the connector supports real-time updates
   */
  supportsRealtime: boolean;

  /**
   * Supported data formats
   */
  supportedFormats: string[];
}

/**
 * Generic data connector interface
 *
 * All connectors must implement this interface to provide a consistent
 * API for fetching data from different sources.
 */
export interface IDataConnector<TConfig extends BaseConnectorConfig = BaseConnectorConfig> {
  /**
   * Connector configuration
   */
  readonly config: TConfig;

  /**
   * Connector capabilities
   */
  readonly capabilities: ConnectorCapabilities;

  /**
   * Initialize the connector
   *
   * @returns Promise that resolves when initialization is complete
   */
  initialize?(): Promise<void>;

  /**
   * Check if the connector is healthy
   *
   * @returns Health check result
   */
  healthCheck?(): Promise<HealthCheckResult>;

  /**
   * Fetch all data from the source
   *
   * @returns Promise resolving to the fetched data
   * @throws ConnectorError if the fetch fails
   */
  fetch(): Promise<ConnectorResult<unknown[]>>;

  /**
   * Fetch paginated data
   *
   * @param params - Pagination parameters
   * @returns Promise resolving to paginated data
   * @throws ConnectorError if the fetch fails
   */
  fetchPaginated?(params: PaginationParams): Promise<PaginatedResult<unknown>>;

  /**
   * Get the schema/metadata for the data source
   *
   * @returns Promise resolving to the data schema
   * @throws ConnectorError if schema detection fails
   */
  getSchema?(): Promise<DataSchema>;

  /**
   * Test the connection to the data source
   *
   * @returns Promise resolving to true if connection succeeds
   * @throws ConnectorError if the connection test fails
   */
  testConnection?(): Promise<boolean>;

  /**
   * Clean up resources
   *
   * Called when the connector is no longer needed
   */
  destroy?(): Promise<void> | void;
}

/**
 * Type for a connector factory function
 */
export type ConnectorFactory<TConfig extends BaseConnectorConfig> = (
  config: TConfig
) => IDataConnector<TConfig>;
