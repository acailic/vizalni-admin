import { select, Selection } from "d3-selection";
import { useEffect, useMemo, useRef } from "react";

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
import { TreemapState } from "@/charts/treemap/treemap-state";
import { Observation } from "@/domain/data";
import { useTransitionStore } from "@/stores/transition";
import { useEvent } from "@/utils/use-event";

/** Render data for a single treemap node */
export type TreemapRenderDatum = {
  key: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
  color: string;
  segment: string;
  observation: Observation;
};

type RenderTreemapOptions = RenderOptions & {
  onClick: (
    observation: Observation,
    { segment }: { segment?: string }
  ) => void;
  onHover: (
    el: SVGRectElement,
    observation: Observation,
    { segment }: { segment: string }
  ) => void;
  onHoverOut: (el: SVGRectElement) => void;
};

/**
 * Renders treemap nodes (rectangles) using D3
 */
const renderTreemapNodes = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  renderData: TreemapRenderDatum[],
  options: RenderTreemapOptions
) => {
  const { transition, onClick, onHover, onHoverOut } = options;

  g.selectAll<SVGRectElement, TreemapRenderDatum>("rect")
    .data(renderData, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("data-index", (_, i) => i)
          .attr("x", (d) => d.x0)
          .attr("y", (d) => d.y0)
          .attr("width", (d) => d.width)
          .attr("height", (d) => d.height)
          .attr("fill", (d) => d.color)
          .attr("stroke", "black")
          .attr("stroke-width", 0)
          .attr("rx", 2)
          .attr("ry", 2)
          .on("click", (_, d) => {
            onClick(d.observation, { segment: d.segment });
          })
          .on("mouseenter", function (_, d) {
            onHover(this, d.observation, { segment: d.segment });
          })
          .on("mouseleave", function () {
            onHoverOut(this);
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
                .attr("x", (d) => d.x0)
                .attr("y", (d) => d.y0)
                .attr("width", (d) => d.width)
                .attr("height", (d) => d.height)
                .attr("fill", (d) => d.color),
            t: (g) =>
              g
                .transition()
                .attr("x", (d) => d.x0)
                .attr("y", (d) => d.y0)
                .attr("width", (d) => d.width)
                .attr("height", (d) => d.height)
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

/**
 * Truncates text to fit within a given width
 */
const truncateText = (
  text: string,
  maxWidth: number,
  fontSize: number
): string => {
  const charWidth = fontSize * 0.6; // Approximate character width
  const maxChars = Math.floor(maxWidth / charWidth);

  if (text.length <= maxChars) {
    return text;
  }

  return text.slice(0, Math.max(0, maxChars - 2)) + "..";
};

type RenderLabelsOptions = RenderOptions & {
  fontFamily: string;
  fontSize: number;
  minCellWidth: number;
  minCellHeight: number;
};

/**
 * Renders labels for treemap nodes
 */
const renderTreemapLabels = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  renderData: TreemapRenderDatum[],
  options: RenderLabelsOptions
) => {
  const { transition, fontFamily, fontSize, minCellWidth, minCellHeight } =
    options;

  // Filter nodes that are large enough for labels
  const labelData = renderData.filter(
    (d) => d.width >= minCellWidth && d.height >= minCellHeight
  );

  g.selectAll<SVGTextElement, TreemapRenderDatum>("text")
    .data(labelData, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("x", (d) => d.x0 + 4)
          .attr("y", (d) => d.y0 + fontSize + 2)
          .attr("fill", "white")
          .attr("font-family", fontFamily)
          .attr("font-size", fontSize)
          .attr("font-weight", 500)
          .attr("text-anchor", "start")
          .attr("pointer-events", "none")
          .text((d) => truncateText(d.segment, d.width - 8, fontSize))
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
                .attr("x", (d) => d.x0 + 4)
                .attr("y", (d) => d.y0 + fontSize + 2)
                .text((d) => truncateText(d.segment, d.width - 8, fontSize)),
            t: (g) =>
              g
                .transition()
                .attr("x", (d) => d.x0 + 4)
                .attr("y", (d) => d.y0 + fontSize + 2)
                .text((d) => truncateText(d.segment, d.width - 8, fontSize)),
          })
        ),
      (exit) =>
        maybeTransition(exit, {
          transition,
          s: (g) => g.attr("opacity", 0).remove(),
        })
    );
};

/**
 * Treemap component that renders the treemap visualization
 */
export const Treemap = () => {
  const {
    bounds: { width, height, chartWidth, chartHeight, margins },
    nodes,
    colors,
    getSegment,
    getRenderingKey,
  } = useChartState() as TreemapState;
  const isEditingAnnotation = useIsEditingAnnotation();
  const { fontFamily, labelFontSize } = useChartTheme();
  const enableTransition = useTransitionStore((state) => state.enable);
  const transitionDuration = useTransitionStore((state) => state.duration);
  const nodesRef = useRef<SVGGElement>(null);
  const labelsRef = useRef<SVGGElement>(null);

  // Prepare render data from treemap nodes
  const renderData = useMemo(() => {
    return nodes.map((node) => {
      const segment = getSegment(node.data.observation);
      return {
        key: getRenderingKey(node.data.observation),
        x0: node.x0,
        y0: node.y0,
        x1: node.x1,
        y1: node.y1,
        width: node.x1 - node.x0,
        height: node.y1 - node.y0,
        color: colors(segment) as string,
        segment,
        observation: node.data.observation,
      } satisfies TreemapRenderDatum;
    });
  }, [nodes, getSegment, getRenderingKey, colors]);

  const { onClick, onHover, onHoverOut } = useAnnotationInteractions({
    focusingSegment: true,
  });

  const handleHover = useEvent(
    (
      el: SVGRectElement,
      observation: Observation,
      { segment }: { segment: string }
    ) => {
      if (!isEditingAnnotation) {
        select(el).attr("stroke", "black").attr("stroke-width", 2);
      }
      onHover(observation, { segment });
    }
  );

  const handleHoverOut = useEvent((el: SVGRectElement) => {
    if (!isEditingAnnotation) {
      select(el).attr("stroke", "black").attr("stroke-width", 0);
    }
    onHoverOut();
  });

  useEffect(() => {
    const nodesContainer = nodesRef.current;
    const labelsContainer = labelsRef.current;

    if (nodesContainer && labelsContainer) {
      const common: Pick<RenderContainerOptions, "transform" | "transition"> = {
        transform: `translate(${margins.left} ${margins.top})`,
        transition: {
          enable: enableTransition,
          duration: transitionDuration,
        },
      };

      renderContainer(nodesContainer, {
        ...common,
        id: "treemap-nodes",
        render: (g, opts) =>
          renderTreemapNodes(g, renderData, {
            ...opts,
            onClick,
            onHover: handleHover,
            onHoverOut: handleHoverOut,
          }),
      });

      renderContainer(labelsContainer, {
        ...common,
        id: "treemap-labels",
        render: (g, opts) =>
          renderTreemapLabels(g, renderData, {
            ...opts,
            fontFamily,
            fontSize: labelFontSize,
            minCellWidth: 40,
            minCellHeight: 25,
          }),
      });
    }
  }, [
    enableTransition,
    fontFamily,
    handleHover,
    handleHoverOut,
    labelFontSize,
    margins.left,
    margins.top,
    onClick,
    renderData,
    transitionDuration,
  ]);

  return (
    <>
      <g ref={nodesRef} />
      <g ref={labelsRef} />
    </>
  );
};

/**
 * TreemapNode component for rendering individual cells
 * This is an alternative component-based approach (not D3-based)
 */
export const TreemapNode = ({
  datum,
  onClick,
  onHover,
  onHoverOut,
}: {
  datum: TreemapRenderDatum;
  onClick: (observation: Observation) => void;
  onHover: (observation: Observation) => void;
  onHoverOut: () => void;
}) => {
  const isEditingAnnotation = useIsEditingAnnotation();

  return (
    <rect
      x={datum.x0}
      y={datum.y0}
      width={datum.width}
      height={datum.height}
      fill={datum.color}
      stroke="black"
      strokeWidth={0}
      rx={2}
      ry={2}
      onClick={() => onClick(datum.observation)}
      onMouseEnter={(e) => {
        if (!isEditingAnnotation) {
          (e.currentTarget as SVGRectElement).setAttribute("stroke-width", "2");
        }
        onHover(datum.observation);
      }}
      onMouseLeave={(e) => {
        if (!isEditingAnnotation) {
          (e.currentTarget as SVGRectElement).setAttribute("stroke-width", "0");
        }
        onHoverOut();
      }}
    />
  );
};
