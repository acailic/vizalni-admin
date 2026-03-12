'use client'

import { useCallback, useMemo, useState, useEffect, useRef } from 'react'

import GridLayout, { Layout } from 'react-grid-layout'

// Type cast for react-grid-layout which has incomplete type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Grid = GridLayout as any

import { useDashboardStore } from '@/stores/dashboard'
import type { LayoutItem, DashboardConfig, Observation } from '@/types'

import { DashboardChartCard } from './DashboardChartCard'
import { DashboardChartRenderer } from './DashboardChartRenderer'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

interface DashboardGridProps {
  dashboard: DashboardConfig
  editMode: boolean
  locale?: string
  labels: {
    empty: string
    addFirstChart: string
    loadingChart: string
    errorLoading: string
    removeChart: string
    editChart: string
    configure: string
    noData: string
  }
  onChartClick?: (chartId: string) => void
  onEditChart?: (chartId: string) => void
  onRemoveChart?: (chartId: string) => void
  chartData?: Record<string, Observation[]>
}

const GRID_COLS = 12
const ROW_HEIGHT = 100
const CONTAINER_PADDING_X = 8
const CONTAINER_PADDING_Y = 8
const MARGIN_X = 16
const MARGIN_Y = 16
const MIN_CHART_WIDTH = 4
const MIN_CHART_HEIGHT = 2

/**
 * Convert our layout items to react-grid-layout format
 */
function toGridLayoutItems(layout: LayoutItem[]): Layout {
  return layout.map(item => ({
    i: item.chartId,
    x: Math.max(0, Math.min(item.x, GRID_COLS - (item.minW ?? MIN_CHART_WIDTH))),
    y: Math.max(0, item.y),
    w: Math.max(item.minW ?? MIN_CHART_WIDTH, Math.min(item.w, GRID_COLS)),
    h: Math.max(item.minH ?? MIN_CHART_HEIGHT, item.h),
    minW: item.minW ?? MIN_CHART_WIDTH,
    minH: item.minH ?? MIN_CHART_HEIGHT,
    maxW: GRID_COLS,
    static: false,
  }))
}

/**
 * Convert react-grid-layout items back to our format
 */
function fromGridLayoutItems(layout: Layout): LayoutItem[] {
  return layout.map(item => ({
    chartId: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: item.minW as number | undefined,
    minH: item.minH as number | undefined,
  }))
}

export function DashboardGrid({
  dashboard,
  editMode,
  locale = 'sr-Cyrl',
  labels,
  onChartClick,
  onEditChart,
  onRemoveChart,
  chartData,
}: DashboardGridProps) {
  const { updateLayout, removeChart, selectedChartId } = useDashboardStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1200)

  const chartIds = Object.keys(dashboard.charts)

  // Convert layout to react-grid-layout format
  const gridLayoutItems = useMemo(() => toGridLayoutItems(dashboard.layout), [dashboard.layout])

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handleLayoutChange = useCallback(
    (newLayout: Layout) => {
      // Only update if not currently dragging/resizing
      if (!isDragging && !isResizing) {
        const updatedLayout = fromGridLayoutItems(newLayout)
        updateLayout(updatedLayout)
      }
    },
    [isDragging, isResizing, updateLayout]
  )

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragStop = useCallback(
    (newLayout: Layout) => {
      setIsDragging(false)
      const updatedLayout = fromGridLayoutItems(newLayout)
      updateLayout(updatedLayout)
    },
    [updateLayout]
  )

  const handleResizeStart = useCallback(() => {
    setIsResizing(true)
  }, [])

  const handleResizeStop = useCallback(
    (newLayout: Layout) => {
      setIsResizing(false)
      const updatedLayout = fromGridLayoutItems(newLayout)
      updateLayout(updatedLayout)
    },
    [updateLayout]
  )

  // Empty state
  if (chartIds.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
        <div className="text-center">
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
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-slate-600">{labels.empty}</p>
          {editMode && <p className="mt-2 text-sm text-slate-500">{labels.addFirstChart}</p>}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="dashboard-grid-container">
      <Grid
        className="layout"
        layout={gridLayoutItems}
        cols={GRID_COLS}
        rowHeight={ROW_HEIGHT}
        width={containerWidth - CONTAINER_PADDING_X * 2}
        containerPadding={[CONTAINER_PADDING_X, CONTAINER_PADDING_Y]}
        margin={[MARGIN_X, MARGIN_Y]}
        isDraggable={editMode}
        isResizable={editMode}
        compactType="vertical"
        preventCollision={false}
        onLayoutChange={handleLayoutChange}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        draggableHandle=".dashboard-chart-header"
        useCSSTransforms={true}
      >
        {chartIds.map(chartId => {
          const config = dashboard.charts[chartId]
          if (!config) return null
          const layoutItem = dashboard.layout.find(l => l.chartId === chartId)
          const data = chartData?.[chartId]
          const height = (layoutItem?.h ?? 2) * ROW_HEIGHT

          return (
            <div
              key={chartId}
              className={`dashboard-chart-wrapper ${editMode ? 'edit-mode' : ''}`}
            >
              <DashboardChartCard
                chartId={chartId}
                config={config}
                isSelected={selectedChartId === chartId}
                editMode={editMode}
                labels={{
                  loading: labels.loadingChart,
                  error: labels.errorLoading,
                  remove: labels.removeChart,
                  edit: labels.editChart,
                  configure: labels.configure,
                }}
                onClick={() => onChartClick?.(chartId)}
                onEdit={() => onEditChart?.(chartId)}
                onRemove={() => {
                  removeChart(chartId)
                  onRemoveChart?.(chartId)
                }}
                isDragging={isDragging || isResizing}
              >
                <DashboardChartRenderer
                  config={config}
                  data={data}
                  height={height - 60} // Account for header
                  locale={locale}
                />
              </DashboardChartCard>
            </div>
          )
        })}
      </Grid>
    </div>
  )
}
