import { line, pie, arc } from "d3-shape";
import type { PieArcDatum } from "d3-shape";
import type { ScaleBand } from "d3-scale";
import type { ChartConfig } from "../config";
import type { Datum, Shape, LineShape, BarShape, ArcShape } from "../types";
import type { Scales } from "../scales";
import type { Layout } from "../layout";
import { getDefaultColor } from "../utils/colors";

export interface ComputeShapesOptions {
  scales: Scales;
  layout: Layout;
}

/**
 * Computes shape rendering instructions for a chart
 */
export function computeShapes(
  data: Datum[],
  config: ChartConfig,
  options: ComputeShapesOptions
): Shape[] {
  const { scales, layout } = options;

  if (config.type === "line") {
    return computeLineShapes(data, config, scales, layout);
  }

  if (config.type === "bar") {
    return computeBarShapes(data, config, scales, layout);
  }

  if (config.type === "pie") {
    return computePieShapes(data, config, scales, layout);
  }

  return [];
}

function computeLineShapes(
  data: Datum[],
  config: Extract<ChartConfig, { type: "line" }>,
  scales: Scales,
  layout: Layout
): Shape[] {
  const { chartArea } = layout;
  const shapes: Shape[] = [];

  // If we have segments, group data by segment
  if (config.segment) {
    const segments = [
      ...new Set(data.map((d) => String(d[config.segment!.field]))),
    ];

    segments.forEach((segment, segmentIndex) => {
      const segmentData = data.filter(
        (d) => String(d[config.segment!.field]) === segment
      );

      const path = computeLinePath(segmentData, config, scales, chartArea);
      const color = scales.color
        ? scales.color(segment)
        : getDefaultColor(segmentIndex);

      shapes.push({
        type: "line",
        path,
        segment,
        stroke: color,
        strokeWidth: 2,
        fill: "none",
        index: segmentIndex,
      } as LineShape);
    });
  } else {
    // Single line
    const path = computeLinePath(data, config, scales, chartArea);
    shapes.push({
      type: "line",
      path,
      stroke: getDefaultColor(0),
      strokeWidth: 2,
      fill: "none",
      index: 0,
    } as LineShape);
  }

  return shapes;
}

function computeLinePath(
  data: Datum[],
  config: Extract<ChartConfig, { type: "line" }>,
  scales: Scales,
  chartArea: { x: number; y: number; width: number; height: number }
): string {
  // Sort data by x field
  const sortedData = [...data].sort((a, b) => {
    const aVal = a[config.x.field];
    const bVal = b[config.x.field];
    if (aVal instanceof Date && bVal instanceof Date) {
      return aVal.getTime() - bVal.getTime();
    }
    return 0;
  });

  // Cast scales to accept the appropriate value types
  const xScale = scales.x as (value: unknown) => number;
  const yScale = scales.y as (value: unknown) => number;

  const lineGenerator = line<Datum>()
    .x((d) => {
      const val = d[config.x.field];
      const scaled = xScale(val);
      return chartArea.x + (scaled ?? 0);
    })
    .y((d) => {
      const val = d[config.y.field];
      const scaled = yScale(val);
      return chartArea.y + (scaled ?? 0);
    });

  return lineGenerator(sortedData) ?? "";
}

function computeBarShapes(
  data: Datum[],
  config: Extract<ChartConfig, { type: "bar" }>,
  scales: Scales,
  layout: Layout
): Shape[] {
  const { chartArea } = layout;
  const xScale = scales.x as ScaleBand<string>;
  const bandwidth = xScale.bandwidth();
  const shapes: Shape[] = [];

  data.forEach((d, i) => {
    const category = String(d[config.x.field]);
    const value = d[config.y.field] as number;

    const x = chartArea.x + (xScale(category) ?? 0);
    const yRange = scales.y.range();
    const y = scales.y(Math.max(0, value));
    const height = Math.abs(yRange[0] - yRange[1]) - scales.y(value);

    const color = scales.color
      ? scales.color(
          config.segment ? String(d[config.segment.field]) : category
        )
      : getDefaultColor(i);

    shapes.push({
      type: "bar",
      x,
      y: y,
      width: bandwidth,
      height,
      category,
      fill: color,
      stroke: "#fff",
      strokeWidth: 1,
      datum: d,
      index: i,
    } as BarShape);
  });

  return shapes;
}

function computePieShapes(
  data: Datum[],
  config: Extract<ChartConfig, { type: "pie" }>,
  scales: Scales,
  layout: Layout
): Shape[] {
  const { width, height } = layout;
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = Math.min(width, height) / 2 - 20;
  const innerRadius = (config.innerRadius ?? 0) * outerRadius;

  const shapes: Shape[] = [];

  // Create pie layout
  const pieGenerator = pie<Datum>()
    .value((d) => d[config.value.field] as number)
    .sort(null);

  const pieData = pieGenerator(data);

  // Create arc generator
  const arcGenerator = arc<PieArcDatum<Datum>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  pieData.forEach((slice, i) => {
    const path = arcGenerator(slice);
    if (!path) return;

    const category = String(slice.data[config.category.field]);
    const color = scales.color ? scales.color(category) : getDefaultColor(i);

    shapes.push({
      type: "arc",
      path,
      cx,
      cy,
      startAngle: slice.startAngle,
      endAngle: slice.endAngle,
      category,
      value: slice.value,
      fill: color,
      stroke: "#fff",
      strokeWidth: 2,
      datum: slice.data,
      index: i,
    } as ArcShape);
  });

  return shapes;
}
