/**
 * Zero-Config Line Chart Component
 *
 * A simplified LineChart that works with just `data` prop.
 * Automatically detects x-axis, y-axis, and formatting.
 *
 * @example
 * ```tsx
 * import { Line } from '@acailic/vizualni-admin';
 *
 * <Line data={[{ year: '2020', value: 100 }]} />
 * ```
 */

import { memo } from "react";

import { LineChart as BaseLineChart, type LineChartProps } from "./LineChart";
import { autoDetectAxes, type DataPoint } from "./utils/autoDetectAxes";

export interface LineProps extends Omit<LineChartProps, "config"> {
  /** Data array - the only required prop for zero-config usage */
  data: DataPoint[];
  /** Optional x-axis key (auto-detected if not provided) - also accepts `x` as alias */
  xKey?: string;
  /** @internal Alias for xKey */
  x?: string;
  /** Optional y-axis key(s) (auto-detected if not provided) - also accepts `y` as alias */
  yKey?: string | string[];
  /** @internal Alias for yKey */
  y?: string | string[];
  /** @internal Alias for xAxis (classic component compatibility) */
  xAxis?: string;
  /** @internal Alias for yAxis (classic component compatibility) */
  yAxis?: string | string[];
  /** Chart title - also accepts `t` as short alias */
  title?: string;
  /** @internal Short alias for title */
  t?: string;
  /** Chart color - also accepts `c` as short alias */
  color?: string;
  /** @internal Short alias for color */
  c?: string;
  /** Show area fill under the line */
  showArea?: boolean;
  /** Show crosshair on hover - also accepts `crosshair` as alias */
  showCrosshair?: boolean;
}

/**
 * Zero-config Line chart component
 *
 * Automatically detects:
 * - X-axis: First string column or key matching "date"/"year"/"month"/"time"/"label"
 * - Y-axis: First numeric column(s)
 * - Multiple series: All numeric columns
 *
 * @example
 * ```tsx
 * // Zero-config - everything auto-detected
 * <Line data={climateData} />
 *
 * // With semantic hints
 * <Line data={climateData} title="Temperature Trends" color="warm" />
 *
 * // With explicit axis selection
 * <Line data={climateData} xKey="year" yKey="temperature" />
 *
 * // With short aliases (maximum compactness)
 * <Line data={climateData} x="year" y="value" t="Chart" c="#6366f1" />
 * ```
 */
export const Line = memo(
  ({
    data,
    xKey: xKeyProp,
    x: xAlias,
    yKey: yKeyProp,
    y: yAlias,
    xAxis: xAxisAlias,
    yAxis: yAxisAlias,
    title,
    t: tAlias,
    color,
    c: cAlias,
    showArea,
    showCrosshair,
    ...restProps
  }: LineProps) => {
    let detection;

    try {
      detection = autoDetectAxes(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Line Chart: ${error.message}\n\nExample usage:\n<Line data={[{ year: '2020', value: 100 }]} />`
        );
      }
      throw error;
    }

    const {
      xKey: detectedXKey,
      yKeys: detectedYKeys,
      isMultiSeries,
    } = detection;

    // Resolve x-axis key (in priority order: xKey > x > xAxis > detected)
    const xKey = xKeyProp || xAlias || xAxisAlias || detectedXKey;

    // Resolve y-axis key (in priority order: yKey > y > yAxis > detected)
    const yKey =
      yKeyProp ||
      yAlias ||
      yAxisAlias ||
      (isMultiSeries ? detectedYKeys : detectedYKeys[0]);

    // Resolve title
    const resolvedTitle = title ?? tAlias;

    // Resolve color
    const resolvedColor = color ?? cAlias;

    // Build config object
    const config: LineChartProps["config"] = {
      xAxis: xKey as string,
      yAxis: yKey as string | string[],
      color: resolvedColor,
      showArea,
      showCrosshair,
      title: resolvedTitle,
      seriesKeys: isMultiSeries
        ? Array.isArray(yKey)
          ? yKey
          : [yKey as string]
        : undefined,
    };

    return <BaseLineChart data={data} config={config} {...restProps} />;
  }
);

Line.displayName = "Line";

// Also export as LineChart for convenience
export { Line as LineChart };

export default Line;
