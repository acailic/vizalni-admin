'use client'

import { lazy } from 'react'

import type { ChartTypeDefinition, SupportedChartType } from '@/types'

const LazyLineChart = lazy(() =>
  import('@/components/charts/line/LineChart').then(module => ({ default: module.LineChart }))
)
const LazyBarChart = lazy(() =>
  import('@/components/charts/bar/BarChart').then(module => ({ default: module.BarChart }))
)
const LazyColumnChart = lazy(() =>
  import('@/components/charts/column/ColumnChart').then(module => ({ default: module.ColumnChart }))
)
const LazyAreaChart = lazy(() =>
  import('@/components/charts/area/AreaChart').then(module => ({ default: module.AreaChart }))
)
const LazyPieChart = lazy(() =>
  import('@/components/charts/pie/PieChart').then(module => ({ default: module.PieChart }))
)
const LazyScatterplotChart = lazy(() =>
  import('@/components/charts/scatterplot/ScatterplotChart').then(module => ({
    default: module.ScatterplotChart,
  }))
)
const LazyTableChart = lazy(() =>
  import('@/components/charts/table/TableChart').then(module => ({ default: module.TableChart }))
)
const LazyComboChart = lazy(() =>
  import('@/components/charts/combo/ComboChart').then(module => ({ default: module.ComboChart }))
)
const LazyMapChart = lazy(() =>
  import('@/components/charts/map/MapChart').then(module => ({ default: module.MapChart }))
)

export const chartRegistry: ChartTypeDefinition[] = [
  {
    type: 'line',
    label: 'Line',
    icon: '↗',
    renderer: LazyLineChart,
    defaultConfig: {
      type: 'line',
      options: { showGrid: true, showLegend: true, curveType: 'monotone', showDots: true },
    },
    capabilities: {
      supportsStacking: false,
      supportsGrouping: false,
      supportsAnimation: true,
      requiresGeo: false,
      minDimensions: 1,
      minMeasures: 1,
      maxMeasures: 1,
    },
  },
  {
    type: 'bar',
    label: 'Bar',
    icon: '▤',
    renderer: LazyBarChart,
    defaultConfig: {
      type: 'bar',
      options: { showGrid: true, showLegend: true },
    },
    capabilities: {
      supportsStacking: true,
      supportsGrouping: true,
      supportsAnimation: true,
      requiresGeo: false,
      minDimensions: 1,
      minMeasures: 1,
      maxMeasures: 1,
    },
  },
  {
    type: 'column',
    label: 'Column',
    icon: '▥',
    renderer: LazyColumnChart,
    defaultConfig: {
      type: 'column',
      options: { showGrid: true, showLegend: true },
    },
    capabilities: {
      supportsStacking: true,
      supportsGrouping: true,
      supportsAnimation: true,
      requiresGeo: false,
      minDimensions: 1,
      minMeasures: 1,
      maxMeasures: 1,
    },
  },
  {
    type: 'area',
    label: 'Area',
    icon: '▰',
    renderer: LazyAreaChart,
    defaultConfig: {
      type: 'area',
      options: { showGrid: true, showLegend: true, fillOpacity: 0.3 },
    },
    capabilities: {
      supportsStacking: true,
      supportsGrouping: false,
      supportsAnimation: true,
      requiresGeo: false,
      minDimensions: 1,
      minMeasures: 1,
      maxMeasures: 1,
    },
  },
  {
    type: 'pie',
    label: 'Pie',
    icon: '◔',
    renderer: LazyPieChart,
    defaultConfig: {
      type: 'pie',
      options: { showLegend: true, showLabels: true, showPercentages: true },
    },
    capabilities: {
      supportsStacking: false,
      supportsGrouping: false,
      supportsAnimation: true,
      requiresGeo: false,
      minDimensions: 1,
      minMeasures: 1,
      maxMeasures: 1,
    },
  },
  {
    type: 'scatterplot',
    label: 'Scatterplot',
    icon: '∙',
    renderer: LazyScatterplotChart,
    defaultConfig: {
      type: 'scatterplot',
      options: { showGrid: false, dotSize: 5, opacity: 0.7 },
    },
    capabilities: {
      supportsStacking: false,
      supportsGrouping: false,
      supportsAnimation: false,
      requiresGeo: false,
      minDimensions: 1,
      minMeasures: 2,
      maxMeasures: 2,
    },
  },
  {
    type: 'table',
    label: 'Table',
    icon: '☷',
    renderer: LazyTableChart,
    defaultConfig: {
      type: 'table',
      options: { pageSize: 10, showLegend: false, showGrid: false },
    },
    capabilities: {
      supportsStacking: false,
      supportsGrouping: false,
      supportsAnimation: false,
      requiresGeo: false,
      minDimensions: 0,
      minMeasures: 0,
      maxMeasures: 99,
    },
  },
  {
    type: 'combo',
    label: 'Combo',
    icon: '≋',
    renderer: LazyComboChart,
    defaultConfig: {
      type: 'combo',
      options: { showGrid: true, showLegend: true },
    },
    capabilities: {
      supportsStacking: false,
      supportsGrouping: false,
      supportsAnimation: true,
      requiresGeo: false,
      minDimensions: 1,
      minMeasures: 1,
      maxMeasures: 2,
    },
  },
  {
    type: 'map',
    label: 'Map',
    icon: '🗺',
    renderer: LazyMapChart,
    defaultConfig: {
      type: 'map',
      options: { showLegend: true, geoLevel: 'district' },
    },
    capabilities: {
      supportsStacking: false,
      supportsGrouping: false,
      supportsAnimation: false,
      requiresGeo: true,
      minDimensions: 1,
      minMeasures: 1,
      maxMeasures: 1,
    },
  },
]

export function getChartDefinition(type: SupportedChartType) {
  return chartRegistry.find(entry => entry.type === type)
}

export function getChartTypeOptions() {
  return chartRegistry.map(({ type, label, icon }) => ({
    type,
    label,
    icon,
  }))
}
