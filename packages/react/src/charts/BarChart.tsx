import type { ScaleBand } from "d3-scale";
import { useChart } from "../hooks/useChart";
import { YAxis } from "../svg/Axes";
import type { BarChartConfig, Datum } from "@vizualni/core";
import type { XYChartProps } from "./types";

/**
 * Props for the BarChart component.
 *
 * Bar charts are ideal for comparing values across categorical data.
 * Each bar represents a category with its height proportional to the value.
 *
 * @example
 * ```tsx
 * import { BarChart } from "@vizualni/react";
 *
 * const data = [
 *   { category: "Product A", sales: 1000 },
 *   { category: "Product B", sales: 1500 },
 *   { category: "Product C", sales: 800 },
 * ];
 *
 * const config = {
 *   type: "bar",
 *   x: { field: "category", type: "band" },
 *   y: { field: "sales", type: "number" },
 * };
 *
 * <BarChart data={data} config={config} width={600} height={400} />
 * ```
 */
export interface BarChartProps extends XYChartProps<BarChartConfig> {
  // Additional bar-specific props can be added here in the future
}

/**
 * Bar chart component for comparing categorical data.
 *
 * Renders vertical bars where each bar represents a category.
 * Best suited for:
 * - Comparing discrete categories
 * - Showing rankings
 * - Part-to-whole relationships (with stacked bars)
 *
 * The component automatically:
 * - Computes band scale for categorical X-axis
 * - Computes linear scale for numeric Y-axis
 * - Renders bars with appropriate positioning and sizing
 * - Handles data validation and error states
 *
 * @param props - The bar chart props
 * @param props.data - Array of data points to visualize
 * @param props.config - Chart configuration defining axis mappings
 * @param props.width - Chart width in pixels
 * @param props.height - Chart height in pixels
 * @param props.className - Optional CSS class for styling
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BarChart
 *   data={productData}
 *   config={{
 *     type: "bar",
 *     x: { field: "productName", type: "band" },
 *     y: { field: "quantity", type: "number" },
 *   }}
 *   width={600}
 *   height={400}
 * />
 *
 * // With segmentation (stacked/grouped bars)
 * <BarChart
 *   data={salesByRegion}
 *   config={{
 *     type: "bar",
 *     x: { field: "region", type: "band" },
 *     y: { field: "sales", type: "number" },
 *     segment: { field: "product" },
 *   }}
 *   width={800}
 *   height={400}
 *   className="regional-sales-chart"
 * />
 * ```
 */
export function BarChart({
  data,
  config,
  width,
  height,
  className,
}: BarChartProps) {
  const { scales, layout, error } = useChart(data, config, {
    width,
    height,
  });

  // Render placeholder on error
  if (error) {
    return (
      <svg
        role="img"
        width={width}
        height={height}
        className={className}
        aria-label="Bar chart - error"
      >
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999">
          {error}
        </text>
      </svg>
    );
  }

  // Bar charts always use a band scale for x-axis (categorical data)
  const xScale = scales.x as ScaleBand<string>;
  const bandwidth = xScale.bandwidth();

  // Get color if segment exists
  const getColor = (d: Datum) => {
    if (config.segment && scales.color) {
      return scales.color(String(d[config.segment.field]));
    }
    return "#4e79a7"; // Default color
  };

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Bar chart"
    >
      {/* Chart area group */}
      <g transform={`translate(${layout.chartArea.x}, ${layout.chartArea.y})`}>
        {/* Bars */}
        {data.map((d, i) => {
          const category = String(d[config.x.field]);
          const x = xScale(category);
          const y = scales.y(d[config.y.field] as number);
          const barHeight = layout.chartArea.height - y;

          if (x === undefined) return null;

          return (
            <rect
              key={`${category}-${i}`}
              x={x}
              y={y}
              width={bandwidth}
              height={barHeight}
              fill={getColor(d)}
            />
          );
        })}
      </g>

      {/* X Axis */}
      <g
        transform={`translate(${layout.chartArea.x}, ${layout.chartArea.y + layout.chartArea.height})`}
      >
        {xScale.domain().map((category) => {
          const x = xScale(category);
          if (x === undefined) return null;
          return (
            <text
              key={category}
              x={x + bandwidth / 2}
              y={20}
              textAnchor="middle"
              fontSize="12px"
              fill="#666"
            >
              {category}
            </text>
          );
        })}
      </g>

      {/* Y Axis */}
      <YAxis scale={scales.y} width={layout.chartArea.x} />
    </svg>
  );
}
