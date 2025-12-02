/**
 * Data Sampler
 *
 * Intelligent sampling strategies for large datasets to generate previews
 * and reduce memory usage while maintaining data characteristics.
 */

export type SamplingStrategy =
  | 'random'
  | 'systematic'
  | 'stratified'
  | 'reservoir'
  | 'first'
  | 'last';

export interface SamplingOptions {
  /** Sampling strategy to use */
  strategy?: SamplingStrategy;
  /** Target sample size */
  sampleSize: number;
  /** Random seed for reproducibility */
  seed?: number;
  /** Stratification column (for stratified sampling) */
  stratifyBy?: string;
  /** Preserve temporal ordering */
  preserveOrder?: boolean;
}

/**
 * Sample data using various strategies
 */
export class DataSampler<T = any> {
  private rng: () => number;

  constructor(seed?: number) {
    // Simple seeded random number generator
    if (seed !== undefined) {
      let s = seed;
      this.rng = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    } else {
      this.rng = Math.random;
    }
  }

  /**
   * Sample data using specified strategy
   */
  sample(data: T[], options: SamplingOptions): T[] {
    const { strategy = 'random', sampleSize, preserveOrder = false } = options;

    // If sample size >= data size, return all data
    if (sampleSize >= data.length) {
      return data;
    }

    let sampled: T[];

    switch (strategy) {
      case 'random':
        sampled = this.randomSample(data, sampleSize);
        break;
      case 'systematic':
        sampled = this.systematicSample(data, sampleSize);
        break;
      case 'stratified':
        sampled = this.stratifiedSample(data, sampleSize, options.stratifyBy);
        break;
      case 'reservoir':
        sampled = this.reservoirSample(data, sampleSize);
        break;
      case 'first':
        sampled = data.slice(0, sampleSize);
        break;
      case 'last':
        sampled = data.slice(-sampleSize);
        break;
      default:
        sampled = this.randomSample(data, sampleSize);
    }

    // Preserve original order if requested
    if (preserveOrder && strategy !== 'first' && strategy !== 'last') {
      const positions = new Map<T, number>();

      data.forEach((item, index) => {
        if (!positions.has(item)) {
          positions.set(item, index);
        }
      });

      sampled.sort((a, b) => (positions.get(a) ?? 0) - (positions.get(b) ?? 0));
    }

    return sampled;
  }

  /**
   * Random sampling - select items randomly
   */
  private randomSample(data: T[], sampleSize: number): T[] {
    const indices = new Set<number>();

    while (indices.size < sampleSize) {
      const index = Math.floor(this.rng() * data.length);
      indices.add(index);
    }

    return Array.from(indices).map(i => data[i]);
  }

  /**
   * Systematic sampling - select every nth item
   */
  private systematicSample(data: T[], sampleSize: number): T[] {
    const interval = Math.floor(data.length / sampleSize);
    const start = Math.floor(this.rng() * interval);

    const sampled: T[] = [];
    for (let i = start; i < data.length && sampled.length < sampleSize; i += interval) {
      sampled.push(data[i]);
    }

    return sampled;
  }

  /**
   * Stratified sampling - maintain proportions of categories
   */
  private stratifiedSample(data: T[], sampleSize: number, stratifyBy?: string): T[] {
    if (!stratifyBy) {
      return this.randomSample(data, sampleSize);
    }

    // Group by stratification column
    const groups = new Map<any, T[]>();

    for (const item of data) {
      const key = (item as any)[stratifyBy];
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    }

    // Calculate samples per group
    const sampled: T[] = [];

    for (const groupData of groups.values()) {
      const proportion = groupData.length / data.length;
      const groupSampleSize = Math.max(1, Math.floor(sampleSize * proportion));

      const groupSample = this.randomSample(groupData, Math.min(groupSampleSize, groupData.length));
      sampled.push(...groupSample);
    }

    // If we have too many, trim randomly
    if (sampled.length > sampleSize) {
      return this.randomSample(sampled, sampleSize);
    }

    // If we have too few, add more randomly
    if (sampled.length < sampleSize) {
      const remaining = sampleSize - sampled.length;
      const sampledSet = new Set(sampled);
      const unsampled = data.filter(item => !sampledSet.has(item));
      const additional = this.randomSample(unsampled, remaining);
      sampled.push(...additional);
    }

    return sampled;
  }

  /**
   * Reservoir sampling - efficient for streaming data
   */
  private reservoirSample(data: T[], sampleSize: number): T[] {
    const reservoir: T[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i < sampleSize) {
        reservoir.push(data[i]);
      } else {
        const j = Math.floor(this.rng() * (i + 1));
        if (j < sampleSize) {
          reservoir[j] = data[i];
        }
      }
    }

    return reservoir;
  }
}

/**
 * Adaptive sampling - adjust sample size based on data characteristics
 */
export function adaptiveSample<T>(
  data: T[],
  targetSize: number,
  options: {
    minSize?: number;
    maxSize?: number;
    strategy?: SamplingStrategy;
  } = {}
): T[] {
  const { minSize = 100, maxSize = 10000, strategy = 'systematic' } = options;

  // Adjust sample size based on data size
  let sampleSize = targetSize;

  if (data.length < minSize) {
    // Too small, return all
    return data;
  }

  if (data.length < targetSize) {
    // Smaller than target, return all
    return data;
  }

  // Cap at max size
  sampleSize = Math.min(sampleSize, maxSize);

  // Use at least 1% of data
  sampleSize = Math.max(sampleSize, Math.ceil(data.length * 0.01));

  const sampler = new DataSampler();
  return sampler.sample(data, { sampleSize, strategy });
}

/**
 * Time-based sampling - sample data at regular time intervals
 */
export function timeSample<T extends { timestamp?: number | string | Date }>(
  data: T[],
  intervalMs: number,
  options: {
    startTime?: number;
    endTime?: number;
  } = {}
): T[] {
  // Convert timestamps to numbers
  const withTimestamps = data.map(item => {
    let ts: number;

    if (typeof item.timestamp === 'number') {
      ts = item.timestamp;
    } else if (typeof item.timestamp === 'string') {
      ts = new Date(item.timestamp).getTime();
    } else if (item.timestamp instanceof Date) {
      ts = item.timestamp.getTime();
    } else {
      ts = 0;
    }

    return { item, timestamp: ts };
  });

  // Sort by timestamp
  withTimestamps.sort((a, b) => a.timestamp - b.timestamp);

  const startTime = options.startTime || withTimestamps[0]?.timestamp || 0;
  const endTime = options.endTime || withTimestamps[withTimestamps.length - 1]?.timestamp || 0;

  const sampled: T[] = [];
  let currentTime = startTime;
  let currentIndex = 0;

  while (currentTime <= endTime && currentIndex < withTimestamps.length) {
    // Find closest item to current time
    while (
      currentIndex < withTimestamps.length - 1 &&
      withTimestamps[currentIndex + 1].timestamp <= currentTime
    ) {
      currentIndex++;
    }

    sampled.push(withTimestamps[currentIndex].item);
    currentTime += intervalMs;
  }

  return sampled;
}

/**
 * Statistical summary of sampled data
 */
export interface SampleSummary {
  originalSize: number;
  sampleSize: number;
  samplingRatio: number;
  strategy: SamplingStrategy;
  estimatedMemorySaving: number;
}

export function getSampleSummary<T>(
  originalData: T[],
  sampledData: T[],
  strategy: SamplingStrategy
): SampleSummary {
  const originalSize = originalData.length;
  const sampleSize = sampledData.length;
  const samplingRatio = sampleSize / originalSize;

  // Estimate memory saving (rough approximation)
  const avgItemSize = 100; // bytes
  const originalMemory = originalSize * avgItemSize;
  const sampledMemory = sampleSize * avgItemSize;
  const estimatedMemorySaving = originalMemory - sampledMemory;

  return {
    originalSize,
    sampleSize,
    samplingRatio,
    strategy,
    estimatedMemorySaving,
  };
}
