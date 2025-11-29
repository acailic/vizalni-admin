# Serbian Data Integration

**Complete guide to working with data.gov.rs and Serbian open data**

Vizualni Admin provides native integration with the [Serbian Open Data Portal](https://data.gov.rs), giving you access to hundreds of government datasets ready for visualization.

## 🇷🇸 About data.gov.rs

The Portal otvorenih podataka Republike Srbije (Serbian Open Data Portal) is the official platform for Serbian government data, featuring:

- **500+ datasets** from 50+ government organizations
- **Multiple formats** - CSV, JSON, XML, GeoJSON, RDF
- **RESTful API** for programmatic access
- **Regular updates** with current government statistics
- **Bilingual support** - Serbian and English

## 🚀 Quick API Setup

### 1. API Client Configuration

```typescript
import { DataGovRsClient, createDataGovRsClient } from '@acailic/vizualni-admin'

// Option 1: Default client (ready to use)
import { dataGovRsClient } from '@acailic/vizualni-admin'

// Option 2: Custom configuration
const client = createDataGovRsClient({
  baseUrl: 'https://data.gov.rs/api/1',
  timeout: 10000,
  retries: 3,
  headers: {
    'User-Agent': 'Vizualni-Admin/1.0.0'
  }
})
```

### 2. Authentication

**Public data** requires no authentication:

```typescript
// Read operations work immediately
const datasets = await client.getDatasets()
```

**Private data** (future feature) will require API keys:

```typescript
// Future: For write operations or private datasets
const client = createDataGovRsClient({
  apiKey: process.env.DATA_GOV_RS_API_KEY
})
```

## 📊 Available Data Categories

### Government & Administration
- **State institutions** - Ministries, agencies, offices
- **Budget data** - Revenue, expenditure, debt
- **Public procurement** - Contracts, suppliers
- **Public employees** - Numbers, salaries, structure

### Economy & Finance
- **GDP indicators** - Quarterly and annual data
- **Inflation rates** - CPI, PPI, sector-specific
- **Foreign trade** - Imports, exports, balance
- **Banking sector** - Loans, deposits, interest rates
- **Business register** - Companies, entrepreneurs

### Demographics & Society
- **Population census** - Age, gender, ethnicity
- **Migration data** - Internal, external, refugees
- **Marriage & divorce** - Statistics, trends
- **Education** - Schools, students, graduates
- **Healthcare** - Hospitals, patients, mortality

### Environment & Agriculture
- **Air quality** - Pollution, monitoring stations
- **Water resources** - Quality, consumption
- **Climate data** - Temperature, precipitation
- **Agriculture** - Production, yields, livestock
- **Energy** - Production, consumption, renewables

### Infrastructure & Transport
- **Road network** - Length, condition, traffic
- **Rail transport** - Passengers, freight
- **Air transport** - Airports, passengers
- **Telecommunications** - Internet, mobile coverage

## 🔍 API Methods Reference

### Dataset Operations

```typescript
// Search datasets
const searchResults = await client.searchDatasets({
  q: 'stanovništvo',                    // Search query
  organization: 'RZS',                 // Filter by organization
  topic: 'demografija',                // Filter by topic
  format: 'csv',                       // Filter by format
  limit: 20,                          // Results per page
  offset: 0,                          // Pagination offset
  sort: 'created desc'                // Sort order
})

// Get specific dataset
const dataset = await client.getDataset('dataset-id')

// Get dataset resources (files)
const resources = await client.getDatasetResources('dataset-id')
```

### Resource Operations

```typescript
// Get resource metadata
const resource = await client.getResource('resource-id')

// Download resource data
const csvData = await client.downloadResource('resource-id')
const jsonData = await client.downloadResourceAsJson('resource-id')

// Get resource preview (first 100 rows)
const preview = await client.getResourcePreview('resource-id')
```

### Organization Operations

```typescript
// List all organizations
const organizations = await client.getOrganizations()

// Get specific organization
const organization = await client.getOrganization('org-id')

// Get organization datasets
const orgDatasets = await client.getOrganizationDatasets('org-id')
```

## 📈 Working with Serbian Data

### Example 1: Population by Municipality

```typescript
import { BarChart, createDataGovRsClient } from '@acailic/vizualni-admin'

const client = createDataGovRsClient()

// Search for population data
const datasets = await client.searchDatasets({
  q: 'broj stanovnika po opštinama',
  organization: 'Republički zavod za statistiku',
  format: 'csv',
  limit: 5
})

// Get the most relevant dataset
const dataset = datasets[0]

// Download and process data
const csvData = await client.downloadResourceAsJson(dataset.resources[0].id)

// Create visualization
const chart = new BarChart({
  data: csvData,
  x: 'municipality',     // Serbian: 'opština'
  y: 'population',       // Serbian: 'broj_stanovnika'
  title: 'Број становника по општинама (2023)',
  subtitle: 'Република Србија',
  colors: ['#3c82f6', '#1d4ed8'],
  locale: 'sr-Cyrl',
  numberFormat: 'sr-RS'
})

// Render chart
chart.render('#population-chart')
```

### Example 2: Economic Indicators Time Series

```typescript
import { LineChart, createDataGovRsClient } from '@acailic/vizualni-admin'

const client = createDataGovRsClient()

// Find economic data
const economicDatasets = await client.searchDatasets({
  q: 'BDP inflacija stopa nezaposlenosti',
  organization: 'Narodna banka Srbije'
})

// Create multi-series chart
const economicChart = new LineChart({
  data: economicData,
  timeField: 'godina',
  series: [
    {
      key: 'gdp_billion_eur',
      label: 'БДП (милијарде EUR)',
      color: '#3c82f6'
    },
    {
      key: 'inflation_rate',
      label: 'Инфлација (%)',
      color: '#ef4444'
    },
    {
      key: 'unemployment_rate',
      label: 'Неезапосленост (%)',
      color: '#10b981'
    }
  ],
  title: 'Економски индикатори - Србија',
  locale: 'sr-Latn',
  dateFormat: 'YYYY'
})
```

### Example 3: Regional Mapping

```typescript
import { ChoroplethMap, createDataGovRsClient } from '@acailic/vizualni-admin'

const client = createDataGovRsClient()

// Find regional data
const regionalData = await client.searchDatasets({
  q: 'podaci po okruzima',
  format: 'json'
})

// Create map visualization
const serbiaMap = new ChoroplethMap({
  data: regionalData,
  geojson: '/maps/serbia-districts.json',
  valueField: 'unemployment_rate',
  regionField: 'district_code',
  title: 'Стопа незапослености по окрузима (%)',
  colorScale: 'YlOrRd',
  legend: {
    position: 'bottom-right',
    title: 'Неезапосленост (%)'
  },
  tooltips: {
    template: '<strong>{name}</strong><br>Неезапосленост: {value}%'
  }
})
```

## 🌐 Localization Support

### Serbian Language Variants

Vizualni Admin supports both Serbian scripts:

```typescript
// Cyrillic (Ћирилица)
const chartCyrillic = new BarChart({
  title: 'Број становника по општинама',
  subtitle: 'Република Србија',
  locale: 'sr-Cyrl',
  // ... other config
})

// Latin (Latinica)
const chartLatin = new BarChart({
  title: 'Broj stanovnika po opštinama',
  subtitle: 'Republika Srbija',
  locale: 'sr-Latn',
  // ... other config
})
```

### Date and Number Formatting

```typescript
const chart = new LineChart({
  locale: 'sr-RS',          // Serbian locale
  dateFormat: 'DD.MM.YYYY.', // Serbian date format
  numberFormat: {
    decimal: ',',           // Use comma as decimal separator
    thousands: '.'          // Use period as thousands separator
  },
  currencyFormat: {
    symbol: 'RSD',
    position: 'after'
  }
})
```

## 🔧 Data Processing

### Common Data Transformations

```typescript
import {
  createDataGovRsClient,
  processSerbianData,
  normalizeDateFormats,
  translateColumnNames
} from '@acailic/vizualni-admin'

const client = createDataGovRsClient()

// Download raw data
const rawData = await client.downloadResource('resource-id')

// Process for visualization
const processedData = processSerbianData(rawData, {
  // Translate Serbian column names
  translate: {
    'Година': 'year',
    'Број становника': 'population',
    'ОПШТИНА': 'municipality'
  },

  // Normalize date formats (common in Serbian data)
  dateFields: ['datum', 'godina'],

  // Handle missing data
  fillMissing: {
    strategy: 'interpolation',
    fields: ['population']
  },

  // Data type conversion
  convertTypes: {
    'broj stanovnika': 'number',
    'godina': 'date'
  }
})

// Create visualization with processed data
const chart = new BarChart({ data: processedData })
```

### Handling Common Issues

#### 1. Mixed Character Sets

```typescript
// Auto-detect and normalize character encoding
const normalizedData = await client.normalizeEncoding(rawData, {
  inputEncoding: 'windows-1250', // Common in older Serbian CSV files
  outputEncoding: 'utf-8'
})
```

#### 2. Date Format Variations

```typescript
// Handle various Serbian date formats
const dateFields = {
  'datum': 'DD.MM.YYYY.',     // 25.12.2023.
  'godina_mesec': 'MM.YYYY.', // 12.2023.
  'period': 'YYYY'            // 2023
}

const normalizedDates = normalizeDateFormats(data, dateFields)
```

#### 3. Number Formatting

```typescript
// Convert Serbian number formats
const numberFields = {
  'iznos': { thousands: '.', decimal: ',' },  // 1.234,56
  'procenat': { decimal: ',', noThousands: true } // 12,5%
}

const normalizedNumbers = normalizeNumberFormats(data, numberFields)
```

## 📋 Popular Serbian Datasets

### Demographics
- **Population by Municipality** - Annual census data
- **Age Structure** - Population by age groups
- **Migration Statistics** - Internal and external migration
- **Birth and Death Rates** - Vital statistics

### Economy
- **GDP by Industry** - Economic output by sector
- **Inflation Rate** - Consumer price index
- **Unemployment** - Monthly unemployment data
- **Foreign Trade** - Import/export statistics

### Government
- **State Budget** - Revenue and expenditure
- **Public Sector Employment** - Government workers
- **Procurement Data** - Public contracts
- **Subsidies** - Government financial support

### Infrastructure
- **Road Statistics** - Length, condition, traffic
- **Energy Production** - Electricity, renewable energy
- **Telecommunications** - Internet penetration, mobile users
- **Transport Data** - Passengers, freight statistics

## 🚀 Best Practices

### 1. Data Selection
```typescript
// Choose datasets with regular updates
const recentDatasets = await client.searchDatasets({
  q: 'stanovništvo',
  sort: 'last_modified desc',
  limit: 10
})

// Prefer larger datasets for better visualizations
const largeDatasets = recentDatasets.filter(
  dataset => dataset.size > '1MB'
)
```

### 2. Error Handling
```typescript
try {
  const data = await client.downloadResource('resource-id')
  // Process data
} catch (error) {
  if (error.status === 404) {
    console.log('Dataset not found, trying alternative...')
    // Try backup data source
  } else if (error.status === 429) {
    console.log('Rate limit exceeded, retrying...')
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
```

### 3. Performance Optimization
```typescript
// Use pagination for large datasets
const allData = []
let page = 0
const pageSize = 100

while (true) {
  const pageData = await client.getDatasetResources(datasetId, {
    limit: pageSize,
    offset: page * pageSize
  })

  allData.push(...pageData)

  if (pageData.length < pageSize) break
  page++
}
```

## 📚 Additional Resources

- **[data.gov.rs API Documentation](https://data.gov.rs/apidoc/)**
- **[Serbian Open Data Strategy](https://data.gov.rs/strategija/)**
- **[Statistical Office of Serbia](https://www.stat.gov.rs/)**
- **[Open Data Handbook - Serbian](https://data.gov.rs/prirucnik/)**

---

*Having trouble with Serbian data integration? [Open an issue](https://github.com/acailic/vizualni-admin/issues) and we'll help you out!*