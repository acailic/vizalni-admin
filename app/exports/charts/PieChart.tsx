/**
 * Standalone Pie Chart Component
 *
 * A D3-based pie/donut chart component that works in any React application.
 * Decoupled from Next.js and framework-agnostic.
 *
 * @example
 * ```tsx
 * import { PieChart } from '@acailic/vizualni-admin/charts';
 *
 * function MyChart() {
 *   const data = [
 *     { category: 'Product A', value: 300 },
 *     { category: 'Product B', value: 150 },
 *     { category: 'Product C', value: 100 },
 *     { category: 'Product D', value: 50 },
 *   ];
 *
 *   return (
 *     <PieChart
 *       data={data}
 *       config={{ xAxis: 'category', yAxis: 'value' }}
 *       height={400}
 *     />
 *   );
 * }
 * ```
 */

import { easeCubicOut } from "d3-ease";
import { interpolateArray } from "d3-interpolate";
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";
import "d3-transition";
import { memo, useEffect, useRef, useState } from "react";

import type { ChartProps } from "./types";

export interface PieChartProps extends Omit<ChartProps, "config"> {
  config: {
    /** Key for category labels */
    xAxis: string;
    /** Key for values */
    yAxis: string;
    /** Chart color palette (will use professional colors by default) */
    color?: string;
    /** Chart title */
    title?: string;
    /** Donut chart inner radius ratio (0-1, default 0.6) */
    innerRadiusRatio?: number;
    /** Show labels on slices */
    showLabels?: boolean;
    /** Label position: 'inside' or 'outside' */
    labelPosition?: "inside" | "outside";
    /** Show percentage in labels */
    showPercentages?: boolean;
    /** Show legend */
    showLegend?: boolean;
    /** Legend position: 'right' or 'bottom' */
    legendPosition?: "right" | "bottom";
    /** Animation duration in ms */
    animationDuration?: number;
  };
}

interface TooltipData {
  x: number;
  y: number;
  category: string;
  value: number;
  percentage: number;
  color: string;
}

// Professional color palette
const professionalColors = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#a855f7", // Purple
  "#64748b", // Slate
];

/**
 * Standalone PieChart component
 */
export const PieChart = memo(
  ({
    data,
    config,
    height = 400,
    width = "100%",
    locale = "sr-Latn",
    className = "",
    style = {},
    onDataPointClick,
    renderTooltip,
    showTooltip = true,
    animated = true,
    id = "pie-chart",
    ariaLabel,
    description,
  }: PieChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [containerWidth, setContainerWidth] = useState(800);

    const margin =
      config.legendPosition === "bottom"
        ? { top: 40, right: 40, bottom: 120, left: 40 }
        : { top: 40, right: 200, bottom: 40, left: 40 };

    const actualWidth = typeof width === "number" ? width : containerWidth;
    const innerWidth = actualWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const {
      xAxis: categoryKey,
      yAxis: valueKey,
      innerRadiusRatio = 0.6,
      showLabels = true,
      labelPosition = "inside",
      showPercentages = true,
      showLegend = true,
      legendPosition = "right",
      animationDuration = 1200,
      title,
    } = config;

    // Responsive width handling
    useEffect(() => {
      if (typeof width === "string" && containerRef.current) {
        const observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setContainerWidth(entry.contentRect.width);
          }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
      }
    }, [width]);

    useEffect(() => {
      if (!svgRef.current || !data || data.length === 0) return;

      // Clear previous chart
      select(svgRef.current).selectAll("*").remove();

      const svg = select(svgRef.current);

      // Create chart group
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Calculate dimensions
      const chartSize = Math.min(innerWidth, innerHeight);
      const radius = chartSize / 2;
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;

      // Process data and calculate total
      const processedData = data.map((d) => ({
        ...d,
        value: Number(d[valueKey]) || 0,
        category: String(d[categoryKey]),
      }));

      const total = processedData.reduce((sum, d) => sum + d.value, 0);

      // Create color scale (simple function, not a hook)
      const colorScale = (index: number) =>
        professionalColors[index % professionalColors.length];

      // Create pie generator
      const pieGenerator = pie<any>()
        .value((d) => d.value)
        .sort(null)
        .padAngle(0.02);

      const pieData = pieGenerator(processedData);

      // Create arc generator
      const arcGenerator = arc<any>()
        .innerRadius(radius * innerRadiusRatio)
        .outerRadius(radius);

      // Create arc generator for hover state
      const arcHoverGenerator = arc<any>()
        .innerRadius(radius * innerRadiusRatio)
        .outerRadius(radius * 1.05);

      // Draw slices
      const slices = g
        .selectAll(".slice")
        .data(pieData)
        .enter()
        .append("g")
        .attr("class", "slice")
        .style("cursor", onDataPointClick ? "pointer" : "default");

      // Add arc paths
      slices
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d, i) => colorScale(i))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
        .on("click", (event, d) => {
          if (onDataPointClick) {
            onDataPointClick(d.data, processedData.indexOf(d.data));
          }
        })
        .on("mouseenter", function (event, d) {
          if (showTooltip) {
            select(this)
              .transition()
              .duration(200)
              .attr("d", arcHoverGenerator as any);
          }
        })
        .on("mouseleave", function (event, d) {
          if (showTooltip) {
            select(this)
              .transition()
              .duration(200)
              .attr("d", arcGenerator as any);
            setTooltip(null);
          }
        })
        .on("mousemove", function (event, d) {
          if (showTooltip && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const percentage = (d.value / total) * 100;

            setTooltip({
              x: event.clientX - containerRect.left,
              y: event.clientY - containerRect.top,
              category: d.data.category,
              value: d.value,
              percentage,
              color: colorScale(pieData.indexOf(d)),
            });
          }
        })
        .each(function (d) {
          // Store initial angle for animation
          (this as any)._current = d;
        })
        .transition()
        .duration(animated ? animationDuration : 0)
        .ease(easeCubicOut)
        .attrTween("d", function (d) {
          if (!animated) {
            return () => arcGenerator(d) || "";
          }
          const interpolator = interpolateArray(
            [d.startAngle, d.startAngle],
            [d.startAngle, d.endAngle]
          );
          return function (t) {
            const [startAngle, endAngle] = interpolator(t);
            return arcGenerator({ ...d, startAngle, endAngle }) || "";
          };
        });

      // Add labels
      if (showLabels) {
        const labelRadius =
          labelPosition === "outside"
            ? radius * 1.2
            : (radius * (1 + innerRadiusRatio)) / 2;

        pieData.forEach((d, i) => {
          const percentage = (d.value / total) * 100;

          // Only show label if slice is big enough
          if (percentage < 5 && labelPosition === "inside") return;

          const centroid = arcGenerator.centroid(d);
          const labelAngle = (d.startAngle + d.endAngle) / 2;

          // Calculate label position
          let labelX = centerX + Math.cos(labelAngle) * labelRadius;
          let labelY = centerY + Math.sin(labelAngle) * labelRadius;

          // Adjust for outside labels
          if (labelPosition === "outside") {
            // Add line connector
            const lineStartRadius = radius * 1.02;
            const lineMidRadius = radius * 1.1;
            const lineEndRadius = radius * 1.18;

            const startX = centerX + Math.cos(labelAngle) * lineStartRadius;
            const startY = centerY + Math.sin(labelAngle) * lineStartRadius;
            const midX = centerX + Math.cos(labelAngle) * lineMidRadius;
            const midY = centerY + Math.sin(labelAngle) * lineMidRadius;
            const endX = centerX + Math.cos(labelAngle) * lineEndRadius;
            const endY = centerY + Math.sin(labelAngle) * lineEndRadius;

            g.append("polyline")
              .attr(
                "points",
                `${startX},${startY} ${midX},${midY} ${endX},${endY}`
              )
              .attr("fill", "none")
              .attr("stroke", "#9ca3af")
              .attr("stroke-width", 1)
              .style("opacity", 0)
              .transition()
              .delay(animated ? animationDuration * 0.8 : 0)
              .duration(400)
              .style("opacity", 1);
          }

          // Add label text
          const labelText = showPercentages
            ? `${d.data.category} (${percentage.toFixed(1)}%)`
            : d.data.category;

          const textAnchor =
            labelAngle > Math.PI / 2 && labelAngle < Math.PI * 1.5
              ? "end"
              : "start";

          g.append("text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("text-anchor", textAnchor)
            .attr("dominant-baseline", "middle")
            .style("font-size", labelPosition === "outside" ? "12px" : "11px")
            .style("font-weight", "600")
            .style("fill", labelPosition === "inside" ? "#fff" : "#374151")
            .style("opacity", 0)
            .style("pointer-events", "none")
            .text(labelText)
            .transition()
            .delay(animated ? animationDuration * 0.8 : 0)
            .duration(400)
            .ease(easeCubicOut)
            .style("opacity", 1);
        });
      }

      // Add center text for donut
      if (innerRadiusRatio > 0) {
        const centerGroup = g.append("g").attr("class", "center-text");

        centerGroup
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY - 10)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "24px")
          .style("font-weight", "700")
          .style("fill", "#1f2937")
          .style("opacity", 0)
          .text(total.toLocaleString())
          .transition()
          .delay(animated ? animationDuration * 0.6 : 0)
          .duration(400)
          .ease(easeCubicOut)
          .style("opacity", 1);

        centerGroup
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY + 15)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "12px")
          .style("font-weight", "500")
          .style("fill", "#6b7280")
          .style("opacity", 0)
          .text("Total")
          .transition()
          .delay(animated ? animationDuration * 0.6 : 0)
          .duration(400)
          .ease(easeCubicOut)
          .style("opacity", 1);
      }

      // Add legend
      if (showLegend) {
        let legend: d3.Selection<SVGGElement, unknown, null, undefined>;

        if (legendPosition === "right") {
          legend = g
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${innerWidth + 20}, 0)`);
        } else {
          legend = g
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(0, ${innerHeight + 40})`);
        }

        const legendBg = legend
          .append("rect")
          .attr("x", -8)
          .attr("y", -8)
          .attr("rx", 8)
          .attr("fill", "white")
          .attr("stroke", "#e5e7eb")
          .attr("stroke-width", 1)
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.05))")
          .style("opacity", 0);

        const legendItemSize = legendPosition === "bottom" ? 150 : 160;
        const itemGap = legendPosition === "bottom" ? 24 : 20;

        processedData.forEach((d, i) => {
          const color = colorScale(i);
          const percentage = ((d.value / total) * 100).toFixed(1);

          const itemGroup = legend.append("g").attr("class", "legend-item");

          if (legendPosition === "right") {
            itemGroup.attr("transform", `translate(0, ${i * itemGap})`);
          } else {
            const col = Math.floor(i / 3);
            const row = i % 3;
            itemGroup.attr(
              "transform",
              `translate(${col * legendItemSize}, ${row * itemGap})`
            );
          }

          itemGroup
            .append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("rx", 3)
            .attr("fill", color)
            .style("opacity", 0)
            .transition()
            .delay(animated ? animationDuration * 0.4 + i * 50 : 0)
            .duration(300)
            .ease(easeCubicOut)
            .style("opacity", 1);

          itemGroup
            .append("text")
            .attr("x", 18)
            .attr("y", 10)
            .style("font-size", "12px")
            .style("font-weight", "500")
            .style("fill", "#374151")
            .text(`${d.category} (${percentage}%)`)
            .style("opacity", 0)
            .transition()
            .delay(animated ? animationDuration * 0.4 + i * 50 : 0)
            .duration(300)
            .ease(easeCubicOut)
            .style("opacity", 1);
        });

        // Calculate legend dimensions
        const legendWidth =
          legendPosition === "bottom"
            ? Math.min(processedData.length, 3) * legendItemSize + 16
            : 160;
        const legendHeight =
          legendPosition === "bottom"
            ? Math.ceil(processedData.length / 3) * itemGap + 16
            : processedData.length * itemGap + 16;

        legendBg
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .transition()
          .delay(animated ? animationDuration * 0.3 : 0)
          .duration(300)
          .style("opacity", 1);
      }

      // Add title
      if (title) {
        g.append("text")
          .attr(
            "x",
            legendPosition === "right" ? (innerWidth - 100) / 2 : innerWidth / 2
          )
          .attr("y", -15)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("font-weight", "600")
          .style("fill", "#1f2937")
          .style("opacity", 0)
          .text(title)
          .transition()
          .delay(animated ? animationDuration * 0.2 : 0)
          .duration(300)
          .ease(easeCubicOut)
          .style("opacity", 1);
      }
    }, [
      data,
      categoryKey,
      valueKey,
      actualWidth,
      height,
      margin,
      innerWidth,
      innerHeight,
      innerRadiusRatio,
      showLabels,
      labelPosition,
      showPercentages,
      showLegend,
      legendPosition,
      showTooltip,
      animated,
      animationDuration,
      onDataPointClick,
    ]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ width, position: "relative", ...style }}
        role="img"
        aria-label={ariaLabel || title || "Pie chart"}
        aria-describedby={description ? `${id}-desc` : undefined}
      >
        {description && (
          <span id={`${id}-desc`} style={{ display: "none" }}>
            {description}
          </span>
        )}
        <svg
          ref={svgRef}
          id={id}
          width={actualWidth}
          height={height}
          style={{ maxWidth: "100%", height: "auto", overflow: "visible" }}
        />
        {/* Custom Tooltip */}
        {tooltip && showTooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x + 15,
              top: tooltip.y - 10,
              transform: "translateY(-50%)",
              padding: "10px 14px",
              borderRadius: "8px",
              pointerEvents: "none",
              zIndex: 100,
              minWidth: "140px",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {renderTooltip ? (
              renderTooltip({
                [categoryKey]: tooltip.category,
                [valueKey]: tooltip.value,
              })
            ) : (
              <>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#1f2937",
                    marginBottom: "6px",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: tooltip.color,
                    }}
                  />
                  {tooltip.category}
                </div>
                <div style={{ marginTop: "8px" }}>
                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "11px",
                      marginBottom: "2px",
                    }}
                  >
                    Value
                  </div>
                  <div
                    style={{
                      color: "#1f2937",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {tooltip.value.toLocaleString()}
                  </div>
                </div>
                <div style={{ marginTop: "6px" }}>
                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "11px",
                      marginBottom: "2px",
                    }}
                  >
                    Percentage
                  </div>
                  <div
                    style={{
                      color: "#1f2937",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {tooltip.percentage.toFixed(1)}%
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

PieChart.displayName = "PieChart";

export default PieChart;
