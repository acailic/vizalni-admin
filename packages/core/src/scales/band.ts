/**
 * @vizualni/core - Band Scale
 *
 * Band scale factory for categorical data.
 *
 * @module scales/band
 */

import { scaleBand } from "d3-scale";

/**
 * Options for creating a band scale.
 *
 * @public
 */
export interface BandScaleOptions {
  /** Input domain (categories) */
  domain: string[];
  /** Output range [min, max] */
  range: [number, number];
  /** Padding between bars (0-1) */
  padding?: number;
  /** Padding between bars (0-1) */
  paddingInner?: number;
  /** Padding at edges (0-1) */
  paddingOuter?: number;
  /** Round output values to integers */
  round?: boolean;
}

/**
 * Creates a band scale for categorical data.
 *
 * @param options - Scale configuration options
 * @returns D3 band scale function
 *
 * @public
 *
 * @example
 * ```typescript
 * const scale = createBandScale({
 *   domain: ['A', 'B', 'C'],
 *   range: [0, 100],
 *   padding: 0.2
 * });
 * scale('A'); // 0
 * scale.bandwidth(); // bar width
 * ```
 */
export function createBandScale(options: BandScaleOptions) {
  const {
    domain,
    range,
    padding = 0.1,
    paddingInner,
    paddingOuter,
    round = false,
  } = options;

  const scale = scaleBand<string>().domain(domain).range(range).round(round);

  if (paddingInner !== undefined && paddingOuter !== undefined) {
    scale.paddingInner(paddingInner).paddingOuter(paddingOuter);
  } else {
    scale.padding(padding);
  }

  return scale;
}
