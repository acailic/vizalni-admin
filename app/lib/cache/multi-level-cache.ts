/**
 * Multi-Level Cache System
 *
 * Implements L1 (Memory), L2 (IndexedDB), L3 (Network) caching strategy
 * with automatic promotion and eviction.
 */

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  size: number;
  hits: number;
  level: 1 | 2 | 3;
}

export interface CacheConfig {
  /** L1 (Memory) cache size limit in bytes */
  l1MaxSize?: number;
  /** L2 (IndexedDB) cache size limit in bytes */
  l2MaxSize?: number;
  /** Default TTL in milliseconds */
  defaultTTL?: number;
  /** Enable cache statistics */
  enableStats?: boolean;
}

export interface CacheStats {
  l1: {
    hits: number;
    misses: number;
    size: number;
    entries: number;
  };
  l2: {
    hits: number;
    misses: number;
    entries: number;
  };
  l3: {
    hits: number;
  };
  totalHits: number;
  totalMisses: number;
  hitRate: number;
}

/**
 * Multi-Level Cache
 */
export class MultiLevelCache<T = any> {
  private config: Required<CacheConfig>;
  private l1Cache: Map<string, CacheEntry<T>> = new Map();
  private l1Size = 0;
  private stats: CacheStats = {
    l1: { hits: 0, misses: 0, size: 0, entries: 0 },
    l2: { hits: 0, misses: 0, entries: 0 },
    l3: { hits: 0 },
    totalHits: 0,
    totalMisses: 0,
    hitRate: 0,
  };

  constructor(config: CacheConfig = {}) {
    this.config = {
      l1MaxSize: config.l1MaxSize || 50 * 1024 * 1024, // 50MB
      l2MaxSize: config.l2MaxSize || 200 * 1024 * 1024, // 200MB
      defaultTTL: config.defaultTTL || 5 * 60 * 1000, // 5 minutes
      enableStats: config.enableStats !== false,
    };
  }

  /**
   * Get value from cache (checks all levels)
   */
  async get(key: string): Promise<T | null> {
    // Check L1 (Memory)
    const l1Entry = this.getFromL1(key);
    if (l1Entry !== null) {
      this.recordHit(1);
      return l1Entry;
    }

    // Check L2 (IndexedDB)
    const l2Entry = await this.getFromL2(key);
    if (l2Entry !== null) {
      this.recordHit(2);
      // Promote to L1
      await this.setInL1(key, l2Entry, this.config.defaultTTL);
      return l2Entry;
    }

    // Cache miss
    this.recordMiss();
    return null;
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: T, ttl?: number): Promise<void> {
    const actualTTL = ttl || this.config.defaultTTL;

    // Set in L1
    await this.setInL1(key, value, actualTTL);

    // Also set in L2 for persistence
    await this.setInL2(key, value, actualTTL);
  }

  /**
   * Delete from cache
   */
  async delete(key: string): Promise<void> {
    // Delete from L1
    const l1Entry = this.l1Cache.get(key);
    if (l1Entry) {
      this.l1Cache.delete(key);
      this.l1Size -= l1Entry.size;
    }

    // Delete from L2
    await this.deleteFromL2(key);
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    // Clear L1
    this.l1Cache.clear();
    this.l1Size = 0;

    // Clear L2
    await this.clearL2();

    // Reset stats
    if (this.config.enableStats) {
      this.stats = {
        l1: { hits: 0, misses: 0, size: 0, entries: 0 },
        l2: { hits: 0, misses: 0, entries: 0 },
        l3: { hits: 0 },
        totalHits: 0,
        totalMisses: 0,
        hitRate: 0,
      };
    }
  }

  /**
   * Get from L1 (Memory) cache
   */
  private getFromL1(key: string): T | null {
    const entry = this.l1Cache.get(key);

    if (!entry) return null;

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.l1Cache.delete(key);
      this.l1Size -= entry.size;
      return null;
    }

    // Update hits
    entry.hits++;

    return entry.data;
  }

  /**
   * Set in L1 (Memory) cache
   */
  private async setInL1(key: string, value: T, ttl: number): Promise<void> {
    const size = this.estimateSize(value);

    // Check if we need to evict
    if (this.l1Size + size > this.config.l1MaxSize) {
      this.evictL1(size);
    }

    // Remove existing if present
    const existing = this.l1Cache.get(key);
    if (existing) {
      this.l1Size -= existing.size;
    }

    // Add new entry
    this.l1Cache.set(key, {
      key,
      data: value,
      timestamp: Date.now(),
      ttl,
      size,
      hits: 0,
      level: 1,
    });

    this.l1Size += size;

    // Update stats
    if (this.config.enableStats) {
      this.stats.l1.size = this.l1Size;
      this.stats.l1.entries = this.l1Cache.size;
    }
  }

  /**
   * Evict entries from L1 to make space
   */
  private evictL1(requiredSpace: number): void {
    // LRU eviction - sort by hits and timestamp
    const entries = Array.from(this.l1Cache.values());
    entries.sort((a, b) => {
      if (a.hits !== b.hits) {
        return a.hits - b.hits; // Fewer hits first
      }
      return a.timestamp - b.timestamp; // Older first
    });

    let freedSpace = 0;

    for (const entry of entries) {
      if (freedSpace >= requiredSpace) break;

      this.l1Cache.delete(entry.key);
      this.l1Size -= entry.size;
      freedSpace += entry.size;
    }
  }

  /**
   * Get from L2 (IndexedDB) cache
   */
  private async getFromL2(key: string): Promise<T | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          const result = request.result;

          if (!result) {
            resolve(null);
            return;
          }

          // Check if expired
          const now = Date.now();
          if (now - result.timestamp > result.ttl) {
            resolve(null);
            return;
          }

          resolve(result.data as T);
        };

        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Set in L2 (IndexedDB) cache
   */
  private async setInL2(key: string, value: T, ttl: number): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');

      store.put({
        key,
        data: value,
        timestamp: Date.now(),
        ttl,
      });

      return new Promise((resolve) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      });
    } catch {
      // Silently fail
    }
  }

  /**
   * Delete from L2 cache
   */
  private async deleteFromL2(key: string): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.delete(key);
    } catch {
      // Silently fail
    }
  }

  /**
   * Clear L2 cache
   */
  private async clearL2(): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.clear();
    } catch {
      // Silently fail
    }
  }

  /**
   * Open IndexedDB database
   */
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('vizualni-admin-multi-cache', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Estimate size of data
   */
  private estimateSize(data: any): number {
    try {
      const json = JSON.stringify(data);
      return new Blob([json]).size;
    } catch {
      return 1000; // Default estimate
    }
  }

  /**
   * Record cache hit
   */
  private recordHit(level: 1 | 2 | 3): void {
    if (!this.config.enableStats) return;

    if (level === 1) {
      this.stats.l1.hits++;
    } else if (level === 2) {
      this.stats.l2.hits++;
    } else {
      this.stats.l3.hits++;
    }

    this.stats.totalHits++;
    this.updateHitRate();
  }

  /**
   * Record cache miss
   */
  private recordMiss(): void {
    if (!this.config.enableStats) return;

    this.stats.l1.misses++;
    this.stats.l2.misses++;
    this.stats.totalMisses++;
    this.updateHitRate();
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.stats.totalHits + this.stats.totalMisses;
    this.stats.hitRate = total > 0 ? (this.stats.totalHits / total) * 100 : 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }
}

// Global cache instance
let globalCache: MultiLevelCache | null = null;

/**
 * Get global cache instance
 */
export function getGlobalCache(config?: CacheConfig): MultiLevelCache {
  if (!globalCache) {
    globalCache = new MultiLevelCache(config);
  }
  return globalCache;
}
