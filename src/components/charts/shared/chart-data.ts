import { formatChartValue } from '@/components/charts/shared/chart-formatters'
import type { AxisConfig, ChartConfig, ChartRendererDataRow } from '@/types'

export interface CartesianChartDatum {
  label: string
  value: number | null
  secondaryValue: number | null
  rawX: unknown
  rawY: unknown
  raw: ChartRendererDataRow
}

function parseLocalizedNumber(input: string) {
  const compact = input.replace(/\s/g, '')
  const hasComma = compact.includes(',')
  const hasDot = compact.includes('.')

  if (hasComma && hasDot) {
    return Number.parseFloat(compact.replace(/\./g, '').replace(',', '.'))
  }

  if (hasComma) {
    return Number.parseFloat(compact.replace(',', '.'))
  }

  return Number.parseFloat(compact)
}

export function toNumericValue(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const parsed = parseLocalizedNumber(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export function getAxisLabel(axis?: AxisConfig) {
  return axis?.label || axis?.field || ''
}

export function getChartColors(config: Pick<ChartConfig, 'options'>) {
  return config.options?.colors?.length
    ? config.options.colors
    : ['#0D4077', '#4B90F5', '#3558A2', '#C6363C', '#10B981', '#F59E0B']
}

export function getCartesianData(
  data: ChartRendererDataRow[],
  config: Pick<ChartConfig, 'x_axis' | 'y_axis' | 'options'>,
  locale?: string
): CartesianChartDatum[] {
  if (!config.x_axis || !config.y_axis) {
    return []
  }

  return data.map(row => {
    const rawX = row[config.x_axis!.field]
    const rawY = row[config.y_axis!.field]
    const secondaryField = config.options?.secondaryField

    return {
      label: formatChartValue(rawX, locale),
      value: toNumericValue(rawY),
      secondaryValue: secondaryField ? toNumericValue(row[secondaryField]) : toNumericValue(rawY),
      rawX,
      rawY,
      raw: row,
    }
  })
}

export function getPieData(
  data: ChartRendererDataRow[],
  config: Pick<ChartConfig, 'x_axis' | 'y_axis' | 'options'>,
  locale?: string
) {
  return getCartesianData(data, config, locale)
    .filter(datum => datum.value !== null)
    .map(datum => ({
      name: datum.label,
      value: datum.value ?? 0,
    }))
}

export function getTableColumns(
  data: ChartRendererDataRow[],
  config: Pick<ChartConfig, 'x_axis' | 'y_axis' | 'options'>
) {
  const firstRowKeys = data[0] ? Object.keys(data[0]) : []
  const configuredKeys = [
    config.x_axis?.field,
    config.y_axis?.field,
    config.options?.secondaryField,
  ].filter((value): value is string => !!value)

  return [...new Set([...configuredKeys, ...firstRowKeys])]
}
