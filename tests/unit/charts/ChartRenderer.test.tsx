import { render, screen } from '@testing-library/react'
import React from 'react'

jest.mock('recharts', () => {
  const actual = jest.requireActual('recharts')

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { style: { width: 800, height: 400 } }, children),
  }
})

jest.mock('@/components/charts/scatterplot/ScatterplotChart', () => ({
  ScatterplotChart: () => React.createElement('div', null, 'Scatterplot mock'),
}))

jest.mock('@/components/filters/TimeRangeFilter', () => ({
  TimeRangeFilter: () => React.createElement('div', null, 'Time range filter mock'),
}))

import { ChartRenderer } from '@/components/charts/ChartRenderer'

describe('ChartRenderer', () => {
  it('renders a table chart through the registry', async () => {
    render(
      React.createElement(ChartRenderer, {
        config: {
          type: 'table',
          title: 'Dataset preview',
        },
        data: [
          { year: 2024, value: 1200 },
          { year: 2025, value: 1400 },
        ],
      })
    )

    expect(screen.getByText('Dataset preview')).toBeInTheDocument()
    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(await screen.findAllByText('year')).toHaveLength(2)
    expect(await screen.findByText('1.200')).toBeInTheDocument()
  })

  it('renders an empty state when xy data is unusable', async () => {
    render(
      React.createElement(ChartRenderer, {
        config: {
          type: 'column',
          title: 'Bad values',
          x_axis: { field: 'month' },
          y_axis: { field: 'value' },
        },
        data: [{ month: 'Jan', value: 'not-a-number' }],
      })
    )

    expect(
      await screen.findByText('No numeric data available for this column chart.')
    ).toBeInTheDocument()
  })

  it('renders the interactive filter bar when temporal and extra dimensions are present', async () => {
    render(
      React.createElement(ChartRenderer, {
        config: {
          type: 'column',
          title: 'Regional values',
          x_axis: { field: 'date', type: 'date' },
          y_axis: { field: 'value', type: 'linear' },
        },
        data: [
          { date: new Date('2024-01-01'), region: 'Beograd', value: 10 },
          { date: new Date('2024-02-01'), region: 'Novi Sad', value: 20 },
        ],
      })
    )

    // Check for reset button (Serbian text)
    expect(await screen.findByText('Поништи све')).toBeInTheDocument()
    expect(await screen.findByText('region')).toBeInTheDocument()
  })

  it('renders a config error for unsupported chart types', () => {
    render(
      React.createElement(ChartRenderer, {
        config: {
          type: 'histogram',
          title: 'Legacy chart',
        },
        data: [],
      })
    )

    expect(screen.getByText('Unsupported chart type: histogram')).toBeInTheDocument()
  })
})
