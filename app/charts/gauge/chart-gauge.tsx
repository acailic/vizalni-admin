import { memo } from "react";

import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
import { Gauge } from "@/charts/gauge/gauge";
import { GaugeChart, GaugeState } from "@/charts/gauge/gauge-state";
import { GaugeConfig } from "@/charts/gauge/gauge-types";
import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { Annotations } from "@/charts/shared/annotations";
import { AxisHeightTitle } from "@/charts/shared/axis-height-title";
import { useChartState } from "@/charts/shared/chart-state";
import {
  ChartContainer,
  ChartControlsContainer,
  ChartSvg,
} from "@/charts/shared/containers";
import { HoverAnnotationDot } from "@/charts/shared/interaction/hover-annotation-dot";
import { Tooltip } from "@/charts/shared/interaction/tooltip";
import { useChartTheme } from "@/charts/shared/use-chart-theme";

import { ChartProps, VisualizationProps } from "../shared/chart-props";

export const ChartGaugeVisualization = (
  props: VisualizationProps<GaugeConfig>
) => {
  return <ChartDataWrapper {...props} Component={ChartGauge} />;
};

const ChartGauge = memo((props: ChartProps<GaugeConfig>) => {
  const { chartConfig } = props;
  const { interactiveFiltersConfig } = chartConfig;
  const isEditingAnnotation = useIsEditingAnnotation();

  return (
    <GaugeChart {...props}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightTitle />
          <Gauge />
        </ChartSvg>
        {isEditingAnnotation ? (
          <HoverAnnotationDot />
        ) : (
          <Tooltip type="single" />
        )}
      </ChartContainer>
      <Annotations />
      <ChartControlsContainer>
        {/* No controls for gauge */}
      </ChartControlsContainer>
    </GaugeChart>
  );
});

ChartGauge.displayName = "ChartGauge";

/**
 * Gauge with center label showing the current value
 */
export const GaugeWithLabel = () => {
  const { valueDisplay } = useChartState() as GaugeState;
  const { fontFamily } = useChartTheme();

  return (
    <>
      <Gauge />
      <text
        x={valueDisplay.x}
        y={valueDisplay.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={fontFamily}
        fontSize={valueDisplay.fontSize ?? 16}
        fontWeight={600}
        fill={valueDisplay.color ?? "#1f2937"}
      >
        {valueDisplay.formattedValue}
      </text>
    </>
  );
};
