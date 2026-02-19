import { scaleOrdinal } from "d3-scale";
import type { Datum } from "../types";

export interface OrdinalScaleOptions {
  /** Input domain (categories) */
  domain?: string[];
  /** Output range */
  range: (string | number)[];
}

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
 * Creates an ordinal scale function
 */
export function createOrdinalScale(options: OrdinalScaleOptions) {
  const { domain = [], range } = options;

  return scaleOrdinal<string, string | number>().domain(domain).range(range);
}

/**
 * Creates a color scale (ordinal scale with color range)
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
