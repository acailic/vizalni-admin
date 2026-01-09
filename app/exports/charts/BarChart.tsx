/**
 * Standalone Bar Chart Component
 *
 * A D3-based bar chart component that works in any React application.
 * Decoupled from Next.js and framework-agnostic.
 *
 * @example
 * ```tsx
 * import { BarChart } from '@acailic/vizualni-admin/charts';
 *
 * function MyChart() {
 *   const data = [
 *     { category: 'Product A', value: 100 },
 *     { category: 'Product B', value: 120 },
 *     { category: 'Product C', value: 115 },
 *   ];
 *
 *   return (
 *     <BarChart
 *       data={data}
 *       config={{ xAxis: 'category', yAxis: 'value', color: '#6366f1' }}
 *       height={400}
 *     />
 *   );
 * }
 * ```
 */

import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { easeCubicOut } from "d3-ease";
import { scaleLinear, scaleBand } from "d3-scale";
import { pointer, select } from "d3-selection";
import "d3-transition";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import type { ChartProps, BaseChartConfig } from "./types";

export interface BarChartProps extends Omit<ChartProps, "config"> {
  config: BaseChartConfig & {
    /** Show area fill for bars (gradient effect) */
    showArea?: boolean;
    /** Show zero reference line */
    showZeroLine?: boolean;
    /** Show crosshair on hover */
    showCrosshair?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Bar corner radius */
    barRadius?: number;
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
 * Standalone BarChart component
 */
export const BarChart = memo(
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
    id = "bar-chart",
    ariaLabel,
    description,
  }: BarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [containerWidth, setContainerWidth] = useState(800);

    const margin = { top: 20, right: 30, bottom: 60, left: 120 };
    const actualWidth = typeof width === "number" ? width : containerWidth;
    const innerWidth = actualWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const {
      xAxis,
      yAxis,
      color = "#6366f1",
      showArea = true,
      showZeroLine = false,
      showCrosshair = true,
      animationDuration = 1200,
      barRadius = 6,
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

      // Create defs for gradients
      const defs = svg.append("defs");

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
      const yScale = scaleBand()
        .domain(xValues)
        .range([0, innerHeight])
        .padding(0.3);

      const yMin = min(allYValues) || 0;
      const yMax = max(allYValues) || 0;
      const xPadding = (yMax - Math.min(0, yMin)) * 0.1;
      const xScale = scaleLinear()
        .domain([Math.min(0, yMin), yMax + xPadding])
        .range([0, innerWidth])
        .nice();

      // Add subtle vertical grid lines
      g.append("g")
        .attr("class", "grid")
        .call(
          axisBottom(xScale)
            .tickSize(-innerHeight)
            .tickFormat(() => "")
        )
        .attr("stroke", "#e5e7eb")
        .attr("stroke-opacity", 0.7)
        .selectAll("line")
        .attr("stroke-dasharray", "3,3");

      g.select(".grid .domain").remove();

      // Add X axis (bottom)
      const xAxisEl = g
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(axisBottom(xScale).ticks(6));

      xAxisEl
        .selectAll("text")
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("fill", "#6b7280");

      xAxisEl.select(".domain").attr("stroke", "#d1d5db");
      xAxisEl.selectAll("line").attr("stroke", "#d1d5db");

      // Add Y axis (left - categories)
      const yAxisEl = g
        .append("g")
        .attr("class", "y-axis")
        .call(axisLeft(yScale));

      yAxisEl
        .selectAll("text")
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("fill", "#6b7280")
        .attr("text-anchor", "end");

      yAxisEl.select(".domain").remove();
      yAxisEl.selectAll("line").remove();

      // Add zero line if requested
      if (showZeroLine && yMin < 0) {
        g.append("line")
          .attr("x1", xScale(0))
          .attr("x2", xScale(0))
          .attr("y1", 0)
          .attr("y2", innerHeight)
          .attr("stroke", "#9ca3af")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "6,4")
          .attr("opacity", 0.8);
      }

      // Draw bars for each series
      const barHeight = yScale.bandwidth() / seriesKeys.length;

      seriesKeys.forEach((key, seriesIndex) => {
        const seriesColor =
          seriesKeys.length > 1
            ? professionalColors[seriesIndex % professionalColors.length]
            : color;
        const gradientId = `bar-gradient-${seriesIndex}`;

        // Create gradient for bars
        if (showArea) {
          const gradient = defs
            .append("linearGradient")
            .attr("id", gradientId)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", innerWidth)
            .attr("y2", 0);

          gradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", seriesColor)
            .attr("stop-opacity", 0.9);

          gradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", seriesColor)
            .attr("stop-opacity", 0.6);
        }

        // Add bars with animation
        g.selectAll(`.bar-${seriesIndex}`)
          .data(data)
          .enter()
          .append("rect")
          .attr("class", `bar-${seriesIndex}`)
          .attr("y", (d) => {
            const y = yScale(String(d[xAxis])) || 0;
            return y + seriesIndex * barHeight;
          })
          .attr("x", 0)
          .attr("height", barHeight - 2)
          .attr("width", 0)
          .attr("rx", barRadius)
          .attr("fill", showArea ? `url(#${gradientId})` : seriesColor)
          .style("cursor", onDataPointClick ? "pointer" : "default")
          .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.1))")
          .on("click", (event, d) => {
            if (onDataPointClick) {
              onDataPointClick(d, data.indexOf(d));
            }
          })
          .transition()
          .delay(animated ? (_, i) => i * 50 : 0)
          .duration(animated ? animationDuration : 0)
          .ease(easeCubicOut)
          .attr("x", (d) => Math.min(xScale(0), xScale(Number(d[key]) || 0)))
          .attr("width", (d) =>
            Math.abs(xScale(Number(d[key]) || 0) - xScale(0))
          );
      });

      // Add crosshair and tooltip interaction
      if (showTooltip || showCrosshair) {
        const crosshair = g
          .append("g")
          .attr("class", "crosshair")
          .style("display", "none");

        if (showCrosshair) {
          crosshair
            .append("line")
            .attr("class", "crosshair-line")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("stroke", "#6366f1")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4,4")
            .attr("opacity", 0.6);
        }

        // Create hover rectangles for each series
        seriesKeys.forEach((_, index) => {
          const seriesColor =
            seriesKeys.length > 1
              ? professionalColors[index % professionalColors.length]
              : color;
          crosshair
            .append("rect")
            .attr("class", `hover-rect-${index}`)
            .attr("height", barHeight - 2)
            .attr("rx", barRadius)
            .attr("fill", seriesColor)
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))")
            .attr("opacity", 0.8);
        });

        // Add invisible overlay for mouse tracking
        g.append("rect")
          .attr("class", "overlay")
          .attr("width", innerWidth)
          .attr("height", innerHeight)
          .attr("fill", "transparent")
          .style("cursor", "crosshair")
          .on("mousemove", function (event) {
            const [, mouseY] = pointer(event, this);

            // Find closest data point
            let closestIndex = 0;
            let minDistance = Infinity;

            xValues.forEach((val, i) => {
              const y = yScale(val) || 0;
              const distance = Math.abs(y + yScale.bandwidth() / 2 - mouseY);
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
              }
            });

            const d = data[closestIndex];
            const yPosSnapped =
              (yScale(String(d[xAxis])) || 0) + yScale.bandwidth() / 2;

            // Update crosshair position
            crosshair.style("display", null);
            crosshair
              .select(".crosshair-line")
              .attr("y1", yPosSnapped)
              .attr("y2", yPosSnapped);

            // Update hover rectangles and collect tooltip data
            const tooltipValues: Array<{
              key: string;
              value: number;
              color: string;
            }> = [];
            seriesKeys.forEach((key, index) => {
              const value = Number(d[key]) || 0;
              const seriesColor =
                seriesKeys.length > 1
                  ? professionalColors[index % professionalColors.length]
                  : color;
              const xPos = Math.min(xScale(0), xScale(value));
              const barWidth = Math.abs(xScale(value) - xScale(0));

              crosshair
                .select(`.hover-rect-${index}`)
                .attr("x", xPos)
                .attr("y", (yScale(String(d[xAxis])) || 0) + index * barHeight)
                .attr("width", barWidth);

              tooltipValues.push({ key, value, color: seriesColor });
            });

            // Update tooltip state
            if (showTooltip && containerRef.current) {
              const maxXValue = Math.max(...tooltipValues.map((v) => v.value));
              setTooltip({
                x: Math.min(xScale(maxXValue), innerWidth) + margin.left + 15,
                y: yPosSnapped + margin.top,
                xValue: String(d[xAxis]),
                values: tooltipValues,
              });
            }
          })
          .on("mouseleave", function () {
            crosshair.style("display", "none");
            setTooltip(null);
          });
      }

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
            .attr("width", 24)
            .attr("height", 12)
            .attr("rx", 3)
            .attr("fill", professionalColors[i % professionalColors.length]);

          legendRow
            .append("text")
            .attr("x", 32)
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
      showArea,
      showZeroLine,
      showCrosshair,
      showTooltip,
      animated,
      animationDuration,
      barRadius,
      innerWidth,
      innerHeight,
      onDataPointClick,
    ]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ width, position: "relative", ...style }}
        role="img"
        aria-label={ariaLabel || title || "Bar chart"}
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
              transform: "translateY(-50%)",
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

BarChart.displayName = "BarChart";

export default BarChart;
