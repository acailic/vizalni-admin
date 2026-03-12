export type ObservationValue = string | number | Date | null

export interface Observation {
  [dimensionKey: string]: ObservationValue
}

export type DimensionType = 'categorical' | 'temporal' | 'geographic'
export type ColumnRole = 'dimension' | 'measure' | 'metadata'
export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max'
export type SortDirection = 'asc' | 'desc'
export type MissingValueStrategy = 'zero' | 'mean' | 'interpolate' | 'skip'

export interface DimensionMeta {
  key: string
  label: string
  type: DimensionType
  values: Array<string | Date>
  cardinality: number
}

export interface MeasureMeta {
  key: string
  label: string
  unit?: string
  min: number
  max: number
  hasNulls: boolean
}

export interface ColumnProfile {
  key: string
  label: string
  role: ColumnRole
  dimensionType?: DimensionType
  numericRatio: number
  dateRatio: number
  nullRatio: number
  cardinality: number
}

export interface ParsedDatasetSource {
  datasetId?: string
  resourceId?: string
  resourceUrl?: string
  format: string
  fetchedAt?: string
  name?: string
}

// Multi-dataset join types
export type JoinType = 'inner' | 'left'

export interface JoinConfig {
  primary: { datasetId: string; resourceId: string; joinKey: string }
  secondary: { datasetId: string; resourceId: string; joinKey: string }
  joinType: JoinType
}

export interface JoinSuggestion {
  primaryKey: string
  secondaryKey: string
  confidence: number // 0-1
  matchType: 'exact-name' | 'fuzzy-name' | 'value-overlap'
  overlapPercent: number
}

export interface DatasetReference {
  datasetId: string
  resourceId: string
  joinKey?: string
  prefix?: string
}

export interface JoinedDataset extends ParsedDataset {
  joinedFrom: DatasetReference[]
}

export interface ParsedDataset {
  observations: Observation[]
  dimensions: DimensionMeta[]
  measures: MeasureMeta[]
  metadataColumns: string[]
  columns: string[]
  rowCount: number
  source: ParsedDatasetSource
}

export interface DatasetLoadOptions {
  datasetId?: string
  resourceId?: string
  resourceUrl?: string
  format?: string
  contentType?: string
  encoding?: string
  rowLimit?: number
  timeoutMs?: number
  fetchInit?: RequestInit
}

export interface DatasetLoadError extends Error {
  code:
    | 'FETCH_FAILED'
    | 'UNSUPPORTED_FORMAT'
    | 'PARSE_FAILED'
    | 'INVALID_JSON'
    | 'UNKNOWN_ENCODING'
}

export type DatasetFilterValue =
  | ObservationValue
  | ObservationValue[]
  | {
      min?: number | Date
      max?: number | Date
      includes?: ObservationValue[]
    }

export interface PivotTable {
  rows: string[]
  columns: string[]
  values: Record<string, Record<string, number | null>>
}
