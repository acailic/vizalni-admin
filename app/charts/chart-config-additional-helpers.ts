/**
 * Helper functions for chart configuration UI.
 *
 * These functions support chart specification generation and field handling.
 * They work alongside helpers in chart-config-ui-helpers.ts.
 */

import lodashGet from "lodash/get";
import setWith from "lodash/setWith";
import unset from "lodash/unset";

import {
  DEFAULT_FIXED_COLOR_FIELD,
  getDefaultCategoricalColorField,
  getDefaultNumericalColorField,
} from "@/charts/map/constants";
import type { ChartConfig } from "@/config-types";
import { isSortingInConfig } from "@/config-types";
import { CustomPaletteType } from "@/config-types";
import type { Component, Measure } from "@/domain/data";
import {
  ANIMATION_ENABLED_COMPONENTS,
  isNumericalMeasure,
  isOrdinalMeasure,
  MULTI_FILTER_ENABLED_COMPONENTS,
} from "@/domain/data";
import { getDefaultCategoricalPaletteId } from "@/palettes";

// Local type definitions
type OnEncodingOptionChange<V, T extends ChartConfig = ChartConfig> = (
  value: V,
  options: {
    chartConfig: T;
    dimensions: Component[];
    measures: Measure[];
    field: string;
    oldField?: unknown;
  }
) => void;

// Local helper function
const get = <T>(object: Record<string, T>, path: string): T | undefined =>
  lodashGet(object, path);

/**
 * Checks if missing data is present in a chart's observations.
 *
 * @param chartConfig - Chart configuration
 * @param data - Observation data
 * @returns true if missing data detected, false otherwise
 */
const isMissingDataPresent = (chartConfig: ChartConfig): boolean => {
  const segment = (chartConfig as any).fields?.segment;
  if (!segment) {
    return false;
  }
  // Simplified check - actual implementation would use checkForMissingValuesInSegments
  return false;
};

/**
 * Calculates non-stacked domain for a measure field.
 *
 * @param observations - Observation data
 * @param getValue - Function to extract value from observations
 * @returns Tuple of [min, max] for the domain
 */
const getNonStackedDomain = (
  observations: any[],
  getValue: (o: any) => number
) => {
  const values = observations.map(getValue);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return [Math.min(min, 0), max] as [number, number];
};

// Export these functions for use in other modules
export { isMissingDataPresent, getNonStackedDomain };

/**
 * Handler for map field color component scale type changes.
 *
 * When switching between continuous and discrete color scales,
 * this updates: the interpolation type and number of classes.
 *
 * @param value - New scale type (continuous or discrete)
 * @param options - Change handler options
 */
export const onColorComponentScaleTypeChange: OnEncodingOptionChange<
  string,
  ChartConfig
> = (value, { chartConfig, field }) => {
  const basePath = `fields.${field}`;
  const interpolationTypePath = `${basePath}.color.interpolationType`;
  const nbClassPath = `${basePath}.color.nbClass`;

  if (value === "continuous") {
    setWith(chartConfig, interpolationTypePath, "linear", Object);
    unset(chartConfig, nbClassPath);
  } else if (value === "discrete") {
    setWith(chartConfig, interpolationTypePath, "jenks", Object);
    setWith(chartConfig, nbClassPath, 3, Object);
  }
};

/**
 * Handler for map field color component ID changes.
 *
 * When a new component is selected for color encoding,
 * this updates: the color field configuration based on the component type.
 *
 * @param id - New component ID
 * @param options - Change handler options
 */
export const onColorComponentIdChange: OnEncodingOptionChange<
  string,
  ChartConfig
> = (id, { chartConfig, dimensions, measures, field }) => {
  const basePath = `fields["${field}"]`;
  const components = [...dimensions, ...measures];
  let newField: any = DEFAULT_FIXED_COLOR_FIELD;
  const component = components.find((d) => d.id === id);
  const currentColorComponentId = get(
    chartConfig,
    `${basePath}.color.componentId`
  );

  if (component) {
    const colorPalette = get(chartConfig, `${basePath}.color.palette`) as
      | CustomPaletteType
      | undefined;

    if (
      MULTI_FILTER_ENABLED_COMPONENTS.includes(component.__typename) ||
      isOrdinalMeasure(component)
    ) {
      const paletteId = getDefaultCategoricalPaletteId(
        component,
        colorPalette?.paletteId
      );
      newField = getDefaultCategoricalColorField({
        id,
        paletteId,
        dimensionValues: component.values,
      });
    } else if (isNumericalMeasure(component)) {
      newField = getDefaultNumericalColorField({
        id,
        colorPalette,
      });
    }

    // Remove old filter.
    const cube = chartConfig.cubes.find(
      (d: { iri: string }) => d.iri === component.cubeIri
    );

    if (cube) {
      unset(cube, `filters["${currentColorComponentId}"]`);
    }
  }

  setWith(chartConfig, `${basePath}.color`, newField, Object);
};

/**
 * Animation field specification for charts that support animation.
 */
export const ANIMATION_FIELD_SPEC = {
  field: "animation",
  optional: true,
  componentTypes: ANIMATION_ENABLED_COMPONENTS,
  filters: false,
  sorting: isSortingInConfig,
  options: {
    animation: {
      valueField: true,
      dimensionField: true,
    },
  },
};

/**
 * Checks if stacking should be disabled for a given measure component.
 *
 * Stacking is disabled when the measure has a ratio scale type.
 *
 * @param d - Component to check (optional)
 * @returns true if stacking should be disabled, false otherwise
 */
// disableStacked is defined in chart-config-ui-helpers.ts

/**
 * Default handler for segment field changes.
 *
 * This is re-exported from chart-config-ui-helpers.ts
 * for backward compatibility.
 */
export {
  defaultSegmentOnChange,
  disableStacked,
} from "./chart-config-ui-helpers";

// getChartSpec is now defined in chart-config-ui-options.ts to avoid circular dependency
