/**
 * Color scale utilities for choropleth maps
 * Provides scale construction, classification methods, and palette definitions
 */

import type { ColorScaleType, ClassificationMethod, MapPalette } from '@/types/chart-config'

// Color palette definitions
export const COLOR_PALETTES: Record<MapPalette, string[]> = {
  blues: ['#E8F4FD', '#B8D9F7', '#7BBEF0', '#4B90F5', '#2E6BC4', '#0D4077'],
  reds: ['#FEE2E2', '#FECACA', '#F87171', '#EF4444', '#DC2626', '#991B1B'],
  greens: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#047857'],
  oranges: ['#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#C2410C'],
  purples: ['#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#7C3AED', '#5B21B6'],
  viridis: ['#440154', '#482878', '#3E4A89', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#FDE725'],
  'orange-blue': ['#7B3294', '#C2A5CF', '#F7F7F7', '#A6DBA0', '#008837'],
  'red-blue': ['#B2182B', '#EF8A62', '#F7F7F7', '#67A9CF', '#2166AC'],
}

// Missing data pattern colors
export const MISSING_DATA_COLORS = {
  fill: '#E5E7EB',
  stroke: '#D1D5DB',
  pattern: '#9CA3AF',
}

/**
 * Classification result with breakpoints
 */
export interface ClassificationResult {
  breaks: number[]
  min: number
  max: number
}

/**
 * Classify data values using the specified method
 */
export function classifyData(
  values: number[],
  method: ClassificationMethod,
  classCount: number = 5
): ClassificationResult {
  if (values.length === 0) {
    return { breaks: [], min: 0, max: 0 }
  }

  const validValues = values.filter(v => !isNaN(v) && isFinite(v))
  if (validValues.length === 0) {
    return { breaks: [], min: 0, max: 0 }
  }

  const min = Math.min(...validValues)
  const max = Math.max(...validValues)

  if (min === max) {
    return { breaks: [min], min, max }
  }

  let breaks: number[]

  switch (method) {
    case 'equal-intervals':
      breaks = equalIntervals(min, max, classCount)
      break
    case 'quantiles':
      breaks = quantiles(validValues, classCount)
      break
    case 'natural-breaks':
      breaks = naturalBreaks(validValues, classCount)
      break
    case 'custom':
      // For custom, just return equal intervals as default
      breaks = equalIntervals(min, max, classCount)
      break
    default:
      breaks = equalIntervals(min, max, classCount)
  }

  return { breaks, min, max }
}

/**
 * Equal intervals classification
 */
function equalIntervals(min: number, max: number, classes: number): number[] {
  const breaks: number[] = []
  const step = (max - min) / classes

  for (let i = 0; i <= classes; i++) {
    breaks.push(min + step * i)
  }

  return breaks
}

/**
 * Quantiles classification (equal count per class)
 */
function quantiles(values: number[], classes: number): number[] {
  const sorted = [...values].sort((a, b) => a - b)
  if (sorted.length === 0) return []
  const breaks: number[] = [sorted[0]!]

  for (let i = 1; i <= classes; i++) {
    const index = Math.floor((sorted.length * i) / classes)
    breaks.push(sorted[Math.min(index, sorted.length - 1)]!)
  }

  return breaks
}

/**
 * Natural breaks (Jenks) classification
 * Simplified implementation using Fisher's algorithm
 */
function naturalBreaks(values: number[], classes: number): number[] {
  if (values.length <= classes) {
    return [...values.sort((a, b) => a - b)]
  }

  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length

  // Initialize matrices for Fisher's algorithm
  const lowerClassLimits: number[][] = Array.from({ length: n + 1 }, () =>
    Array(n + 1).fill(0)
  )
  const varianceCombinations: number[][] = Array.from({ length: n + 1 }, () =>
    Array(n + 1).fill(Infinity)
  )

  varianceCombinations[0]![0] = 0

  for (let l = 1; l <= n; l++) {
    let sum = 0
    let sumSquares = 0
    let count = 0
    let variance = 0

    for (let m = 1; m <= l; m++) {
      const i = l - m + 1
      const val = sorted[i - 1]!
      count++
      sum += val
      sumSquares += val * val

      variance = sumSquares - (sum * sum) / count

      for (let j = 2; j <= Math.min(l, classes); j++) {
        if (varianceCombinations[j - 1]![i - 1]! + variance < varianceCombinations[j]![l]!) {
          varianceCombinations[j]![l] = varianceCombinations[j - 1]![i - 1]! + variance
          lowerClassLimits[j]![l] = i
        }
      }
    }
    varianceCombinations[1]![l] = variance
    lowerClassLimits[1]![l] = 1
  }

  // Extract breakpoints
  const breaks: number[] = []
  let k = n
  for (let j = classes; j >= 1; j--) {
    const classStart = lowerClassLimits[j]![k]! - 1
    breaks.unshift(sorted[classStart]!)
    k = classStart
  }

  // Add max value
  breaks.push(sorted[n - 1]!)

  // Ensure we have the right number of unique breaks
  return [...new Set(breaks)].slice(0, classes + 1)
}

/**
 * Get color for a value from a color scale
 */
export function getColorForValue(
  value: number | null,
  breaks: number[],
  palette: MapPalette,
  _scaleType: ColorScaleType = 'sequential'
): string {
  if (value === null || isNaN(value)) {
    return MISSING_DATA_COLORS.fill
  }

  const colors = COLOR_PALETTES[palette]

  if (breaks.length === 0 || colors.length === 0) {
    return colors[Math.floor(colors.length / 2)] || '#4B90F5'
  }

  // Find the class index
  let classIndex = 0
  for (let i = 1; i < breaks.length; i++) {
    if (value >= breaks[i - 1]! && (i === breaks.length - 1 || value < breaks[i]!)) {
      classIndex = i - 1
      break
    }
  }

  // Map class index to color index
  const colorIndex = Math.min(
    Math.floor((classIndex / (breaks.length - 1)) * colors.length),
    colors.length - 1
  )

  return colors[colorIndex]!
}

/**
 * Create a D3-compatible scale function
 */
export function createColorScale(
  breaks: number[],
  palette: MapPalette,
  scaleType: ColorScaleType = 'sequential'
): (value: number | null) => string {
  return (value: number | null) => getColorForValue(value, breaks, palette, scaleType)
}

/**
 * Get legend tick values from breaks
 */
export function getLegendTicks(breaks: number[], maxTicks: number = 5): number[] {
  if (breaks.length <= maxTicks) {
    return breaks
  }

  const ticks: number[] = [breaks[0]!]
  const step = Math.floor((breaks.length - 1) / (maxTicks - 1))

  for (let i = step; i < breaks.length - 1; i += step) {
    if (ticks.length < maxTicks - 1) {
      ticks.push(breaks[i]!)
    }
  }

  ticks.push(breaks[breaks.length - 1]!)
  return ticks
}

/**
 * Format a number for display in legends and tooltips
 */
export function formatNumberForMap(value: number, locale: string): string {
  if (Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(value)
  }
  if (Math.abs(value) >= 1) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(value)
  }
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Get palette display info for UI selectors
 */
export function getPaletteInfo(palette: MapPalette): {
  name: string
  colors: string[]
  type: ColorScaleType
} {
  const names: Record<MapPalette, string> = {
    blues: 'Blues',
    reds: 'Reds',
    greens: 'Greens',
    oranges: 'Oranges',
    purples: 'Purples',
    viridis: 'Viridis',
    'orange-blue': 'Orange-Blue',
    'red-blue': 'Red-Blue',
  }

  const types: Record<MapPalette, ColorScaleType> = {
    blues: 'sequential',
    reds: 'sequential',
    greens: 'sequential',
    oranges: 'sequential',
    purples: 'sequential',
    viridis: 'sequential',
    'orange-blue': 'diverging',
    'red-blue': 'diverging',
  }

  return {
    name: names[palette],
    colors: COLOR_PALETTES[palette],
    type: types[palette],
  }
}

/**
 * Get all available palettes grouped by type
 */
export function getPalettesByType(): Record<ColorScaleType, MapPalette[]> {
  return {
    sequential: ['blues', 'reds', 'greens', 'oranges', 'purples', 'viridis'],
    diverging: ['orange-blue', 'red-blue'],
    categorical: [], // For future expansion
  }
}
