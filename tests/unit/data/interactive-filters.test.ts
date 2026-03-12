import { applyInteractiveFilters } from '@/lib/data'
import type { InteractiveFiltersState, Observation } from '@/types'

const observations: Observation[] = [
  { date: new Date('2024-01-01'), region: 'Beograd', total: 10 },
  { date: new Date('2024-02-01'), region: 'Novi Sad', total: 30 },
  { date: new Date('2024-03-01'), region: 'Beograd', total: 60 },
]

function createFilters(overrides: Partial<InteractiveFiltersState> = {}): InteractiveFiltersState {
  return {
    legend: { total: true },
    timeRange: { from: null, to: null },
    timeSlider: null,
    dataFilters: { region: null },
    calculation: 'absolute',
    ...overrides,
  }
}

describe('applyInteractiveFilters', () => {
  it('filters by dimension value', () => {
    const filtered = applyInteractiveFilters(
      observations,
      createFilters({ dataFilters: { region: 'Beograd' } }),
      {
        type: 'column',
        x_axis: { field: 'date', type: 'date' },
        y_axis: { field: 'total', type: 'linear' },
      }
    )

    expect(filtered).toHaveLength(2)
    expect(filtered.every(row => row.region === 'Beograd')).toBe(true)
  })

  it('filters by time range and slider', () => {
    const ranged = applyInteractiveFilters(
      observations,
      createFilters({
        timeRange: {
          from: '2024-02-01T00:00:00.000Z',
          to: '2024-03-01T00:00:00.000Z',
        },
      }),
      {
        type: 'line',
        x_axis: { field: 'date', type: 'date' },
        y_axis: { field: 'total', type: 'linear' },
      }
    )

    expect(ranged).toHaveLength(2)

    const stepped = applyInteractiveFilters(
      observations,
      createFilters({
        timeSlider: '2024-02-01T00:00:00.000Z',
      }),
      {
        type: 'line',
        x_axis: { field: 'date', type: 'date' },
        y_axis: { field: 'total', type: 'linear' },
      }
    )

    expect(stepped).toEqual([{ date: new Date('2024-02-01'), region: 'Novi Sad', total: 30 }])
  })

  it('switches supported charts to percentages', () => {
    const filtered = applyInteractiveFilters(
      observations.slice(0, 2),
      createFilters({ calculation: 'percent' }),
      {
        type: 'bar',
        x_axis: { field: 'date', type: 'date' },
        y_axis: { field: 'total', type: 'linear' },
      }
    )

    expect(filtered.map(row => row.total)).toEqual([25, 75])
  })
})
