import { categoricalPalettes } from '@/lib/colors'
import { sequentialPalettes, interpolateSequentialPalette } from './sequential'
import { divergingPalettes, interpolateDivergingPalette, getDivergingColor } from './diverging'

export type PaletteType = 'categorical' | 'sequential' | 'diverging'

export interface Palette {
  id: string
  name: string
  type: PaletteType
  colors: string[]
  colorblindSafe: boolean
}

export { categoricalPalettes, sequentialPalettes, interpolateSequentialPalette, divergingPalettes, interpolateDivergingPalette, getDivergingColor }

export function getAllPalettes(): Record<PaletteType, Palette[]> {
  return {
    categorical: categoricalPalettes.map(p => ({ id: p.value, name: p.label, type: 'categorical', colors: p.colors, colorblindSafe: p.colorblindSafe ?? false })),
    sequential: sequentialPalettes.map(p => ({ id: p.id, name: p.name, type: 'sequential', colors: interpolateSequentialPalette(p.id, 7), colorblindSafe: p.colorblindSafe })),
    diverging: divergingPalettes.map(p => ({ id: p.id, name: p.name, type: 'diverging', colors: interpolateDivergingPalette(p.id, 7), colorblindSafe: p.colorblindSafe })),
  }
}

export function detectPaletteType(data: unknown[], field: string): PaletteType {
  const values = data.map(d => (d as Record<string, unknown>)[field])
  const uniqueValues = new Set(values)
  if (uniqueValues.size <= 10) return 'categorical'
  const numericValues = values.filter(v => typeof v === 'number') as number[]
  if (numericValues.length === values.length) {
    const min = Math.min(...numericValues)
    const max = Math.max(...numericValues)
    const range = max - min
    if (min < 0 && max > 0 && Math.abs(min) / range > 0.3 && Math.abs(max) / range > 0.3) return 'diverging'
    return 'sequential'
  }
  return 'categorical'
}

export function getRecommendedPalette(data: unknown[], field: string, type?: PaletteType): { paletteId: string; type: PaletteType } {
  const detectedType = type ?? detectPaletteType(data, field)
  switch (detectedType) {
    case 'sequential': return { paletteId: 'viridis', type: 'sequential' }
    case 'diverging': return { paletteId: 'rdbu', type: 'diverging' }
    default: return { paletteId: 'category10', type: 'categorical' }
  }
}
