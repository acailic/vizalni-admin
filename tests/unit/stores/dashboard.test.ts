import { act } from '@testing-library/react'
import { useDashboardStore, selectChartCount, selectCanAddChart } from '@/stores/dashboard'

// Mock the Zustand persist middleware
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}))

// Helper to create a valid ChartConfig
function createTestChart(id: string, title: string = `Chart ${id}`) {
  return {
    id,
    type: 'column' as const,
    title,
    x_axis: { field: 'category' },
    y_axis: { field: 'value' },
  }
}

describe('Dashboard Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { reset } = useDashboardStore.getState()
    act(() => {
      reset()
    })
  })

  describe('Dashboard lifecycle', () => {
    it('should create a new dashboard', () => {
      const { createNew } = useDashboardStore.getState()

      act(() => {
        createNew('Test Dashboard')
      })

      const { dashboard, editMode } = useDashboardStore.getState()
      expect(dashboard).not.toBeNull()
      expect(dashboard?.title).toBe('Test Dashboard')
      expect(dashboard?.layout).toEqual([])
      expect(dashboard?.charts).toEqual({})
      expect(editMode).toBe(true)
    })

    it('should create a dashboard from template', () => {
      const { createFromTemplate } = useDashboardStore.getState()

      act(() => {
        createFromTemplate('single', 'Single Chart Dashboard')
      })

      const { dashboard } = useDashboardStore.getState()
      expect(dashboard).not.toBeNull()
      expect(dashboard?.title).toBe('Single Chart Dashboard')
      expect(dashboard?.layout).toHaveLength(1)
      expect(dashboard?.layout[0].w).toBe(12)
      expect(dashboard?.layout[0].h).toBe(4)
    })

    it('should create a 2x2 grid from template', () => {
      const { createFromTemplate } = useDashboardStore.getState()

      act(() => {
        createFromTemplate('2x2-grid', 'Grid Dashboard')
      })

      const { dashboard } = useDashboardStore.getState()
      expect(dashboard).not.toBeNull()
      expect(dashboard?.layout).toHaveLength(4)
    })

    it('should load an existing dashboard', () => {
      const { loadDashboard } = useDashboardStore.getState()
      const existingDashboard = {
        id: 'test-id',
        title: 'Existing Dashboard',
        layout: [{ chartId: 'chart-1', x: 0, y: 0, w: 6, h: 2 }],
        charts: {},
        sharedFilters: { enabled: false, syncDimensions: [], syncTimeRange: false },
      }

      act(() => {
        loadDashboard(existingDashboard)
      })

      const { dashboard, editMode, isDirty } = useDashboardStore.getState()
      expect(dashboard?.id).toBe('test-id')
      expect(dashboard?.title).toBe('Existing Dashboard')
      expect(editMode).toBe(false)
      expect(isDirty).toBe(false)
    })

    it('should reset the store', () => {
      const { createNew, reset } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      expect(useDashboardStore.getState().dashboard).not.toBeNull()

      act(() => {
        reset()
      })

      expect(useDashboardStore.getState().dashboard).toBeNull()
    })
  })

  describe('Dashboard metadata', () => {
    it('should update dashboard title', () => {
      const { createNew, setTitle } = useDashboardStore.getState()

      act(() => {
        createNew('Original Title')
      })

      act(() => {
        setTitle('New Title')
      })

      expect(useDashboardStore.getState().dashboard?.title).toBe('New Title')
      expect(useDashboardStore.getState().isDirty).toBe(true)
    })

    it('should update dashboard description', () => {
      const { createNew, setDescription } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        setDescription('A test description')
      })

      expect(useDashboardStore.getState().dashboard?.description).toBe('A test description')
      expect(useDashboardStore.getState().isDirty).toBe(true)
    })
  })

  describe('Edit mode', () => {
    it('should toggle edit mode', () => {
      const { createNew, toggleEditMode } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      expect(useDashboardStore.getState().editMode).toBe(true)

      act(() => {
        toggleEditMode()
      })

      expect(useDashboardStore.getState().editMode).toBe(false)

      act(() => {
        toggleEditMode()
      })

      expect(useDashboardStore.getState().editMode).toBe(true)
    })

    it('should set edit mode explicitly', () => {
      const { createNew, setEditMode } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        setEditMode(false)
      })

      expect(useDashboardStore.getState().editMode).toBe(false)

      act(() => {
        setEditMode(true)
      })

      expect(useDashboardStore.getState().editMode).toBe(true)
    })
  })

  describe('Chart management', () => {
    it('should add a chart', () => {
      const { createNew, addChart } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        addChart('chart-1', createTestChart('chart-1', 'Test Chart'))
      })

      const { dashboard, selectedChartId } = useDashboardStore.getState()
      expect(dashboard?.charts['chart-1']).toBeDefined()
      expect(dashboard?.charts['chart-1'].title).toBe('Test Chart')
      expect(dashboard?.layout).toHaveLength(1)
      expect(selectedChartId).toBe('chart-1')
    })

    it('should enforce maximum charts limit (6)', () => {
      const { createNew, addChart } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      // Add 6 charts
      for (let i = 1; i <= 6; i++) {
        act(() => {
          addChart(`chart-${i}`, createTestChart(`chart-${i}`, `Chart ${i}`))
        })
      }

      expect(useDashboardStore.getState().dashboard?.layout).toHaveLength(6)

      // Try to add a 7th chart - should be ignored
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      act(() => {
        addChart('chart-7', createTestChart('chart-7', 'Chart 7'))
      })

      expect(useDashboardStore.getState().dashboard?.layout).toHaveLength(6)
      expect(consoleWarnSpy).toHaveBeenCalledWith('Maximum charts reached')

      consoleWarnSpy.mockRestore()
    })

    it('should update a chart', () => {
      const { createNew, addChart, updateChart } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        addChart('chart-1', createTestChart('chart-1', 'Original Title'))
      })

      act(() => {
        updateChart('chart-1', { title: 'Updated Title' })
      })

      expect(useDashboardStore.getState().dashboard?.charts['chart-1'].title).toBe('Updated Title')
      expect(useDashboardStore.getState().isDirty).toBe(true)
    })

    it('should remove a chart', () => {
      const { createNew, addChart, removeChart } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        addChart('chart-1', createTestChart('chart-1'))
      })

      expect(useDashboardStore.getState().dashboard?.layout).toHaveLength(1)

      act(() => {
        removeChart('chart-1')
      })

      const { dashboard, selectedChartId } = useDashboardStore.getState()
      expect(dashboard?.charts['chart-1']).toBeUndefined()
      expect(dashboard?.layout).toHaveLength(0)
      expect(selectedChartId).toBeNull()
    })

    it('should select a chart', () => {
      const { createNew, addChart, selectChart } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        addChart('chart-1', createTestChart('chart-1'))
      })

      act(() => {
        selectChart('chart-1')
      })

      expect(useDashboardStore.getState().selectedChartId).toBe('chart-1')

      act(() => {
        selectChart(null)
      })

      expect(useDashboardStore.getState().selectedChartId).toBeNull()
    })
  })

  describe('Layout management', () => {
    it('should update layout', () => {
      const { createNew, updateLayout } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      const newLayout = [
        { chartId: 'chart-1', x: 0, y: 0, w: 6, h: 2 },
        { chartId: 'chart-2', x: 6, y: 0, w: 6, h: 2 },
      ]

      act(() => {
        updateLayout(newLayout)
      })

      expect(useDashboardStore.getState().dashboard?.layout).toEqual(newLayout)
      expect(useDashboardStore.getState().isDirty).toBe(true)
    })

    it('should update a specific chart layout', () => {
      const { createNew, addChart, updateChartLayout } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        addChart('chart-1', createTestChart('chart-1'))
      })

      act(() => {
        updateChartLayout('chart-1', { w: 8, h: 3 })
      })

      const layout = useDashboardStore.getState().dashboard?.layout[0]
      expect(layout?.w).toBe(8)
      expect(layout?.h).toBe(3)
    })
  })

  describe('Shared filters', () => {
    it('should toggle shared filters', () => {
      const { createNew, toggleSharedFilters } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.enabled).toBe(false)

      act(() => {
        toggleSharedFilters()
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.enabled).toBe(true)

      act(() => {
        toggleSharedFilters()
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.enabled).toBe(false)
    })

    it('should set shared filters config', () => {
      const { createNew, setSharedFilters } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        setSharedFilters({ syncTimeRange: true })
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.syncTimeRange).toBe(true)

      act(() => {
        setSharedFilters({ enabled: true })
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.enabled).toBe(true)
    })

    it('should add and remove sync dimensions', () => {
      const { createNew, addSyncDimension, removeSyncDimension } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        addSyncDimension('region')
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.syncDimensions).toContain(
        'region'
      )

      act(() => {
        addSyncDimension('year')
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.syncDimensions).toHaveLength(2)

      act(() => {
        removeSyncDimension('region')
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.syncDimensions).not.toContain(
        'region'
      )
      expect(useDashboardStore.getState().dashboard?.sharedFilters.syncDimensions).toContain(
        'year'
      )
    })

    it('should not add duplicate sync dimensions', () => {
      const { createNew, addSyncDimension } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      act(() => {
        addSyncDimension('region')
      })

      act(() => {
        addSyncDimension('region')
      })

      expect(useDashboardStore.getState().dashboard?.sharedFilters.syncDimensions).toHaveLength(1)
    })
  })

  describe('Serialization', () => {
    it('should export dashboard to JSON', () => {
      const { createNew, addChart, exportToJson } = useDashboardStore.getState()

      act(() => {
        createNew('Test Dashboard')
      })

      act(() => {
        addChart('chart-1', createTestChart('chart-1', 'Test'))
      })

      const json = exportToJson()
      expect(json).not.toBeNull()

      const parsed = JSON.parse(json!)
      expect(parsed.title).toBe('Test Dashboard')
      expect(parsed.charts['chart-1']).toBeDefined()
    })

    it('should import dashboard from JSON', () => {
      const { importFromJson } = useDashboardStore.getState()

      const dashboardJson = JSON.stringify({
        id: 'imported-id',
        title: 'Imported Dashboard',
        layout: [{ chartId: 'chart-1', x: 0, y: 0, w: 6, h: 2 }],
        charts: {
          'chart-1': {
            id: 'chart-1',
            type: 'column',
            title: 'Test',
            x_axis: { field: 'category' },
            y_axis: { field: 'value' },
          },
        },
        sharedFilters: { enabled: false, syncDimensions: [], syncTimeRange: false },
      })

      let result: boolean = false
      act(() => {
        result = importFromJson(dashboardJson)
      })

      expect(result).toBe(true)
      expect(useDashboardStore.getState().dashboard?.id).toBe('imported-id')
      expect(useDashboardStore.getState().dashboard?.title).toBe('Imported Dashboard')
    })

    it('should reject invalid JSON', () => {
      const { importFromJson } = useDashboardStore.getState()

      let result: boolean = true
      act(() => {
        result = importFromJson('invalid json')
      })

      expect(result).toBe(false)
      expect(useDashboardStore.getState().dashboard).toBeNull()
    })

    it('should reject JSON with missing required fields', () => {
      const { importFromJson } = useDashboardStore.getState()

      const invalidDashboard = JSON.stringify({
        id: 'test',
        // Missing layout and charts
      })

      let result: boolean = true
      act(() => {
        result = importFromJson(invalidDashboard)
      })

      expect(result).toBe(false)
    })
  })

  describe('Selectors', () => {
    it('should select chart count', () => {
      const { createNew, addChart } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      expect(selectChartCount(useDashboardStore.getState())).toBe(0)

      act(() => {
        addChart('chart-1', createTestChart('chart-1'))
      })

      expect(selectChartCount(useDashboardStore.getState())).toBe(1)
    })

    it('should select canAddChart', () => {
      const { createNew, addChart } = useDashboardStore.getState()

      act(() => {
        createNew('Test')
      })

      expect(selectCanAddChart(useDashboardStore.getState())).toBe(true)

      // Add 6 charts
      for (let i = 1; i <= 6; i++) {
        act(() => {
          addChart(`chart-${i}`, createTestChart(`chart-${i}`, `Chart ${i}`))
        })
      }

      expect(selectCanAddChart(useDashboardStore.getState())).toBe(false)
    })
  })
})
