/**
 * Data Transformation Utilities
 *
 * Functions for transforming and processing chart data.
 */

import type { ChartData } from "../charts/types";

/**
 * Sort data array by a key
 */
export function sortByKey<T extends ChartData>(
  data: T[],
  key: string,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal);
    const bStr = String(bVal);
    return order === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
}

/**
 * Filter data array by a predicate
 */
export function filterData<T extends ChartData>(
  data: T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  return data.filter(predicate);
}

/**
 * Group data by a key
 */
export function groupByKey<T extends ChartData>(
  data: T[],
  key: string
): Record<string, T[]> {
  return data.reduce((acc, item) => {
    const groupKey = String(item[key] || "null");
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Aggregate data by a key
 */
export function aggregateByKey<T extends ChartData>(
  data: T[],
  groupKey: string,
  valueKey: string,
  aggregation: "sum" | "avg" | "count" | "min" | "max" = "sum"
): Record<string, number> {
  const grouped = groupByKey(data, groupKey);

  return Object.entries(grouped).reduce((acc, [key, items]) => {
    const values = items
      .map((item) => item[valueKey])
      .filter((v): v is number => typeof v === "number" && !isNaN(v));

    let result: number;
    switch (aggregation) {
      case "sum":
        result = values.reduce((sum, v) => sum + v, 0);
        break;
      case "avg":
        result =
          values.length > 0
            ? values.reduce((sum, v) => sum + v, 0) / values.length
            : 0;
        break;
      case "count":
        result = values.length;
        break;
      case "min":
        result = values.length > 0 ? Math.min(...values) : 0;
        break;
      case "max":
        result = values.length > 0 ? Math.max(...values) : 0;
        break;
    }

    acc[key] = result;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Limit data to first N items
 */
export function limit<T>(data: T[], count: number): T[] {
  return data.slice(0, count);
}

/**
 * Get unique values for a key
 */
export function uniqueValues<T extends ChartData>(
  data: T[],
  key: string
): (string | number)[] {
  const values = new Set<string | number>();
  data.forEach((item) => {
    const val = item[key];
    if (val !== null && val !== undefined) {
      values.add(val);
    }
  });
  return Array.from(values);
}

/**
 * Transform data for chart use (normalize and clean)
 */
export function normalizeData<T extends Record<string, any>>(
  data: T[],
  options: {
    /** Keys to include (null = all) */
    keys?: (keyof T)[] | null;
    /** Remove null/undefined values */
    clean?: boolean;
    /** Convert string numbers to numbers */
    parseNumbers?: boolean;
  } = {}
): ChartData[] {
  const { keys = null, clean = true, parseNumbers = true } = options;

  return data.map((item) => {
    let result: any = {};

    const keysToProcess = keys || (Object.keys(item) as (keyof T)[]);

    for (const key of keysToProcess) {
      let value = item[key];

      // Skip null/undefined if cleaning
      if (clean && (value === null || value === undefined)) {
        continue;
      }

      // Parse string numbers
      if (parseNumbers && typeof value === "string") {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          value = num;
        }
      }

      result[key as string] = value;
    }

    return result;
  });
}
