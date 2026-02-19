import { pie, arc } from "d3-shape";
import type { PieArcDatum } from "d3-shape";
import { useChart } from "../hooks/useChart";
import type { PieConfig, Datum } from "@vizualni/core";
import { getDefaultColor } from "@vizualni/core";

export interface PieChartProps {
  data: Datum[];
  config: PieConfig;
  width: number;
  height: number;
  className?: string;
  /** Inner radius as proportion (0 = pie, 0.5 = donut) */
  innerRadius?: number;
}

export function PieChart({
  data,
  config,
  width,
  height,
  className,
  innerRadius: innerRadiusProp,
}: PieChartProps) {
  const { scales } = useChart(data, config, { width, height });

  // Dimensions
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = Math.min(width, height) / 2 - 20;
  const innerRadius =
    (innerRadiusProp ?? config.innerRadius ?? 0) * outerRadius;

  // Create pie layout
  const pieGenerator = pie<Datum>()
    .value((d) => d[config.value.field] as number)
    .sort(null);

  const pieData = pieGenerator(data);

  // Create arc generator
  const arcGenerator = arc<PieArcDatum<Datum>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Pie chart"
    >
      <g transform={`translate(${cx}, ${cy})`}>
        {pieData.map((slice, i) => {
          const path = arcGenerator(slice);
          if (!path) return null;

          const color = scales.color
            ? scales.color(String(slice.data[config.category.field]))
            : getDefaultColor(i);

          return (
            <path key={i} d={path} fill={color} stroke="#fff" strokeWidth={2} />
          );
        })}
      </g>
    </svg>
  );
}
