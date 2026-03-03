/**
 * Helper functions for chart configuration UI options.
 *
 * This module contains utility functions for handling chart configuration
 * changes, field manipulation, and common operations across
 * different chart types.
 */

import { DEFAULT_SORTING } from "@/charts";
import type {
  AreaConfig,
  BarConfig,
  ColumnConfig,
  LineConfig,
  PieConfig,
  ScatterPlotConfig,
  TableConfig,
  ChartSegmentField,
} from "@/config-types";
import { makeMultiFilter } from "@/config-utils";
import { mapValueIrisToColor } from "@/configurator/components/ui-helpers";
import type { Component } from "@/domain/data";
import { getDefaultCategoricalPaletteId } from "@/palettes";

import type { OnEncodingChange } from "./chart-config-ui-types";

/**
 * Checks if stacking should be disabled for a given component.
 *
 * Stacking is disabled when the component has a ratio scale type.
 *
 * @param d - Component to check (optional)
 * @returns true if stacking should be disabled, false otherwise
 */
export const disableStacked = (d?: Component): boolean => {
  return d?.scaleType === "Ratio";
};

/**
 * Default handler for segment field changes.
 *
 * When a segment is selected or changed, this function updates:
 * - Sets the segment component ID
 * - Configures color mapping based on palette
 * - Sets up filters for the segment component
 *
 * @template T - Chart configuration type (limited to charts that support segments)
 * @param id - ID of the component to use for segmentation
 * @param options - Change handler options
 * @param options.chartConfig - Chart configuration to modify
 * @param options.dimensions - Available dimensions
 * @param options.measures - Available measures
 * @param options.selectedValues - Selected values for the segment
 */
export const defaultSegmentOnChange: OnEncodingChange<
  | AreaConfig
  | ColumnConfig
  | BarConfig
  | LineConfig
  | ScatterPlotConfig
  | PieConfig
  | TableConfig
> = (id, { chartConfig, dimensions, measures, selectedValues }) => {
  const componentId = id as string;
  const components = [...dimensions, ...measures];
  const component = components.find((d) => d.id === componentId);
  const paletteId = getDefaultCategoricalPaletteId(
    component,
    chartConfig.fields.color && "paletteId" in chartConfig.fields.color
      ? chartConfig.fields.color.paletteId
      : undefined
  );
  const colorMapping = mapValueIrisToColor({
    paletteId,
    dimensionValues: component ? component.values : selectedValues,
  });

  if (chartConfig.fields.segment) {
    (chartConfig.fields.segment as ChartSegmentField).componentId = componentId;
    (chartConfig.fields.segment as ChartSegmentField).showValuesMapping = {};
  } else {
    chartConfig.fields.segment = {
      componentId: componentId,
      sorting: DEFAULT_SORTING,
      showValuesMapping: {},
    };
    chartConfig.fields.color = {
      type: "segment",
      paletteId: paletteId,
      colorMapping,
    };
  }

  if (!selectedValues.length || !component) {
    return;
  }

  const multiFilter = makeMultiFilter(selectedValues.map((d) => d.value));
  const cube = chartConfig.cubes.find((d) => d.iri === component.cubeIri);

  if (cube) {
    cube.filters[componentId] = multiFilter;
  }
};
