import type { ChartConfig, Datum, Shape } from "../types";
import type { Scales, ComputeScalesOptions } from "../scales";
import type { Layout, ComputeLayoutOptions } from "../layout";
import { computeScales } from "../scales";
import { computeLayout } from "../layout";
import { computeShapes } from "../shapes";

export interface ChartOptions {
  /** Chart width in pixels */
  width: number;
  /** Chart height in pixels */
  height: number;
  /** Custom margins */
  margins?: ComputeLayoutOptions["margins"];
}

export interface ChartResult {
  /** Computed scales for the chart */
  scales: Scales;
  /** Layout dimensions */
  layout: Layout;
  /** Shape rendering instructions */
  shapes: Shape[];
}

/**
 * Computes all rendering instructions for a chart.
 * This is the main entry point for the core library.
 *
 * @param data - Array of data points
 * @param config - Chart configuration
 * @param options - Chart dimensions and options
 * @returns Scales, layout, and shapes ready for rendering
 *
 * @example
 * ```typescript
 * const result = computeChart(
 *   [{ date: new Date('2024-01-01'), value: 10 }],
 *   { type: 'line', x: { field: 'date', type: 'date' }, y: { field: 'value', type: 'number' } },
 *   { width: 600, height: 400 }
 * );
 * // result.shapes contains SVG path data
 * ```
 */
export function computeChart(
  data: Datum[],
  config: ChartConfig,
  options: ChartOptions
): ChartResult {
  // Compute scales
  const scaleOptions: ComputeScalesOptions = {
    width: options.width,
    height: options.height,
    margins: options.margins,
  };
  const scales = computeScales(data, config, scaleOptions);

  // Compute layout
  const layoutOptions: ComputeLayoutOptions = {
    width: options.width,
    height: options.height,
    margins: options.margins,
  };
  const layout = computeLayout(config, layoutOptions);

  // Compute shapes
  const shapes = computeShapes(data, config, { scales, layout });

  return { scales, layout, shapes };
}
