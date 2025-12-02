/**
 * High-performance canvas-based chart rendering utilities
 * Optimized for large datasets (>10k points)
 */

import { useEffect, useRef, useCallback } from "react";

export interface Point {
  x: number;
  y: number;
  color?: string;
  size?: number;
  key?: string;
}

export interface CanvasRendererConfig {
  width: number;
  height: number;
  pixelRatio: number;
  enableAntialiasing: boolean;
  enableVertexOptimization: boolean;
  maxPointsBeforeOptimization: number;
}

export interface RenderBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/**
 * Optimized canvas renderer for scatter plots and large datasets
 */
export class CanvasChartRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: CanvasRendererConfig;
  private offscreenCanvas: any | null = null;
  private offscreenCtx: any | null = null;

  constructor(canvas: HTMLCanvasElement, config: CanvasRendererConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;
    this.setupCanvas();
  }

  private setupCanvas() {
    const { width, height, pixelRatio } = this.config;

    // Set actual canvas size for high DPI displays
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;

    // Scale CSS size for high DPI displays
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Scale context for high DPI displays
    this.ctx.scale(pixelRatio, pixelRatio);

    // Enable optimizations
    if (this.config.enableAntialiasing) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }

    // Create offscreen canvas for double buffering
    if (typeof OffscreenCanvas !== 'undefined') {
      const offscreen = new OffscreenCanvas(width * pixelRatio, height * pixelRatio);
      this.offscreenCanvas = offscreen as any;
      this.offscreenCtx = offscreen.getContext('2d')! as any;
      this.offscreenCtx.scale(pixelRatio, pixelRatio);
    }
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    if (this.offscreenCtx) {
      this.offscreenCtx.clearRect(0, 0, this.config.width, this.config.height);
    }
  }

  /**
   * Render points with automatic optimization based on dataset size
   */
  renderPoints(points: Point[], bounds?: RenderBounds) {
    if (points.length === 0) return;

    // Use different rendering strategies based on data size
    if (points.length > this.config.maxPointsBeforeOptimization) {
      this.renderPointsOptimized(points, bounds);
    } else {
      this.renderPointsDirect(points, bounds);
    }
  }

  /**
   * Direct point rendering for smaller datasets
   */
  private renderPointsDirect(points: Point[], bounds?: RenderBounds) {
    const ctx = this.getActiveContext();

    points.forEach(point => {
      if (bounds && !this.isPointInBounds(point, bounds)) return;

      ctx.fillStyle = point.color || '#000';
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size || 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Optimized rendering for large datasets using various techniques
   */
  private renderPointsOptimized(points: Point[], bounds?: RenderBounds) {
    const ctx = this.getActiveContext();

    // Group points by color to reduce state changes
    const pointsByColor = this.groupPointsByColor(points, bounds);

    // Render each color group
    pointsByColor.forEach((colorPoints, color) => {
      if (colorPoints.length === 0) return;

      ctx.fillStyle = color;

      // Use different strategies based on point count
      if (colorPoints.length > 50000) {
        this.renderPointsAsPixelated(ctx, colorPoints);
      } else if (colorPoints.length > 10000) {
        this.renderPointsWithLOD(ctx, colorPoints);
      } else {
        this.renderPointsBatched(ctx, colorPoints);
      }
    });
  }

  /**
   * Group points by color to reduce context switches
   */
  private groupPointsByColor(points: Point[], bounds?: RenderBounds): Map<string, Point[]> {
    const grouped = new Map<string, Point[]>();

    for (const point of points) {
      if (bounds && !this.isPointInBounds(point, bounds)) continue;

      const color = point.color || '#000';
      if (!grouped.has(color)) {
        grouped.set(color, []);
      }
      grouped.get(color)!.push(point);
    }

    return grouped;
  }

  /**
   * Batch rendering with path optimization
   */
  private renderPointsBatched(ctx: CanvasRenderingContext2D, points: Point[]) {
    const batchSize = 1000;

    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);

      batch.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size || 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  /**
   * Level-of-detail rendering for very large datasets
   */
  private renderPointsWithLOD(ctx: CanvasRenderingContext2D, points: Point[]) {
    // Calculate optimal point size based on zoom and density
    const baseSize = 2;
    const density = points.length / (this.config.width * this.config.height);
    const lodFactor = Math.max(0.5, Math.min(1, 1 / Math.sqrt(density * 1000)));
    const pointSize = baseSize * lodFactor;

    // Create a spatial grid for culling
    const gridSize = Math.max(10, pointSize * 4);
    const grid = this.createSpatialGrid(points, gridSize);

    // Render one point per grid cell for overview
    grid.forEach(cellPoints => {
      if (cellPoints.length > 0) {
        // Use alpha blending to show density
        const alpha = Math.min(0.8, 0.1 + cellPoints.length * 0.05);
        ctx.globalAlpha = alpha;

        const representativePoint = cellPoints[Math.floor(cellPoints.length / 2)];
        ctx.beginPath();
        ctx.arc(representativePoint.x, representativePoint.y, pointSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
  }

  /**
   * Pixelated rendering for extremely large datasets (>50k points)
   */
  private renderPointsAsPixelated(ctx: CanvasRenderingContext2D, points: Point[]) {
    const imageData = ctx.createImageData(this.config.width * this.config.pixelRatio, this.config.height * this.config.pixelRatio);
    const data = imageData.data;
    const pixelRatio = this.config.pixelRatio;

    points.forEach(point => {
      const x = Math.floor(point.x * pixelRatio);
      const y = Math.floor(point.y * pixelRatio);
      const color = this.hexToRgb(point.color || '#000');

      if (color) {
        const index = (y * imageData.width + x) * 4;
        data[index] = color.r;     // Red
        data[index + 1] = color.g; // Green
        data[index + 2] = color.b; // Blue
        data[index + 3] = 255;     // Alpha
      }
    });

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Create spatial grid for efficient culling
   */
  private createSpatialGrid(points: Point[], cellSize: number): Map<string, Point[]> {
    const grid = new Map<string, Point[]>();

    points.forEach(point => {
      const gridX = Math.floor(point.x / cellSize);
      const gridY = Math.floor(point.y / cellSize);
      const key = `${gridX},${gridY}`;

      if (!grid.has(key)) {
        grid.set(key, []);
      }
      grid.get(key)!.push(point);
    });

    return grid;
  }

  /**
   * Check if point is within visible bounds
   */
  private isPointInBounds(point: Point, bounds: RenderBounds): boolean {
    return point.x >= bounds.xMin &&
           point.x <= bounds.xMax &&
           point.y >= bounds.yMin &&
           point.y <= bounds.yMax;
  }

  /**
   * Get active context (offscreen if available, otherwise main)
   */
  private getActiveContext(): CanvasRenderingContext2D {
    return this.offscreenCtx || this.ctx;
  }

  /**
   * Expose getActiveContext for external use
   */
  public getActiveContextPublic(): any {
    return this.offscreenCtx || this.ctx;
  }

  /**
   * Copy offscreen canvas to main canvas
   */
  present() {
    if (this.offscreenCanvas && this.offscreenCtx) {
      this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Update canvas configuration
   */
  updateConfig(config: Partial<CanvasRendererConfig>) {
    this.config = { ...this.config, ...config };
    this.setupCanvas();
  }

  /**
   * Dispose of resources
   */
  dispose() {
    this.offscreenCanvas = null;
    this.offscreenCtx = null;
  }
}

/**
 * React hook for canvas-based chart rendering
 */
export function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: Partial<CanvasRendererConfig> = {}
) {
  const rendererRef = useRef<CanvasChartRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const defaultConfig: CanvasRendererConfig = {
    width: 800,
    height: 600,
    pixelRatio: window.devicePixelRatio || 1,
    enableAntialiasing: true,
    enableVertexOptimization: true,
    maxPointsBeforeOptimization: 10000,
    ...config
  };

  const initializeRenderer = useCallback(() => {
    if (!canvasRef.current) return;

    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    rendererRef.current = new CanvasChartRenderer(canvasRef.current, defaultConfig);
  }, [canvasRef, defaultConfig]);

  const renderPoints = useCallback((points: Point[], bounds?: RenderBounds) => {
    if (!rendererRef.current) return;

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Schedule rendering on next frame
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!rendererRef.current) return;

      rendererRef.current.clear();
      rendererRef.current.renderPoints(points, bounds);
      rendererRef.current.present();

      animationFrameRef.current = null;
    });
  }, []);

  // Initialize renderer on mount
  useEffect(() => {
    initializeRenderer();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initializeRenderer]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current && canvasRef.current) {
        const newConfig = {
          ...defaultConfig,
          pixelRatio: window.devicePixelRatio || 1
        };
        rendererRef.current.updateConfig(newConfig);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultConfig, canvasRef]);

  return {
    renderPoints,
    clear: () => rendererRef.current?.clear(),
    renderer: rendererRef.current
  };
}