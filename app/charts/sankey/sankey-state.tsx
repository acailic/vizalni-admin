import { sum } from "d3-array";
import {
  sankey as d3Sankey,
  sankeyCenter,
  sankeyJustify,
  sankeyLeft,
  sankeyRight,
  SankeyGraph,
  SankeyNode as D3SankeyNode,
} from "d3-sankey";
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
  SankeyStateVariables,
  useSankeyStateData,
  useSankeyStateVariables,
} from "./sankey-state-props";
import { SankeyConfig, SankeyNode, SankeyLink } from "./sankey-types";

/** Internal data node for d3-sankey */
interface InternalSankeyNode {
  id: string;
  name: string;
  observation?: Observation;
}

/** Internal data link for d3-sankey */
interface InternalSankeyLink {
  source: string;
  target: string;
  value: number;
  observation: Observation;
}

export type SankeyState = CommonChartState &
  SankeyStateVariables & {
    chartType: "sankey";
    nodes: SankeyNode[];
    links: SankeyLink[];
    colors: ScaleOrdinal<string, string>;
    getColorLabel: (nodeId: string) => string;
    getAnnotationInfo: GetAnnotationInfo;
    getTooltipInfo: (d: Observation) => TooltipInfo;
    leftAxisLabelSize: AxisLabelSizeVariables;
    leftAxisLabelOffsetTop: number;
  };

const useSankeyState = (
  chartProps: ChartProps<SankeyConfig>,
  variables: SankeyStateVariables,
  data: ChartStateData
): SankeyState => {
  const { chartConfig, dimensions, measures } = chartProps;
  const { valueMeasure, getSource, getTarget, getValue } = variables;
  const { chartData, allData } = data;
  const { fields } = chartConfig;

  const { width, height } = useSize();
  const formatNumber = useFormatNumber();
  const formatters = useChartFormatters(chartProps);

  // Get visual options with defaults
  const nodeWidth = fields.visualOptions?.nodeWidth ?? 24;
  const nodePadding = fields.visualOptions?.nodePadding ?? 16;
  const nodeAlignment = fields.visualOptions?.nodeAlignment ?? "justify";

  // Extract unique node IDs and create node objects
  const {
    nodes: rawNodes,
    links: rawLinks,
    uniqueNodeIds,
  } = useMemo(() => {
    const nodeSet = new Set<string>();
    const links: InternalSankeyLink[] = [];

    chartData.forEach((d) => {
      const source = getSource(d);
      const target = getTarget(d);
      const value = getValue(d);

      if (source && target && typeof value === "number" && value > 0) {
        nodeSet.add(source);
        nodeSet.add(target);
        links.push({
          source,
          target,
          value,
          observation: d,
        });
      }
    });

    const nodes: InternalSankeyNode[] = Array.from(nodeSet).map((id) => ({
      id,
      name: id,
    }));

    return { nodes, links, uniqueNodeIds: Array.from(nodeSet) };
  }, [chartData, getSource, getTarget, getValue]);

  // Create color scale
  const colors = useMemo(() => {
    const colorScale = scaleOrdinal<string, string>();

    if (fields.color) {
      colorScale.domain(uniqueNodeIds);
      colorScale.range(
        getPalette({
          paletteId: fields.color.paletteId,
          colorField: fields.color,
        })
      );
    } else {
      colorScale.domain(uniqueNodeIds);
      colorScale.range(schemeCategory10);
    }

    colorScale.unknown(() => undefined);
    return colorScale;
  }, [fields.color, uniqueNodeIds]);

  // Dimensions
  const yAxisLabel = "Value";
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

  // Compute sankey layout
  const { nodes, links } = useMemo(() => {
    if (rawNodes.length === 0 || rawLinks.length === 0) {
      return { nodes: [], links: [] };
    }

    // Create node index map
    const nodeIndexMap = new Map<string, number>();
    rawNodes.forEach((node, index) => {
      nodeIndexMap.set(node.id, index);
    });

    // Convert to d3-sankey format
    const graphNodes = rawNodes.map((n) => ({ ...n }));
    const graphLinks = rawLinks.map((l) => ({
      source: nodeIndexMap.get(l.source)!,
      target: nodeIndexMap.get(l.target)!,
      value: l.value,
      observation: l.observation,
    }));

    // Create sankey layout
    const alignmentMap = {
      justify: sankeyJustify,
      left: sankeyLeft,
      right: sankeyRight,
      center: sankeyCenter,
    };

    const sankeyLayout = d3Sankey<
      InternalSankeyNode,
      InternalSankeyLink & { observation: Observation }
    >()
      .nodeId((d) => d.id)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .nodeAlign(alignmentMap[nodeAlignment] || sankeyJustify)
      .extent([
        [0, 0],
        [chartWidth, bounds.chartHeight],
      ]);

    // Apply layout
    const graph = sankeyLayout({
      nodes: graphNodes,
      links: graphLinks as typeof graphLinks,
    } as SankeyGraph<
      InternalSankeyNode,
      InternalSankeyLink & { observation: Observation }
    >);

    // Convert to our types
    const sankeyNodes: SankeyNode[] = graph.nodes.map((node) => ({
      id: node.id,
      name: node.name || node.id,
      color: colors(node.id) as string,
      incomingValue: node.targetLinks
        ? sum(node.targetLinks, (l) => l.value)
        : 0,
      outgoingValue: node.sourceLinks
        ? sum(node.sourceLinks, (l) => l.value)
        : 0,
      depth: node.depth ?? 0,
      x0: node.x0 ?? 0,
      x1: node.x1 ?? 0,
      y0: node.y0 ?? 0,
      y1: node.y1 ?? 0,
    }));

    const sankeyLinks: SankeyLink[] = graph.links.map((link) => {
      const sourceNode = sankeyNodes.find(
        (n) =>
          n.id ===
          (link.source as D3SankeyNode<InternalSankeyNode, InternalSankeyLink>)
            .id
      );
      const targetNode = sankeyNodes.find(
        (n) =>
          n.id ===
          (link.target as D3SankeyNode<InternalSankeyNode, InternalSankeyLink>)
            .id
      );

      return {
        source: sourceNode!,
        target: targetNode!,
        value: link.value,
        width: link.width ?? 0,
        y0: link.y0 ?? 0,
        y1: link.y1 ?? 0,
      };
    });

    return { nodes: sankeyNodes, links: sankeyLinks };
  }, [
    rawNodes,
    rawLinks,
    nodeWidth,
    nodePadding,
    nodeAlignment,
    chartWidth,
    bounds.chartHeight,
    colors,
  ]);

  // Get measure for formatting
  const measure = measures.find((m) => m.id === valueMeasure);

  const valueFormatter = useCallback(
    (value: number | null) => {
      if (value === null) {
        return "-";
      }
      return formatNumberWithUnit(
        value,
        formatters[valueMeasure] ?? formatNumber,
        measure?.unit
      );
    },
    [formatters, formatNumber, measure?.unit, valueMeasure]
  );

  const getColorLabel = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      return node?.name ?? nodeId;
    },
    [nodes]
  );

  const getAnnotationInfo: GetAnnotationInfo = useCallback(
    (observation, { segment }) => {
      const link = links.find(
        (l) =>
          l.source.id === getSource(observation) &&
          l.target.id === getTarget(observation)
      );

      if (!link) {
        return {
          x: 0,
          y: 0,
          color: colors(segment),
        };
      }

      const sourceNode = link.source;
      const targetNode = link.target;

      if (!sourceNode || !targetNode) {
        return {
          x: 0,
          y: 0,
          color: colors(segment),
        };
      }

      // Position at midpoint of the link
      const x = ((sourceNode.x1 ?? 0) + (targetNode.x0 ?? 0)) / 2;
      const y = ((link.y0 ?? 0) + (link.y1 ?? 0)) / 2;

      return {
        x,
        y,
        color: colors(segment),
      };
    },
    [links, colors, getSource, getTarget]
  );

  const getTooltipInfo = useCallback(
    (datum: Observation): TooltipInfo => {
      const link = links.find(
        (l) =>
          l.source.id === getSource(datum) && l.target.id === getTarget(datum)
      );

      const xAnchor = link
        ? ((link.source.x1 ?? 0) + (link.target.x0 ?? 0)) / 2
        : chartWidth / 2;
      const yAnchor = link ? ((link.y0 ?? 0) + (link.y1 ?? 0)) / 2 : 0;

      const xPlacement = "center";
      const yPlacement = "top";

      return {
        xAnchor,
        yAnchor,
        placement: { x: xPlacement, y: yPlacement },
        value: `${getSource(datum)} → ${getTarget(datum)}`,
        datum: {
          value: valueFormatter(getValue(datum)),
          color: colors(getSource(datum)) as string,
        },
        values: undefined,
        withTriangle: false,
      };
    },
    [links, getSource, getTarget, chartWidth, valueFormatter, getValue, colors]
  );

  return {
    chartType: "sankey",
    bounds,
    chartData,
    allData,
    nodes,
    links,
    colors,
    getColorLabel,
    getAnnotationInfo,
    getTooltipInfo,
    leftAxisLabelSize,
    leftAxisLabelOffsetTop: 0,
    ...variables,
  };
};

const SankeyChartProvider = (
  props: PropsWithChildren<ChartProps<SankeyConfig>>
) => {
  const { children, ...chartProps } = props;
  const variables = useSankeyStateVariables(chartProps);
  const data = useSankeyStateData(chartProps, variables);
  const state = useSankeyState(chartProps, variables, data);

  return (
    <ChartContext.Provider value={state}>{children}</ChartContext.Provider>
  );
};

export const SankeyChart = (
  props: PropsWithChildren<ChartProps<SankeyConfig>>
) => {
  return (
    <InteractionProvider>
      <SankeyChartProvider {...props} />
    </InteractionProvider>
  );
};
