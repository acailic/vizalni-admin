'use client'

import { create } from 'zustand'

import type { ChartConfig, ConfiguratorStep, ParsedDataset, SupportedChartType, DatasetReference, JoinSuggestion } from '@/types'
import type { PreviewBreakpoint } from '@/components/configurator/PreviewBreakpointToggle'

export interface ConfiguratorStoreState {
  step: ConfiguratorStep
  datasetId: string | null
  resourceId: string | null
  datasetTitle: string | null
  organizationName: string | null
  parsedDataset: ParsedDataset | null
  chartType: SupportedChartType | null
  config: Partial<ChartConfig>
  initialized: boolean
  // Multi-dataset state
  datasets: DatasetReference[]
  secondaryDatasets: Map<string, ParsedDataset>
  joinSuggestions: Map<string, JoinSuggestion[]>
  activeJoinConfig: Map<string, { primaryKey: string; secondaryKey: string }>
  // Persistence state
  savedChartId: string | null
  isDirty: boolean
  lastSavedAt: Date | null
  // Preview breakpoint state
  previewBreakpoint: PreviewBreakpoint
}

export interface ConfiguratorStoreActions {
  initialize: (params: {
    datasetId?: string
    resourceId?: string
    datasetTitle?: string
    organizationName?: string
    parsedDataset?: ParsedDataset
    initialConfig?: Partial<ChartConfig>
    initialStep?: ConfiguratorStep
    initialChartType?: SupportedChartType | null
  }) => void
  setStep: (step: ConfiguratorStep) => void
  setChartType: (type: SupportedChartType) => void
  updateConfig: (partial: Partial<ChartConfig>) => void
  setDatasetId: (id: string) => void
  setResourceId: (id: string) => void
  setDatasetTitle: (title: string) => void
  setOrganizationName: (name: string) => void
  setParsedDataset: (dataset: ParsedDataset) => void
  setDataset: (params: {
    datasetId: string
    resourceId: string
    datasetTitle: string
    organizationName?: string
    parsedDataset: ParsedDataset
  }) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  // Multi-dataset actions
  addDataset: (ref: DatasetReference, dataset: ParsedDataset) => void
  removeDataset: (datasetId: string) => void
  setJoinConfig: (datasetId: string, primaryKey: string, secondaryKey: string) => void
  getJoinedDataset: () => ParsedDataset | null
  // Persistence actions
  setSavedChartId: (id: string | null) => void
  setIsDirty: (dirty: boolean) => void
  setLastSavedAt: (date: Date | null) => void
  // Preview breakpoint actions
  setPreviewBreakpoint: (breakpoint: PreviewBreakpoint) => void
}

const stepOrder: ConfiguratorStep[] = [
  'dataset',
  'chartType',
  'mapping',
  'customize',
  'review',
]

const getInitialState = (): ConfiguratorStoreState => ({
  step: 'dataset',
  datasetId: null,
  resourceId: null,
  datasetTitle: null,
  organizationName: null,
  parsedDataset: null,
  chartType: null,
  config: {},
  initialized: false,
  // Multi-dataset state
  datasets: [],
  secondaryDatasets: new Map(),
  joinSuggestions: new Map(),
  activeJoinConfig: new Map(),
  // Persistence state
  savedChartId: null,
  isDirty: false,
  lastSavedAt: null,
  // Preview breakpoint state
  previewBreakpoint: null,
})

export const useConfiguratorStore = create<ConfiguratorStoreState & ConfiguratorStoreActions>(
  (set, get) => ({
    ...getInitialState(),

    initialize: params =>
      set(state => {
        // Always update if parsedDataset is provided (async data load)
        const shouldSkip = state.initialized &&
          state.datasetId === params.datasetId &&
          !params.parsedDataset // Don't skip if we have new data

        if (shouldSkip) {
          return {}
        }

        return {
          datasetId: params.datasetId ?? state.datasetId ?? null,
          resourceId: params.resourceId ?? state.resourceId ?? null,
          datasetTitle: params.datasetTitle ?? state.datasetTitle ?? null,
          organizationName: params.organizationName ?? state.organizationName ?? null,
          parsedDataset: params.parsedDataset ?? state.parsedDataset ?? null,
          chartType: params.initialChartType ?? state.chartType ?? null,
          config: params.initialConfig ?? state.config ?? {},
          step: params.initialStep ?? state.step ?? 'chartType',
          initialized: true,
        }
      }),

    setStep: step => set({ step }),

    setChartType: type => {
      const { config } = get()
      set({
        chartType: type,
        config: {
          ...config,
          type,
        },
      })
    },

    updateConfig: partial =>
      set(state => ({
        config: {
          ...state.config,
          ...partial,
          options: {
            ...state.config.options,
            ...partial.options,
          },
        },
        chartType: partial.type ?? state.chartType,
        isDirty: true, // Mark as dirty when config changes
      })),

    setDatasetId: id => set({ datasetId: id }),

    setResourceId: id => set({ resourceId: id }),

    setDatasetTitle: title => set({ datasetTitle: title }),

    setOrganizationName: name => set({ organizationName: name }),

    setParsedDataset: dataset => set({ parsedDataset: dataset }),

    setDataset: params =>
      set({
        datasetId: params.datasetId,
        resourceId: params.resourceId,
        datasetTitle: params.datasetTitle,
        organizationName: params.organizationName ?? null,
        parsedDataset: params.parsedDataset,
        step: 'chartType', // Move to chart type selection after dataset is set
      }),

    nextStep: () => {
      const { step } = get()
      const normalizedStep = step === 'dataset' ? 'chartType' : step
      const currentIndex = stepOrder.indexOf(normalizedStep)
      if (currentIndex < stepOrder.length - 1) {
        set({ step: stepOrder[currentIndex + 1] })
      }
    },

    prevStep: () => {
      const { step } = get()
      const normalizedStep = step === 'dataset' ? 'chartType' : step
      const currentIndex = stepOrder.indexOf(normalizedStep)
      if (currentIndex > 0) {
        set({ step: stepOrder[currentIndex - 1] })
      }
    },

    reset: () => set(getInitialState()),

    // Multi-dataset actions
    addDataset: (ref, dataset) =>
      set(state => {
        if (state.datasets.length >= 3) {
          return {} // Max 3 datasets
        }
        const newDatasets = [...state.datasets, ref]
        const newSecondaryDatasets = new Map(state.secondaryDatasets)
        newSecondaryDatasets.set(ref.datasetId, dataset)
        return {
          datasets: newDatasets,
          secondaryDatasets: newSecondaryDatasets,
        }
      }),

    removeDataset: datasetId =>
      set(state => {
        const newDatasets = state.datasets.filter(d => d.datasetId !== datasetId)
        const newSecondaryDatasets = new Map(state.secondaryDatasets)
        newSecondaryDatasets.delete(datasetId)
        const newJoinSuggestions = new Map(state.joinSuggestions)
        newJoinSuggestions.delete(datasetId)
        const newActiveJoinConfig = new Map(state.activeJoinConfig)
        newActiveJoinConfig.delete(datasetId)
        return {
          datasets: newDatasets,
          secondaryDatasets: newSecondaryDatasets,
          joinSuggestions: newJoinSuggestions,
          activeJoinConfig: newActiveJoinConfig,
        }
      }),

    setJoinConfig: (datasetId, primaryKey, secondaryKey) =>
      set(state => {
        const newActiveJoinConfig = new Map(state.activeJoinConfig)
        newActiveJoinConfig.set(datasetId, { primaryKey, secondaryKey })
        return { activeJoinConfig: newActiveJoinConfig }
      }),

    getJoinedDataset: () => {
      const state = get()
      if (!state.parsedDataset || state.datasets.length === 0) {
        return state.parsedDataset
      }

      // Import join function dynamically to avoid circular deps
      // For now, return the primary dataset (actual join happens in component)
      return state.parsedDataset
    },

    // Persistence actions
    setSavedChartId: id => set({ savedChartId: id }),
    setIsDirty: dirty => set({ isDirty: dirty }),
    setLastSavedAt: date => set({ lastSavedAt: date }),

    // Preview breakpoint actions
    setPreviewBreakpoint: breakpoint => set({ previewBreakpoint: breakpoint }),
  })
)

export function isConfigReady(config: Partial<ChartConfig>): boolean {
  if (config.type === 'table') {
    return true
  }

  return !!config.x_axis?.field && !!config.y_axis?.field
}

export function canProceedFromStep(
  step: ConfiguratorStep,
  config: Partial<ChartConfig>,
  parsedDataset: ParsedDataset | null = null
): boolean {
  switch (step) {
    case 'dataset':
      return parsedDataset !== null
    case 'chartType':
      return !!config.type
    case 'mapping':
      return isConfigReady(config)
    case 'customize':
    case 'review':
      return true
    default:
      return false
  }
}

export { stepOrder }
