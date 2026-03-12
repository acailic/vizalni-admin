import type { ParsedDataset } from '@/types/observation'

/**
 * Cache entry with data and timestamp
 */
interface CacheEntry {
  data: ParsedDataset
  timestamp: number
}

/**
 * In-memory cache for datasets
 * Uses module-level Map for simplicity
 */
const datasetCache = new Map<string, CacheEntry>()

/**
 * Cache TTL in milliseconds (5 minutes)
 */
const CACHE_TTL_MS = 5 * 60 * 1000

/**
 * Get cached dataset if fresh
 * @param url - The resource URL (cache key)
 * @returns The cached dataset or null if not found/stale
 */
export function getCachedDataset(url: string): ParsedDataset | null {
  const entry = datasetCache.get(url)
  if (!entry) {
    return null
  }

  const now = Date.now()
  const isFresh = now - entry.timestamp < CACHE_TTL_MS

  if (!isFresh) {
    // Remove stale entry
    datasetCache.delete(url)
    return null
  }

  return entry.data
}

/**
 * Store dataset in cache
 * @param url - The resource URL (cache key)
 * @param data - The parsed dataset
 */
export function setCachedDataset(url: string, data: ParsedDataset): void {
  datasetCache.set(url, {
    data,
    timestamp: Date.now(),
  })
}

/**
 * Clear all cached datasets
 */
export function clearCache(): void {
  datasetCache.clear()
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats(): { size: number; urls: string[] } {
  return {
    size: datasetCache.size,
    urls: Array.from(datasetCache.keys()),
  }
}
