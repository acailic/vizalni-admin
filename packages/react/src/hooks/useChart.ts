import { useMemo } from "react";
import {
  computeScales,
  computeLayout,
  type ChartConfig,
  type Datum,
  type Scales,
  type Layout,
  type Margins,
  type Rect,
} from "@vizualni/core";

/**
 * Options for the useChart hook.
 *
 * Controls the dimensions and margins of the chart rendering area.
 */
export interface UseChartOptions {
  /**
   * Total width of the chart in pixels.
   * This includes the chart area plus margins.
   */
  width: number;

  /**
   * Total height of the chart in pixels.
   * This includes the chart area plus margins.
   */
  height: number;

  /**
   * Optional custom margins to override defaults.
   * Default margins are: { top: 30, right: 30, bottom: 50, left: 60 }
   *
   * @example
   * ```tsx
   * const options = {
   *   width: 600,
   *   height: 400,
   *   margins: { top: 20, left: 80 }, // Override only some margins
   * };
   * ```
   */
  margins?: Partial<Margins>;
}

/**
 * Result returned by the useChart hook.
 *
 * Contains all computed values needed to render a chart.
 */
export interface ChartResult {
  /**
   * Computed D3 scales for X, Y, and optionally color.
   * Use these scales to position data points within the chart area.
   */
  scales: Scales;

  /**
   * Computed layout dimensions including chart area and margins.
   * Use these to position axes, legends, and other chart elements.
   */
  layout: Layout;

  /**
   * Error message if data validation failed.
   * When this is set, the scales may contain dummy values.
   * Check this before rendering data-dependent elements.
   */
  error?: string;
}

/**
 * @internal
 * Default margins for charts.
 * Can be overridden via UseChartOptions.margins.
 */
const DEFAULT_MARGINS: Margins = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 60,
};

/**
 * @internal
 * Validates that required fields exist in data.
 * Returns an error message if validation fails.
 */
function validateData(
  data: Datum[],
  config: ChartConfig
): { valid: boolean; error?: string } {
  if (!data || data.length === 0) {
    return { valid: false, error: "Data array is empty" };
  }

  const requiredFields: string[] = [];

  if (config.type === "line" || config.type === "bar") {
    requiredFields.push(config.x.field, config.y.field);
    if (config.segment) {
      requiredFields.push(config.segment.field);
    }
  } else if (config.type === "pie") {
    requiredFields.push(config.value.field, config.category.field);
  }

  for (const field of requiredFields) {
    const hasField = data.some((d) => field in d && d[field] !== undefined);
    if (!hasField) {
      return {
        valid: false,
        error: `Required field "${field}" not found in data`,
      };
    }
  }

  return { valid: true };
}

/**
 * Headless hook that computes chart scales and layout.
 *
 * This is the core hook for building custom chart components.
 * It handles all the computational heavy lifting:
 * - Scale computation based on data and config
 * - Layout calculation with proper margins
 * - Data validation with error handling
 *
 * The hook is designed to be used with any chart type that
 * conforms to the ChartConfig interface.
 *
 * @typeParam TConfig - The specific chart config type (e.g., LineChartConfig, BarChartConfig)
 *
 * @param data - Array of data points to visualize
 * @param config - Chart configuration defining scales and mappings
 * @param options - Chart dimensions and margin options
 *
 * @returns ChartResult containing scales, layout, and optional error
 *
 * @example
 * ```tsx
 * import { useChart } from "@vizualni/react";
 * import type { LineChartConfig } from "@vizualni/core";
 *
 * function CustomLineChart({ data, config, width, height }: Props) {
 *   const { scales, layout, error } = useChart(data, config, { width, height });
 *
 *   if (error) {
 *     return <div>Error: {error}</div>;
 *   }
 *
 *   // Use scales and layout to render custom chart
 *   return (
 *     <svg width={width} height={height}>
 *       <g transform={`translate(${layout.chartArea.x}, ${layout.chartArea.y})`}>
 *         {/* Custom rendering using scales.x and scales.y *\/}
 *       </g>
 *     </svg>
 *   );
 * }
 * ```
 *
 * @remarks
 * The hook memoizes all computations for performance.
 * It will only recompute when data, config, or dimensions change.
 */
export function useChart<TConfig extends ChartConfig>(
  data: Datum[],
  config: TConfig,
  options: UseChartOptions
): ChartResult {
  const { width, height, margins: customMargins } = options;

  const margins: Margins = useMemo(
    () => ({ ...DEFAULT_MARGINS, ...customMargins }),
    [customMargins]
  );

  const chartArea: Rect = useMemo(
    () => ({
      x: margins.left,
      y: margins.top,
      width: width - margins.left - margins.right,
      height: height - margins.top - margins.bottom,
    }),
    [width, height, margins]
  );

  // Validate data
  const validation = useMemo(() => validateData(data, config), [data, config]);

  const scales = useMemo(() => {
    if (!validation.valid) {
      // Return dummy scales on error
      return {
        x: () => 0,
        y: () => 0,
      } as unknown as Scales;
    }
    return computeScales(data, config, { width, height, margins, chartArea });
  }, [data, config, width, height, margins, chartArea, validation]);

  const layout = useMemo(
    () => computeLayout(config, { width, height, margins: customMargins }),
    [config, width, height, customMargins]
  );

  return useMemo(
    () => ({
      scales,
      layout,
      error: validation.valid ? undefined : validation.error,
    }),
    [scales, layout, validation]
  );
}
