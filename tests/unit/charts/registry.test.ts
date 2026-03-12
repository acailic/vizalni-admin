jest.mock('@/components/charts/scatterplot/ScatterplotChart', () => ({
  ScatterplotChart: () => null,
}))

import { chartRegistry, getChartDefinition, getChartTypeOptions } from '@/lib/charts/registry'

describe('chart registry', () => {
  it('exposes the supported feature-03 chart types', () => {
    expect(chartRegistry).toHaveLength(9)
    expect(chartRegistry.map(entry => entry.type)).toEqual([
      'line',
      'bar',
      'column',
      'area',
      'pie',
      'scatterplot',
      'table',
      'combo',
      'map',
    ])
  })

  it('returns chart definitions and lightweight picker options', () => {
    expect(getChartDefinition('combo')?.label).toBe('Combo')
    expect(getChartTypeOptions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'table', label: 'Table' }),
        expect.objectContaining({ type: 'scatterplot', label: 'Scatterplot' }),
      ])
    )
  })
})
