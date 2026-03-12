'use client'

import { useMemo } from 'react'

import type { DashboardConfig, ChartConfig } from '@/types'

interface DashboardFilterBarProps {
  dashboard: DashboardConfig
  locale?: string
  labels: {
    sharedFilters: string
    syncTimeRange: string
    syncDimensions: string
    addDimension: string
    removeDimension: string
    applyToAll: string
    enabled: string
    disabled: string
    timeRange: string
    dimension: string
    noDimensionsAvailable: string
  }
}

/**
 * Get unique dimensions across all charts in the dashboard
 */
function getSharedDimensions(charts: Record<string, ChartConfig>): string[] {
  const dimensionCounts = new Map<string, number>()
  const chartCount = Object.keys(charts).length

  Object.values(charts).forEach(chart => {
    const dimensions = new Set<string>()

    // Collect all dimension fields used in the chart
    if (chart.x_axis?.field) dimensions.add(chart.x_axis.field)
    if (chart.y_axis?.field) dimensions.add(chart.y_axis.field)

    // Track which dimensions are used across charts
    dimensions.forEach(dim => {
      dimensionCounts.set(dim, (dimensionCounts.get(dim) ?? 0) + 1)
    })
  })

  // Return dimensions that appear in all charts (or at least 2)
  return Array.from(dimensionCounts.entries())
    .filter(([, count]) => count >= 2 && count <= chartCount)
    .map(([dim]) => dim)
    .sort()
}

/**
 * Check if any charts have temporal X axes
 */
function hasTemporalCharts(charts: Record<string, ChartConfig>): boolean {
  return Object.values(charts).some(
    chart => chart.x_axis?.type === 'date' || chart.type === 'line' || chart.type === 'area'
  )
}

export function DashboardFilterBar({
  dashboard,
  locale: _locale = 'sr-Cyrl',
  labels,
}: DashboardFilterBarProps) {
  const sharedDimensions = useMemo(() => getSharedDimensions(dashboard.charts), [dashboard.charts])
  const showTimeRangeSync = useMemo(
    () => hasTemporalCharts(dashboard.charts),
    [dashboard.charts]
  )

  // Only show if there are at least 2 charts with shared dimensions or temporal axes
  if (Object.keys(dashboard.charts).length < 2 || (!showTimeRangeSync && sharedDimensions.length === 0)) {
    return null
  }

  return (
    <div className="rounded-xl border border-gov-primary/20 bg-gov-primary/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-gov-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <h3 className="font-semibold text-slate-900">{labels.sharedFilters}</h3>
      </div>

      <div className="space-y-4">
        {/* Time Range Info */}
        {showTimeRangeSync && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">{labels.syncTimeRange}</p>
            <p className="text-xs text-slate-500">
              Use individual chart filters to filter by time range. Shared time range filtering coming soon.
            </p>
          </div>
        )}

        {/* Dimension Info */}
        {sharedDimensions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">{labels.syncDimensions}</p>
            <div className="flex flex-wrap gap-2">
              {sharedDimensions.map(dim => (
                <span
                  key={dim}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {dim}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              These dimensions appear in multiple charts. Shared filtering coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
