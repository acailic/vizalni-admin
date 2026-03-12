export interface BrowseSearchParams {
  q?: string
  page?: number
  pageSize?: number
  organization?: string
  topic?: string
  tag?: string
  license?: string
  format?: string
  frequency?: string
  sort?: string
}

export interface BrowseOrganization {
  id: string
  name: string
  slug: string
  logo?: string | null
  logo_thumbnail?: string | null
  page?: string
  uri?: string
  metrics?: {
    datasets?: number
  }
}

export interface BrowseResource {
  id: string
  title: string
  description?: string | null
  format: string
  url: string
  filesize?: number | null
  mime?: string | null
  last_modified?: string | null
}

export interface BrowseTemporalCoverage {
  start?: string | null
  end?: string | null
}

export interface BrowseSpatialCoverage {
  granularity?: string | null
}

export interface BrowseDataset {
  id: string
  slug: string
  title: string
  description?: string | null
  created_at: string
  last_modified?: string | null
  frequency?: string | null
  license?: string | null
  page?: string
  uri?: string
  organization?: BrowseOrganization | null
  resources: BrowseResource[]
  tags: string[]
  temporal_coverage?: BrowseTemporalCoverage | null
  spatial?: BrowseSpatialCoverage | null
}

export interface BrowseTopic {
  id: string
  name: string
  slug: string
  description?: string | null
}

export interface BrowsePageResponse<T> {
  data: T[]
  page: number
  page_size: number
  total: number
  next_page?: string | null
  previous_page?: string | null
}

export interface FacetOption {
  value: string
  label: string
  count?: number
}

export interface BrowseFacets {
  organizations: FacetOption[]
  topics: FacetOption[]
  formats: FacetOption[]
  frequencies: FacetOption[]
}

export interface PreviewPayload {
  columns: string[]
  rows: Array<Record<string, string>>
  format: string
}
