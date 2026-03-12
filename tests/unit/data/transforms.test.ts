import {
  aggregateObservations,
  computePercentages,
  filterObservations,
  imputeMissing,
  pivotObservations,
  sortObservations,
} from '@/lib/data'
import type { Observation } from '@/types/observation'

const observations: Observation[] = [
  { grad: 'Beograd', region: 'Sever', ukupno: 10, mesec: new Date('2024-01-01') },
  { grad: 'Novi Sad', region: 'Sever', ukupno: 20, mesec: new Date('2024-02-01') },
  { grad: 'Nis', region: 'Jug', ukupno: 30, mesec: new Date('2024-03-01') },
]

describe('data transforms', () => {
  it('filters observations by scalar and range filters', () => {
    expect(filterObservations(observations, { grad: 'Beograd' })).toHaveLength(1)
    expect(filterObservations(observations, { ukupno: { min: 15, max: 25 } })).toHaveLength(1)
  })

  it('sorts observations deterministically', () => {
    const sorted = sortObservations(observations, 'ukupno', 'desc')
    expect(sorted.map(item => item.grad)).toEqual(['Nis', 'Novi Sad', 'Beograd'])
  })

  it('aggregates observations by group', () => {
    const aggregated = aggregateObservations(observations, 'region', 'ukupno', 'sum')

    expect(aggregated).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ region: 'Sever', ukupno: 30 }),
        expect.objectContaining({ region: 'Jug', ukupno: 30 }),
      ])
    )
  })

  it('builds pivot tables', () => {
    const pivot = pivotObservations(observations, 'region', 'grad', 'ukupno')

    expect(pivot.rows).toEqual(expect.arrayContaining(['Sever', 'Jug']))
    expect(pivot.values.Sever?.Beograd).toBe(10)
    expect(pivot.values.Jug?.Nis).toBe(30)
  })

  it('computes percentages within groups', () => {
    const computed = computePercentages(observations, 'ukupno', 'region')

    expect(computed[0]?.ukupnoPercentage).toBeCloseTo(33.333, 2)
    expect(computed[1]?.ukupnoPercentage).toBeCloseTo(66.666, 2)
    expect(computed[2]?.ukupnoPercentage).toBe(100)
  })

  it('imputes missing values', () => {
    const withMissing: Observation[] = [
      { value: 10 },
      { value: null },
      { value: 30 },
    ]

    expect(imputeMissing(withMissing, 'zero', ['value'])[1]?.value).toBe(0)
    expect(imputeMissing(withMissing, 'mean', ['value'])[1]?.value).toBe(20)
    expect(imputeMissing(withMissing, 'interpolate', ['value'])[1]?.value).toBe(20)
    expect(imputeMissing(withMissing, 'skip', ['value'])).toEqual([{ value: 10 }, { value: 30 }])
  })
})
