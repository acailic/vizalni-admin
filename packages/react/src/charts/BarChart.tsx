import React from "react";
import { useChart } from "../hooks/useChart";
import type { BarChartConfig, Datum } from "@vizualni/core";

export interface BarChartProps {
  data: Datum[];
  config: BarChartConfig;
  width: number;
  height: number;
  className?: string;
}

export function BarChart({
  data,
  config,
  width,
  height,
  className,
}: BarChartProps) {
  const { scales, layout } = useChart(data, config as any, { width, height });

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Bar chart"
    >
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
