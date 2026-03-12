/**
 * Zod schema for URL-encoded chart state
 * This defines the structure that gets encoded into shareable URLs
 */
import { z } from 'zod'

// Version for forward compatibility
export const URL_STATE_VERSION = 1 as const

// Axis configuration schema
export const urlAxisConfigSchema = z.object({
  field: z.string(),
  label: z.string().optional(),
  type: z.enum(['linear', 'category', 'date']).optional(),
  format: z.string().optional(),
})

// Chart options schema (subset that affects visual appearance)
export const urlChartOptionsSchema = z.object({
  showLegend: z.boolean().optional(),
  showGrid: z.boolean().optional(),
  colors: z.array(z.string()).optional(),
  animation: z.boolean().optional(),
  responsive: z.boolean().optional(),
  curveType: z.enum(['linear', 'monotone', 'step']).optional(),
  showDots: z.boolean().optional(),
  grouping: z.enum(['grouped', 'stacked', 'percent-stacked']).optional(),
  fillOpacity: z.number().min(0).max(1).optional(),
  innerRadius: z.number().min(0).max(100).optional(),
  showLabels: z.boolean().optional(),
  showPercentages: z.boolean().optional(),
  dotSize: z.number().min(2).max(24).optional(),
  opacity: z.number().min(0).max(1).optional(),
  pageSize: z.number().int().min(5).max(50).optional(),
  secondaryField: z.string().optional(),
  legendPosition: z.enum(['top', 'bottom', 'right', 'none']).optional(),
  geoLevel: z.enum(['region', 'district', 'municipality']).optional(),
})

// Chart configuration schema for URL
export const urlChartConfigSchema = z.object({
  type: z.enum(['line', 'bar', 'column', 'area', 'pie', 'scatterplot', 'table', 'combo', 'map']),
  title: z.string(),
  description: z.string().optional(),
  x_axis: urlAxisConfigSchema.optional(),
  y_axis: urlAxisConfigSchema.optional(),
  options: urlChartOptionsSchema.optional(),
})

// Interactive filter value (can be single or array)
export const urlFilterValueSchema = z.union([z.string(), z.array(z.string()), z.null()])

// Interactive filters state
export const urlInteractiveFiltersSchema = z.object({
  legend: z.record(z.boolean()).optional(),
  dataFilters: z.record(urlFilterValueSchema).optional(),
  timeRange: z
    .object({
      from: z.string().nullable(),
      to: z.string().nullable(),
    })
    .optional(),
  timeSlider: z.string().nullable().optional(),
  calculation: z.enum(['none', 'absolute', 'percent', 'sum', 'mean', 'median', 'min', 'max']).optional(),
})

// Dataset reference for URL state
export const urlDatasetReferenceSchema = z.object({
  datasetId: z.string(),
  resourceId: z.string(),
  datasetTitle: z.string().optional(),
  organizationName: z.string().optional(),
})

// Complete URL state schema
export const urlStateSchema = z.object({
  v: z.literal(URL_STATE_VERSION).default(URL_STATE_VERSION),
  dataset: urlDatasetReferenceSchema,
  config: urlChartConfigSchema,
  filters: urlInteractiveFiltersSchema.optional(),
})

// Export types
export type UrlAxisConfig = z.infer<typeof urlAxisConfigSchema>
export type UrlChartOptions = z.infer<typeof urlChartOptionsSchema>
export type UrlChartConfig = z.infer<typeof urlChartConfigSchema>
export type UrlFilterValue = z.infer<typeof urlFilterValueSchema>
export type UrlInteractiveFilters = z.infer<typeof urlInteractiveFiltersSchema>
export type UrlDatasetReference = z.infer<typeof urlDatasetReferenceSchema>
export type UrlState = z.infer<typeof urlStateSchema>

// Partial state for configurator (before all fields are filled)
export const partialUrlStateSchema = z.object({
  v: z.literal(URL_STATE_VERSION).default(URL_STATE_VERSION),
  dataset: urlDatasetReferenceSchema.partial().optional(),
  config: urlChartConfigSchema.partial().optional(),
  filters: urlInteractiveFiltersSchema.optional(),
})

export type PartialUrlState = z.infer<typeof partialUrlStateSchema>

/**
 * Validates URL state with strict parsing
 */
export function validateUrlState(data: unknown): UrlState | null {
  try {
    return urlStateSchema.parse(data)
  } catch {
    return null
  }
}

/**
 * Validates partial URL state (for configurator)
 */
export function validatePartialUrlState(data: unknown): PartialUrlState | null {
  try {
    return partialUrlStateSchema.parse(data)
  } catch {
    return null
  }
}
