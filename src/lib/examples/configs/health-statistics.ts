import { parseChartConfig } from '@/types/chart-config'

import type { FeaturedExampleConfig } from '../types'

/**
 * Health Statistics Over Time
 * Shows health indicators across multiple years
 */
export const healthStatisticsConfig: FeaturedExampleConfig = {
  id: 'health-statistics',
  title: {
    sr: 'Здравствена статистика',
    lat: 'Zdravstvena statistika',
    en: 'Health Statistics',
  },
  description: {
    sr: 'Преглед кључних здравствених показатеља током времена',
    lat: 'Pregled ključnih zdravstvenih pokazatelja tokom vremena',
    en: 'Overview of key health indicators over time',
  },
  // TODO: Replace with actual data.gov.rs dataset URL
  datasetId: 'health-indicators',
  resourceUrl: 'https://data.gov.rs/sr/datasets/health-indicators.csv',
  chartConfig: parseChartConfig({
    type: 'line',
    title: 'Health Indicators',
    x_axis: {
      field: 'year',
      type: 'category',
      label: 'Year',
    },
    y_axis: {
      field: 'value',
      type: 'linear',
      label: 'Value',
    },
    options: {
      paletteId: 'government',
      showLegend: true,
      showGrid: true,
      showDots: true,
      curveType: 'monotone',
    },
  }),
}
