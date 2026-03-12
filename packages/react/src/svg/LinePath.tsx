import { line } from "d3-shape";
import type { Datum } from "@vizualni/core";

/**
 * Props for the LinePath component.
 *
 * The LinePath component renders an SVG path element shaped as a line
 * connecting data points in sequence.
 */
export interface LinePathProps {
  /**
   * Array of data points to connect with the line.
   * Points are rendered in array order.
   */
  data: Datum[];

  /**
   * Accessor function to extract the X coordinate from each datum.
   * Should return a pixel value within the chart area.
   */
  x: (d: Datum) => number;

  /**
   * Accessor function to extract the Y coordinate from each datum.
   * Should return a pixel value within the chart area.
   */
  y: (d: Datum) => number;

  /**
   * Stroke color of the line.
   * Accepts any valid CSS color value.
   * @default "#4e79a7"
   */
  stroke?: string;

  /**
   * Width of the line stroke in pixels.
   * @default 2
   */
  strokeWidth?: number;

  /**
   * Fill color of the path.
   * Usually "none" for lines, but can be set for area fills.
   * @default "none"
   */
  fill?: string;

  /**
   * Optional CSS class name for styling the path element.
   */
  className?: string;
}

/**
 * Line path component for rendering connected data points.
 *
 * Renders an SVG path element that connects data points in sequence,
 * creating a continuous line. This is a low-level component used
 * internally by chart components but can also be used for custom
 * visualizations.
 *
 * The component uses d3-shape's line generator internally for
 * smooth path generation.
 *
 * @param props - The line path props
 * @param props.data - Array of data points
 * @param props.x - X coordinate accessor function
 * @param props.y - Y coordinate accessor function
 * @param props.stroke - Line color (default: "#4e79a7")
 * @param props.strokeWidth - Line width (default: 2)
 * @param props.fill - Fill color (default: "none")
 * @param props.className - Optional CSS class
 *
 * @example
 * ```tsx
 * import { LinePath } from "@vizualni/react";
 *
 * const data = [
 *   { x: 0, y: 10 },
 *   { x: 1, y: 25 },
 *   { x: 2, y: 15 },
 * ];
 *
 * <LinePath
 *   data={data}
 *   x={(d) => scaleX(d.x)}
 *   y={(d) => scaleY(d.y)}
 *   stroke="#ff6b6b"
 *   strokeWidth={3}
 * />
 * ```
 */
export function LinePath({
  data,
  x,
  y,
  stroke = "#4e79a7",
  strokeWidth = 2,
  fill = "none",
  className,
}: LinePathProps) {
  const pathGenerator = line<Datum>()
    .x((d) => x(d))
    .y((d) => y(d));

  const path = pathGenerator(data);

  if (!path) return null;

  return (
    <path
      d={path}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      className={className}
    />
  );
}
