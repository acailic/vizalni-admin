import { normalizeChartType, parseChartConfig } from '@/types'

describe('chart config parsing', () => {
  it('normalizes legacy scatter to scatterplot', () => {
    expect(
      parseChartConfig({
        type: 'scatter',
        title: 'Population vs budget',
        x_axis: { field: 'population', type: 'linear' },
        y_axis: { field: 'budget', type: 'linear' },
      }).type
    ).toBe('scatterplot')

    expect(normalizeChartType('scatter')).toBe('scatterplot')
  })

  it('accepts table configs without axes', () => {
    expect(
      parseChartConfig({
        type: 'table',
        title: 'Budget table',
        options: {
          pageSize: 15,
        },
      })
    ).toMatchObject({
      type: 'table',
      title: 'Budget table',
      options: {
        pageSize: 15,
      },
    })
  })

  it('rejects malformed xy chart configs', () => {
    expect(() =>
      parseChartConfig({
        type: 'line',
        title: 'Incomplete chart',
      })
    ).toThrow()
  })
})
