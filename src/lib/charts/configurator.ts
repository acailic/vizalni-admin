import type { ParsedDataset, SupportedChartType } from '@/types'

export interface ChartTypeAvailability {
  type: SupportedChartType
  disabled: boolean
  reason?: string
}

export function getChartTypeAvailability(dataset: ParsedDataset): ChartTypeAvailability[] {
  const dimensionCount = dataset.dimensions.length
  const measureCount = dataset.measures.length

  return [
    {
      type: 'line',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'bar',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'column',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'area',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'pie',
      disabled: dimensionCount < 1 || measureCount !== 1,
      reason: 'Requires exactly 1 dimension and 1 measure.',
    },
    { type: 'scatterplot', disabled: measureCount < 2, reason: 'Requires 2 numeric measures.' },
    {
      type: 'table',
      disabled: dataset.columns.length === 0,
      reason: 'Requires at least 1 column.',
    },
    {
      type: 'combo',
      disabled: dimensionCount < 1 || measureCount < 2,
      reason: 'Requires 1 dimension and 2 measures.',
    },
  ]
}

export function getCompatibleChartTypes(dataset: ParsedDataset) {
  return getChartTypeAvailability(dataset)
    .filter(option => !option.disabled)
    .map(option => option.type)
}

export function getDefaultMappingForType(
  dataset: ParsedDataset,
  type: SupportedChartType
): {
  xField?: string
  yField?: string
  secondaryField?: string
} {
  const firstDimension = dataset.dimensions[0]?.key
  const firstMeasure = dataset.measures[0]?.key
  const secondMeasure = dataset.measures[1]?.key

  if (type === 'table') {
    return {}
  }

  if (type === 'scatterplot') {
    return {
      xField: dataset.measures[0]?.key,
      yField: dataset.measures[1]?.key,
    }
  }

  if (type === 'combo') {
    return {
      xField: firstDimension,
      yField: firstMeasure,
      secondaryField: secondMeasure,
    }
  }

  return {
    xField: firstDimension,
    yField: firstMeasure,
  }
}
