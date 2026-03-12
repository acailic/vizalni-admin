'use client'

import { useState, useMemo, memo, useRef, useCallback } from 'react'

import { generateChartEmbedCode, type EmbedTheme } from '@/lib/embed'
import { exportDataAsCSV } from '@/lib/export/export-csv'
import { exportChartAsPNG } from '@/lib/export/export-png'
import { cn } from '@/lib/utils/cn'
import { useConfiguratorStore, isConfigReady } from '@/stores/configurator'
import { useInteractiveFiltersStore } from '@/stores/interactive-filters'
import { FilterPillsFromState } from '@/components/charts/shared/FilterPillsFromState'
import { DatasetInfoFooter } from '@/components/charts/shared/DatasetInfoFooter'
import type { ChartRendererDataRow } from '@/types'

interface PreviewStepProps {
  data: ChartRendererDataRow[]
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    ready?: string
    actions?: {
      download_png?: string
      download_csv?: string
      copy_embed?: string
      copy_url?: string
      save_chart?: string
    }
    copied?: string
    no_preview?: string
    theme?: {
      light?: string
      dark?: string
      auto?: string
    }
    embed_size?: string
    width?: string
    height?: string
    // Filter pills labels
    filters?: string
    noFilters?: string
    timeRange?: string
    calculation?: string
    absolute?: string
    percent?: string
    // Dataset info labels
    dataset?: string
    latestUpdate?: string
  }
}

function PreviewStepComponent({ data, locale: _locale, labels }: PreviewStepProps) {
  const l = {
    ready: 'Configuration ready',
    actions: {
      download_png: 'Download PNG',
      download_csv: 'Download CSV',
      copy_embed: 'Copy embed code',
      copy_url: 'Copy URL',
      save_chart: 'Save chart',
      ...labels?.actions,
    },
    copied: 'Copied!',
    no_preview: 'Complete the configuration to see preview',
    theme: {
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      ...labels?.theme,
    },
    embed_size: 'Embed size',
    width: 'Width',
    height: 'Height',
    ...labels,
  }

  const { config, datasetId, resourceId, datasetTitle, organizationName } = useConfiguratorStore()
  const interactiveFilters = useInteractiveFiltersStore(
    state => state.charts['configurator-preview']
  )
  const [copied, setCopied] = useState<string | null>(null)
  const [embedTheme, setEmbedTheme] = useState<EmbedTheme>('light')
  const [embedWidth, setEmbedWidth] = useState<string>('100%')
  const [embedHeight, setEmbedHeight] = useState<number>(500)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const ready = isConfigReady(config)

  // Generate embed code using the utility
  const embedCode = useMemo(() => {
    if (!ready || !datasetId || !resourceId || !config.type) {
      return null
    }

    return generateChartEmbedCode(
      typeof window !== 'undefined' ? window.location.origin : '',
      datasetId,
      resourceId,
      {
        type: config.type,
        title: config.title ?? '',
        description: config.description,
        x_axis: config.x_axis,
        y_axis: config.y_axis,
        options: config.options,
      },
      {
        datasetTitle: datasetTitle || undefined,
        organizationName: organizationName || undefined,
        theme: embedTheme,
        width: embedWidth,
        height: embedHeight,
      }
    )
  }, [ready, datasetId, resourceId, config, datasetTitle, organizationName, embedTheme, embedWidth, embedHeight])

  const handleCopyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      console.error('Failed to copy to clipboard')
    }
  }

  const handleDownloadPNG = useCallback(async () => {
    // Find the chart container element
    const chartElement = chartContainerRef.current?.querySelector('[data-chart-container]') as HTMLElement | null
    if (!chartElement) {
      // Fallback to canvas if no container found
      const canvas = document.querySelector('canvas')
      if (canvas) {
        const link = document.createElement('a')
        link.download = `${config.title || 'chart'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
      return
    }

    try {
      await exportChartAsPNG(chartElement, {
        title: config.title || 'chart',
        source: datasetTitle ? `data.gov.rs — ${datasetTitle}` : 'data.gov.rs',
        scale: 2,
        backgroundColor: '#ffffff',
      })
    } catch (error) {
      console.error('Failed to export PNG:', error)
    }
  }, [config.title, datasetTitle])

  const handleDownloadCSV = useCallback(() => {
    if (!data.length) return

    exportDataAsCSV(data, {
      title: config.title || 'chart-data',
      delimiter: ';', // Serbian locale uses semicolon
      includeBOM: true, // UTF-8 BOM for Excel compatibility
    })
  }, [data, config.title])

  const getShareUrl = () => {
    return embedCode?.url || window.location.href
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-semibold text-green-900">
          ✅ {l.ready}
        </p>
        <dl className="mt-3 grid gap-2 text-sm text-green-800">
          <div className="flex justify-between">
            <dt className="font-medium">Title:</dt>
            <dd>{config.title || datasetTitle || '—'}</dd>
          </div>
          {organizationName && (
            <div className="flex justify-between">
              <dt className="font-medium">Source:</dt>
              <dd>data.gov.rs — {organizationName}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="font-medium">Type:</dt>
            <dd className="capitalize">{config.type}</dd>
          </div>
          {config.x_axis?.field && (
            <div className="flex justify-between">
              <dt className="font-medium">X Axis:</dt>
              <dd>{config.x_axis.field}</dd>
            </div>
          )}
          {config.y_axis?.field && (
            <div className="flex justify-between">
              <dt className="font-medium">Y Axis:</dt>
              <dd>{config.y_axis.field}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Embed Options */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">{l.embed_size}</p>

        {/* Theme selector */}
        <div role="group" aria-labelledby="embed-theme-label">
          <span id="embed-theme-label" className="mb-1 block text-xs font-medium text-slate-600">Theme</span>
          <div className="flex gap-2">
            {(['light', 'dark', 'auto'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setEmbedTheme(t)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition',
                  embedTheme === t
                    ? 'border-gov-primary bg-gov-primary/10 text-gov-primary'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                {l.theme[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Size inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{l.width}</label>
            <input
              type="text"
              value={embedWidth}
              onChange={(e) => setEmbedWidth(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary"
              placeholder="100% or 800px"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{l.height}</label>
            <input
              type="number"
              value={embedHeight}
              onChange={(e) => setEmbedHeight(Number(e.target.value))}
              min={200}
              max={2000}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={!ready}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition',
            ready
              ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {l.actions.download_png}
        </button>
        <button
          type="button"
          onClick={handleDownloadCSV}
          disabled={!data.length}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition',
            data.length
              ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {l.actions.download_csv}
        </button>
        <button
          type="button"
          onClick={() => handleCopyToClipboard(embedCode?.fullCode || '', 'embed')}
          disabled={!ready || !embedCode}
          className={cn(
            'relative flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition',
            ready && embedCode
              ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          {copied === 'embed' ? l.copied : l.actions.copy_embed}
        </button>
        <button
          type="button"
          onClick={() => handleCopyToClipboard(getShareUrl(), 'url')}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {copied === 'url' ? l.copied : l.actions.copy_url}
        </button>
      </div>

      {/* Save chart button (requires Feature 13) */}
      <button
        type="button"
        disabled
        className="w-full rounded-xl bg-gov-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-gov-accent disabled:cursor-not-allowed disabled:opacity-50"
        title="Requires authentication"
      >
        {l.actions.save_chart} (requires login)
      </button>

      {/* Filter Pills */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <FilterPillsFromState
          filterState={interactiveFilters}
          labels={{
            filters: l.filters,
            noFilters: l.noFilters,
            timeRange: l.timeRange,
            calculation: l.calculation,
            absolute: l.absolute,
            percent: l.percent,
          }}
          className=""
        />
      </div>

      {/* Dataset Info Footer */}
      {datasetTitle && (
        <DatasetInfoFooter
          datasetName={datasetTitle}
          datasetUrl={datasetId ? `/browse/${datasetId}` : undefined}
          locale={_locale}
          labels={{
            dataset: l.dataset,
            latestUpdate: l.latestUpdate,
          }}
          className="pt-2 border-t border-slate-100"
        />
      )}

      {/* Source attribution */}
      {datasetTitle && (
        <p className="text-center text-xs text-slate-500">
          Source: data.gov.rs — {datasetTitle}
        </p>
      )}
    </div>
  )
}

export const PreviewStep = memo(PreviewStepComponent)
