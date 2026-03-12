import { memo } from "react";

import { LineConfig } from "../../config-types";
import { useLimits } from "../../config-utils";
import {
  hasChartConfigs,
  useConfiguratorState,
} from "../../configurator/configurator-state";
import { ChartDataWrapper } from "../chart-data-wrapper";
import { useIsEditingAnnotation } from "../shared/annotation-utils";
import { Annotations } from "../shared/annotations";
import { AxisHeightLinear } from "../shared/axis-height-linear";
import { AxisHideXOverflowRect } from "../shared/axis-hide-overflow-rect";
import { AxisTime, AxisTimeDomain } from "../shared/axis-width-time";
import { BrushTime, shouldShowBrush } from "../shared/brush";
import { ChartProps, VisualizationProps } from "../shared/chart-props";
import {
  ChartContainer,
  ChartControlsContainer,
  ChartSvg,
} from "../shared/containers";
import { HoverAnnotationDot } from "../shared/interaction/hover-annotation-dot";
import { HoverDotMultiple } from "../shared/interaction/hover-dots-multiple";
import { Ruler } from "../shared/interaction/ruler";
import { Tooltip } from "../shared/interaction/tooltip";
import { LegendColor } from "../shared/legend-color";
import { VerticalLimits } from "../shared/limits/vertical";
import { InteractionHorizontal } from "../shared/overlay-horizontal";
import { InteractionVoronoi } from "../shared/overlay-voronoi";

import { ErrorWhiskers, Lines } from "./lines";
import { LineChart } from "./lines-state";

export const ChartLinesVisualization = (
  props: VisualizationProps<LineConfig>
) => {
  return <ChartDataWrapper {...props} Component={ChartLines} />;
};

const ChartLines = memo((props: ChartProps<LineConfig>) => {
  const { chartConfig, dimensions, measures, dimensionsById } = props;
  const { fields, interactiveFiltersConfig } = chartConfig;
  const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
  const limits = useLimits({
    chartConfig,
    dimensions,
    measures,
  });
  const isEditingAnnotation = useIsEditingAnnotation();

  return (
    <LineChart {...props} limits={limits}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightLinear />
          <AxisHideXOverflowRect />
          <AxisTime />
          <AxisTimeDomain />
          <Lines
            dotSize={
              "showDots" in chartConfig.fields.y &&
              "showDotsSize" in chartConfig.fields.y &&
              chartConfig.fields.y.showDots
                ? chartConfig.fields.y.showDotsSize
                : undefined
            }
          />
          <ErrorWhiskers />
          <VerticalLimits {...limits} />
          {isEditingAnnotation ? (
            <InteractionVoronoi />
          ) : (
            <InteractionHorizontal />
          )}
          {shouldShowBrush(
            interactiveFiltersConfig,
            dashboardFilters?.timeRange
          ) && <BrushTime />}
        </ChartSvg>
        <Ruler />
        {isEditingAnnotation ? <HoverAnnotationDot /> : <HoverDotMultiple />}
        <Tooltip type={fields.segment ? "multiple" : "single"} />
      </ChartContainer>
      <Annotations />
      {(fields.segment || limits.limits.length > 0) && (
        <ChartControlsContainer>
          <LegendColor
            dimensionsById={dimensionsById}
            chartConfig={chartConfig}
            symbol="line"
            interactive={interactiveFiltersConfig.legend.active}
            showTitle={fields.segment?.showTitle}
            limits={limits}
          />
        </ChartControlsContainer>
      )}
    </LineChart>
  );
});
