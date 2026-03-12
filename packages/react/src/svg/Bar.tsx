/**
 * Props for the Bar component.
 *
 * The Bar component renders a rectangular bar element,
 * typically used in bar charts and histograms.
 */
export interface BarProps {
  /**
   * X coordinate of the bar's left edge in pixels.
   */
  x: number;

  /**
   * Y coordinate of the bar's top edge in pixels.
   */
  y: number;

  /**
   * Width of the bar in pixels.
   */
  width: number;

  /**
   * Height of the bar in pixels.
   */
  height: number;

  /**
   * Fill color of the bar.
   * Accepts any valid CSS color value.
   * @default "#4e79a7"
   */
  fill?: string;

  /**
   * Optional CSS class name for styling the bar element.
   */
  className?: string;
}

/**
 * Bar component for rendering rectangular bars in charts.
 *
 * Renders an SVG rect element positioned and sized according to props.
 * This is a low-level component used internally by chart components
 * but can also be used for custom visualizations.
 *
 * @param props - The bar props
 * @param props.x - X position
 * @param props.y - Y position
 * @param props.width - Bar width
 * @param props.height - Bar height
 * @param props.fill - Fill color (default: "#4e79a7")
 * @param props.className - Optional CSS class
 *
 * @example
 * ```tsx
 * import { Bar } from "@vizualni/react";
 *
 * // Single bar
 * <Bar x={50} y={100} width={30} height={200} fill="#4e79a7" />
 *
 * // Multiple bars with different colors
 * {data.map((d, i) => (
 *   <Bar
 *     key={i}
 *     x={xScale(d.category)}
 *     y={yScale(d.value)}
 *     width={bandwidth}
 *     height={chartHeight - yScale(d.value)}
 *     fill={colors[i]}
 *   />
 * ))}
 * ```
 */
export function Bar({
  x,
  y,
  width,
  height,
  fill = "#4e79a7",
  className,
}: BarProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      className={className}
    />
  );
}
