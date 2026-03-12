import type {
  ColumnProfile,
  DimensionMeta,
  DimensionType,
  MeasureMeta,
  Observation,
  ObservationValue,
} from '@/types/observation'

import { detectGeoLevel } from './geo-matcher'

interface ClassificationResult {
  dimensions: DimensionMeta[]
  measures: MeasureMeta[]
  metadataColumns: string[]
  profiles: ColumnProfile[]
}

const METADATA_KEY_PATTERN = /\b(id|uuid|url|href|link|email|mail|note|notes|napomena)\b/i
const GEOGRAPHIC_KEY_PATTERN =
  /\b(opstina|opština|grad|okrug|region|district|municipality|naselje|geo|geograf)\b/i
const CODE_KEY_PATTERN = /\b(code|sifra|šifra|oznaka)\b/i

function normalizeHeader(value: string) {
  return value.trim().toLowerCase()
}

function asComparableString(value: ObservationValue) {
  if (value == null) {
    return null
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return String(value)
}

function sortDimensionValues(values: Array<string | Date>) {
  return [...values].sort((left, right) => {
    if (left instanceof Date && right instanceof Date) {
      return left.getTime() - right.getTime()
    }

    return String(left).localeCompare(String(right), 'sr')
  })
}

function inferMeasureUnit(key: string, values: ObservationValue[]) {
  const normalizedKey = normalizeHeader(key)

  if (normalizedKey.includes('%') || normalizedKey.includes('percent')) {
    return '%'
  }

  if (/(rsd|din|eur|usd|€|\$)/i.test(normalizedKey)) {
    return normalizedKey.match(/rsd|din|eur|usd|€|\$/i)?.[0]?.toUpperCase()
  }

  const stringSamples = values
    .filter((value): value is string => typeof value === 'string')
    .slice(0, 10)
    .join(' ')

  if (/%/.test(stringSamples)) {
    return '%'
  }

  return undefined
}

function inferDimensionType(key: string, values: ObservationValue[], dateRatio: number): DimensionType {
  if (dateRatio >= 0.6) {
    return 'temporal'
  }

  const normalizedKey = normalizeHeader(key)

  // Check column name for geographic patterns
  if (GEOGRAPHIC_KEY_PATTERN.test(normalizedKey)) {
    return 'geographic'
  }

  // Check if values match known Serbian geographic names
  const stringValues = values
    .filter((value): value is string => typeof value === 'string')
    .slice(0, 100) // Sample first 100 values

  if (stringValues.length > 0) {
    const geoLevel = detectGeoLevel(stringValues)
    if (geoLevel) {
      return 'geographic'
    }

    // Check if any values contain geographic keywords
    if (stringValues.some(value => GEOGRAPHIC_KEY_PATTERN.test(normalizeHeader(value)))) {
      return 'geographic'
    }
  }

  return 'categorical'
}

function isCodeLikeColumn(key: string, values: ObservationValue[], cardinality: number) {
  const normalizedKey = normalizeHeader(key)
  const sampleStrings = values
    .filter((value): value is string => typeof value === 'string')
    .slice(0, 20)

  if (CODE_KEY_PATTERN.test(normalizedKey) || GEOGRAPHIC_KEY_PATTERN.test(normalizedKey)) {
    return true
  }

  if (sampleStrings.length === 0) {
    return false
  }

  const digitsOnly = sampleStrings.every(value => /^[0-9/-]+$/.test(value))
  return digitsOnly && cardinality <= 100
}

function toDimensionMeta(
  key: string,
  values: ObservationValue[],
  dateRatio: number,
  cardinality: number
): DimensionMeta {
  const uniqueValues = new Map<string, string | Date>()

  for (const value of values) {
    if (value == null) {
      continue
    }

    const comparable = asComparableString(value)
    if (comparable == null || uniqueValues.has(comparable)) {
      continue
    }

    if (value instanceof Date) {
      uniqueValues.set(comparable, value)
      continue
    }

    uniqueValues.set(comparable, String(value))
  }

  return {
    key,
    label: key,
    type: inferDimensionType(key, values, dateRatio),
    values: sortDimensionValues([...uniqueValues.values()]),
    cardinality,
  }
}

function toMeasureMeta(key: string, values: ObservationValue[], hasNulls: boolean): MeasureMeta {
  const numbers = values.filter((value): value is number => typeof value === 'number' && !Number.isNaN(value))

  return {
    key,
    label: key,
    unit: inferMeasureUnit(key, values),
    min: numbers.length > 0 ? Math.min(...numbers) : 0,
    max: numbers.length > 0 ? Math.max(...numbers) : 0,
    hasNulls,
  }
}

export function classifyColumns(
  observations: Observation[],
  columns: string[] = []
): ClassificationResult {
  const keys =
    columns.length > 0
      ? columns
      : [...new Set(observations.flatMap(observation => Object.keys(observation)))]

  const dimensions: DimensionMeta[] = []
  const measures: MeasureMeta[] = []
  const metadataColumns: string[] = []
  const profiles: ColumnProfile[] = []

  for (const key of keys) {
    const values = observations.map(observation => observation[key] ?? null)
    const nonNullValues = values.filter((value): value is Exclude<ObservationValue, null> => value !== null)
    const numericCount = nonNullValues.filter(value => typeof value === 'number').length
    const dateCount = nonNullValues.filter(value => value instanceof Date).length
    const nullCount = values.length - nonNullValues.length
    const numericRatio = nonNullValues.length > 0 ? numericCount / nonNullValues.length : 0
    const dateRatio = nonNullValues.length > 0 ? dateCount / nonNullValues.length : 0
    const uniqueValues = new Set(nonNullValues.map(value => asComparableString(value))).size
    const cardinality = uniqueValues
    const nullRatio = values.length > 0 ? nullCount / values.length : 1
    const normalizedKey = normalizeHeader(key)

    let role: ColumnProfile['role'] = 'dimension'
    let dimensionType: DimensionType | undefined

    if (
      nullRatio > 0.9 ||
      (METADATA_KEY_PATTERN.test(normalizedKey) && !GEOGRAPHIC_KEY_PATTERN.test(normalizedKey))
    ) {
      role = 'metadata'
      metadataColumns.push(key)
    } else if (dateRatio >= 0.6) {
      role = 'dimension'
      dimensionType = 'temporal'
      dimensions.push(toDimensionMeta(key, values, dateRatio, cardinality))
    } else if (numericRatio >= 0.8 && !isCodeLikeColumn(key, values, cardinality)) {
      role = 'measure'
      measures.push(toMeasureMeta(key, values, nullCount > 0))
    } else {
      role = 'dimension'
      dimensionType = inferDimensionType(key, values, dateRatio)
      dimensions.push(toDimensionMeta(key, values, dateRatio, cardinality))
    }

    profiles.push({
      key,
      label: key,
      role,
      dimensionType,
      numericRatio,
      dateRatio,
      nullRatio,
      cardinality,
    })
  }

  return {
    dimensions,
    measures,
    metadataColumns,
    profiles,
  }
}
