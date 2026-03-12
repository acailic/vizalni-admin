import type { ChartConfig } from './chart-config'

// Data.gov.rs API types
export interface Dataset {
  id: string
  title: string
  description: string
  organization: Organization
  resources: Resource[]
  tags: string[]
  frequency: string
  temporal_coverage: string
  spatial_coverage: string
  created_at: string
  last_modified: string
  quality_score?: number
}

export interface Resource {
  id: string
  title: string
  description?: string
  url: string
  format: string
  mime_type: string
  size: number
  created_at: string
  last_modified: string
  download_count?: number
}

export interface Organization {
  id: string
  name: string
  description?: string
  logo_url?: string
  url?: string
}

export interface Topic {
  id: string
  name: string
  name_en: string
  slug: string
  icon?: string
  dataset_count?: number
}

export interface SearchResult {
  datasets: Dataset[]
  total: number
  page: number
  page_size: number
}

// Map configuration types
export interface MapConfig {
  id: string
  title: string
  description?: string
  dataset_id: string
  layer_type: 'point' | 'polygon' | 'choropleth'
  latitude_field?: string
  longitude_field?: string
  region_field?: string
  value_field?: string
  color_scale?: string[]
}

// Internationalization types
export type Language = 'sr' | 'lat' | 'en'

export interface LocaleStrings {
  [key: string]: {
    sr: string
    lat: string
    en: string
  }
}

// Visualization types
export interface Visualization {
  id: string
  title: string
  description: string
  type: 'chart' | 'map' | 'table'
  config: ChartConfig | MapConfig
  dataset_id: string
  created_at: string
  updated_at: string
  published: boolean
  author?: string
  tags?: string[]
}

// API Response types
export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    page_size: number
    next_page?: string
    previous_page?: string
  }
}

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: Record<string, unknown>
}

export type {
  AxisConfig,
  ChartCapabilities,
  ChartConfig,
  ChartConfigInput,
  ChartOptions,
  ChartRendererComponentProps,
  ChartRendererDataRow,
  ChartType,
  ChartTypeDefinition,
  GeoLevel,
  SupportedChartType,
} from './chart-config'

// Configurator step type (for use with store and URL params)
export type ConfiguratorStep = 'dataset' | 'chartType' | 'mapping' | 'customize' | 'review'

export {
  axisConfigSchema,
  chartConfigSchema,
  defaultChartColors,
  normalizeChartType,
  parseChartConfig,
} from './chart-config'

export * from './interactive-filters'
export * from '@/types/observation'
export * from './dashboard'
export * from './persistence'
export * from './annotation'
