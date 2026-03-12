'use client'

import { useMemo } from 'react'

import { cn } from '@/lib/utils/cn'

import type { GeoFeature } from './ChoroplethLayer'

interface MapTooltipProps {
  feature: GeoFeature
  value: number | null
  position: { x: number; y: number }
  locale: string
  formatNumber: (value: number) => string
  getLocalizedName: (feature: GeoFeature) => string
  unit?: string
  rank?: number
  totalEntities?: number
  measureLabel?: string
}

// Labels by locale
const LABELS = {
  'sr-Cyrl': {
    code: 'Шифра',
    noData: 'Нема података',
    rank: 'Ранг',
    of: 'од',
  },
  'sr-Latn': {
    code: 'Šifra',
    noData: 'Nema podataka',
    rank: 'Rang',
    of: 'od',
  },
  en: {
    code: 'Code',
    noData: 'No data',
    rank: 'Rank',
    of: 'of',
  },
}

export function MapTooltip({
  feature,
  value,
  position,
  locale,
  formatNumber,
  getLocalizedName,
  unit,
  rank,
  totalEntities,
  measureLabel,
}: MapTooltipProps) {
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en
  const name = getLocalizedName(feature)
  const hasValue = value !== null && !isNaN(value)

  // Calculate tooltip position to keep it within bounds
  const tooltipStyle: React.CSSProperties = useMemo(() => {
    // Clamp position to keep tooltip visible
    const maxX = 300
    const maxY = 350
    const offsetX = 15
    const offsetY = -10

    return {
      position: 'absolute',
      left: Math.min(position.x + offsetX, maxX),
      top: Math.min(Math.max(position.y + offsetY, 10), maxY),
      zIndex: 1000,
      pointerEvents: 'none',
    }
  }, [position])

  // Format rank text
  const rankText = useMemo(() => {
    if (rank === undefined || totalEntities === undefined) return null
    
    // Ordinal suffixes for English
    const getOrdinal = (n: number): string => {
      if (locale === 'en') {
        const s = ['th', 'st', 'nd', 'rd']
        const v = n % 100
        return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!)
      }
      return String(n)
    }

    return `${labels.rank}: ${getOrdinal(rank)} ${labels.of} ${totalEntities}`
  }, [rank, totalEntities, locale, labels])

  return (
    <div
      style={tooltipStyle}
      className={cn(
        'min-w-[140px] max-w-[240px] rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-150'
      )}
    >
      {/* Entity name */}
      <div className="text-sm font-semibold text-slate-900">{name}</div>
      
      {/* Code */}
      <div className="mt-0.5 text-xs text-slate-400">
        {labels.code}: {feature.properties.code}
      </div>

      {/* Measure value */}
      <div className="mt-2 flex items-baseline gap-1">
        {hasValue ? (
          <>
            <span className="text-lg font-bold text-blue-600">
              {formatNumber(value)}
            </span>
            {unit && (
              <span className="text-xs text-slate-500">{unit}</span>
            )}
          </>
        ) : (
          <span className="text-sm italic text-slate-400">{labels.noData}</span>
        )}
      </div>

      {/* Measure label */}
      {measureLabel && (
        <div className="mt-0.5 text-xs text-slate-500">{measureLabel}</div>
      )}

      {/* Rank */}
      {rankText && hasValue && (
        <div className="mt-1.5 border-t border-slate-100 pt-1.5 text-xs text-slate-500">
          {rankText}
        </div>
      )}
    </div>
  )
}

/**
 * Calculate rank for a value within a dataset
 */
export function calculateRank(
  value: number,
  allValues: number[],
  order: 'ascending' | 'descending' = 'descending'
): number {
  const validValues = allValues.filter(v => !isNaN(v) && isFinite(v))
  
  if (order === 'descending') {
    // Higher values get lower rank (1 = highest)
    const sorted = [...validValues].sort((a, b) => b - a)
    return sorted.indexOf(value) + 1
  } else {
    // Lower values get lower rank (1 = lowest)
    const sorted = [...validValues].sort((a, b) => a - b)
    return sorted.indexOf(value) + 1
  }
}

export { LABELS as TOOLTIP_LABELS }
