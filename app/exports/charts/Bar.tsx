/**
 * Zero-Config Bar Chart Component
 *
 * A simplified BarChart that works with just `data` prop.
 * Automatically detects x-axis, y-axis, and formatting.
 *
 * @example
 * ```tsx
 * import { Bar } from '@acailic/vizualni-admin';
 *
 * <Bar data={[{ category: 'A', value: 100 }]} />
 * ```
 */

import { memo } from "react";

import { BarChart as BaseBarChart, type BarChartProps } from "./BarChart";
import { autoDetectAxes, type DataPoint } from "./utils/autoDetectAxes";

export interface BarProps extends Omit<BarChartProps, "config"> {
  /** Data array - the only required prop for zero-config usage */
  data: DataPoint[];
  /** Optional x-axis key (auto-detected if not provided) */
  xKey?: string;
  /** Optional y-axis key(s) (auto-detected if not provided) */
  yKey?: string | string[];
  /** Chart title */
  title?: string;
  /** Chart color */
  color?: string;
  /** Show area fill for bars */
  showArea?: boolean;
  /** Show crosshair on hover */
  showCrosshair?: boolean;
}

/**
 * Zero-config Bar chart component (horizontal bars)
 *
 * Automatically detects:
 * - X-axis: First string column or key matching "date"/"year"/"month"/"time"/"label"
 * - Y-axis: First numeric column(s)
 * - Multiple series: All numeric columns
 *
 * @example
 * ```tsx
 * // Zero-config
 * <Bar data={salesData} />
 *
 * // With hints
 * <Bar data={salesData} title="Sales by Category" />
 *
 * // With explicit keys
 * <Bar data={salesData} xKey="product" yKey="revenue" />
 * ```
 */
export const Bar = memo(
  ({
    data,
    xKey: xKeyProp,
    yKey: yKeyProp,
    title,
    color,
    showArea,
    showCrosshair,
    ...restProps
  }: BarProps) => {
    let detection;

    try {
      detection = autoDetectAxes(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Bar Chart: ${error.message}\n\nExample usage:\n<Bar data={[{ category: 'A', value: 100 }]} />`
        );
      }
      throw error;
    }

    const {
      xKey: detectedXKey,
      yKeys: detectedYKeys,
      isMultiSeries,
    } = detection;

    // Use provided keys or fall back to detected ones
    const xKey = xKeyProp || detectedXKey;
    const yKey = yKeyProp || (isMultiSeries ? detectedYKeys : detectedYKeys[0]);

    // Build config object
    const config: BarChartProps["config"] = {
      xAxis: xKey as string,
      yAxis: yKey as string | string[],
      color,
      showArea,
      showCrosshair,
      title,
      seriesKeys: isMultiSeries
        ? Array.isArray(yKey)
          ? yKey
          : [yKey as string]
        : undefined,
    };

    return <BaseBarChart data={data} config={config} {...restProps} />;
  }
);

Bar.displayName = "Bar";

// Also export as BarChart for convenience
export { Bar as BarChart };

export default Bar;
