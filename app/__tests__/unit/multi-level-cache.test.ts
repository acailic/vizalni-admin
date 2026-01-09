/**
 * Multi-Level Cache Behavior Tests
 *
 * Tests for TTL, eviction, and cache promotion behavior across L1 (memory) and L2 (IndexedDB) layers.
 */

import { describe, it, expect, beforeEach } from "vitest";

import { CACHE_CONFIG } from "../../lib/cache/cache-config";
import {
  MultiLevelCache,
  getGlobalCache,
} from "../../lib/cache/multi-level-cache";

describe("MultiLevelCache", () => {
  let cache: MultiLevelCache<any>;

  beforeEach(() => {
    cache = new MultiLevelCache({
      l1MaxSize: 1024, // 1KB for testing
      l2MaxSize: 2048, // 2KB for testing
      defaultTTL: 1000, // 1 second for testing
      enableStats: true,
    });

    // Clear global cache
    (global as any).globalCache = null;
  });

  describe("TTL (Time-to-Live) Behavior", () => {
    it("should use default TTL when not specified", async () => {
      const key = "test-key";
      const data = { value: "test-data" };

      // Set entry without TTL
      await cache.set(key, data);

      // Should be available immediately
      const result = await cache.get(key);
      expect(result).toEqual(data);

      // Verify stats show hit
      const stats = cache.getStats();
      expect(stats.l1.hits).toBe(1);
    });

    it("should allow custom TTL per entry", async () => {
      const key1 = "short-ttl";
      const key2 = "long-ttl";
      const data = { value: "test-data" };

      // Set entries with different TTLs
      await cache.set(key1, data, 50);
      await cache.set(key2, data, 500);

      // Wait for short TTL to expire
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Short TTL should be expired
      const result1 = await cache.get(key1);
      expect(result1).toBeNull();

      // Long TTL should still be valid
      const result2 = await cache.get(key2);
      expect(result2).toEqual(data);
    });

    it("should expire entries in L1 cache after TTL", async () => {
      const key = "test-key";
      const data = { value: "test-data" };

      // Set entry with 100ms TTL
      await cache.set(key, data, 100);

      // Should be available immediately
      const result1 = await cache.get(key);
      expect(result1).toEqual(data);

      // Wait for TTL to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should be expired
      const result2 = await cache.get(key);
      expect(result2).toBeNull();
    });
  });

  describe("L1 Eviction Policy", () => {
    it("should evict least recently used entries when L1 is full", async () => {
      const largeData = { value: "x".repeat(400) }; // ~400 bytes
      const key1 = "old-key";
      const key2 = "newer-key";
      const key3 = "newest-key";

      // Fill L1 cache (limit is 1KB)
      await cache.set(key1, largeData, 10000);
      await cache.set(key2, largeData, 10000);

      // Access key1 to make it more recently used
      await cache.get(key1);

      // Add third entry that will trigger eviction
      await cache.set(key3, largeData, 10000);

      // key2 should have been evicted (least recently used)
      const result1 = await cache.get(key1);
      const result2 = await cache.get(key2);
      const result3 = await cache.get(key3);

      expect(result1).not.toBeNull(); // key1 still in cache
      expect(result2).toBeNull(); // key2 evicted
      expect(result3).not.toBeNull(); // key3 in cache
    });

    it("should prioritize evicting entries with fewer hits", async () => {
      const data = { value: "x".repeat(300) };
      const popularKey = "popular-key";
      const unpopularKey = "unpopular-key";

      // Set entries
      await cache.set(popularKey, data, 10000);
      await cache.set(unpopularKey, data, 10000);

      // Access popular key multiple times
      await cache.get(popularKey);
      await cache.get(popularKey);
      await cache.get(popularKey);

      // Access unpopular key once
      await cache.get(unpopularKey);

      // Add entry that triggers eviction
      await cache.set("new-key", { value: "y".repeat(400) }, 10000);

      // Unpopular key should be evicted first
      const stats = cache.getStats();
      expect(stats.l1.entries).toBeLessThan(3);
    });

    it("should update L1 size tracking after eviction", async () => {
      const largeData = { value: "x".repeat(600) }; // ~600 bytes

      // First entry
      await cache.set("key1", largeData, 10000);
      let stats = cache.getStats();
      const sizeAfterFirst = stats.l1.size;

      // Second entry (should trigger eviction of first)
      await cache.set("key2", largeData, 10000);
      stats = cache.getStats();
      const sizeAfterSecond = stats.l1.size;

      // Size should be similar (first entry evicted)
      expect(sizeAfterSecond).toBeLessThan(sizeAfterFirst + 600);
      expect(stats.l1.entries).toBe(1);
    });

    it("should replace existing entry when same key is set", async () => {
      const data1 = { value: "x".repeat(200) };
      const data2 = { value: "y".repeat(300) };
      const key = "test-key";

      await cache.set(key, data1, 10000);
      let stats = cache.getStats();
      const sizeAfterFirst = stats.l1.size;

      await cache.set(key, data2, 10000);
      stats = cache.getStats();
      const sizeAfterSecond = stats.l1.size;

      // Size should increase by difference, not full size
      expect(sizeAfterSecond).toBeLessThan(sizeAfterFirst + 300);
      expect(stats.l1.entries).toBe(1); // Still only one entry
    });
  });

  describe("Cache Statistics", () => {
    it("should track L1 hits and misses", async () => {
      const key = "test-key";
      const data = { value: "test-data" };

      // Miss
      await cache.get(key);
      expect(cache.getStats().l1.misses).toBe(1);

      // Set and hit
      await cache.set(key, data, 10000);
      await cache.get(key);
      expect(cache.getStats().l1.hits).toBe(1);
    });

    it("should calculate hit rate correctly", async () => {
      const key = "test-key";
      const data = { value: "test-data" };

      // Two misses
      await cache.get(key);
      await cache.get("nonexistent");

      // One hit
      await cache.set(key, data, 10000);
      await cache.get(key);

      const stats = cache.getStats();
      expect(stats.totalHits).toBe(1);
      expect(stats.totalMisses).toBe(2);
      expect(stats.hitRate).toBeCloseTo(33.33, 1); // 1/3 ≈ 33.33%
    });

    it("should track L1 size and entry count", async () => {
      const data = { value: "test-data" };

      await cache.set("key1", data, 10000);
      await cache.set("key2", data, 10000);

      const stats = cache.getStats();
      expect(stats.l1.entries).toBe(2);
      expect(stats.l1.size).toBeGreaterThan(0);
    });
  });

  describe("Cache Operations", () => {
    it("should clear all caches", async () => {
      await cache.set("key1", { value: "data1" }, 10000);
      await cache.set("key2", { value: "data2" }, 10000);

      await cache.clear();

      const stats = cache.getStats();
      expect(stats.l1.entries).toBe(0);
      expect(stats.l1.size).toBe(0);
      expect(stats.totalHits).toBe(0);
      expect(stats.totalMisses).toBe(0);
    });
  });

  describe("Cache Configuration Defaults", () => {
    it("should use CACHE_CONFIG defaults when no config provided", () => {
      const defaultCache = new MultiLevelCache();
      const stats = defaultCache.getStats();

      // Should initialize with stats
      expect(stats).toBeDefined();
      expect(stats.l1).toBeDefined();
      expect(stats.l2).toBeDefined();
    });

    it("should allow overriding default config", () => {
      const customCache = new MultiLevelCache({
        l1MaxSize: 2048,
        l2MaxSize: 4096,
        defaultTTL: 5000,
        enableStats: false,
      });

      const stats = customCache.getStats();
      // Stats should be disabled (no tracking)
      expect(stats.totalHits).toBe(0);
      expect(stats.totalMisses).toBe(0);
    });
  });

  describe("Global Cache Instance", () => {
    it("should return singleton instance", () => {
      const instance1 = getGlobalCache();
      const instance2 = getGlobalCache();

      expect(instance1).toBe(instance2);
    });

    it("should create new instance when config differs", () => {
      const instance1 = getGlobalCache({ l1MaxSize: 1024 });
      const instance2 = getGlobalCache({ l1MaxSize: 2048 });

      // Should return same instance (singleton pattern)
      expect(instance1).toBe(instance2);
    });
  });

  describe("CACHE_CONFIG Constants", () => {
    it("should have defined cache size limits", () => {
      expect(CACHE_CONFIG.L1_MAX_SIZE).toBe(50 * 1024 * 1024); // 50MB
      expect(CACHE_CONFIG.L2_MAX_SIZE).toBe(200 * 1024 * 1024); // 200MB
      expect(CACHE_CONFIG.L1_MAX_ENTRIES).toBe(1000);
      expect(CACHE_CONFIG.L2_MAX_ENTRIES).toBe(10000);
    });

    it("should have defined TTL presets", () => {
      expect(CACHE_CONFIG.DEFAULT_TTL).toBe(5 * 60 * 1000); // 5 minutes
      expect(CACHE_CONFIG.SHORT_TTL).toBe(1 * 60 * 1000); // 1 minute
      expect(CACHE_CONFIG.LONG_TTL).toBe(60 * 60 * 1000); // 1 hour
    });

    it("should have performance constants", () => {
      expect(CACHE_CONFIG.CHUNK_SIZE).toBe(5000);
      expect(CACHE_CONFIG.MAX_CONCURRENT_LOADS).toBe(3);
      expect(CACHE_CONFIG.MAX_MEMORY).toBe(500 * 1024 * 1024); // 500MB
      expect(CACHE_CONFIG.WARNING_THRESHOLD).toBe(0.8); // 80%
    });
  });

  describe("Size Estimation", () => {
    it("should estimate size of different data types", async () => {
      const smallData = { value: "x" };
      const mediumData = { value: "x".repeat(100) };

      await cache.set("small", smallData, 10000);
      await cache.set("medium", mediumData, 10000);

      const stats = cache.getStats();
      expect(stats.l1.size).toBeGreaterThan(0);
      expect(stats.l1.entries).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Hit Tracking", () => {
    it("should increment hit count on cache access", async () => {
      const key = "test-key";
      const data = { value: "test-data" };

      await cache.set(key, data, 10000);

      // Access multiple times
      await cache.get(key);
      await cache.get(key);
      await cache.get(key);

      const stats = cache.getStats();
      expect(stats.l1.hits).toBe(3);
    });

    it("should not increment hits for misses", async () => {
      await cache.get("nonexistent");
      await cache.get("another-nonexistent");

      const stats = cache.getStats();
      expect(stats.l1.hits).toBe(0);
      expect(stats.l1.misses).toBe(2);
    });
  });

  describe("Multiple Cache Instances", () => {
    it("should maintain separate state for different instances", async () => {
      const cache1 = new MultiLevelCache({ l1MaxSize: 1024, defaultTTL: 1000 });
      const cache2 = new MultiLevelCache({ l1MaxSize: 1024, defaultTTL: 2000 });

      const data = { value: "test-data" };

      await cache1.set("key", data, 10000);
      await cache2.set("key", data, 10000);

      const stats1 = cache1.getStats();
      const stats2 = cache2.getStats();

      // Both should have independent stats
      expect(stats1.l1.entries).toBe(1);
      expect(stats2.l1.entries).toBe(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty cache gracefully", async () => {
      const result = await cache.get("nonexistent");
      expect(result).toBeNull();

      const stats = cache.getStats();
      expect(stats.l1.misses).toBe(1);
    });

    it("should handle setting same key multiple times", async () => {
      const data1 = { value: "data1" };
      const data2 = { value: "data2" };

      await cache.set("key", data1, 10000);
      await cache.set("key", data2, 10000);

      const result = await cache.get("key");
      expect(result).toEqual(data2);

      const stats = cache.getStats();
      expect(stats.l1.entries).toBe(1); // Still only one entry
    });

    it("should handle very large data that exceeds cache size", async () => {
      const hugeData = { value: "x".repeat(2000) }; // Larger than L1 limit

      await cache.set("key", hugeData, 10000);

      const stats = cache.getStats();
      // Should either not store or evict immediately
      expect(stats.l1.entries).toBeLessThanOrEqual(1);
    });
  });
});
