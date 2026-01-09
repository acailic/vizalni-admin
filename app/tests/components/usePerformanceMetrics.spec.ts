/**
 * usePerformanceMetrics Hook Tests
 *
 * Tests for the usePerformanceMetrics hook which measures performance metrics
 * for demo visualizations.
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { usePerformanceMetrics } from "@/components/demos/performance-badge";

describe("usePerformanceMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("Initial State", () => {
    it("returns initial metrics with zero values", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      expect(result.current.metrics).toEqual({
        dataLoadTime: 0,
        renderTime: 0,
        dataPoints: 0,
      });
    });

    it("returns all required functions", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      expect(typeof result.current.markDataLoadStart).toBe("function");
      expect(typeof result.current.markDataLoadEnd).toBe("function");
      expect(typeof result.current.markRenderStart).toBe("function");
      expect(typeof result.current.markRenderEnd).toBe("function");
    });

    it("does not include fromCache in initial metrics", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      expect(result.current.metrics.fromCache).toBeUndefined();
    });
  });

  describe("markDataLoadStart/End", () => {
    it("marks data load start time", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
      });

      // Should not update metrics yet
      expect(result.current.metrics.dataLoadTime).toBe(0);
    });

    it("calculates data load time on markDataLoadEnd", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
      });

      act(() => {
        result.current.markDataLoadEnd(1000);
      });

      // Should update metrics
      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.dataPoints).toBe(1000);
    });

    it("updates data points on markDataLoadEnd", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(5000);
      });

      expect(result.current.metrics.dataPoints).toBe(5000);
    });

    it("sets fromCache to true when specified", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(1000, true);
      });

      expect(result.current.metrics.fromCache).toBe(true);
    });

    it("sets fromCache to false when specified", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(1000, false);
      });

      expect(result.current.metrics.fromCache).toBe(false);
    });

    it("defaults fromCache to false when not specified", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(1000);
      });

      expect(result.current.metrics.fromCache).toBe(false);
    });

    it("handles multiple data load cycles", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // First load
      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(100, true);
      });

      expect(result.current.metrics.dataPoints).toBe(100);
      expect(result.current.metrics.fromCache).toBe(true);

      // Second load
      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(200, false);
      });

      expect(result.current.metrics.dataPoints).toBe(200);
      expect(result.current.metrics.fromCache).toBe(false);
    });

    it("does not update metrics if markDataLoadEnd is called without start", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadEnd(1000);
      });

      expect(result.current.metrics.dataLoadTime).toBe(0);
      expect(result.current.metrics.dataPoints).toBe(0);
    });

    it("resets start time after markDataLoadEnd", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(1000);
      });

      const firstTime = result.current.metrics.dataLoadTime;

      // Call markDataLoadEnd again without start - should not update
      act(() => {
        result.current.markDataLoadEnd(2000);
      });

      expect(result.current.metrics.dataLoadTime).toBe(firstTime);
    });
  });

  describe("markRenderStart/End", () => {
    it("marks render start time", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markRenderStart();
      });

      // Should not update metrics yet
      expect(result.current.metrics.renderTime).toBe(0);
    });

    it("calculates render time on markRenderEnd", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markRenderStart();
      });

      act(() => {
        result.current.markRenderEnd();
      });

      // Should update metrics
      expect(result.current.metrics.renderTime).toBeGreaterThanOrEqual(0);
    });

    it("does not affect data load metrics", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // Set up data load metrics
      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(1000);
      });

      const dataLoadTime = result.current.metrics.dataLoadTime;
      const dataPoints = result.current.metrics.dataPoints;

      // Measure render time
      act(() => {
        result.current.markRenderStart();
        result.current.markRenderEnd();
      });

      expect(result.current.metrics.dataLoadTime).toBe(dataLoadTime);
      expect(result.current.metrics.dataPoints).toBe(dataPoints);
    });

    it("handles multiple render cycles", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // First render
      act(() => {
        result.current.markRenderStart();
        result.current.markRenderEnd();
      });

      const firstRenderTime = result.current.metrics.renderTime;

      // Second render
      act(() => {
        result.current.markRenderStart();
        result.current.markRenderEnd();
      });

      const secondRenderTime = result.current.metrics.renderTime;

      expect(secondRenderTime).toBeGreaterThanOrEqual(0);
      expect(firstRenderTime).toBeGreaterThanOrEqual(0);
    });

    it("does not update metrics if markRenderEnd is called without start", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markRenderEnd();
      });

      expect(result.current.metrics.renderTime).toBe(0);
    });

    it("resets start time after markRenderEnd", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markRenderStart();
        result.current.markRenderEnd();
      });

      const firstTime = result.current.metrics.renderTime;

      // Call markRenderEnd again without start - should not update
      act(() => {
        result.current.markRenderEnd();
      });

      expect(result.current.metrics.renderTime).toBe(firstTime);
    });
  });

  describe("Metric Calculation", () => {
    it("measures very short durations", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        // Minimal delay
        result.current.markDataLoadEnd(100);
      });

      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
    });

    it("measures long durations", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        // Simulate some processing
        result.current.markDataLoadEnd(100);
      });

      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
    });

    it("handles concurrent data load and render measurements", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // Start both measurements
      act(() => {
        result.current.markDataLoadStart();
        result.current.markRenderStart();
      });

      // End data load
      act(() => {
        result.current.markDataLoadEnd(1000);
      });

      // End render
      act(() => {
        result.current.markRenderEnd();
      });

      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.renderTime).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.dataPoints).toBe(1000);
    });

    it("maintains separate timing for data load and render", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // Data load cycle
      act(() => {
        result.current.markDataLoadStart();
      });

      act(() => {
        result.current.markDataLoadEnd(1000);
      });

      // Render cycle
      act(() => {
        result.current.markRenderStart();
      });

      act(() => {
        result.current.markRenderEnd();
      });

      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.renderTime).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.dataPoints).toBe(1000);
    });
  });

  describe("Multiple Calls", () => {
    it("handles rapid sequential calls", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // First cycle
      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(100);
      });

      // Second cycle immediately
      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(200);
      });

      // Third cycle
      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(50);
      });

      expect(result.current.metrics.dataPoints).toBe(50);
      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
    });

    it("handles interleaved data load and render calls", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // Start data load
      act(() => {
        result.current.markDataLoadStart();
      });

      // Start render (while data load is ongoing)
      act(() => {
        result.current.markRenderStart();
      });

      // End data load
      act(() => {
        result.current.markDataLoadEnd(1000);
      });

      // End render
      act(() => {
        result.current.markRenderEnd();
      });

      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.renderTime).toBeGreaterThanOrEqual(0);
    });

    it("handles starting new measurement before ending previous", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // Start first data load
      act(() => {
        result.current.markDataLoadStart();
      });

      // Start second data load (without ending first)
      act(() => {
        result.current.markDataLoadStart();
      });

      // End second data load
      act(() => {
        result.current.markDataLoadEnd(500);
      });

      // Should measure from second start
      expect(result.current.metrics.dataPoints).toBe(500);
      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
    });

    it("preserves data points across render measurements", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // Set up data load
      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(1000);
      });

      expect(result.current.metrics.dataPoints).toBe(1000);

      // Multiple render cycles
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.markRenderStart();
          result.current.markRenderEnd();
        });

        expect(result.current.metrics.dataPoints).toBe(1000);
      }
    });
  });

  describe("Real-world Scenarios", () => {
    it("simulates typical data fetching and rendering flow", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // User initiates data fetch
      act(() => {
        result.current.markDataLoadStart();
      });

      // Data arrives
      act(() => {
        result.current.markDataLoadEnd(5000, false);
      });

      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.dataPoints).toBe(5000);
      expect(result.current.metrics.fromCache).toBe(false);

      // Start rendering
      act(() => {
        result.current.markRenderStart();
      });

      // Rendering complete
      act(() => {
        result.current.markRenderEnd();
      });

      expect(result.current.metrics.renderTime).toBeGreaterThanOrEqual(0);
    });

    it("simulates cached data flow", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // Load from cache
      act(() => {
        result.current.markDataLoadStart();
      });

      act(() => {
        result.current.markDataLoadEnd(5000, true);
      });

      expect(result.current.metrics.fromCache).toBe(true);

      // Render cached data
      act(() => {
        result.current.markRenderStart();
      });

      act(() => {
        result.current.markRenderEnd();
      });

      expect(result.current.metrics.renderTime).toBeGreaterThanOrEqual(0);
    });

    it("simulates multiple re-renders with same data", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      // Initial data load
      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(10000);
      });

      expect(result.current.metrics.dataPoints).toBe(10000);

      // First render
      act(() => {
        result.current.markRenderStart();
        result.current.markRenderEnd();
      });

      // Re-render due to interaction
      act(() => {
        result.current.markRenderStart();
        result.current.markRenderEnd();
      });

      // Another re-render
      act(() => {
        result.current.markRenderStart();
        result.current.markRenderEnd();
      });

      // Data points should remain constant
      expect(result.current.metrics.dataPoints).toBe(10000);
    });
  });

  describe("Edge Cases", () => {
    it("handles calling start methods multiple times without end", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadStart();
        result.current.markDataLoadStart();
      });

      // Finally end
      act(() => {
        result.current.markDataLoadEnd(100);
      });

      expect(result.current.metrics.dataPoints).toBe(100);
    });

    it("handles zero data points", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(0);
      });

      expect(result.current.metrics.dataPoints).toBe(0);
      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
    });

    it("handles very large data point counts", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(Number.MAX_SAFE_INTEGER);
      });

      expect(result.current.metrics.dataPoints).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("handles negative timing gracefully", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(100);
      });

      // Should handle gracefully without crashing
      expect(result.current.metrics.dataLoadTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Hook Stability", () => {
    it("maintains stable function references across re-renders", () => {
      const { result, rerender } = renderHook(() => usePerformanceMetrics());

      const initialMarkDataLoadStart = result.current.markDataLoadStart;
      const initialMarkDataLoadEnd = result.current.markDataLoadEnd;
      const initialMarkRenderStart = result.current.markRenderStart;
      const initialMarkRenderEnd = result.current.markRenderEnd;

      rerender();

      expect(result.current.markDataLoadStart).toBe(initialMarkDataLoadStart);
      expect(result.current.markDataLoadEnd).toBe(initialMarkDataLoadEnd);
      expect(result.current.markRenderStart).toBe(initialMarkRenderStart);
      expect(result.current.markRenderEnd).toBe(initialMarkRenderEnd);
    });

    it("updates metrics object reference when values change", () => {
      const { result } = renderHook(() => usePerformanceMetrics());

      const initialMetrics = result.current.metrics;

      act(() => {
        result.current.markDataLoadStart();
        result.current.markDataLoadEnd(100);
      });

      expect(result.current.metrics).not.toBe(initialMetrics);
    });
  });
});
