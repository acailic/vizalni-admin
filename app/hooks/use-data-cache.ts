/**
 * Data Caching Hook
 *
 * Multi-level caching system for data with memory, IndexedDB, and network layers.
 * Automatically manages cache invalidation and memory limits.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface CacheOptions {
  /** Cache key */
  key: string;
  /** Time-to-live in milliseconds (default: 5 minutes) */
  ttl?: number;
  /** Enable IndexedDB caching */
  useIndexedDB?: boolean;
  /** Enable memory caching */
  useMemory?: boolean;
  /** Force refresh from network */
  forceRefresh?: boolean;
  /** Callback when cache is hit */
  onCacheHit?: (source: 'memory' | 'indexeddb') => void;
  /** Callback when cache is missed */
  onCacheMiss?: () => void;
}

export interface CacheState<T> {
  /** Cached data */
  data: T | null;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | null;
  /** Whether data came from cache */
  fromCache: boolean;
  /** Cache source */
  cacheSource: 'memory' | 'indexeddb' | 'network' | null;
  /** Invalidate cache and reload */
  invalidate: () => Promise<void>;
  /** Manually set cache */
  setCache: (data: T) => Promise<void>;
  /** Clear cache */
  clearCache: () => Promise<void>;
}

// In-memory cache
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Memory limit (50MB)
const MAX_MEMORY_SIZE = 50 * 1024 * 1024;
let currentMemorySize = 0;

/**
 * Estimate size of data in bytes
 */
function estimateSize(data: any): number {
  const str = JSON.stringify(data);
  return new Blob([str]).size;
}

/**
 * Evict oldest cache entries to free memory
 */
function evictOldest() {
  const entries = Array.from(memoryCache.entries());
  entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

  while (currentMemorySize > MAX_MEMORY_SIZE && entries.length > 0) {
    const [key, value] = entries.shift()!;
    const size = estimateSize(value.data);
    memoryCache.delete(key);
    currentMemorySize -= size;
  }
}

/**
 * Get from memory cache
 */
function getFromMemory<T>(key: string, ttl: number): T | null {
  const cached = memoryCache.get(key);

  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > ttl) {
    // Expired
    memoryCache.delete(key);
    currentMemorySize -= estimateSize(cached.data);
    return null;
  }

  return cached.data as T;
}

/**
 * Set in memory cache
 */
function setInMemory<T>(key: string, data: T, ttl: number): void {
  const size = estimateSize(data);

  // Check if adding this would exceed limit
  if (currentMemorySize + size > MAX_MEMORY_SIZE) {
    evictOldest();
  }

  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });

  currentMemorySize += size;
}

/**
 * Get from IndexedDB cache
 */
async function getFromIndexedDB<T>(key: string, ttl: number): Promise<T | null> {
  try {
    const db = await openCacheDB();
    const transaction = db.transaction(['cache'], 'readonly');
    const store = transaction.objectStore('cache');
    const request = store.get(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;

        if (!result) {
          resolve(null);
          return;
        }

        const now = Date.now();
        if (now - result.timestamp > ttl) {
          // Expired
          resolve(null);
          return;
        }

        resolve(result.data as T);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB cache read failed:', error);
    return null;
  }
}

/**
 * Set in IndexedDB cache
 */
async function setInIndexedDB<T>(key: string, data: T): Promise<void> {
  try {
    const db = await openCacheDB();
    const transaction = db.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');

    store.put({
      key,
      data,
      timestamp: Date.now(),
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn('IndexedDB cache write failed:', error);
  }
}

/**
 * Open IndexedDB database
 */
let dbPromise: Promise<IDBDatabase> | null = null;

function openCacheDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('vizualni-admin-cache', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    };
  });

  return dbPromise;
}

/**
 * Hook for data caching with multi-level cache
 *
 * @param fetcher - Function to fetch data from network
 * @param options - Cache configuration
 * @returns Cache state and controls
 *
 * @example
 * ```tsx
 * const { data, loading, invalidate } = useDataCache(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   },
 *   { key: 'my-data', ttl: 5 * 60 * 1000 }
 * );
 * ```
 */
export function useDataCache<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions
): CacheState<T> {
  const {
    key,
    ttl = 5 * 60 * 1000, // 5 minutes default
    useIndexedDB = true,
    useMemory = true,
    forceRefresh = false,
    onCacheHit,
    onCacheMiss,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheSource, setCacheSource] = useState<'memory' | 'indexeddb' | 'network' | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const loadData = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);

    try {
      // Try memory cache first
      if (!skipCache && useMemory) {
        const cached = getFromMemory<T>(key, ttl);
        if (cached !== null) {
          setData(cached);
          setFromCache(true);
          setCacheSource('memory');
          setLoading(false);
          onCacheHit?.('memory');
          return;
        }
      }

      // Try IndexedDB cache
      if (!skipCache && useIndexedDB) {
        const cached = await getFromIndexedDB<T>(key, ttl);
        if (cached !== null) {
          setData(cached);
          setFromCache(true);
          setCacheSource('indexeddb');
          setLoading(false);

          // Also cache in memory for faster access
          if (useMemory) {
            setInMemory(key, cached, ttl);
          }

          onCacheHit?.('indexeddb');
          return;
        }
      }

      // Cache miss - fetch from network
      onCacheMiss?.();

      const result = await fetcherRef.current();

      setData(result);
      setFromCache(false);
      setCacheSource('network');

      // Cache the result
      if (useMemory) {
        setInMemory(key, result, ttl);
      }

      if (useIndexedDB) {
        await setInIndexedDB(key, result);
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [key, ttl, useIndexedDB, useMemory, onCacheHit, onCacheMiss]);

  const invalidate = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  const setCache = useCallback(async (newData: T) => {
    setData(newData);

    if (useMemory) {
      setInMemory(key, newData, ttl);
    }

    if (useIndexedDB) {
      await setInIndexedDB(key, newData);
    }
  }, [key, ttl, useIndexedDB, useMemory]);

  const clearCache = useCallback(async () => {
    // Clear memory cache
    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key);
      if (cached) {
        currentMemorySize -= estimateSize(cached.data);
      }
      memoryCache.delete(key);
    }

    // Clear IndexedDB cache
    if (useIndexedDB) {
      try {
        const db = await openCacheDB();
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        store.delete(key);
      } catch (error) {
        console.warn('Failed to clear IndexedDB cache:', error);
      }
    }

    setData(null);
    setFromCache(false);
    setCacheSource(null);
  }, [key, useIndexedDB]);

  // Load data on mount or when key/forceRefresh changes
  useEffect(() => {
    loadData(forceRefresh);
  }, [key, forceRefresh]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    fromCache,
    cacheSource,
    invalidate,
    setCache,
    clearCache,
  };
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  // Clear memory cache
  memoryCache.clear();
  currentMemorySize = 0;

  // Clear IndexedDB cache
  try {
    const db = await openCacheDB();
    const transaction = db.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    store.clear();
  } catch (error) {
    console.warn('Failed to clear IndexedDB cache:', error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    memoryEntries: memoryCache.size,
    memorySize: currentMemorySize,
    memoryLimit: MAX_MEMORY_SIZE,
    memoryUsagePercent: (currentMemorySize / MAX_MEMORY_SIZE) * 100,
  };
}
