import React from "react";
import { useChart } from "../hooks/useChart";
import type { LineChartConfig, Datum } from "@vizualni/core";

export interface LineChartProps {
  data: Datum[];
  config: LineChartConfig;
  width: number;
  height: number;
  className?: string;
}

/**
 * Line chart component
 */
export function LineChart({
  data,
  config,
  width,
  height,
  className,
}: LineChartProps) {
  const { scales, layout } = useChart(data, config as any, { width, height });

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Line chart"
    >
      {/* Chart content will be added in Task 14 */}
      <rect
        x={layout.chartArea.x}
        y={layout.chartArea.y}
        width={layout.chartArea.width}
        height={layout.chartArea.height}
        fill="none"
        stroke="#e0e0e0"
      />
    </svg>
  );
}
