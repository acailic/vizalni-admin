import { interpolateRgb } from 'd3-interpolate'

export interface DivergingPalette {
  id: string
  name: string
  colors: [string, string, string]
  category: 'diverging'
  colorblindSafe: boolean
}

export const divergingPalettes: DivergingPalette[] = [
  { id: 'rdylbu', name: 'Red-Yellow-Blue', colors: ['#d73027', '#ffffbf', '#4575b4'], category: 'diverging', colorblindSafe: false },
  { id: 'rdylgn', name: 'Red-Yellow-Green', colors: ['#d7191c', '#ffffbf', '#1a9641'], category: 'diverging', colorblindSafe: false },
  { id: 'piyg', name: 'Pink-Yellow-Green', colors: ['#c51b7d', '#f7f7f7', '#4d9221'], category: 'diverging', colorblindSafe: false },
  { id: 'prgn', name: 'Purple-Green', colors: ['#762a83', '#f7f7f7', '#1b7837'], category: 'diverging', colorblindSafe: true },
  { id: 'rdbu', name: 'Red-Blue', colors: ['#b2182b', '#f7f7f7', '#2166ac'], category: 'diverging', colorblindSafe: false },
  { id: 'spectral', name: 'Spectral', colors: ['#9e0142', '#f7e9a0', '#5e4fa2'], category: 'diverging', colorblindSafe: false },
  { id: 'coolwarm', name: 'Cool-Warm', colors: ['#3b4cc0', '#bbbbbb', '#b40426'], category: 'diverging', colorblindSafe: true },
]

export function interpolateDivergingPalette(paletteId: string, numColors: number): string[] {
  const palette = divergingPalettes.find(p => p.id === paletteId)
  if (!palette) throw new Error(`Diverging palette "${paletteId}" not found`)
  const [low, mid, high] = palette.colors
  const half = Math.floor(numColors / 2)
  const lowInterpolator = interpolateRgb(low, mid)
  const highInterpolator = interpolateRgb(mid, high)
  const lowColors: string[] = []
  const highColors: string[] = []
  for (let i = 0; i < half; i++) lowColors.push(lowInterpolator(i / half))
  for (let i = 0; i <= half; i++) highColors.push(highInterpolator(i / half))
  return [...lowColors, ...highColors]
}

export function getDivergingColor(paletteId: string, value: number, domain: [number, number], midpoint?: number): string {
  const palette = divergingPalettes.find(p => p.id === paletteId)
  if (!palette) return '#999999'
  const [low, mid, high] = palette.colors
  const center = midpoint ?? (domain[0] + domain[1]) / 2
  if (value < center) {
    const interpolator = interpolateRgb(low, mid)
    const t = (value - domain[0]) / (center - domain[0])
    return interpolator(t)
  } else {
    const interpolator = interpolateRgb(mid, high)
    const t = (value - center) / (domain[1] - center)
    return interpolator(t)
  }
}
