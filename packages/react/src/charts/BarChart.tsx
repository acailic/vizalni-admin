import React from "react";
import { useChart } from "../hooks/useChart";
import { YAxis } from "../svg/Axes";
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
  const { scales, layout } = useChart(data, config as BarChartConfig, {
    width,
    height,
  });

  // Get band scale methods
  const xScale = scales.x as ReturnType<
    typeof import("d3-scale").scaleBand<string>
  >;
  const bandwidth = xScale.bandwidth();

  // Get color if segment exists
  const getColor = (d: Datum) => {
    if (config.segment && scales.color) {
      return scales.color(String(d[config.segment.field]));
    }
    return "#4e79a7"; // Default color
  };

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Bar chart"
    >
      {/* Chart area group */}
      <g transform={`translate(${layout.chartArea.x}, ${layout.chartArea.y})`}>
        {/* Bars */}
        {data.map((d, i) => {
          const category = String(d[config.x.field]);
          const x = xScale(category);
          const y = scales.y(d[config.y.field] as number);
          const barHeight = layout.chartArea.height - y;

          if (x === undefined) return null;

          return (
            <rect
              key={`${category}-${i}`}
              x={x}
              y={y}
              width={bandwidth}
              height={barHeight}
              fill={getColor(d)}
            />
          );
        })}
      </g>

      {/* X Axis */}
      <g
        transform={`translate(${layout.chartArea.x}, ${layout.chartArea.y + layout.chartArea.height})`}
      >
        {xScale.domain().map((category) => {
          const x = xScale(category);
          if (x === undefined) return null;
          return (
            <text
              key={category}
              x={x + bandwidth / 2}
              y={20}
              textAnchor="middle"
              fontSize="12px"
              fill="#666"
            >
              {category}
            </text>
          );
        })}
      </g>

      {/* Y Axis */}
      <YAxis scale={scales.y} width={layout.chartArea.x} />
    </svg>
  );
}
