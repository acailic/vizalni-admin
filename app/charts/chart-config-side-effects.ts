/**
 * Side effect handlers for chart field changes in UI.
 *
 * This module contains functions that handle side effects when chart
 * configuration fields are changed, deleted, or modified.
 * Side effects include updating related fields, cleaning up
 * dependent configurations, and maintaining consistency.
 */

import lodashGet from "lodash/get";

import type { ChartConfig } from "@/config-types";

import { chartConfigOptionsUISpec } from "./chart-config-spec";

import type { EncodingFieldType, EncodingSpec } from "./chart-config-ui-types";

// Local helper function
const get = <T>(object: Record<string, T>, path: string): T | undefined =>
  lodashGet(object, path);

/**
 * Gets the onChange handler for a given field based on chart configuration.
 *
 * Side effects occur when a field value is changed. This function
 * looks up the appropriate handler from the chart's specification.
 *
 * @param chartConfig - Chart configuration
 * @param field - Encoding field type
 * @returns onChange handler if found, undefined otherwise
 *
 * @example
 * ```ts
 * const onChange = getChartFieldChangeSideEffect(config, "x");
 * if (onChange) {
 *   onChange(newXValue, { chartConfig: config, field: "x" });
 * }
 * ```
 */
export const getChartFieldChangeSideEffect = (
  chartConfig: ChartConfig,
  field: EncodingFieldType
): EncodingSpec["onChange"] | undefined => {
  const chartSpec = getChartSpec(chartConfig);
  const encoding = chartSpec.encodings.find(
    (d: EncodingSpec) => d.field === field
  );

  return encoding?.onChange;
};

/**
 * Gets the onDelete handler for a given field based on chart configuration.
 *
 * Side effects occur when a field is deleted from the configuration.
 * This function looks up the appropriate cleanup handler.
 *
 * @param chartConfig - Chart configuration
 * @param field - Encoding field type
 * @returns onDelete handler if found, undefined otherwise
 *
 * @example
 * ```ts
 * const onDelete = getChartFieldDeleteSideEffect(config, "segment");
 * if (onDelete) {
 *   onDelete({ chartConfig: config });
 * }
 * ```
 */
export const getChartFieldDeleteSideEffect = (
  chartConfig: ChartConfig,
  field: EncodingFieldType
): EncodingSpec["onDelete"] | undefined => {
  const chartSpec = getChartSpec(chartConfig);
  const encoding = chartSpec.encodings.find(
    (d: EncodingSpec) => d.field === field
  );

  return encoding?.onDelete;
};

/**
 * Gets the onChange handler for a specific field option path.
 *
 * Some fields have nested options (e.g., segment.type,
 * color.componentId). This function finds the appropriate
 * handler for these nested option changes.
 *
 * @param chartConfig - Chart configuration
 * @param field - Encoding field type
 * @param path - Path to the option (e.g., "segment.type", "color.componentId")
 * @returns onChange handler if found, undefined otherwise
 *
 * @example
 * ```ts
 * const onChange = getChartFieldOptionChangeSideEffect(
 *   config,
 *   "segment",
 *   "type"
 * );
 * if (onChange) {
 *   onChange("stacked", { chartConfig: config, field: "segment" });
 * }
 * ```
 */
export const getChartFieldOptionChangeSideEffect = (
  chartConfig: ChartConfig,
  field: EncodingFieldType,
  path: string
): any | undefined => {
  const chartSpec = getChartSpec(chartConfig);
  const encoding = chartSpec.encodings.find(
    (d: EncodingSpec) => d.field === field
  );

  switch (`${field}.${path}`) {
    case "segment.type":
      return get(encoding, "options.chartSubType.onChange");
    case "areaLayer.color.componentId":
    case "symbolLayer.color.componentId":
      return get(encoding, "options.colorComponent.onComponentIdChange");
    case "areaLayer.color.scaleType":
    case "symbolLayer.color.scaleType":
      return get(encoding, "options.colorComponent.onScaleTypeChange");
    case "y.componentIds":
      return get(encoding, "options.componentIds.onChange");
    case "y.lineAxisOrientation":
      return get(encoding, "options.lineAxisOrientation.onChange");
    case "y.leftAxisComponentId":
      return get(encoding, "options.leftAxisComponentId.onChange");
    case "y.rightAxisComponentId":
      return get(encoding, "options.rightAxisComponentId.onChange");
    case "y.lineComponentId":
      return get(encoding, "options.lineComponentId.onChange");
    case "y.columnComponentId":
      return get(encoding, "options.columnComponentId.onChange");
  }
};

/**
 * Internal import of getChartSpec.
 * This is re-exported from chart-config-spec.ts to avoid circular dependencies.
 *
 * @internal
 */
const getChartSpec = (chartConfig: ChartConfig): any => {
  return (chartConfigOptionsUISpec as any)[
    (chartConfig as ChartConfig).chartType
  ];
};
