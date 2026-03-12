/**
 * Data.gov.rs API Client Configuration
 *
 * This module provides a configured Axios client for interacting with the
 * Serbian Government Open Data Portal API (data.gov.rs)
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API Configuration interface
interface DataGovRsConfig {
  baseURL: string;
  apiKey?: string;
  timeout: number;
  enableCache: boolean;
  cacheTTL: number;
}

// Default configuration
const DEFAULT_CONFIG: DataGovRsConfig = {
  baseURL: process.env.NEXT_PUBLIC_DATA_GOV_RS_API_URL || 'https://data.gov.rs/api/1',
  apiKey: process.env.DATA_GOV_RS_API_KEY,
  timeout: parseInt(process.env.DATA_GOV_RS_API_TIMEOUT || '30000', 10),
  enableCache: process.env.ENABLE_API_CACHE === 'true',
  cacheTTL: parseInt(process.env.API_CACHE_TTL || '3600', 10), // 1 hour default
};

/**
 * Create a configured Axios instance for data.gov.rs API
 */
export function createDataGovRsClient(config: Partial<DataGovRsConfig> = {}): AxiosInstance {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const axiosConfig: AxiosRequestConfig = {
    baseURL: finalConfig.baseURL,
    timeout: finalConfig.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  // Add API key if available
  if (finalConfig.apiKey) {
    axiosConfig.headers!['X-API-KEY'] = finalConfig.apiKey;
  }

  const client = axios.create(axiosConfig);

  // Request interceptor
  client.interceptors.request.use(
    (request) => {
      // Add timestamp to prevent caching issues
      if (request.method === 'get') {
        request.params = {
          ...request.params,
          _: Date.now(),
        };
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DataGov.rs API] ${request.method?.toUpperCase()} ${request.url}`);
      }

      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DataGov.rs API] Response:`, response.status, response.config.url);
      }

      return response;
    },
    (error) => {
      // Handle errors
      if (error.response) {
        // Server responded with error status
        console.error('[DataGov.rs API] Error Response:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url,
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error('[DataGov.rs API] No Response:', error.message);
      } else {
        // Something happened in setting up the request
        console.error('[DataGov.rs API] Request Error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return client;
}

// Default client instance
export const dataGovRsClient = createDataGovRsClient();

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Datasets
  DATASETS: '/datasets/',
  DATASET: (id: string) => `/datasets/${id}/`,
  DATASET_RESOURCES: (id: string) => `/datasets/${id}/resources/`,
  DATASET_SUGGEST: '/datasets/suggest/',

  // Organizations
  ORGANIZATIONS: '/organizations/',
  ORGANIZATION: (id: string) => `/organizations/${id}/`,
  ORGANIZATION_DATASETS: (id: string) => `/organizations/${id}/datasets/`,

  // Reuses
  REUSES: '/reuses/',
  REUSE: (id: string) => `/reuses/${id}/`,

  // Spatial/Geo
  SPATIAL_ZONES: '/spatial/zones/',
  SPATIAL_ZONE: (id: string) => `/spatial/zone/${id}/`,
  SPATIAL_SUGGEST: '/spatial/zones/suggest/',

  // Tags
  TAGS_SUGGEST: '/tags/suggest/',

  // Posts/News
  POSTS: '/posts/',
  POST: (id: string) => `/posts/${id}/`,

  // Topics
  TOPICS: '/topics/',
  TOPIC: (id: string) => `/topics/${id}/`,

  // Site information
  SITE: '/site/',
  SITE_HOME_DATASETS: '/site/home/datasets/',
  SITE_HOME_REUSES: '/site/home/reuses/',

  // Activity
  ACTIVITY: '/activity',

  // Search
  SEARCH: (query: string) => `/datasets/?q=${encodeURIComponent(query)}`,
} as const;

/**
 * API Response Types
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
  next_page?: string;
  previous_page?: string;
}

export interface Dataset {
  id: string;
  title: string;
  acronym?: string;
  slug: string;
  description: string;
  created_at: string;
  last_modified: string;
  last_update: string;
  frequency: string;
  tags: string[];
  resources: Resource[];
  organization?: Organization;
  metrics?: Record<string, number>;
  spatial?: SpatialCoverage;
  temporal_coverage?: TemporalCoverage;
  license: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  filetype: 'file' | 'remote';
  format: string;
  url: string;
  filesize?: number;
  mime?: string;
  created_at: string;
  last_modified: string;
}

export interface Organization {
  id: string;
  name: string;
  acronym?: string;
  slug: string;
  description: string;
  logo?: string;
  logo_thumbnail?: string;
  metrics?: Record<string, number>;
}

export interface SpatialCoverage {
  geom?: GeoJSON;
  granularity?: string;
  zones?: string[];
}

export interface TemporalCoverage {
  start: string;
  end?: string;
}

export interface GeoJSON {
  type: string;
  coordinates: number[] | number[][];
}

/**
 * Helper function to handle API errors
 */
export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`DataGov.rs API Error: ${message}`);
  }
  throw error;
}

/**
 * Fetch datasets with pagination
 */
export async function fetchDatasets(page = 1, pageSize = 20): Promise<PaginatedResponse<Dataset>> {
  try {
    const response = await dataGovRsClient.get<PaginatedResponse<Dataset>>(
      API_ENDPOINTS.DATASETS,
      {
        params: { page, page_size: pageSize },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Fetch a single dataset by ID or slug
 */
export async function fetchDataset(id: string): Promise<Dataset> {
  try {
    const response = await dataGovRsClient.get<Dataset>(API_ENDPOINTS.DATASET(id));
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Search datasets
 */
export async function searchDatasets(
  query: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Dataset>> {
  try {
    const response = await dataGovRsClient.get<PaginatedResponse<Dataset>>(
      API_ENDPOINTS.DATASETS,
      {
        params: { q: query, page, page_size: pageSize },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Fetch organizations
 */
export async function fetchOrganizations(
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Organization>> {
  try {
    const response = await dataGovRsClient.get<PaginatedResponse<Organization>>(
      API_ENDPOINTS.ORGANIZATIONS,
      {
        params: { page, page_size: pageSize },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export type { DataGovRsConfig };
