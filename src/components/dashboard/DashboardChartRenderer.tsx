'use client'

import { useMemo } from 'react'

import dynamic from 'next/dynamic'

import type { ChartConfig, ChartRendererDataRow } from '@/types'

// Dynamically import ChartRenderer to avoid SSR issues
const ChartRenderer = dynamic(
  () => import('@/components/charts/ChartRenderer').then(mod => mod.ChartRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        <div className="text-sm text-slate-400">Loading chart...</div>
      </div>
    ),
  }
)

interface DashboardChartRendererProps {
  config: ChartConfig
  data?: ChartRendererDataRow[]
  height?: number
  locale?: string
  isLoading?: boolean
  error?: string | null
  noDataLabel?: string
}

export function DashboardChartRenderer({
  config,
  data,
  height = 300,
  locale = 'sr-Cyrl',
  isLoading,
  error,
  noDataLabel: _noDataLabel = 'No data available',
}: DashboardChartRendererProps) {
  const chartData = useMemo(() => data ?? [], [data])
  const noDataLabel = _noDataLabel

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-gov-primary" />
          <p className="text-sm text-slate-500">Loading data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-800">Error loading chart</p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-2 text-sm text-slate-500">{noDataLabel}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ChartRenderer config={config} data={chartData} height={height} locale={locale} />
    </div>
  )
}
