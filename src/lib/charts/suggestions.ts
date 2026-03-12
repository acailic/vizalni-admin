import type { ChartConfig, ParsedDataset, SupportedChartType } from '@/types'

function getFallbackTitle(datasetTitle: string) {
  return datasetTitle ? `Chart: ${datasetTitle}` : 'Chart preview'
}

function getFallbackDimension(dataset: ParsedDataset) {
  return dataset.dimensions[0]?.key ?? dataset.columns[0]
}

function getFallbackMeasure(dataset: ParsedDataset) {
  return (
    dataset.measures[0]?.key ??
    dataset.columns.find(column => column !== getFallbackDimension(dataset))
  )
}

export function getSuggestedChartType(dataset: ParsedDataset): SupportedChartType {
  const firstDimension = getFallbackDimension(dataset)
  const firstMeasure = getFallbackMeasure(dataset)

  if (!firstMeasure) {
    return 'table'
  }

  if (!firstDimension && dataset.measures.length >= 2) {
    return 'scatterplot'
  }

  const dimensionMeta = dataset.dimensions.find(dimension => dimension.key === firstDimension)
  return dimensionMeta?.type === 'temporal' ? 'line' : 'column'
}

export function getSuggestedChartConfig(
  datasetId: string,
  datasetTitle: string,
  dataset: ParsedDataset
): Partial<ChartConfig> {
  const suggestedType = getSuggestedChartType(dataset)
  const firstDimension = getFallbackDimension(dataset)
  const firstMeasure = getFallbackMeasure(dataset)
  const secondMeasure = dataset.measures[1]?.key

  if (suggestedType === 'table') {
    return {
      type: 'table',
      title: getFallbackTitle(datasetTitle),
      dataset_id: datasetId,
      options: {
        pageSize: 12,
        showGrid: false,
        showLegend: false,
        responsive: true,
      },
    }
  }

  if (suggestedType === 'scatterplot' && dataset.measures.length >= 2) {
    return {
      type: 'scatterplot',
      title: getFallbackTitle(datasetTitle),
      dataset_id: datasetId,
      x_axis: {
        field: dataset.measures[0]!.key,
        label: dataset.measures[0]!.label,
        type: 'linear',
      },
      y_axis: {
        field: dataset.measures[1]!.key,
        label: dataset.measures[1]!.label,
        type: 'linear',
      },
      options: {
        dotSize: 6,
        opacity: 0.7,
        showLegend: false,
        showGrid: false,
        responsive: true,
      },
    }
  }

  return {
    type: suggestedType,
    title: getFallbackTitle(datasetTitle),
    dataset_id: datasetId,
    x_axis: firstDimension
      ? {
          field: firstDimension,
          label:
            dataset.dimensions.find(dimension => dimension.key === firstDimension)?.label ??
            firstDimension,
          type:
            dataset.dimensions.find(dimension => dimension.key === firstDimension)?.type ===
            'temporal'
              ? 'date'
              : 'category',
        }
      : undefined,
    y_axis: firstMeasure
      ? {
          field: firstMeasure,
          label:
            dataset.measures.find(measure => measure.key === firstMeasure)?.label ?? firstMeasure,
          type: 'linear',
        }
      : undefined,
    options: {
      showLegend: true,
      showGrid: true,
      animation: true,
      responsive: true,
      secondaryField: suggestedType === 'combo' ? secondMeasure : undefined,
    },
  }
}
