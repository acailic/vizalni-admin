'use client'

import { useMemo } from 'react'

import { getLegendTicks, COLOR_PALETTES } from '@/lib/charts/color-scales'
import { cn } from '@/lib/utils/cn'
import type { MapPalette, ColorScaleType } from '@/types/chart-config'

interface MapLegendProps {
  breaks: number[]
  palette: MapPalette
  scaleType: ColorScaleType
  formatNumber: (value: number) => string
  locale: string
  min?: number
  max?: number
  showSymbols?: boolean
  symbolMinSize?: number
  symbolMaxSize?: number
  className?: string
  title?: string
}

// Labels by locale
const LABELS = {
  'sr-Cyrl': {
    legend: 'Легенда',
    noData: 'Нема података',
    rank: 'ранг',
    of: 'од',
  },
  'sr-Latn': {
    legend: 'Legenda',
    noData: 'Nema podataka',
    rank: 'rang',
    of: 'od',
  },
  en: {
    legend: 'Legend',
    noData: 'No data',
    rank: 'rank',
    of: 'of',
  },
}

export function MapLegend({
  breaks,
  palette,
  scaleType,
  formatNumber,
  locale,
  min,
  max,
  showSymbols = false,
  symbolMinSize = 8,
  symbolMaxSize = 40,
  className,
  title,
}: MapLegendProps) {
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en
  const colors = COLOR_PALETTES[palette] || COLOR_PALETTES.blues

  // Get legend display ticks
  const ticks = useMemo(() => {
    if (breaks.length === 0) return []
    return getLegendTicks(breaks, 5)
  }, [breaks])

  // Generate gradient stops for continuous legend
  const gradientStops = useMemo(() => {
    if (scaleType === 'diverging') {
      // For diverging scales, create symmetric gradient
      const stops: string[] = []
      const colorCount = colors.length
      for (let i = 0; i < colorCount; i++) {
        const percent = (i / (colorCount - 1)) * 100
        stops.push(`${colors[i]} ${percent.toFixed(1)}%`)
      }
      return stops.join(', ')
    }
    // Sequential scale
    const stops: string[] = []
    const colorCount = colors.length
    for (let i = 0; i < colorCount; i++) {
      const percent = (i / (colorCount - 1)) * 100
      stops.push(`${colors[i]} ${percent.toFixed(1)}%`)
    }
    return stops.join(', ')
  }, [colors, scaleType])

  // Symbol legend values
  const symbolValues = useMemo(() => {
    if (!showSymbols || min === undefined || max === undefined) return []
    const step = (max - min) / 3
    return [
      { value: min, size: symbolMinSize },
      { value: min + step, size: (symbolMinSize + symbolMaxSize) / 2 },
      { value: max, size: symbolMaxSize },
    ]
  }, [showSymbols, min, max, symbolMinSize, symbolMaxSize])

  if (breaks.length === 0 && !showSymbols) return null

  return (
    <div
      className={cn(
        'z-[1000] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm',
        className
      )}
    >
      <div className="mb-2 text-xs font-semibold text-slate-700">
        {title || labels.legend}
      </div>

      {/* Continuous color scale */}
      {breaks.length > 0 && (
        <div className="mb-3">
          <div
            className="h-4 w-full rounded-sm"
            style={{
              background: `linear-gradient(to right, ${gradientStops})`,
            }}
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            {ticks.map((tick, index) => (
              <span key={index}>{formatNumber(tick)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Discrete color classes */}
      {breaks.length > 1 && scaleType === 'sequential' && (
        <div className="mb-3 grid grid-cols-5 gap-0.5">
          {colors.slice(0, Math.min(colors.length, 5)).map((color, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="h-4 w-full rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="mt-0.5 text-[8px] text-slate-400">
                {index === 0 && formatNumber(breaks[0]!)}
                {index === colors.slice(0, 5).length - 1 && formatNumber(breaks[breaks.length - 1]!)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Symbol legend */}
      {showSymbols && symbolValues.length > 0 && (
        <div className="mt-2 border-t border-slate-100 pt-2">
          <div className="mb-1 text-[10px] font-medium text-slate-500">
            {locale === 'sr-Cyrl' ? 'Величина симбола' : locale === 'sr-Latn' ? 'Veličina simbola' : 'Symbol size'}
          </div>
          <div className="flex items-end justify-center gap-3">
            {symbolValues.map((sv, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="rounded-full bg-blue-500 opacity-70"
                  style={{
                    width: sv.size,
                    height: sv.size,
                  }}
                />
                <span className="mt-1 text-[9px] text-slate-500">
                  {formatNumber(sv.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data indicator */}
      <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-2">
        <div className="h-3 w-6 rounded-sm bg-slate-200" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #9CA3AF 2px, #9CA3AF 4px)',
        }} />
        <span className="text-[10px] text-slate-500">{labels.noData}</span>
      </div>
    </div>
  )
}

/**
 * Discrete legend for categorical or classed data
 */
interface DiscreteLegendProps {
  classes: { label: string; color: string; count?: number }[]
  locale: string
  className?: string
}

export function DiscreteLegend({ classes, locale, className }: DiscreteLegendProps) {
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en

  return (
    <div
      className={cn(
        'z-[1000] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm',
        className
      )}
    >
      <div className="mb-2 text-xs font-semibold text-slate-700">{labels.legend}</div>
      <div className="flex flex-col gap-1">
        {classes.map((cls, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-6 rounded-sm"
              style={{ backgroundColor: cls.color }}
            />
            <span className="text-xs text-slate-600">{cls.label}</span>
            {cls.count !== undefined && (
              <span className="text-xs text-slate-400">({cls.count})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { LABELS as LEGEND_LABELS }
