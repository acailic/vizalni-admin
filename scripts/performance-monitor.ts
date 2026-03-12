/**
 * Performance Monitoring Suite
 * Real-time performance tracking and optimization validation
 */

import { performance, PerformanceObserver } from "perf_hooks";

interface BundleAnalysis {
  totalSize: number;
  chunkCount: number;
  largestChunk: number;
  chunks: ChunkInfo[];
}

interface ChunkInfo {
  name: string;
  size: number;
  path: string;
  modules: string[];
}

interface PerformanceMetrics {
  bundleSize: BundleAnalysis;
  renderTime: Map<string, number>;
  memoryUsage: MemoryInfo[];
  loadTimes: LoadTimeMetrics;
}

interface MemoryInfo {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

interface LoadTimeMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  cumulativeLayoutShift: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.metrics = {
      bundleSize: { totalSize: 0, chunkCount: 0, largestChunk: 0, chunks: [] },
      renderTime: new Map(),
      memoryUsage: [],
      loadTimes: {} as LoadTimeMetrics,
    };
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Bundle size analysis
  analyzeBundle(): BundleAnalysis {
    const stats = this.getWebpackStats();
    if (!stats) {
      throw new Error("Webpack stats not available");
    }

    const chunks = this.extractChunkInfo(stats);
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const largestChunk = Math.max(...chunks.map((chunk) => chunk.size));

    this.metrics.bundleSize = {
      totalSize,
      chunkCount: chunks.length,
      largestChunk,
      chunks,
    };

    return this.metrics.bundleSize;
  }

  // Render time measurement decorator
  static measureRenderTime(componentName: string) {
    return (
      target: any,
      propertyName: string,
      descriptor: PropertyDescriptor
    ) => {
      const originalMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();

        const renderTime = end - start;
        PerformanceMonitor.getInstance().trackRenderTime(
          componentName,
          renderTime
        );

        if (renderTime > 100) {
          // Alert on slow renders
          console.warn(
            `🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`
          );
        }

        return result;
      };
    };
  }

  private trackRenderTime(componentName: string, time: number): void {
    const existing = this.metrics.renderTime.get(componentName) || 0;
    this.metrics.renderTime.set(componentName, Math.max(existing, time));
  }

  // Memory usage tracking
  startMemoryTracking(interval: number = 1000): void {
    const tracker = () => {
      const usage = process.memoryUsage();
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        heapUsed: usage.heapUsed,
        heapTotal: usage.heapTotal,
        external: usage.external,
        rss: usage.rss,
      });

      // Alert on memory leaks
      if (usage.heapUsed > 100 * 1024 * 1024) {
        // 100MB
        console.warn(
          `🧠 High memory usage: ${(usage.heapUsed / 1024 / 1024).toFixed(2)}MB`
        );
      }
    };

    setInterval(tracker, interval);
    tracker(); // Initial measurement
  }

  // Bundle loading performance
  trackBundleLoading(): void {
    if (typeof window !== "undefined") {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes("chunk") || entry.name.includes("bundle")) {
            const resource = entry as PerformanceResourceTiming;
            console.log(`📦 Bundle loaded: ${resource.name}`);
            console.log(`   Size: ${resource.transferSize} bytes`);
            console.log(`   Time: ${resource.duration}ms`);
            console.log(`   Protocol: ${resource.nextHopProtocol}`);
          }
        }
      });

      observer.observe({ entryTypes: ["resource"] });
      this.observers.push(observer);
    }
  }

  // Web Vitals tracking
  trackWebVitals(): void {
    if (typeof window !== "undefined") {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            this.metrics.loadTimes.firstContentfulPaint = entry.startTime;
            console.log(`🎨 FCP: ${entry.startTime.toFixed(2)}ms`);
          }
        }
      });

      observer.observe({ entryTypes: ["paint"] as any });
      this.observers.push(observer);

      // Largest Contentful Paint
      let lcpEntry: PerformanceEntry | undefined;
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          lcpEntry = lastEntry;
          this.metrics.loadTimes.largestContentfulPaint = lcpEntry.startTime;
          console.log(`🖼️ LCP: ${lcpEntry.startTime.toFixed(2)}ms`);
        }
      });

      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] as any });
      this.observers.push(lcpObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.loadTimes.cumulativeLayoutShift = clsValue;
        console.log(`📐 CLS: ${clsValue.toFixed(4)}`);
      });

      clsObserver.observe({ entryTypes: ["layout-shift"] as any });
      this.observers.push(clsObserver);
    }
  }

  // Generate performance report
  generateReport(): PerformanceReport {
    const report = new PerformanceReport(this.metrics);
    return report;
  }

  // Validate against performance budgets
  validateBudgets(): BudgetValidation {
    const BUDGETS = {
      maxChunkSize: 250000, // 250KB
      maxBundleSize: 5000000, // 5MB
      maxRenderTime: 100, // 100ms
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
    };

    const validation: BudgetValidation = {
      passed: true,
      violations: [],
    };

    // Check chunk sizes
    for (const chunk of this.metrics.bundleSize.chunks) {
      if (chunk.size > BUDGETS.maxChunkSize) {
        validation.passed = false;
        validation.violations.push({
          type: "chunk-size",
          component: chunk.name,
          current: chunk.size,
          budget: BUDGETS.maxChunkSize,
        });
      }
    }

    // Check total bundle size
    if (this.metrics.bundleSize.totalSize > BUDGETS.maxBundleSize) {
      validation.passed = false;
      validation.violations.push({
        type: "bundle-size",
        component: "total",
        current: this.metrics.bundleSize.totalSize,
        budget: BUDGETS.maxBundleSize,
      });
    }

    // Check render times
    for (const [component, time] of this.metrics.renderTime.entries()) {
      if (time > BUDGETS.maxRenderTime) {
        validation.passed = false;
        validation.violations.push({
          type: "render-time",
          component,
          current: time,
          budget: BUDGETS.maxRenderTime,
        });
      }
    }

    return validation;
  }

  private getWebpackStats(): any {
    try {
      // In a real implementation, this would read from webpack-stats.json
      // For now, return mock data
      return {
        chunks: [],
        assets: [],
      };
    } catch (error) {
      console.warn("Could not load webpack stats:", error);
      return null;
    }
  }

  private extractChunkInfo(stats: any): ChunkInfo[] {
    // Extract chunk information from webpack stats
    return [];
  }

  // Cleanup observers
  cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

export class PerformanceReport {
  constructor(private metrics: PerformanceMetrics) {}

  generateMarkdown(): string {
    const { bundleSize, renderTime, memoryUsage, loadTimes } = this.metrics;

    return `
# Performance Report

## Bundle Analysis
- **Total Size**: ${this.formatBytes(bundleSize.totalSize)}
- **Chunk Count**: ${bundleSize.chunkCount}
- **Largest Chunk**: ${this.formatBytes(bundleSize.largestChunk)}

### Top 10 Largest Chunks
${bundleSize.chunks
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .map((chunk, i) => `${i + 1}. ${chunk.name}: ${this.formatBytes(chunk.size)}`)
  .join("\n")}

## Render Performance
### Slowest Components
${Array.from(renderTime.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([component, time], i) => `${i + 1}. ${component}: ${time.toFixed(2)}ms`)
  .join("\n")}

## Memory Usage
- **Peak Memory**: ${this.formatBytes(Math.max(...memoryUsage.map((m) => m.heapUsed)))}
- **Current Memory**: ${memoryUsage.length > 0 ? this.formatBytes(memoryUsage[memoryUsage.length - 1].heapUsed) : "N/A"}

## Web Vitals
- **First Contentful Paint**: ${loadTimes.firstContentfulPaint.toFixed(2)}ms
- **Largest Contentful Paint**: ${loadTimes.largestContentfulPaint.toFixed(2)}ms
- **Cumulative Layout Shift**: ${loadTimes.cumulativeLayoutShift.toFixed(4)}
    `.trim();
  }

  private formatBytes(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }
}

interface BudgetViolation {
  type: "chunk-size" | "bundle-size" | "render-time" | "memory-usage";
  component: string;
  current: number;
  budget: number;
}

interface BudgetValidation {
  passed: boolean;
  violations: BudgetViolation[];
}

// Usage example:
export const initializePerformanceMonitoring = () => {
  const monitor = PerformanceMonitor.getInstance();

  // Start monitoring
  monitor.startMemoryTracking();
  monitor.trackBundleLoading();
  monitor.trackWebVitals();

  // Analyze bundle size
  const bundleAnalysis = monitor.analyzeBundle();
  console.log("📊 Bundle Analysis:", bundleAnalysis);

  // Validate budgets
  const validation = monitor.validateBudgets();
  if (!validation.passed) {
    console.error("❌ Performance budget violations:", validation.violations);
  }

  return monitor;
};
