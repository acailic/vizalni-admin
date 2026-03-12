import type { ParsedDataset, JoinSuggestion, DimensionMeta } from '@/types'

import { normalizeJoinValue } from './join'

/**
 * Calculate Levenshtein distance between two strings.
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0]![j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j]! + 1
        )
      }
    }
  }

  return matrix[b.length]![a.length]!
}

/**
 * Calculate string similarity (0-1) based on Levenshtein distance.
 */
function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase())
  return 1 - distance / maxLen
}

/**
 * Calculate value overlap between two columns.
 */
function calculateValueOverlap(
  primary: ParsedDataset,
  secondary: ParsedDataset,
  primaryKey: string,
  secondaryKey: string
): number {
  const primaryValues = new Set<string>()
  for (const obs of primary.observations) {
    const normalized = normalizeJoinValue(obs[primaryKey])
    if (normalized) {
      primaryValues.add(normalized)
    }
  }

  const secondaryValues = new Set<string>()
  for (const obs of secondary.observations) {
    const normalized = normalizeJoinValue(obs[secondaryKey])
    if (normalized) {
      secondaryValues.add(normalized)
    }
  }

  if (primaryValues.size === 0 || secondaryValues.size === 0) {
    return 0
  }

  let overlap = 0
  for (const value of primaryValues) {
    if (secondaryValues.has(value)) {
      overlap++
    }
  }

  return overlap / primaryValues.size
}

/**
 * Infer possible join dimensions between two datasets.
 */
export function inferJoinDimensions(
  primary: ParsedDataset,
  secondary: ParsedDataset
): JoinSuggestion[] {
  const suggestions: JoinSuggestion[] = []
  const primaryDimensions = primary.dimensions
  const secondaryDimensions = secondary.dimensions

  for (const primaryDim of primaryDimensions) {
    for (const secondaryDim of secondaryDimensions) {
      const suggestion = evaluateDimensionPair(
        primary,
        secondary,
        primaryDim,
        secondaryDim
      )
      if (suggestion && suggestion.confidence > 0.3) {
        suggestions.push(suggestion)
      }
    }
  }

  // Sort by confidence (highest first)
  suggestions.sort((a, b) => b.confidence - a.confidence)

  // Deduplicate by keeping highest confidence per primary key
  const seen = new Set<string>()
  const deduped: JoinSuggestion[] = []
  for (const s of suggestions) {
    if (!seen.has(s.primaryKey)) {
      seen.add(s.primaryKey)
      deduped.push(s)
    }
  }

  return deduped
}

function evaluateDimensionPair(
  primary: ParsedDataset,
  secondary: ParsedDataset,
  primaryDim: DimensionMeta,
  secondaryDim: DimensionMeta
): JoinSuggestion | null {
  const primaryName = primaryDim.key.toLowerCase()
  const secondaryName = secondaryDim.key.toLowerCase()

  // Check for exact name match
  if (primaryName === secondaryName) {
    const overlap = calculateValueOverlap(primary, secondary, primaryDim.key, secondaryDim.key)
    return {
      primaryKey: primaryDim.key,
      secondaryKey: secondaryDim.key,
      confidence: 0.9 + overlap * 0.1, // Boost by overlap
      matchType: 'exact-name',
      overlapPercent: Math.round(overlap * 100),
    }
  }

  // Check for fuzzy name match (>80% similar)
  const nameSimilarity = stringSimilarity(primaryName, secondaryName)
  if (nameSimilarity > 0.8) {
    const overlap = calculateValueOverlap(primary, secondary, primaryDim.key, secondaryDim.key)
    return {
      primaryKey: primaryDim.key,
      secondaryKey: secondaryDim.key,
      confidence: 0.7 + overlap * 0.2,
      matchType: 'fuzzy-name',
      overlapPercent: Math.round(overlap * 100),
    }
  }

  // Check for value overlap (>70%)
  const overlap = calculateValueOverlap(primary, secondary, primaryDim.key, secondaryDim.key)
  if (overlap > 0.7) {
    return {
      primaryKey: primaryDim.key,
      secondaryKey: secondaryDim.key,
      confidence: 0.5 + overlap * 0.3,
      matchType: 'value-overlap',
      overlapPercent: Math.round(overlap * 100),
    }
  }

  // Check for common join key patterns
  const commonPatterns = [
    ['municipality', 'opština', 'opstina'],
    ['region', 'region', 'oblast'],
    ['district', 'okrug'],
    ['year', 'godina'],
    ['date', 'datum'],
    ['code', 'šifra', 'sifra'],
    ['id', 'identifikator'],
  ]

  for (const pattern of commonPatterns) {
    const primaryMatches = pattern.some(p => primaryName.includes(p))
    const secondaryMatches = pattern.some(p => secondaryName.includes(p))
    if (primaryMatches && secondaryMatches) {
      const overlapPercent = Math.round(overlap * 100)
      return {
        primaryKey: primaryDim.key,
        secondaryKey: secondaryDim.key,
        confidence: Math.max(0.4, overlap),
        matchType: 'value-overlap',
        overlapPercent,
      }
    }
  }

  return null
}

/**
 * Get the best join suggestion (highest confidence).
 */
export function getBestJoinSuggestion(
  primary: ParsedDataset,
  secondary: ParsedDataset
): JoinSuggestion | null {
  const suggestions = inferJoinDimensions(primary, secondary)
  return suggestions[0] ?? null
}
