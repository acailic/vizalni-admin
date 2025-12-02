/**
 * Cache Configuration
 *
 * Default cache settings and configuration utilities.
 */

export const CACHE_CONFIG = {
  // Memory cache (L1)
  L1_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  L1_MAX_ENTRIES: 1000,

  // IndexedDB cache (L2)
  L2_MAX_SIZE: 200 * 1024 * 1024, // 200MB
  L2_MAX_ENTRIES: 10000,

  // TTL settings
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  SHORT_TTL: 1 * 60 * 1000, // 1 minute
  LONG_TTL: 60 * 60 * 1000, // 1 hour

  // Performance
  CHUNK_SIZE: 5000,
  MAX_CONCURRENT_LOADS: 3,

  // Memory limits
  MAX_MEMORY: 500 * 1024 * 1024, // 500MB
  WARNING_THRESHOLD: 0.8, // 80%
} as const;

export type CacheLevel = 'L1' | 'L2' | 'L3';

export interface CacheKey {
  dataset: string;
  chunk?: number;
  filter?: string;
}

export function generateCacheKey(key: CacheKey): string {
  const parts = [key.dataset];
  if (key.chunk !== undefined) parts.push(`chunk-${key.chunk}`);
  if (key.filter) parts.push(`filter-${key.filter}`);
  return parts.join(':');
}
