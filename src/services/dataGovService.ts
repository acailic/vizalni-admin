import axios, { AxiosInstance, AxiosError } from 'axios'

import { loadDatasetFromUrl } from '@/lib/data'
import type {
  Dataset,
  Organization,
  Topic,
  SearchParams,
  PaginatedResponse,
} from '@/types/api'
import type { ApiError } from '@/types'
import type { DatasetLoadOptions, ParsedDataset } from '@/types/observation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://data.gov.rs'
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || '2'
const API_TIMEOUT = 30000

class DataGovService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Add API key if available
        const apiKey = process.env.DATA_GOV_API_KEY
        if (apiKey) {
          config.headers['X-API-Key'] = apiKey
        }

        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
        }

        return config
      },
      error => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      response => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[API Response] ${response.config.url}`, response.status)
        }
        return response
      },
      (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          status: error.response?.status,
          code: error.code,
          details: error.response?.data?.details,
        }

        if (process.env.NODE_ENV === 'development') {
          console.error('[API Error]', apiError)
        }

        return Promise.reject(apiError)
      }
    )
  }

  /**
   * Get list of datasets with pagination and filters
   */
  async getDatasets(params?: SearchParams): Promise<PaginatedResponse<Dataset>> {
    try {
      const response = await this.client.get('/datasets/', {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || 20,
          organization: params?.organization,
          topic: params?.topic,
          format: params?.format?.join(','),
          q: params?.query,
          sort: params?.sort || '-created',
        },
      })

      return {
        data: response.data.data || response.data.results || [],
        total: response.data.total || response.data.count || 0,
        page: params?.page || 1,
        page_size: params?.pageSize || 20,
        totalPages: Math.ceil(
          (response.data.total || response.data.count || 0) / (params?.pageSize || 20)
        ),
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get single dataset by ID or slug
   */
  async getDataset(id: string): Promise<Dataset> {
    try {
      const response = await this.client.get(`/datasets/${id}/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get dataset resources
   */
  async getDatasetResources(datasetId: string): Promise<Dataset['resources']> {
    try {
      const response = await this.client.get(`/datasets/${datasetId}/resources/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get list of organizations
   */
  async getOrganizations(params?: {
    page?: number
    pageSize?: number
  }): Promise<PaginatedResponse<Organization>> {
    try {
      const response = await this.client.get('/organizations/', {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || 20,
        },
      })

      return {
        data: response.data.data || response.data.results || [],
        total: response.data.total || response.data.count || 0,
        page: params?.page || 1,
        page_size: params?.pageSize || 20,
        totalPages: Math.ceil(
          (response.data.total || response.data.count || 0) / (params?.pageSize || 20)
        ),
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get single organization by ID or slug
   */
  async getOrganization(id: string): Promise<Organization> {
    try {
      const response = await this.client.get(`/organizations/${id}/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get organization datasets
   */
  async getOrganizationDatasets(
    organizationId: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResponse<Dataset>> {
    try {
      const response = await this.client.get(`/organizations/${organizationId}/datasets/`, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || 20,
        },
      })

      return {
        data: response.data.data || response.data.results || [],
        total: response.data.total || response.data.count || 0,
        page: params?.page || 1,
        page_size: params?.pageSize || 20,
        totalPages: Math.ceil(
          (response.data.total || response.data.count || 0) / (params?.pageSize || 20)
        ),
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get list of topics
   */
  async getTopics(): Promise<Topic[]> {
    try {
      const response = await this.client.get('/topics/')
      return response.data.data || response.data.results || []
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get single topic by slug
   */
  async getTopic(slug: string): Promise<Topic> {
    try {
      const response = await this.client.get(`/topics/${slug}/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get datasets by topic
   */
  async getTopicDatasets(
    topicSlug: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResponse<Dataset>> {
    try {
      const response = await this.client.get(`/topics/${topicSlug}/datasets/`, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || 20,
        },
      })

      return {
        data: response.data.data || response.data.results || [],
        total: response.data.total || response.data.count || 0,
        page: params?.page || 1,
        page_size: params?.pageSize || 20,
        totalPages: Math.ceil(
          (response.data.total || response.data.count || 0) / (params?.pageSize || 20)
        ),
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Search datasets
   */
  async search(params: SearchParams): Promise<PaginatedResponse<Dataset>> {
    try {
      const response = await this.client.get('/search/', {
        params: {
          q: params.query,
          organization: params.organization,
          topic: params.topic,
          format: params.format?.join(','),
          license: params.license?.join(','),
          temporal: params.temporal,
          spatial: params.spatial,
          page: params.page || 1,
          page_size: params.pageSize || 20,
        },
      })

      return {
        data: response.data.data || response.data.results || [],
        total: response.data.total || response.data.count || 0,
        page: params.page || 1,
        page_size: params.pageSize || 20,
        next_page: response.data.next_page,
        previous_page: response.data.previous_page,
      } as PaginatedResponse<Dataset>
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Fetch and parse a dataset resource (CSV, JSON, NDJSON)
   */
  async fetchResourceData(
    resourceUrl: string,
    format?: string,
    options: Omit<DatasetLoadOptions, 'resourceUrl' | 'format'> = {}
  ): Promise<ParsedDataset> {
    try {
      return await loadDatasetFromUrl(resourceUrl, {
        ...options,
        resourceUrl,
        format,
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message,
        code: error.code,
        status: error.response?.status,
        details: error.response?.data,
      }
    }

    return {
      message: 'An unexpected error occurred',
      details: error instanceof Error ? { cause: error.message } : { cause: String(error) },
    }
  }
}

// Export singleton instance
export const dataGovService = new DataGovService()

// Also export class for testing
export { DataGovService }
