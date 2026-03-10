import { HierarchyRectangularNode } from "d3-hierarchy";
import { interpolate } from "d3-interpolate";
import { select, Selection } from "d3-selection";
import { arc, Arc } from "d3-shape";
import { Transition } from "d3-transition";
import { useEffect, useMemo, useRef, useState } from "react";

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
import {
  BreadcrumbItem,
  SunburstDataNode,
  SunburstState,
} from "@/charts/sunburst/sunburst-state";
import { Observation } from "@/domain/data";
import { useTransitionStore } from "@/stores/transition";
import { useEvent } from "@/utils/use-event";

/** Render data for a single sunburst arc */
export type SunburstArcRenderDatum = {
  key: string;
  node: HierarchyRectangularNode<SunburstDataNode>;
  color: string;
  segment: string;
  opacity: number;
};

type RenderSunburstArcsOptions = RenderOptions & {
  arcGenerator: Arc<any, any>;
  onClick: (
    observation: Observation | undefined,
    {
      segment,
      node,
    }: { segment: string; node: HierarchyRectangularNode<SunburstDataNode> }
  ) => void;
  onHover: (
    el: SVGPathElement,
    observation: Observation | undefined,
    { segment }: { segment: string }
  ) => void;
  onHoverOut: (el: SVGPathElement) => void;
  focusedSegment: string | null;
};

/**
 * Renders sunburst arcs using D3
 */
const renderSunburstArcs = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  renderData: SunburstArcRenderDatum[],
  options: RenderSunburstArcsOptions
) => {
  const {
    arcGenerator,
    transition,
    onClick,
    onHover,
    onHoverOut,
    focusedSegment,
  } = options;

  g.selectAll<SVGPathElement, SunburstArcRenderDatum>("path.arc")
    .data(renderData, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "arc")
          .attr("data-id", (d) => d.key)
          .attr("fill", (d) => d.color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1)
          .attr("opacity", (d) => d.opacity)
          .style("cursor", "pointer")
          .on("click", (_, d) => {
            onClick(d.node.data.observation, {
              segment: d.segment,
              node: d.node,
            });
          })
          .on("mouseenter", function (_, d) {
            onHover(this, d.node.data.observation, { segment: d.segment });
          })
          .on("mouseleave", function () {
            onHoverOut(this);
          })
          .call((enter) =>
            maybeTransition(enter, {
              transition,
              s: (g) => g.attr("d", (d) => arcGenerator(d.node)),
              t: (g) => g.call(animateSunburstArc, arcGenerator),
            })
          ),
      (update) =>
        update.call((update) =>
          maybeTransition(update, {
            transition,
            s: (g) =>
              g
                .attr("d", (d) => arcGenerator(d.node))
                .attr("fill", (d) => d.color)
                .attr("opacity", (d) => {
                  if (focusedSegment) {
                    // Highlight focused segment and its ancestors/descendants
                    return d.key.includes(focusedSegment) ||
                      focusedSegment.includes(d.key)
                      ? 1
                      : 0.3;
                  }
                  return d.opacity;
                }),
            t: (g) =>
              g
                .call(animateSunburstArc, arcGenerator)
                .attr("fill", (d) => d.color)
                .attr("opacity", (d) => {
                  if (focusedSegment) {
                    return d.key.includes(focusedSegment) ||
                      focusedSegment.includes(d.key)
                      ? 1
                      : 0.3;
                  }
                  return d.opacity;
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
 * Animate sunburst arc path transitions
 */
const animateSunburstArc = (
  g: Transition<SVGPathElement, SunburstArcRenderDatum, SVGGElement, unknown>,
  arcGenerator: Arc<any, any>
) => {
  return g.attrTween("d", function (d) {
    const that = this as any;
    // Previous node state
    const _d = that.__node__ as
      | HierarchyRectangularNode<SunburstDataNode>
      | undefined;
    const i = interpolate(
      _d ?? { x0: d.node.x0, x1: d.node.x0, y0: d.node.y0, y1: d.node.y0 },
      d.node
    );

    return (t) => {
      that.__node__ = i(t);
      return arcGenerator(that.__node__) as string;
    };
  });
};

/**
 * Sunburst component that renders the sunburst visualization
 * Supports zoom on click, breadcrumb navigation, arc highlighting, and animated transitions
 */
export const Sunburst = () => {
  const {
    bounds: { width, height, chartWidth, chartHeight },
    nodes,
    colors,
    radius,
    innerRadius,
  } = useChartState() as SunburstState;
  const isEditingAnnotation = useIsEditingAnnotation();
  const { fontFamily, labelFontSize } = useChartTheme();
  const enableTransition = useTransitionStore((state) => state.enable);
  const transitionDuration = useTransitionStore((state) => state.duration);
  const arcsRef = useRef<SVGGElement>(null);

  // Track focused segment for highlighting
  const [focusedSegment, setFocusedSegment] = useState<string | null>(null);
  // Track zoomed node for drill-down
  const [zoomedNode, setZoomedNode] =
    useState<HierarchyRectangularNode<SunburstDataNode> | null>(null);

  // Create arc generator
  const arcGenerator = useMemo(() => {
    return arc<HierarchyRectangularNode<SunburstDataNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius((d) => Math.max(0, d.y0 + innerRadius))
      .outerRadius((d) => Math.max(0, d.y1 + innerRadius - 1));
  }, [radius, innerRadius]);

  // Create render data from nodes
  const renderData = useMemo(() => {
    return nodes.map((node) => {
      // Get color from the root ancestor at depth 1
      let colorNode = node;
      while (colorNode.depth > 1 && colorNode.parent) {
        colorNode = colorNode.parent;
      }

      return {
        key: node.data.id,
        node,
        color: colors(colorNode.data.name) as string,
        segment: node.data.name,
        opacity: 1,
      } satisfies SunburstArcRenderDatum;
    });
  }, [nodes, colors]);

  // Filter data based on zoom state
  const visibleRenderData = useMemo(() => {
    if (!zoomedNode) {
      return renderData;
    }
    // When zoomed, only show descendants of the zoomed node
    return renderData.filter(
      (d) =>
        d.node === zoomedNode ||
        (zoomedNode.children &&
          zoomedNode.children.some((child) => isDescendant(d.node, child)))
    );
  }, [renderData, zoomedNode]);

  const { onClick, onHover, onHoverOut } = useAnnotationInteractions({
    focusingSegment: true,
  });

  // Handle click for zoom
  const handleClick = useEvent(
    (
      observation: Observation | undefined,
      {
        segment,
        node,
      }: { segment: string; node: HierarchyRectangularNode<SunburstDataNode> }
    ) => {
      // Toggle zoom: if clicking the same node, zoom out; otherwise zoom in
      if (zoomedNode?.data.id === node.data.id) {
        setZoomedNode(null);
      } else if (node.children && node.children.length > 0) {
        setZoomedNode(node);
      }
      // Also trigger annotation click handler
      if (observation) {
        onClick(observation, { segment });
      }
    }
  );

  const handleHover = useEvent(
    (
      el: SVGPathElement,
      observation: Observation | undefined,
      { segment }: { segment: string }
    ) => {
      if (!isEditingAnnotation) {
        select(el).attr("stroke", "#000").attr("stroke-width", 2).raise();
      }
      setFocusedSegment(segment);
      if (observation) {
        onHover(observation, { segment });
      }
    }
  );

  const handleHoverOut = useEvent((el: SVGPathElement) => {
    if (!isEditingAnnotation) {
      select(el).attr("stroke", "#fff").attr("stroke-width", 1);
    }
    setFocusedSegment(null);
    onHoverOut();
  });

  useEffect(() => {
    const arcsContainer = arcsRef.current;

    if (arcsContainer) {
      const common: Pick<RenderContainerOptions, "transform" | "transition"> = {
        transform: `translate(${chartWidth / 2} ${chartHeight / 2})`,
        transition: {
          enable: enableTransition,
          duration: transitionDuration,
        },
      };

      renderContainer(arcsContainer, {
        ...common,
        id: "sunburst-arcs",
        render: (g, opts) =>
          renderSunburstArcs(g, visibleRenderData, {
            ...opts,
            arcGenerator,
            onClick: handleClick,
            onHover: handleHover,
            onHoverOut: handleHoverOut,
            focusedSegment,
          }),
      });
    }
  }, [
    arcGenerator,
    chartWidth,
    chartHeight,
    enableTransition,
    focusedSegment,
    handleClick,
    handleHover,
    handleHoverOut,
    transitionDuration,
    visibleRenderData,
  ]);

  return (
    <>
      <g ref={arcsRef} />
    </>
  );
};

/**
 * Check if a node is a descendant of another node
 */
function isDescendant(
  node: HierarchyRectangularNode<SunburstDataNode>,
  ancestor: HierarchyRectangularNode<SunburstDataNode>
): boolean {
  let current: HierarchyRectangularNode<SunburstDataNode> | null = node;
  while (current) {
    if (current.data.id === ancestor.data.id) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/**
 * Breadcrumb navigation component for sunburst
 */
export const SunburstBreadcrumb = ({
  items,
  onItemClick,
  fontFamily,
}: {
  items: BreadcrumbItem[];
  onItemClick: (item: BreadcrumbItem) => void;
  fontFamily: string;
}) => {
  return (
    <g className="sunburst-breadcrumb">
      {items.map((item, index) => (
        <g
          key={item.id}
          transform={`translate(${index * 80}, 0)`}
          style={{ cursor: "pointer" }}
          onClick={() => onItemClick(item)}
        >
          <rect
            x={0}
            y={-10}
            width={70}
            height={20}
            fill="#f0f0f0"
            rx={4}
            stroke="#ccc"
            strokeWidth={1}
          />
          <text
            x={35}
            y={4}
            textAnchor="middle"
            fontSize={11}
            fontFamily={fontFamily}
            fill="#333"
          >
            {item.name.length > 8 ? `${item.name.slice(0, 6)}...` : item.name}
          </text>
          {index < items.length - 1 && (
            <text
              x={75}
              y={4}
              fontSize={11}
              fontFamily={fontFamily}
              fill="#666"
            >
              /
            </text>
          )}
        </g>
      ))}
    </g>
  );
};

/**
 * Center label component for showing zoomed node info
 */
export const SunburstCenterLabel = ({
  node,
  fontFamily,
  fontSize,
}: {
  node: HierarchyRectangularNode<SunburstDataNode> | null;
  fontFamily: string;
  fontSize: number;
}) => {
  if (!node) {
    return null;
  }

  return (
    <g className="sunburst-center-label">
      <text
        x={0}
        y={-5}
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontWeight={600}
        fill="#333"
      >
        {node.data.name}
      </text>
      <text
        x={0}
        y={15}
        textAnchor="middle"
        fontSize={fontSize * 0.8}
        fontFamily={fontFamily}
        fill="#666"
      >
        {formatValue(node.value)}
      </text>
    </g>
  );
};

/**
 * Format value for display
 */
function formatValue(value: number | undefined): string {
  if (value === undefined || value === null) return "-";
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}
