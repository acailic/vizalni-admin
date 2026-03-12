import type { ScaleTime, ScaleLinear } from "d3-scale";
import { useChart } from "../hooks/useChart";
import { XAxis, YAxis } from "../svg/Axes";
import { LinePath } from "../svg/LinePath";
import type { LineChartConfig, Datum } from "@vizualni/core";
import type { XYChartProps } from "./types";

/**
 * Props for the LineChart component.
 *
 * Line charts are ideal for visualizing trends over continuous data
 * (time series or numeric sequences).
 *
 * @example
 * ```tsx
 * import { LineChart } from "@vizualni/react";
 *
 * const data = [
 *   { date: "2024-01-01", value: 100 },
 *   { date: "2024-01-02", value: 150 },
 *   { date: "2024-01-03", value: 120 },
 * ];
 *
 * const config = {
 *   type: "line",
 *   x: { field: "date", type: "date" },
 *   y: { field: "value", type: "number" },
 * };
 *
 * <LineChart data={data} config={config} width={600} height={400} />
 * ```
 */
export interface LineChartProps extends XYChartProps<LineChartConfig> {
  // Additional line-specific props can be added here in the future
}

/**
 * @internal
 * Type guard to check if scale is a continuous scale (time or linear).
 * Continuous scales have an invert function and ticks method.
 */
function isContinuousScale(
  scale: unknown
): scale is ScaleTime<number, number> | ScaleLinear<number, number> {
  return (
    typeof scale === "function" &&
    "invert" in scale &&
    typeof (scale as { invert: unknown }).invert === "function" &&
    "ticks" in scale &&
    typeof (scale as { ticks: unknown }).ticks === "function"
  );
}

/**
 * Line chart component for visualizing trends over continuous data.
 *
 * Renders a line chart with configurable X and Y axes. Best suited for:
 * - Time series data
 * - Continuous numeric data
 * - Trend analysis
 *
 * The component automatically:
 * - Computes appropriate scales based on data
 * - Renders X and Y axes with tick marks
 * - Handles data validation and error states
 *
 * @param props - The line chart props
 * @param props.data - Array of data points to visualize
 * @param props.config - Chart configuration defining axis mappings
 * @param props.width - Chart width in pixels
 * @param props.height - Chart height in pixels
 * @param props.className - Optional CSS class for styling
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LineChart
 *   data={salesData}
 *   config={{
 *     type: "line",
 *     x: { field: "month", type: "date" },
 *     y: { field: "revenue", type: "number" },
 *   }}
 *   width={800}
 *   height={400}
 * />
 *
 * // With custom styling
 * <LineChart
 *   data={salesData}
 *   config={lineConfig}
 *   width={800}
 *   height={400}
 *   className="sales-trend-chart"
 * />
 * ```
 */
export function LineChart({
  data,
  config,
  width,
  height,
  className,
}: LineChartProps) {
  const { scales, layout, error } = useChart(data, config, { width, height });

  // Validate that we have a continuous scale for x-axis
  if (!isContinuousScale(scales.x)) {
    if (error) {
      // Data validation failed, return empty SVG
      return (
        <svg
          role="img"
          width={width}
          height={height}
          className={className}
          aria-label="Line chart"
        >
          <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999">
            {error}
          </text>
        </svg>
      );
    }
    // This should not happen with valid config, but log warning in dev
    console.warn(
      "LineChart expects a continuous x-scale (time or linear). " +
        "Ensure config.x.type is 'date' or 'number'."
    );
  }

  // Type-safe accessor that works with any continuous scale
  const getX = (d: Datum): number => {
    const val = d[config.x.field];
    // Use type assertion since we've validated the scale type
    const scaleFn = scales.x as (value: Date | number) => number | undefined;
    return scaleFn(val as Date | number) ?? 0;
  };

  const getY = (d: Datum): number => {
    return scales.y(d[config.y.field] as number) ?? 0;
  };

  // Check if we have valid continuous scales for axes
  const hasValidXScale = isContinuousScale(scales.x);
  const hasValidYScale = isContinuousScale(scales.y);

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Line chart"
    >
      <g transform={`translate(${layout.chartArea.x}, ${layout.chartArea.y})`}>
        <LinePath data={data} x={getX} y={getY} />
      </g>
      {hasValidXScale && (
        <XAxis
          scale={scales.x as ScaleTime<number, number>}
          height={layout.chartArea.height}
        />
      )}
      {hasValidYScale && <YAxis scale={scales.y} />}
    </svg>
  );
}
