'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { DashboardShell, DashboardGrid, DashboardFilterBar, AddChartDialog } from '@/components/dashboard'
import { useDashboardStore } from '@/stores/dashboard'
import type { DashboardConfig, Observation } from '@/types'

interface DashboardClientProps {
  dashboardId: string
  locale: string
  labels: {
    title: string
    description: string
    editMode: string
    viewMode: string
    addChart: string
    save: string
    export: string
    import: string
    sharedFilters: string
    maxChartsReached: string
    untitled: string
    empty: string
    addFirstChart: string
    loadingChart: string
    errorLoading: string
    removeChart: string
    editChart: string
    configure: string
    loading: string
    noData: string
    saved: string
    saving: string
    charts: string
    lastSaved: string
    exportJson: string
    importJson: string
    newDashboard: string
    filterBar?: {
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
    addChartDialog?: {
      title: string
      titlePlaceholder: string
      description: string
      descriptionPlaceholder: string
      chartType: string
      dataset: string
      datasetPlaceholder: string
      selectDataset: string
      cancel: string
      add: string
      adding: string
      configureXAxis: string
      configureYAxis: string
      xAxis: string
      yAxis: string
      segmentBy: string
      optional: string
    }
  }
}

export function DashboardClient({ dashboardId, locale, labels }: DashboardClientProps) {
  const router = useRouter()
  const { dashboard, editMode } = useDashboardStore()
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<Record<string, Observation[]>>({})
  const [isAddChartOpen, setIsAddChartOpen] = useState(false)

  // Load dashboard from store on mount
  useEffect(() => {
    // For now, use the persisted store. In future, this would fetch from API
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [dashboardId])

  // Fetch data for each chart when dashboard changes
  useEffect(() => {
    if (!dashboard) return

    const fetchChartData = async (chartId: string, datasetId?: string) => {
      if (!datasetId) return

      try {
        // For mock datasets, use the mock data
        if (datasetId.startsWith('mock-')) {
          const { loadMockDataset } = await import('@/lib/data/mock-datasets')
          const dataset = await loadMockDataset(datasetId)
          setChartData(prev => ({ ...prev, [chartId]: dataset.observations }))
        } else {
          // For real datasets, try to load from browse API
          try {
            const response = await fetch(`/api/browse/preview?id=${datasetId}`)
            if (response.ok) {
              const data = await response.json()
              setChartData(prev => ({ ...prev, [chartId]: data.observations || data }))
            } else {
              throw new Error('Failed to fetch dataset')
            }
          } catch {
            // If that fails, try to load from resources
            const { loadMockDataset } = await import('@/lib/data/mock-datasets')
            const dataset = await loadMockDataset('mock-population-2024')
            setChartData(prev => ({ ...prev, [chartId]: dataset.observations }))
          }
        }
      } catch (error) {
        void error
      }
    }

    // Fetch data for all charts
    Object.entries(dashboard.charts).forEach(([chartId, config]) => {
      if (config.dataset_id && !chartData[chartId]) {
        fetchChartData(chartId, config.dataset_id)
      }
    })
  }, [dashboard, chartData])

  const handleAddChart = () => {
    setIsAddChartOpen(true)
  }

  const handleChartAdded = (chartId: string) => {
    void chartId
    setIsAddChartOpen(false)
  }

  const handleEditChart = (chartId: string) => {
    // Navigate to chart editing with dashboard context
    router.push(`/${locale}/create?dashboardId=${dashboardId}&chartId=${chartId}&returnTo=dashboard`)
  }

  const handleSave = (savedDashboard: DashboardConfig) => {
    // In a real app, this would persist to an API
    void savedDashboard
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-300 border-t-gov-primary" />
          <p className="text-slate-500">{labels.loading}</p>
        </div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <svg
            className="mx-auto h-16 w-16 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          <h1 className="mt-4 text-xl font-bold text-slate-900">{labels.newDashboard}</h1>
          <p className="mt-2 text-slate-600">{labels.empty}</p>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/dashboard/new`)}
            className="mt-6 rounded-xl bg-gov-primary px-6 py-3 font-medium text-white shadow-md transition hover:bg-gov-accent"
          >
            {labels.newDashboard}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <DashboardShell
        dashboard={dashboard}
        locale={locale}
        labels={{
          title: dashboard.title,
          description: dashboard.description ?? '',
          editMode: labels.editMode,
          viewMode: labels.viewMode,
          addChart: labels.addChart,
          save: labels.save,
          export: labels.export,
          import: labels.import,
          sharedFilters: labels.sharedFilters,
          maxChartsReached: labels.maxChartsReached,
          untitled: labels.untitled,
          saved: labels.saved,
          saving: labels.saving,
          charts: labels.charts,
          lastSaved: labels.lastSaved,
          exportJson: labels.exportJson,
          importJson: labels.importJson,
        }}
        onAddChart={handleAddChart}
        onSave={handleSave}
      />

      {/* Shared Filter Bar */}
      {dashboard.sharedFilters.enabled && labels.filterBar && (
        <div className="mt-4">
          <DashboardFilterBar
            dashboard={dashboard}
            locale={locale}
            labels={{
              sharedFilters: labels.sharedFilters,
              syncTimeRange: labels.filterBar.syncTimeRange,
              syncDimensions: labels.filterBar.syncDimensions,
              addDimension: labels.filterBar.addDimension,
              removeDimension: labels.filterBar.removeDimension,
              applyToAll: labels.filterBar.applyToAll,
              enabled: labels.filterBar.enabled,
              disabled: labels.filterBar.disabled,
              timeRange: labels.filterBar.timeRange,
              dimension: labels.filterBar.dimension,
              noDimensionsAvailable: labels.filterBar.noDimensionsAvailable,
            }}
          />
        </div>
      )}

      <div className="mt-6">
        <DashboardGrid
          dashboard={dashboard}
          editMode={editMode}
          locale={locale}
          labels={{
            empty: labels.empty,
            addFirstChart: labels.addFirstChart,
            loadingChart: labels.loadingChart,
            errorLoading: labels.errorLoading,
            removeChart: labels.removeChart,
            editChart: labels.editChart,
            configure: labels.configure,
            noData: labels.noData,
          }}
          chartData={chartData}
          onEditChart={handleEditChart}
        />
      </div>

      {/* Add Chart Dialog */}
      {labels.addChartDialog && (
        <AddChartDialog
          dashboardId={dashboardId}
          locale={locale}
          labels={{
            addChart: labels.addChart,
            title: labels.addChartDialog.title,
            titlePlaceholder: labels.addChartDialog.titlePlaceholder,
            description: labels.addChartDialog.description,
            descriptionPlaceholder: labels.addChartDialog.descriptionPlaceholder,
            chartType: labels.addChartDialog.chartType,
            dataset: labels.addChartDialog.dataset,
            datasetPlaceholder: labels.addChartDialog.datasetPlaceholder,
            selectDataset: labels.addChartDialog.selectDataset,
            cancel: labels.addChartDialog.cancel,
            add: labels.addChartDialog.add,
            adding: labels.addChartDialog.adding,
            configureXAxis: labels.addChartDialog.configureXAxis,
            configureYAxis: labels.addChartDialog.configureYAxis,
            xAxis: labels.addChartDialog.xAxis,
            yAxis: labels.addChartDialog.yAxis,
            segmentBy: labels.addChartDialog.segmentBy,
            optional: labels.addChartDialog.optional,
          }}
          open={isAddChartOpen}
          onOpenChange={setIsAddChartOpen}
          onChartAdded={handleChartAdded}
        />
      )}
    </div>
  )
}
