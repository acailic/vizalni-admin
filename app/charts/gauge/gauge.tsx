import { interpolate } from "d3-interpolate";
import { select, Selection } from "d3-selection";
import { arc, Arc } from "d3-shape";
import { Transition } from "d3-transition";
import { useEffect, useMemo, useRef } from "react";

import {
  GaugeArc,
  GaugeState,
  GaugeValueDisplayData,
} from "@/charts/gauge/gauge-state";
import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { useChartState } from "@/charts/shared/chart-state";
import {
  maybeTransition,
  renderContainer,
  RenderOptions,
} from "@/charts/shared/rendering-utils";
import { useAnnotationInteractions } from "@/charts/shared/use-annotation-interactions";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { Observation } from "@/domain/data";
import { useTransitionStore } from "@/stores/transition";
import { useEvent } from "@/utils/use-event";

/** Render data for a single gauge arc segment */
export type GaugeArcRenderDatum = {
  key: string;
  arc: GaugeArc;
  color: string;
  opacity: number;
  isValueArc?: boolean;
};

type RenderGaugeArcsOptions = RenderOptions & {
  arcGenerator: Arc<any, any>;
  onClick: (observation: Observation | undefined) => void;
  onHover: (
    el: SVGPathElement,
    observation: Observation | undefined,
    { arc }: { arc: GaugeArc }
  ) => void;
  onHoverOut: (el: SVGPathElement) => void;
};

/**
 * Renders gauge arcs using D3
 */
const renderGaugeArcs = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  renderData: GaugeArcRenderDatum[],
  options: RenderGaugeArcsOptions
) => {
  const { arcGenerator, transition, onClick, onHover, onHoverOut } = options;

  g.selectAll<SVGPathElement, GaugeArcRenderDatum>("path.arc")
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
            onClick(undefined);
          })
          .on("mouseenter", function (_, d) {
            onHover(this, undefined, { arc: d.arc });
          })
          .on("mouseleave", function () {
            onHoverOut(this);
          })
          .call((enter) =>
            maybeTransition(enter, {
              transition,
              s: (g) => g.attr("d", (d) => createArcPath(arcGenerator, d.arc)),
              t: (g) => g.call(animateGaugeArc, arcGenerator),
            })
          ),
      (update) =>
        update.call((update) =>
          maybeTransition(update, {
            transition,
            s: (g) =>
              g
                .attr("d", (d) => createArcPath(arcGenerator, d.arc))
                .attr("fill", (d) => d.color)
                .attr("opacity", (d) => d.opacity),
            t: (g) =>
              g
                .call(animateGaugeArc, arcGenerator)
                .attr("fill", (d) => d.color)
                .attr("opacity", (d) => d.opacity),
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
 * Create arc path string from arc generator and data
 */
const createArcPath = (arcGenerator: Arc<any, any>, arc: GaugeArc): string => {
  return arcGenerator({
    startAngle: arc.startAngle,
    endAngle: arc.endAngle,
    innerRadius: arc.innerRadius,
    outerRadius: arc.outerRadius,
  }) as string;
};

/**
 * Animate gauge arc path transitions
 */
const animateGaugeArc = (
  g: Transition<SVGPathElement, GaugeArcRenderDatum, SVGGElement, unknown>,
  arcGenerator: Arc<any, any>
) => {
  return g.attrTween("d", function (d) {
    const that = this as any;
    // Previous arc state
    const prevArc = that.__arc__ as GaugeArc | undefined;
    const i = interpolate(
      prevArc ?? {
        startAngle: d.arc.startAngle,
        endAngle: d.arc.startAngle,
        innerRadius: d.arc.innerRadius,
        outerRadius: d.arc.outerRadius,
      },
      d.arc
    );

    return (t) => {
      that.__arc__ = i(t);
      return createArcPath(arcGenerator, that.__arc__);
    };
  });
};

type RenderGaugeNeedleOptions = RenderOptions & {
  centerX: number;
  centerY: number;
};

/**
 * Renders gauge needle using D3
 */
const renderGaugeNeedle = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  needle: {
    angle: number;
    length: number;
    baseWidth: number;
    color: string;
    value: number;
  },
  options: RenderGaugeNeedleOptions
) => {
  const { transition, centerX, centerY } = options;
  const { angle, length, baseWidth, color } = needle;

  // Calculate needle path
  const needleLength = length;
  const needlePath = createNeedlePath(angle, needleLength, baseWidth);

  g.selectAll<SVGPathElement, typeof needle>("path.needle")
    .data([needle], () => "needle")
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "needle")
          .attr("d", needlePath)
          .attr("fill", color)
          .attr("stroke", color)
          .attr("stroke-width", 1)
          .attr("stroke-linejoin", "round")
          .attr("transform", `translate(${centerX}, ${centerY})`)
          .call((enter) =>
            maybeTransition(enter, {
              transition,
              s: (g) => g,
              t: (g) => g.attr("opacity", 0).transition().attr("opacity", 1),
            })
          ),
      (update) =>
        update.call((update) =>
          maybeTransition(update, {
            transition,
            s: (g) =>
              g
                .attr("d", needlePath)
                .attr("fill", color)
                .attr("transform", `translate(${centerX}, ${centerY})`),
            t: (g) =>
              g
                .transition()
                .attrTween("transform", function () {
                  const that = this as SVGPathElement;
                  const currentTransform = that.getAttribute("transform") || "";
                  // Extract current angle from transform if possible
                  const prevAngle = extractAngleFromTransform(
                    currentTransform,
                    angle
                  );
                  const i = interpolate(prevAngle, angle);
                  return (t) =>
                    `translate(${centerX}, ${centerY}) rotate(${(i(t) * 180) / Math.PI})`;
                })
                .attr("fill", color),
          })
        ),
      (exit) => exit.remove()
    );

  // Add needle center circle
  g.selectAll<SVGCircleElement, typeof needle>("circle.needle-center")
    .data([needle], () => "needle-center")
    .join(
      (enter) =>
        enter
          .append("circle")
          .attr("class", "needle-center")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", baseWidth * 0.6)
          .attr("fill", color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2),
      (update) =>
        update
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", baseWidth * 0.6)
          .attr("fill", color),
      (exit) => exit.remove()
    );
};

/**
 * Create needle path for the given angle
 */
const createNeedlePath = (
  angle: number,
  length: number,
  baseWidth: number
): string => {
  // Needle points upward initially (at -90 degrees)
  // We rotate the entire needle to the correct angle
  const tipY = -length;
  const baseY = baseWidth * 0.5;
  const halfBase = baseWidth / 2;

  return `M 0 ${tipY} L ${-halfBase} ${baseY} L ${halfBase} ${baseY} Z`;
};

/**
 * Extract angle from transform string
 */
const extractAngleFromTransform = (
  transform: string,
  defaultAngle: number
): number => {
  const rotateMatch = transform.match(/rotate\(([-\d.]+)\)/);
  if (rotateMatch) {
    return (parseFloat(rotateMatch[1]) * Math.PI) / 180;
  }
  return defaultAngle;
};

type RenderGaugeValueOptions = RenderOptions & {
  fontFamily: string;
};

/**
 * Renders gauge value display using D3
 */
const renderGaugeValue = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  valueDisplay: GaugeValueDisplayData,
  options: RenderGaugeValueOptions
) => {
  const { transition, fontFamily } = options;
  const { formattedValue, x, y, fontSize, color } = valueDisplay;

  g.selectAll<SVGTextElement, GaugeValueDisplayData>("text.gauge-value")
    .data([valueDisplay], () => "gauge-value")
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("class", "gauge-value")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-family", fontFamily)
          .attr("font-size", fontSize ?? 16)
          .attr("font-weight", "600")
          .attr("fill", color ?? "#1f2937")
          .text(formattedValue)
          .call((enter) =>
            maybeTransition(enter, {
              transition,
              s: (g) => g,
              t: (g) => g.attr("opacity", 0).transition().attr("opacity", 1),
            })
          ),
      (update) =>
        update.call((update) =>
          maybeTransition(update, {
            transition,
            s: (g) =>
              g
                .attr("x", x)
                .attr("y", y)
                .attr("font-size", fontSize ?? 16)
                .attr("fill", color ?? "#1f2937")
                .text(formattedValue),
            t: (g) =>
              g
                .transition()
                .attr("x", x)
                .attr("y", y)
                .attr("font-size", fontSize ?? 16)
                .attr("fill", color ?? "#1f2937")
                .text(formattedValue),
          })
        ),
      (exit) => exit.remove()
    );
};

/**
 * Renders min/max labels for the gauge
 */
const renderGaugeMinMaxLabels = (
  g: Selection<SVGGElement, null, SVGGElement, unknown>,
  data: {
    min: number;
    max: number;
    centerX: number;
    centerY: number;
    radius: number;
    startAngle: number;
    endAngle: number;
  },
  options: RenderGaugeValueOptions
) => {
  const { transition, fontFamily } = options;
  const { min, max, centerX, centerY, radius, startAngle, endAngle } = data;

  // Calculate label positions
  const labelOffset = radius * 0.15;
  const minLabelX = centerX + Math.cos(startAngle) * (radius + labelOffset);
  const minLabelY = centerY + Math.sin(startAngle) * (radius + labelOffset);
  const maxLabelX = centerX + Math.cos(endAngle) * (radius + labelOffset);
  const maxLabelY = centerY + Math.sin(endAngle) * (radius + labelOffset);

  const labels = [
    { key: "min", value: String(min), x: minLabelX, y: minLabelY },
    { key: "max", value: String(max), x: maxLabelX, y: maxLabelY },
  ];

  g.selectAll<SVGTextElement, (typeof labels)[0]>("text.gauge-label")
    .data(labels, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("class", "gauge-label")
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-family", fontFamily)
          .attr("font-size", 12)
          .attr("fill", "#6b7280")
          .text((d) => d.value),
      (update) =>
        update
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .text((d) => d.value),
      (exit) => exit.remove()
    );
};

/**
 * Gauge component that renders the gauge visualization
 * Supports threshold arcs, needle indicator, and value display
 */
export const Gauge = () => {
  const {
    bounds: { width, height, chartWidth, chartHeight },
    arcs,
    needle,
    valueDisplay,
    colors,
    radius,
    innerRadius,
    centerX,
    centerY,
    min,
    max,
  } = useChartState() as GaugeState;
  const isEditingAnnotation = useIsEditingAnnotation();
  const { fontFamily, labelFontSize } = useChartTheme();
  const enableTransition = useTransitionStore((state) => state.enable);
  const transitionDuration = useTransitionStore((state) => state.duration);
  const arcsRef = useRef<SVGGElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const valueRef = useRef<SVGGElement>(null);
  const labelsRef = useRef<SVGGElement>(null);

  // Create arc generator
  const arcGenerator = useMemo(() => {
    return arc<any>()
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle)
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius)
      .cornerRadius(3);
  }, []);

  // Get visual options for start/end angles
  const startAngle = arcs[0]?.startAngle ?? (-135 * Math.PI) / 180;
  const endAngle = arcs[0]?.endAngle ?? (135 * Math.PI) / 180;

  // Create render data from arcs
  const renderData = useMemo(() => {
    return arcs.map((arc, index) => ({
      key: arc.label ?? `arc-${index}`,
      arc,
      color: arc.color,
      opacity: 1,
      isValueArc: arc.value !== undefined,
    }));
  }, [arcs]);

  const { onClick, onHover, onHoverOut } = useAnnotationInteractions({
    focusingSegment: false,
  });

  const handleHover = useEvent(
    (
      el: SVGPathElement,
      _observation: Observation | undefined,
      { arc }: { arc: GaugeArc }
    ) => {
      if (!isEditingAnnotation) {
        select(el).attr("stroke", "#000").attr("stroke-width", 2).raise();
      }
      if (arc.value !== undefined) {
        onHover(undefined, { segment: arc.label ?? "" });
      }
    }
  );

  const handleHoverOut = useEvent((el: SVGPathElement) => {
    if (!isEditingAnnotation) {
      select(el).attr("stroke", "#fff").attr("stroke-width", 1);
    }
    onHoverOut();
  });

  useEffect(() => {
    const arcsContainer = arcsRef.current;
    const needleContainer = needleRef.current;
    const valueContainer = valueRef.current;
    const labelsContainer = labelsRef.current;

    if (arcsContainer) {
      renderContainer(arcsContainer, {
        id: "gauge-arcs",
        transform: `translate(${centerX}, ${centerY})`,
        transition: {
          enable: enableTransition,
          duration: transitionDuration,
        },
        render: (g, opts) =>
          renderGaugeArcs(g, renderData, {
            ...opts,
            arcGenerator,
            onClick,
            onHover: handleHover,
            onHoverOut: handleHoverOut,
          }),
      });
    }

    if (needleContainer) {
      renderContainer(needleContainer, {
        id: "gauge-needle",
        transform: "",
        transition: {
          enable: enableTransition,
          duration: transitionDuration,
        },
        render: (g, opts) =>
          renderGaugeNeedle(g, needle, {
            ...opts,
            centerX,
            centerY,
          }),
      });
    }

    if (valueContainer) {
      renderContainer(valueContainer, {
        id: "gauge-value",
        transform: "",
        transition: {
          enable: enableTransition,
          duration: transitionDuration,
        },
        render: (g, opts) =>
          renderGaugeValue(g, valueDisplay, {
            ...opts,
            fontFamily,
          }),
      });
    }

    if (labelsContainer) {
      renderContainer(labelsContainer, {
        id: "gauge-labels",
        transform: "",
        transition: {
          enable: enableTransition,
          duration: transitionDuration,
        },
        render: (g, opts) =>
          renderGaugeMinMaxLabels(
            g,
            {
              min,
              max,
              centerX,
              centerY,
              radius,
              startAngle,
              endAngle,
            },
            {
              ...opts,
              fontFamily,
            }
          ),
      });
    }
  }, [
    arcGenerator,
    centerX,
    centerY,
    enableTransition,
    fontFamily,
    handleHover,
    handleHoverOut,
    labelFontSize,
    max,
    min,
    needle,
    onClick,
    onHover,
    onHoverOut,
    radius,
    renderData,
    startAngle,
    endAngle,
    transitionDuration,
    valueDisplay,
  ]);

  return (
    <>
      <g ref={arcsRef} />
      <g ref={needleRef} />
      <g ref={valueRef} />
      <g ref={labelsRef} />
    </>
  );
};

/**
 * Gauge value display component (React-only alternative)
 */
export const GaugeValueDisplay = ({
  valueDisplay,
  fontFamily,
}: {
  valueDisplay: GaugeValueDisplayData;
  fontFamily: string;
}) => {
  const { formattedValue, x, y, fontSize, color } = valueDisplay;

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={fontFamily}
      fontSize={fontSize ?? 16}
      fontWeight={600}
      fill={color ?? "#1f2937"}
    >
      {formattedValue}
    </text>
  );
};

/**
 * Gauge needle component (React-only alternative)
 */
export const GaugeNeedleComponent = ({
  needle,
  centerX,
  centerY,
}: {
  needle: {
    angle: number;
    length: number;
    baseWidth: number;
    color: string;
    value: number;
  };
  centerX: number;
  centerY: number;
}) => {
  const { angle, length, baseWidth, color } = needle;

  // Needle points upward initially (at -90 degrees)
  const tipY = -length;
  const baseY = baseWidth * 0.5;
  const halfBase = baseWidth / 2;

  const pathD = `M 0 ${tipY} L ${-halfBase} ${baseY} L ${halfBase} ${baseY} Z`;

  return (
    <>
      <path
        d={pathD}
        fill={color}
        stroke={color}
        strokeWidth={1}
        strokeLinejoin="round"
        transform={`translate(${centerX}, ${centerY}) rotate(${(angle * 180) / Math.PI})`}
        style={{
          transition: "transform 0.3s ease-out",
        }}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={baseWidth * 0.6}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
      />
    </>
  );
};
