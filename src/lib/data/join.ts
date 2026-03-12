import type {
  Observation,
  ObservationValue,
  ParsedDataset,
  JoinConfig,
  JoinedDataset,
  DatasetReference,
  DimensionMeta,
  MeasureMeta,
} from '@/types'

/**
 * Normalize a value for join comparison.
 * Handles Cyrillic-Latin transliteration and case folding.
 */
export function normalizeJoinValue(value: ObservationValue | undefined): string {
  if (value === null || value === undefined) {
    return ''
  }

  const str = String(value)
    .toLowerCase()
    .trim()

  // Cyrillic to Latin transliteration map (Serbian)
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'ђ': 'đ', 'е': 'e', 'ж': 'ž', 'з': 'z', 'и': 'i',
    'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm',
    'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'ћ': 'ć', 'у': 'u', 'ф': 'f',
    'х': 'h', 'ц': 'c', 'ч': 'č', 'џ': 'dž', 'ш': 'š',
  }

  // Apply transliteration
  let normalized = ''
  for (const char of str) {
    normalized += cyrillicToLatin[char] ?? char
  }

  // Strip parentheticals (e.g., "Beograd (grad)" -> "beograd")
  normalized = normalized.replace(/\s*\([^)]*\)/g, '')

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim()

  return normalized
}

/**
 * Join two datasets on specified keys.
 */
export function joinDatasets(
  primary: ParsedDataset,
  secondary: ParsedDataset,
  config: JoinConfig
): JoinedDataset {
  const { joinType } = config
  const primaryKey = config.primary.joinKey
  const secondaryKey = config.secondary.joinKey
  const prefix = secondary.source.name ?? 'secondary'

  // Build lookup map from secondary dataset
  const secondaryMap = new Map<string, Observation>()
  for (const obs of secondary.observations) {
    const key = normalizeJoinValue(obs[secondaryKey])
    if (key) {
      secondaryMap.set(key, obs)
    }
  }

  // Track which secondary columns are used
  const secondaryColumns = secondary.columns.filter(col => col !== secondaryKey)

  // Perform join
  const joinedObservations: Observation[] = []
  const matchedSecondaryKeys = new Set<string>()

  for (const primaryObs of primary.observations) {
    const normalizedKey = normalizeJoinValue(primaryObs[primaryKey])
    const secondaryObs = secondaryMap.get(normalizedKey)

    if (secondaryObs) {
      matchedSecondaryKeys.add(normalizedKey)
      // Merge observations with prefixed secondary columns
      const merged: Observation = { ...primaryObs }
      for (const col of secondaryColumns) {
        merged[`${prefix}.${col}`] = secondaryObs[col] ?? null
      }
      joinedObservations.push(merged)
    } else if (joinType === 'left') {
      // Left join: keep primary row with null secondary values
      const merged: Observation = { ...primaryObs }
      for (const col of secondaryColumns) {
        merged[`${prefix}.${col}`] = null
      }
      joinedObservations.push(merged)
    }
    // Inner join: skip rows without matches
  }

  // Build prefixed measures
  const prefixedMeasures: MeasureMeta[] = secondary.measures
    .filter(m => m.key !== secondaryKey)
    .map(m => ({
      ...m,
      key: `${prefix}.${m.key}`,
      label: `${m.label} (${prefix})`,
    }))

  // Build prefixed dimensions
  const prefixedDimensions: DimensionMeta[] = secondary.dimensions
    .filter(d => d.key !== secondaryKey)
    .map(d => ({
      ...d,
      key: `${prefix}.${d.key}`,
      label: `${d.label} (${prefix})`,
    }))

  const joinedRef: DatasetReference = {
    datasetId: config.secondary.datasetId,
    resourceId: config.secondary.resourceId,
    joinKey: secondaryKey,
    prefix,
  }

  const result: JoinedDataset = {
    observations: joinedObservations,
    dimensions: [...primary.dimensions, ...prefixedDimensions],
    measures: [...primary.measures, ...prefixedMeasures],
    metadataColumns: [
      ...primary.metadataColumns,
      ...secondary.metadataColumns.filter(c => c !== secondaryKey).map(c => `${prefix}.${c}`),
    ],
    columns: [
      ...primary.columns,
      ...secondaryColumns.map(c => `${prefix}.${c}`),
    ],
    rowCount: joinedObservations.length,
    source: primary.source,
    joinedFrom: [joinedRef],
  }

  return result
}

/**
 * Calculate join overlap statistics.
 */
export function calculateJoinOverlap(
  primary: ParsedDataset,
  secondary: ParsedDataset,
  primaryKey: string,
  secondaryKey: string
): { overlapPercent: number; primaryMatched: number; secondaryMatched: number } {
  const secondaryValues = new Set<string>()
  for (const obs of secondary.observations) {
    const normalized = normalizeJoinValue(obs[secondaryKey])
    if (normalized) {
      secondaryValues.add(normalized)
    }
  }

  let primaryMatched = 0
  const matchedSecondary = new Set<string>()

  for (const obs of primary.observations) {
    const normalized = normalizeJoinValue(obs[primaryKey])
    if (normalized && secondaryValues.has(normalized)) {
      primaryMatched++
      matchedSecondary.add(normalized)
    }
  }

  const overlapPercent = primary.observations.length > 0
    ? Math.round((primaryMatched / primary.observations.length) * 100)
    : 0

  return {
    overlapPercent,
    primaryMatched,
    secondaryMatched: matchedSecondary.size,
  }
}
