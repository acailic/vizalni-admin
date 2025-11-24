/**
 * Custom React hook for fetching data from data.gov.rs API
 * Works with static export on GitHub Pages via client-side fetching
 */

import { useState, useEffect } from 'react';

import { dataGovRsClient, getBestVisualizationResource, parseCSVLine } from '@/domain/data-gov-rs';
import type { DatasetMetadata, Resource } from '@/domain/data-gov-rs/types';

interface UseDataGovRsOptions {
  /**
   * Specific dataset ID to fetch
   */
  datasetId?: string;

  /**
   * Search query (or list of queries) to find datasets
   */
  searchQuery?: string | string[];

  /**
   * Dataset IDs to try first, in order.
   */
  preferredDatasetIds?: string[];

  /**
   * Tags to search for (data.gov.rs tag filter).
   */
  preferredTags?: string[];

  /**
   * Keywords to match in slugs/titles (full-text search).
   */
  slugKeywords?: string[];

  /**
   * Auto-fetch on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Parse CSV data automatically
   * @default true
   */
  parseCSV?: boolean;

  /**
   * Optional fallback dataset info and data when the API returns nothing.
   */
  fallbackDatasetInfo?: Partial<DatasetMetadata>;
  fallbackData?: any[];
}

interface UseDataGovRsReturn {
  /**
   * Fetched dataset metadata
   */
  dataset: DatasetMetadata | null;

  /**
   * Best resource for visualization
   */
  resource: Resource | null;

  /**
   * Parsed resource data
   */
  data: any;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error if fetch failed
   */
  error: Error | null;

  /**
   * Manually trigger a refetch
   */
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and parse datasets from data.gov.rs
 *
 * @example
 * ```tsx
 * const { dataset, data, loading, error } = useDataGovRs({
 *   searchQuery: 'budzet',
 *   autoFetch: true
 * });
 * ```
 */
export function useDataGovRs(options: UseDataGovRsOptions): UseDataGovRsReturn {
  const {
    datasetId,
    searchQuery,
    preferredDatasetIds,
    preferredTags,
    slugKeywords,
    autoFetch = true,
    parseCSV = true,
    fallbackDatasetInfo,
    fallbackData
  } = options;

  const [dataset, setDataset] = useState<DatasetMetadata | null>(null);
  const [resource, setResource] = useState<Resource | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const applyFallback = (
    fallbackInfo: Partial<DatasetMetadata> | undefined,
    fallback: any[]
  ) => {
    setDataset(
      (fallbackInfo as DatasetMetadata) || {
        id: 'demo-fallback',
        title: fallbackInfo?.title || 'Demo fallback data',
        organization: {
          title: (fallbackInfo as any)?.organization || 'Demo data.gov.rs'
        }
      } as unknown as DatasetMetadata
    );
    setResource(null);
    setData(fallback);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedDataset: DatasetMetadata;

      const idsToTry = [
        ...(datasetId ? [datasetId] : []),
        ...(preferredDatasetIds ?? []),
      ];

      // Try explicit dataset IDs first
      for (const id of idsToTry) {
        try {
          const ds = await dataGovRsClient.getDataset(id);
          if (ds) {
            fetchedDataset = ds;
            setDataset(fetchedDataset);
            const bestResource = getBestVisualizationResource(fetchedDataset);
            if (bestResource) {
              const resourceData = await loadResourceData(bestResource, parseCSV);
              setResource(bestResource);
              setData(resourceData);
            } else if (fallbackData && fallbackData.length > 0) {
              setResource(null);
              setData(fallbackData);
            } else {
              throw new Error('No suitable resource found for visualization');
            }
            return;
          }
        } catch (idErr) {
          // Continue to other strategies
          console.warn('Dataset ID lookup failed', id, idErr);
        }
      }

      if (searchQuery || preferredTags || slugKeywords) {
        const queries = Array.isArray(searchQuery) ? searchQuery : searchQuery ? [searchQuery] : [];
        const keywords = slugKeywords ?? [];
        let foundDataset: DatasetMetadata | null = null;

        // Try tag searches first
        if (preferredTags && preferredTags.length > 0) {
          for (const tag of preferredTags) {
            const tagResults = await dataGovRsClient.searchDatasets({
              tag,
              page_size: 5
            });
            if (tagResults.data.length > 0) {
              foundDataset = tagResults.data[0];
              break;
            }
          }
        }

        // Try explicit queries
        if (!foundDataset && queries.length > 0) {
          for (const q of queries) {
            const results = await dataGovRsClient.searchDatasets({
              q,
              page_size: 5
            });

            if (results.data.length > 0) {
              foundDataset = results.data[0];
              break;
            }
          }
        }

        // Try keyword search if still not found
        if (!foundDataset && keywords.length > 0) {
          for (const kw of keywords) {
            const results = await dataGovRsClient.searchDatasets({
              q: kw,
              page_size: 5
            });

            if (results.data.length > 0) {
              foundDataset = results.data[0];
              break;
            }
          }
        }

        if (!foundDataset) {
          if (fallbackData && fallbackData.length > 0) {
            applyFallback(fallbackDatasetInfo, fallbackData);
            return;
          }

          throw new Error(
            `No datasets found for queries/tags: ${[
              ...queries,
              ...(preferredTags ?? []),
              ...keywords,
            ]
              .filter(Boolean)
              .map((q) => `"${q}"`)
              .join(", ")}`
          );
        }

        fetchedDataset = foundDataset;
      } else {
        throw new Error('Either datasetId or searchQuery must be provided');
      }

      setDataset(fetchedDataset);

      // Get best resource for visualization
      const bestResource = getBestVisualizationResource(fetchedDataset);

      if (!bestResource) {
        if (fallbackData && fallbackData.length > 0) {
          setResource(null);
          setData(fallbackData);
          return;
        }
        throw new Error('No suitable resource found for visualization');
      }

      setResource(bestResource);
      const resourceData = await loadResourceData(bestResource, parseCSV);
      setData(resourceData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Unknown error occurred');
      if (fallbackData && fallbackData.length > 0) {
        applyFallback(fallbackDatasetInfo, fallbackData);
        setError(null);
        console.warn('useDataGovRs: using fallback demo data due to error:', errorMessage);
      } else {
        setError(errorMessage);
        console.error('useDataGovRs error:', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && (datasetId || searchQuery)) {
      fetchData();
    }
  }, [datasetId, searchQuery, autoFetch]);

  return {
    dataset,
    resource,
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Production-ready CSV parser
 * Handles quoted fields, different line endings, and empty rows
 */
async function loadResourceData(bestResource: Resource, parseCSV: boolean) {
  if (bestResource.format.toUpperCase() === 'JSON') {
    return dataGovRsClient.getResourceJSON(bestResource);
  }
  if (bestResource.format.toUpperCase() === 'CSV' && parseCSV) {
    const csvText = await dataGovRsClient.getResourceData(bestResource);
    return parseCSVData(csvText);
  }
  return dataGovRsClient.getResourceData(bestResource);
}

function parseCSVData(csv: string): any[] {
  // Normalize line endings to \n (handles \r\n, \r, and \n)
  const normalizedCsv = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into lines and filter out empty rows
  const lines = normalizedCsv.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return [];
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);

  // Parse rows
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj: Record<string, any> = {};

    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Try to parse numbers
      const numValue = parseFloat(value);
      obj[header] = isNaN(numValue) ? value : numValue;
    });

    return obj;
  });

  return rows;
}

/**
 * Hook to search datasets from data.gov.rs
 *
 * @example
 * ```tsx
 * const { datasets, loading, error, search } = useDataGovRsSearch();
 *
 * // Trigger search
 * search('budzet');
 * ```
 */
export function useDataGovRsSearch() {
  const [datasets, setDatasets] = useState<DatasetMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const search = async (query: string, page: number = 1, pageSize: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const results = await dataGovRsClient.searchDatasets({
        q: query,
        page,
        page_size: pageSize
      });

      setDatasets(results.data);
      setTotal(results.total);

    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Search failed');
      setError(errorMessage);
      console.error('useDataGovRsSearch error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    datasets,
    total,
    loading,
    error,
    search
  };
}
