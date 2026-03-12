'use client'

import { useState, useMemo } from 'react'

import * as Dialog from '@radix-ui/react-dialog'

import { useDashboardStore } from '@/stores/dashboard'
import type { ChartConfig, SupportedChartType } from '@/types'

interface AddChartDialogProps {
  dashboardId: string
  locale?: string
  labels: {
    addChart: string
    title: string
    titlePlaceholder: string
    description: string
    descriptionPlaceholder: string
    chartType: string
    dataset: string
    datasetPlaceholder: string
    cancel: string
    add: string
    adding: string
    configureXAxis: string
    configureYAxis: string
    selectDataset: string
    xAxis: string
    yAxis: string
    segmentBy: string
    optional: string
  }
  onChartAdded?: (chartId: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const CHART_TYPES = [
  { value: 'column', label: 'Column Chart', icon: '📊' },
  { value: 'bar', label: 'Bar Chart', icon: '📈' },
  { value: 'line', label: 'Line Chart', icon: '📉' },
  { value: 'area', label: 'Area Chart', icon: '🏔️' },
  { value: 'pie', label: 'Pie Chart', icon: '🥧' },
  { value: 'scatterplot', label: 'Scatter Plot', icon: '⚫' },
  { value: 'table', label: 'Table', icon: '📋' },
] as const satisfies ReadonlyArray<{ value: SupportedChartType; label: string; icon: string }>

const MOCK_DATASETS = [
  { id: 'mock-population-2024', name: 'Population by Region 2024' },
  { id: 'mock-budget-2024', name: 'Budget Allocation 2024' },
  { id: 'mock-economic-indicators', name: 'Economic Indicators' },
  { id: 'mock-demographics-regions', name: 'Demographics by Region' },
  { id: 'mock-employment-stats', name: 'Employment Statistics' },
  { id: 'mock-gdp-growth', name: 'GDP Growth Trends' },
]

export function AddChartDialog({
  dashboardId: _dashboardId,
  locale: _locale = 'sr-Cyrl',
  labels,
  onChartAdded,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddChartDialogProps) {
  const { addChart } = useDashboardStore()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [chartType, setChartType] = useState<SupportedChartType>('column')
  const [datasetId, setDatasetId] = useState('')
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const canAdd = useMemo(() => {
    return chartType && datasetId && (chartType === 'table' || (xAxis && yAxis))
  }, [chartType, datasetId, xAxis, yAxis])

  const handleAdd = async () => {
    if (!canAdd) return

    setIsAdding(true)

    try {
      const chartId = `chart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

      const config: ChartConfig = {
        id: chartId,
        type: chartType,
        title,
        description: description || undefined,
        dataset_id: datasetId,
        x_axis: chartType !== 'table' ? { field: xAxis, type: 'category' } : undefined,
        y_axis: chartType !== 'table' ? { field: yAxis, type: 'linear' } : undefined,
      }

      addChart(chartId, config)
      onChartAdded?.(chartId)

      // Reset form
      setTitle('')
      setDescription('')
      setChartType('column')
      setDatasetId('')
      setXAxis('')
      setYAxis('')

      setOpen(false)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <Dialog.Title className="mb-4 text-xl font-bold text-slate-900">
            {labels.addChart}
          </Dialog.Title>

          <Dialog.Description className="mb-6 text-sm text-slate-600">
            {labels.title}
          </Dialog.Description>

          <div className="space-y-4">
            {/* Chart Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {labels.chartType}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CHART_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setChartType(type.value)}
                    className={`rounded-lg border p-3 text-center transition ${
                      chartType === type.value
                        ? 'border-gov-primary bg-gov-primary/5 ring-2 ring-gov-primary/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl">{type.icon}</div>
                    <div className="mt-1 text-xs font-medium text-slate-700">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dataset */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {labels.dataset}
              </label>
              <select
                value={datasetId}
                onChange={e => setDatasetId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary/20"
              >
                <option value="">{labels.selectDataset}</option>
                {MOCK_DATASETS.map(ds => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {labels.title}
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={labels.titlePlaceholder}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {labels.description} ({labels.optional})
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={labels.descriptionPlaceholder}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary/20"
              />
            </div>

            {/* Axes */}
            {chartType !== 'table' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {labels.xAxis}
                  </label>
                  <input
                    type="text"
                    value={xAxis}
                    onChange={e => setXAxis(e.target.value)}
                    placeholder="e.g., region, year"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {labels.yAxis}
                  </label>
                  <input
                    type="text"
                    value={yAxis}
                    onChange={e => setYAxis(e.target.value)}
                    placeholder="e.g., population, budget"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary/20"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {labels.cancel}
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!canAdd || isAdding}
                className="flex items-center gap-2 rounded-xl bg-gov-primary px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-gov-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {labels.adding}
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {labels.add}
                  </>
                )}
              </button>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
