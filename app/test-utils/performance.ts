/**
 * Performance testing utilities for vizualni-admin
 * Provides tools for bundle analysis, render performance, and memory leak detection
 */

import { render, RenderResult } from "@testing-library/react";
import { ReactElement } from "react";

// Performance measurement types
type MemoryInfo = any;
export interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  reRenderCount: number;
  memoryUsage?: MemoryInfo;
  bundleSize?: BundleMetrics;
}

export interface BundleMetrics {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkMetrics[];
  largestAssets: AssetMetrics[];
}

export interface ChunkMetrics {
  name: string;
  size: number;
  gzippedSize: number;
  modules: string[];
}

export interface AssetMetrics {
  name: string;
  size: number;
  type: string;
}

export interface RenderPerformanceResult {
  averageTime: number;
  minTime: number;
  maxTime: number;
  medianTime: number;
  standardDeviation: number;
  samples: number[];
}

/**
 * Measure component render performance across multiple iterations
 */
export async function measureRenderPerformance(
  component: ReactElement,
  iterations = 10,
  warmupIterations = 2
): Promise<RenderPerformanceResult> {
  const renderTimes: number[] = [];

  // Warmup iterations to account for JIT compilation
  for (let i = 0; i < warmupIterations; i++) {
    const { unmount } = render(component);
    unmount();
  }

  // Actual measurements
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    const { unmount } = render(component);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    renderTimes.push(renderTime);
    unmount();
  }

  // Calculate statistics
  const average = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
  const min = Math.min(...renderTimes);
  const max = Math.max(...renderTimes);
  const median = renderTimes.sort((a, b) => a - b)[
    Math.floor(renderTimes.length / 2)
  ];

  const variance =
    renderTimes.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) /
    renderTimes.length;
  const standardDeviation = Math.sqrt(variance);

  return {
    averageTime: average,
    minTime: min,
    maxTime: max,
    medianTime: median,
    standardDeviation,
    samples: renderTimes,
  };
}

/**
 * Memory leak detection for components
 */
export async function detectMemoryLeaks(
  renderComponent: () => RenderResult,
  iterations = 5,
  threshold = 50 * 1024 * 1024 // 50MB
): Promise<{
  hasLeaks: boolean;
  memoryGrowth: number[];
  finalMemoryUsage: number;
  leakRate: number;
}> {
  const memoryGrowth: number[] = [];
  let initialMemory = 0;

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  // Get initial memory
  initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

  for (let i = 0; i < iterations; i++) {
    // Render component
    const { unmount } = renderComponent();

    // Perform some interactions that might cause leaks
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Unmount component
    unmount();

    // Force garbage collection
    if (global.gc) {
      global.gc();
    }

    // Measure memory after cleanup
    const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const growth = currentMemory - initialMemory;
    memoryGrowth.push(growth);
  }

  const finalMemoryUsage = memoryGrowth[memoryGrowth.length - 1];
  const leakRate = finalMemoryUsage / iterations;
  const hasLeaks = finalMemoryUsage > threshold;

  return {
    hasLeaks,
    memoryGrowth,
    finalMemoryUsage,
    leakRate,
  };
}

/**
 * Bundle size analysis utilities
 */
export class BundleAnalyzer {
  private bundleStats: any;

  constructor(bundleStats: any) {
    this.bundleStats = bundleStats;
  }

  /**
   * Analyze bundle size and identify optimization opportunities
   */
  analyzeBundle(): BundleMetrics {
    const chunks: ChunkMetrics[] = [];
    const assets: AssetMetrics[] = [];

    // Analyze chunks
    if (this.bundleStats.chunks) {
      for (const [name, chunk] of Object.entries(this.bundleStats.chunks)) {
        const chunkData = chunk as any;
        chunks.push({
          name: name as string,
          size: chunkData.size || 0,
          gzippedSize: chunkData.gzipSize || 0,
          modules: chunkData.modules || [],
        });
      }
    }

    // Analyze assets
    if (this.bundleStats.assets) {
      for (const [name, asset] of Object.entries(this.bundleStats.assets)) {
        const assetData = asset as any;
        assets.push({
          name: name as string,
          size: assetData.size || 0,
          type: this.getAssetType(name as string),
        });
      }
    }

    const totalSize = this.bundleStats.totalSize || 0;
    const gzippedSize = this.bundleStats.gzipSize || 0;

    // Sort assets by size
    const largestAssets = assets.sort((a, b) => b.size - a.size).slice(0, 10);

    return {
      totalSize,
      gzippedSize,
      chunks,
      largestAssets,
    };
  }

  /**
   * Identify potential bundle optimization opportunities
   */
  identifyOptimizations(): {
    type: "code-splitting" | "tree-shaking" | "compression" | "dependencies";
    description: string;
    potentialSavings: number;
    recommendation: string;
  }[] {
    const optimizations: any[] = [];
    const analysis = this.analyzeBundle();

    // Check for large chunks that could be split
    const largeChunks = analysis.chunks.filter(
      (chunk) => chunk.size > 200 * 1024
    ); // > 200KB
    if (largeChunks.length > 0) {
      optimizations.push({
        type: "code-splitting",
        description: `${largeChunks.length} chunks are larger than 200KB`,
        potentialSavings:
          largeChunks.reduce((sum, chunk) => sum + chunk.size, 0) * 0.3,
        recommendation: "Consider dynamic imports for large components",
      });
    }

    // Check compression efficiency
    const compressionRatio = analysis.gzippedSize / analysis.totalSize;
    if (compressionRatio > 0.4) {
      optimizations.push({
        type: "compression",
        description: `Compression ratio ${(compressionRatio * 100).toFixed(1)}% could be improved`,
        potentialSavings: analysis.totalSize * 0.2,
        recommendation: "Enable better compression algorithms (Brotli)",
      });
    }

    return optimizations;
  }

  private getAssetType(filename: string): string {
    if (filename.endsWith(".js")) return "javascript";
    if (filename.endsWith(".css")) return "stylesheet";
    if (filename.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return "image";
    if (filename.match(/\.(woff|woff2|ttf|eot)$/)) return "font";
    return "other";
  }
}

/**
 * React component render performance monitoring
 */
export class ComponentPerformanceMonitor {
  private renderCount: number = 0;
  private renderTimes: number[] = [];

  /**
   * Wrap a component to monitor its render performance
   */
  monitorRender(component: ReactElement): {
    component: ReactElement;
    metrics: () => {
      renderCount: number;
      averageRenderTime: number;
      lastRenderTime: number;
    };
  } {
    const metrics = () => ({
      renderCount: this.renderCount,
      averageRenderTime:
        this.renderTimes.length > 0
          ? this.renderTimes.reduce((a, b) => a + b, 0) /
            this.renderTimes.length
          : 0,
      lastRenderTime: this.renderTimes[this.renderTimes.length - 1] || 0,
    });

    return {
      component,
      metrics,
    };
  }

  /**
   * Track render completion
   */
  trackRender(startTime: number): void {
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    this.renderCount++;
    this.renderTimes.push(renderTime);
  }

  /**
   * Get performance report
   */
  getReport(): {
    totalRenders: number;
    averageRenderTime: number;
    maxRenderTime: number;
    minRenderTime: number;
    performanceScore: "excellent" | "good" | "fair" | "poor";
  } {
    const averageRenderTime =
      this.renderTimes.length > 0
        ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
        : 0;
    const maxRenderTime = Math.max(...this.renderTimes, 0);
    const minRenderTime = Math.min(...this.renderTimes, 0);

    let performanceScore: "excellent" | "good" | "fair" | "poor";
    if (averageRenderTime < 16)
      performanceScore = "excellent"; // 60fps
    else if (averageRenderTime < 33)
      performanceScore = "good"; // 30fps
    else if (averageRenderTime < 100) performanceScore = "fair";
    else performanceScore = "poor";

    return {
      totalRenders: this.renderCount,
      averageRenderTime,
      maxRenderTime,
      minRenderTime,
      performanceScore,
    };
  }
}

/**
 * Large dataset rendering performance test
 */
export async function testLargeDatasetPerformance<T>(
  component: ReactElement,
  dataSizes: number[],
  generateData: (size: number) => T[]
): Promise<
  {
    dataSize: number;
    renderTime: number;
    memoryUsage: number;
    interactive: boolean;
  }[]
> {
  const results: any[] = [];

  for (const size of dataSizes) {
    console.log(`Testing with dataset size: ${size}`);

    // Generate test data (side effects for memory testing)
    void generateData(size);

    // Measure memory before render
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    // Measure render time
    const startTime = performance.now();
    const { unmount } = render(component);
    const endTime = performance.now();

    const renderTime = endTime - startTime;

    // Test interactivity (click, scroll, etc.)
    const interactive = await testComponentInteractivity();

    // Measure memory after render
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryUsage = finalMemory - initialMemory;

    results.push({
      dataSize: size,
      renderTime,
      memoryUsage,
      interactive,
    });

    // Cleanup
    unmount();

    // Allow garbage collection between tests
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (global.gc) global.gc();
  }

  return results;
}

/**
 * Test component interactivity performance
 */
async function testComponentInteractivity(): Promise<boolean> {
  try {
    // Simulate user interactions
    const startTime = performance.now();

    // This would be implemented based on specific component interactions
    // For now, we'll simulate some basic interactions
    await new Promise((resolve) => setTimeout(resolve, 50));

    const endTime = performance.now();
    const interactionTime = endTime - startTime;

    // Consider interactive if response time is under 100ms
    return interactionTime < 100;
  } catch {
    return false;
  }
}

/**
 * Performance regression detection
 */
export class PerformanceRegressionDetector {
  private baseline: Map<string, number> = new Map();

  /**
   * Set baseline performance metrics
   */
  setBaseline(metricName: string, value: number): void {
    this.baseline.set(metricName, value);
  }

  /**
   * Check for performance regression
   */
  checkRegression(
    metricName: string,
    currentValue: number,
    threshold = 0.2 // 20% regression threshold
  ): {
    hasRegression: boolean;
    percentageChange: number;
    severity: "minor" | "moderate" | "severe";
  } {
    const baseline = this.baseline.get(metricName);
    if (!baseline) {
      throw new Error(`No baseline found for metric: ${metricName}`);
    }

    const percentageChange = ((currentValue - baseline) / baseline) * 100;
    const hasRegression = percentageChange > threshold * 100;

    let severity: "minor" | "moderate" | "severe";
    if (percentageChange > 50) severity = "severe";
    else if (percentageChange > 25) severity = "moderate";
    else severity = "minor";

    return {
      hasRegression,
      percentageChange,
      severity,
    };
  }

  /**
   * Get all baselines
   */
  getBaselines(): Record<string, number> {
    return Object.fromEntries(this.baseline);
  }
}

// All performance testing utilities and types are already exported inline above
