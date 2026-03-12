import { describe, it, expect } from '@jest/globals'
import { normalizeJoinValue, joinDatasets, calculateJoinOverlap } from '@/lib/data/join'
import type { JoinConfig, Observation, ParsedDataset } from '@/types'

describe('normalizeJoinValue', () => {
  it('handles null and undefined', () => {
    expect(normalizeJoinValue(null)).toBe('')
    expect(normalizeJoinValue(undefined)).toBe('')
  })

  it('normalizes case', () => {
    expect(normalizeJoinValue('BEOGRAD')).toBe('beograd')
    expect(normalizeJoinValue('Beograd')).toBe('beograd')
  })

  it('transliterates Cyrillic to Latin', () => {
    expect(normalizeJoinValue('Београд')).toBe('beograd')
    expect(normalizeJoinValue('НИШ')).toBe('niš')
    expect(normalizeJoinValue('Крагујевац')).toBe('kragujevac')
  })

  it('strips parentheticals', () => {
    expect(normalizeJoinValue('Beograd (grad)')).toBe('beograd')
    expect(normalizeJoinValue('Novi Sad (grad)')).toBe('novi sad')
  })

  it('normalizes whitespace', () => {
    expect(normalizeJoinValue('  beograd  ')).toBe('beograd')
    expect(normalizeJoinValue('novi   sad')).toBe('novi sad')
  })
})

describe('joinDatasets', () => {
  const createMockDataset = (
    observations: Observation[],
    dimensions: string[],
    measures: string[],
    name = 'test'
  ): ParsedDataset => ({
    observations,
    dimensions: dimensions.map(key => ({
      key,
      label: key,
      type: 'categorical' as const,
      values: [...new Set(observations.map(o => o[key]).filter(Boolean))] as string[],
      cardinality: new Set(observations.map(o => o[key]).filter(Boolean)).size,
    })),
    measures: measures.map(key => ({
      key,
      label: key,
      min: Math.min(...observations.map(o => o[key] as number).filter(Number.isFinite)),
      max: Math.max(...observations.map(o => o[key] as number).filter(Number.isFinite)),
      hasNulls: observations.some(o => o[key] === null),
    })),
    metadataColumns: [],
    columns: [...dimensions, ...measures],
    rowCount: observations.length,
    source: { format: 'csv', name },
  })

  const primary = createMockDataset(
    [
      { municipality: 'Beograd', population: 1400000 },
      { municipality: 'Novi Sad', population: 250000 },
      { municipality: 'Niš', population: 180000 },
    ],
    ['municipality'],
    ['population'],
    'census'
  )

  const secondary = createMockDataset(
    [
      { city: 'Beograd', gdp: 50000 },
      { city: 'Novi Sad', gdp: 35000 },
      { city: 'Kragujevac', gdp: 25000 },
    ],
    ['city'],
    ['gdp'],
    'economy'
  )

  it('performs inner join correctly', () => {
    const config: JoinConfig = {
      primary: { datasetId: 'census', resourceId: 'r1', joinKey: 'municipality' },
      secondary: { datasetId: 'economy', resourceId: 'r2', joinKey: 'city' },
      joinType: 'inner',
    }

    const result = joinDatasets(primary, secondary, config)

    expect(result.observations).toHaveLength(2) // Beograd and Novi Sad match
    expect(Object.prototype.hasOwnProperty.call(result.observations[0], 'economy.gdp')).toBe(true)
    expect(result.observations[0]['economy.gdp']).toBe(50000)
  })

  it('performs left join correctly', () => {
    const config: JoinConfig = {
      primary: { datasetId: 'census', resourceId: 'r1', joinKey: 'municipality' },
      secondary: { datasetId: 'economy', resourceId: 'r2', joinKey: 'city' },
      joinType: 'left',
    }

    const result = joinDatasets(primary, secondary, config)

    expect(result.observations).toHaveLength(3) // All primary rows preserved
    // Niš has no match, should have null for secondary columns
    const nisRow = result.observations.find(o => o.municipality === 'Niš')
    expect(nisRow).toBeDefined()
    expect(nisRow!['economy.gdp']).toBeNull()
  })

  it('prefixes secondary columns', () => {
    const config: JoinConfig = {
      primary: { datasetId: 'census', resourceId: 'r1', joinKey: 'municipality' },
      secondary: { datasetId: 'economy', resourceId: 'r2', joinKey: 'city' },
      joinType: 'inner',
    }

    const result = joinDatasets(primary, secondary, config)

    expect(result.columns).toContain('economy.gdp')
    expect(result.measures.find(m => m.key === 'economy.gdp')).toBeDefined()
  })
})

describe('calculateJoinOverlap', () => {
  const createMockDataset = (
    observations: Observation[],
    keyColumn: string
  ): ParsedDataset => ({
    observations,
    dimensions: [{
      key: keyColumn,
      label: keyColumn,
      type: 'categorical' as const,
      values: [...new Set(observations.map(o => o[keyColumn]).filter(Boolean))] as string[],
      cardinality: new Set(observations.map(o => o[keyColumn]).filter(Boolean)).size,
    }],
    measures: [],
    metadataColumns: [],
    columns: [keyColumn],
    rowCount: observations.length,
    source: { format: 'csv' },
  })

  it('calculates overlap percentage correctly', () => {
    const primary = createMockDataset(
      [
        { id: 'A' },
        { id: 'B' },
        { id: 'C' },
        { id: 'D' },
      ],
      'id'
    )

    const secondary = createMockDataset(
      [
        { code: 'A' },
        { code: 'B' },
        { code: 'E' },
      ],
      'code'
    )

    const result = calculateJoinOverlap(primary, secondary, 'id', 'code')

    expect(result.overlapPercent).toBe(50) // 2 out of 4 primary rows match
    expect(result.primaryMatched).toBe(2)
  })
})
