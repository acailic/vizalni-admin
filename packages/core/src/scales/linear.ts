/**
 * @vizualni/core - Linear Scale
 *
 * Linear scale factory for continuous quantitative data.
 *
 * @module scales/linear
 */

import { scaleLinear } from "d3-scale";

/**
 * Options for creating a linear scale.
 *
 * @public
 */
export interface LinearScaleOptions {
  /** Input domain [min, max] */
  domain: [number, number];
  /** Output range [min, max] */
  range: [number, number];
  /** Clamp output to range */
  clamp?: boolean;
  /** Round domain to nice values */
  nice?: boolean | number;
}

/**
 * Creates a linear scale function.
 *
 * @param options - Scale configuration options
 * @returns D3 linear scale function
 *
 * @public
 *
 * @example
 * ```typescript
 * const scale = createLinearScale({
 *   domain: [0, 100],
 *   range: [0, 500],
 *   nice: true
 * });
 * scale(50); // 250
 * ```
 */
export function createLinearScale(options: LinearScaleOptions) {
  const { domain, range, clamp = false, nice = false } = options;

  const scale = scaleLinear().domain(domain).range(range).clamp(clamp);

  if (nice) {
    scale.nice(typeof nice === "number" ? nice : 10);
  }

  return scale;
}
