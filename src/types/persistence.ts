import type { ChartConfig } from './chart-config'

export enum ChartStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface SavedChartMeta {
  id: string
  title: string
  description?: string | null
  chartType: string
  status: ChartStatus
  views: number
  thumbnail?: string | null
  userId?: string | null
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
}

export interface SavedChart extends SavedChartMeta {
  config: ChartConfig
  datasetIds: string[]
  thumbnail?: string | null
}

export interface CreateChartInput {
  title: string
  description?: string
  config: ChartConfig
  datasetIds: string[]
  thumbnail?: string
  chartType: string
  userId?: string
}

export interface UpdateChartInput {
  title?: string
  description?: string
  config?: ChartConfig
  datasetIds?: string[]
  thumbnail?: string
  chartType?: string
}

export interface ChartListFilters {
  status?: ChartStatus
  userId?: string
  chartType?: string
}

export interface ChartListPagination {
  page: number
  pageSize: number
  sortBy: 'createdAt' | 'views' | 'updatedAt'
  sortOrder: 'asc' | 'desc'
}

export type SortByField = 'createdAt' | 'views' | 'updatedAt'

export interface ChartListResult {
  charts: SavedChartMeta[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
