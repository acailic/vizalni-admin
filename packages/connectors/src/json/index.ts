import type {
  DataConnector,
  ConnectorResult,
  DataSchema,
  FieldSchema,
} from "../types";
import type { Datum } from "@vizualni/core";

export interface JsonConfig {
  /** URL to fetch JSON from */
  url: string;
  /** Path to extract data array from response (e.g., "data.items") */
  dataPath?: string;
  /** HTTP headers to send */
  headers?: Record<string, string>;
}

/**
 * Get value from nested object by path
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
 * Infer field type from value
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
 * Infer schema from data
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
 */
export const jsonConnector: DataConnector<JsonConfig> = {
  type: "json",

  async fetch(config: JsonConfig): Promise<ConnectorResult> {
    const { url, dataPath, headers } = config;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch JSON: ${response.status} ${response.statusText}`
      );
    }

    let json = await response.json();

    // Extract data from nested path if specified
    if (dataPath) {
      json = getValueByPath(json, dataPath);
    }

    // Ensure we have an array
    const data: Datum[] = Array.isArray(json) ? json : [json];

    // Infer schema
    const schema = inferSchema(data);

    return { data, schema };
  },
};
