import type { ScaleLinear, ScaleTime } from "d3-scale";

/**
 * Props for the XAxis component.
 *
 * The XAxis renders a horizontal axis with tick marks and labels.
 * It works with both linear (numeric) and time scales.
 */
export interface XAxisProps {
  /**
   * The D3 scale to use for the axis.
   * Must be a continuous scale (linear or time).
   */
  scale: ScaleLinear<number, number> | ScaleTime<number, number>;

  /**
   * Height of the chart area in pixels.
   * Used to position the axis at the bottom of the chart.
   */
  height: number;

  /**
   * Approximate number of ticks to render.
   * The actual number may vary based on the scale's tick calculation.
   * @default 10
   */
  tickCount?: number;

  /**
   * Optional CSS class name for styling the axis group.
   */
  className?: string;
}

/**
 * X-axis component for rendering horizontal axes in charts.
 *
 * Renders an SVG group containing:
 * - A horizontal axis line
 * - Tick marks at regular intervals
 * - Tick labels showing values
 *
 * The component automatically calculates appropriate tick values
 * based on the scale and tickCount.
 *
 * @param props - The axis props
 * @param props.scale - D3 scale for position calculation
 * @param props.height - Chart height for axis positioning
 * @param props.tickCount - Number of ticks (default: 10)
 * @param props.className - Optional CSS class
 *
 * @example
 * ```tsx
 * import { XAxis } from "@vizualni/react";
 * import { scaleLinear } from "d3-scale";
 *
 * const scale = scaleLinear().domain([0, 100]).range([0, 500]);
 *
 * <XAxis scale={scale} height={300} tickCount={5} />
 * ```
 */
export function XAxis({
  scale,
  height,
  tickCount = 10,
  className,
}: XAxisProps) {
  const ticks = scale.ticks(tickCount);
  const range = scale.range();

  return (
    <g className={`x-axis ${className || ""}`}>
      {/* Axis line */}
      <line
        x1={range[0]}
        y1={height}
        x2={range[1]}
        y2={height}
        stroke="#333"
        strokeWidth={1}
      />
      {/* Ticks */}
      {ticks.map((tick, i) => {
        const x = scale(tick as number);
        return (
          <g key={i} transform={`translate(${x}, ${height})`}>
            <line y2={6} stroke="#333" />
            <text
              y={9}
              dy="0.71em"
              textAnchor="middle"
              fontSize="10px"
              fill="#666"
            >
              {String(tick)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Props for the YAxis component.
 *
 * The YAxis renders a vertical axis with tick marks and labels.
 * It works with linear (numeric) scales.
 */
export interface YAxisProps {
  /**
   * The D3 linear scale to use for the axis.
   * Must be a continuous linear scale.
   */
  scale: ScaleLinear<number, number>;

  /**
   * Width of the left margin in pixels.
   * Used to position the axis at the left edge of the chart area.
   * @default 0
   */
  width?: number;

  /**
   * Approximate number of ticks to render.
   * The actual number may vary based on the scale's tick calculation.
   * @default 10
   */
  tickCount?: number;

  /**
   * Optional CSS class name for styling the axis group.
   */
  className?: string;
}

/**
 * Y-axis component for rendering vertical axes in charts.
 *
 * Renders an SVG group containing:
 * - A vertical axis line
 * - Tick marks at regular intervals
 * - Tick labels showing values
 *
 * The component automatically calculates appropriate tick values
 * based on the scale and tickCount.
 *
 * @param props - The axis props
 * @param props.scale - D3 scale for position calculation
 * @param props.width - Left margin for axis positioning (default: 0)
 * @param props.tickCount - Number of ticks (default: 10)
 * @param props.className - Optional CSS class
 *
 * @example
 * ```tsx
 * import { YAxis } from "@vizualni/react";
 * import { scaleLinear } from "d3-scale";
 *
 * const scale = scaleLinear().domain([0, 1000]).range([300, 0]);
 *
 * <YAxis scale={scale} width={60} tickCount={5} />
 * ```
 */
export function YAxis({
  scale,
  width = 0,
  tickCount = 10,
  className,
}: YAxisProps) {
  const ticks = scale.ticks(tickCount);
  const range = scale.range();

  return (
    <g className={`y-axis ${className || ""}`}>
      {/* Axis line */}
      <line
        x1={width}
        y1={range[0]}
        x2={width}
        y2={range[1]}
        stroke="#333"
        strokeWidth={1}
      />
      {/* Ticks */}
      {ticks.map((tick, i) => {
        const y = scale(tick);
        return (
          <g key={i} transform={`translate(${width}, ${y})`}>
            <line x2={-6} stroke="#333" />
            <text
              x={-9}
              dy="0.32em"
              textAnchor="end"
              fontSize="10px"
              fill="#666"
            >
              {tick}
            </text>
          </g>
        );
      })}
    </g>
  );
}
