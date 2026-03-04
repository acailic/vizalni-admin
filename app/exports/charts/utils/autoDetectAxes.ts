/**
 * Smart Data Detection Utility
 *
 * Automatically detects x-axis, y-axis, and series keys from data arrays.
 * Enables zero-config chart rendering where users only pass `data`.
 */

export interface DataPoint {
  [key: string]: string | number | boolean | null | undefined;
}

export interface DetectionResult {
  /** Detected x-axis key (typically first string/date column) */
  xKey: string;
  /** Detected y-axis key(s) (first numeric value or all numeric values) */
  yKeys: string[];
  /** Whether multiple series were detected */
  isMultiSeries: boolean;
  /** Detected data type of x-axis */
  xAxisType: "string" | "date" | "number";
}

/**
 * Column name patterns that suggest x-axis data
 */
const X_AXIS_PATTERNS = [
  "date",
  "time",
  "year",
  "month",
  "day",
  "timestamp",
  "period",
  "label",
  "name",
  "category",
];

/**
 * Check if a value looks like a date
 */
function isDateLike(value: unknown): boolean {
  if (value instanceof Date) return true;
  if (typeof value === "string") {
    // Check for common date formats
    return (
      /^\d{4}-\d{2}-\d{2}/.test(value) || // ISO date
      /^\d{1,2}\/\d{1,2}\/\d{4}/.test(value) || // US date
      /^\d{4}$/.test(value) // Year only
    );
  }
  return false;
}

/**
 * Check if a value is numeric (string number or number type)
 */
function isNumeric(value: unknown): boolean {
  if (typeof value === "number") return !isNaN(value);
  if (typeof value === "string") {
    return !isNaN(Number(value)) && value.trim() !== "";
  }
  return false;
}

/**
 * Detect the best x-axis key from data
 */
function detectXKey(data: DataPoint[]): string {
  if (data.length === 0) {
    throw new Error("Cannot detect axes from empty data array");
  }

  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  // First, look for keys matching x-axis patterns
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if (X_AXIS_PATTERNS.some((pattern) => lowerKey.includes(pattern))) {
      return key;
    }
  }

  // Otherwise, use the first string column
  for (const key of keys) {
    const value = firstRow[key];
    if (typeof value === "string" && !isNumeric(value)) {
      return key;
    }
  }

  // Fallback to first key
  return keys[0];
}

/**
 * Detect all numeric y-axis keys from data
 */
function detectYKeys(data: DataPoint[], xKey: string): string[] {
  if (data.length === 0) {
    throw new Error("Cannot detect axes from empty data array");
  }

  const firstRow = data[0];
  const keys = Object.keys(firstRow).filter((k) => k !== xKey);

  // Find all numeric columns
  const numericKeys = keys.filter((key) => isNumeric(firstRow[key]));

  if (numericKeys.length === 0) {
    throw new Error(
      `No numeric values found for y-axis. Available keys: ${Object.keys(firstRow).join(", ")}`
    );
  }

  return numericKeys;
}

/**
 * Detect the type of x-axis data
 */
function detectXAxisType(
  data: DataPoint[],
  xKey: string
): "string" | "date" | "number" {
  if (data.length === 0) return "string";

  const firstValue = data[0][xKey];

  if (isDateLike(firstValue)) return "date";
  if (isNumeric(firstValue)) return "number";
  return "string";
}

/**
 * Auto-detect chart configuration from data array
 *
 * @param data - Array of data objects
 * @returns Detected x-axis, y-axis(s), and metadata
 *
 * @example
 * ```ts
 * const data = [
 *   { year: '2020', temperature: 11, rainfall: 650 },
 *   { year: '2021', temperature: 11.3, rainfall: 680 },
 * ];
 *
 * const result = autoDetectAxes(data);
 * // { xKey: 'year', yKeys: ['temperature', 'rainfall'], isMultiSeries: true, xAxisType: 'string' }
 * ```
 */
export function autoDetectAxes(data: DataPoint[]): DetectionResult {
  // Validate input
  if (!Array.isArray(data)) {
    throw new TypeError(
      `Expected data to be an array, received: ${typeof data}. ` +
        `Example: <Line data={[{ year: '2020', value: 100 }]} />`
    );
  }

  if (data.length === 0) {
    throw new Error(
      "Data array is empty. Please provide data with at least one item. " +
        `Example: <Line data={[{ year: '2020', value: 100 }]} />`
    );
  }

  const firstRow = data[0];

  // Check if first row is an object
  if (typeof firstRow !== "object" || firstRow === null) {
    throw new Error(
      `Expected data items to be objects, received: ${typeof firstRow}. ` +
        `Example: <Line data={[{ year: '2020', value: 100 }]} />`
    );
  }

  const keys = Object.keys(firstRow);

  if (keys.length === 0) {
    throw new Error(
      "Data objects have no properties. Each item should have at least one key. " +
        `Example: <Line data={[{ year: '2020', value: 100 }]} />`
    );
  }

  // Detect x-axis
  const xKey = detectXKey(data);

  // Detect y-axis(s)
  const yKeys = detectYKeys(data, xKey);

  // Detect x-axis type
  const xAxisType = detectXAxisType(data, xKey);

  return {
    xKey,
    yKeys,
    isMultiSeries: yKeys.length > 1,
    xAxisType,
  };
}

/**
 * Format a helpful error message with data shape hints
 */
export function getShapeHint(data: unknown[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return "data={[{ year: '2020', value: 100 }]}";
  }

  const firstItem = data[0];
  if (typeof firstItem === "object" && firstItem !== null) {
    const keys = Object.keys(firstItem);
    const example = keys.map((k) => `${k}: ${typeof firstItem[k]}`).join(", ");
    return `data={[{ ${example} }]}`;
  }

  return "data={[{ year: '2020', value: 100 }]}";
}
