/**
 * Progressive Data Loader
 *
 * Chunk-based data loader for large datasets with streaming support.
 */

export interface ProgressiveLoaderOptions {
  /** Size of each chunk */
  chunkSize?: number;
  /** Maximum concurrent chunks to load */
  maxConcurrent?: number;
  /** Callback for progress updates */
  onProgress?: (loaded: number, total: number) => void;
  /** Callback for each chunk loaded */
  onChunkLoaded?: (chunk: any[], chunkIndex: number) => void;
  /** Callback on error */
  onError?: (error: Error, chunkIndex: number) => void;
}

export class ProgressiveLoader<T = any> {
  private chunkSize: number;
  private maxConcurrent: number;
  private onProgress?: (loaded: number, total: number) => void;
  private onChunkLoaded?: (chunk: T[], chunkIndex: number) => void;
  private onError?: (error: Error, chunkIndex: number) => void;

  private loadedChunks: Map<number, T[]> = new Map();
  private loadingChunks: Set<number> = new Set();
  private totalItems = 0;

  constructor(options: ProgressiveLoaderOptions = {}) {
    this.chunkSize = options.chunkSize || 5000;
    this.maxConcurrent = options.maxConcurrent || 3;
    this.onProgress = options.onProgress;
    this.onChunkLoaded = options.onChunkLoaded;
    this.onError = options.onError;
  }

  /**
   * Load data progressively from a data source
   */
  async load(
    dataSource: (offset: number, limit: number) => Promise<{ data: T[]; total: number }>
  ): Promise<T[]> {
    // Load first chunk to get total count
    const firstChunk = await dataSource(0, this.chunkSize);
    this.totalItems = firstChunk.total;

    this.loadedChunks.set(0, firstChunk.data);
    this.onChunkLoaded?.(firstChunk.data, 0);
    this.onProgress?.(firstChunk.data.length, this.totalItems);

    const totalChunks = Math.ceil(this.totalItems / this.chunkSize);

    // Load remaining chunks
    const chunkPromises: Promise<void>[] = [];

    for (let i = 1; i < totalChunks; i++) {
      // Limit concurrent requests
      if (chunkPromises.length >= this.maxConcurrent) {
        await Promise.race(chunkPromises);
      }

      const promise = this.loadChunk(dataSource, i);
      chunkPromises.push(promise);
    }

    // Wait for all chunks
    await Promise.all(chunkPromises);

    // Combine all chunks
    return this.getAllData();
  }

  /**
   * Load a specific chunk
   */
  private async loadChunk(
    dataSource: (offset: number, limit: number) => Promise<{ data: T[]; total: number }>,
    chunkIndex: number
  ): Promise<void> {
    if (this.loadedChunks.has(chunkIndex) || this.loadingChunks.has(chunkIndex)) {
      return;
    }

    this.loadingChunks.add(chunkIndex);

    try {
      const offset = chunkIndex * this.chunkSize;
      const result = await dataSource(offset, this.chunkSize);

      this.loadedChunks.set(chunkIndex, result.data);
      this.onChunkLoaded?.(result.data, chunkIndex);

      const loaded = Array.from(this.loadedChunks.values()).reduce(
        (sum, chunk) => sum + chunk.length,
        0
      );
      this.onProgress?.(loaded, this.totalItems);

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.onError?.(err, chunkIndex);
      throw err;
    } finally {
      this.loadingChunks.delete(chunkIndex);
    }
  }

  /**
   * Get all loaded data
   */
  getAllData(): T[] {
    const chunks = Array.from(this.loadedChunks.entries());
    chunks.sort((a, b) => a[0] - b[0]);

    return chunks.flatMap(([_, data]) => data);
  }

  /**
   * Get specific chunk
   */
  getChunk(chunkIndex: number): T[] | undefined {
    return this.loadedChunks.get(chunkIndex);
  }

  /**
   * Get loading progress
   */
  getProgress(): { loaded: number; total: number; percentage: number } {
    const loaded = Array.from(this.loadedChunks.values()).reduce(
      (sum, chunk) => sum + chunk.length,
      0
    );

    return {
      loaded,
      total: this.totalItems,
      percentage: this.totalItems > 0 ? (loaded / this.totalItems) * 100 : 0,
    };
  }

  /**
   * Clear loaded data
   */
  clear(): void {
    this.loadedChunks.clear();
    this.loadingChunks.clear();
    this.totalItems = 0;
  }
}

/**
 * Stream data in chunks
 */
export async function* streamData<T>(
  dataSource: (offset: number, limit: number) => Promise<{ data: T[]; total: number }>,
  chunkSize = 5000
): AsyncGenerator<T[], void, unknown> {
  // Get first chunk to determine total
  const firstChunk = await dataSource(0, chunkSize);
  yield firstChunk.data;

  const totalChunks = Math.ceil(firstChunk.total / chunkSize);

  // Stream remaining chunks
  for (let i = 1; i < totalChunks; i++) {
    const offset = i * chunkSize;
    const result = await dataSource(offset, chunkSize);
    yield result.data;
  }
}

/**
 * Load data with retry logic
 */
export async function loadWithRetry<T>(
  fetcher: () => Promise<T>,
  maxRetries = 3,
  retryDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetcher();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed after retries');
}

/**
 * Batch process data in chunks
 */
export async function batchProcess<T, R>(
  data: T[],
  processor: (batch: T[]) => Promise<R>,
  batchSize = 1000,
  onProgress?: (processed: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, data.length);
    const batch = data.slice(start, end);

    const result = await processor(batch);
    results.push(result);

    onProgress?.(end, data.length);
  }

  return results;
}
