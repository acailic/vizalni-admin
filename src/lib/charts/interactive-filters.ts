import { formatChartValue } from '@/components/charts/shared/chart-formatters'
import type { ChartConfig, ChartRendererDataRow, ObservationValue } from '@/types'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterableDimension {
  key: string
  label: string
  options: FilterOption[]
  mode: 'single' | 'multi' | 'checkbox'
}

function serializeFilterValue(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value == null) {
    return null
  }

  return String(value)
}

function parseTemporalValue(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}

export function getChartId(config: ChartConfig) {
  return config.id ?? `${config.dataset_id ?? 'chart'}:${config.type}:${config.title}`
}

export function getChartSeriesKeys(config: ChartConfig) {
  const keys = [config.y_axis?.field, config.options?.secondaryField].filter(
    (value): value is string => !!value
  )

  return [...new Set(keys)]
}

export function supportsLegendFilter(config: ChartConfig) {
  return ['line', 'bar', 'column', 'area', 'combo'].includes(config.type)
}

export function supportsCalculationToggle(config: ChartConfig) {
  return ['bar', 'column', 'area'].includes(config.type)
}

export function isTemporalChart(config: ChartConfig, data: ChartRendererDataRow[]) {
  if (config.x_axis?.type === 'date') {
    return true
  }

  if (!config.x_axis?.field) {
    return false
  }

  return data.some(row => parseTemporalValue(row[config.x_axis!.field]) !== null)
}

export function getTemporalValues(config: ChartConfig, data: ChartRendererDataRow[]) {
  if (!config.x_axis?.field) {
    return []
  }

  return [...new Set(
    data
      .map(row => parseTemporalValue(row[config.x_axis!.field]))
      .filter((value): value is Date => value !== null)
      .sort((left, right) => left.getTime() - right.getTime())
      .map(value => value.toISOString())
  )]
}

export function getFilterableDimensions(
  config: ChartConfig,
  data: ChartRendererDataRow[],
  locale?: string
): FilterableDimension[] {
  const excluded = new Set(
    [config.x_axis?.field, config.y_axis?.field, config.options?.secondaryField].filter(
      (value): value is string => !!value
    )
  )
  const rows = data.slice(0, 500)
  const keys = [...new Set(rows.flatMap(row => Object.keys(row)))].filter(key => !excluded.has(key))

  return keys
    .map(key => {
      const values = [...new Set(
        rows
          .map(row => row[key])
          .filter((value): value is Exclude<ObservationValue, null> => value !== null && value !== undefined)
          .map(value => serializeFilterValue(value))
          .filter((value): value is string => value !== null)
      )]

      if (values.length <= 1) {
        return null
      }

      const options = values
        .sort((left, right) => left.localeCompare(right, 'sr'))
        .map(value => ({
          value,
          label: formatChartValue(value, locale),
        }))

      return {
        key,
        label: key,
        options,
        mode: options.length >= 10 ? 'multi' : options.length >= 3 ? 'checkbox' : 'single',
      } satisfies FilterableDimension
    })
    .filter((dimension): dimension is FilterableDimension => dimension !== null)
}

export function matchesFilterSearch(input: string, query: string) {
  return input.toLocaleLowerCase('sr').includes(query.trim().toLocaleLowerCase('sr'))
}
