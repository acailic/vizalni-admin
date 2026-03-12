import type { ChartConfig } from './chart-config'

export interface LayoutItem {
  chartId: string
  x: number // grid column (0-11)
  y: number // grid row
  w: number // width in grid columns (1-12)
  h: number // height in grid rows
  minW?: number
  minH?: number
}

export interface SharedFilterConfig {
  enabled: boolean
  syncDimensions: string[] // dimension keys shared across charts
  syncTimeRange: boolean
}

export interface DashboardConfig {
  id: string
  title: string
  description?: string
  layout: LayoutItem[]
  charts: Record<string, ChartConfig> // keyed by chart ID
  sharedFilters: SharedFilterConfig
  createdAt?: string
  updatedAt?: string
}

export interface DashboardTemplate {
  id: string
  name: string
  nameKey: string // i18n key
  description: string
  descriptionKey: string // i18n key
  layout: LayoutItem[]
  chartPlaceholders: Array<{
    chartId: string
    suggestedType: string
    label: string
  }>
}

// Predefined dashboard templates
export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'single',
    nameKey: 'dashboard.templates.single',
    name: 'Single Chart',
    descriptionKey: 'dashboard.templates.single_desc',
    description: 'One large chart',
    layout: [{ chartId: 'chart-1', x: 0, y: 0, w: 12, h: 4 }],
    chartPlaceholders: [{ chartId: 'chart-1', suggestedType: 'column', label: 'Main chart' }],
  },
  {
    id: 'side-by-side',
    nameKey: 'dashboard.templates.side_by_side',
    name: 'Side by Side',
    descriptionKey: 'dashboard.templates.side_by_side_desc',
    description: 'Two charts side by side',
    layout: [
      { chartId: 'chart-1', x: 0, y: 0, w: 6, h: 4 },
      { chartId: 'chart-2', x: 6, y: 0, w: 6, h: 4 },
    ],
    chartPlaceholders: [
      { chartId: 'chart-1', suggestedType: 'column', label: 'Left chart' },
      { chartId: 'chart-2', suggestedType: 'line', label: 'Right chart' },
    ],
  },
  {
    id: '2x2-grid',
    nameKey: 'dashboard.templates.grid_2x2',
    name: '2x2 Grid',
    descriptionKey: 'dashboard.templates.grid_2x2_desc',
    description: 'Four charts in a 2x2 grid',
    layout: [
      { chartId: 'chart-1', x: 0, y: 0, w: 6, h: 2 },
      { chartId: 'chart-2', x: 6, y: 0, w: 6, h: 2 },
      { chartId: 'chart-3', x: 0, y: 2, w: 6, h: 2 },
      { chartId: 'chart-4', x: 6, y: 2, w: 6, h: 2 },
    ],
    chartPlaceholders: [
      { chartId: 'chart-1', suggestedType: 'column', label: 'Top left' },
      { chartId: 'chart-2', suggestedType: 'line', label: 'Top right' },
      { chartId: 'chart-3', suggestedType: 'pie', label: 'Bottom left' },
      { chartId: 'chart-4', suggestedType: 'table', label: 'Bottom right' },
    ],
  },
  {
    id: 'hero-plus-two',
    nameKey: 'dashboard.templates.hero_plus_two',
    name: 'Hero + Two Small',
    descriptionKey: 'dashboard.templates.hero_plus_two_desc',
    description: 'One large chart with two smaller below',
    layout: [
      { chartId: 'chart-1', x: 0, y: 0, w: 12, h: 2 },
      { chartId: 'chart-2', x: 0, y: 2, w: 6, h: 2 },
      { chartId: 'chart-3', x: 6, y: 2, w: 6, h: 2 },
    ],
    chartPlaceholders: [
      { chartId: 'chart-1', suggestedType: 'line', label: 'Main chart' },
      { chartId: 'chart-2', suggestedType: 'column', label: 'Secondary left' },
      { chartId: 'chart-3', suggestedType: 'pie', label: 'Secondary right' },
    ],
  },
]

export function generateDashboardId(): string {
  return `dashboard-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createEmptyDashboard(title = 'Untitled Dashboard'): DashboardConfig {
  return {
    id: generateDashboardId(),
    title,
    layout: [],
    charts: {},
    sharedFilters: {
      enabled: false,
      syncDimensions: [],
      syncTimeRange: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function createDashboardFromTemplate(
  template: DashboardTemplate,
  title?: string
): DashboardConfig {
  return {
    id: generateDashboardId(),
    title: title ?? template.name,
    layout: template.layout.map(item => ({ ...item })),
    charts: {},
    sharedFilters: {
      enabled: false,
      syncDimensions: [],
      syncTimeRange: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
