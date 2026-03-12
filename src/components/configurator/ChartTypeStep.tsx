'use client'

import { useMemo } from 'react'

import { getChartTypeAvailability, getDefaultMappingForType } from '@/lib/charts/configurator'
import { getChartTypeOptions } from '@/lib/charts/registry'
import { cn } from '@/lib/utils/cn'
import { useConfiguratorStore } from '@/stores/configurator'
import type { SupportedChartType } from '@/types'

interface ChartTypeStepProps {
  labels?: {
    compatible?: string
    disabled_reason?: string
    select_chart_type?: string
    next?: string
  }
}

export function ChartTypeStep(props: ChartTypeStepProps) {
  const labels = {
    compatible: 'Compatible with this dataset',
    disabled_reason: 'Unavailable:',
    select_chart_type: 'Select chart type',
    next: 'Next',
    ...props?.labels,
  }

  const { parsedDataset, config, setChartType, updateConfig } = useConfiguratorStore()

  const chartTypes = getChartTypeOptions()
  const availability = useMemo(() => {
    if (!parsedDataset) return []
    return getChartTypeAvailability(parsedDataset)
  }, [parsedDataset])

  const availabilityMap = useMemo(
    () => Object.fromEntries(availability.map(item => [item.type, item])),
    [availability]
  )

  const handleChartTypeSelect = (type: SupportedChartType) => {
    if (!parsedDataset) return

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

  if (!parsedDataset) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Please select a dataset first before choosing a chart type.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700">
          {labels.select_chart_type}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {chartTypes.map(ct => {
            const availabilityItem = availabilityMap[ct.type]
            const disabled = availabilityItem?.disabled ?? false
            const isSelected = config.type === ct.type

            return (
              <button
                key={ct.type}
                disabled={disabled}
                onClick={() => handleChartTypeSelect(ct.type)}
                type="button"
                className={cn(
                  'rounded-2xl border p-4 text-left transition',
                  isSelected && 'border-gov-primary bg-blue-50 ring-2 ring-gov-primary/20',
                  !isSelected && !disabled && 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                  disabled && 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-60'
                )}
              >
                <div className="mb-2 text-2xl">{ct.icon}</div>
                <div className={cn(
                  'text-sm font-semibold',
                  disabled ? 'text-slate-400' : 'text-slate-900'
                )}>
                  {ct.label}
                </div>
                <div className="mt-2 text-xs leading-relaxed">
                  {disabled ? (
                    <span className="text-slate-400">
                      {labels.disabled_reason} {availabilityItem?.reason ?? ''}
                    </span>
                  ) : (
                    <span className="text-green-600">{labels.compatible}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
