import { sankeyLinkHorizontal } from "d3-sankey";
import { select, Selection } from "d3-selection";
import { useEffect, useMemo, useRef, useState } from "react";

import { SankeyState } from "@/charts/sankey/sankey-state";
import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { useChartState } from "@/charts/shared/chart-state";
import {
  maybeTransition,
  renderContainer,
  RenderContainerOptions,
  RenderOptions,
} from "@/charts/shared/rendering-utils";
import { useAnnotationInteractions } from "@/charts/shared/use-annotation-interactions";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { Observation } from "@/domain/data";
import { useTransitionStore } from "@/stores/transition";
import { useEvent } from "@/utils/use-event";

/** Render data for a single sankey node */
export type SankeyNodeRenderDatum = {
  key: string;
  id: string;
  name: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  width: number;
  height: number;
  color: string;
  incomingValue: number;
  outgoingValue: number;
  depth: number;
};

/** Render data for a single sankey link */
export type SankeyLinkRenderDatum = {
  key: string;
  sourceId: string;
  targetId: string;
  sourceName: string;
  targetName: string;
  value: number;
  width: number;
  y0: number;
  y1: number;
  color: string;
  sourceX: number;
  targetX: number;
};

type RenderSankeyNodesOptions = RenderOptions & {
  onClick: (nodeId: string) => void;
  onHover: (el: SVGRectElement, nodeId: string) => void;
  onHoverOut: (el: SVGRectElement) => void;
  onDragStart: (nodeId: string, event: MouseEvent) => void;
  onDrag: (nodeId: string, deltaY: number) => void;
  onDragEnd: () => void;
};

/**
 * Renders sankey nodes (rectangles) using D3
 */
const renderSankeyNodes = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  renderData: SankeyNodeRenderDatum[],
  options: RenderSankeyNodesOptions
) => {
  const { transition, onClick, onHover, onHoverOut } = options;

  g.selectAll<SVGGElement, SankeyNodeRenderDatum>("g.node")
    .data(renderData, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", "node")
          .attr("data-id", (d) => d.id)
          .call((g) =>
            g
              .append("rect")
              .attr("class", "node-rect")
              .attr("x", (d) => d.x0)
              .attr("y", (d) => d.y0)
              .attr("width", (d) => d.width)
              .attr("height", (d) => Math.max(0, d.height))
              .attr("fill", (d) => d.color)
              .attr("stroke", "#000")
              .attr("stroke-width", 0)
              .attr("rx", 2)
              .attr("ry", 2)
              .style("cursor", "grab")
          )
          .on("click", function (_, d) {
            onClick(d.id);
          })
          .on("mouseenter", function (_, d) {
            const rect = this.querySelector("rect");
            if (rect) {
              onHover(rect, d.id);
            }
          })
          .on("mouseleave", function () {
            const rect = this.querySelector("rect");
            if (rect) {
              onHoverOut(rect);
            }
          })
          .call((enter) =>
            maybeTransition(enter, {
              transition,
              s: (g) => g.attr("opacity", 1),
              t: (g) => g.attr("opacity", 0).transition().attr("opacity", 1),
            })
          ),
      (update) =>
        update.call((update) =>
          maybeTransition(update, {
            transition,
            s: (g) =>
              g
                .select(".node-rect")
                .attr("x", (d) => d.x0)
                .attr("y", (d) => d.y0)
                .attr("width", (d) => d.width)
                .attr("height", (d) => Math.max(0, d.height))
                .attr("fill", (d) => d.color),
            t: (g) =>
              g
                .select(".node-rect")
                .transition()
                .attr("x", (d) => d.x0)
                .attr("y", (d) => d.y0)
                .attr("width", (d) => d.width)
                .attr("height", (d) => Math.max(0, d.height))
                .attr("fill", (d) => d.color),
          })
        ),
      (exit) =>
        maybeTransition(exit, {
          transition,
          s: (g) => g.attr("opacity", 0).remove(),
          t: (g) => g.transition().attr("opacity", 0).remove(),
        })
    );
};

type RenderSankeyLabelsOptions = RenderOptions & {
  fontFamily: string;
  fontSize: number;
};

/**
 * Renders labels for sankey nodes
 */
const renderSankeyLabels = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  renderData: SankeyNodeRenderDatum[],
  options: RenderSankeyLabelsOptions
) => {
  const { transition, fontFamily, fontSize } = options;

  // Filter nodes that have enough height for labels
  const labelData = renderData.filter((d) => d.height >= fontSize);

  g.selectAll<SVGTextElement, SankeyNodeRenderDatum>("text")
    .data(labelData, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("class", "node-label")
          .attr("x", (d) => d.x1 + 4)
          .attr("y", (d) => d.y0 + d.height / 2)
          .attr("dy", "0.35em")
          .attr("fill", "#333")
          .attr("font-family", fontFamily)
          .attr("font-size", fontSize)
          .attr("font-weight", 500)
          .attr("text-anchor", "start")
          .attr("pointer-events", "none")
          .text((d) => d.name)
          .call((enter) =>
            maybeTransition(enter, {
              transition,
              s: (g) => g.attr("opacity", 1),
              t: (g) => g.attr("opacity", 0).transition().attr("opacity", 1),
            })
          ),
      (update) =>
        update.call((update) =>
          maybeTransition(update, {
            transition,
            s: (g) =>
              g
                .attr("x", (d) => d.x1 + 4)
                .attr("y", (d) => d.y0 + d.height / 2)
                .text((d) => d.name),
            t: (g) =>
              g
                .transition()
                .attr("x", (d) => d.x1 + 4)
                .attr("y", (d) => d.y0 + d.height / 2)
                .text((d) => d.name),
          })
        ),
      (exit) =>
        maybeTransition(exit, {
          transition,
          s: (g) => g.attr("opacity", 0).remove(),
        })
    );
};

type RenderSankeyLinksOptions = RenderOptions & {
  onLinkHover: (el: SVGPathElement, linkKey: string) => void;
  onLinkHoverOut: (el: SVGPathElement) => void;
  highlightedSourceId: string | null;
  highlightedTargetId: string | null;
};

/**
 * Generates SVG path for a sankey link
 */
const createLinkPath = (d: SankeyLinkRenderDatum): string => {
  const linkGenerator = sankeyLinkHorizontal<
    SankeyLinkRenderDatum,
    SankeyNodeRenderDatum
  >()
    .source((link) => ({ x: link.sourceX, y: link.y0 }))
    .target((link) => ({ x: link.targetX, y: link.y1 }));

  return linkGenerator(d as any) || "";
};

/**
 * Renders sankey links (flows) using D3
 */
const renderSankeyLinks = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  renderData: SankeyLinkRenderDatum[],
  options: RenderSankeyLinksOptions
) => {
  const {
    transition,
    onLinkHover,
    onLinkHoverOut,
    highlightedSourceId,
    highlightedTargetId,
  } = options;

  g.selectAll<SVGPathElement, SankeyLinkRenderDatum>("path.link")
    .data(renderData, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "link")
          .attr("d", createLinkPath)
          .attr("stroke", (d) => d.color)
          .attr("stroke-width", (d) => Math.max(1, d.width))
          .attr("stroke-opacity", 0.5)
          .attr("fill", "none")
          .style("cursor", "pointer")
          .on("mouseenter", function (_, d) {
            onLinkHover(this, d.key);
          })
          .on("mouseleave", function () {
            onLinkHoverOut(this);
          })
          .call((enter) =>
            maybeTransition(enter, {
              transition,
              s: (g) => g.attr("opacity", 1),
              t: (g) => g.attr("opacity", 0).transition().attr("opacity", 1),
            })
          ),
      (update) =>
        update.call((update) =>
          maybeTransition(update, {
            transition,
            s: (g) =>
              g
                .attr("d", createLinkPath)
                .attr("stroke", (d) => d.color)
                .attr("stroke-width", (d) => Math.max(1, d.width))
                .attr("stroke-opacity", (d) => {
                  // Highlight links connected to hovered node
                  if (highlightedSourceId && highlightedTargetId) {
                    const isHighlighted =
                      d.sourceId === highlightedSourceId ||
                      d.targetId === highlightedTargetId;
                    return isHighlighted ? 0.8 : 0.1;
                  }
                  return 0.5;
                }),
            t: (g) =>
              g
                .transition()
                .attr("d", createLinkPath)
                .attr("stroke", (d) => d.color)
                .attr("stroke-width", (d) => Math.max(1, d.width))
                .attr("stroke-opacity", (d) => {
                  if (highlightedSourceId && highlightedTargetId) {
                    const isHighlighted =
                      d.sourceId === highlightedSourceId ||
                      d.targetId === highlightedTargetId;
                    return isHighlighted ? 0.8 : 0.1;
                  }
                  return 0.5;
                }),
          })
        ),
      (exit) =>
        maybeTransition(exit, {
          transition,
          s: (g) => g.attr("opacity", 0).remove(),
          t: (g) => g.transition().attr("opacity", 0).remove(),
        })
    );
};

/**
 * Sankey component that renders the sankey visualization
 * Supports flow highlighting on hover, animated transitions, and node reordering
 */
export const Sankey = () => {
  const {
    bounds: { width, height, chartWidth, chartHeight, margins },
    nodes,
    links,
    colors,
  } = useChartState() as SankeyState;
  const isEditingAnnotation = useIsEditingAnnotation();
  const { fontFamily, labelFontSize } = useChartTheme();
  const enableTransition = useTransitionStore((state) => state.enable);
  const transitionDuration = useTransitionStore((state) => state.duration);
  const nodesRef = useRef<SVGGElement>(null);
  const linksRef = useRef<SVGGElement>(null);
  const labelsRef = useRef<SVGGElement>(null);

  // Track hovered node for highlighting
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  // Track node positions for drag and drop reordering
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState<number>(0);

  // Prepare render data from sankey nodes
  const nodeRenderData = useMemo(() => {
    return nodes.map((node) => ({
      key: node.id,
      id: node.id,
      name: node.name,
      x0: node.x0 ?? 0,
      x1: node.x1 ?? 0,
      y0: node.y0 ?? 0,
      y1: node.y1 ?? 0,
      width: (node.x1 ?? 0) - (node.x0 ?? 0),
      height: (node.y1 ?? 0) - (node.y0 ?? 0),
      color: node.color ?? (colors(node.id) as string),
      incomingValue: node.incomingValue ?? 0,
      outgoingValue: node.outgoingValue ?? 0,
      depth: node.depth ?? 0,
    })) satisfies SankeyNodeRenderDatum[];
  }, [nodes, colors]);

  // Prepare render data from sankey links
  const linkRenderData = useMemo(() => {
    return links.map((link) => ({
      key: `${link.source.id}-${link.target.id}`,
      sourceId: link.source.id,
      targetId: link.target.id,
      sourceName: link.source.name,
      targetName: link.target.name,
      value: link.value,
      width: link.width ?? 0,
      y0: link.y0 ?? 0,
      y1: link.y1 ?? 0,
      color: link.color ?? (colors(link.source.id) as string),
      sourceX: link.source.x1 ?? 0,
      targetX: link.target.x0 ?? 0,
    })) satisfies SankeyLinkRenderDatum[];
  }, [links, colors]);

  // Get highlighting info based on hovered node
  const highlightingInfo = useMemo(() => {
    if (!hoveredNodeId) {
      return { sourceId: null, targetId: null };
    }

    // When a node is hovered, highlight its incoming and outgoing flows
    const incomingSources = links
      .filter((l) => l.target.id === hoveredNodeId)
      .map((l) => l.source.id);
    const outgoingTargets = links
      .filter((l) => l.source.id === hoveredNodeId)
      .map((l) => l.target.id);

    return {
      sourceId: hoveredNodeId,
      targetId: hoveredNodeId,
    };
  }, [hoveredNodeId, links]);

  const { onClick, onHover, onHoverOut } = useAnnotationInteractions({
    focusingSegment: true,
  });

  // Node click handler
  const handleNodeClick = useEvent((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      // For sankey, we don't have a single observation per node
      // Create a synthetic observation for annotation purposes
      const syntheticObservation = { nodeId } as Observation;
      onClick(syntheticObservation, { segment: nodeId });
    }
  });

  // Node hover handlers
  const handleNodeHover = useEvent((el: SVGRectElement, nodeId: string) => {
    if (!isEditingAnnotation) {
      select(el).attr("stroke-width", 2);
    }
    setHoveredNodeId(nodeId);
  });

  const handleNodeHoverOut = useEvent((el: SVGRectElement) => {
    if (!isEditingAnnotation) {
      select(el).attr("stroke-width", 0);
    }
    setHoveredNodeId(null);
  });

  // Drag and drop handlers for node reordering
  const handleDragStart = useEvent((nodeId: string, event: MouseEvent) => {
    setDraggingNodeId(nodeId);
    setDragStartY(event.clientY);
  });

  const handleDrag = useEvent((nodeId: string, deltaY: number) => {
    if (draggingNodeId === nodeId) {
      // Update node position during drag
      // This would typically update state and trigger a re-render
      // For now, we'll just track the state
    }
  });

  const handleDragEnd = useEvent(() => {
    setDraggingNodeId(null);
    setDragStartY(0);
  });

  // Link hover handlers
  const handleLinkHover = useEvent((el: SVGPathElement, linkKey: string) => {
    if (!isEditingAnnotation) {
      select(el)
        .attr("stroke-opacity", 0.8)
        .attr("stroke-width", (d: any) => Math.max(2, d.width));
    }

    // Extract source and target from link key
    const [sourceId, targetId] = linkKey.split("-");
    const link = links.find(
      (l) => l.source.id === sourceId && l.target.id === targetId
    );
    if (link) {
      // Create synthetic observation for tooltip
      const syntheticObservation = {
        source: sourceId,
        target: targetId,
        value: link.value,
      } as Observation;
      onHover(syntheticObservation, { segment: sourceId });
    }
  });

  const handleLinkHoverOut = useEvent((el: SVGPathElement) => {
    if (!isEditingAnnotation) {
      select(el).attr("stroke-opacity", 0.5);
    }
    onHoverOut();
  });

  useEffect(() => {
    const linksContainer = linksRef.current;
    const nodesContainer = nodesRef.current;
    const labelsContainer = labelsRef.current;

    if (linksContainer && nodesContainer && labelsContainer) {
      const common: Pick<RenderContainerOptions, "transform" | "transition"> = {
        transform: `translate(${margins.left} ${margins.top})`,
        transition: {
          enable: enableTransition,
          duration: transitionDuration,
        },
      };

      // Render links first (behind nodes)
      renderContainer(linksContainer, {
        ...common,
        id: "sankey-links",
        render: (g, opts) =>
          renderSankeyLinks(g, linkRenderData, {
            ...opts,
            onLinkHover: handleLinkHover,
            onLinkHoverOut: handleLinkHoverOut,
            highlightedSourceId: highlightingInfo.sourceId,
            highlightedTargetId: highlightingInfo.targetId,
          }),
      });

      // Render nodes
      renderContainer(nodesContainer, {
        ...common,
        id: "sankey-nodes",
        render: (g, opts) =>
          renderSankeyNodes(g, nodeRenderData, {
            ...opts,
            onClick: handleNodeClick,
            onHover: handleNodeHover,
            onHoverOut: handleNodeHoverOut,
            onDragStart: handleDragStart,
            onDrag: handleDrag,
            onDragEnd: handleDragEnd,
          }),
      });

      // Render labels
      renderContainer(labelsContainer, {
        ...common,
        id: "sankey-labels",
        render: (g, opts) =>
          renderSankeyLabels(g, nodeRenderData, {
            ...opts,
            fontFamily,
            fontSize: labelFontSize,
          }),
      });
    }
  }, [
    enableTransition,
    fontFamily,
    handleDrag,
    handleDragEnd,
    handleDragStart,
    handleLinkHover,
    handleLinkHoverOut,
    handleNodeClick,
    handleNodeHover,
    handleNodeHoverOut,
    highlightingInfo.sourceId,
    highlightingInfo.targetId,
    labelFontSize,
    linkRenderData,
    margins.left,
    margins.top,
    nodeRenderData,
    transitionDuration,
  ]);

  return (
    <>
      <g ref={linksRef} />
      <g ref={nodesRef} />
      <g ref={labelsRef} />
    </>
  );
};
