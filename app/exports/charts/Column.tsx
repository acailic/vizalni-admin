/**
 * Zero-Config Column Chart Component
 *
 * A simplified ColumnChart that works with just `data` prop.
 * Automatically detects x-axis, y-axis, and formatting.
 *
 * @example
 * ```tsx
 * import { Column } from '@acailic/vizualni-admin';
 *
 * <Column data={[{ category: 'A', value: 100 }]} />
 * ```
 */

import { memo } from "react";

import {
  ColumnChart as BaseColumnChart,
  type ColumnChartProps,
} from "./ColumnChart";
import { autoDetectAxes, type DataPoint } from "./utils/autoDetectAxes";

export interface ColumnProps extends Omit<ColumnChartProps, "config"> {
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
  /** Show area fill for columns */
  showArea?: boolean;
  /** Show crosshair on hover */
  showCrosshair?: boolean;
}

/**
 * Zero-config Column chart component (vertical bars)
 *
 * Automatically detects:
 * - X-axis: First string column or key matching "date"/"year"/"month"/"time"/"label"
 * - Y-axis: First numeric column(s)
 * - Multiple series: All numeric columns
 *
 * @example
 * ```tsx
 * // Zero-config
 * <Column data={salesData} />
 *
 * // With hints
 * <Column data={salesData} title="Sales by Category" />
 *
 * // With explicit keys
 * <Column data={salesData} xKey="product" yKey="revenue" />
 * ```
 */
export const Column = memo(
  ({
    data,
    xKey: xKeyProp,
    yKey: yKeyProp,
    title,
    color,
    showArea: _showArea,
    showCrosshair: _showCrosshair,
    ...restProps
  }: ColumnProps) => {
    let detection;

    try {
      detection = autoDetectAxes(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Column Chart: ${error.message}\n\nExample usage:\n<Column data={[{ category: 'A', value: 100 }]} />`
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
    const config: ColumnChartProps["config"] = {
      xAxis: xKey as string,
      yAxis: yKey as string | string[],
      color,
      title,
      seriesKeys: isMultiSeries
        ? Array.isArray(yKey)
          ? yKey
          : [yKey as string]
        : undefined,
    };

    return <BaseColumnChart data={data} config={config} {...restProps} />;
  }
);

Column.displayName = "Column";

// Also export as ColumnChart for convenience
export { Column as ColumnChart };

export default Column;
