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

import { GaugeConfig } from "./gauge-types";

/**
 * Combined state variables for gauge chart.
 */
export type GaugeStateVariables = BaseVariables &
  NumericalYVariables &
  RenderingVariables;

/**
 * Hook to extract state variables from gauge config.
 */
export const useGaugeStateVariables = (
  props: ChartProps<GaugeConfig>
): GaugeStateVariables => {
  const { chartConfig, dimensions, measuresById } = props;
  const { fields } = chartConfig;
  const { value, animation } = fields;
  const filters = useChartConfigFilters(chartConfig);

  const baseVariables = useBaseVariables(chartConfig);

  // Use "pie" chart type for numerical Y variables (similar to sunburst)
  const numericalYVariables = useNumericalYVariables("pie", value, {
    measuresById,
  });

  const getRenderingKey = useRenderingKeyVariable(
    dimensions,
    filters,
    animation
  );

  return {
    ...baseVariables,
    ...numericalYVariables,
    getRenderingKey,
  };
};

/**
 * Hook to process data for gauge chart.
 */
export const useGaugeStateData = (
  chartProps: ChartProps<GaugeConfig>,
  variables: GaugeStateVariables
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
