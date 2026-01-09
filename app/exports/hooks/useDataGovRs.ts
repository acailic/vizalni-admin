/**
 * useDataGovRs Hook
 *
 * React hook for fetching data from the Serbian Open Data Portal (data.gov.rs).
 *
 * @example
 * ```tsx
 * import { useDataGovRs } from '@acailic/vizualni-admin/hooks';
 *
 * function MyComponent() {
 *   const { data, isLoading, error } = useDataGovRs({
 *     params: { q: 'ekonomija' }
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   return <div>{data?.length} datasets found</div>;
 * }
 * ```
 */

import { useState, useEffect, useCallback, useRef } from "react";

import { createDataGovRsClient } from "../client";

import type { SearchParams, DatasetMetadata } from "../client";

export interface UseDataGovRsOptions {
  /** Search parameters for the API */
  params: SearchParams;
  /** Enable automatic fetching on mount */
  enabled?: boolean;
  /** Cache time in milliseconds (0 = no cache) */
  cacheTime?: number;
  /** Refetch interval in milliseconds (0 = no refetch) */
  refetchInterval?: number;
}

export interface UseDataGovRsResult {
  /** Fetched dataset metadata */
  data: DatasetMetadata[] | null;
  /** Total count of results */
  count: number;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => Promise<void>;
  /** Manually trigger fetch */
  fetch: () => Promise<void>;
}

// Simple in-memory cache
const cache = new Map<
  string,
  { data: DatasetMetadata[]; count: number; timestamp: number }
>();

function getCacheKey(params: SearchParams): string {
  return JSON.stringify(params);
}

export function useDataGovRs(options: UseDataGovRsOptions): UseDataGovRsResult {
  const {
    params,
    enabled = true,
    cacheTime = 5 * 60 * 1000,
    refetchInterval = 0,
  } = options;

  const [data, setData] = useState<DatasetMetadata[] | null>(null);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clientRef = useRef(createDataGovRsClient());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const cacheKey = getCacheKey(params);
      const cached = cache.get(cacheKey);

      // Check cache
      if (cached && cacheTime > 0) {
        const age = Date.now() - cached.timestamp;
        if (age < cacheTime) {
          setData(cached.data);
          setCount(cached.count);
          setIsLoading(false);
          return;
        }
      }

      // Fetch from API
      const result = await clientRef.current.searchDatasets(params);

      // Update cache
      cache.set(cacheKey, {
        data: result.results,
        count: result.count,
        timestamp: Date.now(),
      });

      setData(result.results);
      setCount(result.count);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [params, enabled, cacheTime]);

  const refetch = useCallback(async () => {
    // Clear cache for this params
    const cacheKey = getCacheKey(params);
    cache.delete(cacheKey);
    await fetch();
  }, [params, fetch]);

  // Initial fetch
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        refetch();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, refetch]);

  return { data, count, isLoading, error, refetch, fetch };
}
