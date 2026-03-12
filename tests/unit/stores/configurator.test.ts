import { act } from '@testing-library/react'
import {
  useConfiguratorStore,
  isConfigReady,
  canProceedFromStep,
  stepOrder,
} from '@/stores/configurator'
import type { ParsedDataset, ChartConfig } from '@/types'

const mockParsedDataset: ParsedDataset = {
  observations: [
    { month: 'Jan', revenue: 100, cost: 50 },
    { month: 'Feb', revenue: 150, cost: 60 },
  ],
  dimensions: [{ key: 'month', label: 'Month', type: 'categorical', values: ['Jan', 'Feb'], cardinality: 2 }],
  measures: [
    { key: 'revenue', label: 'Revenue', min: 100, max: 150, hasNulls: false },
    { key: 'cost', label: 'Cost', min: 50, max: 60, hasNulls: false },
  ],
  metadataColumns: [],
  columns: ['month', 'revenue', 'cost'],
  rowCount: 2,
  source: { format: 'csv' },
}

const mockInitialConfig: Partial<ChartConfig> = {
  type: 'column',
  title: 'Test Chart',
  dataset_id: 'test-dataset-1',
  options: { showLegend: true },
}

describe('configurator store', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useConfiguratorStore.getState().reset()
    })
  })

  describe('initialization', () => {
    it('initializes with provided params', () => {
      act(() => {
        useConfiguratorStore.getState().initialize({
          datasetId: 'dataset-1',
          resourceId: 'resource-1',
          parsedDataset: mockParsedDataset,
          initialConfig: mockInitialConfig,
          initialStep: 'mapping',
          initialChartType: 'bar',
        })
      })

      const state = useConfiguratorStore.getState()
      expect(state.datasetId).toBe('dataset-1')
      expect(state.resourceId).toBe('resource-1')
      expect(state.parsedDataset).toBe(mockParsedDataset)
      expect(state.step).toBe('mapping')
      expect(state.chartType).toBe('bar')
      expect(state.initialized).toBe(true)
    })

    it('does not reinitialize if already initialized with same dataset', () => {
      act(() => {
        useConfiguratorStore.getState().initialize({
          datasetId: 'dataset-1',
          parsedDataset: mockParsedDataset,
          initialConfig: mockInitialConfig,
        })
      })

      const firstState = { ...useConfiguratorStore.getState() }

      // Try to initialize again with same dataset
      act(() => {
        useConfiguratorStore.getState().initialize({
          datasetId: 'dataset-1',
          parsedDataset: mockParsedDataset,
          initialConfig: { type: 'line', title: 'Different' },
        })
      })

      const secondState = useConfiguratorStore.getState()
      // Config should not have changed
      expect(secondState.config.type).toBe(firstState.config.type)
    })

    it('defaults to chartType step if not specified', () => {
      act(() => {
        useConfiguratorStore.getState().initialize({
          datasetId: 'dataset-1',
          parsedDataset: mockParsedDataset,
        })
      })

      expect(useConfiguratorStore.getState().step).toBe('chartType')
    })
  })

  describe('step navigation', () => {
    beforeEach(() => {
      act(() => {
        useConfiguratorStore.getState().initialize({
          datasetId: 'dataset-1',
          parsedDataset: mockParsedDataset,
          initialConfig: mockInitialConfig,
        })
      })
    })

    it('advances to next step', () => {
      expect(useConfiguratorStore.getState().step).toBe('chartType')

      act(() => {
        useConfiguratorStore.getState().nextStep()
      })

      expect(useConfiguratorStore.getState().step).toBe('mapping')

      act(() => {
        useConfiguratorStore.getState().nextStep()
      })

      expect(useConfiguratorStore.getState().step).toBe('customize')
    })

    it('does not advance past review step', () => {
      act(() => {
        useConfiguratorStore.getState().setStep('review')
      })

      expect(useConfiguratorStore.getState().step).toBe('review')

      act(() => {
        useConfiguratorStore.getState().nextStep()
      })

      expect(useConfiguratorStore.getState().step).toBe('review')
    })

    it('goes back to previous step', () => {
      act(() => {
        useConfiguratorStore.getState().setStep('customize')
      })

      expect(useConfiguratorStore.getState().step).toBe('customize')

      act(() => {
        useConfiguratorStore.getState().prevStep()
      })

      expect(useConfiguratorStore.getState().step).toBe('mapping')
    })

    it('goes back to dataset from chartType', () => {
      expect(useConfiguratorStore.getState().step).toBe('chartType')

      act(() => {
        useConfiguratorStore.getState().prevStep()
      })

      expect(useConfiguratorStore.getState().step).toBe('dataset')
    })

    it('sets step directly', () => {
      act(() => {
        useConfiguratorStore.getState().setStep('review')
      })

      expect(useConfiguratorStore.getState().step).toBe('review')
    })
  })

  describe('config management', () => {
    beforeEach(() => {
      act(() => {
        useConfiguratorStore.getState().initialize({
          datasetId: 'dataset-1',
          parsedDataset: mockParsedDataset,
          initialConfig: mockInitialConfig,
        })
      })
    })

    it('updates chart type', () => {
      act(() => {
        useConfiguratorStore.getState().setChartType('line')
      })

      const state = useConfiguratorStore.getState()
      expect(state.chartType).toBe('line')
      expect(state.config.type).toBe('line')
    })

    it('updates config partially', () => {
      act(() => {
        useConfiguratorStore.getState().updateConfig({
          title: 'Updated Title',
          x_axis: { field: 'month' },
        })
      })

      const state = useConfiguratorStore.getState()
      expect(state.config.title).toBe('Updated Title')
      expect(state.config.x_axis?.field).toBe('month')
      // Should preserve existing options
      expect(state.config.options?.showLegend).toBe(true)
    })

    it('merges options deeply', () => {
      act(() => {
        useConfiguratorStore.getState().updateConfig({
          options: { showGrid: false },
        })
      })

      const state = useConfiguratorStore.getState()
      expect(state.config.options?.showGrid).toBe(false)
      expect(state.config.options?.showLegend).toBe(true)
    })

    it('updates chartType when type changes in config', () => {
      act(() => {
        useConfiguratorStore.getState().updateConfig({ type: 'pie' })
      })

      expect(useConfiguratorStore.getState().chartType).toBe('pie')
    })
  })

  describe('reset', () => {
    it('resets to initial state', () => {
      act(() => {
        useConfiguratorStore.getState().initialize({
          datasetId: 'dataset-1',
          parsedDataset: mockParsedDataset,
          initialConfig: mockInitialConfig,
        })
        useConfiguratorStore.getState().setStep('review')
        useConfiguratorStore.getState().updateConfig({ title: 'Changed' })
      })

      expect(useConfiguratorStore.getState().initialized).toBe(true)

      act(() => {
        useConfiguratorStore.getState().reset()
      })

      const state = useConfiguratorStore.getState()
      expect(state.initialized).toBe(false)
      expect(state.datasetId).toBeNull()
      expect(state.step).toBe('dataset')
      expect(state.config).toEqual({})
    })
  })
})

describe('isConfigReady', () => {
  it('returns true for table type', () => {
    expect(isConfigReady({ type: 'table' })).toBe(true)
  })

  it('returns true when both axes are defined', () => {
    expect(
      isConfigReady({
        type: 'column',
        x_axis: { field: 'month' },
        y_axis: { field: 'revenue' },
      })
    ).toBe(true)
  })

  it('returns false when x_axis is missing', () => {
    expect(
      isConfigReady({
        type: 'column',
        y_axis: { field: 'revenue' },
      })
    ).toBe(false)
  })

  it('returns false when y_axis is missing', () => {
    expect(
      isConfigReady({
        type: 'column',
        x_axis: { field: 'month' },
      })
    ).toBe(false)
  })

  it('returns false when axes fields are empty', () => {
    expect(
      isConfigReady({
        type: 'column',
        x_axis: { field: '' },
        y_axis: { field: 'revenue' },
      })
    ).toBe(false)
  })
})

describe('canProceedFromStep', () => {
  it('requires chart type for chartType step', () => {
    expect(canProceedFromStep('chartType', { type: 'column' })).toBe(true)
    expect(canProceedFromStep('chartType', {})).toBe(false)
  })

  it('requires valid mapping for mapping step', () => {
    expect(
      canProceedFromStep('mapping', {
        type: 'column',
        x_axis: { field: 'month' },
        y_axis: { field: 'revenue' },
      })
    ).toBe(true)

    expect(
      canProceedFromStep('mapping', {
        type: 'column',
        x_axis: { field: 'month' },
      })
    ).toBe(false)

    // Table can always proceed
    expect(canProceedFromStep('mapping', { type: 'table' })).toBe(true)
  })

  it('always allows proceeding from customize and review steps', () => {
    expect(canProceedFromStep('customize', {})).toBe(true)
    expect(canProceedFromStep('review', {})).toBe(true)
  })
})

describe('stepOrder', () => {
  it('defines correct step sequence', () => {
    expect(stepOrder).toEqual(['dataset', 'chartType', 'mapping', 'customize', 'review'])
  })
})
