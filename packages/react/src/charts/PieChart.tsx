import { pie, arc } from "d3-shape";
import type { PieArcDatum } from "d3-shape";
import { useChart } from "../hooks/useChart";
import type { PieConfig, Datum } from "@vizualni/core";
import { getDefaultColor } from "@vizualni/core";
import type { RadialChartProps } from "./types";

/**
 * Props for the PieChart component.
 *
 * Pie charts are ideal for showing part-to-whole relationships
 * with proportional slices representing categories.
 *
 * @example
 * ```tsx
 * import { PieChart } from "@vizualni/react";
 *
 * const data = [
 *   { category: "Desktop", value: 4500 },
 *   { category: "Mobile", value: 3200 },
 *   { category: "Tablet", value: 1800 },
 * ];
 *
 * const config = {
 *   type: "pie",
 *   category: { field: "category" },
 *   value: { field: "value" },
 * };
 *
 * <PieChart data={data} config={config} width={400} height={400} />
 * ```
 */
export interface PieChartProps extends RadialChartProps<PieConfig> {
  /**
   * Inner radius as a proportion of the outer radius (0 to 1).
   * - 0 = Full pie chart (default)
   * - 0.5 = Donut chart (50% inner radius)
   * - 0.9 = Thin ring chart
   *
   * Can also be set via config.innerRadius.
   * This prop takes precedence over config value.
   *
   * @example
   * ```tsx
   * // Donut chart
   * <PieChart data={data} config={config} innerRadius={0.6} width={400} height={400} />
   * ```
   */
  innerRadius?: number;
}

/**
 * Pie chart component for visualizing part-to-whole relationships.
 *
 * Renders a pie (or donut) chart where each slice represents a category's
 * proportional value relative to the total. Best suited for:
 * - Showing composition/market share
 * - Comparing category proportions
 * - Simple part-to-whole comparisons
 *
 * Note: Pie charts work best with a small number of categories (5-7 max).
 * For many categories, consider a bar chart instead.
 *
 * The component automatically:
 * - Computes slice angles based on data proportions
 * - Applies color scales for category differentiation
 * - Renders with configurable inner radius for donut charts
 *
 * @param props - The pie chart props
 * @param props.data - Array of data points to visualize
 * @param props.config - Chart configuration defining field mappings
 * @param props.width - Chart width in pixels
 * @param props.height - Chart height in pixels
 * @param props.className - Optional CSS class for styling
 * @param props.innerRadius - Optional inner radius ratio (0-1) for donut charts
 *
 * @example
 * ```tsx
 * // Basic pie chart
 * <PieChart
 *   data={marketShareData}
 *   config={{
 *     type: "pie",
 *     category: { field: "company" },
 *     value: { field: "marketShare" },
 *   }}
 *   width={400}
 *   height={400}
 * />
 *
 * // Donut chart with custom inner radius
 * <PieChart
 *   data={budgetData}
 *   config={pieConfig}
 *   width={400}
 *   height={400}
 *   innerRadius={0.6}
 *   className="budget-donut"
 * />
 * ```
 */
export function PieChart({
  data,
  config,
  width,
  height,
  className,
  innerRadius: innerRadiusProp,
}: PieChartProps) {
  const { scales } = useChart(data, config, { width, height });

  // Dimensions
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = Math.min(width, height) / 2 - 20;
  const innerRadius =
    (innerRadiusProp ?? config.innerRadius ?? 0) * outerRadius;

  // Create pie layout
  const pieGenerator = pie<Datum>()
    .value((d) => d[config.value.field] as number)
    .sort(null);

  const pieData = pieGenerator(data);

  // Create arc generator
  const arcGenerator = arc<PieArcDatum<Datum>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Pie chart"
    >
      <g transform={`translate(${cx}, ${cy})`}>
        {pieData.map((slice, i) => {
          const path = arcGenerator(slice);
          if (!path) return null;

          const color = scales.color
            ? scales.color(String(slice.data[config.category.field]))
            : getDefaultColor(i);

          return (
            <path key={i} d={path} fill={color} stroke="#fff" strokeWidth={2} />
          );
        })}
      </g>
    </svg>
  );
}
