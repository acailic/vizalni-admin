/**
 * PerformanceBadge Component
 *
 * Displays performance metrics for demo visualizations.
 * Framework-agnostic component with optional Material-UI integration.
 *
 * @example
 * ```tsx
 * import { PerformanceBadge, usePerformanceMetrics } from '@/components/demos/performance-badge';
 *
 * function MyDemo() {
 *   const { metrics, markDataLoadStart, markDataLoadEnd, markRenderStart, markRenderEnd } = usePerformanceMetrics();
 *
 *   useEffect(() => {
 *     markDataLoadStart();
 *     fetchData().then(data => {
 *       markDataLoadEnd(data.length);
 *       markRenderStart();
 *       // render chart...
 *       markRenderEnd();
 *     });
 *   }, []);
 *
 *   return (
 *     <>
 *       <MyChart data={data} />
 *       <PerformanceBadge metrics={metrics} />
 *     </>
 *   );
 * }
 * ```
 */

import { useState, useRef, useCallback } from "react";

export interface PerformanceMetrics {
  /** Time to load data from API (ms) */
  dataLoadTime: number;
  /** Time to render the chart (ms) */
  renderTime: number;
  /** Number of data points in visualization */
  dataPoints: number;
  /** Cache hit status */
  fromCache?: boolean;
}

export interface PerformanceBadgeProps {
  metrics: PerformanceMetrics;
  /** Compact display mode */
  compact?: boolean;
  /** Show detailed breakdown */
  showDetails?: boolean;
  /** Optional className */
  className?: string;
}

/**
 * PerformanceBadge - Displays performance metrics with color coding
 */
export function PerformanceBadge({
  metrics,
  compact = false,
  showDetails = false,
  className = "",
}: PerformanceBadgeProps) {
  const getLoadTimeColor = (ms: number): string => {
    if (ms < 500) return "#10b981"; // green
    if (ms < 1500) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const formatMetric = (value: number, unit: string): string => {
    if (compact) {
      return `${value}${unit}`;
    }
    return `${value} ${unit}`;
  };

  return (
    <div
      className={`performance-badge ${className}`}
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        padding: compact ? "4px 8px" : "8px 12px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
        fontSize: compact ? "12px" : "13px",
      }}
    >
      {showDetails && (
        <>
          {/* Data Load Time */}
          <div
            title="Time to load data from API"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: getLoadTimeColor(metrics.dataLoadTime),
            }}
          >
            <span style={{ fontSize: "14px" }}>⏱</span>
            <span style={{ fontWeight: 500 }}>
              {formatMetric(metrics.dataLoadTime, "ms")}
            </span>
          </div>

          {/* Render Time */}
          <div
            title="Time to render the chart"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: getLoadTimeColor(metrics.renderTime),
            }}
          >
            <span style={{ fontSize: "14px" }}>⚡</span>
            <span style={{ fontWeight: 500 }}>
              {formatMetric(metrics.renderTime, "ms")}
            </span>
          </div>
        </>
      )}

      {/* Data Points */}
      <div
        title="Number of data points in visualization"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "4px",
          border: "1px solid #d1d5db",
        }}
      >
        <span style={{ fontSize: "14px" }}>📊</span>
        <span style={{ fontWeight: 500 }}>
          {metrics.dataPoints.toLocaleString()} {compact ? "" : "points"}
        </span>
      </div>

      {/* Cache indicator */}
      {metrics.fromCache !== undefined && (
        <div
          title={metrics.fromCache ? "Loaded from cache" : "Fresh data fetch"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 8px",
            borderRadius: "4px",
            border: "1px solid #d1d5db",
          }}
        >
          <span style={{ fontSize: "14px" }}>
            {metrics.fromCache ? "💾" : "🌐"}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to measure performance metrics
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    dataLoadTime: 0,
    renderTime: 0,
    dataPoints: 0,
  });

  const dataLoadStartRef = useRef<number | undefined>(undefined);
  const renderStartRef = useRef<number | undefined>(undefined);

  const markDataLoadStart = useCallback(() => {
    dataLoadStartRef.current = performance.now();
  }, []);

  const markDataLoadEnd = useCallback(
    (dataPoints: number, fromCache = false) => {
      if (dataLoadStartRef.current) {
        const duration = Math.round(
          performance.now() - dataLoadStartRef.current
        );
        setMetrics((m) => ({
          ...m,
          dataLoadTime: duration,
          dataPoints,
          fromCache,
        }));
        dataLoadStartRef.current = undefined;
      }
    },
    []
  );

  const markRenderStart = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  const markRenderEnd = useCallback(() => {
    if (renderStartRef.current) {
      const duration = Math.round(performance.now() - renderStartRef.current);
      setMetrics((m) => ({ ...m, renderTime: duration }));
      renderStartRef.current = undefined;
    }
  }, []);

  return {
    metrics,
    markDataLoadStart,
    markDataLoadEnd,
    markRenderStart,
    markRenderEnd,
  };
}

export default PerformanceBadge;
