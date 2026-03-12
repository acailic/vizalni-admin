# Quick Start Guide

**Get Vizualni Admin up and running in under 5 minutes**

This guide will help you create your first interactive data visualization using Vizualni Admin and Serbian open data.

## 🚀 5-Minute Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Basic knowledge of React/TypeScript

### Step 1: Installation

```bash
# Clone the repository
git clone https://github.com/acailic/vizualni-admin.git
cd vizualni-admin

# Install dependencies
yarn install

# Set up environment
cp .env.example .env.local
```

### Step 2: Configure data.gov.rs API

Add your data.gov.rs API configuration to `.env.local`:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/vizualni_admin
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Start Development Server

```bash
# Start the database (if using Docker)
docker-compose up -d

# Run migrations
yarn db:migrate:dev

# Start development server
yarn dev
```

### Step 4: Create Your First Visualization

Visit **http://localhost:3000** and:

1. **Browse Serbian datasets** from data.gov.rs
2. **Select a dataset** (e.g., Population by Municipality)
3. **Choose a chart type** (Bar, Line, Map, etc.)
4. **Configure your visualization** with colors and filters
5. **Export or embed** your visualization

## 🎯 Try This Example

Here's a simple example to visualize Serbian population data:

```typescript
import { DataGovRsClient } from '@acailic/vizualni-admin'
import { BarChart } from '@acailic/vizualni-admin/charts'

// Initialize the API client
const client = new DataGovRsClient({
  baseUrl: 'https://data.gov.rs/api/1'
})

// Fetch Serbian population data
const datasets = await client.searchDatasets({
  q: 'stanovništvo po opštinama',
  limit: 10
})

// Create a bar chart
const populationChart = new BarChart({
  data: datasets[0].resources[0].data,
  x: 'municipality',
  y: 'population',
  title: 'Population by Municipality (2023)',
  colors: ['#3c82f6', '#1d4ed8']
})

// Render the chart
populationChart.render('#chart-container')
```

## 🌐 Live Demo

Want to see Vizualni Admin in action without installing?

👉 **[View Live Demo](https://acailic.github.io/vizualni-admin/)**

## 📱 What You Can Create

Vizualni Admin supports multiple visualization types:

### 📊 Charts
- **Bar Charts** - Perfect for categorical data
- **Line Charts** - Ideal for time series data
- **Area Charts** - Show cumulative data over time
- **Scatter Plots** - Correlate two variables
- **Pie Charts** - Show proportions and percentages

### 🗺️ Maps
- **Choropleth Maps** - Color-coded regions
- **Point Maps** - Location-based data
- **Heat Maps** - Data density visualization

### 📋 Tables
- **Data Tables** - Sortable and filterable
- **Pivot Tables** - Multi-dimensional analysis

## 🎨 Customization Options

```typescript
const chartConfig = {
  // Visual styling
  colors: ['#3c82f6', '#10b981', '#f59e0b'],
  theme: 'light' | 'dark',

  // Internationalization
  locale: 'sr-Latn' | 'sr-Cyrl' | 'en',

  // Interactivity
  animations: true,
  tooltips: true,
  zoom: true,

  // Export options
  export: ['png', 'svg', 'pdf', 'csv'],

  // Accessibility
  accessible: true,
  keyboardNavigation: true
}
```

## 🇷🇸 Serbian Data Integration

Vizualni Admin seamlessly integrates with [data.gov.rs](https://data.gov.rs):

### Available Data Categories
- 🏛️ **Government** - Budget, employees, services
- 📈 **Economy** - GDP, inflation, trade
- 👥 **Demographics** - Population, migration, age groups
- 🏥 **Healthcare** - Hospitals, doctors, statistics
- 🎓 **Education** - Schools, students, performance
- 🌍 **Environment** - Pollution, climate, resources

### Example: Economic Indicators

```typescript
// Search for economic datasets
const economicData = await client.searchDatasets({
  organization: ' Republički zavod za statistiku',
  topic: 'ekonomija',
  limit: 20
})

// Create a multi-series line chart
const economicChart = new LineChart({
  data: economicData[0].data,
  series: [
    { key: 'gdp', label: 'GDP (mil. EUR)' },
    { key: 'inflation', label: 'Inflation (%)' },
    { key: 'unemployment', label: 'Unemployment (%)' }
  ],
  timeField: 'year',
  title: 'Economic Indicators - Republic of Serbia'
})
```

## 🎯 Next Steps

Now that you have Vizualni Admin running, explore:

- **[Serbian Data Integration Guide](./serbian-data.md)** - Learn about data.gov.rs API
- **[Configuration Guide](./configuration.md)** - Customize your setup
- **[Component Library](../components/introduction.md)** - Explore available components
- **[Chart Gallery](../charts/overview.md)** - See all chart types
- **[Examples](../examples/overview.md)** - Copy-paste ready examples

## ❓ Need Help?

- 🐛 **[Report Issues](https://github.com/acailic/vizualni-admin/issues)** - Found a bug?
- 💬 **[Discussions](https://github.com/acailic/vizualni-admin/discussions)** - Have questions?
- 📧 **[Email Support](mailto:support@vizualni-admin.rs)** - Direct help
- 📚 **[Documentation](../)** - Complete reference

## 🎉 Success!

You've successfully set up Vizualni Admin! You can now:

✅ Browse Serbian open data
✅ Create interactive visualizations
✅ Export and share your charts
✅ Embed visualizations in websites

**Happy visualizing!** 📊✨

---

*This quick start guide covers the essentials. For detailed documentation, explore the other sections in this guide.*