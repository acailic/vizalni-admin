import { useEffect, useMemo, useRef } from "react";

import {
  renderCircles,
  RenderDatum,
} from "@/charts/scatterplot/rendering-utils";
import { ScatterplotState } from "@/charts/scatterplot/scatterplot-state";
import { useChartState } from "@/charts/shared/chart-state";
import { renderContainer } from "@/charts/shared/rendering-utils";
import { useTransitionStore } from "@/stores/transition";
import { ScatterplotCanvas } from "./scatterplot-canvas";
import { useOptimizedRendering } from "@/charts/shared/optimized-chart-wrapper";

export const Scatterplot = () => {
  const {
    chartData,
    bounds,
    getX,
    xScale,
    getY,
    yScale,
    getSegment,
    colors,
    getRenderingKey,
  } = useChartState() as ScatterplotState;

  // Check if we should use canvas rendering
  const { shouldUseCanvas, lodLevel } = useOptimizedRendering('scatterplot', chartData.length);

  // For large datasets, use canvas rendering
  if (shouldUseCanvas) {
    return <ScatterplotCanvas />;
  }

  // Original SVG rendering for smaller datasets
  const { margins } = bounds;
  const ref = useRef<SVGGElement>(null);
  const enableTransition = useTransitionStore((state) => state.enable);
  const transitionDuration = useTransitionStore((state) => state.duration);

  const renderData = useMemo(() => {
    // Apply level-of-detail optimization for SVG rendering
    let step = 1;
    if (lodLevel === 'medium') step = 2;
    if (lodLevel === 'low') step = 4;
    if (lodLevel === 'pixel') step = 8;

    return chartData.filter((_, index) => index % step === 0).map((d) => {
      const segment = getSegment(d);

      return {
        key: getRenderingKey(d),
        cx: xScale(getX(d) ?? NaN),
        cy: yScale(getY(d) ?? NaN),
        color: colors(segment),
      } satisfies RenderDatum;
    });
  }, [
    chartData,
    getSegment,
    getRenderingKey,
    xScale,
    getX,
    yScale,
    getY,
    colors,
    lodLevel,
  ]);

  useEffect(() => {
    if (ref.current && renderData) {
      renderContainer(ref.current, {
        id: "scatterplot",
        transform: `translate(${margins.left} ${margins.top})`,
        transition: { enable: enableTransition, duration: transitionDuration },
        render: (g, opts) => renderCircles(g, renderData, opts),
      });
    }
  }, [
    enableTransition,
    margins.left,
    margins.top,
    renderData,
    transitionDuration,
  ]);

  return <g ref={ref} />;
};
