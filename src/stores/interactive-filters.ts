'use client'

import { useEffect, useMemo } from 'react'

import { create } from 'zustand'

import type {
  InteractiveCalculation,
  InteractiveFilterDefaults,
  InteractiveFiltersState,
  InteractiveFiltersStoreState,
  InteractiveFilterValue,
} from '@/types'

function normalizeLegendState(
  current: Record<string, boolean> | undefined,
  defaults: Record<string, boolean>
) {
  return Object.fromEntries(
    Object.keys(defaults).map(key => [key, current?.[key] ?? defaults[key] ?? true])
  )
}

function normalizeDataFilters(
  current: Record<string, InteractiveFilterValue> | undefined,
  defaults: Record<string, InteractiveFilterValue>
) {
  return Object.fromEntries(
    Object.keys(defaults).map(key => [key, current?.[key] ?? defaults[key] ?? null])
  )
}

function mergeWithDefaults(
  current: InteractiveFiltersState | undefined,
  defaults: InteractiveFiltersState
): InteractiveFiltersState {
  return {
    ...defaults,
    ...current,
    legend: normalizeLegendState(current?.legend, defaults.legend),
    dataFilters: normalizeDataFilters(current?.dataFilters, defaults.dataFilters),
    timeRange: current?.timeRange ?? defaults.timeRange,
    timeSlider: current?.timeSlider ?? defaults.timeSlider,
    calculation: current?.calculation ?? defaults.calculation,
  }
}

export const useInteractiveFiltersStore = create<InteractiveFiltersStoreState>((set, _get) => ({
  charts: {},
  defaults: {},
  initializeChart: ({ chartId, ...defaults }) =>
    set(state => ({
      charts: {
        ...state.charts,
        [chartId]: mergeWithDefaults(state.charts[chartId], defaults),
      },
      defaults: {
        ...state.defaults,
        [chartId]: defaults,
      },
    })),
  clearChart: chartId =>
    set(state => {
      const charts = { ...state.charts }
      const defaults = { ...state.defaults }
      delete charts[chartId]
      delete defaults[chartId]

      return {
        charts,
        defaults,
      }
    }),
  setLegendState: (chartId, legend) =>
    set(state => {
      const base = (state.charts[chartId] ?? state.defaults[chartId]) as InteractiveFiltersState | undefined
      return {
        charts: {
          ...state.charts,
          [chartId]: {
            ...(base ?? {}),
            legend,
          } as InteractiveFiltersState,
        },
      }
    }),
  toggleLegendItem: (chartId, key) =>
    set(state => {
      const base = (state.charts[chartId] ?? state.defaults[chartId]) as InteractiveFiltersState | undefined
      const legendBase = (state.charts[chartId]?.legend ?? state.defaults[chartId]?.legend) as Record<string, boolean> | undefined
      return {
        charts: {
          ...state.charts,
          [chartId]: {
            ...(base ?? {}),
            legend: {
              ...(legendBase ?? {}),
              [key]:
                !(state.charts[chartId]?.legend?.[key] ??
                  state.defaults[chartId]?.legend?.[key] ??
                  true),
            },
          } as InteractiveFiltersState,
        },
      }
    }),
  setTimeRange: (chartId, from, to) =>
    set(state => {
      const base = (state.charts[chartId] ?? state.defaults[chartId]) as InteractiveFiltersState | undefined
      return {
        charts: {
          ...state.charts,
          [chartId]: {
            ...(base ?? {}),
            timeRange: { from, to },
          } as InteractiveFiltersState,
        },
      }
    }),
  setTimeSliderValue: (chartId, value) =>
    set(state => {
      const base = (state.charts[chartId] ?? state.defaults[chartId]) as InteractiveFiltersState | undefined
      return {
        charts: {
          ...state.charts,
          [chartId]: {
            ...(base ?? {}),
            timeSlider: value,
          } as InteractiveFiltersState,
        },
      }
    }),
  setDataFilter: (chartId, dimensionKey, value) =>
    set(state => {
      const base = (state.charts[chartId] ?? state.defaults[chartId]) as InteractiveFiltersState | undefined
      const filtersBase = (state.charts[chartId]?.dataFilters ?? state.defaults[chartId]?.dataFilters) as Record<string, InteractiveFilterValue> | undefined
      return {
        charts: {
          ...state.charts,
          [chartId]: {
            ...(base ?? {}),
            dataFilters: {
              ...(filtersBase ?? {}),
              [dimensionKey]: value,
            },
          } as InteractiveFiltersState,
        },
      }
    }),
  setCalculation: (chartId, calculation) =>
    set(state => {
      const base = (state.charts[chartId] ?? state.defaults[chartId]) as InteractiveFiltersState | undefined
      return {
        charts: {
          ...state.charts,
          [chartId]: {
            ...(base ?? {}),
            calculation,
          } as InteractiveFiltersState,
        },
      }
    }),
  resetAll: chartId =>
    set(state => ({
      charts: {
        ...state.charts,
        [chartId]: (state.defaults[chartId] ?? state.charts[chartId]) as InteractiveFiltersState,
      },
    })),
}))

interface UseChartInteractiveFiltersOptions {
  chartId: string
  defaults: Omit<InteractiveFilterDefaults, 'chartId'>
}

export function useChartInteractiveFilters({ chartId, defaults }: UseChartInteractiveFiltersOptions) {
  const initializeChart = useInteractiveFiltersStore(state => state.initializeChart)
  const clearChart = useInteractiveFiltersStore(state => state.clearChart)
  const resetAllAction = useInteractiveFiltersStore(state => state.resetAll)
  const setLegendStateAction = useInteractiveFiltersStore(state => state.setLegendState)
  const toggleLegendItemAction = useInteractiveFiltersStore(state => state.toggleLegendItem)
  const setTimeRangeAction = useInteractiveFiltersStore(state => state.setTimeRange)
  const setTimeSliderValueAction = useInteractiveFiltersStore(state => state.setTimeSliderValue)
  const setDataFilterAction = useInteractiveFiltersStore(state => state.setDataFilter)
  const setCalculationAction = useInteractiveFiltersStore(state => state.setCalculation)
  // Memoize the actual defaults object by its serialized form to avoid effect re-runs
  const memoizedDefaults = useMemo(
    () => defaults,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(defaults)]
  )
  const chartState = useInteractiveFiltersStore(state => state.charts[chartId] ?? memoizedDefaults)

  useEffect(() => {
    initializeChart({
      chartId,
      ...memoizedDefaults,
    })

    return () => {
      clearChart(chartId)
    }
  }, [chartId, clearChart, initializeChart, memoizedDefaults])

  return {
    ...chartState,
    setLegendState: (legend: Record<string, boolean>) => setLegendStateAction(chartId, legend),
    toggleLegendItem: (key: string) => toggleLegendItemAction(chartId, key),
    setTimeRange: (from: string | null, to: string | null) => setTimeRangeAction(chartId, from, to),
    setTimeSliderValue: (value: string | null) => setTimeSliderValueAction(chartId, value),
    setDataFilter: (dimensionKey: string, value: InteractiveFilterValue) =>
      setDataFilterAction(chartId, dimensionKey, value),
    setCalculation: (calculation: InteractiveCalculation) => setCalculationAction(chartId, calculation),
    resetAll: () => resetAllAction(chartId),
  }
}
