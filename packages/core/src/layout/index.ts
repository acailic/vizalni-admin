/**
 * @vizualni/core - Layout
 *
 * Layout computation utilities for chart dimensions.
 *
 * @module layout
 */

import type { Dimensions, Margins, Rect } from "../types";
import type { ChartConfig } from "../config";

/**
 * Computed layout for chart rendering.
 *
 * @public
 */
export interface Layout extends Dimensions {}

/**
 * Options for computing layout.
 *
 * @public
 */
export interface ComputeLayoutOptions {
  width: number;
  height: number;
  margins?: Partial<Margins>;
}

/**
 * Default margins for charts.
 *
 * @internal
 */
const DEFAULT_MARGINS: Margins = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 60,
};

/**
 * Computes chart layout dimensions.
 *
 * @param config - Chart configuration (reserved for future use)
 * @param options - Layout options including dimensions and margins
 * @returns Computed layout with margins and chart area
 *
 * @public
 *
 * @example
 * ```typescript
 * const layout = computeLayout(
 *   { type: 'line', x: { field: 'date', type: 'date' }, y: { field: 'value', type: 'number' } },
 *   { width: 600, height: 400, margins: { top: 20 } }
 * );
 * // layout.chartArea contains the drawable area
 * ```
 */
export function computeLayout(
  config: ChartConfig,
  options: ComputeLayoutOptions
): Layout {
  const { width, height, margins: customMargins } = options;

  const margins: Margins = {
    ...DEFAULT_MARGINS,
    ...customMargins,
  };

  const chartArea: Rect = {
    x: margins.left,
    y: margins.top,
    width: width - margins.left - margins.right,
    height: height - margins.top - margins.bottom,
  };

  return {
    width,
    height,
    margins,
    chartArea,
  };
}
