/**
 * Zero-Config Pie Chart Component
 *
 * A simplified PieChart that works with just `data` prop.
 * Automatically detects category and value columns.
 *
 * @example
 * ```tsx
 * import { Pie } from '@acailic/vizualni-admin';
 *
 * <Pie data={[{ category: 'A', value: 100 }]} />
 * ```
 */

import { memo } from "react";

import { PieChart as BasePieChart, type PieChartProps } from "./PieChart";
import { autoDetectAxes, type DataPoint } from "./utils/autoDetectAxes";

export interface PieProps extends Omit<PieChartProps, "config"> {
  /** Data array - the only required prop for zero-config usage */
  data: DataPoint[];
  /** Optional category key (auto-detected if not provided) */
  labelKey?: string;
  /** Optional value key (auto-detected if not provided) */
  valueKey?: string;
  /** Chart title */
  title?: string;
  /** Donut chart inner radius ratio */
  innerRadiusRatio?: number;
  /** Show labels on slices */
  showLabels?: boolean;
  /** Show legend */
  showLegend?: boolean;
}

/**
 * Zero-config Pie chart component
 *
 * Automatically detects:
 * - Label key: First string column (typically category/name)
 * - Value key: First numeric column
 *
 * @example
 * ```tsx
 * // Zero-config
 * <Pie data={categoryData} />
 *
 * // With hints
 * <Pie data={categoryData} title="Revenue by Category" showLegend />
 *
 * // With explicit keys
 * <Pie data={categoryData} labelKey="product" valueKey="sales" />
 * ```
 */
export const Pie = memo(
  ({
    data,
    labelKey: labelKeyProp,
    valueKey: valueKeyProp,
    title,
    innerRadiusRatio,
    showLabels,
    showLegend,
    ...restProps
  }: PieProps) => {
    let detection;

    try {
      detection = autoDetectAxes(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Pie Chart: ${error.message}\n\nExample usage:\n<Pie data={[{ category: 'A', value: 100 }]} />`
        );
      }
      throw error;
    }

    const { xKey: detectedLabelKey, yKeys: detectedValueKeys } = detection;

    // Use provided keys or fall back to detected ones
    const labelKey = labelKeyProp || detectedLabelKey;
    const valueKey = valueKeyProp || detectedValueKeys[0];

    // Build config object
    const config: PieChartProps["config"] = {
      xAxis: labelKey,
      yAxis: valueKey,
      title,
      innerRadiusRatio,
      showLabels,
      showLegend,
    };

    return <BasePieChart data={data} config={config} {...restProps} />;
  }
);

Pie.displayName = "Pie";

// Also export as PieChart for convenience
export { Pie as PieChart };

export default Pie;
