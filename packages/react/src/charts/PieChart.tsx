import React from "react";
import { useChart } from "../hooks/useChart";
import type { PieConfig, Datum } from "@vizualni/core";

export interface PieChartProps {
  data: Datum[];
  config: PieConfig;
  width: number;
  height: number;
  className?: string;
}

export function PieChart({
  data,
  config,
  width,
  height,
  className,
}: PieChartProps) {
  const { scales, layout } = useChart(data, config as any, { width, height });

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 20;

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Pie chart"
    >
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e0e0e0" />
    </svg>
  );
}
