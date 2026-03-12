/**
 * Memory Manager
 *
 * Monitors and manages memory usage to prevent browser crashes
 * with large datasets. Implements automatic cleanup and warnings.
 */

export interface MemoryStats {
  /** Current memory usage in bytes */
  used: number;
  /** Memory limit in bytes */
  limit: number;
  /** Usage percentage */
  usagePercent: number;
  /** Number of tracked objects */
  trackedObjects: number;
  /** Estimated available memory */
  available: number;
}

export interface MemoryOptions {
  /** Maximum memory limit in bytes (default: 500MB) */
  maxMemory?: number;
  /** Warning threshold percentage (default: 80%) */
  warningThreshold?: number;
  /** Enable automatic cleanup */
  autoCleanup?: boolean;
  /** Callback when memory warning is triggered */
  onWarning?: (stats: MemoryStats) => void;
  /** Callback when memory limit is exceeded */
  onLimitExceeded?: (stats: MemoryStats) => void;
}

interface TrackedObject {
  id: string;
  data: any;
  size: number;
  timestamp: number;
  priority: number;
}

/**
 * Memory Manager Class
 */
export class MemoryManager {
  private maxMemory: number;
  private warningThreshold: number;
  private autoCleanup: boolean;
  private onWarning?: (stats: MemoryStats) => void;
  private onLimitExceeded?: (stats: MemoryStats) => void;

  private trackedObjects: Map<string, TrackedObject> = new Map();
  private currentUsage = 0;

  constructor(options: MemoryOptions = {}) {
    this.maxMemory = options.maxMemory || 500 * 1024 * 1024; // 500MB default
    this.warningThreshold = options.warningThreshold || 0.8; // 80%
    this.autoCleanup = options.autoCleanup !== false;
    this.onWarning = options.onWarning;
    this.onLimitExceeded = options.onLimitExceeded;
  }

  /**
   * Track an object in memory
   */
  track(id: string, data: any, priority = 0): boolean {
    const size = this.estimateSize(data);

    // Check if adding this would exceed limit
    if (this.currentUsage + size > this.maxMemory) {
      if (this.autoCleanup) {
        this.cleanup(size);
      } else {
        this.onLimitExceeded?.(this.getStats());
        return false;
      }
    }

    // Remove existing if present
    if (this.trackedObjects.has(id)) {
      this.untrack(id);
    }

    // Add new object
    this.trackedObjects.set(id, {
      id,
      data,
      size,
      timestamp: Date.now(),
      priority,
    });

    this.currentUsage += size;

    // Check thresholds
    this.checkThresholds();

    return true;
  }

  /**
   * Untrack an object
   */
  untrack(id: string): boolean {
    const obj = this.trackedObjects.get(id);
    if (!obj) return false;

    this.trackedObjects.delete(id);
    this.currentUsage -= obj.size;

    return true;
  }

  /**
   * Get tracked object
   */
  get<T = any>(id: string): T | null {
    const obj = this.trackedObjects.get(id);
    return obj ? obj.data : null;
  }

  /**
   * Check if object is tracked
   */
  has(id: string): boolean {
    return this.trackedObjects.has(id);
  }

  /**
   * Clear all tracked objects
   */
  clear(): void {
    this.trackedObjects.clear();
    this.currentUsage = 0;
  }

  /**
   * Cleanup old/low-priority objects to free memory
   */
  private cleanup(requiredSpace: number): void {
    // Sort by priority (low first) and age (old first)
    const objects = Array.from(this.trackedObjects.values());
    objects.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority; // Lower priority first
      }
      return a.timestamp - b.timestamp; // Older first
    });

    let freedSpace = 0;

    for (const obj of objects) {
      if (freedSpace >= requiredSpace) break;

      this.untrack(obj.id);
      freedSpace += obj.size;
    }
  }

  /**
   * Check memory thresholds and trigger callbacks
   */
  private checkThresholds(): void {
    const usagePercent = this.currentUsage / this.maxMemory;

    if (usagePercent >= 1.0) {
      this.onLimitExceeded?.(this.getStats());
    } else if (usagePercent >= this.warningThreshold) {
      this.onWarning?.(this.getStats());
    }
  }

  /**
   * Estimate size of data in bytes
   */
  private estimateSize(data: any): number {
    if (data === null || data === undefined) return 0;

    // For primitives
    if (typeof data === 'boolean') return 4;
    if (typeof data === 'number') return 8;
    if (typeof data === 'string') return data.length * 2; // UTF-16

    // For arrays
    if (Array.isArray(data)) {
      return data.reduce((sum, item) => sum + this.estimateSize(item), 0);
    }

    // For objects
    if (typeof data === 'object') {
      try {
        const json = JSON.stringify(data);
        return new Blob([json]).size;
      } catch {
        // Fallback for circular references
        return Object.keys(data).reduce(
          (sum, key) => sum + key.length * 2 + this.estimateSize(data[key]),
          0
        );
      }
    }

    return 0;
  }

  /**
   * Get current memory statistics
   */
  getStats(): MemoryStats {
    return {
      used: this.currentUsage,
      limit: this.maxMemory,
      usagePercent: (this.currentUsage / this.maxMemory) * 100,
      trackedObjects: this.trackedObjects.size,
      available: this.maxMemory - this.currentUsage,
    };
  }

  /**
   * Get list of tracked object IDs
   */
  getTrackedIds(): string[] {
    return Array.from(this.trackedObjects.keys());
  }

  /**
   * Update memory limit
   */
  setLimit(newLimit: number): void {
    this.maxMemory = newLimit;
    this.checkThresholds();
  }
}

// Global memory manager instance
let globalMemoryManager: MemoryManager | null = null;

/**
 * Get global memory manager instance
 */
export function getMemoryManager(options?: MemoryOptions): MemoryManager {
  if (!globalMemoryManager) {
    globalMemoryManager = new MemoryManager(options);
  }
  return globalMemoryManager;
}

/**
 * Reset global memory manager
 */
export function resetMemoryManager(): void {
  globalMemoryManager?.clear();
  globalMemoryManager = null;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Get browser memory info (if available)
 */
export function getBrowserMemoryInfo(): {
  jsHeapSizeLimit?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
} | null {
  // @ts-ignore - performance.memory is non-standard
  if (performance.memory) {
    // @ts-ignore
    return {
      // @ts-ignore
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      // @ts-ignore
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      // @ts-ignore
      usedJSHeapSize: performance.memory.usedJSHeapSize,
    };
  }

  return null;
}

/**
 * Monitor memory usage and log warnings
 */
export function monitorMemory(
  interval = 5000,
  callback?: (stats: MemoryStats) => void
): () => void {
  const manager = getMemoryManager();

  const intervalId = setInterval(() => {
    const stats = manager.getStats();
    callback?.(stats);

    if (stats.usagePercent > 90) {
      console.warn(
        `[Memory Warning] High memory usage: ${formatBytes(stats.used)} / ${formatBytes(stats.limit)} (${stats.usagePercent.toFixed(1)}%)`
      );
    }
  }, interval);

  return () => clearInterval(intervalId);
}
