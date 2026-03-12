/**
 * @vizualni/core - Ordinal Scale
 *
 * Ordinal scale factory for categorical data with color support.
 *
 * @module scales/ordinal
 */

import { scaleOrdinal } from "d3-scale";
import type { Datum } from "../types";

/**
 * Options for creating an ordinal scale.
 *
 * @public
 */
export interface OrdinalScaleOptions {
  /** Input domain (categories) */
  domain?: string[];
  /** Output range */
  range: (string | number)[];
}

/**
 * Options for creating a color scale.
 *
 * @public
 */
export interface ColorScaleOptions {
  /** Pre-defined domain */
  domain?: string[];
  /** Data to infer domain from */
  data?: Datum[];
  /** Field key for domain inference */
  field?: string;
  /** Color palette */
  range: string[];
}

/**
 * Creates an ordinal scale function.
 *
 * @param options - Scale configuration options
 * @returns D3 ordinal scale function
 *
 * @public
 *
 * @example
 * ```typescript
 * const scale = createOrdinalScale({
 *   domain: ['A', 'B', 'C'],
 *   range: ['red', 'green', 'blue']
 * });
 * scale('A'); // 'red'
 * ```
 */
export function createOrdinalScale(options: OrdinalScaleOptions) {
  const { domain = [], range } = options;

  return scaleOrdinal<string, string | number>().domain(domain).range(range);
}

/**
 * Creates a color scale (ordinal scale with color range).
 *
 * @param options - Scale configuration options
 * @returns D3 ordinal scale function for colors
 *
 * @public
 *
 * @example
 * ```typescript
 * const scale = createColorScale({
 *   data: [{category: 'A'}, {category: 'B'}],
 *   field: 'category',
 *   range: ['#4e79a7', '#f28e2c']
 * });
 * scale('A'); // '#4e79a7'
 * ```
 */
export function createColorScale(options: ColorScaleOptions) {
  const { domain: providedDomain, data, field, range } = options;

  // Infer domain from data if not provided
  let domain = providedDomain;
  if (!domain && data && field) {
    // Get unique values using Set
    domain = [...new Set(data.map((d) => String(d[field])))];
  }

  return scaleOrdinal<string, string>()
    .domain(domain || [])
    .range(range);
}
