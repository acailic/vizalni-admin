import type { Datum } from "@vizualni/core";

// ============================================================================
// Error Options (for ES2020 compatibility)
// ============================================================================

/**
 * Options for error construction
 *
 * @internal
 */
interface ErrorOptions {
  /** The cause of the error */
  cause?: unknown;
}

/**
 * Field type enumeration for data schemas
 *
 * @remarks
 * These types represent the primitive data types that connectors can
 * infer and return in the schema.
 */
export type FieldType = "string" | "number" | "date" | "boolean";

/**
 * Schema for a single field/column in a dataset
 *
 * @public
 */
export interface FieldSchema {
  /** Field name/key in data */
  name: string;
  /** Data type of the field */
  type: FieldType;
  /** Human-readable title for display purposes */
  title?: string;
  /** Description of what this field represents */
  description?: string;
}

/**
 * Schema describing the structure of a dataset
 *
 * @public
 */
export interface DataSchema {
  /** Array of field definitions */
  fields: FieldSchema[];
}

/**
 * Result from a connector fetch operation
 *
 * @typeParam TMeta - Optional metadata type returned by the connector
 *
 * @public
 */
export interface ConnectorResult<TMeta = unknown> {
  /** Array of data records */
  data: Datum[];
  /** Schema describing the data structure */
  schema: DataSchema;
  /** Optional metadata from the source (e.g., pagination info, timestamps) */
  meta?: TMeta;
}

/**
 * Configuration for inferring schema from data
 *
 * @public
 */
export interface SchemaInferenceOptions {
  /** Number of rows to sample for type inference (default: 100) */
  sampleSize?: number;
}

/**
 * Base configuration interface for all connectors
 *
 * @remarks
 * All connector configurations must include a URL property.
 * This provides a common base for identifying data sources.
 *
 * @public
 */
export interface BaseConnectorConfig {
  /** URL or path to the data source */
  url: string;
}

/**
 * Generic data connector interface
 *
 * @remarks
 * This interface defines the contract that all data connectors must implement.
 * Connectors are responsible for fetching data from external sources and
 * returning it in a standardized format with an inferred schema.
 *
 * @typeParam TConfig - Configuration type for the connector (must include url)
 * @typeParam TMeta - Optional metadata type returned with the result
 *
 * @example
 * ```typescript
 * import type { DataConnector, ConnectorResult } from "@vizualni/connectors";
 *
 * const myConnector: DataConnector<{ url: string; apiKey: string }> = {
 *   type: "my-connector",
 *   async fetch(config) {
 *     const response = await fetch(config.url, {
 *       headers: { "X-API-Key": config.apiKey }
 *     });
 *     if (!response.ok) {
 *       throw new ConnectorFetchError(
 *         config.url,
 *         response.status,
 *         response.statusText
 *       );
 *     }
 *     const data = await response.json();
 *     return { data, schema: { fields: [] } };
 *   }
 * };
 * ```
 *
 * @public
 */
export interface DataConnector<
  TConfig extends BaseConnectorConfig = BaseConnectorConfig,
  TMeta = unknown,
> {
  /**
   * Connector type identifier
   *
   * @remarks
   * A unique string identifying this connector type (e.g., "csv", "json")
   */
  readonly type: string;

  /**
   * Fetch data from the source
   *
   * @param config - Configuration options for the fetch operation
   * @returns Promise resolving to the connector result with data and schema
   * @throws {@link ConnectorFetchError} if the fetch fails
   * @throws {@link ConnectorParseError} if parsing the response fails
   * @throws {@link ConnectorValidationError} if the configuration is invalid
   */
  fetch(config: TConfig): Promise<ConnectorResult<TMeta>>;

  /**
   * Get schema without fetching all data
   *
   * @remarks
   * This optional method allows fetching just the schema without
   * downloading the full dataset. Useful for previewing data structure.
   *
   * @param config - Configuration options for the schema fetch
   * @returns Promise resolving to the data schema
   */
  getSchema?(config: TConfig): Promise<DataSchema>;
}

/**
 * Options for the useConnector hook (React integration)
 *
 * @public
 */
export interface UseConnectorOptions<TConfig extends BaseConnectorConfig> {
  /** Connector instance to use */
  connector: DataConnector<TConfig>;
  /** Connector configuration */
  config: TConfig;
  /** Auto-fetch on mount (default: true) */
  enabled?: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Base error class for all connector errors
 *
 * @remarks
 * This is the base class for errors thrown by connectors.
 * All connector-specific errors extend this class.
 *
 * @public
 */
export abstract class ConnectorError extends Error {
  /**
   * The URL that was being accessed when the error occurred
   */
  readonly url: string;

  constructor(url: string, message: string, options?: ErrorOptions) {
    super(message);
    this.name = "ConnectorError";
    this.url = url;
    // Manually set cause for ES2020 compatibility
    if (options?.cause !== undefined) {
      Object.assign(this, { cause: options.cause });
    }
  }
}

/**
 * Error thrown when a connector fails to fetch data from the source
 *
 * @remarks
 * This error is thrown when the HTTP request fails or returns
 * a non-successful status code.
 *
 * @public
 *
 * @example
 * ```typescript
 * try {
 *   await csvConnector.fetch({ url: "https://example.com/data.csv" });
 * } catch (error) {
 *   if (error instanceof ConnectorFetchError) {
 *     console.error(`Failed to fetch from ${error.url}`);
 *     console.error(`Status: ${error.statusCode} ${error.statusText}`);
 *   }
 * }
 * ```
 */
export class ConnectorFetchError extends ConnectorError {
  /**
   * HTTP status code returned by the server
   */
  readonly statusCode: number;
  /**
   * HTTP status text returned by the server
   */
  readonly statusText: string;

  constructor(url: string, statusCode: number, statusText: string) {
    super(url, `Failed to fetch from ${url}: ${statusCode} ${statusText}`);
    this.name = "ConnectorFetchError";
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

/**
 * Error thrown when a connector fails to parse data from the source
 *
 * @remarks
 * This error is thrown when the data cannot be parsed, such as
 * invalid CSV format, malformed JSON, or data exceeding size limits.
 *
 * @public
 *
 * @example
 * ```typescript
 * try {
 *   await csvConnector.fetch({ url: "https://example.com/data.csv" });
 * } catch (error) {
 *   if (error instanceof ConnectorParseError) {
 *     console.error(`Failed to parse data from ${error.url}`);
 *     console.error(`Reason: ${error.reason}`);
 *   }
 * }
 * ```
 */
export class ConnectorParseError extends ConnectorError {
  /**
   * Human-readable reason for the parse failure
   */
  readonly reason: string;

  constructor(url: string, reason: string, options?: ErrorOptions) {
    super(url, `Failed to parse data from ${url}: ${reason}`, options);
    this.name = "ConnectorParseError";
    this.reason = reason;
  }
}

/**
 * Error thrown when a connector configuration is invalid
 *
 * @remarks
 * This error is thrown during configuration validation, before
 * any network requests are made.
 *
 * @public
 *
 * @example
 * ```typescript
 * try {
 *   await csvConnector.fetch({ url: "" }); // Empty URL
 * } catch (error) {
 *   if (error instanceof ConnectorValidationError) {
 *     console.error(`Invalid configuration: ${error.field}`);
 *     console.error(`Details: ${error.details}`);
 *   }
 * }
 * ```
 */
export class ConnectorValidationError extends ConnectorError {
  /**
   * The field that failed validation
   */
  readonly field: string;
  /**
   * Detailed validation error message
   */
  readonly details: string;

  constructor(url: string, field: string, details: string) {
    super(url, `Invalid configuration for ${url}: ${field} - ${details}`);
    this.name = "ConnectorValidationError";
    this.field = field;
    this.details = details;
  }
}
