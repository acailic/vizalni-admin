/**
 * Canvas-optimized scatter plot component for large datasets
 * Automatically switches between SVG and canvas rendering based on data size
 */

import { memo, useEffect, useRef, useMemo, useCallback } from "react";

import { ScatterplotState } from "@/charts/scatterplot/scatterplot-state";
import {
  useCanvasRenderer,
  CanvasRendererConfig,
  Point,
} from "@/charts/shared/canvas-renderer";
import { useChartState } from "@/charts/shared/chart-state";
import {
  useDataVirtualization,
  Viewport,
  DataPoint,
} from "@/charts/shared/data-virtualization";
import { Observation } from "@/domain/data";
import { useTransitionStore } from "@/stores/transition";

interface ScatterplotCanvasProps {
  /** Force canvas rendering regardless of data size */
  forceCanvas?: boolean;
  /** Maximum points before switching to canvas */
  svgThreshold?: number;
  /** Canvas renderer configuration */
  canvasConfig?: Partial<CanvasRendererConfig>;
  /** Enable performance monitoring */
  enablePerformanceMonitoring?: boolean;
}

const DEFAULT_CANVAS_CONFIG: Partial<CanvasRendererConfig> = {
  enableAntialiasing: true,
  enableVertexOptimization: true,
  maxPointsBeforeOptimization: 5000,
};

/**
 * High-performance scatter plot that automatically chooses optimal rendering method
 */
export const ScatterplotCanvas = memo(function ScatterplotCanvas({
  forceCanvas = false,
  svgThreshold = 10000,
  canvasConfig = DEFAULT_CANVAS_CONFIG,
  enablePerformanceMonitoring = false,
}: ScatterplotCanvasProps) {
  const {
    chartData,
    bounds,
    getX,
    xScale,
    getY,
    yScale,
    getSegment,
    colors,
    getRenderingKey,
  } = useChartState() as ScatterplotState;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const performanceMonitorRef = useRef<any>(null);

  const {
    renderPoints,
    clear: _clear,
    renderer,
  } = useCanvasRenderer(canvasRef as any, {
    width: bounds.chartWidth,
    height: bounds.chartHeight,
    ...canvasConfig,
  });

  const enableTransition = useTransitionStore((state) => state.enable);

  // Determine which rendering method to use
  const shouldUseCanvas = useMemo(() => {
    return forceCanvas || chartData.length > svgThreshold;
  }, [forceCanvas, chartData.length, svgThreshold]);

  // Convert observation data to point format
  const dataPoints = useMemo(() => {
    return chartData
      .map((d, i): DataPoint => {
        const segment = getSegment(d);
        return {
          x: xScale(getX(d) ?? NaN),
          y: yScale(getY(d) ?? NaN),
          color: colors(segment),
          size: 4,
          key: getRenderingKey(d),
          // Store original observation for interaction
          observation: d,
          index: i,
        } as DataPoint & { observation: Observation; index: number };
      })
      .filter(
        (point) =>
          !isNaN(point.x) &&
          !isNaN(point.y) &&
          isFinite(point.x) &&
          isFinite(point.y)
      );
  }, [
    chartData,
    getSegment,
    getX,
    getY,
    xScale,
    yScale,
    colors,
    getRenderingKey,
  ]);

  // Set up viewport for virtualization
  const viewport: Viewport = useMemo(
    () => ({
      x: 0,
      y: 0,
      width: bounds.chartWidth,
      height: bounds.chartHeight,
      scale: 1,
    }),
    [bounds]
  );

  // Use data virtualization for large datasets
  const {
    renderData: optimizedData,
    getNearestPoints,
    totalPoints,
  } = useDataVirtualization(dataPoints, viewport, {
    enableLOD: shouldUseCanvas,
    enableSpatialIndex: shouldUseCanvas,
    spatialIndexThreshold: 10000,
  });

  // Convert optimized data back to renderer format
  const renderPointsData = useMemo(() => {
    return optimizedData.map(
      (point): Point => ({
        x: point.x,
        y: point.y,
        color: point.color,
        size: point.size,
        key: point.key,
      })
    );
  }, [optimizedData]);

  // Handle canvas rendering
  useEffect(() => {
    if (!shouldUseCanvas || !renderer) return;

    const render = () => {
      // Start performance monitoring if enabled
      if (enablePerformanceMonitoring && performanceMonitorRef.current) {
        performanceMonitorRef.current.startFrame();
      }

      // Render points
      renderPoints(renderPointsData);

      // End performance monitoring
      if (enablePerformanceMonitoring && performanceMonitorRef.current) {
        performanceMonitorRef.current.endFrame();
      }
    };

    // Render immediately for non-animated charts, or during transition
    if (!enableTransition) {
      render();
    } else {
      // Use requestAnimationFrame for smooth rendering during transitions
      requestAnimationFrame(render);
    }
  }, [
    shouldUseCanvas,
    renderer,
    renderPoints,
    renderPointsData,
    enableTransition,
    enablePerformanceMonitoring,
  ]);

  // Handle hover/interaction for canvas mode
  const handleCanvasMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!shouldUseCanvas || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find nearest points for hover/tooltip
      const nearestPoints = getNearestPoints(x, y, 10, 5);

      // Dispatch custom event for tooltip/hover handling
      const customEvent = new CustomEvent("scatterplot-hover", {
        detail: {
          x,
          y,
          points: nearestPoints,
          event,
        },
      });

      canvasRef.current.dispatchEvent(customEvent);
    },
    [shouldUseCanvas, getNearestPoints]
  );

  // Handle click events for canvas mode
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!shouldUseCanvas || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find nearest points for selection
      const nearestPoints = getNearestPoints(x, y, 5, 1);

      if (nearestPoints.length > 0) {
        const customEvent = new CustomEvent("scatterplot-click", {
          detail: {
            x,
            y,
            point: nearestPoints[0],
            event,
          },
        });

        canvasRef.current.dispatchEvent(customEvent);
      }
    },
    [shouldUseCanvas, getNearestPoints]
  );

  // Initialize performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring && shouldUseCanvas) {
      // Performance monitoring would be implemented here
      // For now, we'll just log basic metrics
      const logPerformance = () => {
        if (renderer && renderPointsData.length > 0) {
          console.log(
            `Canvas scatter plot rendered ${renderPointsData.length} points out of ${totalPoints} total`
          );
        }
      };

      const interval = setInterval(logPerformance, 5000);
      return () => clearInterval(interval);
    }
  }, [
    enablePerformanceMonitoring,
    shouldUseCanvas,
    renderer,
    renderPointsData.length,
    totalPoints,
  ]);

  // Fallback SVG rendering for small datasets or when canvas is disabled
  const renderSVG = () => {
    if (shouldUseCanvas) return null;

    return (
      <svg
        ref={svgRef}
        width={bounds.chartWidth}
        height={bounds.chartHeight}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <g
          transform={`translate(${bounds.margins.left} ${bounds.margins.top})`}
        >
          {optimizedData.map((point, i) => (
            <circle
              key={point.key || i}
              cx={point.x}
              cy={point.y}
              r={point.size || 4}
              fill={point.color}
              className="scatterplot-point"
              data-index={(point as any).index}
              style={{ pointerEvents: "all" }}
            />
          ))}
        </g>
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
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
            cursor: "crosshair",
          }}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => {
            // Clear hover state
            if (canvasRef.current) {
              canvasRef.current.dispatchEvent(
                new CustomEvent("scatterplot-hover", {
                  detail: { x: 0, y: 0, points: [], event: null },
                })
              );
            }
          }}
          onClick={handleCanvasClick}
        />
      ) : (
        renderSVG()
      )}

      {/* Performance info overlay (development only) */}
      {enablePerformanceMonitoring &&
        shouldUseCanvas &&
        process.env.NODE_ENV === "development" && (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "5px 10px",
              borderRadius: "3px",
              fontSize: "12px",
              fontFamily: "monospace",
              pointerEvents: "none",
            }}
          >
            <div>
              Points: {renderPointsData.length.toLocaleString()} /{" "}
              {totalPoints.toLocaleString()}
            </div>
            <div>Mode: Canvas</div>
          </div>
        )}
    </div>
  );
});

ScatterplotCanvas.displayName = "ScatterplotCanvas";
