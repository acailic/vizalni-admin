/**
 * Data virtualization and spatial indexing for large datasets
 * Enables efficient rendering of datasets with millions of points
 */

import { useMemo, useCallback } from "react";

export interface DataPoint {
  x: number;
  y: number;
  value?: number;
  color?: string;
  size?: number;
  key?: string;
}

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

export interface SpatialIndex {
  getPointsInBounds(bounds: Viewport): DataPoint[];
  getNearestPoints(x: number, y: number, radius: number, maxPoints?: number): DataPoint[];
  getTotalPointCount(): number;
}

/**
 * Quadtree-based spatial index for fast spatial queries
 */
export class QuadTreeIndex implements SpatialIndex {
  private quadtree: any; // Using any to avoid external quadtree library dependency
  private points: DataPoint[];
  private bounds: { minX: number; minY: number; maxX: number; maxY: number };

  constructor(points: DataPoint[]) {
    this.points = points;
    this.bounds = this.calculateBounds(points);
    this.buildIndex();
  }

  private calculateBounds(points: DataPoint[]) {
    if (points.length === 0) {
      return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    points.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });

    return { minX, minY, maxX, maxY };
  }

  private buildIndex() {
    // Simple grid-based spatial index implementation
    // In production, replace with a proper quadtree library like rbush or flatbush
    const gridSize = 50;
    const cols = Math.ceil((this.bounds.maxX - this.bounds.minX) / gridSize);
    const rows = Math.ceil((this.bounds.maxY - this.bounds.minY) / gridSize);
    const grid: DataPoint[][] = Array(rows * cols).fill(null).map(() => []);

    this.points.forEach(point => {
      const col = Math.floor((point.x - this.bounds.minX) / gridSize);
      const row = Math.floor((point.y - this.bounds.minY) / gridSize);
      const index = row * cols + col;
      if (index >= 0 && index < grid.length) {
        grid[index].push(point);
      }
    });

    this.quadtree = { grid, gridSize, cols, rows };
  }

  getPointsInBounds(viewport: Viewport): DataPoint[] {
    const { grid, gridSize, cols, rows } = this.quadtree;
    const result: DataPoint[] = [];

    // Calculate grid cells that intersect with viewport
    const startCol = Math.max(0, Math.floor((viewport.x - this.bounds.minX) / gridSize));
    const endCol = Math.min(cols - 1, Math.floor((viewport.x + viewport.width - this.bounds.minX) / gridSize));
    const startRow = Math.max(0, Math.floor((viewport.y - this.bounds.minY) / gridSize));
    const endRow = Math.min(rows - 1, Math.floor((viewport.y + viewport.height - this.bounds.minY) / gridSize));

    // Collect points from relevant cells
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const index = row * cols + col;
        if (index >= 0 && index < grid.length) {
          const cellPoints = grid[index];
          // Filter points that are actually within viewport
          cellPoints.forEach(point => {
            if (point.x >= viewport.x &&
                point.x <= viewport.x + viewport.width &&
                point.y >= viewport.y &&
                point.y <= viewport.y + viewport.height) {
              result.push(point);
            }
          });
        }
      }
    }

    return result;
  }

  getNearestPoints(x: number, y: number, radius: number, maxPoints = 10): DataPoint[] {
    const viewport: Viewport = {
      x: x - radius,
      y: y - radius,
      width: radius * 2,
      height: radius * 2,
      scale: 1
    };

    const candidates = this.getPointsInBounds(viewport);

    // Calculate distances and sort
    return candidates
      .map(point => ({
        ...point,
        distance: Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2))
      }))
      .filter(point => point.distance <= radius)
      .sort((a, b) => (a as any).distance - (b as any).distance)
      .slice(0, maxPoints)
      .map(({ distance, ...point }) => point);
  }

  getTotalPointCount(): number {
    return this.points.length;
  }
}

/**
 * Level-of-detail (LOD) manager for adaptive detail based on zoom and scale
 */
export class LODManager {
  private readonly maxDetailPoints = 1000;
  private readonly mediumDetailPoints = 5000;
  private readonly lowDetailPoints = 20000;

  getDetailLevel(viewport: Viewport, totalPoints: number): 'high' | 'medium' | 'low' | 'pixel' {
    const viewportArea = viewport.width * viewport.height;
    const pointDensity = totalPoints / viewportArea;

    if (totalPoints <= this.maxDetailPoints) {
      return 'high';
    } else if (totalPoints <= this.mediumDetailPoints) {
      return pointDensity < 0.001 ? 'medium' : 'low';
    } else if (totalPoints <= this.lowDetailPoints) {
      return pointDensity < 0.0001 ? 'medium' : 'low';
    } else {
      return 'pixel';
    }
  }

  getOptimalPointSize(viewport: Viewport, totalPoints: number): number {
    const detailLevel = this.getDetailLevel(viewport, totalPoints);

    switch (detailLevel) {
      case 'high': return 4;
      case 'medium': return 3;
      case 'low': return 2;
      case 'pixel': return 1;
      default: return 2;
    }
  }

  shouldSkipPoint(currentIndex: number, totalPoints: number, detailLevel: string): boolean {
    switch (detailLevel) {
      case 'high': return false;
      case 'medium': return currentIndex % 2 !== 0;
      case 'low': return currentIndex % 4 !== 0;
      case 'pixel': return currentIndex % 8 !== 0;
      default: return false;
    }
  }
}

/**
 * Progressive data loader for handling massive datasets
 */
export class ProgressiveDataLoader {
  private chunkSize: number;
  private loadDelay: number;
  private loadingPromises: Map<string, Promise<DataPoint[]>> = new Map();

  constructor(chunkSize = 10000, loadDelay = 16) {
    this.chunkSize = chunkSize;
    this.loadDelay = loadDelay;
  }

  async loadDataInChunks(
    dataSource: () => Promise<DataPoint[]>,
    onChunkLoaded?: (chunk: DataPoint[], progress: number) => void
  ): Promise<DataPoint[]> {
    const allData: DataPoint[] = [];
    const data = await dataSource();
    const totalChunks = Math.ceil(data.length / this.chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize, data.length);
      const chunk = data.slice(start, end);

      allData.push(...chunk);

      if (onChunkLoaded) {
        onChunkLoaded(chunk, (i + 1) / totalChunks);
      }

      // Allow UI to breathe between chunks
      if (i < totalChunks - 1) {
        await new Promise(resolve => setTimeout(resolve, this.loadDelay));
      }
    }

    return allData;
  }

  preloadData(dataKey: string, dataSource: () => Promise<DataPoint[]>): Promise<DataPoint[]> {
    if (this.loadingPromises.has(dataKey)) {
      return this.loadingPromises.get(dataKey)!;
    }

    const promise = this.loadDataInChunks(dataSource);
    this.loadingPromises.set(dataKey, promise);

    return promise;
  }

  clearCache(): void {
    this.loadingPromises.clear();
  }
}

/**
 * React hook for data virtualization
 */
export function useDataVirtualization(
  data: DataPoint[],
  viewport: Viewport,
  options: {
    enableLOD?: boolean;
    enableSpatialIndex?: boolean;
    spatialIndexThreshold?: number;
  } = {}
) {
  const {
    enableLOD = true,
    enableSpatialIndex = true,
    spatialIndexThreshold = 10000
  } = options;

  const spatialIndex = useMemo(() => {
    if (enableSpatialIndex && data.length >= spatialIndexThreshold) {
      return new QuadTreeIndex(data);
    }
    return null;
  }, [data, enableSpatialIndex, spatialIndexThreshold]);

  const lodManager = useMemo(() => {
    return enableLOD ? new LODManager() : null;
  }, [enableLOD]);

  const getVisiblePoints = useCallback(() => {
    if (spatialIndex) {
      return spatialIndex.getPointsInBounds(viewport);
    }

    // Fallback to simple filtering
    return data.filter(point =>
      point.x >= viewport.x &&
      point.x <= viewport.x + viewport.width &&
      point.y >= viewport.y &&
      point.y <= viewport.y + viewport.height
    );
  }, [data, spatialIndex, viewport]);

  const getOptimizedRenderData = useCallback(() => {
    const visiblePoints = getVisiblePoints();

    if (!lodManager) {
      return visiblePoints;
    }

    const detailLevel = lodManager.getDetailLevel(viewport, data.length);
    const optimalPointSize = lodManager.getOptimalPointSize(viewport, data.length);

    return visiblePoints
      .filter((_, index) => !lodManager.shouldSkipPoint(index, visiblePoints.length, detailLevel))
      .map(point => ({
        ...point,
        size: optimalPointSize
      }));
  }, [getVisiblePoints, lodManager, viewport, data.length]);

  const getNearestPoints = useCallback((x: number, y: number, radius: number, maxPoints?: number) => {
    if (spatialIndex) {
      return spatialIndex.getNearestPoints(x, y, radius, maxPoints);
    }

    // Fallback to linear search
    return data
      .map(point => ({
        ...point,
        distance: Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2))
      }))
      .filter(point => point.distance <= radius)
      .sort((a, b) => (a as any).distance - (b as any).distance)
      .slice(0, maxPoints || 10)
      .map(({ distance, ...point }) => point);
  }, [data, spatialIndex]);

  return {
    visiblePoints: getVisiblePoints(),
    renderData: getOptimizedRenderData(),
    getNearestPoints,
    totalPoints: data.length,
    spatialIndex: spatialIndex?.getTotalPointCount() || data.length
  };
}

/**
 * Memory-efficient data chunker for large datasets
 */
export function useDataChunker<T>(data: T[], chunkSize = 10000) {
  return useMemo(() => {
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  }, [data, chunkSize]);
}

/**
 * Performance monitor for chart rendering
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private renderTimes: number[] = [];

  startFrame(): void {
    this.lastTime = performance.now();
  }

  endFrame(): void {
    const renderTime = performance.now() - this.lastTime;
    this.renderTimes.push(renderTime);

    // Keep only last 60 frame times
    if (this.renderTimes.length > 60) {
      this.renderTimes.shift();
    }

    this.frameCount++;

    // Update FPS every second
    if (this.frameCount % 60 === 0) {
      const avgRenderTime = this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
      this.fps = 1000 / avgRenderTime;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  getAverageRenderTime(): number {
    if (this.renderTimes.length === 0) return 0;
    return this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
  }

  getMetrics() {
    return {
      fps: this.getFPS(),
      averageRenderTime: this.getAverageRenderTime(),
      frameCount: this.frameCount
    };
  }
}