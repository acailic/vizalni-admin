import type { ScaleLinear, ScaleTime, ScaleBand } from "d3-scale";

/**
 * Union type for all possible X scale types used in charts.
 *
 * Charts can use different scale types for their X-axis depending on the data:
 * - ScaleTime: For temporal/date data (line charts over time)
 * - ScaleLinear: For continuous numeric data
 * - ScaleBand: For categorical data (bar charts)
 */
export type XScale =
  | ScaleTime<number, number>
  | ScaleLinear<number, number>
  | ScaleBand<string>;

/**
 * @internal
 * Type guard to check if a scale is a band scale.
 *
 * Band scales are used for categorical data where each distinct value
 * gets an equal-sized band (e.g., bar chart categories).
 *
 * @param scale - The scale to check
 * @returns True if the scale is a band scale
 *
 * @example
 * ```tsx
 * if (isBandScale(scales.x)) {
 *   const bandwidth = scales.x.bandwidth();
 *   // Use bandwidth for bar width
 * }
 * ```
 */
export function isBandScale(scale: XScale): scale is ScaleBand<string> {
  return typeof (scale as ScaleBand<string>).bandwidth === "function";
}

/**
 * @internal
 * Type guard to check if a scale is a time scale.
 *
 * Time scales are used for temporal data (dates, times).
 * They have special tick formatting and domain handling.
 *
 * @param scale - The scale to check
 * @returns True if the scale is a time scale
 *
 * @example
 * ```tsx
 * if (isTimeScale(scales.x)) {
 *   // Format ticks as dates
 *   const ticks = scales.x.ticks(d3.timeDay.every(1));
 * }
 * ```
 */
export function isTimeScale(scale: XScale): scale is ScaleTime<number, number> {
  return (
    !isBandScale(scale) &&
    "ticks" in scale &&
    !(
      "invert" in scale &&
      typeof (scale as ScaleLinear<number, number>).ticks === "function"
    )
  );
}

/**
 * @internal
 * Type guard to check if a scale is a linear scale.
 *
 * Linear scales are used for continuous numeric data.
 * They map a continuous domain to a continuous range.
 *
 * Note: Both linear and time scales have invert and ticks methods.
 * This function distinguishes linear scales by checking if the
 * domain values are numbers (not Date objects).
 *
 * @param scale - The scale to check
 * @returns True if the scale is a linear scale
 *
 * @example
 * ```tsx
 * if (isLinearScale(scales.y)) {
 *   // Y-axis typically uses linear scale
 *   const ticks = scales.y.ticks(5);
 * }
 * ```
 */
export function isLinearScale(
  scale: XScale
): scale is ScaleLinear<number, number> {
  if (isBandScale(scale)) return false;
  // Both linear and time scales have invert, but time scale domain contains Dates
  const domain = scale.domain();
  return domain.length > 0 && typeof domain[0] === "number";
}
