/**
 * Performance monitoring and optimization manager for chart rendering
 * Automatically adjusts rendering strategies based on performance metrics
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface PerformanceMetrics {
  fps: number;
  averageRenderTime: number;
  frameTime: number;
  memoryUsage?: number;
  dataPointsRendered: number;
  totalDataPoints: number;
  renderingMethod: 'svg' | 'canvas' | 'hybrid';
}

export interface PerformanceThresholds {
  targetFPS: number;
  maxRenderTime: number;
  maxMemoryUsage: number;
  adaptiveQualityEnabled: boolean;
}

export interface RenderingStrategy {
  method: 'svg' | 'canvas' | 'hybrid';
  lodLevel: 'high' | 'medium' | 'low' | 'pixel';
  enableAntialiasing: boolean;
  enableAnimations: boolean;
  chunkSize: number;
}

/**
 * Performance monitoring system for charts
 */
export class ChartPerformanceMonitor {
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private frameTimeHistory: number[] = [];
  private renderTimeHistory: number[] = [];
  private maxHistorySize = 60;
  private isMonitoring = false;

  startMonitoring(): void {
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.frameTimeHistory = [];
    this.renderTimeHistory = [];
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  startFrame(): number {
    return performance.now();
  }

  endFrame(startTime: number): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    const renderTime = currentTime - startTime;

    // Update frame time history
    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > this.maxHistorySize) {
      this.frameTimeHistory.shift();
    }

    // Update render time history
    this.renderTimeHistory.push(renderTime);
    if (this.renderTimeHistory.length > this.maxHistorySize) {
      this.renderTimeHistory.shift();
    }

    this.frameCount++;
    this.lastFrameTime = currentTime;
  }

  getMetrics(): PerformanceMetrics {
    const avgFrameTime = this.frameTimeHistory.length > 0
      ? this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length
      : 0;

    const avgRenderTime = this.renderTimeHistory.length > 0
      ? this.renderTimeHistory.reduce((a, b) => a + b, 0) / this.renderTimeHistory.length
      : 0;

    const fps = avgFrameTime > 0 ? 1000 / avgFrameTime : 0;

    const memoryUsage = this.getMemoryUsage();

    return {
      fps,
      averageRenderTime: avgRenderTime,
      frameTime: avgFrameTime,
      memoryUsage,
      dataPointsRendered: 0, // To be set by the chart component
      totalDataPoints: 0, // To be set by the chart component
      renderingMethod: 'canvas' // To be updated by the chart component
    };
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return undefined;
  }

  shouldOptimize(thresholds: PerformanceThresholds): boolean {
    const metrics = this.getMetrics();
    return (
      metrics.fps < thresholds.targetFPS ||
      metrics.averageRenderTime > thresholds.maxRenderTime ||
      (metrics.memoryUsage && metrics.memoryUsage > thresholds.maxMemoryUsage)
    );
  }

  getRecommendations(thresholds: PerformanceThresholds): Partial<RenderingStrategy> {
    const metrics = this.getMetrics();
    const recommendations: Partial<RenderingStrategy> = {};

    // FPS issues
    if (metrics.fps < thresholds.targetFPS * 0.8) {
      recommendations.method = 'canvas';
      recommendations.lodLevel = 'medium';
      recommendations.enableAnimations = false;
    } else if (metrics.fps < thresholds.targetFPS * 0.9) {
      recommendations.lodLevel = 'medium';
    }

    // Render time issues
    if (metrics.averageRenderTime > thresholds.maxRenderTime) {
      recommendations.method = 'canvas';
      recommendations.lodLevel = 'low';
      recommendations.enableAntialiasing = false;
    }

    // Memory issues
    if (metrics.memoryUsage && metrics.memoryUsage > thresholds.maxMemoryUsage * 0.8) {
      recommendations.lodLevel = 'pixel';
      recommendations.chunkSize = 1000;
    }

    return recommendations;
  }
}

/**
 * Adaptive rendering strategy manager
 */
export class AdaptiveRenderingManager {
  private currentStrategy: RenderingStrategy;
  private performanceMonitor: ChartPerformanceMonitor;
  private thresholds: PerformanceThresholds;
  private adaptationHistory: Array<{
    timestamp: number;
    strategy: RenderingStrategy;
    metrics: PerformanceMetrics;
    reason: string;
  }> = [];

  constructor(thresholds: PerformanceThresholds) {
    this.thresholds = thresholds;
    this.performanceMonitor = new ChartPerformanceMonitor();
    this.currentStrategy = {
      method: 'svg',
      lodLevel: 'high',
      enableAntialiasing: true,
      enableAnimations: true,
      chunkSize: 10000
    };
  }

  getCurrentStrategy(): RenderingStrategy {
    return { ...this.currentStrategy };
  }

  startAdaptation(): void {
    this.performanceMonitor.startMonitoring();
  }

  stopAdaptation(): void {
    this.performanceMonitor.stopMonitoring();
  }

  adapt(frameStartTime: number, dataPoints: number): boolean {
    this.performanceMonitor.endFrame(frameStartTime);

    if (!this.thresholds.adaptiveQualityEnabled) {
      return false;
    }

    const metrics = this.performanceMonitor.getMetrics();
    metrics.dataPointsRendered = dataPoints;

    const shouldOptimize = this.performanceMonitor.shouldOptimize(this.thresholds);

    if (shouldOptimize) {
      const recommendations = this.performanceMonitor.getRecommendations(this.thresholds);
      const newStrategy = { ...this.currentStrategy, ...recommendations };

      if (this.hasStrategyChanged(newStrategy)) {
        this.recordAdaptation(newStrategy, metrics, 'Performance optimization');
        this.currentStrategy = newStrategy;
        return true;
      }
    }

    // Consider upgrading quality if performance is good
    if (metrics.fps > this.thresholds.targetFPS * 1.2 &&
        metrics.averageRenderTime < this.thresholds.maxRenderTime * 0.5) {

      const upgradeStrategy = this.getUpgradeStrategy();
      if (upgradeStrategy && this.hasStrategyChanged(upgradeStrategy)) {
        this.recordAdaptation(upgradeStrategy, metrics, 'Performance upgrade');
        this.currentStrategy = upgradeStrategy;
        return true;
      }
    }

    return false;
  }

  private hasStrategyChanged(newStrategy: RenderingStrategy): boolean {
    return (
      newStrategy.method !== this.currentStrategy.method ||
      newStrategy.lodLevel !== this.currentStrategy.lodLevel ||
      newStrategy.enableAntialiasing !== this.currentStrategy.enableAntialiasing ||
      newStrategy.enableAnimations !== this.currentStrategy.enableAnimations
    );
  }

  private getUpgradeStrategy(): RenderingStrategy | null {
    // Gradually upgrade quality
    if (this.currentStrategy.method === 'canvas' && this.currentStrategy.lodLevel === 'pixel') {
      return { ...this.currentStrategy, lodLevel: 'low' };
    } else if (this.currentStrategy.lodLevel === 'low') {
      return { ...this.currentStrategy, lodLevel: 'medium' };
    } else if (this.currentStrategy.lodLevel === 'medium') {
      return { ...this.currentStrategy, lodLevel: 'high' };
    } else if (this.currentStrategy.method === 'canvas' && this.currentStrategy.lodLevel === 'high') {
      return { ...this.currentStrategy, method: 'svg' };
    }

    return null;
  }

  private recordAdaptation(strategy: RenderingStrategy, metrics: PerformanceMetrics, reason: string): void {
    this.adaptationHistory.push({
      timestamp: Date.now(),
      strategy: { ...strategy },
      metrics: { ...metrics },
      reason
    });

    // Keep only recent history
    if (this.adaptationHistory.length > 100) {
      this.adaptationHistory.shift();
    }
  }

  getAdaptationHistory(): Array<{
    timestamp: number;
    strategy: RenderingStrategy;
    metrics: PerformanceMetrics;
    reason: string;
  }> {
    return [...this.adaptationHistory];
  }

  getCurrentMetrics(): PerformanceMetrics {
    return this.performanceMonitor.getMetrics();
  }
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitoring(
  dataPointsCount: number,
  thresholds: PerformanceThresholds = {
    targetFPS: 30,
    maxRenderTime: 16.67, // 60fps target
    maxMemoryUsage: 200, // MB
    adaptiveQualityEnabled: true
  }
) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    averageRenderTime: 0,
    frameTime: 0,
    dataPointsRendered: 0,
    totalDataPoints: 0,
    renderingMethod: 'svg'
  });

  const [strategy, setStrategy] = useState<RenderingStrategy>({
    method: 'svg',
    lodLevel: 'high',
    enableAntialiasing: true,
    enableAnimations: true,
    chunkSize: 10000
  });

  const managerRef = useRef<AdaptiveRenderingManager>();
  const renderStartRef = useRef<number>();

  // Initialize adaptive manager
  useEffect(() => {
    managerRef.current = new AdaptiveRenderingManager(thresholds);
    managerRef.current.startAdaptation();

    return () => {
      managerRef.current?.stopAdaptation();
    };
  }, [thresholds]);

  // Start render timing
  const startRender = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // End render timing and check for adaptations
  const endRender = useCallback((renderedPoints: number) => {
    if (!managerRef.current || !renderStartRef.current) return;

    const startTime = renderStartRef.current;
    const didAdapt = managerRef.current.adapt(startTime, renderedPoints);

    if (didAdapt) {
      const newStrategy = managerRef.current.getCurrentStrategy();
      setStrategy(newStrategy);
    }

    const currentMetrics = managerRef.current.getCurrentMetrics();
    currentMetrics.dataPointsRendered = renderedPoints;
    currentMetrics.totalDataPoints = dataPointsCount;
    currentMetrics.renderingMethod = strategy.method;

    setMetrics(currentMetrics);
  }, [dataPointsCount, strategy.method]);

  return {
    metrics,
    strategy,
    startRender,
    endRender,
    shouldUseCanvas: strategy.method !== 'svg',
    lodLevel: strategy.lodLevel,
    enableAntialiasing: strategy.enableAntialiasing,
    enableAnimations: strategy.enableAnimations
  };
}

/**
 * Performance-aware rendering hook that automatically chooses optimal settings
 */
export function usePerformanceAwareRendering(
  dataPointsCount: number,
  chartType: 'scatterplot' | 'line' | 'area' = 'scatterplot'
) {
  const baseThresholds = {
    targetFPS: chartType === 'scatterplot' ? 30 : 45,
    maxRenderTime: chartType === 'scatterplot' ? 20 : 16.67,
    maxMemoryUsage: 300,
    adaptiveQualityEnabled: true
  };

  const performance = usePerformanceMonitoring(dataPointsCount, baseThresholds);

  // Determine optimal rendering method based on data size and performance
  const getOptimalRenderingMethod = useCallback(() => {
    const dataThresholds = {
      scatterplot: 10000,
      line: 5000,
      area: 3000
    };

    const threshold = dataThresholds[chartType];

    if (dataPointsCount > threshold || performance.shouldUseCanvas) {
      return 'canvas';
    }

    return 'svg';
  }, [dataPointsCount, chartType, performance.shouldUseCanvas]);

  // Get optimized canvas configuration
  const getCanvasConfig = useCallback(() => {
    const baseConfig = {
      width: 800,
      height: 600,
      pixelRatio: window.devicePixelRatio || 1,
      enableAntialiasing: performance.enableAntialiasing,
      maxPointsBeforeOptimization: performance.lodLevel === 'high' ? 10000 : 5000
    };

    // Adjust based on LOD level
    switch (performance.lodLevel) {
      case 'pixel':
        return {
          ...baseConfig,
          enableAntialiasing: false,
          maxPointsBeforeOptimization: 1000
        };
      case 'low':
        return {
          ...baseConfig,
          maxPointsBeforeOptimization: 3000
        };
      case 'medium':
        return {
          ...baseConfig,
          maxPointsBeforeOptimization: 7000
        };
      default:
        return baseConfig;
    }
  }, [performance.enableAntialiasing, performance.lodLevel]);

  return {
    renderingMethod: getOptimalRenderingMethod(),
    canvasConfig: getCanvasConfig(),
    lodLevel: performance.lodLevel,
    enableAnimations: performance.enableAnimations,
    performanceMetrics: performance.metrics,
    startRender: performance.startRender,
    endRender: performance.endRender
  };
}