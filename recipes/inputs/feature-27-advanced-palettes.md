# Feature Request

## Title
Advanced Palette System - Sequential, Diverging, and Categorical palettes

## Problem
The current color palette system only supports categorical colors. For continuous data (temperature, population density), users cannot use sequential palettes. For data with a meaningful midpoint (above/below average), diverging palettes are needed. The Swiss visualization tool auto-detects data type and suggests appropriate palette types.

## Proposed behavior

### Palette Types
1. **Categorical** (existing) - For discrete categories
2. **Sequential** - For continuous data (low to high)
3. **Diverging** - For data with meaningful midpoint

### Features
- Auto-detect palette type from data
- Interpolate colors for continuous values
- Custom palette creation
- Colorblind-safe indicators
- Export palettes for reuse

---

## Detailed Implementation

### File 1: `src/lib/palettes/sequential.ts` (new)

```typescript
import { interpolateRgb } from 'd3-interpolate'
import { quantize } from 'd3-array'

export interface SequentialPalette {
  id: string
  name: string
  colors: [string, string] // Start and end colors
  category: 'sequential'
  colorblindSafe: boolean
}

export const sequentialPalettes: SequentialPalette[] = [
  {
    id: 'blues',
    name: 'Blues',
    colors: ['#deebf7', '#08306b'],
    category: 'sequential',
    colorblindSafe: false,
  },
  {
    id: 'greens',
    name: 'Greens',
    colors: ['#e5f5e0', '#00441b'],
    category: 'sequential',
    colorblindSafe: false,
  },
  {
    id: 'reds',
    name: 'Reds',
    colors: ['#fee0d2', '#67000d'],
    category: 'sequential',
    colorblindSafe: false,
  },
  {
    id: 'oranges',
    name: 'Oranges',
    colors: ['#fff5eb', '#7f2704'],
    category: 'sequential',
    colorblindSafe: false,
  },
  {
    id: 'purples',
    name: 'Purples',
    colors: ['#f2f0f7', '#3f007d'],
    category: 'sequential',
    colorblindSafe: false,
  },
  {
    id: 'viridis',
    name: 'Viridis',
    colors: ['#440154', '#21918c', '#fde725'],
    category: 'sequential',
    colorblindSafe: true,
  },
  {
    id: 'plasma',
    name: 'Plasma',
    colors: ['#0d0887', '#7e03a8', '#cc4778', '#f89540', '#f0f921'],
    category: 'sequential',
    colorblindSafe: true,
  },
  {
    id: 'inferno',
    name: 'Inferno',
    colors: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4'],
    category: 'sequential',
    colorblindSafe: true,
  },
]

/**
 * Interpolate sequential palette to get N colors
 */
export function interpolateSequentialPalette(
  paletteId: string,
  numColors: number
): string[] {
  const palette = sequentialPalettes.find(p => p.id === paletteId)
  if (!palette) {
    throw new Error(`Sequential palette "${paletteId}" not found`)
  }

  const interpolator = interpolateRgb(palette.colors[0], palette.colors[1])

  return quantize(interpolateLinear(interpolator), numColors + 1).slice(1) as string[]
}

function interpolateLinear(interpolator: (t: number) => string): (t: number) => string {
  return interpolator
}
```

### File 2: `src/lib/palettes/diverging.ts` (new)

```typescript
import { interpolateRgb } from 'd3-interpolate'

export interface DivergingPalette {
  id: string
  name: string
  colors: [string, string, string] // Low, Mid, High
  category: 'diverging'
  colorblindSafe: boolean
}

export const divergingPalettes: DivergingPalette[] = [
  {
    id: 'rdylbu',
    name: 'Red-Yellow-Blue',
    colors: ['#d73027', '#ffffbf', '#4575b4'],
    category: 'diverging',
    colorblindSafe: false,
  },
  {
    id: 'rdylgn',
    name: 'Red-Yellow-Green',
    colors: ['#d7191c', '#ffffbf', '#1a9641'],
    category: 'diverging',
    colorblindSafe: false,
  },
  {
    id: 'piyg',
    name: 'Pink-Yellow-Green',
    colors: ['#c51b7d', '#f7f7f7', '#4d9221'],
    category: 'diverging',
    colorblindSafe: false,
  },
  {
    id: 'prgn',
    name: 'Purple-Green',
    colors: ['#762a83', '#f7f7f7', '#1b7837'],
    category: 'diverging',
    colorblindSafe: true,
  },
  {
    id: 'rdbu',
    name: 'Red-Blue',
    colors: ['#b2182b', '#f7f7f7', '#2166ac'],
    category: 'diverging',
    colorblindSafe: false,
  },
  {
    id: 'spectral',
    name: 'Spectral',
    colors: ['#9e0142', '#f7e9a0', '#5e4fa2'],
    category: 'diverging',
    colorblindSafe: false,
  },
  {
    id: 'coolwarm',
    name: 'Cool-Warm',
    colors: ['#3b4cc0', '#bbbbbb', '#b40426'],
    category: 'diverging',
    colorblindSafe: true,
  },
]

/**
 * Interpolate diverging palette to get N colors
 */
export function interpolateDivergingPalette(
  paletteId: string,
  numColors: number
): string[] {
  const palette = divergingPalettes.find(p => p.id === paletteId)
  if (!palette) {
    throw new Error(`Diverging palette "${paletteId}" not found`)
  }

  const [low, mid, high] = palette.colors
  const half = Math.floor(numColors / 2)

  const lowInterpolator = interpolateRgb(low, mid)
  const highInterpolator = interpolateRgb(mid, high)

  const lowColors: string[] = []
  const highColors: string[] = []

  for (let i = 0; i < half; i++) {
    lowColors.push(lowInterpolator(i / half))
  }

  for (let i = 0; i <= half; i++) {
    highColors.push(highInterpolator(i / half))
  }

  return [...lowColors, ...highColors]
}

/**
 * Get color for a value in diverging palette
 */
export function getDivergingColor(
  paletteId: string,
  value: number,
  domain: [number, number], // [min, max]
  midpoint?: number
): string {
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
```

### File 3: `src/lib/palettes/index.ts` (new)

```typescript
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

// Re-export everything
export {
  sequentialPalettes,
  interpolateSequentialPalette,
  divergingPalettes,
  interpolateDivergingPalette,
  getDivergingColor,
}

/**
 * Get all palettes grouped by type
 */
export function getAllPalettes(): Record<PaletteType, Palette[]> {
  return {
    categorical: categoricalPalettes.map(p => ({
      id: p.value,
      name: p.label,
      type: 'categorical',
      colors: p.colors,
      colorblindSafe: false, // Will be set per palette
    })),
    sequential: sequentialPalettes.map(p => ({
      id: p.id,
      name: p.name,
      type: 'sequential',
      colors: interpolateSequentialPalette(p.id, 7),
      colorblindSafe: p.colorblindSafe,
    })),
    diverging: divergingPalettes.map(p => ({
      id: p.id,
      name: p.name,
      type: 'diverging',
      colors: interpolateDivergingPalette(p.id, 7),
      colorblindSafe: p.colorblindSafe,
    })),
  }
}

/**
 * Auto-detect best palette type for data
 */
export function detectPaletteType(
  data: unknown[],
  field: string
): PaletteType {
  const values = data.map(d => (d as Record<string, unknown>)[field])
  const uniqueValues = new Set(values)

  // If few unique values, categorical
  if (uniqueValues.size <= 10) {
    return 'categorical'
  }

  // If all values are numbers, check if there's a natural midpoint
  const numericValues = values.filter(v => typeof v === 'number') as number[]
  if (numericValues.length === values.length) {
    const min = Math.min(...numericValues)
    const max = Math.max(...numericValues)
    const range = max - min

    // Check if 0 is near the middle - good candidate for diverging
    if (min < 0 && max > 0 && Math.abs(min) / range > 0.3 && Math.abs(max) / range > 0.3) {
      return 'diverging'
    }

    return 'sequential'
  }

  return 'categorical'
}

/**
 * Get recommended palette for data
 */
export function getRecommendedPalette(
  data: unknown[],
  field: string,
  type?: PaletteType
): { paletteId: string; type: PaletteType } {
  const detectedType = type ?? detectPaletteType(data, field)

  switch (detectedType) {
    case 'sequential':
      return { paletteId: 'viridis', type: 'sequential' }
    case 'diverging':
      return { paletteId: 'rdbu', type: 'diverging' }
    default:
      return { paletteId: 'category10', type: 'categorical' }
  }
}
```

### File 4: `src/components/configurator/PaletteSelector.tsx` (update)

```typescript
'use client'

import { memo, useState, useMemo } from 'react'
import { cn } from '@/lib/utils/cn'
import { getAllPalettes, type PaletteType } from '@/lib/palettes'
import type { Palette as CategoricalPalette } from '@/lib/colors'

interface PaletteSelectorProps {
  value: string
  type: PaletteType
  onChange: (paletteId: string, type: PaletteType) => void
  onDataDetect?: () => { data: unknown[]; field: string } | null
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    categorical?: string
    sequential?: string
    diverging?: string
    colorblindSafe?: string
    recommended?: string
  }
}

function PaletteSelectorComponent({
  value,
  type,
  onChange,
  onDataDetect,
  locale,
  labels,
}: PaletteSelectorProps) {
  const l = {
    categorical: 'Categorical',
    sequential: 'Sequential',
    diverging: 'Diverging',
    colorblindSafe: 'Colorblind safe',
    recommended: 'Recommended',
    ...labels,
  }

  const [activeType, setActiveType] = useState<PaletteType>(type)
  const allPalettes = useMemo(() => getAllPalettes(), [])

  // Get recommended palette if data is available
  const recommendation = useMemo(() => {
    if (!onDataDetect) return null
    const dataInfo = onDataDetect()
    if (!dataInfo) return null

    const { detectPaletteType, getRecommendedPalette } = require('@/lib/palettes')
    const detectedType = detectPaletteType(dataInfo.data, dataInfo.field)
    return {
      ...getRecommendedPalette(dataInfo.data, dataInfo.field, detectedType),
      detectedType,
    }
  }, [onDataDetect])

  const palettes = allPalettes[activeType]

  return (
    <div className="space-y-3">
      {/* Type tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {(['categorical', 'sequential', 'diverging'] as PaletteType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveType(t)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition',
              activeType === t
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            {l[t]}
          </button>
        ))}
      </div>

      {/* Recommendation badge */}
      {recommendation && recommendation.type === activeType && (
        <div className="flex items-center gap-2 text-xs text-amber-600">
          <span>💡</span>
          <span>{l.recommended}: {recommendation.paletteId}</span>
        </div>
      )}

      {/* Palette grid */}
      <div className="grid grid-cols-2 gap-2">
        {palettes.map((palette) => (
          <button
            key={palette.id}
            type="button"
            onClick={() => onChange(palette.id, activeType)}
            className={cn(
              'rounded-lg border p-2 transition hover:border-gov-primary',
              value === palette.id && 'border-gov-primary bg-gov-primary/5'
            )}
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {palette.colors.slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    className="h-4 w-3 first:rounded-l last:rounded-r"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-700">{palette.name}</span>
            </div>
            {palette.colorblindSafe && (
              <span className="inline-flex items-center gap-1 rounded bg-green-100 px-1 py-0.5 text-xs text-green-700">
                👁️ {l.colorblindSafe}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export const PaletteSelector = memo(PaletteSelectorComponent)
```

### File 5: Update chart rendering to use sequential/diverging scales

In `src/components/charts/shared/chart-helpers.tsx`:

```typescript
import { scaleSequential, scaleDiverging } from 'd3-scale'
import { getDivergingColor } from '@/lib/palettes'
import { interpolateSequentialPalette } from '@/lib/palettes'

/**
 * Get color scale based on palette type
 */
export function useColorScale(
  paletteId: string,
  paletteType: PaletteType,
  domain: [number, number] | string[],
  midpoint?: number
) {
  return useMemo(() => {
    switch (paletteType) {
      case 'sequential':
        const colors = interpolateSequentialPalette(paletteId, 7)
        return scaleSequential<string>()
          .domain(domain as [number, number])
          .range(colors)

      case 'diverging':
        return (value: number) =>
          getDivergingColor(paletteId, value, domain as [number, number], midpoint)

      default:
        return scaleOrdinal<string>()
          .domain(domain as string[])
          .range(/* categorical colors */)
    }
  }, [paletteId, paletteType, domain, midpoint])
}
```

---

## Affected areas
- `src/lib/palettes/sequential.ts` (new)
- `src/lib/palettes/diverging.ts` (new)
- `src/lib/palettes/index.ts` (new)
- `src/components/configurator/PaletteSelector.tsx` - Update with type tabs
- `src/components/charts/shared/chart-helpers.tsx` - Add color scale helpers
- `src/stores/configurator.ts` - Add palette type to state
- `src/types/chart-config.ts` - Add palette type to config
- `src/locales/*.json` - Translations

## Constraints
- Color interpolation must be smooth
- Colorblind-safe palettes must be flagged
- Must auto-detect palette type from data
- Continuous scales must support tooltips
- Legend must show color scale for sequential/diverging

## Out of scope
- Custom gradient stops (can add later)
- Palette import/export
- Per-user saved palettes

## Acceptance criteria
- [ ] Sequential palettes available in selector
- [ ] Diverging palettes available in selector
- [ ] Sequential palette interpolates colors for continuous data
- [ ] Diverging palette shows midpoint correctly
- [ ] Auto-detect suggests palette type based on data
- [ ] Colorblind-safe indicator shows on compatible palettes
- [ ] Legend shows color scale (gradient) for sequential/diverging
- [ ] Tooltips show correct interpolated color
- [ ] All text translated in all three locales
