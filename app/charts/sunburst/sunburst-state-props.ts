import { usePlottableData } from "@/charts/shared/chart-helpers";
import {
  BaseVariables,
  ChartStateData,
  NumericalYVariables,
  RenderingVariables,
  useBaseVariables,
  useChartData,
  useNumericalYVariables,
} from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { useChartConfigFilters } from "@/config-utils";

import { ChartProps } from "../shared/chart-props";

import { SunburstConfig, SunburstHierarchyField } from "./sunburst-types";

/**
 * Variables for hierarchy level extraction.
 */
export type SunburstHierarchyVariables = {
  hierarchyLevels: SunburstHierarchyField[];
  getHierarchyValue: (d: Record<string, unknown>, level: number) => string;
};

/**
 * Combined state variables for sunburst chart.
 */
export type SunburstStateVariables = BaseVariables &
  NumericalYVariables &
  RenderingVariables &
  SunburstHierarchyVariables;

/**
 * Hook to extract state variables from sunburst config.
 */
export const useSunburstStateVariables = (
  props: ChartProps<SunburstConfig>
): SunburstStateVariables => {
  const { chartConfig, dimensions, measuresById } = props;
  const { fields } = chartConfig;
  const { hierarchy, size, animation } = fields;
  const filters = useChartConfigFilters(chartConfig);

  const baseVariables = useBaseVariables(chartConfig);

  // Use "pie" chart type for numerical Y variables (similar to treemap)
  const numericalYVariables = useNumericalYVariables("pie", size, {
    measuresById,
  });

  // Extract hierarchy levels
  const hierarchyLevels = hierarchy;

  // Create getter function for hierarchy values
  const getHierarchyValue = (d: Record<string, unknown>, level: number) => {
    if (level >= hierarchyLevels.length) {
      return "";
    }
    const componentId = hierarchyLevels[level].componentId;
    return String(d[componentId] ?? "");
  };

  const getRenderingKey = useRenderingKeyVariable(
    dimensions,
    filters,
    animation
  );

  return {
    ...baseVariables,
    ...numericalYVariables,
    hierarchyLevels,
    getHierarchyValue,
    getRenderingKey,
  };
};

/**
 * Hook to process data for sunburst chart.
 */
export const useSunburstStateData = (
  chartProps: ChartProps<SunburstConfig>,
  variables: SunburstStateVariables
): ChartStateData => {
  const { chartConfig, observations } = chartProps;
  const { getY } = variables;

  const plottableData = usePlottableData(observations, {
    getY,
  });

  return useChartData(plottableData, {
    chartConfig,
    timeRangeDimensionId: undefined,
    getSegmentAbbreviationOrLabel: (d) => String(d),
  });
};
