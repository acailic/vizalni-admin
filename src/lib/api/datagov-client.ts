/**
 * Data.gov.rs API Client
 * 
 * Official API Documentation: https://data.gov.rs/api/1/swagger.json
 * Base URL: https://data.gov.rs/api/1/
 */

import type {
  Dataset,
  DatasetPage,
  DatasetQueryParams,
  Organization,
  OrganizationPage,
  OrganizationQueryParams,
  Reuse,
  ReusePage,
  ReuseQueryParams,
  Topic,
  TopicPage,
  Resource,
  CommunityResource,
  Discussion,
  DiscussionPage,
  Frequency,
  License,
  ResourceType,
  Dataservice,
  DataservicePage,
} from '@/types/datagov-api';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_DATA_GOV_API_URL || 'https://data.gov.rs/api/1';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000', 10);
const API_RETRY_ATTEMPTS = parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10);
const API_CACHE_ENABLED = process.env.API_CACHE_ENABLED === 'true';
const API_CACHE_TTL = parseInt(process.env.API_CACHE_TTL || '300', 10) * 1000; // Convert to milliseconds

// ============================================================================
// Types
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

// ============================================================================
// Error Handling
// ============================================================================

export class DataGovAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'DataGovAPIError';
  }
}

// ============================================================================
// Cache Management
// ============================================================================

const cache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(url: string, params?: RequestOptions): string {
  const paramStr = params ? JSON.stringify(params) : '';
  return `${url}:${paramStr}`;
}

function getFromCache<T>(key: string): T | null {
  if (!API_CACHE_ENABLED) return null;

  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > API_CACHE_TTL;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  if (!API_CACHE_ENABLED) return;
  cache.set(key, { data, timestamp: Date.now() });
}

// ============================================================================
// HTTP Client
// ============================================================================

async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new DataGovAPIError('Request timeout', undefined, undefined, url);
    }
    throw error;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  retryCount = 0
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const cacheKey = getCacheKey(url, options);

  // Check cache first for GET requests
  if (!options.method || options.method === 'GET') {
    const cached = getFromCache<T>(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
      throw new DataGovAPIError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText,
        endpoint
      );
    }

    const data = await response.json();

    // Cache successful GET requests
    if (!options.method || options.method === 'GET') {
      setCache(cacheKey, data);
    }

    return data;
  } catch (error) {
    // Retry logic
    if (retryCount < API_RETRY_ATTEMPTS && error instanceof DataGovAPIError) {
      console.warn(`Retrying request to ${endpoint} (attempt ${retryCount + 1}/${API_RETRY_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return request<T>(endpoint, options, retryCount + 1);
    }

    throw error;
  }
}

// ============================================================================
// Dataset API
// ============================================================================

export const datasets = {
  /**
   * List or search datasets
   */
  list: async (params?: DatasetQueryParams): Promise<DatasetPage> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      });
    }

    const query = searchParams.toString();
    return request<DatasetPage>(`/datasets/${query ? `?${query}` : ''}`);
  },

  /**
   * Get a specific dataset by ID or slug
   */
  get: async (id: string): Promise<Dataset> => {
    return request<Dataset>(`/datasets/${id}/`);
  },

  /**
   * Get dataset resources
   */
  resources: async (datasetId: string): Promise<Resource[]> => {
    const dataset = await request<Dataset>(`/datasets/${datasetId}/`);
    return dataset.resources;
  },

  /**
   * Get a specific resource from a dataset
   */
  getResource: async (datasetId: string, resourceId: string): Promise<Resource> => {
    return request<Resource>(`/datasets/${datasetId}/resources/${resourceId}/`);
  },

  /**
   * Get dataset suggestions for search autocomplete
   */
  suggest: async (query: string, size = 10): Promise<Dataset[]> => {
    const searchParams = new URLSearchParams({
      q: query,
      size: String(size),
    });
    return request<Dataset[]>(`/datasets/suggest/?${searchParams}`);
  },

  /**
   * Get available frequencies
   */
  frequencies: async (): Promise<Frequency[]> => {
    return request<Frequency[]>('/datasets/frequencies/');
  },

  /**
   * Get available licenses
   */
  licenses: async (): Promise<License[]> => {
    return request<License[]>('/datasets/licenses/');
  },

  /**
   * Get resource types
   */
  resourceTypes: async (): Promise<ResourceType[]> => {
    return request<ResourceType[]>('/datasets/resource_types/');
  },

  /**
   * Get available badges
   */
  badges: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/datasets/badges/');
  },

  /**
   * Get community resources
   */
  communityResources: async (params?: {
    dataset?: string;
    organization?: string;
    owner?: string;
    sort?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ data: CommunityResource[]; total: number }> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }

    return request<{ data: CommunityResource[]; total: number }>(
      `/datasets/community_resources/${searchParams.toString() ? `?${searchParams}` : ''}`
    );
  },
};

// ============================================================================
// Organization API
// ============================================================================

export const organizations = {
  /**
   * List or search organizations
   */
  list: async (params?: OrganizationQueryParams): Promise<OrganizationPage> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }

    const query = searchParams.toString();
    return request<OrganizationPage>(`/organizations/${query ? `?${query}` : ''}`);
  },

  /**
   * Get a specific organization by ID or slug
   */
  get: async (id: string): Promise<Organization> => {
    return request<Organization>(`/organizations/${id}/`);
  },

  /**
   * Get organization datasets
   */
  datasets: async (orgId: string, params?: DatasetQueryParams): Promise<DatasetPage> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      });
    }

    const query = searchParams.toString();
    return request<DatasetPage>(`/organizations/${orgId}/datasets/${query ? `?${query}` : ''}`);
  },

  /**
   * Get organization reuses
   */
  reuses: async (orgId: string): Promise<Reuse[]> => {
    return request<Reuse[]>(`/organizations/${orgId}/reuses/`);
  },

  /**
   * Get organization suggestions for search autocomplete
   */
  suggest: async (query: string, size = 10): Promise<Organization[]> => {
    const searchParams = new URLSearchParams({
      q: query,
      size: String(size),
    });
    return request<Organization[]>(`/organizations/suggest/?${searchParams}`);
  },

  /**
   * Get available badges
   */
  badges: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/organizations/badges/');
  },
};

// ============================================================================
// Reuse API
// ============================================================================

export const reuses = {
  /**
   * List or search reuses
   */
  list: async (params?: ReuseQueryParams): Promise<ReusePage> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }

    const query = searchParams.toString();
    return request<ReusePage>(`/reuses/${query ? `?${query}` : ''}`);
  },

  /**
   * Get a specific reuse by ID or slug
   */
  get: async (id: string): Promise<Reuse> => {
    return request<Reuse>(`/reuses/${id}/`);
  },

  /**
   * Get reuse suggestions for search autocomplete
   */
  suggest: async (query: string, size = 10): Promise<Reuse[]> => {
    const searchParams = new URLSearchParams({
      q: query,
      size: String(size),
    });
    return request<Reuse[]>(`/reuses/suggest/?${searchParams}`);
  },

  /**
   * Get available topics
   */
  topics: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/reuses/topics/');
  },

  /**
   * Get available types
   */
  types: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/reuses/types/');
  },
};

// ============================================================================
// Topic API
// ============================================================================

export const topics = {
  /**
   * List topics
   */
  list: async (params?: {
    q?: string;
    tag?: string[];
    geozone?: string;
    organization?: string;
    owner?: string;
    sort?: string;
    page?: number;
    page_size?: number;
  }): Promise<TopicPage> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      });
    }

    const query = searchParams.toString();
    return request<TopicPage>(`/topics/${query ? `?${query}` : ''}`);
  },

  /**
   * Get a specific topic by ID or slug
   */
  get: async (id: string): Promise<Topic> => {
    return request<Topic>(`/topics/${id}/`);
  },
};

// ============================================================================
// Contact Points API
// ============================================================================

export const contacts = {
  /**
   * Get contact point roles
   */
  roles: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/contacts/roles/');
  },
};

// ============================================================================
// Discussions API
// ============================================================================

export const discussions = {
  /**
   * List discussions
   */
  list: async (params?: {
    sort?: string;
    closed?: boolean;
    for?: string[];
    org?: string;
    user?: string;
    page?: number;
    page_size?: number;
  }): Promise<DiscussionPage> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      });
    }

    const query = searchParams.toString();
    return request<DiscussionPage>(`/discussions/${query ? `?${query}` : ''}`);
  },

  /**
   * Get a specific discussion by ID
   */
  get: async (id: string): Promise<Discussion> => {
    return request<Discussion>(`/discussions/${id}/`);
  },
};

// ============================================================================
// Dataservices API
// ============================================================================

export const dataservices = {
  /**
   * List or search dataservices
   */
  list: async (params?: {
    q?: string;
    owner?: string;
    organization?: string;
    tag?: string;
    contact_point?: string;
    dataset?: string;
    access_type?: 'open' | 'open_with_account' | 'restricted';
    sort?: string;
    page?: number;
    page_size?: number;
  }): Promise<DataservicePage> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }

    const query = searchParams.toString();
    return request<DataservicePage>(`/dataservices/${query ? `?${query}` : ''}`);
  },

  /**
   * Get a specific dataservice by ID or slug
   */
  get: async (id: string): Promise<Dataservice> => {
    return request<Dataservice>(`/dataservices/${id}/`);
  },
};

// ============================================================================
// Site API
// ============================================================================

export const site = {
  /**
   * Get site-wide information
   */
  info: async (): Promise<{ id: string; title: string; metrics: Record<string, number> }> => {
    return request<{ id: string; title: string; metrics: Record<string, number> }>('/site/');
  },

  /**
   * Get homepage featured datasets
   */
  homeDatasets: async (): Promise<Dataset[]> => {
    return request<Dataset[]>('/site/home/datasets/');
  },

  /**
   * Get homepage featured reuses
   */
  homeReuses: async (): Promise<Reuse[]> => {
    return request<Reuse[]>('/site/home/reuses/');
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clear the API cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > API_CACHE_TTL) {
      cache.delete(key);
    }
  }
}

/**
 * Export a singleton instance with all API methods
 */
export const dataGovAPI = {
  datasets,
  organizations,
  reuses,
  topics,
  contacts,
  discussions,
  dataservices,
  site,
  clearCache,
  clearExpiredCache,
};

export default dataGovAPI;
