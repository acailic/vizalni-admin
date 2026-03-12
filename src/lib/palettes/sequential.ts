import { interpolateRgb } from 'd3-interpolate'
import { quantize } from 'd3-array'

export interface SequentialPalette {
  id: string
  name: string
  colors: [string, string]
  category: 'sequential'
  colorblindSafe: boolean
}

export const sequentialPalettes: SequentialPalette[] = [
  { id: 'blues', name: 'Blues', colors: ['#deebf7', '#08306b'], category: 'sequential', colorblindSafe: false },
  { id: 'greens', name: 'Greens', colors: ['#e5f5e0', '#00441b'], category: 'sequential', colorblindSafe: false },
  { id: 'reds', name: 'Reds', colors: ['#fee0d2', '#67000d'], category: 'sequential', colorblindSafe: false },
  { id: 'oranges', name: 'Oranges', colors: ['#fff5eb', '#7f2704'], category: 'sequential', colorblindSafe: false },
  { id: 'purples', name: 'Purples', colors: ['#f2f0f7', '#3f007d'], category: 'sequential', colorblindSafe: false },
  { id: 'viridis', name: 'Viridis', colors: ['#440154', '#21918c', '#fde725'], category: 'sequential', colorblindSafe: true },
  { id: 'plasma', name: 'Plasma', colors: ['#0d0887', '#7e03a8', '#cc4778', '#f89540', '#f0f921'], category: 'sequential', colorblindSafe: true },
  { id: 'inferno', name: 'Inferno', colors: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4'], category: 'sequential', colorblindSafe: true },
]

export function interpolateSequentialPalette(paletteId: string, numColors: number): string[] {
  const palette = sequentialPalettes.find(p => p.id === paletteId)
  if (!palette) throw new Error(`Sequential palette "${paletteId}" not found`)
  const interpolator = interpolateRgb(palette.colors[0], palette.colors[1])
  return quantize(t => interpolator(t), numColors + 1).slice(1) as string[]
}
