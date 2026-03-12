import type { ParsedDataset, DimensionMeta, MeasureMeta, Observation } from '@/types'

/**
 * Mock secondary datasets for multi-dataset demo.
 * These simulate datasets that could be joined with a primary dataset.
 */

export interface MockDatasetDefinition {
  id: string
  name: string
  resourceId: string
  description: string
  createDataset: () => ParsedDataset
}

// Mock dataset: Population by municipality (2024)
const populationData: MockDatasetDefinition = {
  id: 'mock-population-2024',
  name: 'Population by Municipality (2024)',
  resourceId: 'res-pop-001',
  description: 'Population statistics by municipality for Serbia',
  createDataset: () => {
    const observations: Observation[] = [
      { municipality: 'Beograd', population: 1686000, area_km2: 3222, density: 523 },
      { municipality: 'Novi Sad', population: 380000, area_km2: 699, density: 543 },
      { municipality: 'Niš', population: 260000, area_km2: 596, density: 436 },
      { municipality: 'Kragujevac', population: 180000, area_km2: 835, density: 215 },
      { municipality: 'Subotica', population: 150000, area_km2: 1008, density: 148 },
      { municipality: 'Zrenjanin', population: 130000, area_km2: 1326, density: 98 },
      { municipality: 'Pančevo', population: 125000, area_km2: 759, density: 164 },
      { municipality: 'Čačak', population: 115000, area_km2: 636, density: 180 },
      { municipality: 'Kruševac', population: 110000, area_km2: 854, density: 128 },
      { municipality: 'Šabac', population: 115000, area_km2: 795, density: 144 },
      { municipality: 'Smederevo', population: 105000, area_km2: 484, density: 217 },
      { municipality: 'Leskovac', population: 95000, area_km2: 905, density: 104 },
    ]

    const dimensions: DimensionMeta[] = [
      {
        key: 'municipality',
        label: 'Municipality',
        type: 'geographic',
        values: observations.map(o => String(o.municipality)),
        cardinality: observations.length,
      },
    ]

    const measures: MeasureMeta[] = [
      {
        key: 'population',
        label: 'Population',
        min: 95000,
        max: 1686000,
        hasNulls: false,
      },
      {
        key: 'area_km2',
        label: 'Area (km²)',
        min: 484,
        max: 3222,
        hasNulls: false,
      },
      {
        key: 'density',
        label: 'Population Density',
        unit: 'per km²',
        min: 98,
        max: 543,
        hasNulls: false,
      },
    ]

    return {
      observations,
      dimensions,
      measures,
      metadataColumns: [],
      columns: ['municipality', 'population', 'area_km2', 'density'],
      rowCount: observations.length,
      source: {
        datasetId: 'mock-population-2024',
        resourceId: 'res-pop-001',
        format: 'mock',
        fetchedAt: new Date().toISOString(),
        name: 'Population 2024',
      },
    }
  },
}

// Mock dataset: GDP by region (2024)
const gdpData: MockDatasetDefinition = {
  id: 'mock-gdp-2024',
  name: 'GDP by Region (2024)',
  resourceId: 'res-gdp-001',
  description: 'Gross Domestic Product by region in Serbia',
  createDataset: () => {
    const observations: Observation[] = [
      { region: 'Beograd', gdp_eur: 28000000000, gdp_per_capita: 16600, growth_rate: 4.2 },
      { region: 'Vojvodina', gdp_eur: 12000000000, gdp_per_capita: 6500, growth_rate: 3.1 },
      { region: 'Niš', gdp_eur: 3500000000, gdp_per_capita: 5200, growth_rate: 2.8 },
      { region: 'Kragujevac', gdp_eur: 2800000000, gdp_per_capita: 5100, growth_rate: 3.5 },
      { region: 'Šumadija', gdp_eur: 2500000000, gdp_per_capita: 4800, growth_rate: 2.9 },
      { region: 'Zapadna Srbija', gdp_eur: 2200000000, gdp_per_capita: 4600, growth_rate: 2.7 },
      { region: 'Južna Srbija', gdp_eur: 1800000000, gdp_per_capita: 4400, growth_rate: 2.5 },
    ]

    const dimensions: DimensionMeta[] = [
      {
        key: 'region',
        label: 'Region',
        type: 'geographic',
        values: observations.map(o => String(o.region)),
        cardinality: observations.length,
      },
    ]

    const measures: MeasureMeta[] = [
      {
        key: 'gdp_eur',
        label: 'GDP (EUR)',
        min: 1800000000,
        max: 28000000000,
        hasNulls: false,
      },
      {
        key: 'gdp_per_capita',
        label: 'GDP per Capita (EUR)',
        min: 4400,
        max: 16600,
        hasNulls: false,
      },
      {
        key: 'growth_rate',
        label: 'Growth Rate (%)',
        min: 2.5,
        max: 4.2,
        hasNulls: false,
      },
    ]

    return {
      observations,
      dimensions,
      measures,
      metadataColumns: [],
      columns: ['region', 'gdp_eur', 'gdp_per_capita', 'growth_rate'],
      rowCount: observations.length,
      source: {
        datasetId: 'mock-gdp-2024',
        resourceId: 'res-gdp-001',
        format: 'mock',
        fetchedAt: new Date().toISOString(),
        name: 'GDP 2024',
      },
    }
  },
}

// Mock dataset: Employment by year
const employmentData: MockDatasetDefinition = {
  id: 'mock-employment-2024',
  name: 'Employment Statistics (2020-2024)',
  resourceId: 'res-emp-001',
  description: 'Employment rates by year',
  createDataset: () => {
    const observations: Observation[] = [
      { year: 2020, employed: 2850000, unemployed: 420000, rate: 87.2 },
      { year: 2021, employed: 2900000, unemployed: 390000, rate: 88.1 },
      { year: 2022, employed: 2980000, unemployed: 350000, rate: 89.5 },
      { year: 2023, employed: 3050000, unemployed: 320000, rate: 90.5 },
      { year: 2024, employed: 3100000, unemployed: 300000, rate: 91.2 },
    ]

    const dimensions: DimensionMeta[] = [
      {
        key: 'year',
        label: 'Year',
        type: 'temporal',
        values: observations.map(o => new Date(`${String(o.year)}-01-01T00:00:00.000Z`)),
        cardinality: 5,
      },
    ]

    const measures: MeasureMeta[] = [
      {
        key: 'employed',
        label: 'Employed',
        min: 2850000,
        max: 3100000,
        hasNulls: false,
      },
      {
        key: 'unemployed',
        label: 'Unemployed',
        min: 300000,
        max: 420000,
        hasNulls: false,
      },
      {
        key: 'rate',
        label: 'Employment Rate (%)',
        min: 87.2,
        max: 91.2,
        hasNulls: false,
      },
    ]

    return {
      observations,
      dimensions,
      measures,
      metadataColumns: [],
      columns: ['year', 'employed', 'unemployed', 'rate'],
      rowCount: observations.length,
      source: {
        datasetId: 'mock-employment-2024',
        resourceId: 'res-emp-001',
        format: 'mock',
        fetchedAt: new Date().toISOString(),
        name: 'Employment 2024',
      },
    }
  },
}

// Export all mock datasets
export const MOCK_DATASETS: MockDatasetDefinition[] = [
  populationData,
  gdpData,
  employmentData,
]

/**
 * Get list of available mock datasets (metadata only, no data)
 */
export function getAvailableMockDatasets(): Array<{
  id: string
  name: string
  resourceId: string
  description: string
}> {
  return MOCK_DATASETS.map(d => ({
    id: d.id,
    name: d.name,
    resourceId: d.resourceId,
    description: d.description,
  }))
}

/**
 * Load a mock dataset by ID
 */
export function loadMockDataset(datasetId: string): Promise<ParsedDataset> {
  const definition = MOCK_DATASETS.find(d => d.id === datasetId)

  if (!definition) {
    return Promise.reject(new Error(`Mock dataset not found: ${datasetId}`))
  }

  // Simulate async loading with small delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(definition.createDataset())
    }, 300)
  })
}
