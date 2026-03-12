# Feature Request

## Title
Advanced Color Palette System with Sequential and Diverging Palettes

## Problem
Current color palette system only supports categorical colors. Users with continuous data (e.g., temperature, population density) cannot use sequential palettes. Users with data that has a meaningful midpoint (e.g., change rates, comparison to average) cannot use diverging palettes. The Swiss tool provides dimension-aware palette defaults and multiple palette types.

## Proposed behavior

### Palette Types
1. **Categorical** - For discrete categories (current implementation)
2. **Sequential** - For continuous data with light-to-dark progression
3. **Diverging** - For data with meaningful midpoint (negative/positive)

### Palette Categories
1. **Government** - Serbian government brand colors
2. **Sequential** - Single-hue progressions (Blues, Greens, Reds)
3. **Diverging** - Two-hue progressions (Red-Blue, Orange-Purple)
4. **Colorblind-safe** - Palettes that work for color vision deficiency

### UI Requirements
- Palette type selector (Categorical/Sequential/Diverging)
- Palette preview with color swatches
- Colorblind-safe indicator
- Interpolation preview for sequential palettes
- Midpoint color picker for diverging palettes

---

## Detailed Implementation

### File 1: `src/lib/charts/palettes-advanced.ts` (new)

```typescript
/**
 * Advanced color palette system supporting sequential and diverging palettes
 */

export type PaletteType = 'categorical' | 'sequential' | 'diverging'

export interface ColorPalette {
  id: string
  name: string
  type: PaletteType
  colors: string[]
  colorblindSafe: boolean
  description?: string
}

// ============================================================================
// Categorical Palettes (existing, enhanced)
// ============================================================================

export const categoricalPalettes: ColorPalette[] = [
  {
    id: 'gov-serbia',
    name: 'Government Serbia',
    type: 'categorical',
    colors: ['#C00D23', '#1E3A5F', '#2E7D32', '#F57C00', '#7B1FA2', '#00838F'],
    colorblindSafe: false,
    description: 'Official Serbian government brand colors'
  },
  {
    id: 'categorical-1',
    name: 'Category10',
    type: 'categorical',
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    colorblindSafe: false
  },
  {
    id: 'tableau-10',
    name: 'Tableau 10',
    type: 'categorical',
    colors: ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'],
    colorblindSafe: true
  },
  {
    id: 'okabe-ito',
    name: 'Okabe-Ito',
    type: 'categorical',
    colors: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'],
    colorblindSafe: true,
    description: 'Designed for colorblind accessibility'
  }
]

// ============================================================================
// Sequential Palettes
// ============================================================================

export const sequentialPalettes: ColorPalette[] = [
  {
    id: 'blues',
    name: 'Blues',
    type: 'sequential',
    colors: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    colorblindSafe: false
  },
  {
    id: 'greens',
    name: 'Greens',
    type: 'sequential',
    colors: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    colorblindSafe: false
  },
  {
    id: 'reds',
    name: 'Reds',
    type: 'sequential',
    colors: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    colorblindSafe: false
  },
  {
    id: 'oranges',
    name: 'Oranges',
    type: 'sequential',
    colors: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    colorblindSafe: false
  },
  {
    id: 'purples',
    name: 'Purples',
    type: 'sequential',
    colors: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    colorblindSafe: false
  },
  {
    id: 'viridis',
    name: 'Viridis',
    type: 'sequential',
    colors: ['#440154', '#482878', '#3e4a89', '#31688e', '#26838f', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'],
    colorblindSafe: true,
    description: 'Perceptually uniform, colorblind safe'
  },
  {
    id: 'plasma',
    name: 'Plasma',
    type: 'sequential',
    colors: ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'],
    colorblindSafe: false
  },
  {
    id: 'inferno',
    name: 'Inferno',
    type: 'sequential',
    colors: ['#000004', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d13d', '#fcffa4'],
    colorblindSafe: false
  }
]

// ============================================================================
// Diverging Palettes
// ============================================================================

export const divergingPalettes: ColorPalette[] = [
  {
    id: 'rdylbu',
    name: 'Red-Yellow-Blue',
    type: 'diverging',
    colors: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
    colorblindSafe: false
  },
  {
    id: 'rdylgn',
    name: 'Red-Yellow-Green',
    type: 'diverging',
    colors: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
    colorblindSafe: false
  },
  {
    id: 'rdbu',
    name: 'Red-Blue',
    type: 'diverging',
    colors: ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'],
    colorblindSafe: false
  },
  {
    id: 'piyg',
    name: 'Pink-Yellow-Green',
    type: 'diverging',
    colors: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
    colorblindSafe: false
  },
  {
    id: 'spectral',
    name: 'Spectral',
    type: 'diverging',
    colors: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
    colorblindSafe: false
  },
  {
    id: 'cool-warm',
    name: 'Cool Warm',
    type: 'diverging',
    colors: ['#3b4cc0', '#5977e3', '#7b9ff9', '#9ebeff', '#c0d4f5', '#f2f0f7', '#f4c7b3', '#e89b7f', '#d65c3e', '#b40426'],
    colorblindSafe: true,
    description: 'Colorblind-safe diverging palette'
  }
]

// ============================================================================
// All Palettes Combined
// ============================================================================

export const allPalettes: ColorPalette[] = [
  ...categoricalPalettes,
  ...sequentialPalettes,
  ...divergingPalettes
]

// ============================================================================
// Palette Utilities
// ============================================================================

/**
 * Get a palette by ID
 */
export function getPalette(id: string): ColorPalette | undefined {
  return allPalettes.find(p => p.id === id)
}

/**
 * Get palettes by type
 */
export function getPalettesByType(type: PaletteType): ColorPalette[] {
  switch (type) {
    case 'categorical':
      return categoricalPalettes
    case 'sequential':
      return sequentialPalettes
    case 'diverging':
      return divergingPalettes
  }
}

/**
 * Interpolate a sequential/diverging palette to get a specific color
 * @param palette - The palette to interpolate
 * @param value - Value between 0 and 1
 */
export function interpolatePaletteColor(palette: ColorPalette, value: number): string {
  if (palette.type === 'categorical') {
    // For categorical, just return the color at the rounded index
    const index = Math.round(value * (palette.colors.length - 1))
    return palette.colors[Math.max(0, Math.min(palette.colors.length - 1, index))]
  }

  // For sequential/diverging, interpolate between colors
  const colors = palette.colors
  const scaledValue = value * (colors.length - 1)
  const lowerIndex = Math.floor(scaledValue)
  const upperIndex = Math.min(lowerIndex + 1, colors.length - 1)
  const t = scaledValue - lowerIndex

  return interpolateColor(colors[lowerIndex], colors[upperIndex], t)
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)

  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Determine best palette type for a field
 */
export function suggestPaletteType(
  fieldType: 'string' | 'number' | 'date',
  uniqueValueCount: number
): PaletteType {
  if (fieldType === 'string') {
    return 'categorical'
  }

  if (fieldType === 'date') {
    return 'sequential'
  }

  // For numbers, decide based on unique values
  if (uniqueValueCount <= 10) {
    return 'categorical'
  }

  // Check if data appears to have meaningful midpoint
  // (This is a heuristic - could be enhanced with actual data analysis)
  return 'sequential'
}

/**
 * Get colorblind-safe palettes only
 */
export function getColorblindSafePalettes(): ColorPalette[] {
  return allPalettes.filter(p => p.colorblindSafe)
}
```

### File 2: `src/components/configurator/PaletteSelector.tsx` (new)

```typescript
'use client'

import { memo, useState, useMemo } from 'react'
import { Eye, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  PaletteType,
  ColorPalette,
  getPalettesByType,
  interpolatePaletteColor
} from '@/lib/charts/palettes-advanced'

interface PaletteSelectorProps {
  value: string
  onChange: (paletteId: string) => void
  suggestedType?: PaletteType
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
}

const typeLabels: Record<PaletteType, Record<string, string>> = {
  categorical: {
    'sr-Cyrl': 'Категоријске',
    'sr-Latn': 'Kategorijske',
    'en': 'Categorical'
  },
  sequential: {
    'sr-Cyrl': 'Секвенцијалне',
    'sr-Latn': 'Sekvencijalne',
    'en': 'Sequential'
  },
  diverging: {
    'sr-Cyrl': 'Дивергентне',
    'sr-Latn': 'Divergentne',
    'en': 'Diverging'
  }
}

function PaletteSelectorComponent({
  value,
  onChange,
  suggestedType = 'categorical',
  locale
}: PaletteSelectorProps) {
  const [selectedType, setSelectedType] = useState<PaletteType>(suggestedType)

  const palettes = useMemo(() => getPalettesByType(selectedType), [selectedType])

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="flex gap-2">
        {(['categorical', 'sequential', 'diverging'] as PaletteType[]).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
              selectedType === type
                ? "bg-gov-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {typeLabels[type][locale]}
          </button>
        ))}
      </div>

      {/* Palette grid */}
      <div className="grid gap-2">
        {palettes.map(palette => (
          <PaletteOption
            key={palette.id}
            palette={palette}
            isSelected={value === palette.id}
            onClick={() => onChange(palette.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface PaletteOptionProps {
  palette: ColorPalette
  isSelected: boolean
  onClick: () => void
}

function PaletteOption({ palette, isSelected, onClick }: PaletteOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg border-2 transition-all",
        isSelected
          ? "border-gov-primary bg-gov-primary/5"
          : "border-transparent hover:border-slate-200 bg-slate-50"
      )}
    >
      {/* Color swatches */}
      <div className="flex-1">
        {palette.type === 'categorical' ? (
          // Show discrete color swatches
          <div className="flex h-6 rounded overflow-hidden">
            {palette.colors.slice(0, 8).map((color, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: color }}
              />
            ))}
            {palette.colors.length > 8 && (
              <div className="flex-1 bg-slate-300 flex items-center justify-center text-xs text-slate-600">
                +{palette.colors.length - 8}
              </div>
            )}
          </div>
        ) : (
          // Show gradient for sequential/diverging
          <div
            className="h-6 rounded"
            style={{
              background: `linear-gradient(to right, ${palette.colors.join(', ')})`
            }}
          />
        )}
      </div>

      {/* Name and badges */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">
          {palette.name}
        </span>

        {/* Colorblind-safe indicator */}
        {palette.colorblindSafe && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
            <Eye className="w-3 h-3" />
          </span>
        )}

        {/* Selected indicator */}
        {isSelected && (
          <Check className="w-4 h-4 text-gov-primary" />
        )}
      </div>
    </button>
  )
}

export const PaletteSelector = memo(PaletteSelectorComponent)
```

### File 3: Update `src/components/configurator/CustomizeStep.tsx`

Replace basic color picker with advanced palette selector:

```typescript
import { PaletteSelector } from './PaletteSelector'
import { getPalette, interpolatePaletteColor, suggestPaletteType } from '@/lib/charts/palettes-advanced'

// In the color customization section:
<div className="space-y-2">
  <label className="text-sm font-medium text-slate-700">
    {l.colorPalette}
  </label>
  <PaletteSelector
    value={config.options?.paletteId ?? 'gov-serbia'}
    onChange={(paletteId) => updateConfig({
      options: {
        ...config.options,
        paletteId,
        colors: getPalette(paletteId)?.colors ?? []
      }
    })}
    suggestedType={suggestPaletteType(
      fieldTypes[config.y_axis.field] ?? 'number',
      uniqueValueCounts[config.y_axis.field] ?? 10
    )}
    locale={locale}
  />
</div>
```

### File 4: Update `src/lib/charts/palettes.ts`

Enhance existing palette file to use new system:

```typescript
export { getPalette, interpolatePaletteColor } from './palettes-advanced'
export type { ColorPalette, PaletteType } from './palettes-advanced'
```

---

## Affected areas
- `src/lib/charts/palettes-advanced.ts` (new) - All palette definitions and utilities
- `src/components/configurator/PaletteSelector.tsx` (new) - UI for palette selection
- `src/components/configurator/CustomizeStep.tsx` - Use new palette selector
- `src/lib/charts/palettes.ts` - Re-export from advanced module
- `src/components/charts/*` - Use interpolatePaletteColor for sequential data
- `src/locales/*.json` - Add translations

## Constraints
- All palettes must have at least 5 colors
- Colorblind-safe palettes must pass simulation tests
- Sequential palettes must be perceptually uniform
- Diverging palettes must have neutral midpoint

## Out of scope
- Custom palette creation (future feature)
- Import palettes from external tools
- Per-series color override

## Acceptance criteria
- [ ] Categorical palettes display as discrete swatches
- [ ] Sequential palettes display as gradient
- [ ] Diverging palettes display as gradient with midpoint
- [ ] Type selector switches palette categories
- [ ] Colorblind-safe badge shows on compatible palettes
- [ ] Selected palette has visual indicator
- [ ] Palette selection updates chart colors
- [ ] Sequential charts interpolate colors correctly
- [ ] Diverging charts use midpoint correctly
