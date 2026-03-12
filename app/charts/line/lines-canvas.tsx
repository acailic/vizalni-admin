/**
 * Canvas-optimized line chart component for large temporal datasets
 */

import { line, curveMonotoneX } from "d3-shape";
import { memo, useEffect, useRef, useMemo, useCallback } from "react";

import { LinesState } from "@/charts/line/lines-state";
import { useCanvasRenderer, Point } from "@/charts/shared/canvas-renderer";
import { useChartState } from "@/charts/shared/chart-state";
import {
  useDataVirtualization,
  Viewport,
} from "@/charts/shared/data-virtualization";
import { truthy } from "@/domain/types";

interface LinesCanvasProps {
  /** Force canvas rendering regardless of data size */
  forceCanvas?: boolean;
  /** Maximum points before switching to canvas */
  svgThreshold?: number;
  /** Enable curve smoothing */
  enableSmoothing?: boolean;
  /** Line width in pixels */
  lineWidth?: number;
}

export const LinesCanvas = memo(function LinesCanvas({
  forceCanvas = false,
  svgThreshold = 5000,
  enableSmoothing = true,
  lineWidth = 2,
}: LinesCanvasProps) {
  const { getX, xScale, getY, yScale, grouped, colors, bounds, chartData } =
    useChartState() as LinesState;

  const canvasRef = useRef<HTMLCanvasElement>(null as any);
  const { renderPoints, clear, renderer } = useCanvasRenderer(canvasRef, {
    width: bounds.chartWidth,
    height: bounds.chartHeight,
    enableAntialiasing: true,
    maxPointsBeforeOptimization: 3000,
  });

  // Determine which rendering method to use
  const shouldUseCanvas = useMemo(() => {
    return forceCanvas || chartData.length > svgThreshold;
  }, [forceCanvas, chartData.length, svgThreshold]);

  // Group data by segments and convert to line paths
  const linePaths = useMemo(() => {
    const paths: Array<{
      key: string;
      color: string;
      points: Point[];
      segment: string;
    }> = [];

    Array.from(grouped).forEach(([segment, observations]) => {
      const validPoints = observations
        .map((d): Point | null => {
          const x = xScale(getX(d));
          const y = getY(d);

          if (
            Number.isNaN(y) ||
            y === null ||
            !Number.isFinite(x) ||
            !Number.isFinite(y)
          ) {
            return null;
          }

          return {
            x: x as number,
            y: yScale(y as number),
            color: colors(segment),
            key: `${segment}-${x}-${y}`,
          };
        })
        .filter(truthy);

      if (validPoints.length > 0) {
        paths.push({
          key: segment,
          color: colors(segment),
          points: validPoints,
          segment,
        });
      }
    });

    return paths;
  }, [grouped, getX, getY, xScale, yScale, colors]);

  // Use data virtualization for very large line datasets
  const viewport: Viewport = useMemo(
    () => ({
      x: bounds.margins.left,
      y: bounds.margins.top,
      width: bounds.chartWidth,
      height: bounds.chartHeight,
      scale: 1,
    }),
    [bounds]
  );

  const { renderData: optimizedPaths, totalPoints } = useDataVirtualization(
    linePaths as any,
    viewport,
    {
      enableLOD: shouldUseCanvas,
      enableSpatialIndex: false, // Lines don't benefit from spatial indexing as much
    }
  );

  // Render lines on canvas
  useEffect(() => {
    if (!shouldUseCanvas || !renderer) return;

    const ctx = renderer.getActiveContextPublic();
    if (!ctx) return;

    // Clear canvas
    clear();

    // Set up line rendering
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Render each line path
    optimizedPaths.forEach((pathData: any) => {
      if (!pathData.points || pathData.points.length < 2) return;

      // Convert points to D3 line path
      const lineGenerator = line<Point>()
        .x((d) => d.x)
        .y((d) => d.y);
      if (enableSmoothing) {
        lineGenerator.curve(curveMonotoneX as any);
      }

      const pathString = lineGenerator(pathData.points);

      if (!pathString) return;

      // Draw the path
      ctx.strokeStyle = pathData.color;
      ctx.beginPath();

      // Parse and draw the SVG path
      const commands = pathString.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g) || [];

      commands.forEach((command) => {
        const type = command[0];
        const coords = command
          .slice(1)
          .trim()
          .split(/[,\s]+/)
          .map(Number);

        switch (type) {
          case "M": // Move to
            if (coords.length >= 2) {
              ctx.moveTo(coords[0], coords[1]);
            }
            break;
          case "L": // Line to
            if (coords.length >= 2) {
              ctx.lineTo(coords[0], coords[1]);
            }
            break;
          case "C": // Cubic bezier
            if (coords.length >= 6) {
              ctx.bezierCurveTo(
                coords[0],
                coords[1],
                coords[2],
                coords[3],
                coords[4],
                coords[5]
              );
            }
            break;
          case "S": // Smooth cubic bezier
          case "Q": // Quadratic bezier
          case "T": // Smooth quadratic bezier
            // For simplicity, render as straight lines
            if (coords.length >= 2) {
              ctx.lineTo(coords[0], coords[1]);
            }
            break;
          case "Z": // Close path
            ctx.closePath();
            break;
        }
      });

      ctx.stroke();
    });
  }, [
    shouldUseCanvas,
    renderer,
    clear,
    optimizedPaths,
    lineWidth,
    enableSmoothing,
  ]);

  // Render dots if needed (for smaller datasets)
  const renderDots = useCallback(() => {
    if (!shouldUseCanvas || !renderer) return;

    const allPoints: Point[] = [];
    optimizedPaths.forEach((pathData: any) => {
      if (pathData.points) {
        allPoints.push(...pathData.points);
      }
    });

    renderPoints(allPoints);
  }, [shouldUseCanvas, renderer, optimizedPaths, renderPoints]);

  // Auto-render dots for smaller datasets
  useEffect(() => {
    if (shouldUseCanvas && totalPoints < 2000) {
      renderDots();
    }
  }, [shouldUseCanvas, totalPoints, renderDots]);

  return (
    <div
      style={{
        position: "relative",
        width: bounds.chartWidth,
        height: bounds.chartHeight,
      }}
    >
      {shouldUseCanvas ? (
        <canvas
          ref={canvasRef}
          width={bounds.chartWidth}
          height={bounds.chartHeight}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      ) : (
        // SVG fallback for smaller datasets
        <svg
          width={bounds.chartWidth}
          height={bounds.chartHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <g
            transform={`translate(${bounds.margins.left} ${bounds.margins.top})`}
          >
            {optimizedPaths.map((pathData: any) => {
              if (!pathData.points || pathData.points.length < 2) return null;

              const lineGenerator = line<Point>()
                .x((d) => d.x)
                .y((d) => d.y);
              if (enableSmoothing) {
                lineGenerator.curve(curveMonotoneX as any);
              }

              const pathString = lineGenerator(pathData.points);

              return (
                <path
                  key={pathData.key}
                  d={pathString as string}
                  stroke={pathData.color}
                  strokeWidth={lineWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Render dots for small datasets */}
            {totalPoints < 2000 && (
              <g>
                {optimizedPaths.map((pathData: any) =>
                  pathData.points?.map((point: Point, i: number) => (
                    <circle
                      key={`${pathData.key}-dot-${i}`}
                      cx={point.x}
                      cy={point.y}
                      r={3}
                      fill={pathData.color}
                    />
                  ))
                )}
              </g>
            )}
          </g>
        </svg>
      )}
    </div>
  );
});

LinesCanvas.displayName = "LinesCanvas";
