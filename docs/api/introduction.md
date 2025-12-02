# API Reference

**Complete API documentation for Vizualni Admin**

Vizualni Admin provides a comprehensive TypeScript API for creating data visualizations, working with Serbian open data, and customizing every aspect of your charts.

## 📦 Package Structure

```typescript
// Main package exports
import {
  // Core components
  I18nProvider,

  // Locale utilities
  defaultLocale,
  locales,
  parseLocaleString,
  i18n,
  getD3TimeFormatLocale,
  getD3FormatLocale,

  // Configuration
  validateConfig,
  DEFAULT_CONFIG,

  // Data.gov.rs client
  DataGovRsClient,
  createDataGovRsClient,
  dataGovRsClient,

  // Types
  VizualniAdminConfig,
  DatasetMetadata,
  Organization,
  Resource,
  Locale
} from '@acailic/vizualni-admin'

// Chart components (separate package)
import {
  BarChart,
  LineChart,
  AreaChart,
  ScatterPlot,
  PieChart,
  ChoroplethMap,
  DataTable,
  PivotTable
} from '@acailic/vizualni-admin/charts'
```

## 🚀 Quick API Overview

### 1. Data.gov.rs Integration

```typescript
import { DataGovRsClient } from '@acailic/vizualni-admin'

// Initialize client
const client = new DataGovRsClient({
  baseUrl: 'https://data.gov.rs/api/1',
  timeout: 10000
})

// Search datasets
const datasets = await client.searchDatasets({
  q: 'population',
  organization: 'RZS',
  limit: 20
})

// Download data
const data = await client.downloadResource('resource-id')
```

### 2. Chart Creation

```typescript
import { BarChart } from '@acailic/vizualni-admin/charts'

const chart = new BarChart({
  data: csvData,
  x: 'municipality',
  y: 'population',
  title: 'Population by Municipality',
  colors: ['#3c82f6', '#1d4ed8'],
  locale: 'sr-Latn'
})

chart.render('#container')
```

### 3. Configuration

```typescript
import { validateConfig, DEFAULT_CONFIG } from '@acailic/vizualni-admin'

const config = {
  ...DEFAULT_CONFIG,
  theme: 'dark',
  locale: 'sr-Cyrl',
  colors: ['#3c82f6', '#ef4444', '#10b981'],
  animations: true,
  export: ['png', 'svg', 'pdf']
}

const validation = validateConfig(config)
if (validation.isValid) {
  // Use configuration
} else {
  console.error('Configuration errors:', validation.errors)
}
```

### 4. Internationalization

```typescript
import { I18nProvider, parseLocaleString } from '@acailic/vizualni-admin'

function App({ children }) {
  return (
    <I18nProvider locale={parseLocaleString('sr-Latn')}>
      {children}
    </I18nProvider>
  )
}

// Format dates for Serbian locale
const timeLocale = getD3TimeFormatLocale('sr-Cyrl')
const dateFormatted = timeLocale.format('%d. %m. %Y.')(new Date())
```

## 📚 API Categories

### Core API
- **[Configuration](./configuration.md)** - Chart configuration types and validation
- **[Locale Utilities](./locales.md)** - Internationalization and formatting
- **[Formatters](./formatters.md)** - Data formatting utilities

### Data Integration
- **[Data.gov.rs Client](./data-gov-rs.md)** - Serbian open data API client
- **[Data Processing](./data-processing.md)** - Data transformation utilities

### Visualization API
- **[Chart Types](../charts/overview.md)** - All available chart types
- **[Chart Configuration](./chart-config.md)** - Chart-specific options
- **[Themes](./themes.md)** - Visual theming system

### Components
- **[React Components](../components/)** - UI component library
- **[Hooks](./hooks.md)** - React hooks for data visualization
- **[Utilities](./utilities.md)** - Helper functions and utilities

## 🔧 Type System

Vizualni Admin is built with TypeScript and provides comprehensive type definitions:

### Core Types

```typescript
// Configuration types
interface VizualniAdminConfig {
  theme?: 'light' | 'dark' | 'auto'
  locale?: Locale
  colors?: string[]
  animations?: boolean
  export?: ExportFormat[]
  accessible?: boolean
}

// Data types
interface DatasetMetadata {
  id: string
  title: string
  description: string
  organization: Organization
  resources: Resource[]
  tags: string[]
  created: Date
  modified: Date
}

interface Resource {
  id: string
  name: string
  format: string
  size: number
  url: string
  description?: string
}

// Chart types
interface ChartConfig {
  data: unknown[]
  title: string
  subtitle?: string
  colors?: string[]
  theme?: 'light' | 'dark'
  animations?: boolean
  interactive?: boolean
  export?: ExportFormat[]
}

// Locale types
type Locale = 'en' | 'sr-Latn' | 'sr-Cyrl'
```

### Utility Types

```typescript
// API response types
interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

// Search parameters
interface SearchParams {
  q?: string
  organization?: string
  topic?: string
  format?: string
  limit?: number
  offset?: number
  sort?: string
}

// Validation types
interface ValidationIssue {
  path: string[]
  message: string
  code: string
}

interface ValidationResult {
  isValid: boolean
  data?: VizualniAdminConfig
  errors?: ValidationIssue[]
}
```

## 🎯 Usage Patterns

### 1. Basic Chart Creation

```typescript
import { BarChart } from '@acailic/vizualni-admin/charts'

// Simple chart
const chart = new BarChart({
  data: [
    { name: 'Beograd', value: 1680000 },
    { name: 'Novi Sad', value: 280000 },
    { name: 'Niš', value: 180000 }
  ],
  x: 'name',
  y: 'value'
})

// Advanced chart
const advancedChart = new BarChart({
  data: populationData,
  x: 'municipality',
  y: 'population',
  title: 'Становништво по општинама',
  colors: ['#3c82f6', '#1d4ed8'],
  theme: 'light',
  locale: 'sr-Cyrl',
  animations: true,
  interactive: true,
  export: ['png', 'svg', 'pdf', 'csv'],
  accessible: true,
  responsive: true,
  height: 400,
  margin: { top: 20, right: 20, bottom: 40, left: 60 }
})
```

### 2. Data Processing Pipeline

```typescript
import {
  DataGovRsClient,
  processSerbianData,
  normalizeDateFormats
} from '@acailic/vizualni-admin'

async function createPopulationVisualization() {
  // 1. Fetch data from data.gov.rs
  const client = new DataGovRsClient()
  const datasets = await client.searchDatasets({
    q: 'stanovništvo po opštinama',
    format: 'csv'
  })

  // 2. Download and process data
  const rawData = await client.downloadResource(datasets[0].resources[0].id)

  // 3. Normalize data
  const processedData = processSerbianData(rawData, {
    translate: {
      'ОПШТИНА': 'municipality',
      'БРОЈ СТАНОВНИКА': 'population'
    },
    convertTypes: {
      'БРОЈ СТАНОВНИКА': 'number'
    }
  })

  // 4. Create visualization
  const chart = new BarChart({
    data: processedData,
    x: 'municipality',
    y: 'population',
    title: 'Број становника по општинама',
    locale: 'sr-Cyrl'
  })

  return chart
}
```

### 3. Integration with React

```typescript
import React, { useEffect, useRef } from 'react'
import { BarChart } from '@acailic/vizualni-admin/charts'
import { I18nProvider } from '@acailic/vizualni-admin'

function PopulationChart({ data }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<BarChart>()

  useEffect(() => {
    if (containerRef.current && data) {
      // Create chart
      chartRef.current = new BarChart({
        data,
        x: 'municipality',
        y: 'population',
        title: 'Population by Municipality',
        responsive: true
      })

      // Render chart
      chartRef.current.render(containerRef.current)

      // Cleanup
      return () => {
        chartRef.current?.destroy()
      }
    }
  }, [data])

  return <div ref={containerRef} style={{ height: '400px' }} />
}

function App() {
  const [data, setData] = React.useState(null)

  useEffect(() => {
    // Load data
    fetchPopulationData().then(setData)
  }, [])

  return (
    <I18nProvider locale="sr-Latn">
      <div>
        <h1>Serbian Population Data</h1>
        <PopulationChart data={data} />
      </div>
    </I18nProvider>
  )
}
```

### 4. Advanced Configuration

```typescript
import {
  validateConfig,
  DEFAULT_CONFIG,
  createCustomTheme
} from '@acailic/vizualni-admin'

// Create custom theme
const serbianTheme = createCustomTheme({
  name: 'serbian',
  colors: {
    primary: '#3c82f6',
    secondary: '#ef4444',
    accent: '#10b981',
    background: '#ffffff',
    text: '#1f2937'
  },
  fonts: {
    family: '"Inter", system-ui, sans-serif',
    sizes: {
      small: '12px',
      medium: '14px',
      large: '16px',
      xlarge: '18px'
    }
  },
  borderRadius: '8px',
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 25px rgba(0, 0, 0, 0.1)'
  }
})

// Configuration with custom theme
const config = {
  ...DEFAULT_CONFIG,
  theme: serbianTheme,
  locale: 'sr-Latn',
  colors: ['#3c82f6', '#ef4444', '#10b981', '#f59e0b'],
  animations: {
    duration: 300,
    easing: 'ease-in-out'
  },
  responsive: {
    enabled: true,
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    }
  },
  export: {
    formats: ['png', 'svg', 'pdf', 'csv'],
    quality: {
      png: 300,
      pdf: 'high'
    },
    filename: 'serbian-data-visualization'
  },
  accessibility: {
    enabled: true,
    keyboardNavigation: true,
    screenReaderSupport: true,
    highContrast: false
  }
}

// Validate configuration
const validation = validateConfig(config)
if (!validation.isValid) {
  throw new Error(`Configuration errors: ${validation.errors.join(', ')}`)
}

// Use configuration
const chart = new BarChart({
  data,
  x: 'municipality',
  y: 'population',
  config
})
```

## 📖 Navigation

### Getting Started
- **[Quick Start Guide](../guide/quick-start.md)** - 5-minute setup
- **[Installation](../guide/installation.md)** - Detailed installation steps
- **[Configuration](../guide/configuration.md)** - Setup and customization

### API Documentation
- **[Core API](./core.md)** - Essential API methods
- **[Data.gov.rs Client](./data-gov-rs.md)** - Serbian data integration
- **[Chart Configuration](./chart-config.md)** - Chart-specific settings
- **[Types](./types.md)** - Complete type definitions

### Examples
- **[Code Examples](../examples/overview.md)** - Copy-paste ready examples
- **[Live Demos](https://acailic.github.io/vizualni-admin/)** - Interactive examples
- **[Video Tutorials](../guide/video-tutorials.md)** - Video walkthroughs

### Advanced
- **[Performance](../guide/performance.md)** - Optimization techniques
- **[Customization](../advanced/customization.md)** - Advanced customization
- **[Contributing](../guide/contributing.md)** - Development guidelines

---

*Need help with the API? Check our [examples](../examples/overview.md) or [open an issue](https://github.com/acailic/vizualni-admin/issues).*