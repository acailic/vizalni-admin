import { useMemo } from "react";
import {
  computeScales,
  computeLayout,
  type ChartConfig,
  type Datum,
  type Scales,
  type Layout,
  type Margins,
  type Rect,
} from "@vizualni/core";

export interface UseChartOptions {
  width: number;
  height: number;
  margins?: Partial<Margins>;
}

export interface ChartResult {
  scales: Scales;
  layout: Layout;
}

/** Default margins for charts */
const DEFAULT_MARGINS: Margins = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 60,
};

/**
 * Headless hook that computes chart scales and layout
 */
export function useChart(
  data: Datum[],
  config: ChartConfig,
  options: UseChartOptions
): ChartResult {
  const { width, height, margins: customMargins } = options;

  const margins: Margins = useMemo(
    () => ({ ...DEFAULT_MARGINS, ...customMargins }),
    [customMargins]
  );

  const chartArea: Rect = useMemo(
    () => ({
      x: margins.left,
      y: margins.top,
      width: width - margins.left - margins.right,
      height: height - margins.top - margins.bottom,
    }),
    [width, height, margins]
  );

  const scales = useMemo(
    () => computeScales(data, config, { width, height, margins, chartArea }),
    [data, config, width, height, margins, chartArea]
  );

  const layout = useMemo(
    () => computeLayout(config, { width, height, margins: customMargins }),
    [config, width, height, customMargins]
  );

  return useMemo(() => ({ scales, layout }), [scales, layout]);
}
