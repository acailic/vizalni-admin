import { extent, max } from "d3-array";
import type { ScaleBand } from "d3-scale";
import type { ChartConfig } from "../config";
import type { Datum, Dimensions, Margins } from "../types";
import { createBandScale } from "./band";
import { createLinearScale } from "./linear";
import { createTimeScale } from "./time";
import { createColorScale } from "./ordinal";

export * from "./band";
export * from "./linear";
export * from "./time";
export * from "./ordinal";

export interface Scales {
  x:
    | ReturnType<typeof createTimeScale>
    | ReturnType<typeof createLinearScale>
    | ScaleBand<string>;
  y: ReturnType<typeof createLinearScale>;
  color?: ReturnType<typeof createColorScale>;
}

export interface ComputeScalesOptions extends Dimensions {}

/**
 * Computes all scales needed for a chart based on data and config
 */
export function computeScales(
  data: Datum[],
  config: ChartConfig,
  options: ComputeScalesOptions
): Scales {
  const {
    width,
    height,
    margins = { top: 30, right: 30, bottom: 50, left: 60 },
  } = options;

  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  if (config.type === "line") {
    return computeLineScales(data, config, chartWidth, chartHeight);
  }

  if (config.type === "bar") {
    return computeBarScales(data, config, chartWidth, chartHeight);
  }

  if (config.type === "pie") {
    return computePieScales(data, config);
  }

  throw new Error(`Unknown chart type: ${(config as { type: string }).type}`);
}

function computeLineScales(
  data: Datum[],
  config: Extract<ChartConfig, { type: "line" }>,
  chartWidth: number,
  chartHeight: number
): Scales {
  // X scale (time)
  const xExtent = extent(data, (d) => d[config.x.field] as Date);
  const xScale = createTimeScale({
    domain: xExtent as [Date, Date],
    range: [0, chartWidth],
    nice: true,
  });

  // Y scale (linear)
  const yMax = max(data, (d) => d[config.y.field] as number) ?? 0;
  const yScale = createLinearScale({
    domain: [0, yMax],
    range: [chartHeight, 0],
    nice: true,
  });

  // Color scale (optional)
  let colorScale;
  if (config.segment) {
    colorScale = createColorScale({
      data,
      field: config.segment.field,
      range: getDefaultColors(),
    });
  }

  return { x: xScale, y: yScale, color: colorScale };
}

function computeBarScales(
  data: Datum[],
  config: Extract<ChartConfig, { type: "bar" }>,
  chartWidth: number,
  chartHeight: number
): Scales {
  // Extract categories from x field
  const categories = [...new Set(data.map((d) => String(d[config.x.field])))];

  // X scale (band for categorical data)
  const xScale = createBandScale({
    domain: categories,
    range: [0, chartWidth],
    padding: 0.2,
  });

  // Y scale (linear)
  const yMax = max(data, (d) => d[config.y.field] as number) ?? 0;
  const yScale = createLinearScale({
    domain: [0, yMax],
    range: [chartHeight, 0],
    nice: true,
  });

  // Color scale (optional)
  let colorScale;
  if (config.segment) {
    colorScale = createColorScale({
      data,
      field: config.segment.field,
      range: getDefaultColors(),
    });
  }

  return { x: xScale, y: yScale, color: colorScale };
}

function computePieScales(
  data: Datum[],
  config: Extract<ChartConfig, { type: "pie" }>
): Scales {
  const colorScale = createColorScale({
    data,
    field: config.category.field,
    range: getDefaultColors(),
  });

  // Pie doesn't need x/y scales, return dummy scales
  const dummyScale = createLinearScale({
    domain: [0, 1],
    range: [0, 1],
  });

  return { x: dummyScale, y: dummyScale, color: colorScale };
}

/**
 * Default color palette (tableau10)
 */
function getDefaultColors(): string[] {
  return [
    "#4e79a7",
    "#f28e2c",
    "#e15759",
    "#76b7b2",
    "#59a14f",
    "#edc949",
    "#af7aa1",
    "#ff9da7",
    "#9c755f",
    "#bab0ab",
  ];
}
