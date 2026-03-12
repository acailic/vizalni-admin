'use client'

import { useMemo, memo } from 'react'

import { ChartRenderer } from '@/components/charts/ChartRenderer'
import { PreviewBreakpointToggle, PreviewContainer } from '@/components/configurator'
import type { PreviewBreakpoint } from '@/components/configurator'
import { isConfigReady } from '@/stores/configurator'
import type { ChartConfig, ChartRendererDataRow } from '@/types'

interface ConfiguratorPreviewProps {
  config: Partial<ChartConfig>
  data: ChartRendererDataRow[]
  datasetTitle: string | null
  labels: {
    title: string
    description: string
    no_config: string
  }
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  previewBreakpointLabels?: {
    desktop: string
    laptop: string
    tablet: string
    mobile: string
    tooltip?: string
  }
  previewBreakpoint?: PreviewBreakpoint
  onPreviewBreakpointChange?: (breakpoint: PreviewBreakpoint) => void
}

function ConfiguratorPreviewComponent({
  config,
  data,
  datasetTitle,
  labels,
  locale,
  previewBreakpointLabels,
  previewBreakpoint = null,
  onPreviewBreakpointChange,
}: ConfiguratorPreviewProps) {
  const ready = isConfigReady(config)

  const rendererConfig = useMemo<ChartConfig | null>(() => {
    if (!ready || !config.type) return null

    return {
      type: config.type,
      title: config.title || datasetTitle || 'Chart',
      description: config.description,
      dataset_id: config.dataset_id,
      x_axis: config.x_axis,
      y_axis: config.y_axis,
      options: config.options,
    } as ChartConfig
  }, [ready, config, datasetTitle])

  const chartContent = (
    <div className="min-h-[400px]">
      {ready && rendererConfig ? (
        <ChartRenderer
          config={rendererConfig}
          data={data}
          height={400}
          locale={locale}
        />
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
          <p className="max-w-sm text-center text-sm text-slate-500">
            {labels.no_config}
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="sticky top-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{labels.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.description}</p>
        </div>
        {previewBreakpointLabels && onPreviewBreakpointChange && (
          <PreviewBreakpointToggle
            value={previewBreakpoint}
            onChange={onPreviewBreakpointChange}
            labels={previewBreakpointLabels}
          />
        )}
      </div>

      <div className="mt-4">
        {previewBreakpointLabels && onPreviewBreakpointChange ? (
          <PreviewContainer breakpoint={previewBreakpoint}>
            {chartContent}
          </PreviewContainer>
        ) : (
          chartContent
        )}
      </div>

      {/* Dataset info */}
      {data.length > 0 && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{data.length} rows</span>
            <span>{data[0] ? Object.keys(data[0]).length : 0} columns</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const ConfiguratorPreview = memo(ConfiguratorPreviewComponent)
