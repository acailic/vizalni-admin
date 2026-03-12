import {
  getChartTypeAvailability,
  getCompatibleChartTypes,
  getDefaultMappingForType,
} from '@/lib/charts/configurator'
import type { ParsedDataset } from '@/types'

const dataset: ParsedDataset = {
  observations: [],
  dimensions: [{ key: 'month', label: 'Month', type: 'temporal', values: [], cardinality: 12 }],
  measures: [
    { key: 'revenue', label: 'Revenue', min: 0, max: 100, hasNulls: false },
    { key: 'cost', label: 'Cost', min: 0, max: 100, hasNulls: false },
  ],
  metadataColumns: [],
  columns: ['month', 'revenue', 'cost'],
  rowCount: 0,
  source: { format: 'csv' },
}

describe('chart configurator helpers', () => {
  it('computes disabled chart types from dataset shape', () => {
    const availability = getChartTypeAvailability(dataset)
    expect(availability.find(item => item.type === 'pie')?.disabled).toBe(true)
    expect(availability.find(item => item.type === 'combo')?.disabled).toBe(false)
    expect(getCompatibleChartTypes(dataset)).toContain('scatterplot')
  })

  it('suggests default mappings per chart type', () => {
    expect(getDefaultMappingForType(dataset, 'combo')).toEqual({
      xField: 'month',
      yField: 'revenue',
      secondaryField: 'cost',
    })

    expect(getDefaultMappingForType(dataset, 'scatterplot')).toEqual({
      xField: 'revenue',
      yField: 'cost',
    })
  })
})
