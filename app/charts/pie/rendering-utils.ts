import { interpolate } from "d3-interpolate";
import { Selection } from "d3-selection";
import { Arc, PieArcDatum } from "d3-shape";
import { Transition } from "d3-transition";

import {
  maybeTransition,
  RenderOptions,
} from "@/charts/shared/rendering-utils";
import { Observation } from "@/domain/data";

// Pie chart variant types for donut support
export type PieVariant = "pie" | "donut" | "donut-thin";

/**
 * Calculate the inner radius for pie/donut chart variants
 * @param variant - The pie chart variant (pie, donut, or donut-thin)
 * @param outerRadius - The outer radius of the chart
 * @returns The inner radius (0 for pie, 50% for donut, 60% for donut-thin)
 */
export function calculateDonutInnerRadius(
  variant: PieVariant,
  outerRadius: number
): number {
  switch (variant) {
    case "pie":
      return 0;
    case "donut":
      return outerRadius * 0.5;
    case "donut-thin":
      return outerRadius * 0.6;
    default:
      return 0;
  }
}

/**
 * Determine whether leader lines should be used for label placement
 * @param sliceAngle - The angle of the pie slice in degrees
 * @param minAngleForInternalLabel - Minimum angle threshold for internal labels
 * @returns true if leader lines should be used (small slices), false otherwise
 */
export function shouldUseLeaderLines(
  sliceAngle: number,
  minAngleForInternalLabel: number
): boolean {
  return sliceAngle < minAngleForInternalLabel;
}

export type RenderDatum = {
  key: string;
  value: number;
  arcDatum: PieArcDatum<Observation>;
  color: string;
  segment: string;
};

type RenderPieOptions = RenderOptions & {
  arcGenerator: Arc<any, any>;
  onClick: (
    observation: Observation,
    { segment }: { segment?: string }
  ) => void;
  onHover: (
    el: SVGPathElement,
    observation: Observation,
    { segment }: { segment: string }
  ) => void;
  onHoverOut: (el: SVGPathElement) => void;
};

export const renderPies = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  renderData: RenderDatum[],
  options: RenderPieOptions
) => {
  const { arcGenerator, transition, onClick, onHover, onHoverOut } = options;

  g.selectAll<SVGPathElement, RenderDatum>("path")
    .data(renderData, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("data-index", (_, i) => i)
          .attr("fill", (d) => d.color)
          .attr("stroke", "black")
          .attr("stroke-width", 0)
          .on("click", (_, d) => {
            onClick(d.arcDatum.data, { segment: d.segment });
          })
          .on("mouseenter", function (_, d) {
            onHover(this, d.arcDatum.data, { segment: d.segment });
          })
          .on("mouseleave", function () {
            onHoverOut(this);
          })
          .call((enter) =>
            maybeTransition(enter, {
              transition,
              s: (g) => g.attr("d", (d) => arcGenerator(d.arcDatum)),
              t: (g) => g.call(animatePath, arcGenerator),
            })
          ),
      (update) =>
        update.call((update) =>
          maybeTransition(update, {
            transition,
            s: (g) =>
              g
                .attr("d", (d) => arcGenerator(d.arcDatum))
                .attr("fill", (d) => d.color),
            t: (g) =>
              g.call(animatePath, arcGenerator).attr("fill", (d) => d.color),
          })
        ),
      (exit) =>
        maybeTransition(exit, {
          transition,
          s: (g) => g.attr("d", (d) => arcGenerator(d.arcDatum)).remove(),
          t: (g) => g.call(animatePath, arcGenerator).remove(),
        })
    );
};

const animatePath = (
  g: Transition<SVGPathElement, RenderDatum, SVGGElement, unknown>,
  arcGenerator: Arc<any, any>
) => {
  return g.attrTween("d", function (d) {
    const that = this as any;
    // Previous arcDatum.
    const _d = that.__d__ as PieArcDatum<Observation> | undefined;
    const i = interpolate(_d ?? d.arcDatum, d.arcDatum);

    return (t) => {
      that.__d__ = i(t);
      return arcGenerator(that.__d__) as string;
    };
  });
};
