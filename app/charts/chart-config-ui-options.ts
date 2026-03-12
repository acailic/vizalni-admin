/**
 * Main chart configuration UI options entry point.
 *
 * This module re-exports all chart configuration UI-related functionality
 * from the refactored modular structure.
 *
 * @module chart-config-ui-options
 */

import type { ChartConfig } from "@/config-types";

import { chartConfigOptionsUISpec } from "./chart-config-spec";

// Re-export all type definitions
export * from "./chart-config-ui-types";

// Re-export chart-specific constants
export * from "./chart-config-ui-constants";

// Re-export helper functions
export * from "./chart-config-ui-helpers";

// Re-export additional helper functions
export * from "./chart-config-additional-helpers";

// Re-export side effect handlers
export * from "./chart-config-side-effects";

// Export main chart configuration spec
export { chartConfigOptionsUISpec } from "./chart-config-spec";

// Re-export from chart-config-types for legacy compatibility
export type {
  EncodingFieldType,
  EncodingOptionChartSubType,
  EncodingOption,
  EncodingSortingOption,
  EncodingSpec,
} from "./chart-config-ui-types";

// Re-export from chart-config-ui-constants for legacy compatibility
export {
  AREA_SEGMENT_SORTING,
  COLUMN_SEGMENT_SORTING,
  PIE_SEGMENT_SORTING,
} from "./chart-config-ui-constants";

// Re-export ANIMATION_FIELD_SPEC from additional-helpers
export { ANIMATION_FIELD_SPEC } from "./chart-config-additional-helpers";

// Re-export from chart-config-ui-helpers for legacy compatibility
export {
  disableStacked,
  defaultSegmentOnChange,
} from "./chart-config-ui-helpers";

// Re-export from chart-config-additional-helpers for legacy compatibility
export {
  isMissingDataPresent,
  getNonStackedDomain,
  onColorComponentScaleTypeChange,
  onColorComponentIdChange,
} from "./chart-config-additional-helpers";

/**
 * Gets the chart specification based on chart configuration.
 *
 * @template T - Chart configuration type
 * @param chartConfig - Chart configuration
 * @returns Chart specification for the given chart type
 */
export const getChartSpec = <T extends ChartConfig>(chartConfig: T): any => {
  return (chartConfigOptionsUISpec as any)[
    (chartConfig as ChartConfig).chartType
  ];
};

// Re-export from chart-config-side-effects for legacy compatibility
export {
  getChartFieldChangeSideEffect,
  getChartFieldDeleteSideEffect,
  getChartFieldOptionChangeSideEffect,
} from "./chart-config-side-effects";
