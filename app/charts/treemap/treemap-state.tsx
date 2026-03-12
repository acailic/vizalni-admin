import { sum } from "d3-array";
import { hierarchy, treemap, HierarchyRectangularNode } from "d3-hierarchy";
import { ScaleOrdinal, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import orderBy from "lodash/orderBy";
import { PropsWithChildren, useMemo } from "react";
import { useCallback } from "react";

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
import {
  TreemapStateVariables,
  useTreemapStateData,
  useTreemapStateVariables,
} from "@/charts/treemap/treemap-state-props";
import { TreemapConfig, TreemapTileType } from "@/charts/treemap/treemap-types";
import { Observation } from "@/domain/data";
import { formatNumberWithUnit, useFormatNumber } from "@/formatters";
import { getPalette } from "@/palettes";
import {
  getSortingOrders,
  makeDimensionValueSorters,
} from "@/utils/sorting-values";

import { ChartProps } from "../shared/chart-props";

export type TreemapState = CommonChartState &
  TreemapStateVariables & {
    chartType: "treemap";
    nodes: HierarchyRectangularNode<TreemapDataNode>[];
    segments: string[];
    colors: ScaleOrdinal<string, string>;
    getColorLabel: (segment: string) => string;
    getAnnotationInfo: GetAnnotationInfo;
    getTooltipInfo: (d: Observation) => TooltipInfo;
    leftAxisLabelSize: AxisLabelSizeVariables;
    leftAxisLabelOffsetTop: number;
  };

/** Data node for treemap hierarchy */
export interface TreemapDataNode {
  name: string;
  value: number;
  observation: Observation;
}

const useTreemapState = (
  chartProps: ChartProps<TreemapConfig>,
  variables: TreemapStateVariables,
  data: ChartStateData
): TreemapState => {
  const { chartConfig, dimensions, measures } = chartProps;
  const {
    yMeasure,
    getY,
    segmentDimension: _segmentDimension,
    segmentsByAbbreviationOrLabel,
    getSegment,
    getSegmentAbbreviationOrLabel,
    getSegmentLabel,
    yAxisLabel,
  } = variables;
  // Segment dimension is guaranteed to be present, because it is required.
  const segmentDimension = _segmentDimension!;
  const { chartData, segmentData, allData } = data;
  const { fields } = chartConfig;
  const { y } = fields;

  const { width, height } = useSize();
  const formatNumber = useFormatNumber();
  const formatters = useChartFormatters(chartProps);

  const segmentsByValue = useMemo(() => {
    return new Map(segmentDimension.values.map((d) => [d.value, d]));
  }, [segmentDimension.values]);

  // Map ordered segments to colors
  const segmentFilter = chartConfig.cubes.find(
    (d) => d.iri === segmentDimension.cubeIri
  )?.filters[segmentDimension.id];

  const { colors, allSegments, segments, ySum } = useMemo(() => {
    const colors = scaleOrdinal<string, string>();
    const measureBySegment = Object.fromEntries(
      segmentData.map((d) => [getSegment(d), getY(d)])
    );
    const allUniqueSegments = Object.entries(measureBySegment)
      .filter((x) => typeof x[1] === "number")
      .map((x) => x[0]);
    const uniqueSegments = Array.from(new Set(chartData.map(getSegment)));

    const sorting = fields.segment?.sorting;
    const sorters = makeDimensionValueSorters(segmentDimension, {
      sorting,
      measureBySegment,
      useAbbreviations: fields.segment?.useAbbreviations,
      dimensionFilter: segmentFilter,
    });

    const allSegments = orderBy(
      allUniqueSegments,
      sorters,
      getSortingOrders(sorters, sorting)
    );
    const segments = allSegments.filter((d) => uniqueSegments.includes(d));

    if (fields.segment && segmentDimension && fields.color) {
      const orderedSegmentLabelsAndColors = allSegments.map((segment) => {
        const dvIri =
          segmentsByAbbreviationOrLabel.get(segment)?.value ||
          segmentsByValue.get(segment)?.value ||
          "";

        return {
          label: segment,
          color:
            fields.color.type === "segment"
              ? (fields.color.colorMapping![dvIri] ?? schemeCategory10[0])
              : schemeCategory10[0],
        };
      });

      colors.domain(orderedSegmentLabelsAndColors.map((s) => s.label));
      colors.range(orderedSegmentLabelsAndColors.map((s) => s.color));
    } else {
      colors.domain(allSegments);
      colors.range(
        getPalette({
          paletteId: fields.color?.paletteId,
          colorField: fields.color,
        })
      );
    }
    // Do not let the scale be implicitly extended by children calling it
    // on unknown values
    colors.unknown(() => undefined);

    const ySum = sum(chartData, getY);

    return {
      colors,
      allSegments,
      segments,
      ySum,
    };
  }, [
    fields.color,
    fields.segment,
    getSegment,
    getY,
    segmentData,
    segmentDimension,
    segmentsByAbbreviationOrLabel,
    segmentsByValue,
    segmentFilter,
    chartData,
  ]);

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

  // Build treemap data
  const treemapData: TreemapDataNode[] = useMemo(() => {
    return chartData.map((d) => ({
      name: getSegment(d),
      value: getY(d) ?? 0,
      observation: d,
    }));
  }, [chartData, getSegment, getY]);

  // Create hierarchy and treemap layout
  const nodes = useMemo(() => {
    if (treemapData.length === 0) {
      return [];
    }

    // Create root node with children
    const root = hierarchy<TreemapDataNode>({
      name: "root",
      value: 0,
      observation: {} as Observation,
      children: treemapData,
    })
      .sum((d) => d.value)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    // Get tile type from config
    const tileType: TreemapTileType = fields.tile ?? "squarify";

    // Create treemap layout with configurable tile type
    const treemapLayout = treemap<TreemapDataNode>()
      .size([chartWidth, bounds.chartHeight])
      .padding(2)
      .round(true);

    // Apply the tile strategy based on configuration
    // Note: d3-hierarchy supports different tile functions
    // For now, we use the default squarify which is the default
    // Additional tile types can be configured by importing specific tile functions
    switch (tileType) {
      case "slice":
        treemapLayout.tile((parent, x0, y0, x1, y1) => {
          const n = parent.children?.length ?? 0;
          if (n === 0) return;
          const kx = (x1 - x0) / n;
          let i = 0;
          for (const child of parent.children ?? []) {
            child.x0 = x0 + i * kx;
            child.x1 = x0 + (i + 1) * kx;
            child.y0 = y0;
            child.y1 = y1;
            i++;
          }
        });
        break;
      case "dice":
        treemapLayout.tile((parent, x0, y0, x1, y1) => {
          const n = parent.children?.length ?? 0;
          if (n === 0) return;
          const ky = (y1 - y0) / n;
          let i = 0;
          for (const child of parent.children ?? []) {
            child.x0 = x0;
            child.x1 = x1;
            child.y0 = y0 + i * ky;
            child.y1 = y0 + (i + 1) * ky;
            i++;
          }
        });
        break;
      case "sliceDice":
        treemapLayout.tile((parent, x0, y0, x1, y1) => {
          const n = parent.children?.length ?? 0;
          if (n === 0) return;
          const kx = (x1 - x0) / n;
          const ky = (y1 - y0) / n;
          let i = 0;
          for (const child of parent.children ?? []) {
            child.x0 = x0 + i * kx;
            child.x1 = x0 + (i + 1) * kx;
            child.y0 = y0 + i * ky;
            child.y1 = y0 + (i + 1) * ky;
            i++;
          }
        });
        break;
      default:
        // Use default squarify
        break;
    }

    const result = treemapLayout(root);

    // Return only leaf nodes (the actual data nodes)
    return result.leaves();
  }, [treemapData, chartWidth, bounds.chartHeight, fields.tile]);

  const valueFormatter = (value: number | null) => {
    if (value === null) {
      return "-";
    }

    const formattedValue = formatNumberWithUnit(
      value,
      formatters[yMeasure.id] ?? formatNumber,
      yMeasure.unit
    );
    const percentage = value / ySum;
    const rounded = Math.round(percentage * 100);

    return `${rounded}% (${formattedValue})`;
  };

  const getAnnotationInfo: GetAnnotationInfo = useCallback(
    (observation, { segment }) => {
      const node = nodes.find((n) => n.data.observation === observation);

      if (!node) {
        return {
          x: 0,
          y: 0,
          color: colors(segment),
        };
      }

      const x = (node.x0 + node.x1) / 2;
      const y = (node.y0 + node.y1) / 2;

      return {
        x,
        y,
        color: colors(segment),
      };
    },
    [nodes, colors]
  );

  const getTooltipInfo = (datum: Observation): TooltipInfo => {
    const node = nodes.find((n) => n.data.observation === datum);

    const xAnchor = node ? (node.x0 + node.x1) / 2 : chartWidth / 2;
    const yAnchor = node ? node.y0 : -4;

    const xPlacement = "center";
    const yPlacement = "top";

    return {
      xAnchor,
      yAnchor,
      placement: { x: xPlacement, y: yPlacement },
      value: getSegmentAbbreviationOrLabel(datum),
      datum: {
        value: valueFormatter(getY(datum)),
        color: colors(getSegment(datum)) as string,
      },
      values: undefined,
      withTriangle: false,
    };
  };

  /** To correctly animate entering / exiting treemap cells during the animation,
   * there is a need to artificially keep all segments in the data, even if they
   * are not present in the current data. This is done by adding a cell with
   * value 0 for each missing segment.
   */
  const chartDataWithMissingSegments = useMemo(() => {
    return chartData.concat(
      allSegments
        .filter((d) => !segments.includes(d))
        .map((d) => {
          return {
            [segmentDimension!.id]: d,
            [yMeasure.id]: 0,
          } as Observation;
        })
    );
  }, [chartData, allSegments, segmentDimension, segments, yMeasure.id]);

  return {
    chartType: "treemap",
    bounds,
    chartData: chartDataWithMissingSegments,
    allData,
    nodes,
    segments,
    colors,
    getColorLabel: getSegmentLabel,
    getAnnotationInfo,
    getTooltipInfo,
    leftAxisLabelSize,
    leftAxisLabelOffsetTop: 0,
    ...variables,
  };
};

const TreemapChartProvider = (
  props: PropsWithChildren<ChartProps<TreemapConfig>>
) => {
  const { children, ...chartProps } = props;
  const variables = useTreemapStateVariables(chartProps);
  const data = useTreemapStateData(chartProps, variables);
  const state = useTreemapState(chartProps, variables, data);

  return (
    <ChartContext.Provider value={state}>{children}</ChartContext.Provider>
  );
};

export const TreemapChart = (
  props: PropsWithChildren<ChartProps<TreemapConfig>>
) => {
  return (
    <InteractionProvider>
      <TreemapChartProvider {...props} />
    </InteractionProvider>
  );
};
