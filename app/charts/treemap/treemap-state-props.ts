import { usePlottableData } from "@/charts/shared/chart-helpers";
import {
  BaseVariables,
  ChartStateData,
  NumericalYVariables,
  RenderingVariables,
  SegmentVariables,
  useBaseVariables,
  useChartData,
  useNumericalYVariables,
  useSegmentVariables,
} from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { TreemapConfig } from "@/charts/treemap/treemap-types";
import { useChartConfigFilters } from "@/config-utils";

import { ChartProps } from "../shared/chart-props";

export type TreemapStateVariables = BaseVariables &
  NumericalYVariables &
  SegmentVariables &
  RenderingVariables;

export const useTreemapStateVariables = (
  props: ChartProps<TreemapConfig>
): TreemapStateVariables => {
  const {
    chartConfig,
    observations,
    dimensions,
    dimensionsById,
    measuresById,
  } = props;
  const { fields } = chartConfig;
  const { y, segment, animation } = fields;
  const filters = useChartConfigFilters(chartConfig);

  const baseVariables = useBaseVariables(chartConfig);
  const numericalYVariables = useNumericalYVariables("pie", y, {
    measuresById,
  });
  const segmentVariables = useSegmentVariables(segment, {
    dimensionsById,
    observations,
  });

  const getRenderingKey = useRenderingKeyVariable(
    dimensions,
    filters,
    animation
  );

  return {
    ...baseVariables,
    ...numericalYVariables,
    ...segmentVariables,
    getRenderingKey,
  };
};

export const useTreemapStateData = (
  chartProps: ChartProps<TreemapConfig>,
  variables: TreemapStateVariables
): ChartStateData => {
  const { chartConfig, observations } = chartProps;
  const { getY, getSegmentAbbreviationOrLabel } = variables;
  const plottableData = usePlottableData(observations, {
    getY,
  });

  return useChartData(plottableData, {
    chartConfig,
    timeRangeDimensionId: undefined,
    getSegmentAbbreviationOrLabel,
  });
};
