/**
 * Standalone Map Chart Component
 *
 * A D3-based map component for geospatial visualization using GeoJSON data.
 * Supports choropleth maps, point data, zoom/pan, and interactive tooltips.
 *
 * @example
 * ```tsx
 * import { MapChart } from '@acailic/vizualni-admin/charts';
 *
 * function MyMap() {
 *   const geoData = {
 *     type: 'FeatureCollection',
 *     features: [
 *       {
 *         type: 'Feature',
 *         properties: { name: 'Beograd', value: 2000000 },
 *         geometry: { ... }
 *       }
 *     ]
 *   };
 *
 *   return (
 *     <MapChart
 *       data={geoData}
 *       config={{ colorScale: ['#e0f2fe', '#0369a1'] }}
 *       height={500}
 *     />
 *   );
 * }
 * ```
 */

import { extent } from "d3-array";
import { easeCubicOut } from "d3-ease";
import { geoMercator, geoEqualEarth, geoPath, GeoProjection } from "d3-geo";
import { scaleSequential, scaleThreshold } from "d3-scale";
import { select, pointer } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity, ZoomTransform } from "d3-zoom";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import type { BaseChartConfig } from "./types";

/**
 * GeoJSON Feature interface
 */
export interface MapFeature {
  type: "Feature";
  properties: {
    name: string;
    value?: number;
    [key: string]: any;
  };
  geometry: GeoJSON.Geometry;
}

/**
 * GeoJSON FeatureCollection interface
 */
export interface MapData {
  type: "FeatureCollection";
  features: MapFeature[];
}

/**
 * Point data for markers
 */
export interface MapPoint {
  id: string;
  name: string;
  value?: number;
  coordinates: [number, number]; // [longitude, latitude]
  [key: string]: any;
}

/**
 * Map chart configuration
 */
export interface MapChartConfig extends BaseChartConfig {
  /** Color scale for choropleth (sequential colors) */
  colorScale?: string[];
  /** Show legend */
  showLegend?: boolean;
  /** Map projection type */
  projection?: "mercator" | "equalEarth";
  /** Enable zoom and pan */
  zoomEnabled?: boolean;
  /** Initial center coordinates [longitude, latitude] */
  center?: [number, number];
  /** Initial scale */
  scale?: number;
  /** Show point markers */
  showPoints?: boolean;
  /** Point data array */
  pointData?: MapPoint[];
  /** Point marker size */
  pointSize?: number;
  /** Point color */
  pointColor?: string;
  /** Border color for regions */
  borderColor?: string;
  /** Border width */
  borderWidth?: number;
  /** Hover effect color */
  hoverColor?: string;
  /** Show region labels */
  showLabels?: boolean;
  /** Label property key */
  labelKey?: string;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Number of color scale buckets (for threshold scale) */
  buckets?: number;
}

export interface MapChartProps {
  /** GeoJSON data or array of features */
  data: MapData | MapFeature[];
  /** Chart configuration */
  config: MapChartConfig;
  /** Chart height in pixels */
  height?: number;
  /** Chart width (responsive by default) */
  width?: number | "100%";
  /** Locale for formatting */
  locale?: "sr-Latn" | "sr-Cyrl" | "en";
  /** CSS class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Callback when data point is clicked */
  onDataPointClick?: (data: any, index: number) => void;
  /** Custom tooltip renderer */
  renderTooltip?: (data: any) => React.ReactNode;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Unique identifier for the chart */
  id?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Description for screen readers */
  description?: string;
}

interface TooltipData {
  x: number;
  y: number;
  feature: MapFeature | MapPoint;
  position: { x: number; y: number };
}

// Professional color palettes
const colorPalettes = {
  blue: [
    "#f0f9ff",
    "#e0f2fe",
    "#bae6fd",
    "#7dd3fc",
    "#38bdf8",
    "#0ea5e9",
    "#0284c7",
    "#0369a1",
    "#075985",
    "#0c4a6e",
  ],
  green: [
    "#f0fdf4",
    "#dcfce7",
    "#bbf7d0",
    "#86efac",
    "#4ade80",
    "#22c55e",
    "#16a34a",
    "#15803d",
    "#166534",
    "#14532d",
  ],
  purple: [
    "#faf5ff",
    "#f3e8ff",
    "#e9d5ff",
    "#d8b4fe",
    "#c084fc",
    "#a855f7",
    "#9333ea",
    "#7e22ce",
    "#6b21a8",
    "#581c87",
  ],
  orange: [
    "#fff7ed",
    "#ffedd5",
    "#fed7aa",
    "#fdba74",
    "#fb923c",
    "#f97316",
    "#ea580c",
    "#c2410c",
    "#9a3412",
    "#7c2d12",
  ],
  red: [
    "#fef2f2",
    "#fee2e2",
    "#fecaca",
    "#fca5a5",
    "#f87171",
    "#ef4444",
    "#dc2626",
    "#b91c1c",
    "#991b1b",
    "#7f1d1d",
  ],
};

/**
 * Standalone MapChart component
 */
export const MapChart = memo(
  ({
    data,
    config,
    height = 500,
    width = "100%",
    locale = "sr-Latn",
    className = "",
    style = {},
    onDataPointClick,
    renderTooltip,
    showTooltip = true,
    animated = true,
    id = "map-chart",
    ariaLabel,
    description,
  }: MapChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [containerWidth, setContainerWidth] = useState(800);
    const transformRef = useRef<ZoomTransform>(zoomIdentity);

    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    const actualWidth = typeof width === "number" ? width : containerWidth;
    const innerWidth = actualWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const {
      colorScale = colorPalettes.blue,
      showLegend = true,
      projection: projectionType = "mercator",
      zoomEnabled = true,
      center,
      scale,
      showPoints = false,
      pointData = [],
      pointSize = 6,
      pointColor = "#ef4444",
      borderColor = "#ffffff",
      borderWidth = 1.5,
      hoverColor = "rgba(99, 102, 241, 0.3)",
      showLabels = false,
      labelKey = "name",
      animationDuration = 1000,
      buckets = 5,
      title,
    } = config;

    // Normalize data to FeatureCollection
    const mapData = useCallback((): MapData => {
      if (Array.isArray(data)) {
        return { type: "FeatureCollection", features: data };
      }
      return data;
    }, [data]);

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
      if (
        !svgRef.current ||
        !mapData().features ||
        mapData().features.length === 0
      )
        return;

      // Clear previous chart
      select(svgRef.current).selectAll("*").remove();

      const svg = select(svgRef.current);

      // Create main group for the map
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create projection
      let projection: GeoProjection;
      if (projectionType === "equalEarth") {
        projection = geoEqualEarth();
      } else {
        projection = geoMercator();
      }

      // Set center and scale if provided
      if (center) {
        projection.center(center);
      }
      if (scale) {
        projection.scale(scale);
      }

      // Fit projection to the data
      projection.fitSize([innerWidth, innerHeight], mapData());

      const pathGenerator = geoPath().projection(projection);

      // Extract values for color scaling
      const values = mapData()
        .features.map((f) => f.properties.value)
        .filter((v): v is number => v !== undefined);

      const valueExtent = extent(values);
      const minValue = valueExtent[0] ?? 0;
      const maxValue = valueExtent[1] ?? 100;

      // Create color scale
      let colorScaleFn: (value: number) => string;

      if (buckets > 1 && minValue !== maxValue) {
        // Use threshold scale for discrete buckets
        const bucketSize = (maxValue - minValue) / buckets;
        const thresholds = Array.from(
          { length: buckets - 1 },
          (_, i) => minValue + bucketSize * (i + 1)
        );
        colorScaleFn = scaleThreshold<number, string>()
          .domain(thresholds)
          .range(colorScale.slice(0, buckets) as unknown as string[]);
      } else {
        // Use sequential scale for continuous data
        colorScaleFn = scaleSequential<string>((t) => {
          const paletteIndex = Math.floor(t * (colorScale.length - 1));
          return colorScale[
            Math.max(0, Math.min(paletteIndex, colorScale.length - 1))
          ];
        }).domain([minValue, maxValue]);
      }

      // Add background
      g.append("rect")
        .attr("class", "background")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("fill", "#f8fafc")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 1)
        .attr("rx", 4);

      // Create groups for layers
      const regionsGroup = g.append("g").attr("class", "regions");
      const bordersGroup = g.append("g").attr("class", "borders");
      const pointsGroup = g.append("g").attr("class", "points");
      const labelsGroup = g.append("g").attr("class", "labels");

      // Draw regions
      const regions = regionsGroup
        .selectAll("path")
        .data(mapData().features)
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("fill", (d) => {
          const value = d.properties.value;
          return value !== undefined ? colorScaleFn(value) : "#e2e8f0";
        })
        .attr("stroke", borderColor)
        .attr("stroke-width", borderWidth)
        .attr("stroke-linejoin", "round")
        .style("cursor", onDataPointClick ? "pointer" : "default")
        .style("opacity", 0);

      // Animate regions
      regions
        .transition()
        .duration(animated ? animationDuration : 0)
        .ease(easeCubicOut)
        .style("opacity", 1);

      // Add hover effects
      regions
        .on("mouseenter", function (event, d) {
          select(this)
            .transition()
            .duration(200)
            .attr("stroke", "#6366f1")
            .attr("stroke-width", borderWidth + 1);

          if (showTooltip) {
            const [x, y] = pointer(event);
            const centroid = pathGenerator.centroid(d);

            setTooltip({
              x: centroid[0] + margin.left + 15,
              y: centroid[1] + margin.top,
              feature: d,
              position: { x: centroid[0], y: centroid[1] },
            });
          }
        })
        .on("mousemove", function (event, d) {
          if (showTooltip) {
            const [x, y] = pointer(event);
            const centroid = pathGenerator.centroid(d);

            setTooltip(
              (prev) =>
                ({
                  ...prev,
                  x: x + margin.left + 15,
                  y: y + margin.top,
                  feature: d,
                  position: { x: centroid[0], y: centroid[1] },
                } as TooltipData)
            );
          }
        })
        .on("mouseleave", function () {
          select(this)
            .transition()
            .duration(200)
            .attr("stroke", borderColor)
            .attr("stroke-width", borderWidth);

          setTooltip(null);
        })
        .on("click", (event, d) => {
          if (onDataPointClick) {
            onDataPointClick(d.properties, mapData().features.indexOf(d));
          }
        });

      // Draw point markers
      if (showPoints && pointData.length > 0) {
        const points = pointsGroup
          .selectAll("circle")
          .data(pointData)
          .enter()
          .append("circle")
          .attr("cx", (d) => projection(d.coordinates)![0])
          .attr("cy", (d) => projection(d.coordinates)![1])
          .attr("r", 0)
          .attr("fill", pointColor)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .style("cursor", onDataPointClick ? "pointer" : "default")
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.3))");

        // Animate points
        points
          .transition()
          .delay(animated ? animationDuration * 0.5 : 0)
          .duration(animated ? 600 : 0)
          .ease(easeCubicOut)
          .attr("r", pointSize);

        // Point hover effects
        points
          .on("mouseenter", function (event, d) {
            select(this)
              .transition()
              .duration(200)
              .attr("r", pointSize * 1.5);

            if (showTooltip) {
              const pos = projection(d.coordinates)!;

              setTooltip({
                x: pos[0] + margin.left + 15,
                y: pos[1] + margin.top,
                feature: d as any,
                position: { x: pos[0], y: pos[1] },
              });
            }
          })
          .on("mouseleave", function () {
            select(this).transition().duration(200).attr("r", pointSize);

            setTooltip(null);
          })
          .on("click", (event, d) => {
            if (onDataPointClick) {
              onDataPointClick(d, pointData.indexOf(d));
            }
          });
      }

      // Draw labels
      if (showLabels) {
        labelsGroup
          .selectAll("text")
          .data(mapData().features)
          .enter()
          .append("text")
          .attr("x", (d) => pathGenerator.centroid(d)[0])
          .attr("y", (d) => pathGenerator.centroid(d)[1])
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .style("font-size", "10px")
          .style("font-weight", "500")
          .style("fill", "#374151")
          .style("pointer-events", "none")
          .style("opacity", 0)
          .text((d) => d.properties[labelKey] || "")
          .transition()
          .delay(animated ? animationDuration * 0.7 : 0)
          .duration(animated ? 400 : 0)
          .ease(easeCubicOut)
          .style("opacity", 1);
      }

      // Add zoom behavior
      if (zoomEnabled) {
        const zoomBehavior = zoom<SVGSVGElement, unknown>()
          .scaleExtent([1, 8])
          .on("zoom", (event) => {
            transformRef.current = event.transform;
            g.attr("transform", event.transform);
          });

        svg.call(zoomBehavior as any);
      }

      // Add legend
      if (showLegend && values.length > 0) {
        const legendGroup = g
          .append("g")
          .attr("class", "legend")
          .attr("transform", `translate(20, 20)`);

        // Legend background
        const legendBg = legendGroup
          .append("rect")
          .attr("x", -12)
          .attr("y", -12)
          .attr("rx", 8)
          .attr("fill", "white")
          .attr("stroke", "#e5e7eb")
          .attr("stroke-width", 1)
          .style("filter", "drop-shadow(0 2px 8px rgba(0,0,0,0.1))")
          .style("opacity", 0);

        // Legend title
        legendGroup
          .append("text")
          .attr("x", 0)
          .attr("y", -4)
          .style("font-size", "11px")
          .style("font-weight", "600")
          .style("fill", "#374151")
          .text("Vrednost");

        // Legend gradient bar
        const gradientWidth = 160;
        const gradientHeight = 12;

        const gradient = legendGroup
          .append("defs")
          .append("linearGradient")
          .attr("id", "legend-gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");

        colorScale.forEach((color, i) => {
          gradient
            .append("stop")
            .attr("offset", `${(i / (colorScale.length - 1)) * 100}%`)
            .attr("stop-color", color);
        });

        legendGroup
          .append("rect")
          .attr("x", 0)
          .attr("y", 8)
          .attr("width", gradientWidth)
          .attr("height", gradientHeight)
          .attr("fill", "url(#legend-gradient)")
          .attr("rx", 2);

        // Legend labels
        legendGroup
          .append("text")
          .attr("x", 0)
          .attr("y", gradientHeight + 22)
          .style("font-size", "10px")
          .style("font-weight", "500")
          .style("fill", "#6b7280")
          .text(minValue.toLocaleString(locale));

        legendGroup
          .append("text")
          .attr("x", gradientWidth)
          .attr("y", gradientHeight + 22)
          .attr("text-anchor", "end")
          .style("font-size", "10px")
          .style("font-weight", "500")
          .style("fill", "#6b7280")
          .text(maxValue.toLocaleString(locale));

        // Animate legend
        legendBg
          .attr("width", gradientWidth + 24)
          .attr("height", gradientHeight + 40)
          .transition()
          .delay(animated ? animationDuration * 0.3 : 0)
          .duration(animated ? 400 : 0)
          .ease(easeCubicOut)
          .style("opacity", 1);
      }

      // Add title
      if (title) {
        g.append("text")
          .attr("x", innerWidth / 2)
          .attr("y", -12)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("font-weight", "600")
          .style("fill", "#1f2937")
          .style("opacity", 0)
          .text(title)
          .transition()
          .duration(animated ? 600 : 0)
          .ease(easeCubicOut)
          .style("opacity", 1);
      }

      // Add info text
      const infoText = g
        .append("text")
        .attr("x", innerWidth - 20)
        .attr("y", innerHeight - 10)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .style("fill", "#9ca3af")
        .text(
          `${mapData().features.length} region${
            mapData().features.length !== 1 ? "s" : ""
          }${
            showPoints
              ? ` • ${pointData.length} point${
                  pointData.length !== 1 ? "s" : ""
                }`
              : ""
          }`
        );
    }, [
      mapData,
      actualWidth,
      height,
      margin,
      colorScale,
      showLegend,
      projectionType,
      zoomEnabled,
      center,
      scale,
      showPoints,
      pointData,
      pointSize,
      pointColor,
      borderColor,
      borderWidth,
      hoverColor,
      showLabels,
      labelKey,
      animated,
      animationDuration,
      buckets,
      innerWidth,
      innerHeight,
      locale,
      onDataPointClick,
      title,
    ]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ width, position: "relative", ...style }}
        role="img"
        aria-label={ariaLabel || title || "Interactive map chart"}
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
              padding: "10px 14px",
              borderRadius: "8px",
              pointerEvents: "none",
              zIndex: 100,
              minWidth: "150px",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {renderTooltip ? (
              renderTooltip(tooltip.feature.properties)
            ) : (
              <>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#1f2937",
                    marginBottom: "6px",
                    fontSize: "13px",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: "6px",
                  }}
                >
                  {tooltip.feature.properties.name || "Nepoznata regija"}
                </div>
                {Object.entries(tooltip.feature.properties)
                  .filter(([key]) => key !== "name" && !key.startsWith("_"))
                  .map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "16px",
                        marginTop: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ color: "#6b7280", fontWeight: 500 }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </span>
                      <span style={{ color: "#1f2937", fontWeight: 600 }}>
                        {typeof value === "number"
                          ? value.toLocaleString(locale)
                          : String(value)}
                      </span>
                    </div>
                  ))}
              </>
            )}
          </div>
        )}
        {/* Zoom controls */}
        {zoomEnabled && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <button
              onClick={() => {
                if (svgRef.current) {
                  select(svgRef.current)
                    .transition()
                    .duration(300)
                    .call(zoom().transform as any, zoomIdentity);
                }
              }}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#374151",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
              aria-label="Reset zoom"
            >
              ⟲
            </button>
          </div>
        )}
      </div>
    );
  }
);

MapChart.displayName = "MapChart";

export default MapChart;
