import { parseChartConfig } from '@/types/chart-config'

import type { FeaturedExampleConfig } from '../types'

/**
 * Youth Population by Region
 * Shows the number of young people (ages 15-29) by Serbian regions
 */
export const youthDemographicsConfig: FeaturedExampleConfig = {
  id: 'youth-demographics',
  title: {
    sr: 'Омладина по регионима',
    lat: 'Omladina po regionima',
    en: 'Youth Population by Region',
  },
  description: {
    sr: 'Број младих људи (15-29 година) по регионима Србије',
    lat: 'Broj mladih ljudi (15-29 godina) po regionima Srbije',
    en: 'Number of young people (ages 15-29) by Serbian regions',
  },
  // TODO: Replace with actual data.gov.rs dataset URL
  datasetId: 'youth-population-regions',
  resourceUrl: 'https://data.gov.rs/sr/datasets/youth-population-regions.csv',
  chartConfig: parseChartConfig({
    type: 'column',
    title: 'Youth Population',
    x_axis: {
      field: 'region',
      type: 'category',
      label: 'Region',
    },
    y_axis: {
      field: 'count',
      type: 'linear',
      label: 'Population',
    },
    options: {
      paletteId: 'government',
      showLegend: false,
      showGrid: true,
    },
  }),
}
