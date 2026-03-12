'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

export interface FilterPill {
  key: string
  label: string
  value: string
}

export interface FilterPillsProps {
  pills: FilterPill[]
  onPillClick?: (key: string) => void
  labels?: {
    filters?: string
    noFilters?: string
  }
  className?: string
}

function FilterPillsComponent({ pills, onPillClick, labels, className }: FilterPillsProps) {
  const l = {
    filters: 'Filters',
    noFilters: 'No filters applied',
    ...labels,
  }

  if (pills.length === 0) {
    return (
      <div className={cn('text-sm text-slate-500', className)}>
        {l.noFilters}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm font-medium text-slate-700">{l.filters}:</span>
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          onClick={() => onPillClick?.(pill.key)}
          className={cn(
            'inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700',
            'transition hover:bg-slate-200',
            onPillClick && 'cursor-pointer'
          )}
        >
          <span className="font-medium">{pill.label}:</span>
          <span>{pill.value}</span>
        </button>
      ))}
    </div>
  )
}

export const FilterPills = memo(FilterPillsComponent)
