/**
 * Standalone Line Chart Component
 *
 * A D3-based line chart component that works in any React application.
 * Decoupled from Next.js and framework-agnostic.
 *
 * @example
 * ```tsx
 * import { LineChart } from '@acailic/vizualni-admin/charts';
 *
 * function MyChart() {
 *   const data = [
 *     { year: '2020', value: 100 },
 *     { year: '2021', value: 120 },
 *     { year: '2022', value: 115 },
 *   ];
 *
 *   return (
 *     <LineChart
 *       data={data}
 *       config={{ xAxis: 'year', yAxis: 'value', color: '#6366f1' }}
 *       height={400}
 *     />
 *   );
 * }
 * ```
 */

import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { easeCubicOut } from "d3-ease";
import { scaleLinear, scalePoint } from "d3-scale";
import { pointer, select } from "d3-selection";
import "d3-transition";
import { area, curveMonotoneX, line } from "d3-shape";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import type { ChartProps, BaseChartConfig } from "./types";

export interface LineChartProps extends Omit<ChartProps, "config"> {
  config: BaseChartConfig & {
    /** Show area fill under the line */
    showArea?: boolean;
    /** Show zero reference line */
    showZeroLine?: boolean;
    /** Show crosshair on hover */
    showCrosshair?: boolean;
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
 * Standalone LineChart component
 */
export const LineChart = memo(
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
    id = "line-chart",
    ariaLabel,
    description,
  }: LineChartProps) => {
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
      showArea = true,
      showZeroLine = false,
      showCrosshair = true,
      animationDuration = 1200,
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
      const xScale = scalePoint()
        .domain(xValues)
        .range([0, innerWidth])
        .padding(0.5);

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
        .style("fill", "#6b7280");

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

      // Add zero line if requested
      if (showZeroLine && yMin < 0) {
        g.append("line")
          .attr("x1", 0)
          .attr("x2", innerWidth)
          .attr("y1", yScale(0))
          .attr("y2", yScale(0))
          .attr("stroke", "#9ca3af")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "6,4")
          .attr("opacity", 0.8);
      }

      // Draw area and lines for each series
      seriesKeys.forEach((key, index) => {
        const seriesColor =
          seriesKeys.length > 1
            ? professionalColors[index % professionalColors.length]
            : color;
        const gradientId = `area-gradient-${index}`;

        // Create gradient for area fill
        if (showArea) {
          const gradient = defs
            .append("linearGradient")
            .attr("id", gradientId)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", yScale(yMax))
            .attr("x2", 0)
            .attr("y2", yScale(0));

          gradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", seriesColor)
            .attr("stop-opacity", 0.3);

          gradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", seriesColor)
            .attr("stop-opacity", 0.02);

          // Create area generator
          const areaGenerator = area<any>()
            .x((d) => xScale(String(d[xAxis])) || 0)
            .y0(innerHeight)
            .y1((d) => yScale(Number(d[key]) || 0))
            .curve(curveMonotoneX);

          // Add area path with animation
          g.append("path")
            .datum(data)
            .attr("class", `area-${index}`)
            .attr("fill", `url(#${gradientId})`)
            .attr("d", areaGenerator)
            .style("opacity", 0)
            .transition()
            .duration(animated ? animationDuration : 0)
            .ease(easeCubicOut)
            .style("opacity", 1);
        }

        // Create line generator
        const lineGenerator = line<any>()
          .x((d) => xScale(String(d[xAxis])) || 0)
          .y((d) => yScale(Number(d[key]) || 0))
          .curve(curveMonotoneX);

        // Add the line path with animation
        const path = g
          .append("path")
          .datum(data)
          .attr("class", `line-${index}`)
          .attr("fill", "none")
          .attr("stroke", seriesColor)
          .attr("stroke-width", 3)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .attr("d", lineGenerator);

        if (animated) {
          const totalLength = path.node()?.getTotalLength() || 0;
          path
            .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(animationDuration)
            .ease(easeCubicOut)
            .attr("stroke-dashoffset", 0);
        }

        // Add dots with staggered animation
        g.selectAll(`.dot-${index}`)
          .data(data)
          .enter()
          .append("circle")
          .attr("class", `dot-${index}`)
          .attr("cx", (d) => xScale(String(d[xAxis])) || 0)
          .attr("cy", (d) => yScale(Number(d[key]) || 0))
          .attr("r", 0)
          .attr("fill", seriesColor)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.1))")
          .style("cursor", onDataPointClick ? "pointer" : "default")
          .on("click", (event, d) => {
            if (onDataPointClick) {
              onDataPointClick(d, data.indexOf(d));
            }
          })
          .transition()
          .delay(animated ? (_, i) => animationDuration * 0.7 + i * 30 : 0)
          .duration(animated ? 400 : 0)
          .ease(easeCubicOut)
          .attr("r", 5);
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
            .attr("y1", 0)
            .attr("y2", innerHeight)
            .attr("stroke", "#6366f1")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4,4")
            .attr("opacity", 0.6);
        }

        // Create hover circles for each series
        seriesKeys.forEach((_, index) => {
          const seriesColor =
            seriesKeys.length > 1
              ? professionalColors[index % professionalColors.length]
              : color;
          crosshair
            .append("circle")
            .attr("class", `hover-dot-${index}`)
            .attr("r", 7)
            .attr("fill", seriesColor)
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");
        });

        // Add invisible overlay for mouse tracking
        g.append("rect")
          .attr("class", "overlay")
          .attr("width", innerWidth)
          .attr("height", innerHeight)
          .attr("fill", "transparent")
          .style("cursor", "crosshair")
          .on("mousemove", function (event) {
            const [mouseX] = pointer(event, this);

            // Find closest data point
            let closestIndex = 0;
            let minDistance = Infinity;

            xValues.forEach((val, i) => {
              const distance = Math.abs((xScale(val) || 0) - mouseX);
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
              }
            });

            const d = data[closestIndex];
            const xPosSnapped = xScale(String(d[xAxis])) || 0;

            // Update crosshair position
            crosshair.style("display", null);
            crosshair
              .select(".crosshair-line")
              .attr("x1", xPosSnapped)
              .attr("x2", xPosSnapped);

            // Update hover dots and collect tooltip data
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
              crosshair
                .select(`.hover-dot-${index}`)
                .attr("cx", xPosSnapped)
                .attr("cy", yScale(value));
              tooltipValues.push({ key, value, color: seriesColor });
            });

            // Update tooltip state
            if (showTooltip && containerRef.current) {
              setTooltip({
                x: xPosSnapped + margin.left + 15,
                y: Math.min(
                  yScale(Number(d[seriesKeys[0]]) || 0) + margin.top,
                  innerHeight / 2 + margin.top
                ),
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
            .append("line")
            .attr("x1", 0)
            .attr("x2", 24)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", professionalColors[i % professionalColors.length])
            .attr("stroke-width", 3)
            .attr("stroke-linecap", "round");

          legendRow
            .append("circle")
            .attr("cx", 12)
            .attr("cy", 0)
            .attr("r", 4)
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
        aria-label={ariaLabel || title || "Line chart"}
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
                        borderRadius: "50%",
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

LineChart.displayName = "LineChart";

export default LineChart;
