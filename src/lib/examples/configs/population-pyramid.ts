import { parseChartConfig } from '@/types/chart-config'

import type { FeaturedExampleConfig } from '../types'

/**
 * Population Pyramid
 * Shows age/gender distribution with focus on youth
 */
export const populationPyramidConfig: FeaturedExampleConfig = {
  id: 'population-pyramid',
  title: {
    sr: 'Пирамида старосне структуре',
    lat: 'Piramida starosne strukture',
    en: 'Population Age Structure',
  },
  description: {
    sr: 'Старосна и полна структура становништва Србије',
    lat: 'Starosna i polna struktura stanovništva Srbije',
    en: 'Age and gender structure of Serbian population',
  },
  // TODO: Replace with actual data.gov.rs dataset URL
  datasetId: 'population-age-gender',
  resourceUrl: 'https://data.gov.rs/sr/datasets/population-age-gender.csv',
  chartConfig: parseChartConfig({
    type: 'bar',
    title: 'Population by Age Group',
    x_axis: {
      field: 'population',
      type: 'linear',
      label: 'Population',
    },
    y_axis: {
      field: 'age_group',
      type: 'category',
      label: 'Age Group',
    },
    options: {
      paletteId: 'government',
      showLegend: true,
      showGrid: true,
      grouping: 'grouped',
    },
  }),
}
