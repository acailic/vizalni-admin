/**
 * CSV URL Data Connector
 *
 * Fetches and parses CSV data from a URL.
 * Supports various CSV formats and provides schema detection.
 *
 * @packageDocumentation
 */

import { createLogger } from "../../lib/logger";

import { ConnectorError } from "./types";

import type {
  ConnectorCapabilities,
  ConnectorErrorCode,
  DataSchema,
  DataType,
  HealthCheckResult,
} from "./types";
import type { BaseConnectorConfig, IDataConnector } from "./types";

/**
 * Configuration for CSV URL connector
 */
export interface CsvUrlConnectorConfig extends BaseConnectorConfig {
  /**
   * URL to fetch the CSV from
   */
  url: string;

  /**
   * CSV delimiter character
   * @default ","
   */
  delimiter?: string;

  /**
   * Whether the first row contains headers
   * @default true
   */
  hasHeader?: boolean;

  /**
   * Character used for quoting
   * @default '"'
   */
  quoteChar?: string;

  /**
   * Character used for escaping
   * @default '"'
   */
  escapeChar?: string;

  /**
   * Skip empty lines
   * @default true
   */
  skipEmptyLines?: boolean;

  /**
   * Maximum file size in bytes (0 = no limit)
   * @default 10485760 (10MB)
   */
  maxFileSize?: number;
}

/**
 * Parsed CSV row data
 */
export type CsvRow = Record<string, string | number | boolean | null>;

/**
 * CSV fetch metadata
 */
interface CsvFetchMetadata {
  source: string;
  rowCount: number;
  fetchedAt: string;
}

/**
 * CSV fetch result with schema
 */
interface CsvFetchResult {
  data: CsvRow[];
  schema: DataSchema & { fields: SchemaField[] };
  metadata: CsvFetchMetadata;
  cacheKey?: string;
}

/**
 * Schema field definition
 */
interface SchemaField {
  name: string;
  type: DataType;
  required: boolean;
}

/**
 * Schema detection result
 */
interface SchemaDetection {
  columns: string[];
  columnTypes: Record<string, DataType>;
  nullableColumns: string[];
  fields: SchemaField[];
}

/**
 * CSV URL Connector Implementation
 *
 * Fetches CSV data from a URL, parses it, and provides schema detection.
 */
export class CsvUrlConnector implements IDataConnector<CsvUrlConnectorConfig> {
  readonly config: Required<CsvUrlConnectorConfig>;
  readonly capabilities: ConnectorCapabilities;

  // Public properties for test compatibility
  readonly id: string;
  readonly name: string;
  readonly delimiter: string;
  readonly quoteChar: string;
  readonly hasHeader: boolean;

  private cachedData?: CsvRow[];
  private cachedSchema?: DataSchema;
  private logger = createLogger({ component: "CsvUrlConnector" });

  constructor(config: CsvUrlConnectorConfig) {
    this.id = config.id;
    this.name = config.name;
    this.delimiter = config.delimiter ?? ",";
    this.quoteChar = config.quoteChar ?? '"';
    this.hasHeader = config.hasHeader ?? true;

    this.config = {
      id: config.id,
      name: config.name,
      description: config.description ?? "",
      url: config.url,
      timeout: config.timeout ?? 10000,
      maxRetries: config.maxRetries ?? 3,
      debug: config.debug ?? false,
      delimiter: config.delimiter ?? ",",
      hasHeader: config.hasHeader ?? true,
      quoteChar: config.quoteChar ?? '"',
      escapeChar: config.escapeChar ?? '"',
      skipEmptyLines: config.skipEmptyLines ?? true,
      maxFileSize: config.maxFileSize ?? 10485760, // 10MB default
    };

    this.capabilities = {
      supportsPagination: false,
      supportsFiltering: false,
      supportsSorting: false,
      supportsRealtime: false,
      supportedFormats: ["csv", "text/csv"],
    };
  }

  /**
   * Initialize the connector by fetching and parsing the CSV
   */
  async initialize(): Promise<void> {
    if (this.config.debug) {
      this.logger.debug("Initializing", { connectorId: this.config.id });
    }

    await this.fetch();
  }

  /**
   * Health check for the connector
   */
  async healthCheck(): Promise<
    HealthCheckResult & { status: string; latency?: number; error?: string }
  > {
    const startTime = Date.now();
    try {
      const response = await this.fetchWithTimeout(this.config.url, {
        method: "HEAD",
      });

      const contentType = response.headers.get("content-type") || "";
      const contentLength = response.headers.get("content-length");
      const size = contentLength ? parseInt(contentLength, 10) : 0;

      const isCsv =
        contentType.includes("csv") ||
        contentType.includes("text/plain") ||
        this.config.url.endsWith(".csv");

      const healthy = response.ok && isCsv;
      const latency = Date.now() - startTime;

      return {
        status: healthy ? "healthy" : "unhealthy",
        healthy,
        message: healthy
          ? "CSV URL is accessible"
          : `CSV URL is ${response.ok ? "not CSV format" : "not accessible"}`,
        details: {
          url: this.config.url,
          statusCode: response.status,
          contentType,
          size,
          latency,
        },
        timestamp: new Date().toISOString(),
        latency,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        status: "unhealthy",
        healthy: false,
        message: `Health check failed: ${errorMessage}`,
        error: errorMessage,
        details: {
          url: this.config.url,
          error: errorMessage,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Fetch and parse the CSV data
   */
  async fetch(): Promise<CsvFetchResult> {
    if (this.cachedData) {
      const schema = await this.buildSchema(this.cachedData);
      return {
        data: this.cachedData,
        schema,
        metadata: {
          source: this.config.url,
          rowCount: this.cachedData.length,
          fetchedAt: new Date().toISOString(),
        },
        cacheKey: this.getCacheKey(),
      };
    }

    try {
      const response = await this.fetchWithTimeout(this.config.url);

      // Check content length
      const contentLength = response.headers?.get("content-length");
      if (contentLength) {
        const size = parseInt(contentLength, 10);
        if (this.config.maxFileSize > 0 && size > this.config.maxFileSize) {
          throw this.createError(
            "INVALID_REQUEST",
            `CSV file size (${size} bytes) exceeds maximum allowed size (${this.config.maxFileSize} bytes)`
          );
        }
      }

      const csvText = await response.text();

      // Check actual size if content-length was not available
      if (
        this.config.maxFileSize > 0 &&
        csvText.length > this.config.maxFileSize
      ) {
        throw this.createError(
          "INVALID_REQUEST",
          `CSV file size (${csvText.length} bytes) exceeds maximum allowed size (${this.config.maxFileSize} bytes)`
        );
      }

      const data = this.parseCsv(csvText);
      const schema = await this.buildSchema(data);

      this.cachedData = data;
      this.cachedSchema = schema;

      return {
        data,
        schema,
        metadata: {
          source: this.config.url,
          rowCount: data.length,
          fetchedAt: new Date().toISOString(),
        },
        cacheKey: this.getCacheKey(),
      };
    } catch (error) {
      if (error instanceof ConnectorError) {
        throw error;
      }

      // Determine error code based on error type
      let code: ConnectorErrorCode = "UNKNOWN_ERROR";
      if (error instanceof Error) {
        const message = (error.message ?? "").toLowerCase();
        if (error.name === "AbortError" || message.includes("timeout")) {
          code = "TIMEOUT";
        } else if (message.includes("network") || message.includes("fetch")) {
          code = "NETWORK_ERROR";
        }
      }

      const errorMessage =
        error instanceof Error
          ? (error.message ?? "Unknown error")
          : "Unknown error";
      throw this.createError(
        code,
        `Failed to fetch CSV: ${errorMessage}`,
        error
      );
    }
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = (await fetch(url, {
        ...options,
        signal: controller.signal,
      })) as Response | undefined;

      if (!response) {
        throw this.createError("NETWORK_ERROR", "Fetch returned no response");
      }

      if (!response.ok) {
        throw this.createError(
          "NOT_FOUND",
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw this.createError(
          "TIMEOUT",
          `Request timeout after ${this.config.timeout}ms`
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse CSV text into array of objects
   */
  private parseCsv(csvText: string): CsvRow[] {
    const lines = csvText.split(/\r?\n/);
    const rows: CsvRow[] = [];

    if (lines.length === 0) {
      throw this.createError("PARSING_ERROR", "CSV is empty");
    }

    // Parse header row
    const headerIndex = 0;
    const headers = this.parseLine(lines[headerIndex]);

    if (headers.length === 0) {
      throw this.createError("PARSING_ERROR", "CSV has no columns");
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Skip completely empty lines (after trim) if configured
      const trimmedLine = line.trim();
      if (this.config.skipEmptyLines && trimmedLine.length === 0) {
        continue;
      }

      const values = this.parseLine(trimmedLine);

      // Skip rows with mismatched column count
      if (values.length !== headers.length) {
        if (this.config.debug) {
          this.logger.warn("Row has mismatched column count", {
            connectorId: this.config.id,
            row: i,
            actualCount: values.length,
            expectedCount: headers.length,
          });
        }
        continue;
      }

      const row: CsvRow = {};
      headers.forEach((header, index) => {
        const value = this.parseValue(values[index]);
        row[header] = value;
      });

      rows.push(row);
    }

    return rows;
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  private parseLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === this.config.quoteChar) {
        if (inQuotes && nextChar === this.config.quoteChar) {
          // Escaped quote
          current += this.config.quoteChar;
          i++;
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === this.config.delimiter && !inQuotes) {
        // Field delimiter
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    // Add the last value
    values.push(current.trim());

    return values;
  }

  /**
   * Parse a value to its appropriate type
   */
  private parseValue(value: string): string | number | boolean | null {
    const trimmed = value.trim();

    // Empty string or "null" string becomes null
    if (trimmed === "" || trimmed.toLowerCase() === "null") {
      return null;
    }

    // Boolean
    if (trimmed.toLowerCase() === "true") {
      return true;
    }
    if (trimmed.toLowerCase() === "false") {
      return false;
    }

    // Number
    if (/^-?\d+\.?\d*$/.test(trimmed)) {
      return parseFloat(trimmed);
    }

    // String
    return trimmed;
  }

  /**
   * Build schema from CSV data (includes fields array)
   */
  private async buildSchema(
    data: CsvRow[]
  ): Promise<DataSchema & { fields: SchemaField[] }> {
    if (data.length === 0) {
      return {
        columns: [],
        columnTypes: {},
        nullableColumns: [],
        fields: [],
      };
    }

    const detection = this.detectSchema(data);

    const fields: SchemaField[] = detection.columns.map((column) => ({
      name: column,
      type: detection.columnTypes[column],
      required: !detection.nullableColumns.includes(column),
    }));

    return {
      columns: detection.columns,
      columnTypes: detection.columnTypes,
      nullableColumns: detection.nullableColumns,
      fields,
    };
  }

  /**
   * Detect schema from CSV data
   */
  async getSchema(): Promise<DataSchema> {
    if (this.cachedSchema) {
      return this.cachedSchema;
    }

    if (!this.cachedData) {
      await this.fetch();
    }

    if (!this.cachedData || this.cachedData.length === 0) {
      return {
        columns: [],
        columnTypes: {},
        nullableColumns: [],
      };
    }

    const detection = this.detectSchema(this.cachedData);

    this.cachedSchema = {
      columns: detection.columns,
      columnTypes: detection.columnTypes,
      nullableColumns: detection.nullableColumns,
    };

    return this.cachedSchema;
  }

  /**
   * Detect schema from parsed CSV data
   */
  private detectSchema(data: CsvRow[]): SchemaDetection {
    const columns = Object.keys(data[0]);
    const columnTypes: Record<string, DataType> = {};
    const nullableColumns: string[] = [];
    const typeCounts: Record<string, Record<DataType, number>> = {};

    // Initialize type counters
    columns.forEach((col) => {
      typeCounts[col] = {
        string: 0,
        number: 0,
        integer: 0,
        boolean: 0,
        date: 0,
        datetime: 0,
        json: 0,
        unknown: 0,
      };
    });

    // Analyze each row
    data.forEach((row) => {
      columns.forEach((col) => {
        const value = row[col];
        const type = this.getValueType(value);
        typeCounts[col][type]++;
      });
    });

    // Determine most common type for each column
    columns.forEach((col) => {
      const counts = typeCounts[col];
      let maxCount = 0;
      let dominantType: DataType = "unknown";

      Object.entries(counts).forEach(([type, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantType = type as DataType;
        }
      });

      // Normalize integer to number for consistency
      columnTypes[col] =
        (dominantType as any) === "integer" ? "number" : (dominantType as any);

      // Check if column is nullable (has null values)
      const nullCount = data.filter((row) => row[col] === null).length;
      if (nullCount > 0) {
        nullableColumns.push(col);
      }
    });

    // Build fields array
    const fields: SchemaField[] = columns.map((column) => ({
      name: column,
      type: columnTypes[column],
      required: !nullableColumns.includes(column),
    }));

    return {
      columns,
      columnTypes,
      nullableColumns,
      fields,
    };
  }

  /**
   * Get the type of a value
   */
  private getValueType(value: unknown): DataType {
    if (value === null) {
      return "unknown";
    }

    if (typeof value === "boolean") {
      return "boolean";
    }

    if (typeof value === "number") {
      return Number.isInteger(value) ? "integer" : "number";
    }

    if (typeof value === "string") {
      // Try parsing as date
      if (!isNaN(Date.parse(value))) {
        return "date";
      }

      // Try parsing as JSON
      try {
        JSON.parse(value);
        return "json";
      } catch {
        // Not JSON
      }

      return "string";
    }

    return "unknown";
  }

  /**
   * Get connector capabilities
   */
  getCapabilities(): ConnectorCapabilities & {
    pagination: boolean;
    filtering: boolean;
    sorting: boolean;
    realtime: boolean;
  } {
    return {
      ...this.capabilities,
      pagination: false,
      filtering: false,
      sorting: false,
      realtime: false,
    };
  }

  /**
   * Test the connection to the CSV URL
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.healthCheck();
      return result.healthy;
    } catch {
      return false;
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    delete this.cachedData;
    delete this.cachedSchema;
  }

  /**
   * Create a connector error
   */
  private createError(
    code: ConnectorErrorCode,
    message: string,
    details?: unknown
  ): ConnectorError {
    return new ConnectorError(message, code, details);
  }

  /**
   * Get cache key for this connector
   */
  private getCacheKey(): string {
    return `csv-url:${this.config.url}`;
  }
}

/**
 * Factory function to create a CSV URL connector
 */
export function createCsvUrlConnector(
  config: CsvUrlConnectorConfig
): CsvUrlConnector {
  return new CsvUrlConnector(config);
}
