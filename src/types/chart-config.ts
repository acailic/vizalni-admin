import type { ComponentType, LazyExoticComponent, ReactNode } from 'react'

import { z } from 'zod'

export type SupportedChartType =
  | 'line'
  | 'bar'
  | 'column'
  | 'area'
  | 'pie'
  | 'scatterplot'
  | 'table'
  | 'combo'
  | 'map'

export type GeoLevel = 'region' | 'district' | 'municipality'

// Map color scale types
export type ColorScaleType = 'sequential' | 'diverging' | 'categorical'

// Classification methods for choropleth maps
export type ClassificationMethod = 'equal-intervals' | 'quantiles' | 'natural-breaks' | 'custom'

// Predefined color palettes for maps
export type MapPalette = 
  | 'blues'
  | 'reds'
  | 'greens'
  | 'oranges'
  | 'purples'
  | 'viridis'
  | 'orange-blue'
  | 'red-blue'

export type ChartType = SupportedChartType | 'scatter'

export interface AxisConfig {
  field: string
  label?: string | undefined
  type?: 'linear' | 'category' | 'date' | undefined
  format?: string | undefined
}

export interface ChartOptions {
  showLegend?: boolean | undefined
  showGrid?: boolean | undefined
  colors?: string[] | undefined
  paletteId?: string | undefined // Palette ID from the palette registry
  customColors?: string[] | undefined // User-defined custom colors
  animation?: boolean | undefined
  // Time-based animation options
  animationEnabled?: boolean | undefined
  animationField?: string | undefined // The field to use for time-based animation
  animationSpeed?: number | undefined // Speed multiplier (0.5, 1, 2, 4)
  animationLoop?: boolean | undefined // Whether to loop animation
  responsive?: boolean | undefined
  curveType?: 'linear' | 'monotone' | 'step' | undefined
  showDots?: boolean | undefined
  grouping?: 'grouped' | 'stacked' | 'percent-stacked' | undefined
  fillOpacity?: number | undefined
  innerRadius?: number | undefined
  showLabels?: boolean | undefined
  showPercentages?: boolean | undefined
  dotSize?: number | undefined
  opacity?: number | undefined
  pageSize?: number | undefined
  secondaryField?: string | undefined
  legendPosition?: 'top' | 'bottom' | 'right' | 'none' | undefined
  geoLevel?: GeoLevel | undefined
  // Map-specific options
  colorScaleType?: ColorScaleType | undefined
  colorPalette?: MapPalette | undefined
  classificationMethod?: ClassificationMethod | undefined
  classCount?: number | undefined
  customBreaks?: number[] | undefined
  showSymbols?: boolean | undefined
  symbolMinSize?: number | undefined
  symbolMaxSize?: number | undefined
  symbolOpacity?: number | undefined
  showMissingDataPattern?: boolean | undefined
  basemapStyle?: 'streets' | 'light' | 'satellite' | undefined
}

// Reference line for charts
export interface ReferenceLine {
  id: string
  axis: 'x' | 'y'
  value: number | string
  label: string
  style: 'solid' | 'dashed' | 'dotted'
  color?: string | undefined
  labelPosition: 'above' | 'below' | 'left' | 'right'
}

// Point or range annotation
export interface ChartAnnotation {
  id: string
  type: 'point' | 'range'
  // For point annotations:
  x?: number | string | undefined
  y?: number | undefined
  // For range annotations:
  xStart?: number | string | undefined
  xEnd?: number | string | undefined
  yStart?: number | undefined
  yEnd?: number | undefined
  // Display:
  text: string
  style: 'callout' | 'badge' | 'highlight'
  color?: string | undefined
  backgroundColor?: string | undefined
}

export interface ChartConfigInput {
  id?: string | undefined
  type: ChartType | string
  title: string
  description?: string | undefined
  dataset_id?: string | undefined
  x_axis?: AxisConfig | undefined
  y_axis?: AxisConfig | undefined
  options?: ChartOptions | undefined
  referenceLines?: ReferenceLine[] | undefined
  annotations?: ChartAnnotation[] | undefined
}

export type ChartRendererDataRow = Record<string, unknown>

export interface ChartRendererComponentProps {
  config: ChartConfig
  data: ChartRendererDataRow[]
  height?: number
  locale?: string
  filterBar?: ReactNode
  showInternalLegend?: boolean
  hiddenSeriesKeys?: string[]
}

export interface ChartCapabilities {
  supportsStacking: boolean
  supportsGrouping: boolean
  supportsAnimation: boolean
  requiresGeo: boolean
  minDimensions: number
  minMeasures: number
  maxMeasures: number
}

export interface ChartTypeDefinition {
  type: SupportedChartType
  label: string
  icon: string
  renderer:
    | ComponentType<ChartRendererComponentProps>
    | LazyExoticComponent<ComponentType<ChartRendererComponentProps>>
  defaultConfig: Partial<ChartConfig>
  capabilities: ChartCapabilities
}

export const defaultChartColors = ['#0D4077', '#4B90F5', '#3558A2', '#C6363C', '#10B981', '#F59E0B']

export const axisConfigSchema = z.object({
  field: z.string().trim().min(1),
  label: z.string().trim().min(1).optional(),
  type: z.enum(['linear', 'category', 'date']).optional(),
  format: z.string().trim().min(1).optional(),
})

const baseChartOptionsSchema = z.object({
  showLegend: z.boolean().optional(),
  showGrid: z.boolean().optional(),
  colors: z.array(z.string().trim().min(1)).min(1).optional(),
  animation: z.boolean().optional(),
  responsive: z.boolean().optional(),
})

export const lineChartOptionsSchema = baseChartOptionsSchema.extend({
  curveType: z.enum(['linear', 'monotone', 'step']).optional(),
  showDots: z.boolean().optional(),
})

export const barChartOptionsSchema = baseChartOptionsSchema.extend({
  grouping: z.enum(['grouped', 'stacked', 'percent-stacked']).optional(),
})

export const areaChartOptionsSchema = baseChartOptionsSchema.extend({
  fillOpacity: z.number().min(0).max(1).optional(),
})

export const pieChartOptionsSchema = baseChartOptionsSchema.extend({
  innerRadius: z.number().min(0).max(100).optional(),
  showLabels: z.boolean().optional(),
  showPercentages: z.boolean().optional(),
})

export const scatterplotOptionsSchema = baseChartOptionsSchema.extend({
  dotSize: z.number().min(2).max(24).optional(),
  opacity: z.number().min(0).max(1).optional(),
})

export const tableChartOptionsSchema = baseChartOptionsSchema.extend({
  pageSize: z.number().int().min(5).max(50).optional(),
})

export const comboChartOptionsSchema = baseChartOptionsSchema.extend({
  secondaryField: z.string().trim().min(1).optional(),
})

const baseChartConfigShape = {
  id: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  dataset_id: z.string().trim().min(1).optional(),
}

const xyChartConfigShape = {
  ...baseChartConfigShape,
  x_axis: axisConfigSchema,
  y_axis: axisConfigSchema,
}

export const lineChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.literal('line'),
  options: lineChartOptionsSchema.optional(),
})

export const barChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.literal('bar'),
  options: barChartOptionsSchema.optional(),
})

export const columnChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.literal('column'),
  options: barChartOptionsSchema.optional(),
})

export const areaChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.literal('area'),
  options: areaChartOptionsSchema.optional(),
})

export const pieChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.literal('pie'),
  options: pieChartOptionsSchema.optional(),
})

export const scatterplotChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.literal('scatterplot'),
  options: scatterplotOptionsSchema.optional(),
})

export const comboChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.literal('combo'),
  options: comboChartOptionsSchema.optional(),
})

export const tableChartConfigSchema = z.object({
  ...baseChartConfigShape,
  type: z.literal('table'),
  x_axis: axisConfigSchema.optional(),
  y_axis: axisConfigSchema.optional(),
  options: tableChartOptionsSchema.optional(),
})

export const mapChartOptionsSchema = baseChartOptionsSchema.extend({
  geoLevel: z.enum(['region', 'district', 'municipality']).optional(),
  colorScaleType: z.enum(['sequential', 'diverging', 'categorical']).optional(),
  colorPalette: z.enum(['blues', 'reds', 'greens', 'oranges', 'purples', 'viridis', 'orange-blue', 'red-blue']).optional(),
  classificationMethod: z.enum(['equal-intervals', 'quantiles', 'natural-breaks', 'custom']).optional(),
  classCount: z.number().int().min(3).max(9).optional(),
  customBreaks: z.array(z.number()).optional(),
  showSymbols: z.boolean().optional(),
  symbolMinSize: z.number().min(4).max(20).optional(),
  symbolMaxSize: z.number().min(10).max(60).optional(),
  symbolOpacity: z.number().min(0).max(1).optional(),
  showMissingDataPattern: z.boolean().optional(),
  basemapStyle: z.enum(['streets', 'light', 'satellite']).optional(),
})

export const mapChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.literal('map'),
  options: mapChartOptionsSchema.optional(),
})

export const chartConfigSchema = z.discriminatedUnion('type', [
  lineChartConfigSchema,
  barChartConfigSchema,
  columnChartConfigSchema,
  areaChartConfigSchema,
  pieChartConfigSchema,
  scatterplotChartConfigSchema,
  tableChartConfigSchema,
  comboChartConfigSchema,
  mapChartConfigSchema,
])

export type ChartConfig = Omit<z.infer<typeof chartConfigSchema>, 'options'> & {
  options?: ChartOptions
}

export function normalizeChartType(type: string): SupportedChartType | null {
  if (type === 'scatter') {
    return 'scatterplot'
  }

  const supportedTypes: SupportedChartType[] = [
    'line',
    'bar',
    'column',
    'area',
    'pie',
    'scatterplot',
    'table',
    'combo',
    'map',
  ]

  return supportedTypes.includes(type as SupportedChartType) ? (type as SupportedChartType) : null
}

export function parseChartConfig(input: ChartConfigInput | ChartConfig): ChartConfig {
  const normalizedType = normalizeChartType(input.type)

  if (!normalizedType) {
    throw new Error(`Unsupported chart type: ${input.type}`)
  }

  return chartConfigSchema.parse({
    ...input,
    type: normalizedType,
  }) as ChartConfig
}
