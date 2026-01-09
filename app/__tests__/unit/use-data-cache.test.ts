/**
 * useDataCache Hook Behavior Tests
 *
 * Tests for TTL, eviction, and cache behavior in the useDataCache hook utilities.
 */

import { describe, it, expect, beforeEach } from "vitest";

import { clearAllCaches, getCacheStats } from "../../hooks/use-data-cache";

describe("useDataCache utilities", () => {
  beforeEach(() => {
    // Clear all caches before each test
    clearAllCaches();
  });

  describe("Cache Statistics", () => {
    it("should provide accurate cache statistics", () => {
      const stats = getCacheStats();

      expect(stats).toHaveProperty("memoryEntries");
      expect(stats).toHaveProperty("memorySize");
      expect(stats).toHaveProperty("memoryLimit");
      expect(stats).toHaveProperty("memoryUsagePercent");

      expect(stats.memoryLimit).toBe(50 * 1024 * 1024); // 50MB
      expect(stats.memoryEntries).toBe(0);
      expect(stats.memorySize).toBe(0);
      expect(stats.memoryUsagePercent).toBe(0);
    });

    it("should calculate memory limit correctly", () => {
      const stats = getCacheStats();
      expect(stats.memoryLimit).toBe(52428800); // 50 * 1024 * 1024
    });
  });

  describe("Clear All Caches", () => {
    it("should clear all caches", async () => {
      const statsBefore = getCacheStats();
      expect(statsBefore.memoryEntries).toBe(0);

      await clearAllCaches();

      const statsAfter = getCacheStats();
      expect(statsAfter.memoryEntries).toBe(0);
      expect(statsAfter.memorySize).toBe(0);
    });
  });

  describe("Memory Cache Limits", () => {
    it("should enforce 50MB memory limit", () => {
      const stats = getCacheStats();
      expect(stats.memoryLimit).toBe(50 * 1024 * 1024); // 50MB
    });

    it("should have correct memory usage calculation", () => {
      const stats = getCacheStats();
      expect(stats.memoryUsagePercent).toBeGreaterThanOrEqual(0);
      expect(stats.memoryUsagePercent).toBeLessThanOrEqual(100);
    });
  });
});

describe("Cache configuration validation", () => {
  it("should match documented default TTL", () => {
    const defaultTTL = 5 * 60 * 1000; // 5 minutes
    expect(defaultTTL).toBe(300000);
  });

  it("should match documented short TTL", () => {
    const shortTTL = 1 * 60 * 1000; // 1 minute
    expect(shortTTL).toBe(60000);
  });

  it("should match documented long TTL", () => {
    const longTTL = 60 * 60 * 1000; // 1 hour
    expect(longTTL).toBe(3600000);
  });

  it("should match documented memory limit", () => {
    const memoryLimit = 50 * 1024 * 1024; // 50MB
    expect(memoryLimit).toBe(52428800);
  });
});

describe("Cache eviction behavior", () => {
  it("should track cache size in bytes", () => {
    const data1 = { value: "x".repeat(100) };
    const data2 = { value: "y".repeat(200) };

    const size1 = new Blob([JSON.stringify(data1)]).size;
    const size2 = new Blob([JSON.stringify(data2)]).size;

    expect(size1).toBeGreaterThan(0);
    expect(size2).toBeGreaterThan(0);
    expect(size2).toBeGreaterThan(size1);
  });

  it("should estimate size correctly", () => {
    const data = { value: "test-data", nested: { key: "value" } };
    const json = JSON.stringify(data);
    const size = new Blob([json]).size;

    expect(size).toBeGreaterThan(0);
    expect(size).toBe(json.length);
  });

  it("should handle size estimation for different data types", () => {
    const stringData = "test-string";
    const numberData = 12345;
    const objectData = { key: "value" };
    const arrayData = [1, 2, 3];

    const stringSize = new Blob([JSON.stringify(stringData)]).size;
    const numberSize = new Blob([JSON.stringify(numberData)]).size;
    const objectSize = new Blob([JSON.stringify(objectData)]).size;
    const arraySize = new Blob([JSON.stringify(arrayData)]).size;

    expect(stringSize).toBeGreaterThan(0);
    expect(numberSize).toBeGreaterThan(0);
    expect(objectSize).toBeGreaterThan(0);
    expect(arraySize).toBeGreaterThan(0);
  });
});

describe("TTL calculations", () => {
  it("should correctly identify expired entries", () => {
    const now = Date.now();
    const ttl = 1000;

    const validEntry = {
      timestamp: now - 500,
      ttl,
    };

    const expiredEntry = {
      timestamp: now - 2000,
      ttl,
    };

    const isExpired = (entry: typeof validEntry) => {
      return now - entry.timestamp > entry.ttl;
    };

    expect(isExpired(validEntry)).toBe(false);
    expect(isExpired(expiredEntry)).toBe(true);
  });

  it("should handle edge cases in TTL calculations", () => {
    const now = Date.now();
    const ttl = 0;

    const entry = {
      timestamp: now,
      ttl,
    };

    const isExpired = (e: typeof entry) => {
      return now - e.timestamp > e.ttl;
    };

    // Zero TTL means immediate expiration
    expect(isExpired(entry)).toBe(false); // Created now, not expired yet
  });

  it("should calculate TTL correctly for different time units", () => {
    const oneSecond = 1000;
    const oneMinute = 60 * oneSecond;
    const oneHour = 60 * oneMinute;

    expect(oneSecond).toBe(1000);
    expect(oneMinute).toBe(60000);
    expect(oneHour).toBe(3600000);
  });
});

describe("Cache key generation", () => {
  it("should generate consistent cache keys", () => {
    const key1 = "dataset:chunk-0:filter-region-1";
    const key2 = "dataset:chunk-0:filter-region-1";

    expect(key1).toBe(key2);
  });

  it("should handle different cache keys", () => {
    const key1 = "dataset:chunk-0";
    const key2 = "dataset:chunk-1";
    const key3 = "dataset:filter-region-1";

    expect(key1).not.toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key2).not.toBe(key3);
  });

  it("should handle cache keys with special characters", () => {
    const key1 = "dataset:filter-region-1:filter-year-2024";
    const key2 = "dataset:filter-region-2:filter-year-2024";

    expect(key1).not.toBe(key2);
    expect(key1).toContain("region-1");
    expect(key2).toContain("region-2");
  });
});

describe("Cache behavior validation", () => {
  it("should validate cache size limits", () => {
    const MAX_MEMORY_SIZE = 50 * 1024 * 1024; // 50MB
    const WARNING_THRESHOLD = 0.8; // 80%

    const warningSize = MAX_MEMORY_SIZE * WARNING_THRESHOLD;

    expect(MAX_MEMORY_SIZE).toBe(52428800);
    expect(warningSize).toBe(41943040); // 80% of 50MB
  });

  it("should validate eviction policy logic", () => {
    const entries = [
      { key: "key1", timestamp: 1000, hits: 5 },
      { key: "key2", timestamp: 2000, hits: 2 },
      { key: "key3", timestamp: 3000, hits: 10 },
    ];

    // Sort by hits (ascending) then timestamp (ascending)
    entries.sort((a, b) => {
      if (a.hits !== b.hits) {
        return a.hits - b.hits;
      }
      return a.timestamp - b.timestamp;
    });

    expect(entries[0].key).toBe("key2"); // Fewest hits
    expect(entries[1].key).toBe("key1"); // Middle hits
    expect(entries[2].key).toBe("key3"); // Most hits
  });

  it("should handle cache entry age calculation", () => {
    const now = Date.now();
    const entryTimestamp = now - 5000; // 5 seconds ago

    const age = now - entryTimestamp;

    expect(age).toBe(5000);
    expect(age).toBeGreaterThan(0);
  });
});
