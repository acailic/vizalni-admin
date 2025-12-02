/**
 * Progressive Data Loading Hook
 *
 * Loads large datasets in chunks to avoid blocking the UI and reduce memory usage.
 * Supports pagination, infinite scroll, and chunk-based loading.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ProgressiveDataOptions {
  /** Number of rows per chunk */
  chunkSize?: number;
  /** Initial number of chunks to load */
  initialChunks?: number;
  /** Enable automatic loading of next chunk when scrolling */
  autoLoadNext?: boolean;
  /** Callback when data is loaded */
  onDataLoaded?: (data: any[], chunk: number, total: number) => void;
  /** Callback when loading starts */
  onLoadStart?: () => void;
  /** Callback when loading completes */
  onLoadComplete?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export interface ProgressiveDataState<T = any> {
  /** Currently loaded data */
  data: T[];
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | null;
  /** Current chunk index */
  currentChunk: number;
  /** Total number of chunks */
  totalChunks: number;
  /** Total number of rows */
  totalRows: number;
  /** Whether there are more chunks to load */
  hasMore: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Load next chunk */
  loadNext: () => Promise<void>;
  /** Load specific chunk */
  loadChunk: (chunkIndex: number) => Promise<void>;
  /** Reset and reload from start */
  reset: () => void;
  /** Load all remaining data */
  loadAll: () => Promise<void>;
}

/**
 * Hook for progressive data loading
 *
 * @param dataSource - Function that returns data for a specific chunk
 * @param options - Configuration options
 * @returns Progressive data state and controls
 *
 * @example
 * ```tsx
 * const { data, loading, loadNext, hasMore } = useProgressiveData(
 *   async (chunk, size) => {
 *     const response = await fetch(`/api/data?page=${chunk}&size=${size}`);
 *     return response.json();
 *   },
 *   { chunkSize: 5000 }
 * );
 * ```
 */
export function useProgressiveData<T = any>(
  dataSource: (chunkIndex: number, chunkSize: number) => Promise<{ data: T[]; total: number }>,
  options: ProgressiveDataOptions = {}
): ProgressiveDataState<T> {
  const {
    chunkSize = 5000,
    initialChunks = 1,
    autoLoadNext: _autoLoadNext = false,
    onDataLoaded,
    onLoadStart,
    onLoadComplete,
    onError,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  const loadingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadChunk = useCallback(
    async (chunkIndex: number) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      onLoadStart?.();

      try {
        const result = await dataSource(chunkIndex, chunkSize);

        if (!mountedRef.current) return;

        const { data: chunkData, total } = result;

        // Calculate total chunks
        const chunks = Math.ceil(total / chunkSize);

        setData(prev => {
          // If loading first chunk, replace data
          if (chunkIndex === 0) {
            return chunkData;
          }
          // Otherwise append
          return [...prev, ...chunkData];
        });

        setTotalRows(total);
        setTotalChunks(chunks);
        setCurrentChunk(chunkIndex);

        onDataLoaded?.(chunkData, chunkIndex, total);
        onLoadComplete?.();

      } catch (err) {
        if (!mountedRef.current) return;

        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          loadingRef.current = false;
        }
      }
    },
    [dataSource, chunkSize, onDataLoaded, onLoadStart, onLoadComplete, onError]
  );

  const loadNext = useCallback(async () => {
    const nextChunk = currentChunk + 1;
    if (nextChunk < totalChunks) {
      await loadChunk(nextChunk);
    }
  }, [currentChunk, totalChunks, loadChunk]);

  const reset = useCallback(() => {
    setData([]);
    setCurrentChunk(0);
    setTotalRows(0);
    setTotalChunks(0);
    setError(null);
    loadChunk(0);
  }, [loadChunk]);

  const loadAll = useCallback(async () => {
    const chunksToLoad = totalChunks - currentChunk - 1;

    for (let i = 0; i < chunksToLoad; i++) {
      await loadNext();
    }
  }, [totalChunks, currentChunk, loadNext]);

  // Load initial chunks
  useEffect(() => {
    const loadInitial = async () => {
      for (let i = 0; i < initialChunks; i++) {
        await loadChunk(i);
      }
    };

    loadInitial();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasMore = currentChunk < totalChunks - 1;
  const progress = totalRows > 0 ? (data.length / totalRows) * 100 : 0;

  return {
    data,
    loading,
    error,
    currentChunk,
    totalChunks,
    totalRows,
    hasMore,
    progress,
    loadNext,
    loadChunk,
    reset,
    loadAll,
  };
}

/**
 * Hook for infinite scroll with progressive loading
 *
 * @param dataSource - Function that returns data for a specific chunk
 * @param options - Configuration options
 * @returns Progressive data state with scroll observer
 *
 * @example
 * ```tsx
 * const { data, loading, observerRef } = useInfiniteScroll(
 *   async (chunk, size) => fetchData(chunk, size),
 *   { chunkSize: 1000 }
 * );
 *
 * return (
 *   <div>
 *     {data.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={observerRef}>Loading...</div>
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll<T = any>(
  dataSource: (chunkIndex: number, chunkSize: number) => Promise<{ data: T[]; total: number }>,
  options: ProgressiveDataOptions = {}
) {
  const progressiveData = useProgressiveData(dataSource, {
    ...options,
    autoLoadNext: true,
  });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && progressiveData.hasMore && !progressiveData.loading) {
          progressiveData.loadNext();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [progressiveData]);

  return {
    ...progressiveData,
    observerRef,
  };
}
