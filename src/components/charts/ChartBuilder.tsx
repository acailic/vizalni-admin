'use client'

import { useEffect, useMemo } from 'react'

import { getChartTypeAvailability, getDefaultMappingForType } from '@/lib/charts/configurator'
import { getChartTypeOptions } from '@/lib/charts/registry'
import { useConfiguratorStore, canProceedFromStep, stepOrder } from '@/stores/configurator'
import type { ChartConfig, ParsedDataset, SupportedChartType, ConfiguratorStep } from '@/types'

interface ChartBuilderProps {
  datasetId: string
  data?: Record<string, unknown>[]
  parsedDataset: ParsedDataset
  initialConfig?: Partial<ChartConfig>
  labels: {
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
  }
  onConfigChange?: (config: ChartConfig) => void
}

function getDefaultConfig(datasetId: string): Partial<ChartConfig> {
  return {
    type: 'column',
    title: '',
    dataset_id: datasetId,
    options: {
      showLegend: true,
      showGrid: true,
      animation: true,
      responsive: true,
    },
  }
}

export function ChartBuilder({
  datasetId,
  parsedDataset,
  initialConfig,
  labels,
  onConfigChange,
}: ChartBuilderProps) {
  const {
    step,
    config,
    initialize,
    setStep,
    setChartType,
    updateConfig,
    nextStep,
    prevStep,
  } = useConfiguratorStore()

  const baseConfig = useMemo(
    () => ({
      ...getDefaultConfig(datasetId),
      ...initialConfig,
      dataset_id: datasetId,
      options: {
        ...getDefaultConfig(datasetId).options,
        ...initialConfig?.options,
      },
    }),
    [datasetId, initialConfig]
  )

  const dimensionFields = parsedDataset.dimensions
  const measureFields = parsedDataset.measures
  const chartTypes = getChartTypeOptions()
  const availability = useMemo(() => getChartTypeAvailability(parsedDataset), [parsedDataset])
  const availabilityMap = useMemo(
    () => Object.fromEntries(availability.map(item => [item.type, item])),
    [availability]
  )

  // Initialize store with data
  useEffect(() => {
    initialize({
      datasetId,
      parsedDataset,
      initialConfig: baseConfig,
      initialChartType: baseConfig.type as SupportedChartType,
    })
  }, [datasetId, parsedDataset, baseConfig, initialize])

  // Notify parent of config changes
  useEffect(() => {
    if (!onConfigChange) {
      return
    }

    if (config.type === 'table' || (config.x_axis?.field && config.y_axis?.field)) {
      onConfigChange(config as ChartConfig)
    }
  }, [config, onConfigChange])

  const handleUpdate = (updates: Partial<ChartConfig>) => {
    updateConfig(updates)
  }

  const handleChartTypeSelect = (type: SupportedChartType) => {
    const mapping = getDefaultMappingForType(parsedDataset, type)
    updateConfig({
      type,
      x_axis: mapping.xField ? { field: mapping.xField } : undefined,
      y_axis: mapping.yField ? { field: mapping.yField } : undefined,
      options: {
        ...config.options,
        secondaryField: mapping.secondaryField,
      },
    })
    setChartType(type)
  }

  const canProceed = canProceedFromStep(step, config, parsedDataset)
  const getStepLabel = (stepKey: ConfiguratorStep) =>
    stepKey === 'dataset' ? 'Dataset' : labels.steps[stepKey]

  const selectedChartLabel =
    chartTypes.find(ct => ct.type === (config.type as SupportedChartType))?.label || 'Chart'

  const renderStepNavigation = (
    <div className="mb-6 flex flex-wrap gap-2">
      {stepOrder.map(stepKey => (
        <button
          key={stepKey}
          className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
            step === stepKey
              ? 'bg-gov-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          onClick={() => setStep(stepKey)}
          type="button"
        >
          {getStepLabel(stepKey)}
        </button>
      ))}
    </div>
  )

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Chart Configurator</h2>
      <p className="mb-6 text-sm leading-6 text-slate-600">
        {labels.steps.chartType} → {labels.steps.mapping} → {labels.steps.customize} →{' '}
        {labels.steps.review}
      </p>

      {renderStepNavigation}

      {step === 'chartType' ? (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.steps.chartType}
            </label>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {chartTypes.map(ct => {
                const availabilityItem = availabilityMap[ct.type]
                const disabled = availabilityItem?.disabled ?? false
                return (
                  <button
                    key={ct.type}
                    disabled={disabled}
                    onClick={() => handleChartTypeSelect(ct.type)}
                    type="button"
                    className={`rounded-2xl border p-4 text-left transition ${
                      config.type === ct.type
                        ? 'border-gov-primary bg-blue-50'
                        : disabled
                          ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mb-2 text-2xl">{ct.icon}</div>
                    <div className="text-sm font-semibold">{ct.label}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      {disabled
                        ? `${labels.disabledReason} ${availabilityItem?.reason ?? ''}`
                        : labels.compatibilityLabel}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}

      {step === 'mapping' ? (
        <div className="space-y-5">
          {config.type !== 'table' ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {labels.xAxis}
                </label>
                <select
                  value={config.x_axis?.field || ''}
                  onChange={e =>
                    handleUpdate({
                      x_axis: e.target.value ? { field: e.target.value } : undefined,
                    })
                  }
                  className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-gov-primary focus:border-transparent"
                >
                  <option value="">{labels.selectField}</option>
                  {dimensionFields.map(field => (
                    <option key={field.key} value={field.key}>
                      {field.label} ({field.type})
                    </option>
                  ))}
                  {config.type === 'scatterplot'
                    ? measureFields.map(field => (
                        <option key={field.key} value={field.key}>
                          {field.label} (measure)
                        </option>
                      ))
                    : null}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {labels.yAxis}
                </label>
                <select
                  value={config.y_axis?.field || ''}
                  onChange={e =>
                    handleUpdate({
                      y_axis: e.target.value ? { field: e.target.value } : undefined,
                    })
                  }
                  className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-gov-primary focus:border-transparent"
                >
                  <option value="">{labels.selectField}</option>
                  {measureFields.map(field => (
                    <option key={field.key} value={field.key}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              {config.type === 'combo' ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {labels.secondaryMeasure}
                  </label>
                  <select
                    value={config.options?.secondaryField || ''}
                    onChange={e =>
                      handleUpdate({
                        options: {
                          ...config.options,
                          secondaryField: e.target.value || undefined,
                        },
                      })
                    }
                    className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-gov-primary focus:border-transparent"
                  >
                    <option value="">{labels.selectField}</option>
                    {measureFields
                      .filter(field => field.key !== config.y_axis?.field)
                      .map(field => (
                        <option key={field.key} value={field.key}>
                          {field.label}
                        </option>
                      ))}
                  </select>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              {parsedDataset.columns.length} fields will be available in the table preview.
            </div>
          )}
        </div>
      ) : null}

      {step === 'customize' ? (
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.chartTitle}
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={e => handleUpdate({ title: e.target.value })}
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-gov-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.chartDescription}
            </label>
            <textarea
              value={config.description || ''}
              onChange={e => handleUpdate({ description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-gov-primary focus:border-transparent"
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.options?.showLegend ?? true}
                onChange={e =>
                  handleUpdate({
                    options: { ...config.options, showLegend: e.target.checked },
                  })
                }
                className="rounded"
              />
              <span className="text-sm">{labels.showLegend}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.options?.showGrid ?? true}
                onChange={e =>
                  handleUpdate({
                    options: { ...config.options, showGrid: e.target.checked },
                  })
                }
                className="rounded"
              />
              <span className="text-sm">{labels.showGrid}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.options?.animation ?? true}
                onChange={e =>
                  handleUpdate({
                    options: { ...config.options, animation: e.target.checked },
                  })
                }
                className="rounded"
              />
              <span className="text-sm">{labels.animation}</span>
            </label>
          </div>

          {config.type === 'line' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {labels.curveType}
              </label>
              <select
                value={config.options?.curveType || 'monotone'}
                onChange={e =>
                  handleUpdate({
                    options: {
                      ...config.options,
                      curveType: e.target.value as 'linear' | 'monotone' | 'step',
                    },
                  })
                }
                className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-gov-primary focus:border-transparent"
              >
                <option value="monotone">Monotone</option>
                <option value="linear">Linear</option>
                <option value="step">Step</option>
              </select>
            </div>
          ) : null}

          {config.type === 'area' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {labels.fillOpacity}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.options?.fillOpacity ?? 0.3}
                onChange={e =>
                  handleUpdate({
                    options: {
                      ...config.options,
                      fillOpacity: Number.parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
            </div>
          ) : null}

          {config.type === 'pie' ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(config.options?.innerRadius ?? 0) > 0}
                  onChange={e =>
                    handleUpdate({
                      options: {
                        ...config.options,
                        innerRadius: e.target.checked ? 50 : 0,
                      },
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">{labels.donutMode}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.options?.showLabels ?? true}
                  onChange={e =>
                    handleUpdate({
                      options: {
                        ...config.options,
                        showLabels: e.target.checked,
                      },
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">{labels.showLabels}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.options?.showPercentages ?? true}
                  onChange={e =>
                    handleUpdate({
                      options: {
                        ...config.options,
                        showPercentages: e.target.checked,
                      },
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">{labels.showPercentages}</span>
              </label>
            </div>
          ) : null}

          {config.type === 'scatterplot' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {labels.dotSize}
              </label>
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={config.options?.dotSize ?? 5}
                onChange={e =>
                  handleUpdate({
                    options: {
                      ...config.options,
                      dotSize: Number.parseInt(e.target.value, 10),
                    },
                  })
                }
                className="w-full"
              />
            </div>
          ) : null}

          {config.type === 'table' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {labels.pageSize}
              </label>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={config.options?.pageSize ?? 10}
                onChange={e =>
                  handleUpdate({
                    options: {
                      ...config.options,
                      pageSize: Number.parseInt(e.target.value, 10),
                    },
                  })
                }
                className="w-full"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 'review' ? (
        <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">
            {labels.ready} <span className="font-bold">{selectedChartLabel}</span>
          </p>
          <dl className="grid gap-3 text-sm text-blue-900">
            <div>
              <dt className="font-medium">{labels.chartTitle}</dt>
              <dd>{config.title || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium">{labels.xAxis}</dt>
              <dd>{config.x_axis?.field || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium">{labels.yAxis}</dt>
              <dd>{config.y_axis?.field || '—'}</dd>
            </div>
            {config.type === 'combo' ? (
              <div>
                <dt className="font-medium">{labels.secondaryMeasure}</dt>
                <dd>{config.options?.secondaryField || '—'}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 'dataset' || step === 'chartType'}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {labels.previous}
        </button>
        <button
          type="button"
          onClick={step === 'review' ? undefined : nextStep}
          disabled={step === 'review' ? !canProceed : !canProceedFromStep(step, config, parsedDataset)}
          className="rounded-xl bg-gov-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-gov-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {step === 'review' ? labels.finish : labels.next}
        </button>
      </div>
    </div>
  )
}
