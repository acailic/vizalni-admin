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
 * Maximum allowed length for a single CSV field (100KB)
 *
 * @internal
 */
const MAX_FIELD_LENGTH = 100000;

/**
 * Configuration for the CSV connector
 *
 * @public
 */
export interface CsvConfig extends BaseConnectorConfig {
  /** CSV delimiter character (default: comma ",") */
  delimiter?: string;
  /** Whether first row contains headers (default: true) */
  header?: boolean;
}

/**
 * Parse CSV text into rows
 *
 * @param text - Raw CSV text to parse
 * @param delimiter - Character used to separate fields
 * @returns Array of rows, each row being an array of string values
 * @throws {@link ConnectorParseError} if a field exceeds MAX_FIELD_LENGTH
 *
 * @internal
 */
function parseCsv(text: string, delimiter = ","): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line, lineIndex) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
        if (current.length > MAX_FIELD_LENGTH) {
          throw new ConnectorParseError(
            "csv://inline",
            `CSV field exceeds maximum length of ${MAX_FIELD_LENGTH} characters at line ${lineIndex + 1}`
          );
        }
      }
    }
    result.push(current);
    return result;
  });
}

/**
 * Infer field type from sample values
 *
 * @param values - Array of string values to analyze
 * @returns The inferred field type
 *
 * @internal
 */
function inferFieldType(values: string[]): FieldSchema["type"] {
  const sample = values.slice(0, 100);

  // Check if all values are numbers
  const allNumbers = sample.every((v) => v === "" || !isNaN(Number(v)));
  if (allNumbers && sample.some((v) => v !== "")) {
    return "number";
  }

  // Check if all values are dates (ISO format)
  const dateRegex = /^\d{4}-\d{2}-\d{2}/;
  const allDates = sample.every((v) => v === "" || dateRegex.test(v));
  if (allDates && sample.some((v) => v !== "")) {
    return "date";
  }

  return "string";
}

/**
 * Convert string value to appropriate type based on schema
 *
 * @param value - String value to convert
 * @param type - Target type for conversion
 * @returns Converted value
 *
 * @internal
 */
function convertValue(
  value: string,
  type: FieldSchema["type"]
): string | number {
  if (value === "") return "";
  if (type === "number") return Number(value);
  return value;
}

/**
 * CSV data connector
 *
 * @remarks
 * Fetches CSV data from a URL and parses it into structured data.
 * Supports automatic type inference for numeric and date fields.
 *
 * @example
 * ```typescript
 * import { csvConnector } from "@vizualni/connectors";
 *
 * const result = await csvConnector.fetch({
 *   url: "https://example.com/data.csv",
 *   delimiter: ",",
 *   header: true,
 * });
 *
 * console.log(result.data);    // Array of parsed records
 * console.log(result.schema);  // Inferred field types
 * ```
 *
 * @public
 */
export const csvConnector: DataConnector<CsvConfig> = {
  type: "csv",

  async fetch(config: CsvConfig): Promise<ConnectorResult> {
    const { url, delimiter = ",", header = true } = config;

    // Validate configuration
    if (!url || url.trim() === "") {
      throw new ConnectorValidationError(
        url || "",
        "url",
        "URL cannot be empty"
      );
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new ConnectorFetchError(url, response.status, response.statusText);
    }

    const text = await response.text();

    let rows: string[][];
    try {
      rows = parseCsv(text, delimiter);
    } catch (error) {
      if (error instanceof ConnectorParseError) {
        // Re-throw with the actual URL
        throw new ConnectorParseError(url, error.reason, { cause: error });
      }
      throw error;
    }

    if (rows.length === 0) {
      return { data: [], schema: { fields: [] } };
    }

    const headers = header ? rows[0] : rows[0].map((_, i) => `col${i}`);
    const dataRows = header ? rows.slice(1) : rows;

    // Infer field types
    const fields: FieldSchema[] = headers.map((header, colIndex) => {
      const values = dataRows.map((row) => row[colIndex] ?? "");
      const type = inferFieldType(values);
      return { name: header, type };
    });

    // Parse data with type conversion
    const data: Datum[] = dataRows.map((row) => {
      const obj: Datum = {};
      fields.forEach((field, colIndex) => {
        const value = row[colIndex] ?? "";
        obj[field.name] = convertValue(value, field.type);
      });
      return obj;
    });

    return {
      data,
      schema: { fields },
    };
  },
};
