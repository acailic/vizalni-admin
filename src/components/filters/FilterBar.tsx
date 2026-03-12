'use client'

import { CalculationToggle } from '@/components/filters/CalculationToggle'
import { DimensionFilter } from '@/components/filters/DimensionFilter'
import { LegendFilter } from '@/components/filters/LegendFilter'
import { TimeRangeFilter } from '@/components/filters/TimeRangeFilter'
import { TimeSlider } from '@/components/filters/TimeSlider'
import type { FilterableDimension } from '@/lib/charts/interactive-filters'
import type { InteractiveCalculation, InteractiveFilterValue } from '@/types'

interface FilterBarProps {
  dimensions: FilterableDimension[]
  seriesKeys: string[]
  seriesLabels: Record<string, string>
  temporalValues: string[]
  legend: Record<string, boolean>
  timeRange: { from: string | null; to: string | null }
  timeSlider: string | null
  dataFilters: Record<string, InteractiveFilterValue>
  calculation: InteractiveCalculation
  locale?: string
  labels: {
    showAll: string
    hideAll: string
    all: string
    search: string
    noResults: string
    from: string
    to: string
    absolute: string
    percent: string
    resetAll: string
    play: string
    pause: string
  }
  showLegendFilter: boolean
  showTimeFilters: boolean
  showCalculationToggle: boolean
  onSetLegendState: (legend: Record<string, boolean>) => void
  onToggleLegendItem: (key: string) => void
  onSetTimeRange: (from: string | null, to: string | null) => void
  onSetTimeSliderValue: (value: string | null) => void
  onSetDataFilter: (dimensionKey: string, value: InteractiveFilterValue) => void
  onSetCalculation: (value: InteractiveCalculation) => void
  onResetAll: () => void
}

export function FilterBar({
  dimensions,
  seriesKeys,
  seriesLabels,
  temporalValues,
  legend,
  timeRange,
  timeSlider,
  dataFilters,
  calculation,
  locale,
  labels,
  showLegendFilter,
  showTimeFilters,
  showCalculationToggle,
  onSetLegendState,
  onToggleLegendItem,
  onSetTimeRange,
  onSetTimeSliderValue,
  onSetDataFilter,
  onSetCalculation,
  onResetAll,
}: FilterBarProps) {
  const hasControls =
    (showLegendFilter && seriesKeys.length > 0) ||
    (showTimeFilters && temporalValues.length > 1) ||
    dimensions.length > 0 ||
    showCalculationToggle

  if (!hasControls) {
    return null
  }

  return (
    <div className="mb-5 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-start">
        {showLegendFilter && seriesKeys.length > 0 ? (
          <LegendFilter
            hideAllLabel={labels.hideAll}
            labels={seriesLabels}
            legend={legend}
            onSetAll={visible =>
              onSetLegendState(Object.fromEntries(seriesKeys.map(key => [key, visible])))
            }
            onToggle={onToggleLegendItem}
            seriesKeys={seriesKeys}
            showAllLabel={labels.showAll}
          />
        ) : null}

        {showTimeFilters && temporalValues.length > 1 ? (
          <>
            <TimeRangeFilter
              allLabel={labels.all}
              from={timeRange.from}
              fromLabel={labels.from}
              onChange={onSetTimeRange}
              to={timeRange.to}
              toLabel={labels.to}
              values={temporalValues}
            />
            <TimeSlider
              currentValue={timeSlider}
              locale={locale}
              onChange={onSetTimeSliderValue}
              pauseLabel={labels.pause}
              playLabel={labels.play}
              values={temporalValues}
            />
          </>
        ) : null}

        {dimensions.map(dimension => (
          <DimensionFilter
            allLabel={labels.all}
            dimension={dimension}
            key={dimension.key}
            noResultsLabel={labels.noResults}
            onChange={value => onSetDataFilter(dimension.key, value)}
            searchLabel={labels.search}
            value={dataFilters[dimension.key] ?? null}
          />
        ))}

        {showCalculationToggle ? (
          <CalculationToggle
            absoluteLabel={labels.absolute}
            onChange={onSetCalculation}
            percentLabel={labels.percent}
            value={calculation}
          />
        ) : null}
      </div>
      <div className="flex justify-end">
        <button
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={onResetAll}
          type="button"
        >
          {labels.resetAll}
        </button>
      </div>
    </div>
  )
}
