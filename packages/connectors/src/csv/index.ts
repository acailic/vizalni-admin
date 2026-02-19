import type {
  DataConnector,
  ConnectorResult,
  DataSchema,
  FieldSchema,
} from "../types";
import type { Datum } from "@vizualni/core";

export interface CsvConfig {
  /** URL to fetch CSV from */
  url: string;
  /** CSV delimiter (default: comma) */
  delimiter?: string;
  /** Whether first row contains headers (default: true) */
  header?: boolean;
}

/**
 * Parse CSV text into rows
 */
function parseCsv(text: string, delimiter = ","): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line) => {
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
      }
    }
    result.push(current);
    return result;
  });
}

/**
 * Infer field type from values
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
 * Convert string value to appropriate type
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
 */
export const csvConnector: DataConnector<CsvConfig> = {
  type: "csv",

  async fetch(config: CsvConfig): Promise<ConnectorResult> {
    const { url, delimiter = ",", header = true } = config;

    const response = await fetch(url);
    const text = await response.text();
    const rows = parseCsv(text, delimiter);

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
