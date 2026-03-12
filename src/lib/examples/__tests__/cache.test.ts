import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'

import { clearCache, getCachedDataset, setCachedDataset } from '../cache'
import type { ParsedDataset } from '@/types/observation'

// Mock dataset
const mockDataset: ParsedDataset = {
  columns: ['id', 'value'],
  observations: [{ id: 1, value: 100 }],
  source: { format: 'json', url: 'test://data.json' },
}

describe('examples cache', () => {
  beforeEach(() => {
    clearCache()
    jest.useRealTimers()
  })

  afterEach(() => {
    clearCache()
    jest.useRealTimers()
  })

  it('returns null for non-existent cache entry', () => {
    const result = getCachedDataset('non-existent-url')
    expect(result).toBeNull()
  })

  it('stores and retrieves dataset', () => {
    const url = 'test://data.json'
    setCachedDataset(url, mockDataset)

    const result = getCachedDataset(url)
    expect(result).toEqual(mockDataset)
  })

  it('returns null for stale entry', () => {
    const url = 'test://data.json'

    // Use fake timers
    jest.useFakeTimers()

    setCachedDataset(url, mockDataset)

    // Advance time by 6 minutes (beyond 5-minute TTL)
    jest.advanceTimersByTime(6 * 60 * 1000)

    const result = getCachedDataset(url)
    expect(result).toBeNull()
  })

  it('clears all entries', () => {
    setCachedDataset('url1', mockDataset)
    setCachedDataset('url2', mockDataset)

    clearCache()

    expect(getCachedDataset('url1')).toBeNull()
    expect(getCachedDataset('url2')).toBeNull()
  })

  it('returns fresh entry within TTL', () => {
    const url = 'test://data.json'

    jest.useFakeTimers()

    setCachedDataset(url, mockDataset)

    // Advance time by 4 minutes (within 5-minute TTL)
    jest.advanceTimersByTime(4 * 60 * 1000)

    const result = getCachedDataset(url)
    expect(result).toEqual(mockDataset)
  })

  it('overwrites existing entry on set', () => {
    const url = 'test://data.json'
    const updatedDataset: ParsedDataset = {
      ...mockDataset,
      observations: [{ id: 2, value: 200 }],
    }

    setCachedDataset(url, mockDataset)
    setCachedDataset(url, updatedDataset)

    const result = getCachedDataset(url)
    expect(result).toEqual(updatedDataset)
  })
})
