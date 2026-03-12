import { ScaleOrdinal, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { PropsWithChildren, useCallback, useMemo } from "react";

import { GetAnnotationInfo } from "@/charts/shared/annotations";
import {
  AxisLabelSizeVariables,
  getChartWidth,
  useAxisLabelSizeVariables,
  useChartBounds,
} from "@/charts/shared/chart-dimensions";
import {
  ChartContext,
  ChartStateData,
  CommonChartState,
} from "@/charts/shared/chart-state";
import { TooltipInfo } from "@/charts/shared/interaction/tooltip";
import { useChartFormatters } from "@/charts/shared/use-chart-formatters";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { useSize } from "@/charts/shared/use-size";
import { Observation } from "@/domain/data";
import { formatNumberWithUnit, useFormatNumber } from "@/formatters";

import { ChartProps } from "../shared/chart-props";

import {
  GaugeStateVariables,
  useGaugeStateData,
  useGaugeStateVariables,
} from "./gauge-state-props";
import {
  GaugeArc,
  GaugeConfig,
  GaugeNeedle,
  GaugeThreshold,
  GaugeValueDisplayData,
} from "./gauge-types";

// Re-export types needed by gauge.tsx
export type { GaugeArc, GaugeValueDisplayData } from "./gauge-types";

/** Default colors for gauge thresholds */
const DEFAULT_THRESHOLD_COLORS = [
  "#22c55e", // green - good
  "#eab308", // yellow - warning
  "#ef4444", // red - critical
];

/** Default gauge arc color (gray background) */
const DEFAULT_ARC_COLOR = "#e5e7eb";

/**
 * Complete state for gauge chart rendering.
 */
export type GaugeState = CommonChartState &
  GaugeStateVariables & {
    chartType: "gauge";
    /** Current value to display */
    value: number;
    /** Minimum value of the scale */
    min: number;
    /** Maximum value of the scale */
    max: number;
    /** Arc segments for the gauge */
    arcs: GaugeArc[];
    /** Needle configuration */
    needle: GaugeNeedle;
    /** Value display configuration */
    valueDisplay: GaugeValueDisplayData;
    /** Color scale for threshold colors */
    colors: ScaleOrdinal<string, string>;
    /** Radius of the gauge */
    radius: number;
    /** Inner radius for donut-style gauge */
    innerRadius: number;
    /** Center X position */
    centerX: number;
    /** Center Y position */
    centerY: number;
    /** Get annotation info for a data point */
    getAnnotationInfo: GetAnnotationInfo;
    /** Get tooltip info for a data point */
    getTooltipInfo: (d: Observation) => TooltipInfo;
    /** Axis label size variables */
    leftAxisLabelSize: AxisLabelSizeVariables;
    /** Axis label offset from top */
    leftAxisLabelOffsetTop: number;
  };

/**
 * Hook to compute gauge state from props and variables.
 */
const useGaugeState = (
  chartProps: ChartProps<GaugeConfig>,
  variables: GaugeStateVariables,
  data: ChartStateData
): GaugeState => {
  const { chartConfig } = chartProps;
  const { yMeasure, getY, yAxisLabel } = variables;
  const { chartData, allData } = data;

  const { width, height } = useSize();
  const formatNumber = useFormatNumber();
  const formatters = useChartFormatters(chartProps);

  // Get visual options with defaults
  const visualOptions = chartConfig.visualOptions;
  const min = visualOptions?.min ?? 0;
  const max = visualOptions?.max ?? 100;
  const startAngle = (visualOptions?.startAngle ?? -135) * (Math.PI / 180);
  const endAngle = (visualOptions?.endAngle ?? 135) * (Math.PI / 180);
  const thresholds = visualOptions?.thresholds;

  // Dimensions
  const left = 40;
  const right = left;
  const leftAxisLabelSize = useAxisLabelSizeVariables({
    label: yAxisLabel,
    width,
  });
  const baseYMargin = 50;
  const margins = {
    top: baseYMargin + leftAxisLabelSize.offset,
    right,
    bottom: baseYMargin,
    left,
  };
  const chartWidth = getChartWidth({ width, left, right });
  const bounds = useChartBounds({ width, chartWidth, height, margins });

  // Calculate radius based on available space
  const radius = useMemo(() => {
    return Math.min(bounds.chartWidth, bounds.chartHeight) / 2;
  }, [bounds.chartWidth, bounds.chartHeight]);

  // Inner radius - 70% of outer radius for donut effect
  const innerRadius = useMemo(() => {
    return radius * 0.7;
  }, [radius]);

  // Center position
  const centerX = useMemo(() => {
    return bounds.chartWidth / 2;
  }, [bounds.chartWidth]);

  const centerY = useMemo(() => {
    return bounds.chartHeight / 2;
  }, [bounds.chartHeight]);

  // Extract the value from chart data
  const value = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }
    // For gauge, we typically use the first (or only) data point
    const yValue = getY(chartData[0]);
    return yValue ?? 0;
  }, [chartData, getY]);

  // Create color scale for thresholds
  const colors = useMemo(() => {
    const colorScale = scaleOrdinal<string, string>();

    if (thresholds && thresholds.length > 0) {
      const thresholdValues = thresholds.map((t) => String(t.value));
      const thresholdColors = thresholds.map((t) => t.color);
      colorScale.domain(thresholdValues);
      colorScale.range(thresholdColors);
    } else {
      // Default colors if no thresholds specified
      colorScale.domain(["0", "50", "100"]);
      colorScale.range(DEFAULT_THRESHOLD_COLORS);
    }

    colorScale.unknown(() => undefined);
    return colorScale;
  }, [thresholds]);

  // Calculate arc segments
  const arcs = useMemo((): GaugeArc[] => {
    const totalAngle = endAngle - startAngle;
    const angleRange = max - min;

    if (thresholds && thresholds.length > 0) {
      // Create arcs based on thresholds
      const result: GaugeArc[] = [];

      // Add background arc (full gauge)
      result.push({
        startAngle,
        endAngle,
        innerRadius,
        outerRadius: radius,
        color: DEFAULT_ARC_COLOR,
        label: "background",
        value: undefined,
      });

      // Add threshold arcs
      let prevValue = min;
      const sortedThresholds = [...thresholds].sort(
        (a, b) => a.value - b.value
      );

      sortedThresholds.forEach((threshold) => {
        const startValue = prevValue;
        const endValue = threshold.value;
        const arcStartAngle =
          startAngle + ((startValue - min) / angleRange) * totalAngle;
        const arcEndAngle =
          startAngle + ((endValue - min) / angleRange) * totalAngle;

        result.push({
          startAngle: arcStartAngle,
          endAngle: arcEndAngle,
          innerRadius,
          outerRadius: radius,
          color: threshold.color,
          label: threshold.label,
          value: threshold.value,
        });

        prevValue = endValue;
      });

      return result;
    } else {
      // Simple arc - background + value arc
      const valueAngle = startAngle + ((value - min) / angleRange) * totalAngle;

      return [
        // Background arc
        {
          startAngle,
          endAngle,
          innerRadius,
          outerRadius: radius,
          color: DEFAULT_ARC_COLOR,
          label: "background",
        },
        // Value arc
        {
          startAngle,
          endAngle: valueAngle,
          innerRadius,
          outerRadius: radius,
          color: schemeCategory10[0],
          label: "value",
          value,
        },
      ];
    }
  }, [startAngle, endAngle, min, max, innerRadius, radius, thresholds, value]);

  // Calculate needle configuration
  const needle = useMemo((): GaugeNeedle => {
    const totalAngle = endAngle - startAngle;
    const angleRange = max - min;

    // Clamp value to valid range
    const clampedValue = Math.max(min, Math.min(max, value));

    // Calculate needle angle
    const angle = startAngle + ((clampedValue - min) / angleRange) * totalAngle;

    return {
      value: clampedValue,
      angle,
      length: 0.8, // 80% of radius
      baseWidth: 8,
      color: "#374151", // dark gray
    };
  }, [startAngle, endAngle, min, max, value]);

  // Value formatter
  const valueFormatter = useCallback(
    (val: number | null) => {
      if (val === null) {
        return "-";
      }
      return formatNumberWithUnit(
        val,
        formatters[yMeasure.id] ?? formatNumber,
        yMeasure.unit
      );
    },
    [formatters, formatNumber, yMeasure]
  );

  // Value display configuration
  const valueDisplay = useMemo((): GaugeValueDisplayData => {
    return {
      formattedValue: valueFormatter(value),
      rawValue: value,
      x: centerX,
      y: centerY + radius * 0.3, // Position below center
      fontSize: Math.max(16, radius * 0.15),
      color: "#1f2937", // dark gray
    };
  }, [valueFormatter, value, centerX, centerY, radius]);

  // Get active threshold for the current value
  const getActiveThreshold = useCallback((): GaugeThreshold | undefined => {
    if (!thresholds || thresholds.length === 0) {
      return undefined;
    }

    const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

    // Find the threshold that the current value falls into
    for (let i = sortedThresholds.length - 1; i >= 0; i--) {
      if (value >= sortedThresholds[i].value) {
        return sortedThresholds[i];
      }
    }

    return undefined;
  }, [thresholds, value]);

  const activeThreshold = getActiveThreshold();

  const getAnnotationInfo: GetAnnotationInfo = useCallback(
    (_observation, { segment: _segment }) => {
      return {
        x: centerX,
        y: centerY,
        color: activeThreshold?.color ?? schemeCategory10[0],
      };
    },
    [centerX, centerY, activeThreshold]
  );

  const getTooltipInfo = useCallback(
    (datum: Observation): TooltipInfo => {
      const datumValue = getY(datum);

      return {
        xAnchor: centerX,
        yAnchor: centerY - radius * 0.3,
        placement: { x: "center", y: "top" },
        value: yAxisLabel,
        datum: {
          value: valueFormatter(datumValue),
          color: activeThreshold?.color ?? schemeCategory10[0],
        },
        values: undefined,
        withTriangle: false,
      };
    },
    [
      centerX,
      centerY,
      radius,
      yAxisLabel,
      getY,
      valueFormatter,
      activeThreshold,
    ]
  );

  return {
    chartType: "gauge",
    bounds,
    chartData,
    allData,
    value,
    min,
    max,
    arcs,
    needle,
    valueDisplay,
    colors,
    radius,
    innerRadius,
    centerX,
    centerY,
    getAnnotationInfo,
    getTooltipInfo,
    leftAxisLabelSize,
    leftAxisLabelOffsetTop: 0,
    ...variables,
  };
};

/**
 * Internal provider component for gauge chart state.
 */
const GaugeChartProvider = (
  props: PropsWithChildren<ChartProps<GaugeConfig>>
) => {
  const { children, ...chartProps } = props;
  const variables = useGaugeStateVariables(chartProps);
  const data = useGaugeStateData(chartProps, variables);
  const state = useGaugeState(chartProps, variables, data);

  return (
    <ChartContext.Provider value={state}>{children}</ChartContext.Provider>
  );
};

/**
 * Main gauge chart component that provides state context.
 */
export const GaugeChart = (
  props: PropsWithChildren<ChartProps<GaugeConfig>>
) => {
  return (
    <InteractionProvider>
      <GaugeChartProvider {...props} />
    </InteractionProvider>
  );
};
