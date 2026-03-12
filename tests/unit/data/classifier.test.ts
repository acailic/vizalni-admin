import { classifyColumns } from '@/lib/data'
import type { Observation } from '@/types/observation'

describe('classifyColumns', () => {
  it('classifies measures, dimensions, and metadata columns', () => {
    const observations: Observation[] = [
      {
        grad: 'Beograd',
        ukupno: 100,
        datum: new Date('2024-01-01'),
        url: 'https://data.gov.rs/a',
      },
      {
        grad: 'Novi Sad',
        ukupno: 120,
        datum: new Date('2024-02-01'),
        url: 'https://data.gov.rs/b',
      },
    ]

    const result = classifyColumns(observations, ['grad', 'ukupno', 'datum', 'url'])

    expect(result.measures.map(measure => measure.key)).toEqual(['ukupno'])
    expect(result.dimensions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'grad', type: 'geographic' }),
        expect.objectContaining({ key: 'datum', type: 'temporal' }),
      ])
    )
    expect(result.metadataColumns).toEqual(['url'])
  })

  it('keeps code-like numeric columns as dimensions', () => {
    const observations: Observation[] = [
      { sifra: '11070', broj: 12 },
      { sifra: '21000', broj: 18 },
    ]

    const result = classifyColumns(observations, ['sifra', 'broj'])

    expect(result.dimensions).toEqual(expect.arrayContaining([expect.objectContaining({ key: 'sifra' })]))
    expect(result.measures).toEqual(expect.arrayContaining([expect.objectContaining({ key: 'broj' })]))
  })
})
