/**
 * Example Radar Chart Plugin
 *
 * This file demonstrates how to create a custom chart plugin using the
 * plugin system. The RadarChart is not included in the core bundle and
 * serves as a reference for contributors.
 *
 * @example
 * ```tsx
 * import { registerChartPlugin } from '@acailic/vizualni-admin/charts';
 * import { radarChartPlugin } from './RadarChartPlugin';
 *
 * // Register the plugin
 * registerChartPlugin(radarChartPlugin);
 *
 * // Use the registered plugin
 * const plugin = getChartPlugin('example-radar-chart');
 * const RadarChart = plugin.component;
 *
 * <RadarChart data={data} config={config} />
 * ```
 *
 * @packageDocumentation
 */

import { max } from "d3-array";
import { easeCubicOut } from "d3-ease";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import "d3-transition";
import { memo, useEffect, useRef, useState } from "react";

import { createLogger } from "../../../lib/logger";

import type {
  ChartPluginMetadata,
  ChartPluginHooks,
  ChartValidationResult,
  IChartPlugin,
} from "../plugin-types";
import type { BaseChartConfig, ChartData, ChartProps } from "../types";

/**
 * Radar Chart specific configuration
 */
export interface RadarChartConfig extends BaseChartConfig {
  /** Number of axis levels (concentric polygons) */
  levels?: number;

  /** Show axis labels */
  showAxisLabels?: boolean;

  /** Show grid lines */
  showGrid?: boolean;

  /** Fill opacity */
  fillOpacity?: number;

  /** Point radius */
  pointRadius?: number;

  /** Animation duration in ms */
  animationDuration?: number;
}

/**
 * Radar Chart Props
 */
export interface RadarChartProps extends Omit<ChartProps, "config"> {
  config: RadarChartConfig;
}

/**
 * Tooltip data interface
 */
interface TooltipData {
  x: number;
  y: number;
  value: number;
  label: string;
}

/**
 * Standalone RadarChart component
 */
export const RadarChart = memo(
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
    id = "radar-chart",
    ariaLabel,
    description,
  }: RadarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [containerWidth, setContainerWidth] = useState(800);

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const actualWidth = typeof width === "number" ? width : containerWidth;
    const size = Math.min(
      actualWidth - margin.left - margin.right,
      height - margin.top - margin.bottom
    );
    const radius = size / 2;

    const {
      xAxis,
      yAxis,
      color = "#6366f1",
      levels = 5,
      showAxisLabels = true,
      showGrid = true,
      fillOpacity = 0.3,
      pointRadius = 4,
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
      const g = svg
        .append("g")
        .attr(
          "transform",
          `translate(${margin.left + radius + 40}, ${margin.top + radius})`
        );

      // Extract axis labels and values
      const labels = data.map((d) => String(d[xAxis]));
      const values = data.map((d) => Number(d[yAxis as string]) || 0);

      // Calculate scales
      const maxValue = max(values) || 1;
      const angleSlice = (Math.PI * 2) / labels.length;

      // Create scale for radius
      const rScale = scaleLinear().domain([0, maxValue]).range([0, radius]);

      // Draw grid levels (concentric polygons)
      if (showGrid) {
        for (let i = 0; i < levels; i++) {
          const levelFactor = radius * ((i + 1) / levels);

          const levelPoints: [number, number][] = [];
          for (let j = 0; j < labels.length; j++) {
            const angle = j * angleSlice - Math.PI / 2;
            levelPoints.push([
              levelFactor * Math.cos(angle),
              levelFactor * Math.sin(angle),
            ]);
          }

          const lineGenerator = (points: [number, number][]) => {
            return points
              .map(
                (p, i) =>
                  `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`
              )
              .join(" ");
          };

          g.append("path")
            .attr("d", lineGenerator(levelPoints))
            .attr("stroke", "#e5e7eb")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .style("opacity", 0.5);
        }
      }

      // Draw axes
      for (let i = 0; i < labels.length; i++) {
        const angle = i * angleSlice - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        g.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", x)
          .attr("y2", y)
          .attr("stroke", "#d1d5db")
          .attr("stroke-width", 1)
          .style("opacity", 0.7);

        // Add axis labels
        if (showAxisLabels) {
          const labelRadius = radius + 20;
          const labelX = labelRadius * Math.cos(angle);
          const labelY = labelRadius * Math.sin(angle);

          g.append("text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "11px")
            .style("font-weight", "500")
            .style("fill", "#374151")
            .text(labels[i]);
        }
      }

      // Draw data area
      const dataPoints = values.map((value, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const r = rScale(value);
        return [r * Math.cos(angle), r * Math.sin(angle)];
      });

      const areaPath =
        dataPoints
          .map(
            (p, i) =>
              `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`
          )
          .join(" ") + " Z";

      g.append("path")
        .attr("d", areaPath)
        .attr("fill", color)
        .attr("fill-opacity", 0)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .on("click", function (_event, _d) {
          if (onDataPointClick) {
            onDataPointClick(data[0], 0);
          }
        })
        .transition()
        .delay(animated ? 100 : 0)
        .duration(animated ? animationDuration : 0)
        .ease(easeCubicOut)
        .attr("fill-opacity", fillOpacity);

      // Draw data points
      const points = g
        .selectAll(".data-point")
        .data(dataPoints)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("r", 0)
        .attr("fill", color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", onDataPointClick ? "pointer" : "default")
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

      points
        .transition()
        .delay(animated ? 200 : 0)
        .duration(animated ? animationDuration : 0)
        .ease(easeCubicOut)
        .attr("r", pointRadius);

      // Add hover interaction
      if (showTooltip) {
        points
          .on("mouseover", function (_event, _d) {
            select(this)
              .transition()
              .duration(150)
              .attr("r", pointRadius * 1.5)
              .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.2))");
          })
          .on("mouseout", function (_event, _d) {
            select(this)
              .transition()
              .duration(150)
              .attr("r", pointRadius)
              .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");
            setTooltip(null);
          })
          .on("mousemove", function (event, d) {
            const index = dataPoints.indexOf(d);
            const label = labels[index];
            const value = values[index];

            // Calculate tooltip position
            const [cx, cy] = containerRef.current
              ? [
                  containerRef.current.getBoundingClientRect().left,
                  containerRef.current.getBoundingClientRect().top,
                ]
              : [0, 0];

            setTooltip({
              x: event.clientX - cx,
              y: event.clientY - cy,
              value,
              label,
            });
          });
      }

      // Add title
      if (title) {
        g.append("text")
          .attr("x", 0)
          .attr("y", -radius - 20)
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-weight", "600")
          .style("fill", "#1f2937")
          .text(title);
      }
    }, [
      data,
      xAxis,
      yAxis,
      radius,
      levels,
      showGrid,
      showAxisLabels,
      fillOpacity,
      pointRadius,
      animated,
      animationDuration,
      color,
      size,
      onDataPointClick,
      showTooltip,
    ]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ width, position: "relative", ...style }}
        role="img"
        aria-label={ariaLabel || title || "Radar chart"}
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
              minWidth: "100px",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {renderTooltip ? (
              renderTooltip({
                [xAxis]: tooltip.label,
                [yAxis as string]: tooltip.value,
              })
            ) : (
              <>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#6b7280",
                    marginBottom: "2px",
                    fontSize: "11px",
                  }}
                >
                  {tooltip.label}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#1f2937",
                    fontSize: "14px",
                  }}
                >
                  {tooltip.value.toLocaleString()}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

RadarChart.displayName = "RadarChart";

/**
 * Plugin validation hook
 */
const validateData = (
  data: ChartData[],
  config: RadarChartConfig
): ChartValidationResult => {
  const errors: Array<{ path: string; message: string }> = [];
  const warnings: Array<{ path: string; message: string }> = [];

  // Check minimum data points
  if (data.length < 3) {
    warnings.push({
      path: "data",
      message: "Radar charts work best with at least 3 data points",
    });
  }

  // Check for negative values
  const hasNegative = data.some((d) => Number(d[config.yAxis as string]) < 0);
  if (hasNegative) {
    errors.push({
      path: "data",
      message: "Radar charts do not support negative values",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Plugin metadata
 */
const metadata: ChartPluginMetadata = {
  id: "example-radar-chart",
  name: "Radar Chart",
  version: "1.0.0",
  author: "vizualni-admin",
  description:
    "A radar chart (spider chart) for displaying multivariate data. Ideal for comparing multiple quantitative variables.",
  category: "statistical",
  tags: ["radar", "spider", "multivariate", "statistical", "polar"],
  homepage: "https://github.com/acailic/vizualni-admin",
  repository: "https://github.com/acailic/vizualni-admin",
  license: "BSD-3-Clause",
  minCoreVersion: "0.1.0-beta.1",
  externalDependencies: [],
};

// Create a logger for this plugin
const logger = createLogger({ component: "RadarChartPlugin" });

/**
 * Plugin hooks
 */
const hooks: ChartPluginHooks = {
  validateData,
  onRegister: () => {
    logger.debug("Radar Chart plugin registered");
  },
  onUnregister: () => {
    logger.debug("Radar Chart plugin unregistered");
  },
};

/**
 * Example data for documentation
 */
const exampleData: ChartData[] = [
  { metric: "Speed", value: 85 },
  { metric: "Power", value: 70 },
  { metric: "Technique", value: 90 },
  { metric: "Stamina", value: 75 },
  { metric: "Defense", value: 65 },
  { metric: "Creativity", value: 80 },
];

/**
 * Example configuration
 */
const exampleConfig: RadarChartConfig = {
  xAxis: "metric",
  yAxis: "value",
  color: "#6366f1",
  levels: 5,
  showAxisLabels: true,
  showGrid: true,
  fillOpacity: 0.3,
  pointRadius: 4,
  title: "Player Attributes",
};

/**
 * Radar Chart Plugin Definition
 *
 * This is the complete plugin definition that can be registered
 * with the chart registry.
 */
export const radarChartPlugin: IChartPlugin<RadarChartConfig> = {
  ...metadata,
  component: RadarChart,
  defaultConfig: {
    levels: 5,
    showAxisLabels: true,
    showGrid: true,
    fillOpacity: 0.3,
    pointRadius: 4,
    animationDuration: 1200,
  },
  hooks,
  exampleData,
  exampleConfig,
};

/**
 * Export for direct usage (without registration)
 */
export default RadarChart;
