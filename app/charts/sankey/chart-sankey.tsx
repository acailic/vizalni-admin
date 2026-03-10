import { memo } from "react";

import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
import { Sankey } from "@/charts/sankey/sankey";
import { SankeyChart } from "@/charts/sankey/sankey-state";
import { SankeyConfig } from "@/charts/sankey/sankey-types";
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
import { OnlyNegativeDataHint } from "@/components/hint";
import { useChartConfigFilters } from "@/config-utils";
import { TimeSlider } from "@/configurator/interactive-filters/time-slider";

import { ChartProps, VisualizationProps } from "../shared/chart-props";

export const ChartSankeyVisualization = (
  props: VisualizationProps<SankeyConfig>
) => {
  return <ChartDataWrapper {...props} Component={ChartSankey} />;
};

const ChartSankey = memo((props: ChartProps<SankeyConfig>) => {
  const { chartConfig, observations, dimensions, dimensionsById } = props;
  const { fields, interactiveFiltersConfig } = chartConfig;
  const somePositive = observations.some(
    (d) => (d[fields?.links?.value?.componentId] as number) > 0
  );
  const filters = useChartConfigFilters(chartConfig);
  const isEditingAnnotation = useIsEditingAnnotation();

  if (!somePositive) {
    return <OnlyNegativeDataHint />;
  }

  return (
    <SankeyChart {...props}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightTitle />
          <Sankey />
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
        {fields.color && (
          <LegendColor
            dimensionsById={dimensionsById}
            chartConfig={chartConfig}
            symbol="square"
            interactive={interactiveFiltersConfig.legend.active}
            showTitle={fields.color.showTitle}
          />
        )}
      </ChartControlsContainer>
    </SankeyChart>
  );
});

ChartSankey.displayName = "ChartSankey";
