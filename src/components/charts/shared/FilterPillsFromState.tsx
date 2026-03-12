'use client'

import { useMemo } from 'react'
import { FilterPills, type FilterPill } from './FilterPills'
import type { InteractiveFiltersState } from '@/types'

export interface FilterPillsFromStateProps {
  filterState: InteractiveFiltersState | undefined
  dimensionLabels?: Record<string, string>
  valueLabels?: Record<string, Record<string, string>>
  onPillClick?: (key: string) => void
  labels?: {
    filters?: string
    noFilters?: string
    timeRange?: string
    calculation?: string
    absolute?: string
    percent?: string
  }
  className?: string
}

export function FilterPillsFromState({
  filterState,
  dimensionLabels = {},
  valueLabels = {},
  onPillClick,
  labels,
  className,
}: FilterPillsFromStateProps) {
  const pills = useMemo((): FilterPill[] => {
    if (!filterState) return []

    const result: FilterPill[] = []

    // Add time range filter
    if (filterState.timeRange.from || filterState.timeRange.to) {
      const from = filterState.timeRange.from || '...'
      const to = filterState.timeRange.to || '...'
      result.push({
        key: 'timeRange',
        label: labels?.timeRange || 'Time',
        value: `${from} – ${to}`,
      })
    }

    // Add data filters
    for (const [key, value] of Object.entries(filterState.dataFilters)) {
      if (value !== null && value !== undefined) {
        const dimensionLabel = dimensionLabels[key] || key
        const displayValue = Array.isArray(value)
          ? value.map(v => valueLabels[key]?.[v] || v).join(', ')
          : valueLabels[key]?.[value] || value

        result.push({
          key,
          label: dimensionLabel,
          value: displayValue,
        })
      }
    }

    // Add calculation if not default
    if (filterState.calculation === 'percent') {
      result.push({
        key: 'calculation',
        label: labels?.calculation || 'Calculation',
        value: labels?.percent || 'Percent',
      })
    }

    return result
  }, [filterState, dimensionLabels, valueLabels, labels])

  return (
    <FilterPills
      pills={pills}
      onPillClick={onPillClick}
      labels={labels}
      className={className}
    />
  )
}
