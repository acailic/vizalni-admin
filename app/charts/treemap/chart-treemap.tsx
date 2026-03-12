import { memo } from "react";

import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { Annotations } from "@/charts/shared/annotations";
import { AxisHeightTitle } from "@/charts/shared/axis-height-title";
import {
  ChartContainer,
  ChartControlsContainer,
  ChartSvg,
} from "@/charts/shared/containers";
import { HoverAnnotationDot } from "@/charts/shared/interaction/hover-annotation-dot";
import { Tooltip } from "@/charts/shared/interaction/tooltip";
import { LegendColor } from "@/charts/shared/legend-color";
import { Treemap } from "@/charts/treemap/treemap";
import { TreemapChart } from "@/charts/treemap/treemap-state";
import { TreemapConfig } from "@/charts/treemap/treemap-types";
import { OnlyNegativeDataHint } from "@/components/hint";
import { useChartConfigFilters } from "@/config-utils";
import { TimeSlider } from "@/configurator/interactive-filters/time-slider";

import { ChartProps, VisualizationProps } from "../shared/chart-props";

export const ChartTreemapVisualization = (
  props: VisualizationProps<TreemapConfig>
) => {
  return <ChartDataWrapper {...props} Component={ChartTreemap} />;
};

const ChartTreemap = memo((props: ChartProps<TreemapConfig>) => {
  const { chartConfig, observations, dimensions, dimensionsById } = props;
  const { fields, interactiveFiltersConfig } = chartConfig;
  const somePositive = observations.some(
    (d) => (d[fields?.y?.componentId] as number) > 0
  );
  const filters = useChartConfigFilters(chartConfig);
  const isEditingAnnotation = useIsEditingAnnotation();

  if (!somePositive) {
    return <OnlyNegativeDataHint />;
  }

  return (
    <TreemapChart {...props}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightTitle />
          <Treemap />
        </ChartSvg>
        {isEditingAnnotation ? (
          <HoverAnnotationDot />
        ) : (
          <Tooltip type="single" />
        )}
      </ChartContainer>
      <Annotations />
      <ChartControlsContainer>
        {fields.animation && (
          <TimeSlider
            filters={filters}
            dimensions={dimensions}
            {...fields.animation}
          />
        )}
        <LegendColor
          dimensionsById={dimensionsById}
          chartConfig={chartConfig}
          symbol="square"
          interactive={fields.segment && interactiveFiltersConfig.legend.active}
          showTitle={fields.segment.showTitle}
        />
      </ChartControlsContainer>
    </TreemapChart>
  );
});

ChartTreemap.displayName = "ChartTreemap";
