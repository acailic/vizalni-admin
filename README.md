# Vizualni Admin

> Serbian Open Data Visualization Tool | Aлат за визуализацију отворених
> података Србије

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://acailic.github.io/vizualni-admin/)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://github.com/acailic/vizualni-admin/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/acailic/vizualni-admin.svg)](https://github.com/acailic/vizualni-admin/stargazers)

## 📋 Table of Contents / Садржај

- [What is Vizualni Admin?](#what-is-vizualni-admin)
- [Features / Могућности](#features)
- [Quick Start / Брзи почетак](#quick-start)
- [Installation / Инсталација](#installation)
- [Usage / Употреба](#usage)
- [Deploying / Deployment](#deploying)
- [Examples / Примери](#examples)
- [Contributing / Допринос](#contributing)
- [License / Лиценца](#license)

---

## What is Vizualni Admin?

**Vizualni Admin** is a powerful visualization tool for Serbian open data. It
allows you to:

- 📊 Create beautiful, interactive charts from
  [data.gov.rs](https://data.gov.rs) datasets
- 🌐 Support for both Latin and Cyrillic Serbian scripts
- 📱 Responsive design that works on all devices
- 🎨 Customize colors, styles, and chart types
- 📤 Export charts in various formats
- 🔍 Browse and filter datasets from the Serbian Open Data Portal

---

## Features / Могућности

### 🎯 Core Features

- **No Code Required** - Create visualizations without programming
- **Serbian Open Data Integration** - Direct access to data.gov.rs datasets
- **Multiple Chart Types** - Line, Bar, Pie, Area, Scatter, Map, and more
- **Real-time Data** - Fetch live data from APIs
- **Export Options** - PNG, SVG, PDF, and embedded HTML

### 🌍 Localization

- Full Serbian language support (Latin and Cyrillic)
- English language support
- Localized interface and date formats

### 📱 Responsive Design

- Works on desktop, tablet, and mobile
- Touch-friendly interactions
- Optimized for different screen sizes

### 🔧 Technical Features

- Built with Next.js and React
- TypeScript support
- Server-side rendering (SSR)
- Static site generation (SSG)
- PWA capabilities

---

## Quick Start / Брзи почетак

### Option 1: Use the Live Demo

Visit
[https://acailic.github.io/vizualni-admin/](https://acailic.github.io/vizualni-admin/)
to start creating visualizations immediately.

### Option 2: Install Locally

```bash
# Clone the repository
git clone https://github.com/acailic/vizualni-admin.git
cd vizualni-admin

# Install dependencies
yarn install

# Start development server
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Installation / Инсталација

### As an NPM Package

```bash
npm install @acailic/vizualni-admin
# or
yarn add @acailic/vizualni-admin
```

### From Source

```bash
git clone https://github.com/acailic/vizualni-admin.git
cd vizualni-admin
yarn install
```

---

## Usage / Употреба

### 1. Creating Your First Visualization

#### Web Interface (No Code)

1. Go to [Create Chart](https://acailic.github.io/vizualni-admin/create)
2. Select a dataset from data.gov.rs or upload your own
3. Choose a chart type
4. Customize colors and labels
5. Save or embed your chart

#### As a React Component

```jsx
import { LineChart } from "@acailic/vizualni-admin/charts";

const data = [
  { year: "2019", value: 72 },
  { year: "2020", value: 54 },
  { year: "2021", value: 63 },
  { year: "2022", value: 81 },
];

export function MyChart() {
  return (
    <LineChart
      data={data}
      config={{ xAxis: "year", yAxis: "value", title: "Employment Recovery" }}
      width={720}
      height={360}
      locale="sr-Latn"
    />
  );
}
```

### 2. Using Serbian Open Data

```jsx
import { useDataGovRs } from "@acailic/vizualni-admin/hooks";

function BudgetVisualization() {
  const { data, isLoading, error } = useDataGovRs({
    params: { q: "budzet", page_size: 10 },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((dataset) => (
        <li key={dataset.id}>{dataset.title}</li>
      ))}
    </ul>
  );
}
```

### 3. Customizing Charts

```jsx
<LineChart
  data={data}
  config={{
    xAxis: "label",
    yAxis: "value",
    title: "Прираст становништва",
    color: "#0090ff",
  }}
  showTooltip
  animated
  locale="sr-Latn"
  style={{
    fontFamily: "NotoSans, sans-serif",
    fontSize: 14,
  }}
/>
```

### 4. Embedding Charts

```html
<!-- Option 1: Using iframe -->
<iframe
  src="https://acailic.github.io/vizualni-admin/embed/chart-id"
  width="800"
  height="400"
  frameborder="0"
></iframe>

<!-- Option 2: Using script tag -->
<div id="vizualni-chart"></div>
<script
  src="https://acailic.github.io/vizualni-admin/embed/chart-id.js"
  async
></script>
```

---

## Deploying / Deployment

### Option 1: GitHub Pages (Recommended)

```bash
# Build for GitHub Pages
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:gh-pages

# Deploy to GitHub Pages (automatic on push to main)
git push origin main
```

For local testing:

```bash
# Build and serve locally
yarn build:gh-pages-local
yarn serve:gh-pages

# Or one command
yarn start:gh-pages-local
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Docker

```bash
# Build Docker image
docker build -t vizualni-admin .

# Run container
docker run -p 3000:3000 vizualni-admin
```

### Option 4: Static Export

```bash
# Export static files
yarn build:static

# Deploy the 'out' folder to any static host
```

---

## Examples / Примери

### 1. Revenue Trend (Line Chart)

```jsx
import { LineChart } from "@acailic/vizualni-admin/charts";

<LineChart
  data={[
    { year: "2020", revenue: 120 },
    { year: "2021", revenue: 180 },
    { year: "2022", revenue: 160 },
  ]}
  config={{ xAxis: "year", yAxis: "revenue", title: "Revenue Trend" }}
  height={320}
/>;
```

### 2. Category Split (Pie Chart)

```jsx
import { PieChart } from "@acailic/vizualni-admin/charts";

<PieChart
  data={[
    { label: "Health", value: 35 },
    { label: "Education", value: 25 },
    { label: "Infrastructure", value: 40 },
  ]}
  config={{ xAxis: "label", yAxis: "value", title: "Budget Split" }}
  height={320}
/>;
```

### 3. GeoJSON Map (Map Chart)

```jsx
import { MapChart } from "@acailic/vizualni-admin/charts";

<MapChart
  data={geoJson}
  config={{ colorScale: ["#e0f2fe", "#0369a1"], showLegend: true }}
  height={420}
/>;
```

### View More Examples

- [Live Gallery](https://acailic.github.io/vizualni-admin/gallery)
- [Demos by Category](https://acailic.github.io/vizualni-admin/demos)
- [Tutorials](https://acailic.github.io/vizualni-admin/tutorials)

---

## API Reference

### Main Components

| Component     | Props            | Description                          |
| ------------- | ---------------- | ------------------------------------ |
| `LineChart`   | `data`, `config` | Line charts (single or multi-series) |
| `BarChart`    | `data`, `config` | Bar charts                           |
| `ColumnChart` | `data`, `config` | Column charts                        |
| `AreaChart`   | `data`, `config` | Area charts                          |
| `PieChart`    | `data`, `config` | Pie charts                           |
| `MapChart`    | `data`, `config` | GeoJSON choropleth maps              |

### Data Hooks

| Hook           | Parameters                                        | Returns                                             |
| -------------- | ------------------------------------------------- | --------------------------------------------------- |
| `useDataGovRs` | `{ params, enabled, cacheTime, refetchInterval }` | `{ data, count, isLoading, error, refetch, fetch }` |

### Utility Functions

```js
import {
  formatNumber,
  formatDate,
  truncate,
} from "@acailic/vizualni-admin/utils";
```

---

## Contributing / Допринос

We welcome contributions! Here's how to get started:

### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/vizualni-admin.git
cd vizualni-admin

# Install dependencies
yarn install

# Set up development database (optional)
yarn setup:dev

# Start development server
yarn dev
```

### How to Contribute

1. **Report Bugs** - Open an issue on GitHub
2. **Suggest Features** - Open an issue with "Feature Request" label
3. **Submit Pull Requests** - Fork, create a branch, and submit a PR
4. **Improve Documentation** - Help us make the docs better

### Development Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn test         # Run tests
yarn lint         # Run linter
yarn typecheck    # Check TypeScript types
yarn storybook    # Run component library
```

---

## FAQ

### Q: Can I use my own data?

A: Yes! You can upload CSV, JSON, or connect to any API endpoint.

### Q: Is it really free?

A: Yes, Vizualni Admin is open source and free to use.

### Q: Do I need to know how to code?

A: No! The web interface allows you to create visualizations without any coding.

### Q: Can I export my charts?

A: Yes, you can export as PNG, SVG, PDF, or embed them in websites.

### Q: Does it work offline?

A: The static export version works offline after loading.

---

## Support / Подршка

- 📖 [Documentation](https://acailic.github.io/vizualni-admin/docs)
- 🎓 [Tutorials](https://acailic.github.io/vizualni-admin/tutorials)
- 🐛 [Report Issues](https://github.com/acailic/vizualni-admin/issues)
- 💬 [Discussions](https://github.com/acailic/vizualni-admin/discussions)

---

## License / Лиценца

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/) © 2024
Vizualni Admin

---

<div align="center">
  <sub>Built with ❤️ for the Serbian open data community</sub>
  <br>
  <sub>Изграђено са ❤️ за заједницу отворених података Србије</sub>
</div>
