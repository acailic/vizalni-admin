import axios from 'axios'

import { parseDatasetContent } from '@/lib/data'
import type { Dataset, Resource, Organization, SearchResult, ApiResponse } from '@/types'
import type { ParsedDataset } from '@/types/observation'

const DATA_GOV_API_URL = process.env.NEXT_PUBLIC_DATA_GOV_API_URL || 'https://data.gov.rs/api/1'

const apiClient = axios.create({
  baseURL: DATA_GOV_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Search for datasets on data.gov.rs
 */
export async function searchDatasets(
  query?: string,
  page: number = 1,
  pageSize: number = 20,
  filters?: {
    organization?: string
    tag?: string
    topic?: string
    format?: string
  }
): Promise<SearchResult> {
  try {
    const params = new URLSearchParams()

    if (query) params.append('q', query)
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())

    if (filters?.organization) params.append('organization', filters.organization)
    if (filters?.tag) params.append('tag', filters.tag)
    if (filters?.topic) params.append('topic', filters.topic)
    if (filters?.format) params.append('format', filters.format)

    const response = await apiClient.get<ApiResponse<Dataset[]>>('/datasets/search', { params })

    return {
      datasets: response.data.data || [],
      total: response.data.meta?.total || 0,
      page: response.data.meta?.page || page,
      page_size: response.data.meta?.page_size || pageSize,
    }
  } catch (error) {
    console.error('Error searching datasets:', error)
    throw error
  }
}

/**
 * Get a single dataset by ID
 */
export async function getDataset(id: string): Promise<Dataset> {
  try {
    const response = await apiClient.get<ApiResponse<Dataset>>(`/datasets/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching dataset ${id}:`, error)
    throw error
  }
}

/**
 * Get resources for a dataset
 */
export async function getDatasetResources(datasetId: string): Promise<Resource[]> {
  try {
    const response = await apiClient.get<ApiResponse<Resource[]>>(
      `/datasets/${datasetId}/resources`
    )
    return response.data.data || []
  } catch (error) {
    console.error(`Error fetching resources for dataset ${datasetId}:`, error)
    throw error
  }
}

/**
 * Get all organizations
 */
export async function getOrganizations(): Promise<Organization[]> {
  try {
    const response = await apiClient.get<ApiResponse<Organization[]>>('/organizations')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching organizations:', error)
    throw error
  }
}

/**
 * Get topics/categories
 */
export async function getTopics(): Promise<
  Array<{ id: string; name: string; name_en: string; slug: string }>
> {
  try {
    const response =
      await apiClient.get<
        ApiResponse<Array<{ id: string; name: string; name_en: string; slug: string }>>
      >('/topics')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching topics:', error)
    throw error
  }
}

/**
 * Fetch actual data from a resource URL (CSV, JSON, etc.)
 */
export async function fetchResourceData(
  url: string,
  format?: string
): Promise<ParsedDataset> {
  try {
    const response = await axios.get(url, { responseType: 'text' })
    const content = response.data

    return parseDatasetContent(content, {
      format: format || undefined,
      resourceUrl: url,
    })
  } catch (error) {
    console.error(`Error fetching resource data from ${url}:`, error)
    throw error
  }
}

/**
 * Get featured datasets
 */
export async function getFeaturedDatasets(): Promise<Dataset[]> {
  try {
    const response = await apiClient.get<ApiResponse<Dataset[]>>('/datasets/featured')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching featured datasets:', error)
    // Return empty array on error
    return []
  }
}

/**
 * Get recent datasets
 */
export async function getRecentDatasets(limit: number = 20): Promise<Dataset[]> {
  try {
    const response = await apiClient.get<ApiResponse<Dataset[]>>('/datasets/recent', {
      params: { limit },
    })
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching recent datasets:', error)
    return []
  }
}
