'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  DashboardConfig,
  LayoutItem,
  ChartConfig,
  SharedFilterConfig,
} from '@/types'
import {
  createEmptyDashboard,
  createDashboardFromTemplate,
  DASHBOARD_TEMPLATES,
} from '@/types/dashboard'

export interface DashboardStoreState {
  dashboard: DashboardConfig | null
  editMode: boolean
  selectedChartId: string | null
  isDirty: boolean
}

export interface DashboardStoreActions {
  // Dashboard lifecycle
  createNew: (title?: string) => void
  createFromTemplate: (templateId: string, title?: string) => void
  loadDashboard: (config: DashboardConfig) => void
  saveDashboard: () => DashboardConfig | null
  reset: () => void

  // Dashboard metadata
  setTitle: (title: string) => void
  setDescription: (description: string) => void

  // Edit mode
  setEditMode: (enabled: boolean) => void
  toggleEditMode: () => void

  // Chart management
  addChart: (chartId: string, config: ChartConfig, layout?: Partial<LayoutItem>) => void
  updateChart: (chartId: string, config: Partial<ChartConfig>) => void
  removeChart: (chartId: string) => void
  selectChart: (chartId: string | null) => void

  // Layout management
  updateLayout: (layout: LayoutItem[]) => void
  updateChartLayout: (chartId: string, layout: Partial<LayoutItem>) => void

  // Shared filters
  setSharedFilters: (config: Partial<SharedFilterConfig>) => void
  toggleSharedFilters: () => void
  addSyncDimension: (dimension: string) => void
  removeSyncDimension: (dimension: string) => void

  // Serialization
  exportToJson: () => string | null
  importFromJson: (json: string) => boolean
}

const MAX_CHARTS = 6

const getInitialState = (): DashboardStoreState => ({
  dashboard: null,
  editMode: false,
  selectedChartId: null,
  isDirty: false,
})

export const useDashboardStore = create<DashboardStoreState & DashboardStoreActions>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // Dashboard lifecycle
      createNew: title =>
        set({
          dashboard: createEmptyDashboard(title),
          editMode: true,
          selectedChartId: null,
          isDirty: false,
        }),

      createFromTemplate: (templateId, title) => {
        const template = DASHBOARD_TEMPLATES.find(t => t.id === templateId)
        if (!template) {
          set({ dashboard: createEmptyDashboard(title) })
          return
        }
        set({
          dashboard: createDashboardFromTemplate(template, title),
          editMode: true,
          selectedChartId: null,
          isDirty: false,
        })
      },

      loadDashboard: config =>
        set({
          dashboard: config,
          editMode: false,
          selectedChartId: null,
          isDirty: false,
        }),

      saveDashboard: () => {
        const { dashboard } = get()
        if (!dashboard) return null
        const saved = {
          ...dashboard,
          updatedAt: new Date().toISOString(),
        }
        set({ dashboard: saved, isDirty: false })
        return saved
      },

      reset: () => set(getInitialState()),

      // Dashboard metadata
      setTitle: title =>
        set(state => ({
          dashboard: state.dashboard ? { ...state.dashboard, title } : null,
          isDirty: true,
        })),

      setDescription: description =>
        set(state => ({
          dashboard: state.dashboard ? { ...state.dashboard, description } : null,
          isDirty: true,
        })),

      // Edit mode
      setEditMode: enabled => set({ editMode: enabled }),

      toggleEditMode: () => set(state => ({ editMode: !state.editMode })),

      // Chart management
      addChart: (chartId, config, layout) =>
        set(state => {
          if (!state.dashboard) return {}
          if (Object.keys(state.dashboard.charts).length >= MAX_CHARTS) {
            console.warn('Maximum charts reached')
            return {}
          }

          const newLayoutItem: LayoutItem = {
            chartId,
            x: layout?.x ?? (state.dashboard.layout.length % 2) * 6,
            y: layout?.y ?? Math.floor(state.dashboard.layout.length / 2) * 2,
            w: layout?.w ?? 6,
            h: layout?.h ?? 2,
            minW: layout?.minW ?? 4,
            minH: layout?.minH ?? 2,
          }

          return {
            dashboard: {
              ...state.dashboard,
              charts: { ...state.dashboard.charts, [chartId]: config },
              layout: [...state.dashboard.layout, newLayoutItem],
            },
            selectedChartId: chartId,
            isDirty: true,
          }
        }),

      updateChart: (chartId, config) =>
        set(state => {
          if (!state.dashboard || !state.dashboard.charts[chartId]) return {}
          return {
            dashboard: {
              ...state.dashboard,
              charts: {
                ...state.dashboard.charts,
                [chartId]: { ...state.dashboard.charts[chartId], ...config },
              },
            },
            isDirty: true,
          }
        }),

      removeChart: chartId =>
        set(state => {
          if (!state.dashboard) return {}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [chartId]: _removed, ...remainingCharts } = state.dashboard.charts
          return {
            dashboard: {
              ...state.dashboard,
              charts: remainingCharts,
              layout: state.dashboard.layout.filter(item => item.chartId !== chartId),
            },
            selectedChartId: state.selectedChartId === chartId ? null : state.selectedChartId,
            isDirty: true,
          }
        }),

      selectChart: chartId => set({ selectedChartId: chartId }),

      // Layout management
      updateLayout: layout =>
        set(state => ({
          dashboard: state.dashboard ? { ...state.dashboard, layout } : null,
          isDirty: true,
        })),

      updateChartLayout: (chartId, layoutUpdate) =>
        set(state => {
          if (!state.dashboard) return {}
          return {
            dashboard: {
              ...state.dashboard,
              layout: state.dashboard.layout.map(item =>
                item.chartId === chartId ? { ...item, ...layoutUpdate } : item
              ),
            },
            isDirty: true,
          }
        }),

      // Shared filters
      setSharedFilters: config =>
        set(state => {
          if (!state.dashboard) return {}
          return {
            dashboard: {
              ...state.dashboard,
              sharedFilters: { ...state.dashboard.sharedFilters, ...config },
            },
            isDirty: true,
          }
        }),

      toggleSharedFilters: () =>
        set(state => {
          if (!state.dashboard) return {}
          return {
            dashboard: {
              ...state.dashboard,
              sharedFilters: {
                ...state.dashboard.sharedFilters,
                enabled: !state.dashboard.sharedFilters.enabled,
              },
            },
            isDirty: true,
          }
        }),

      addSyncDimension: dimension =>
        set(state => {
          if (!state.dashboard) return {}
          if (state.dashboard.sharedFilters.syncDimensions.includes(dimension)) return {}
          return {
            dashboard: {
              ...state.dashboard,
              sharedFilters: {
                ...state.dashboard.sharedFilters,
                syncDimensions: [...state.dashboard.sharedFilters.syncDimensions, dimension],
              },
            },
            isDirty: true,
          }
        }),

      removeSyncDimension: dimension =>
        set(state => {
          if (!state.dashboard) return {}
          return {
            dashboard: {
              ...state.dashboard,
              sharedFilters: {
                ...state.dashboard.sharedFilters,
                syncDimensions: state.dashboard.sharedFilters.syncDimensions.filter(
                  d => d !== dimension
                ),
              },
            },
            isDirty: true,
          }
        }),

      // Serialization
      exportToJson: () => {
        const { dashboard } = get()
        if (!dashboard) return null
        return JSON.stringify(dashboard, null, 2)
      },

      importFromJson: json => {
        try {
          const config = JSON.parse(json) as DashboardConfig
          if (!config.id || !config.layout || !config.charts) {
            return false
          }
          set({ dashboard: config, isDirty: true })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'vizuelni-dashboard',
      partialize: state => ({
        dashboard: state.dashboard,
      }),
    }
  )
)

// Selectors
export const selectChartCount = (state: DashboardStoreState): number =>
  state.dashboard ? Object.keys(state.dashboard.charts).length : 0

export const selectCanAddChart = (state: DashboardStoreState): boolean =>
  selectChartCount(state) < MAX_CHARTS

export const selectSelectedChart = (state: DashboardStoreState): ChartConfig | null =>
  state.dashboard && state.selectedChartId
    ? state.dashboard.charts[state.selectedChartId] ?? null
    : null
