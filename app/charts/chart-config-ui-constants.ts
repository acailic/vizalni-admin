/**
 * Chart-specific constants and default values for chart configuration UI options.
 *
 * This module contains default sorting configurations, field specifications,
 * and other constant values used across chart configuration options.
 */

import { t } from "@lingui/macro";

import type {
  AreaConfig,
  BarConfig,
  ColumnConfig,
  LineConfig,
  PieConfig,
} from "@/config-types";
import { getAnimationField } from "@/config-types";

import type { EncodingSortingOption } from "./chart-config-ui-types";

/**
 * Default sorting value used when initializing segment fields.
 */
export const DEFAULT_SORTING = {
  sortingType: "byAuto" as const,
  sortingOrder: "asc" as const,
};

/**
 * Default segment sorting configuration generator.
 *
 * Creates a base sorting configuration that can be customized per chart type.
 *
 * @template T - Chart configuration type
 * @returns Array of default sorting options
 */
const getDefaultSegmentSorting = <
  T extends { fields?: { segment?: any } },
>(): EncodingSortingOption<T>[] => [
  {
    sortingType: "byAuto",
    sortingOrder: ["asc", "desc"],
  },
  {
    sortingType: "byDimensionLabel",
    sortingOrder: ["asc", "desc"],
  },
  {
    sortingType: "byTotalSize",
    sortingOrder: ["asc", "desc"],
    getDisabledState: (
      chartConfig: any
    ): {
      disabled: boolean;
      warnMessage?: string;
    } => {
      const animationPresent = !!getAnimationField(chartConfig);

      if (animationPresent) {
        return {
          disabled: true,
          warnMessage: t({
            id: "controls.sorting.byTotalSize.disabled-by-animation",
            message: "Sorting by total size is disabled during animation.",
          }),
        };
      }

      return {
        disabled: false,
      };
    },
  },
];

/**
 * Default sorting options for area charts.
 */
export const AREA_SEGMENT_SORTING = getDefaultSegmentSorting<AreaConfig>();

/**
 * Default sorting options for line charts.
 */
const LINE_SEGMENT_SORTING: EncodingSortingOption<LineConfig>[] = [
  { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
  { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
];

/**
 * Default sorting options for column charts.
 */
export const COLUMN_SEGMENT_SORTING = getDefaultSegmentSorting<ColumnConfig>();

/**
 * Default sorting options for bar charts.
 */
const BAR_SEGMENT_SORTING = getDefaultSegmentSorting<BarConfig>();

/**
 * Default sorting options for pie charts.
 *
 * Pie charts have additional sorting options compared to other chart types.
 */
export const PIE_SEGMENT_SORTING: EncodingSortingOption<PieConfig>[] = [
  { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
  { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
  { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
];

/**
 * Re-export all sorting constants for convenience.
 */
export { LINE_SEGMENT_SORTING, BAR_SEGMENT_SORTING };
