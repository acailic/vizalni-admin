import { decodeResourceBuffer, parseDatasetContent } from '@/lib/data'

describe('data loader', () => {
  it('parses CSV content with Serbian decimal formatting', () => {
    const dataset = parseDatasetContent('grad;ukupno;datum\nBeograd;1.234,56;01.02.2024.', {
      format: 'csv',
    })

    expect(dataset.columns).toEqual(['grad', 'ukupno', 'datum'])
    expect(dataset.observations).toHaveLength(1)
    expect(dataset.observations[0]?.grad).toBe('Beograd')
    expect(dataset.observations[0]?.ukupno).toBe(1234.56)
    expect(dataset.observations[0]?.datum).toBeInstanceOf(Date)
    expect(dataset.measures.map(measure => measure.key)).toEqual(['ukupno'])
    expect(dataset.dimensions.map(dimension => dimension.key)).toEqual(['grad', 'datum'])
  })

  it('parses JSON content and preserves column order', () => {
    const dataset = parseDatasetContent(
      JSON.stringify([
        { opština: 'Novi Beograd', stanovnika: 209763 },
        { opština: 'Zemun', stanovnika: 168170 },
      ]),
      {
        format: 'json',
      }
    )

    expect(dataset.columns).toEqual(['opština', 'stanovnika'])
    expect(dataset.observations[1]?.stanovnika).toBe(168170)
    expect(dataset.measures.map(measure => measure.key)).toEqual(['stanovnika'])
  })

  it('supports ndjson input', () => {
    const dataset = parseDatasetContent('{"region":"Vojvodina","broj":12}\n{"region":"Sumadija","broj":8}', {
      format: 'ndjson',
    })

    expect(dataset.rowCount).toBe(2)
    expect(dataset.columns).toEqual(['region', 'broj'])
  })

  it('strips BOM from decoded content', () => {
    const bomBuffer = Uint8Array.from([0xef, 0xbb, 0xbf, 0x61, 0x62, 0x63]).buffer

    expect(decodeResourceBuffer(bomBuffer)).toBe('abc')
  })

  it('throws a useful error for malformed JSON', () => {
    expect(() => parseDatasetContent('{"bad"', { format: 'json' })).toThrow(
      'Failed to parse JSON resource'
    )
  })
})
