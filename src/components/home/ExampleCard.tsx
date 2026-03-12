'use client'

import { BarChart3, LineChart, PieChart, RefreshCw } from 'lucide-react'

import { ChartRenderer } from '@/components/charts/ChartRenderer'
import type { Locale } from '@/lib/i18n/config'
import type { LoadingStatus } from '@/lib/examples/types'
import type { FeaturedExampleConfig } from '@/lib/examples/types'
import { getLocalizedText } from '@/lib/examples/types'
import type { ParsedDataset } from '@/types/observation'

// Chart type icons map
const chartTypeIcons = {
  line: LineChart,
  bar: BarChart3,
  column: BarChart3,
  area: BarChart3,
  pie: PieChart,
  scatterplot: BarChart3,
  table: BarChart3,
  combo: BarChart3,
  map: BarChart3,
} as const

interface ExampleCardProps {
  config: FeaturedExampleConfig
  locale: Locale
  dataset: ParsedDataset | null
  status: LoadingStatus
  onRetry?: () => void
}

export function ExampleCard({ config, locale, dataset, status, onRetry }: ExampleCardProps) {
  const title = getLocalizedText(config.title, locale)
  const description = getLocalizedText(config.description, locale)
  const chartType = config.chartConfig.type as keyof typeof chartTypeIcons
  const ChartIcon = chartTypeIcons[chartType] || BarChart3

  // Loading state
  if (status === 'loading' || status === 'idle') {
    return (
      <article
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        aria-busy="true"
        aria-label={title}
      >
        {/* Chart skeleton */}
        <div className="aspect-video animate-pulse bg-gray-100" />
        {/* Content skeleton */}
        <div className="space-y-3 p-4">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        </div>
      </article>
    )
  }

  // Error state
  if (status === 'error') {
    const errorMessages: Record<Locale, string> = {
      'sr-Cyrl': 'Није могуће учитати податке',
      'sr-Latn': 'Nije moguće učitati podatke',
      en: 'Unable to load data',
    }
    const retryLabels: Record<Locale, string> = {
      'sr-Cyrl': 'Понови',
      'sr-Latn': 'Ponovi',
      en: 'Retry',
    }

    return (
      <article
        className="overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-sm"
        role="alert"
        aria-label={`${title} - Error`}
      >
        <div className="flex aspect-video flex-col items-center justify-center gap-4 p-8">
          <div className="rounded-full bg-red-100 p-3">
            <ChartIcon className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-center text-sm text-red-600">{errorMessages[locale]}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              {retryLabels[locale]}
            </button>
          )}
        </div>
      </article>
    )
  }

  // Success state
  return (
    <article
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
      aria-label={title}
    >
      {/* Chart area */}
      <div className="aspect-video bg-gray-50">
        {dataset && (
          <ChartRenderer config={config.chartConfig} data={dataset.observations} height={240} locale={locale} />
        )}
      </div>

      {/* Content area */}
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-gray-900 group-hover:text-blue-600">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>

        {/* Chart type badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            <ChartIcon className="h-3 w-3" />
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
          </span>
        </div>
      </div>
    </article>
  )
}
