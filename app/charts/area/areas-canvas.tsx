// @ts-nocheck
/**
 * Canvas-optimized area chart component for large temporal datasets
 */

import { area, curveLinear, curveMonotoneX } from "d3-shape";
import { memo, useEffect, useRef, useMemo } from "react";

import { AreasState } from "@/charts/area/areas-state";
import { useCanvasRenderer } from "@/charts/shared/canvas-renderer";
import { useChartState } from "@/charts/shared/chart-state";
import { useDataVirtualization, Viewport } from "@/charts/shared/data-virtualization";
interface AreasCanvasProps {
  /** Force canvas rendering regardless of data size */
  forceCanvas?: boolean;
  /** Maximum points before switching to canvas */
  svgThreshold?: number;
  /** Enable curve smoothing */
  enableSmoothing?: boolean;
  /** Area opacity */
  opacity?: number;
}

interface AreaPath {
  key: string;
  color: string;
  points: Array<{ x: number; y0: number; y1: number }>;
  segment: string;
}

export const AreasCanvas = memo(function AreasCanvas({
  forceCanvas = false,
  svgThreshold = 3000,
  enableSmoothing = true,
  opacity = 0.7
}: AreasCanvasProps) {
  const {
    bounds,
    getX,
    xScale,
    yScale,
    colors,
    series
  } = useChartState() as AreasState;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { clear, renderer } = useCanvasRenderer(canvasRef, {
    width: bounds.chartWidth,
    height: bounds.chartHeight,
    enableAntialiasing: true,
    maxPointsBeforeOptimization: 2000
  });

  // Determine which rendering method to use
  const totalDataPoints = useMemo(() => {
    return series.reduce((total, s) => total + s.length, 0);
  }, [series]);

  const shouldUseCanvas = useMemo(() => {
    return forceCanvas || totalDataPoints > svgThreshold;
  }, [forceCanvas, totalDataPoints, svgThreshold]);

  // Convert series data to area paths
  const areaPaths = useMemo(() => {
    const paths: AreaPath[] = [];

    series.forEach((seriesData) => {
      const validPoints = seriesData
        .map((d): { x: number; y0: number; y1: number } | null => {
          const x = xScale(getX(d.data));
          const y0 = d[0]; // bottom value
          const y1 = d[1]; // top value

          if (
            y0 === null ||
            y1 === null ||
            Number.isNaN(y0) ||
            Number.isNaN(y1) ||
            !Number.isFinite(x) ||
            !Number.isFinite(y0) ||
            !Number.isFinite(y1)
          ) {
            return null;
          }

          return {
            x: x as number,
            y0: yScale(y0),
            y1: yScale(y1)
          };
        })
        .filter((point): point is { x: number; y0: number; y1: number } => point !== null);

      if (validPoints.length > 0) {
        paths.push({
          key: seriesData.key,
          color: colors(seriesData.key),
          points: validPoints,
          segment: seriesData.key
        });
      }
    });

    return paths;
  }, [series, getX, xScale, yScale, colors]);

  // Use data virtualization for very large area datasets
  const viewport: Viewport = useMemo(() => ({
    x: bounds.margins.left,
    y: bounds.margins.top,
    width: bounds.chartWidth,
    height: bounds.chartHeight,
    scale: 1
  }), [bounds]);

  const {
    renderData: optimizedPaths
  } = useDataVirtualization(
    areaPaths as any,
    viewport,
    {
      enableLOD: shouldUseCanvas,
      enableSpatialIndex: false // Areas don't benefit from spatial indexing
    }
  );

  // Render areas on canvas
  useEffect(() => {
    if (!shouldUseCanvas || !renderer) return;

    const ctx = renderer.getActiveContextPublic();
    if (!ctx) return;

    // Clear canvas
    clear();

    // Set up area rendering
    ctx.globalAlpha = opacity;

    // Render each area path (from bottom to top for proper layering)
    (optimizedPaths as any[]).reverse().forEach((pathData: AreaPath) => {
      if (!pathData.points || pathData.points.length < 2) return;

      // Create area path using D3
      const areaGenerator = area<{ x: number; y0: number; y1: number }>()
        .x(d => d.x)
        .y0(d => d.y0)
        .y1(d => d.y1)
        .curve(enableSmoothing ? curveMonotoneX : curveLinear);

      const pathString = areaGenerator(pathData.points);

      if (!pathString) return;

      // Draw the filled area
      ctx.fillStyle = pathData.color;
      ctx.beginPath();

      // Parse and draw the SVG path
      const commands = pathString.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g) || [];

      commands.forEach(command => {
        const type = command[0];
        const coords = command.slice(1).trim().split(/[,\s]+/).map(Number);

        switch (type) {
          case 'M': // Move to
            if (coords.length >= 2) {
              ctx.moveTo(coords[0], coords[1]);
            }
            break;
          case 'L': // Line to
            if (coords.length >= 2) {
              ctx.lineTo(coords[0], coords[1]);
            }
            break;
          case 'C': // Cubic bezier
            if (coords.length >= 6) {
              ctx.bezierCurveTo(coords[0], coords[1], coords[2], coords[3], coords[4], coords[5]);
            }
            break;
          case 'S': // Smooth cubic bezier
          case 'Q': // Quadratic bezier
          case 'T': // Smooth quadratic bezier
            // For simplicity, render as straight lines
            if (coords.length >= 2) {
              ctx.lineTo(coords[0], coords[1]);
            }
            break;
          case 'Z': // Close path
            ctx.closePath();
            break;
        }
      });

      ctx.fill();
    });

    // Reset global alpha
    ctx.globalAlpha = 1.0;

  }, [shouldUseCanvas, renderer, clear, optimizedPaths, opacity, enableSmoothing]);

  // Calculate SVG path data for fallback
  const svgAreaData = useMemo(() => {
    return (optimizedPaths as any[]).map((pathData: AreaPath) => {
      if (!pathData.points || pathData.points.length < 2) return null;

      const areaGenerator = area<{ x: number; y0: number; y1: number }>()
        .x(d => d.x)
        .y0(d => d.y0)
        .y1(d => d.y1)
        .curve(enableSmoothing ? curveMonotoneX : curveLinear);

      return {
        key: pathData.key,
        d: areaGenerator(pathData.points),
        color: pathData.color
      };
    }).filter(Boolean) as any;
  }, [optimizedPaths, enableSmoothing]);

  return (
    <div style={{ position: 'relative', width: bounds.chartWidth, height: bounds.chartHeight }}>
      {shouldUseCanvas ? (
        <canvas
          ref={canvasRef}
          width={bounds.chartWidth}
          height={bounds.chartHeight}
          style={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      ) : (
        // SVG fallback for smaller datasets
        <svg
          width={bounds.chartWidth}
          height={bounds.chartHeight}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <g transform={`translate(${bounds.margins.left} ${bounds.margins.top})`}>
            {svgAreaData.map((areaData: any) => (
              <path
                key={areaData.key}
                d={areaData.d}
                fill={areaData.color}
                opacity={opacity}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
});

AreasCanvas.displayName = 'AreasCanvas';
