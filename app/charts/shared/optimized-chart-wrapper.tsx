/**
 * Optimized chart wrapper that automatically chooses the best rendering method
 * based on data size, performance metrics, and device capabilities
 */

import { memo, useEffect, useRef, useMemo } from "react";
import { useChartState } from "@/charts/shared/chart-state";
import { ChartType } from "@/config-types";
import { usePerformanceAwareRendering } from "./performance-manager";

// Import canvas components
import { ScatterplotCanvas } from "@/charts/scatterplot/scatterplot-canvas";
import { LinesCanvas } from "@/charts/line/lines-canvas";
import { AreasCanvas } from "@/charts/area/areas-canvas";

// Import original SVG components
import { Scatterplot } from "@/charts/scatterplot/scatterplot";
import { Lines } from "@/charts/line/lines";
import { Areas } from "@/charts/area/areas";

interface OptimizedChartWrapperProps {
  /** Chart type to render */
  chartType: ChartType;
  /** Force specific rendering method */
  forceRenderingMethod?: 'svg' | 'canvas';
  /** Enable performance monitoring */
  enablePerformanceMonitoring?: boolean;
  /** Custom thresholds for performance optimization */
  customThresholds?: {
    svgThreshold?: number;
    targetFPS?: number;
    maxMemoryUsage?: number;
  };
}

/**
 * Smart wrapper that automatically switches between SVG and Canvas rendering
 * based on data size, performance metrics, and device capabilities
 */
export const OptimizedChartWrapper = memo(function OptimizedChartWrapper({
  chartType,
  forceRenderingMethod,
  enablePerformanceMonitoring = true,
  customThresholds = {}
}: OptimizedChartWrapperProps) {
  const { chartData } = useChartState() as any;
  const containerRef = useRef<HTMLDivElement>(null);

  const dataPointsCount = useMemo(() => {
    if (!chartData) return 0;

    switch (chartType) {
      case 'scatterplot':
        return chartData.length;
      case 'line':
        return chartData.length;
      case 'area':
        return chartData.reduce((total: number, series: any) => total + series.length, 0);
      default:
        return chartData.length;
    }
  }, [chartData, chartType]);

  // Get performance-aware rendering settings
  const performance = usePerformanceAwareRendering(dataPointsCount, chartType as any);

  // Determine which rendering method to use
  const renderingMethod = useMemo(() => {
    if (forceRenderingMethod) {
      return forceRenderingMethod;
    }

    const svgThreshold = customThresholds.svgThreshold || {
      scatterplot: 10000,
      line: 5000,
      area: 3000
    }[chartType] || 10000;

    if (dataPointsCount > svgThreshold) {
      return 'canvas';
    }

    return performance.renderingMethod;
  }, [forceRenderingMethod, customThresholds.svgThreshold, chartType, dataPointsCount, performance.renderingMethod]);

  // Canvas component configuration
  const canvasProps = useMemo(() => ({
    forceCanvas: renderingMethod === 'canvas',
    svgThreshold: customThresholds.svgThreshold || 10000,
    canvasConfig: {
      ...performance.canvasConfig,
      enableAntialiasing: performance.enableAntialiasing
    },
    enablePerformanceMonitoring: enablePerformanceMonitoring
  }), [renderingMethod, customThresholds.svgThreshold, performance.canvasConfig, performance.enableAntialiasing, enablePerformanceMonitoring]);

  // Start render timing
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      performance.startRender();
    }
  });

  // End render timing when component mounts/updates
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      // Delayed to allow actual rendering to complete
      const timer = setTimeout(() => {
        performance.endRender(dataPointsCount);
      }, 0);

      return () => clearTimeout(timer);
    }
  });

  // Render the appropriate chart component
  const renderChart = () => {
    switch (chartType) {
      case 'scatterplot':
        return renderingMethod === 'canvas' ? (
          <ScatterplotCanvas {...canvasProps} />
        ) : (
          <Scatterplot />
        );

      case 'line':
        return renderingMethod === 'canvas' ? (
          <LinesCanvas {...canvasProps} />
        ) : (
          <Lines />
        );

      case 'area':
        return renderingMethod === 'canvas' ? (
          <AreasCanvas {...canvasProps} />
        ) : (
          <Areas />
        );

      default:
        // For other chart types, you could add canvas components here
        // For now, fall back to original components
        console.warn(`Canvas rendering not yet implemented for chart type: ${chartType}`);
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="optimized-chart-wrapper"
      data-rendering-method={renderingMethod}
      data-data-points={dataPointsCount}
      data-chart-type={chartType}
    >
      {renderChart()}

      {/* Performance monitoring overlay (development only) */}
      {enablePerformanceMonitoring && process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
            lineHeight: '1.4',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <div>Type: {chartType}</div>
          <div>Method: {renderingMethod.toUpperCase()}</div>
          <div>Points: {dataPointsCount.toLocaleString()}</div>
          <div>FPS: {performance.performanceMetrics.fps.toFixed(1)}</div>
          <div>Render: {performance.performanceMetrics.averageRenderTime.toFixed(1)}ms</div>
          <div>LOD: {performance.lodLevel}</div>
          {performance.performanceMetrics.memoryUsage && (
            <div>Memory: {performance.performanceMetrics.memoryUsage.toFixed(1)}MB</div>
          )}
        </div>
      )}
    </div>
  );
});

OptimizedChartWrapper.displayName = 'OptimizedChartWrapper';

/**
 * Hook to easily integrate optimized rendering into existing chart components
 */
export function useOptimizedRendering(chartType: ChartType, dataPointsCount: number) {
  const performance = usePerformanceAwareRendering(dataPointsCount, chartType as any);

  return {
    // Rendering decisions
    shouldUseCanvas: performance.renderingMethod === 'canvas',
    lodLevel: performance.lodLevel,
    enableAnimations: performance.enableAnimations,

    // Canvas configuration
    canvasConfig: performance.canvasConfig,

    // Performance monitoring
    startRender: performance.startRender,
    endRender: performance.endRender,
    metrics: performance.performanceMetrics,

    // Optimization recommendations
    recommendations: {
      svgThreshold: {
        scatterplot: 10000,
        line: 5000,
        area: 3000
      }[chartType] || 10000,
      targetFPS: chartType === 'scatterplot' ? 30 : 45,
      maxMemoryUsage: 300
    }
  };
}