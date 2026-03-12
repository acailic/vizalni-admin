import type {
  DataConnector,
  ConnectorResult,
  DataSchema,
  FieldSchema,
  BaseConnectorConfig,
} from "../types";
import {
  ConnectorFetchError,
  ConnectorParseError,
  ConnectorValidationError,
} from "../types";
import type { Datum } from "@vizualni/core";

/**
 * Configuration for the JSON connector
 *
 * @public
 */
export interface JsonConfig extends BaseConnectorConfig {
  /** Path to extract data array from response (e.g., "data.items") */
  dataPath?: string;
  /** HTTP headers to send with the request */
  headers?: Record<string, string>;
}

/**
 * Get value from nested object by dot-separated path
 *
 * @param obj - Object to traverse
 * @param path - Dot-separated path (e.g., "data.items")
 * @returns Value at the path, or undefined if not found
 *
 * @internal
 */
function getValueByPath(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Infer field type from a single value
 *
 * @param value - Value to analyze
 * @returns The inferred field type
 *
 * @internal
 */
function inferType(value: unknown): FieldSchema["type"] {
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (value instanceof Date) return "date";
  if (typeof value === "string") {
    // Check for ISO date format
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "date";
    // Check for number string
    if (!isNaN(Number(value))) return "number";
  }
  return "string";
}

/**
 * Infer schema from array of data records
 *
 * @param data - Array of data records to analyze
 * @returns Inferred data schema
 *
 * @internal
 */
function inferSchema(data: Datum[]): DataSchema {
  if (data.length === 0) {
    return { fields: [] };
  }

  const fieldNames = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => fieldNames.add(key));
  });

  const fields: FieldSchema[] = Array.from(fieldNames).map((name) => {
    // Sample values to infer type
    const sample = data.slice(0, 100);
    const values = sample
      .map((row) => row[name])
      .filter((v) => v !== null && v !== undefined);

    let type: FieldSchema["type"] = "string";
    if (values.length > 0) {
      type = inferType(values[0]);
    }

    return { name, type };
  });

  return { fields };
}

/**
 * JSON data connector
 *
 * @remarks
 * Fetches JSON data from a URL and converts it to structured data.
 * Supports extracting nested data arrays using dot-separated paths.
 *
 * @example
 * ```typescript
 * import { jsonConnector } from "@vizualni/connectors";
 *
 * // Simple JSON array
 * const result = await jsonConnector.fetch({
 *   url: "https://api.example.com/users",
 * });
 *
 * // Nested data extraction
 * const nested = await jsonConnector.fetch({
 *   url: "https://api.example.com/data",
 *   dataPath: "results.items",
 *   headers: {
 *     Authorization: "Bearer token",
 *   },
 * });
 * ```
 *
 * @public
 */
export const jsonConnector: DataConnector<JsonConfig> = {
  type: "json",

  async fetch(config: JsonConfig): Promise<ConnectorResult> {
    const { url, dataPath, headers } = config;

    // Validate configuration
    if (!url || url.trim() === "") {
      throw new ConnectorValidationError(
        url || "",
        "url",
        "URL cannot be empty"
      );
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new ConnectorFetchError(url, response.status, response.statusText);
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch (error) {
      throw new ConnectorParseError(url, "Response is not valid JSON", {
        cause: error,
      });
    }

    // Extract data from nested path if specified
    if (dataPath) {
      json = getValueByPath(json, dataPath);
      if (json === undefined) {
        throw new ConnectorParseError(
          url,
          `Data path "${dataPath}" not found in response`
        );
      }
    }

    // Ensure we have an array
    const data: Datum[] = Array.isArray(json) ? json : [json];

    // Infer schema
    const schema = inferSchema(data);

    return { data, schema };
  },
};
