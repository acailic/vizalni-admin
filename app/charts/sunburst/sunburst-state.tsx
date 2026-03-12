import { hierarchy, partition, HierarchyRectangularNode } from "d3-hierarchy";
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
import { getPalette } from "@/palettes";

import { ChartProps } from "../shared/chart-props";

import {
  SunburstStateVariables,
  useSunburstStateData,
  useSunburstStateVariables,
} from "./sunburst-state-props";
import { SunburstConfig } from "./sunburst-types";

/** Data node for sunburst hierarchy */
export interface SunburstDataNode {
  id: string;
  name: string;
  value: number;
  depth: number;
  observation?: Observation;
  children?: SunburstDataNode[];
}

export type SunburstState = CommonChartState &
  SunburstStateVariables & {
    chartType: "sunburst";
    nodes: HierarchyRectangularNode<SunburstDataNode>[];
    colors: ScaleOrdinal<string, string>;
    getColorLabel: (segment: string) => string;
    getAnnotationInfo: GetAnnotationInfo;
    getTooltipInfo: (d: Observation) => TooltipInfo;
    leftAxisLabelSize: AxisLabelSizeVariables;
    leftAxisLabelOffsetTop: number;
    maxDepth: number;
    breadcrumbData: BreadcrumbItem[];
    radius: number;
    innerRadius: number;
  };

/** Breadcrumb item for navigation */
export interface BreadcrumbItem {
  id: string;
  name: string;
  depth: number;
}

const useSunburstState = (
  chartProps: ChartProps<SunburstConfig>,
  variables: SunburstStateVariables,
  data: ChartStateData
): SunburstState => {
  const { chartConfig } = chartProps;
  const { yMeasure, getY, hierarchyLevels, getHierarchyValue, yAxisLabel } =
    variables;
  const { chartData, allData } = data;
  const { fields } = chartConfig;

  const { width, height } = useSize();
  const formatNumber = useFormatNumber();
  const formatters = useChartFormatters(chartProps);

  // Get visual options with defaults
  const visualOptions = chartConfig.visualOptions;
  const innerRadiusRatio = visualOptions?.innerRadiusRatio ?? 0;
  const padAngle = visualOptions?.padAngle ?? 0;

  // Dimensions - sunburst is circular, so use the smaller dimension
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

  const innerRadius = useMemo(() => {
    return radius * innerRadiusRatio;
  }, [radius, innerRadiusRatio]);

  // Build hierarchy data from observations
  const hierarchyData = useMemo(() => {
    if (chartData.length === 0 || hierarchyLevels.length === 0) {
      return null;
    }

    // Build nested hierarchy structure
    const root: SunburstDataNode = {
      id: "root",
      name: "root",
      value: 0,
      depth: -1,
      children: [],
    };

    // Group data by hierarchy levels
    chartData.forEach((observation) => {
      let currentNode = root;

      hierarchyLevels.forEach((_, levelIndex) => {
        const levelValue = getHierarchyValue(observation, levelIndex);
        if (!levelValue) return;

        // Find or create child node
        let child = currentNode.children?.find((c) => c.name === levelValue);
        if (!child) {
          const isLeaf = levelIndex === hierarchyLevels.length - 1;
          child = {
            id: `${currentNode.id}-${levelValue}`,
            name: levelValue,
            value: isLeaf ? (getY(observation) ?? 0) : 0,
            depth: levelIndex,
            children: isLeaf ? undefined : [],
            observation: isLeaf ? observation : undefined,
          };
          if (!currentNode.children) {
            currentNode.children = [];
          }
          currentNode.children.push(child);
        }

        currentNode = child;
      });
    });

    return root;
  }, [chartData, hierarchyLevels, getHierarchyValue]);

  // Create partition layout and compute nodes
  const nodes = useMemo(() => {
    if (!hierarchyData || hierarchyData.children?.length === 0) {
      return [];
    }

    // Create d3 hierarchy
    const root = hierarchy<SunburstDataNode>(hierarchyData)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    // Create partition layout
    const partitionLayout = partition<SunburstDataNode>()
      .size([2 * Math.PI, radius - innerRadius])
      .padAngle(padAngle);

    const result = partitionLayout(root);

    // Return all nodes (excluding root)
    return result.descendants().filter((d) => d.depth > 0);
  }, [hierarchyData, radius, innerRadius, padAngle]);

  // Calculate max depth
  const maxDepth = useMemo(() => {
    if (nodes.length === 0) return 0;
    return Math.max(...nodes.map((n) => n.depth));
  }, [nodes]);

  // Get unique segment names for color scale
  const segmentNames = useMemo(() => {
    const names = new Set<string>();
    nodes.forEach((node) => {
      if (node.depth === 1) {
        names.add(node.data.name);
      }
    });
    return Array.from(names);
  }, [nodes]);

  // Create color scale
  const colors = useMemo(() => {
    const colorScale = scaleOrdinal<string, string>();

    if (fields.color) {
      colorScale.domain(segmentNames);
      colorScale.range(
        getPalette({
          paletteId: undefined,
          colorField: fields.color,
        })
      );
    } else {
      colorScale.domain(segmentNames);
      colorScale.range(schemeCategory10);
    }

    colorScale.unknown(() => undefined);
    return colorScale;
  }, [fields.color, segmentNames]);

  // Build breadcrumb data
  const breadcrumbData = useMemo((): BreadcrumbItem[] => {
    return [
      { id: "root", name: "All", depth: 0 },
      ...hierarchyLevels.map((level, index) => ({
        id: `level-${index}`,
        name: level.componentId,
        depth: index + 1,
      })),
    ];
  }, [hierarchyLevels]);

  const valueFormatter = useCallback(
    (value: number | null) => {
      if (value === null) {
        return "-";
      }
      return formatNumberWithUnit(
        value,
        formatters[yMeasure.id] ?? formatNumber,
        yMeasure.unit
      );
    },
    [formatters, formatNumber, yMeasure]
  );

  const getColorLabel = useCallback((segment: string) => {
    return segment;
  }, []);

  const getAnnotationInfo: GetAnnotationInfo = useCallback(
    (observation, { segment }) => {
      // Find the node corresponding to this observation
      const node = nodes.find((n) => n.data.observation === observation);

      if (!node) {
        return {
          x: bounds.chartWidth / 2,
          y: bounds.chartHeight / 2,
          color: colors(segment) as string,
        };
      }

      // Calculate center of the arc
      const angle = (node.x0 + node.x1) / 2 - Math.PI / 2;
      const r = (node.y0 + node.y1) / 2;
      const x = bounds.chartWidth / 2 + r * Math.cos(angle);
      const y = bounds.chartHeight / 2 + r * Math.sin(angle);

      return {
        x,
        y,
        color: colors(segment) as string,
      };
    },
    [nodes, bounds, colors]
  );

  const getTooltipInfo = useCallback(
    (datum: Observation): TooltipInfo => {
      const node = nodes.find((n) => n.data.observation === datum);

      let xAnchor = bounds.chartWidth / 2;
      let yAnchor = bounds.chartHeight / 2;

      if (node) {
        const angle = (node.x0 + node.x1) / 2 - Math.PI / 2;
        const r = node.y1; // Place at outer edge
        xAnchor = bounds.chartWidth / 2 + r * Math.cos(angle);
        yAnchor = bounds.chartHeight / 2 + r * Math.sin(angle);
      }

      const xPlacement = "center";
      const yPlacement = "top";

      // Build path from hierarchy
      const pathParts: string[] = [];
      hierarchyLevels.forEach((_, index) => {
        const value = getHierarchyValue(datum, index);
        if (value) pathParts.push(value);
      });

      return {
        xAnchor,
        yAnchor,
        placement: { x: xPlacement, y: yPlacement },
        value: pathParts.join(" > "),
        datum: {
          value: valueFormatter(getY(datum)),
          color: colors(getHierarchyValue(datum, 0)) as string,
        },
        values: undefined,
        withTriangle: false,
      };
    },
    [
      nodes,
      bounds,
      hierarchyLevels,
      getHierarchyValue,
      valueFormatter,
      getY,
      colors,
    ]
  );

  return {
    chartType: "sunburst",
    bounds,
    chartData,
    allData,
    nodes,
    colors,
    getColorLabel,
    getAnnotationInfo,
    getTooltipInfo,
    leftAxisLabelSize,
    leftAxisLabelOffsetTop: 0,
    maxDepth,
    breadcrumbData,
    radius,
    innerRadius,
    ...variables,
  };
};

const SunburstChartProvider = (
  props: PropsWithChildren<ChartProps<SunburstConfig>>
) => {
  const { children, ...chartProps } = props;
  const variables = useSunburstStateVariables(chartProps);
  const data = useSunburstStateData(chartProps, variables);
  const state = useSunburstState(chartProps, variables, data);

  return (
    <ChartContext.Provider value={state}>{children}</ChartContext.Provider>
  );
};

export const SunburstChart = (
  props: PropsWithChildren<ChartProps<SunburstConfig>>
) => {
  return (
    <InteractionProvider>
      <SunburstChartProvider {...props} />
    </InteractionProvider>
  );
};
