/**
 * Table Chart Type Definitions
 *
 * Types for advanced table chart features including sorting,
 * pagination, and column configuration.
 */

export interface TableColumnConfig {
  field: string
  label: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  format?: 'number' | 'date' | 'text' | 'badge'
  sortable?: boolean
}

export interface TableChartConfig {
  type: 'table'
  fields: {
    columns: TableColumnConfig[]
    groupBy?: string
  }
  options: {
    sortable: boolean
    groupable: boolean
    responsive: boolean
    pageSize?: number
    showRowNumbers: boolean
    striped: boolean
  }
}

export type SortDirection = 'asc' | 'desc' | null

export interface TableGroupState {
  [key: string]: boolean
}

export interface TableSortState {
  column: string | null
  direction: SortDirection
}

export interface TablePaginationState {
  currentPage: number
  pageSize: number
  totalRows: number
}
