import type { Datum, ChartConfig } from "@vizualni/core";

/**
 * Base props interface shared by all chart components.
 *
 * All chart components in @vizualni/react accept these common properties
 * to ensure a consistent API experience.
 *
 * @example
 * ```tsx
 * import { LineChart } from "@vizualni/react";
 *
 * <LineChart
 *   data={myData}
 *   config={lineConfig}
 *   width={600}
 *   height={400}
 *   className="my-chart"
 * />
 * ```
 */
export interface BaseChartProps {
  /**
   * The data array to visualize.
   * Each object in the array represents a single data point (datum).
   * The structure should match the fields defined in the chart config.
   */
  data: Datum[];

  /**
   * Width of the chart in pixels.
   * The chart will be rendered within this width including margins.
   */
  width: number;

  /**
   * Height of the chart in pixels.
   * The chart will be rendered within this height including margins.
   */
  height: number;

  /**
   * Optional CSS class name to apply to the root SVG element.
   * Use this for custom styling via CSS.
   */
  className?: string;
}

/**
 * Props for XY-based charts (Line, Bar, Column, Area, Scatter).
 * These charts have a defined X and Y axis with corresponding field mappings.
 */
export interface XYChartProps<
  TConfig extends ChartConfig,
> extends BaseChartProps {
  /**
   * Chart configuration object that defines how data is mapped to visual properties.
   * Includes axis configurations, field mappings, and chart-specific options.
   */
  config: TConfig;
}

/**
 * Props for radial charts (Pie, Donut).
 * These charts use value and category fields instead of X/Y axes.
 */
export interface RadialChartProps<
  TConfig extends ChartConfig,
> extends BaseChartProps {
  /**
   * Chart configuration object that defines how data is mapped to visual properties.
   * Includes field mappings for value and category, color scales, and chart-specific options.
   */
  config: TConfig;
}
