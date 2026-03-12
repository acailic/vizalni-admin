/**
 * Standalone Column Chart Component
 *
 * A D3-based column chart component (vertical bar chart) that works in any React application.
 * Decoupled from Next.js and framework-agnostic.
 *
 * @example
 * ```tsx
 * import { ColumnChart } from '@acailic/vizualni-admin/charts';
 *
 * function MyChart() {
 *   const data = [
 *     { month: 'Jan', value: 100 },
 *     { month: 'Feb', value: 120 },
 *     { month: 'Mar', value: 115 },
 *   ];
 *
 *   return (
 *     <ColumnChart
 *       data={data}
 *       config={{ xAxis: 'month', yAxis: 'value', color: '#6366f1' }}
 *       height={400}
 *     />
 *   );
 * }
 * ```
 */

import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { easeCubicOut } from "d3-ease";
import { scaleBand, scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import "d3-transition";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import type { ChartProps, BaseChartConfig } from "./types";

export interface ColumnChartProps extends Omit<ChartProps, "config"> {
  config: BaseChartConfig & {
    /** Show bar value labels on top of bars */
    showLabels?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
  };
  /** Series key for multi-series charts */
  seriesKeys?: string[];
}

interface TooltipData {
  x: number;
  y: number;
  xValue: string;
  values: Array<{ key: string; value: number; color: string }>;
}

// Professional color palette for multi-series
const professionalColors = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#84cc16", // Lime
];

/**
 * Standalone ColumnChart component
 */
export const ColumnChart = memo(
  ({
    data,
    config,
    height = 400,
    width = "100%",
    className = "",
    style = {},
    onDataPointClick,
    renderTooltip,
    showTooltip = true,
    animated = true,
    id = "column-chart",
    ariaLabel,
    description,
  }: ColumnChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [containerWidth, setContainerWidth] = useState(800);

    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const actualWidth = typeof width === "number" ? width : containerWidth;
    const innerWidth = actualWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const {
      xAxis,
      yAxis,
      color = "#6366f1",
      showLabels = false,
      animationDuration = 800,
      title,
    } = config;

    // Determine series keys
    const seriesKeys = useCallback(() => {
      if (config.seriesKeys) {
        return config.seriesKeys;
      }
      // If yAxis is an array, use it as series keys
      if (Array.isArray(yAxis)) {
        return yAxis;
      }
      // Otherwise, single series
      return [yAxis as string];
    }, [config.seriesKeys, yAxis])();

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

      // Extract values for scaling
      const xValues = data.map((d) => String(d[xAxis]));
      const allYValues = data.flatMap((d) =>
        seriesKeys.map((key) => Number(d[key]) || 0)
      );

      // Create scales
      const xScale = scaleBand()
        .domain(xValues)
        .range([0, innerWidth])
        .padding(0.3);

      const yMin = min(allYValues) || 0;
      const yMax = max(allYValues) || 0;
      const yPadding = (yMax - Math.min(0, yMin)) * 0.1;
      const yScale = scaleLinear()
        .domain([Math.min(0, yMin), yMax + yPadding])
        .range([innerHeight, 0])
        .nice();

      // Add subtle grid lines
      g.append("g")
        .attr("class", "grid")
        .call(
          axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickFormat(() => "")
        )
        .attr("stroke", "#e5e7eb")
        .attr("stroke-opacity", 0.7)
        .selectAll("line")
        .attr("stroke-dasharray", "3,3");

      g.select(".grid .domain").remove();

      // Add X axis
      const xAxisEl = g
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(axisBottom(xScale));

      xAxisEl
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("fill", "#6b7280")
        .attr("dx", "-0.5em")
        .attr("dy", "0.5em");

      xAxisEl.select(".domain").attr("stroke", "#d1d5db");
      xAxisEl.selectAll("line").attr("stroke", "#d1d5db");

      // Add Y axis
      const yAxisEl = g
        .append("g")
        .attr("class", "y-axis")
        .call(axisLeft(yScale).ticks(6));

      yAxisEl
        .selectAll("text")
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("fill", "#6b7280");

      yAxisEl.select(".domain").attr("stroke", "#d1d5db");
      yAxisEl.selectAll("line").attr("stroke", "#d1d5db");

      // Calculate bar width for multi-series
      const barWidth = xScale.bandwidth() / seriesKeys.length;

      // Draw bars for each series
      seriesKeys.forEach((key, seriesIndex) => {
        const seriesColor =
          seriesKeys.length > 1
            ? professionalColors[seriesIndex % professionalColors.length]
            : color;

        // Add bars
        g.selectAll(`.bar-${seriesIndex}`)
          .data(data)
          .enter()
          .append("rect")
          .attr("class", `bar-${seriesIndex}`)
          .attr("x", (d) => {
            const xPos = xScale(String(d[xAxis])) || 0;
            return xPos + seriesIndex * barWidth;
          })
          .attr("y", innerHeight)
          .attr("width", barWidth - (seriesKeys.length > 1 ? 2 : 0))
          .attr("height", 0)
          .attr("fill", seriesColor)
          .attr("rx", 4)
          .attr("ry", 4)
          .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.1))")
          .style("cursor", onDataPointClick ? "pointer" : "default")
          .attr("opacity", 0)
          .on("click", (_event, d) => {
            if (onDataPointClick) {
              onDataPointClick(d, data.indexOf(d));
            }
          })
          .on("mouseenter", function (_event, d) {
            select(this).transition().duration(150).attr("opacity", 0.85);

            if (showTooltip && containerRef.current) {
              const value = Number(d[key]) || 0;
              const yPos = yScale(value);
              const xPos =
                (xScale(String(d[xAxis])) || 0) +
                seriesIndex * barWidth +
                barWidth / 2;

              setTooltip({
                x: xPos + margin.left,
                y: yPos + margin.top - 10,
                xValue: String(d[xAxis]),
                values: [{ key, value, color: seriesColor }],
              });
            }
          })
          .on("mousemove", function (_event, d) {
            if (showTooltip) {
              const value = Number(d[key]) || 0;
              const yPos = yScale(value);
              const xPos =
                (xScale(String(d[xAxis])) || 0) +
                seriesIndex * barWidth +
                barWidth / 2;

              setTooltip({
                x: xPos + margin.left,
                y: yPos + margin.top - 10,
                xValue: String(d[xAxis]),
                values: [{ key, value, color: seriesColor }],
              });
            }
          })
          .on("mouseleave", function () {
            select(this).transition().duration(150).attr("opacity", 1);
            setTooltip(null);
          })
          .transition()
          .delay((animated ? (_: unknown, i: number) => i * 50 : 0) as any)
          .duration(animated ? animationDuration : 0)
          .ease(easeCubicOut)
          .attr("y", (d) => yScale(Number(d[key]) || 0))
          .attr("height", (d) => innerHeight - yScale(Number(d[key]) || 0))
          .attr("opacity", 1);

        // Add value labels on top of bars if requested
        if (showLabels) {
          g.selectAll(`.label-${seriesIndex}`)
            .data(data)
            .enter()
            .append("text")
            .attr("class", `label-${seriesIndex}`)
            .attr("x", (d) => {
              const xPos = xScale(String(d[xAxis])) || 0;
              return (
                xPos +
                seriesIndex * barWidth +
                barWidth / 2 -
                (seriesKeys.length > 1 ? 1 : 0)
              );
            })
            .attr("y", (d) => yScale(Number(d[key]) || 0))
            .attr("text-anchor", "middle")
            .style("font-size", "11px")
            .style("font-weight", "600")
            .style("fill", "#374151")
            .style("opacity", 0)
            .text((d) => (Number(d[key]) || 0).toLocaleString())
            .transition()
            .delay(
              (animated
                ? (_: unknown, i: number) => animationDuration + i * 50
                : 0) as any
            )
            .duration(animated ? 400 : 0)
            .ease(easeCubicOut)
            .style("opacity", 1);
        }
      });

      // Add legend for multi-series
      if (seriesKeys.length > 1) {
        const legend = g
          .append("g")
          .attr("class", "legend")
          .attr("transform", `translate(${innerWidth - 140}, 0)`);

        const legendBg = legend
          .append("rect")
          .attr("x", -12)
          .attr("y", -8)
          .attr("rx", 8)
          .attr("fill", "white")
          .attr("stroke", "#e5e7eb")
          .attr("stroke-width", 1)
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.05))");

        let legendHeight = 16;
        seriesKeys.forEach((key, i) => {
          const legendRow = legend
            .append("g")
            .attr("transform", `translate(0, ${i * 24})`);

          legendRow
            .append("rect")
            .attr("x", 0)
            .attr("y", -6)
            .attr("width", 16)
            .attr("height", 12)
            .attr("rx", 2)
            .attr("fill", professionalColors[i % professionalColors.length]);

          legendRow
            .append("text")
            .attr("x", 24)
            .attr("y", 4)
            .style("font-size", "12px")
            .style("font-weight", "500")
            .style("fill", "#374151")
            .text(key);

          legendHeight = (i + 1) * 24 + 16;
        });

        legendBg.attr("width", 152).attr("height", legendHeight);
      }

      // Add title
      if (title) {
        g.append("text")
          .attr("x", innerWidth / 2)
          .attr("y", -5)
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-weight", "600")
          .style("fill", "#1f2937")
          .text(title);
      }
    }, [
      data,
      xAxis,
      seriesKeys,
      actualWidth,
      height,
      margin,
      color,
      showLabels,
      animated,
      animationDuration,
      innerWidth,
      innerHeight,
      onDataPointClick,
      showTooltip,
    ]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ width, position: "relative", ...style }}
        role="img"
        aria-label={ariaLabel || title || "Column chart"}
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
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              padding: "8px 12px",
              borderRadius: "8px",
              pointerEvents: "none",
              zIndex: 100,
              minWidth: "120px",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {renderTooltip ? (
              renderTooltip({ [xAxis]: tooltip.xValue })
            ) : (
              <>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#1f2937",
                    marginBottom: "4px",
                    fontSize: "13px",
                  }}
                >
                  {tooltip.xValue}
                </div>
                {tooltip.values.map(({ key, value, color }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "2px",
                        backgroundColor: color,
                      }}
                    />
                    <span style={{ color: "#4b5563", fontSize: "12px" }}>
                      {key}:{" "}
                      <span style={{ fontWeight: 700, color: "#1f2937" }}>
                        {value.toLocaleString()}
                      </span>
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

ColumnChart.displayName = "ColumnChart";

export default ColumnChart;
