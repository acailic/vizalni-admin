import { describe, it, expect } from '@jest/globals'
import { inferJoinDimensions, getBestJoinSuggestion } from '@/lib/data/infer-join'
import type { Observation, ParsedDataset } from '@/types'

const createMockDataset = (
  observations: Observation[],
  dimensions: Array<{ key: string; type?: 'categorical' | 'temporal' | 'geographic' }>,
  name = 'test'
): ParsedDataset => ({
  observations,
  dimensions: dimensions.map(d => ({
    key: d.key,
    label: d.key,
    type: d.type ?? 'categorical' as const,
    values: [...new Set(observations.map(o => o[d.key]).filter(Boolean))] as string[],
    cardinality: new Set(observations.map(o => o[d.key]).filter(Boolean)).size,
  })),
  measures: [],
  metadataColumns: [],
  columns: dimensions.map(d => d.key),
  rowCount: observations.length,
  source: { format: 'csv', name },
})

describe('inferJoinDimensions', () => {
  it('detects exact name matches', () => {
    const primary = createMockDataset(
      [
        { municipality: 'Beograd', value: 100 },
        { municipality: 'Novi Sad', value: 200 },
      ],
      [{ key: 'municipality' }]
    )

    const secondary = createMockDataset(
      [
        { municipality: 'Beograd', gdp: 50000 },
        { municipality: 'Novi Sad', gdp: 35000 },
      ],
      [{ key: 'municipality' }],
      'economy'
    )

    const suggestions = inferJoinDimensions(primary, secondary)

    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions[0].primaryKey).toBe('municipality')
    expect(suggestions[0].secondaryKey).toBe('municipality')
    expect(suggestions[0].matchType).toBe('exact-name')
    expect(suggestions[0].confidence).toBeGreaterThan(0.9)
  })

  it('detects value overlap for different column names', () => {
    const primary = createMockDataset(
      [
        { city: 'Beograd', value: 100 },
        { city: 'Novi Sad', value: 200 },
      ],
      [{ key: 'city' }]
    )

    const secondary = createMockDataset(
      [
        { grad: 'Beograd', gdp: 50000 },
        { grad: 'Novi Sad', gdp: 35000 },
      ],
      [{ key: 'grad' }],
      'economy'
    )

    const suggestions = inferJoinDimensions(primary, secondary)

    expect(suggestions.length).toBeGreaterThan(0)
    // Should detect the value overlap since all values match
    expect(suggestions[0].overlapPercent).toBe(100)
  })

  it('returns empty array when no matches found', () => {
    const primary = createMockDataset(
      [
        { foo: 'abc', value: 100 },
        { foo: 'def', value: 200 },
      ],
      [{ key: 'foo' }]
    )

    const secondary = createMockDataset(
      [
        { bar: 'xyz', gdp: 50000 },
        { bar: 'zzz', gdp: 35000 },
      ],
      [{ key: 'bar' }],
      'economy'
    )

    const suggestions = inferJoinDimensions(primary, secondary)

    // Should have no high-confidence suggestions since nothing matches
    expect(suggestions.length).toBe(0)
  })

  it('sorts suggestions by confidence', () => {
    const primary = createMockDataset(
      [
        { municipality: 'Beograd', region: 'BG', value: 100 },
      ],
      [{ key: 'municipality' }, { key: 'region' }]
    )

    const secondary = createMockDataset(
      [
        { municipality: 'Beograd', region_code: 'BG', gdp: 50000 },
      ],
      [{ key: 'municipality' }, { key: 'region_code' }],
      'economy'
    )

    const suggestions = inferJoinDimensions(primary, secondary)

    // Exact match should come first
    if (suggestions.length > 1) {
      expect(suggestions[0].confidence).toBeGreaterThanOrEqual(suggestions[1].confidence)
    }
  })
})

describe('getBestJoinSuggestion', () => {
  it('returns the highest confidence suggestion', () => {
    const primary = createMockDataset(
      [
        { municipality: 'Beograd', code: 'BG', value: 100 },
      ],
      [{ key: 'municipality' }, { key: 'code' }]
    )

    const secondary = createMockDataset(
      [
        { municipality: 'Beograd', code: 'BG', gdp: 50000 },
      ],
      [{ key: 'municipality' }, { key: 'code' }],
      'economy'
    )

    const best = getBestJoinSuggestion(primary, secondary)

    expect(best).not.toBeNull()
    expect(best!.confidence).toBeGreaterThan(0.9)
  })

  it('returns null when no matches found', () => {
    const primary = createMockDataset(
      [{ foo: 'abc', value: 100 }],
      [{ key: 'foo' }]
    )

    const secondary = createMockDataset(
      [{ bar: 'xyz', gdp: 50000 }],
      [{ key: 'bar' }],
      'economy'
    )

    const best = getBestJoinSuggestion(primary, secondary)

    expect(best).toBeNull()
  })
})
