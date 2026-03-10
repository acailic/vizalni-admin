import { memo, useCallback, useState } from "react";

import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
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
import { LegendColor } from "@/charts/shared/legend-color";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { Sunburst, SunburstBreadcrumb } from "@/charts/sunburst/sunburst";
import {
  BreadcrumbItem,
  SunburstChart,
  SunburstState,
} from "@/charts/sunburst/sunburst-state";
import { SunburstConfig } from "@/charts/sunburst/sunburst-types";
import { OnlyNegativeDataHint } from "@/components/hint";
import { useChartConfigFilters } from "@/config-utils";
import { TimeSlider } from "@/configurator/interactive-filters/time-slider";

import { ChartProps, VisualizationProps } from "../shared/chart-props";

export const ChartSunburstVisualization = (
  props: VisualizationProps<SunburstConfig>
) => {
  return <ChartDataWrapper {...props} Component={ChartSunburst} />;
};

const ChartSunburst = memo((props: ChartProps<SunburstConfig>) => {
  const { chartConfig, observations, dimensions, dimensionsById } = props;
  const { fields, interactiveFiltersConfig } = chartConfig;
  const somePositive = observations.some(
    (d) => (d[fields?.size?.componentId] as number) > 0
  );
  const filters = useChartConfigFilters(chartConfig);
  const isEditingAnnotation = useIsEditingAnnotation();

  if (!somePositive) {
    return <OnlyNegativeDataHint />;
  }

  return (
    <SunburstChart {...props}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightTitle />
          <SunburstWithBreadcrumb />
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
            showTitle={fields.hierarchy?.[0]?.componentId ? true : false}
          />
        )}
      </ChartControlsContainer>
    </SunburstChart>
  );
});

ChartSunburst.displayName = "ChartSunburst";

/**
 * Sunburst with breadcrumb navigation wrapper
 */
const SunburstWithBreadcrumb = () => {
  const { bounds, breadcrumbData } = useChartState() as SunburstState;
  const { fontFamily } = useChartTheme();
  const [activeBreadcrumb, setActiveBreadcrumb] =
    useState<BreadcrumbItem | null>(null);

  const handleBreadcrumbClick = useCallback((item: BreadcrumbItem) => {
    setActiveBreadcrumb(item);
    // Reset after click to allow re-clicking
    setTimeout(() => setActiveBreadcrumb(null), 100);
  }, []);

  // Get visual options from config
  const showBreadcrumb = true; // Default to showing breadcrumb

  return (
    <>
      {showBreadcrumb && breadcrumbData.length > 0 && (
        <g
          transform={`translate(${bounds.margins.left + 10}, ${bounds.margins.top - 30})`}
        >
          <SunburstBreadcrumb
            items={breadcrumbData}
            onItemClick={handleBreadcrumbClick}
            fontFamily={fontFamily}
          />
        </g>
      )}
      <Sunburst />
    </>
  );
};
