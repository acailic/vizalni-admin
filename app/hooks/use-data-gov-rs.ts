/**
 * Custom React hook for fetching data from data.gov.rs API
 * Works with static export on GitHub Pages via client-side fetching
 */

import { useState, useEffect } from "react";

import {
  dataGovRsClient,
  getBestVisualizationResource,
  isSupportedFormat,
  parseCSVLine,
} from "@/domain/data-gov-rs";
import type { DatasetMetadata, Resource } from "@/domain/data-gov-rs/types";
import type { DemoDatasetInfo } from "@/types/demos";

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
  fallbackDatasetInfo?: Partial<DatasetMetadata> | DemoDatasetInfo;
  fallbackData?: any[];
  /**
   * Limit search to specific organizations.
   */
  organizationSlugs?: string[];
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
   * Whether fallback demo data is being used
   */
  usingFallback: boolean;

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
    fallbackData,
  } = options;

  const [dataset, setDataset] = useState<DatasetMetadata | null>(null);
  const [resource, setResource] = useState<Resource | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const getFallbackDataset = (
    fallbackInfo: Partial<DatasetMetadata> | DemoDatasetInfo | undefined
  ): DatasetMetadata => {
    const organizationValue = (fallbackInfo as DemoDatasetInfo | undefined)
      ?.organization;
    const organization =
      typeof organizationValue === "string"
        ? { id: "demo-org", name: organizationValue, title: organizationValue }
        : ((fallbackInfo as Partial<DatasetMetadata> | undefined)
            ?.organization ?? {
            id: "demo-org",
            name: "Demo data.gov.rs",
            title: "Demo data.gov.rs",
          });

    return {
      id:
        (fallbackInfo as Partial<DatasetMetadata> | undefined)?.id ??
        "demo-fallback",
      title: fallbackInfo?.title ?? "Demo fallback data",
      description:
        (fallbackInfo as Partial<DatasetMetadata> | undefined)?.description ??
        "",
      organization,
      resources:
        (fallbackInfo as Partial<DatasetMetadata> | undefined)?.resources ?? [],
      tags: (fallbackInfo as Partial<DatasetMetadata> | undefined)?.tags ?? [],
      created_at:
        (fallbackInfo as Partial<DatasetMetadata> | undefined)?.created_at ??
        "",
      updated_at:
        (fallbackInfo as Partial<DatasetMetadata> | undefined)?.updated_at ??
        "",
      page: (fallbackInfo as Partial<DatasetMetadata> | undefined)?.page,
      frequency: (fallbackInfo as Partial<DatasetMetadata> | undefined)
        ?.frequency,
      spatial: (fallbackInfo as Partial<DatasetMetadata> | undefined)?.spatial,
      temporal_start: (fallbackInfo as Partial<DatasetMetadata> | undefined)
        ?.temporal_start,
      temporal_end: (fallbackInfo as Partial<DatasetMetadata> | undefined)
        ?.temporal_end,
      license: (fallbackInfo as Partial<DatasetMetadata> | undefined)?.license,
      license_url: (fallbackInfo as Partial<DatasetMetadata> | undefined)
        ?.license_url,
    };
  };

  const applyFallback = (
    fallbackInfo: Partial<DatasetMetadata> | DemoDatasetInfo | undefined,
    fallback: any[]
  ) => {
    setDataset(getFallbackDataset(fallbackInfo));
    setResource(null);
    setData(fallback);
    setUsingFallback(true);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Defensive check for fallbackData availability and GitHub Pages detection
      if (
        process.env.NEXT_PUBLIC_BASE_PATH &&
        fallbackData &&
        fallbackData.length > 0
      ) {
        // On GitHub Pages, use fallback data directly (static export limitation)
        applyFallback(fallbackDatasetInfo, fallbackData);
        return;
      }

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
            const bestResource = getBestVisualizationResource(ds);
            if (bestResource) {
              fetchedDataset = ds;
              setDataset(fetchedDataset);
              const resourceData = await loadResourceData(
                bestResource,
                parseCSV
              );
              setResource(bestResource);
              setData(resourceData);
              return;
            }
            // Unsupported resources in this dataset; try next strategy
            console.warn("No visualizable resource in dataset", id);
          }
        } catch (idErr) {
          // Continue to other strategies
          console.warn("Dataset ID lookup failed", id, idErr);
        }
      }

      if (searchQuery || preferredTags || slugKeywords) {
        const queries = Array.isArray(searchQuery)
          ? searchQuery
          : searchQuery
            ? [searchQuery]
            : [];
        const keywords = slugKeywords ?? [];

        const foundDataset = await discoverDataset({
          queries,
          tags: preferredTags ?? [],
          keywords,
          organizationSlugs: options.organizationSlugs ?? [],
          triedIds: idsToTry,
        });

        if (!foundDataset) {
          if (fallbackData && fallbackData.length > 0) {
            // Use fallback data instead of throwing error
            applyFallback(fallbackDatasetInfo, fallbackData);
            return;
          }
          // Only throw error if no fallback is available
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
        throw new Error("Either datasetId or searchQuery must be provided");
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
        throw new Error("No suitable resource found for visualization");
      }

      setResource(bestResource);
      const resourceData = await loadResourceData(bestResource, parseCSV);
      setData(resourceData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Unknown error occurred");

      if (fallbackData && fallbackData.length > 0) {
        // Use fallback data and don't show error to user
        applyFallback(fallbackDatasetInfo, fallbackData);
        setError(null);
        // Only log as info, not error
        if (process.env.NODE_ENV === 'development') {
          console.info(
            "📊 Using demo data (data.gov.rs API not available):",
            errorMessage.message
          );
        }
      } else {
        // No fallback available - this is a real error
        setError(errorMessage);
        console.error("useDataGovRs error:", errorMessage);
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
    usingFallback,
    refetch: fetchData,
  };
}

/**
 * Production-ready CSV parser
 * Handles quoted fields, different line endings, and empty rows
 */
async function loadResourceData(bestResource: Resource, parseCSV: boolean) {
  const format = bestResource.format.toUpperCase();

  if (format === "JSON") {
    return dataGovRsClient.getResourceJSON(bestResource);
  }

  if (format === "CSV" && parseCSV) {
    const csvText = await dataGovRsClient.getResourceData(bestResource);
    return parseCSVData(csvText);
  }

  if (format === "XLS" || format === "XLSX") {
    const buffer = await dataGovRsClient.getResourceArrayBuffer(bestResource);
    return parseExcelData(buffer);
  }

  return dataGovRsClient.getResourceData(bestResource);
}

async function parseExcelData(buffer: ArrayBuffer): Promise<any[]> {
  // Dynamic import to keep bundle size low
  const ExcelJS = await import('exceljs');
  const Workbook = ExcelJS.Workbook || ExcelJS.default.Workbook;

  const workbook = new Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const rows: any[] = [];
  const headers: string[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.eachCell((cell, colNumber) => {
        // ExcelJS uses 1-based indexing for columns
        headers[colNumber] = cell.text;
      });
    } else {
      const rowData: Record<string, any> = {};
      let hasData = false;

      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber];
        if (header) {
          // Handle different cell types
          let value = cell.value;

          // Handle rich text
          if (typeof value === 'object' && value !== null && 'richText' in value) {
            value = (value as any).richText.map((t: any) => t.text).join('');
          }

          // Handle formulas
          if (typeof value === 'object' && value !== null && 'result' in value) {
            value = (value as any).result;
          }

          // Handle hyperlinks
          if (typeof value === 'object' && value !== null && 'text' in value && 'hyperlink' in value) {
            value = (value as any).text;
          }

          rowData[header] = value;
          hasData = true;
        }
      });

      if (hasData) {
        rows.push(rowData);
      }
    }
  });

  return rows;
}

function parseCSVData(csv: string): any[] {
  // Normalize line endings to \n (handles \r\n, \r, and \n)
  const normalizedCsv = csv.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Split into lines and filter out empty rows
  const lines = normalizedCsv.split("\n").filter((line) => line.trim());

  if (lines.length === 0) {
    return [];
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);

  // Parse rows
  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const obj: Record<string, any> = {};

    headers.forEach((header, index) => {
      const value = values[index] || "";
      // Try to parse numbers
      const numValue = parseFloat(value);
      obj[header] = isNaN(numValue) ? value : numValue;
    });

    return obj;
  });

  return rows;
}

/**
 * Discover a dataset using the preferred priority: tag -> slug keyword -> full-text query.
 */
async function discoverDataset({
  tags,
  keywords,
  queries,
  organizationSlugs,
  triedIds,
}: {
  tags: string[];
  keywords: string[];
  queries: string[];
  organizationSlugs: string[];
  triedIds: string[];
}): Promise<DatasetMetadata | null> {
  const seen = new Set<string>(triedIds);

  const pickDataset = (candidates: DatasetMetadata[]) =>
    candidates.find(
      (d) => !seen.has(d.id) && d.resources.some((r) => isSupportedFormat(r))
    ) || null;

  // 1) tag search first
  for (const tag of tags) {
    const res = await dataGovRsClient.searchDatasets({ tag, page_size: 20 });
    const candidate = pickDataset(res.data);
    if (candidate) return candidate;
    res.data.forEach((d) => seen.add(d.id));
  }

  // 2) keyword in slug/title (full-text search)
  for (const kw of keywords) {
    const res = await dataGovRsClient.searchDatasets({ q: kw, page_size: 20 });
    const filtered = res.data.filter(
      (d) =>
        d.slug?.includes(kw) ||
        d.title.toLowerCase().includes(kw.toLowerCase()) ||
        (d.tags || []).some((t) => t.includes(kw))
    );
    const candidate = pickDataset(filtered.length > 0 ? filtered : res.data);
    if (candidate) return candidate;
    res.data.forEach((d) => seen.add(d.id));
  }

  // 3) generic queries
  for (const q of queries) {
    const res = await dataGovRsClient.searchDatasets({ q, page_size: 20 });
    const candidate = pickDataset(res.data);
    if (candidate) return candidate;
    res.data.forEach((d) => seen.add(d.id));
  }

  // 4) organization filter as last resort
  for (const org of organizationSlugs) {
    const res = await dataGovRsClient.searchDatasets({
      organization: org,
      page_size: 20,
    });
    const candidate = pickDataset(res.data);
    if (candidate) return candidate;
    res.data.forEach((d) => seen.add(d.id));
  }

  return null;
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

  const search = async (
    query: string,
    page: number = 1,
    pageSize: number = 20
  ) => {
    try {
      setLoading(true);
      setError(null);

      const results = await dataGovRsClient.searchDatasets({
        q: query,
        page,
        page_size: pageSize,
      });

      setDatasets(results.data);
      setTotal(results.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Search failed");
      setError(errorMessage);
      console.error("useDataGovRsSearch error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    datasets,
    total,
    loading,
    error,
    search,
  };
}
