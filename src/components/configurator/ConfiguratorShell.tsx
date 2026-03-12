'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { getSuggestedChartConfig } from '@/lib/charts/suggestions'
import { loadDatasetFromUrl } from '@/lib/data'
import { useUrlState } from '@/lib/hooks/useUrlState'
import { URL_STATE_VERSION, type PartialUrlState } from '@/lib/url'
import { useConfiguratorStore, canProceedFromStep, stepOrder } from '@/stores/configurator'
import type { ChartConfig, ChartRendererDataRow, ConfiguratorStep, ParsedDataset, SupportedChartType } from '@/types'

import { ChartTypeStep } from './ChartTypeStep'
import { ConfiguratorPreview } from './ConfiguratorPreview'
import { ConfiguratorSidebar } from './ConfiguratorSidebar'
import { CustomizeStep } from './CustomizeStep'
import { DatasetStep } from './DatasetStep'
import { MappingStep } from './MappingStep'
import { PreviewStep } from './PreviewStep'


interface ConfiguratorShellProps {
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels: {
    steps: {
      dataset: string
      chartType: string
      mapping: string
      customize: string
      review: string
    }
    stepIndicator: string
    backToBrowse: string
    next: string
    previous: string
    finish: string
    loadingDataset: string
    loadError: string
    preview: {
      title: string
      description: string
      no_config: string
    }
    previewBreakpoints?: {
      desktop: string
      laptop: string
      tablet: string
      mobile: string
      tooltip?: string
    }
  }
  preselectedDatasetId?: string | undefined
  preselectedResourceId?: string | undefined
  preselectedResourceUrl?: string | undefined
  preselectedResourceFormat?: string | undefined
  preselectedResourceSize?: number | undefined
  preselectedDatasetTitle?: string | undefined
  preselectedOrganizationName?: string | undefined
  preselectedParsedDataset?: ParsedDataset | undefined
  initialConfig?: Partial<ChartConfig> | undefined
}

const validSteps: Set<string> = new Set(stepOrder)

function parseStepParam(param: string | null): ConfiguratorStep | null {
  if (param && validSteps.has(param)) {
    return param as ConfiguratorStep
  }
  return null
}

const validChartTypes: Set<string> = new Set([
  'line', 'bar', 'column', 'area', 'pie', 'scatterplot', 'table', 'combo'
])

function parseChartTypeParam(param: string | null): SupportedChartType | null {
  if (param && validChartTypes.has(param)) {
    return param as SupportedChartType
  }
  return null
}

function formatResourceSize(filesize?: number) {
  if (!filesize || filesize <= 0) {
    return null
  }

  const units = ['B', 'KB', 'MB', 'GB']
  let size = filesize
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

export function ConfiguratorShell({
  locale,
  labels,
  preselectedDatasetId,
  preselectedResourceId,
  preselectedResourceUrl,
  preselectedResourceFormat,
  preselectedResourceSize,
  preselectedDatasetTitle,
  preselectedOrganizationName,
  preselectedParsedDataset,
  initialConfig,
}: ConfiguratorShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hydrated, setHydrated] = useState(false)
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)
  const [isPreloadingDataset, setIsPreloadingDataset] = useState(false)
  const [preloadError, setPreloadError] = useState<string | null>(null)
  const resourceSizeLabel = useMemo(
    () => formatResourceSize(preselectedResourceSize),
    [preselectedResourceSize]
  )

  const {
    step,
    config,
    chartType,
    datasetId,
    parsedDataset,
    datasetTitle,
    initialize,
    setStep,
    setChartType,
    updateConfig,
    nextStep,
    prevStep,
    previewBreakpoint,
    setPreviewBreakpoint,
  } = useConfiguratorStore()

  const urlStep = useMemo(() => parseStepParam(searchParams.get('step')), [searchParams])
  const urlChartType = useMemo(() => parseChartTypeParam(searchParams.get('type')), [searchParams])

  // URL state sync hook for shareable URLs
  const { updateUrlState } = useUrlState({
    enabled: true,
    onStateRestored: (state: PartialUrlState) => {
      // Restore state from URL hash if available
      if (state.config?.type) {
        setChartType(state.config.type as SupportedChartType)
        updateConfig(state.config)
      }
    },
  })

  // Initialize store from URL params or props
  useEffect(() => {
    const initialStep = urlStep ?? (preselectedDatasetId ? 'chartType' : 'dataset')
    const initialChartType = urlChartType ?? (initialConfig?.type as SupportedChartType) ?? null

    initialize({
      datasetId: preselectedDatasetId,
      resourceId: preselectedResourceId,
      datasetTitle: preselectedDatasetTitle,
      organizationName: preselectedOrganizationName,
      parsedDataset: preselectedParsedDataset,
      initialConfig,
      initialStep,
      initialChartType,
    })

    setHydrated(true)
  }, [
    preselectedDatasetId,
    preselectedResourceId,
    preselectedDatasetTitle,
    preselectedOrganizationName,
    preselectedParsedDataset,
    initialConfig,
    urlStep,
    urlChartType,
    initialize,
  ])

  const preloadSelectedDataset = useCallback(async () => {
    if (
      !preselectedDatasetId ||
      !preselectedResourceId ||
      !preselectedResourceUrl ||
      !preselectedResourceFormat ||
      parsedDataset
    ) {
      return
    }

    setIsPreloadingDataset(true)
    setPreloadError(null)

    try {
      const loadedDataset = await loadDatasetFromUrl(preselectedResourceUrl, {
        datasetId: preselectedDatasetId,
        resourceId: preselectedResourceId,
        resourceUrl: preselectedResourceUrl,
        format: preselectedResourceFormat,
        rowLimit: 500,
        fetchInit: {
          cache: 'no-store',
        },
      })

      const suggestedConfig = getSuggestedChartConfig(
        preselectedDatasetId,
        preselectedDatasetTitle ?? '',
        loadedDataset
      )

      initialize({
        datasetId: preselectedDatasetId,
        resourceId: preselectedResourceId,
        datasetTitle: preselectedDatasetTitle,
        organizationName: preselectedOrganizationName,
        parsedDataset: loadedDataset,
        initialConfig: suggestedConfig,
        initialStep: urlStep ?? 'chartType',
        initialChartType: (suggestedConfig.type as SupportedChartType | undefined) ?? null,
      })
    } catch (error) {
      setPreloadError(error instanceof Error ? error.message : labels.loadError)
    } finally {
      setIsPreloadingDataset(false)
    }
  }, [
    preselectedDatasetId,
    preselectedResourceId,
    preselectedResourceUrl,
    preselectedResourceFormat,
    preselectedDatasetTitle,
    preselectedOrganizationName,
    parsedDataset,
    initialize,
    urlStep,
    labels.loadError,
  ])

  useEffect(() => {
    if (!hydrated || preselectedParsedDataset || parsedDataset || !preselectedDatasetId) {
      return
    }

    if (
      !preselectedResourceId ||
      !preselectedResourceUrl ||
      !preselectedResourceFormat
    ) {
      return
    }

    void preloadSelectedDataset()
  }, [
    hydrated,
    preselectedParsedDataset,
    parsedDataset,
    preselectedDatasetId,
    preselectedResourceId,
    preselectedResourceUrl,
    preselectedResourceFormat,
    preloadSelectedDataset,
  ])

  // Sync step changes to URL query params
  useEffect(() => {
    if (!hydrated || !datasetId) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('dataset', datasetId)
    params.set('step', step)

    if (chartType) {
      params.set('type', chartType)
    } else {
      params.delete('type')
    }

    const query = params.toString()
    const currentQuery = searchParams.toString()

    // Only update if query params actually changed
    if (query !== currentQuery) {
      router.replace(`${pathname}?${query}`, { scroll: false })
    }
  }, [step, chartType, hydrated, datasetId, pathname, router, searchParams])

  // Sync full state to URL hash for shareable URLs
  useEffect(() => {
    if (!hydrated || !datasetId || !config.type) return

    try {
      // Build partial state for URL hash
      // Only include serializable options to prevent JSON.stringify errors
      const serializableOptions = config.options ? {
        showLegend: config.options.showLegend,
        showGrid: config.options.showGrid,
        colors: config.options.colors,
        animation: config.options.animation,
        responsive: config.options.responsive,
        curveType: config.options.curveType,
        showDots: config.options.showDots,
        grouping: config.options.grouping,
        fillOpacity: config.options.fillOpacity,
        innerRadius: config.options.innerRadius,
        showLabels: config.options.showLabels,
        showPercentages: config.options.showPercentages,
        dotSize: config.options.dotSize,
        opacity: config.options.opacity,
        pageSize: config.options.pageSize,
        secondaryField: config.options.secondaryField,
        legendPosition: config.options.legendPosition,
        geoLevel: config.options.geoLevel,
      } : undefined

      const urlState: PartialUrlState = {
        v: URL_STATE_VERSION,
        dataset: {
          datasetId,
          resourceId: preselectedResourceId ?? '',
          datasetTitle: datasetTitle ?? undefined,
          organizationName: preselectedOrganizationName ?? undefined,
        },
        config: {
          type: config.type,
          title: config.title ?? '',
          description: config.description,
          x_axis: config.x_axis,
          y_axis: config.y_axis,
          options: serializableOptions,
        },
      }

      updateUrlState(urlState)
    } catch (error) {
      // Silently fail URL state sync - not critical for functionality
      console.warn('Failed to sync URL state:', error)
    }
  }, [
    hydrated,
    datasetId,
    config,
    datasetTitle,
    preselectedResourceId,
    preselectedOrganizationName,
    updateUrlState,
  ])

  // Sync store step when URL changes (back/forward button)
  useEffect(() => {
    if (!hydrated || !urlStep) return
    const currentStoreStep = useConfiguratorStore.getState().step
    if (urlStep !== currentStoreStep) {
      setStep(urlStep)
    }
  }, [urlStep, hydrated, setStep])

  // Sync store chart type when URL changes
  useEffect(() => {
    if (!hydrated || !urlChartType) return
    const currentStoreChartType = useConfiguratorStore.getState().chartType
    if (urlChartType !== currentStoreChartType) {
      setChartType(urlChartType)
      updateConfig({ type: urlChartType })
    }
  }, [urlChartType, hydrated, setChartType, updateConfig])

  const canProceed = canProceedFromStep(step, config, parsedDataset)
  const currentStepIndex = step === 'dataset' ? -1 : stepOrder.indexOf(step as Exclude<ConfiguratorStep, 'dataset'>)
  const totalSteps = stepOrder.length + 1 // +1 for 'dataset' step

  const data = useMemo((): ChartRendererDataRow[] => {
    return (parsedDataset?.observations as ChartRendererDataRow[]) ?? []
  }, [parsedDataset])

  const renderStep = () => {
    if (preselectedDatasetId && !parsedDataset) {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">
              {preselectedDatasetTitle || preselectedDatasetId}
            </h3>
            {preselectedOrganizationName ? (
              <p className="mt-1 text-sm text-slate-600">{preselectedOrganizationName}</p>
            ) : null}
          </div>

          {isPreloadingDataset ? (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-gov-primary" />
              <div className="space-y-1">
                <p>{labels.loadingDataset}</p>
                {preselectedResourceFormat || resourceSizeLabel ? (
                  <p className="text-xs text-slate-500">
                    {[preselectedResourceFormat?.toUpperCase(), resourceSizeLabel]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {!isPreloadingDataset && preloadError ? (
            <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>{preloadError}</p>
              <button
                type="button"
                onClick={() => void preloadSelectedDataset()}
                className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                Retry
              </button>
            </div>
          ) : null}
        </div>
      )
    }

    switch (step) {
      case 'dataset':
        return <DatasetStep />
      case 'chartType':
        return <ChartTypeStep />
      case 'mapping':
        return <MappingStep />
      case 'customize':
        return <CustomizeStep />
      case 'review':
        return <PreviewStep data={data} locale={locale} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="container-custom flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/browse`)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gov-primary transition hover:text-gov-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            {labels.backToBrowse}
          </button>
          <p className="text-sm text-slate-500">
            {labels.stepIndicator
              .replace('{{current}}', String(currentStepIndex + 1))
              .replace('{{total}}', String(totalSteps))}
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="container-custom py-6">
        <div className="grid gap-6 lg:grid-cols-[380px,minmax(0,1fr)]">
          {/* Sidebar with steps */}
          <div className="space-y-4">
            <ConfiguratorSidebar labels={labels} />
            
            {/* Step content card */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              {renderStep()}

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 'dataset'}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {labels.previous}
                </button>
                {step !== 'review' ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed}
                    className="rounded-xl bg-gov-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-gov-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {labels.next}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-xl bg-gov-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-gov-accent"
                  >
                    {labels.finish}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile preview toggle */}
            <button
              type="button"
              onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
              className="lg:hidden w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              {isMobilePreviewOpen ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          {/* Preview panel */}
          <div className={`${isMobilePreviewOpen ? 'block' : 'hidden'} lg:block`}>
            <ConfiguratorPreview
              config={config}
              data={data}
              datasetTitle={datasetTitle}
              labels={labels.preview}
              locale={locale}
              previewBreakpointLabels={labels.previewBreakpoints}
              previewBreakpoint={previewBreakpoint}
              onPreviewBreakpointChange={setPreviewBreakpoint}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
