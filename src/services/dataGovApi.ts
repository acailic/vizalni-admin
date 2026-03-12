/**
 * Data.gov.rs API Service
 * Integration layer for Serbia's Open Data Portal API
 */

import type {
  Dataset,
  Organization,
  Topic,
  Reuse,
  Post,
} from '@/types/api'

import type { ApiResponse } from '@/types'
import type { BrowseSearchParams as SearchParams } from '@/types/browse'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://data.gov.rs/api/1'
const API_TIMEOUT = Number(process.env.API_TIMEOUT) || 30000

interface FetchOptions {
  timeout?: number
  headers?: Record<string, string>
}

/**
 * Generic fetch wrapper with timeout and error handling
 */
async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = API_TIMEOUT, headers = {} } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }

    throw new Error('Unknown error occurred')
  }
}

/**
 * Dataset API endpoints
 */
export const datasetsApi = {
  /**
   * Get all datasets with pagination and filters
   */
  async list(params: SearchParams = {}): Promise<ApiResponse<Dataset[]>> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set('page', String(params.page))
    if (params.pageSize) searchParams.set('page_size', String(params.pageSize))
    if (params.q) searchParams.set('q', params.q)
    if (params.sort) searchParams.set('sort', params.sort)
    if (params.organization) searchParams.set('organization', params.organization)
    if (params.topic) searchParams.set('topic', params.topic)
    if (params.tag) searchParams.set('tag', params.tag)
    if (params.license) searchParams.set('license', params.license)
    if (params.format) searchParams.set('format', params.format)

    const queryString = searchParams.toString()
    const endpoint = `/datasets/${queryString ? `?${queryString}` : ''}`

    return fetchApi<ApiResponse<Dataset[]>>(endpoint)
  },

  /**
   * Get a single dataset by ID or slug
   */
  async get(id: string): Promise<Dataset> {
    return fetchApi<Dataset>(`/datasets/${id}/`)
  },

  /**
   * Get featured datasets
   */
  async featured(pageSize: number = 12): Promise<ApiResponse<Dataset[]>> {
    return fetchApi<ApiResponse<Dataset[]>>(`/datasets/?featured=true&page_size=${pageSize}`)
  },

  /**
   * Get recent datasets
   */
  async recent(pageSize: number = 12): Promise<ApiResponse<Dataset[]>> {
    return fetchApi<ApiResponse<Dataset[]>>(`/datasets/?sort=-created&page_size=${pageSize}`)
  },

  /**
   * Search datasets
   */
  async search(query: string, pageSize: number = 20): Promise<ApiResponse<Dataset[]>> {
    return fetchApi<ApiResponse<Dataset[]>>(
      `/datasets/?q=${encodeURIComponent(query)}&page_size=${pageSize}`
    )
  },
}

/**
 * Organization API endpoints
 */
export const organizationsApi = {
  /**
   * Get all organizations
   */
  async list(pageSize: number = 100): Promise<ApiResponse<Organization[]>> {
    return fetchApi<ApiResponse<Organization[]>>(`/organizations/?page_size=${pageSize}`)
  },

  /**
   * Get a single organization by ID or slug
   */
  async get(id: string): Promise<Organization> {
    return fetchApi<Organization>(`/organizations/${id}/`)
  },

  /**
   * Get organization datasets
   */
  async datasets(orgId: string, pageSize: number = 20): Promise<ApiResponse<Dataset[]>> {
    return fetchApi<ApiResponse<Dataset[]>>(
      `/datasets/?organization=${orgId}&page_size=${pageSize}`
    )
  },
}

/**
 * Topics API endpoints
 */
export const topicsApi = {
  /**
   * Get all topics
   */
  async list(): Promise<ApiResponse<Topic[]>> {
    return fetchApi<ApiResponse<Topic[]>>('/topics/')
  },

  /**
   * Get a single topic by ID or slug
   */
  async get(id: string): Promise<Topic> {
    return fetchApi<Topic>(`/topics/${id}/`)
  },

  /**
   * Get datasets by topic
   */
  async datasets(topicId: string, pageSize: number = 20): Promise<ApiResponse<Dataset[]>> {
    return fetchApi<ApiResponse<Dataset[]>>(`/datasets/?topic=${topicId}&page_size=${pageSize}`)
  },
}

/**
 * Reuses API endpoints
 */
export const reusesApi = {
  /**
   * Get all reuses
   */
  async list(pageSize: number = 100): Promise<ApiResponse<Reuse[]>> {
    return fetchApi<ApiResponse<Reuse[]>>(`/reuses/?page_size=${pageSize}`)
  },

  /**
   * Get a single reuse by ID or slug
   */
  async get(id: string): Promise<Reuse> {
    return fetchApi<Reuse>(`/reuses/${id}/`)
  },

  /**
   * Get featured reuses
   */
  async featured(pageSize: number = 12): Promise<ApiResponse<Reuse[]>> {
    return fetchApi<ApiResponse<Reuse[]>>(`/reuses/?featured=true&page_size=${pageSize}`)
  },
}

/**
 * Posts/News API endpoints
 */
export const postsApi = {
  /**
   * Get all posts
   */
  async list(pageSize: number = 20): Promise<ApiResponse<Post[]>> {
    return fetchApi<ApiResponse<Post[]>>(`/posts/?page_size=${pageSize}`)
  },

  /**
   * Get a single post by ID or slug
   */
  async get(id: string): Promise<Post> {
    return fetchApi<Post>(`/posts/${id}/`)
  },
}

/**
 * Aggregate statistics
 */
export const statsApi = {
  /**
   * Get portal statistics
   */
  async get(): Promise<{
    datasets: number
    organizations: number
    reuses: number
    users: number
    resources: number
    discussions: number
  }> {
    // This would typically come from a dedicated endpoint
    // For now, we'll aggregate from available data
    const [datasets, orgs, reuses] = await Promise.all([
      datasetsApi.list({ pageSize: 1 }),
      organizationsApi.list(1),
      reusesApi.list(1),
    ])

    return {
      datasets: datasets.meta?.total ?? 0,
      organizations: orgs.meta?.total ?? 0,
      reuses: reuses.meta?.total ?? 0,
      users: 0, // Would need dedicated endpoint
      resources: 0, // Would need dedicated endpoint
      discussions: 0, // Would need dedicated endpoint
    }
  },
}

// Export all API modules
export const dataGovRsApi = {
  datasets: datasetsApi,
  organizations: organizationsApi,
  topics: topicsApi,
  reuses: reusesApi,
  posts: postsApi,
  stats: statsApi,
}

export default dataGovRsApi
