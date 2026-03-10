import { usePlottableData } from "@/charts/shared/chart-helpers";
import {
  BaseVariables,
  ChartStateData,
  RenderingVariables,
  useBaseVariables,
  useChartData,
} from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { useChartConfigFilters } from "@/config-utils";

import { ChartProps } from "../shared/chart-props";

import { SankeyConfig } from "./sankey-types";

/**
 * Variables for source node field extraction.
 */
export type SankeySourceVariables = {
  sourceDimension: string;
  getSource: (d: Record<string, unknown>) => string;
};

/**
 * Variables for target node field extraction.
 */
export type SankeyTargetVariables = {
  targetDimension: string;
  getTarget: (d: Record<string, unknown>) => string;
};

/**
 * Variables for value field extraction.
 */
export type SankeyValueVariables = {
  valueMeasure: string;
  getValue: (d: Record<string, unknown>) => number | null;
};

/**
 * Combined state variables for sankey chart.
 */
export type SankeyStateVariables = BaseVariables &
  RenderingVariables &
  SankeySourceVariables &
  SankeyTargetVariables &
  SankeyValueVariables;

/**
 * Hook to extract state variables from sankey config.
 */
export const useSankeyStateVariables = (
  props: ChartProps<SankeyConfig>
): SankeyStateVariables => {
  const { chartConfig, dimensions, filters } = props;
  const { fields } = chartConfig;
  const { links, animation } = fields;
  const configFilters = useChartConfigFilters(chartConfig);

  const baseVariables = useBaseVariables(chartConfig);

  // Extract source, target, and value field component IDs
  const sourceDimension = links.source.componentId;
  const targetDimension = links.target.componentId;
  const valueMeasure = links.value.componentId;

  // Create getter functions for source, target, and value
  const getSource = (d: Record<string, unknown>) => {
    return String(d[sourceDimension] ?? "");
  };

  const getTarget = (d: Record<string, unknown>) => {
    return String(d[targetDimension] ?? "");
  };

  const getValue = (d: Record<string, unknown>) => {
    const val = d[valueMeasure];
    return typeof val === "number" ? val : null;
  };

  const getRenderingKey = useRenderingKeyVariable(
    dimensions,
    configFilters,
    animation
  );

  return {
    ...baseVariables,
    sourceDimension,
    targetDimension,
    valueMeasure,
    getSource,
    getTarget,
    getValue,
    getRenderingKey,
  };
};

/**
 * Hook to process data for sankey chart.
 */
export const useSankeyStateData = (
  chartProps: ChartProps<SankeyConfig>,
  variables: SankeyStateVariables
): ChartStateData => {
  const { chartConfig, observations } = chartProps;
  const { getValue } = variables;

  const plottableData = usePlottableData(observations, {
    getY: getValue,
  });

  return useChartData(plottableData, {
    chartConfig,
    timeRangeDimensionId: undefined,
    getSegmentAbbreviationOrLabel: (d) => String(d),
  });
};
