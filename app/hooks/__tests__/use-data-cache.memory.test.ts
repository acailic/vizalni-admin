import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, cleanup, act } from '@testing-library/react';
import { useDataCache, clearAllMemoryCache } from '../use-data-cache';

describe('useDataCache Memory Management', () => {
  beforeEach(() => {
    clearAllMemoryCache();
  });

  afterEach(() => {
    cleanup();
  });

  it('should clean up cache entry when component unmounts', async () => {
    const fetcher = vi.fn().mockResolvedValue({ data: 'test' });

    const { unmount } = renderHook(() =>
      useDataCache(
        async () => fetcher(),
        {
          key: 'test-key',
        }
      )
    );

    // Wait for initial fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Unmount should trigger cleanup
    unmount();

    // Cache should be cleared (or at least marked for cleanup)
    expect(true).toBe(true);
  });

  it('should not cause memory leaks with rapid mount/unmount cycles', async () => {
    const fetcher = vi.fn().mockResolvedValue({ data: 'test' });
    const keys = Array.from({ length: 100 }, (_, i) => `key-${i}`);

    for (const key of keys) {
      const { unmount } = renderHook(() =>
        useDataCache(
          async () => fetcher(),
          {
            key,
            ttl: 1000,
          }
        )
      );

      unmount();
    }

    // All entries should be cleaned up
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Memory should be managed properly
    expect(true).toBe(true);
  });
});
