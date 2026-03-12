'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ChartBuilder } from '@/components/charts/ChartBuilder'
import { ChartRenderer } from '@/components/charts/ChartRenderer'
import { AddDatasetDrawer } from '@/components/configurator/AddDatasetDrawer'
import { DatasetBadges } from '@/components/configurator/DatasetBadges'
import { getAvailableMockDatasets, loadMockDataset, joinDatasets } from '@/lib/data'
import { useConfiguratorStore, isConfigReady, stepOrder } from '@/stores/configurator'
import type { ChartConfig, ChartRendererDataRow, ParsedDataset, ConfiguratorStep, SupportedChartType, JoinSuggestion, DatasetReference } from '@/types'

interface CreateChartWorkspaceProps {
  datasetId: string
  datasetTitle: string
  datasetDescription?: string | null
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  rows: ChartRendererDataRow[]
  parsedDataset: ParsedDataset
  initialConfig: Partial<ChartConfig>
  labels: {
    eyebrow: string
    title: string
    description: string
    loadedRows: string
    detectedColumns: string
    suggestedType: string
    unavailable: string
    unavailableHint: string
    steps: {
      chartType: string
      mapping: string
      customize: string
      review: string
    }
    compatibilityLabel: string
    disabledReason: string
    xAxis: string
    yAxis: string
    secondaryMeasure: string
    chartTitle: string
    chartDescription: string
    showLegend: string
    showGrid: string
    animation: string
    curveType: string
    fillOpacity: string
    donutMode: string
    showLabels: string
    showPercentages: string
    dotSize: string
    pageSize: string
    next: string
    previous: string
    finish: string
    ready: string
    selectField: string
    // Multi-dataset labels
    datasets: string
    primaryDataset: string
    addDataset: string
    maxDatasetsReached: string
  }
  suggestedTypeLabel: string
}

const validSteps: Set<string> = new Set(stepOrder)

function parseStepParam(param: string | null): ConfiguratorStep | null {
  if (param && validSteps.has(param)) {
    return param as ConfiguratorStep
  }
  return null
}

function parseChartTypeParam(param: string | null): SupportedChartType | null {
  const validTypes: SupportedChartType[] = [
    'line',
    'bar',
    'column',
    'area',
    'pie',
    'scatterplot',
    'table',
    'combo',
  ]
  if (param && validTypes.includes(param as SupportedChartType)) {
    return param as SupportedChartType
  }
  return null
}

export function CreateChartWorkspace({
  datasetId,
  datasetTitle,
  datasetDescription,
  locale,
  rows,
  parsedDataset,
  initialConfig,
  labels,
  suggestedTypeLabel,
}: CreateChartWorkspaceProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [hydrated, setHydrated] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const {
    step,
    config,
    chartType,
    datasets,
    secondaryDatasets,
    activeJoinConfig,
    initialize,
    setStep,
    setChartType,
    updateConfig,
    addDataset,
    removeDataset,
    setJoinConfig,
  } = useConfiguratorStore()

  const columnCount = useMemo(() => (rows[0] ? Object.keys(rows[0]).length : 0), [rows])

  // Read URL params on initial load
  const urlStep = useMemo(() => parseStepParam(searchParams.get('step')), [searchParams])
  const urlChartType = useMemo(() => parseChartTypeParam(searchParams.get('type')), [searchParams])

  // Initialize store from URL params or initial config
  useEffect(() => {
    const initialStep = urlStep ?? 'chartType'
    const initialChartType = urlChartType ?? (initialConfig.type as SupportedChartType) ?? null

    initialize({
      datasetId,
      parsedDataset,
      initialConfig,
      initialStep,
      initialChartType,
    })

    setHydrated(true)
  }, [datasetId, parsedDataset, initialConfig, urlStep, urlChartType, initialize])

  // Sync step changes to URL
  useEffect(() => {
    if (!hydrated) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set('dataset', datasetId)
    params.set('step', step)

    if (chartType) {
      params.set('type', chartType)
    } else {
      params.delete('type')
    }

    const query = params.toString()
    router.replace(`${pathname}?${query}`, { scroll: false })
  }, [step, chartType, hydrated, datasetId, pathname, router, searchParams])

  // Sync store step when URL changes (back/forward button)
  useEffect(() => {
    if (!hydrated || !urlStep) {
      return
    }

    const currentStoreStep = useConfiguratorStore.getState().step
    if (urlStep !== currentStoreStep) {
      setStep(urlStep)
    }
  }, [urlStep, hydrated, setStep])

  // Sync store chart type when URL changes
  useEffect(() => {
    if (!hydrated || !urlChartType) {
      return
    }

    const currentStoreChartType = useConfiguratorStore.getState().chartType
    if (urlChartType !== currentStoreChartType) {
      setChartType(urlChartType)
      updateConfig({ type: urlChartType })
    }
  }, [urlChartType, hydrated, setChartType, updateConfig])

  // Compute joined dataset when secondary datasets are added
  const joinedDataset = useMemo(() => {
    if (datasets.length === 0 || !parsedDataset) {
      return null
    }

    // Join each secondary dataset sequentially
    let result = parsedDataset
    for (const ref of datasets) {
      const secondary = secondaryDatasets.get(ref.datasetId)
      const joinCfg = activeJoinConfig.get(ref.datasetId)
      
      if (secondary && joinCfg) {
        result = joinDatasets(result, secondary, {
          primary: {
            datasetId: parsedDataset.source.datasetId ?? datasetId,
            resourceId: parsedDataset.source.resourceId ?? '',
            joinKey: joinCfg.primaryKey,
          },
          secondary: {
            datasetId: ref.datasetId,
            resourceId: ref.resourceId,
            joinKey: joinCfg.secondaryKey,
          },
          joinType: 'left',
        })
      }
    }
    
    return result
  }, [datasets, secondaryDatasets, activeJoinConfig, parsedDataset, datasetId])

  // Use joined data if available, otherwise use original rows
  const effectiveRows = useMemo(() => {
    if (joinedDataset) {
      return joinedDataset.observations as ChartRendererDataRow[]
    }
    return rows
  }, [joinedDataset, rows])

  const effectiveParsedDataset = joinedDataset ?? parsedDataset

  const rendererConfig = useMemo(
    () => ({
      ...initialConfig,
      ...config,
      type: config.type || initialConfig.type || 'table',
      title: config.title || initialConfig.title || datasetTitle,
    }),
    [config, datasetTitle, initialConfig]
  )

  // Available mock datasets for the drawer (exclude already added)
  const availableMockDatasets = useMemo(() => {
    const addedIds = new Set(datasets.map(d => d.datasetId))
    return getAvailableMockDatasets().filter(d => !addedIds.has(d.id))
  }, [datasets])

  // Handler for adding a secondary dataset
  const handleAddDataset = useCallback(
    (ref: DatasetReference, dataset: ParsedDataset, suggestion: JoinSuggestion) => {
      addDataset(ref, dataset)
      setJoinConfig(ref.datasetId, suggestion.primaryKey, suggestion.secondaryKey)
    },
    [addDataset, setJoinConfig]
  )

  // Handler for loading a mock dataset
  const handleLoadMockDataset = useCallback(
    async (datasetId: string, _resourceId: string): Promise<ParsedDataset> => {
      return loadMockDataset(datasetId)
    },
    []
  )

  if (!rows.length) {
    return (
      <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{labels.unavailable}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{labels.unavailableHint}</p>
      </section>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gov-primary">
          {labels.eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">{datasetTitle}</h1>
        {datasetDescription ? (
          <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600">
            {datasetDescription}
          </p>
        ) : null}
        
        {/* Multi-dataset badges */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {labels.datasets}
          </span>
          <DatasetBadges
            datasets={datasets}
            primaryDatasetId={datasetId}
            labels={{
              primary: labels.primaryDataset,
              secondary: 'Secondary',
              remove: 'Remove',
              maxDatasetsReached: labels.maxDatasetsReached,
            }}
            onRemove={removeDataset}
            maxDatasets={3}
          />
          {datasets.length < 2 && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {labels.addDataset}
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {labels.loadedRows}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{effectiveRows.length}</p>
            {joinedDataset && (
              <p className="text-xs text-blue-600 mt-1">Joined from {datasets.length + 1} datasets</p>
            )}
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {labels.detectedColumns}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {joinedDataset ? joinedDataset.columns.length : columnCount}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {labels.suggestedType}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{suggestedTypeLabel}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[380px,minmax(0,1fr)]">
        <ChartBuilder
          data={effectiveRows}
          parsedDataset={effectiveParsedDataset}
          datasetId={datasetId}
          initialConfig={initialConfig}
          labels={labels}
        />
        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{labels.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{labels.description}</p>
          </div>
          {isConfigReady(config) ? (
            <ChartRenderer config={rendererConfig} data={effectiveRows} height={480} locale={locale} />
          ) : (
            <section className="flex min-h-[480px] items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <p className="max-w-md text-sm leading-7 text-slate-600">{labels.description}</p>
            </section>
          )}
        </div>
      </section>

      {/* Add Dataset Drawer */}
      <AddDatasetDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        primaryDataset={parsedDataset}
        labels={{
          title: labels.addDataset,
          searchPlaceholder: 'Search datasets...',
          addDataset: labels.addDataset,
          cancel: 'Cancel',
          confirm: 'Add Dataset',
          loading: 'Loading dataset...',
          joinBy: 'Join by',
          joinPreview: 'Join Preview',
          noMatchingColumns: 'No matching columns found for join',
          lowOverlap: 'Low overlap ({{percent}}%) between datasets',
          selectJoinKey: 'Select join key',
          overlapPercent: '{{percent}}% overlap',
          matchedColumns: 'match',
          innerJoin: 'Inner Join',
          leftJoin: 'Left Join',
        }}
        onAddDataset={handleAddDataset}
        availableDatasets={availableMockDatasets}
        onLoadDataset={handleLoadMockDataset}
      />
    </div>
  )
}
