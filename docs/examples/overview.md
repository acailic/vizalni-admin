# Examples Gallery

**Interactive examples showcasing Vizualni Admin capabilities**

Explore these ready-to-use examples to see what you can build with Vizualni Admin. Each example includes live demos, source code, and explanations.

## 🎯 Quick Navigation

### 📊 Basic Charts
- **[Bar Chart](./bar-chart/)** - Population by municipality
- **[Line Chart](./line-chart/)** - Economic indicators over time
- **[Area Chart](./area-chart/)** - Cumulative data visualization
- **[Pie Chart](./pie-chart/)** - Budget allocation breakdown
- **[Scatter Plot](./scatter-plot/)** - Correlation analysis

### 🗺️ Geographic Visualizations
- **[Choropleth Map](./choropleth-map/)** - Regional unemployment rates
- **[Point Map](./point-map/)** - Hospital locations
- **[Heat Map](./heat-map/)** - Population density

### 📋 Data Tables
- **[Basic Table](./basic-table/)** - Sortable and filterable data
- **[Pivot Table](./pivot-table/)** - Multi-dimensional analysis

### 🇷🇸 Serbian Data Examples
- **[Demographics](./serbian-demographics/)** - Population census data
- **[Economic Indicators](./economic-indicators/)** - GDP, inflation, unemployment
- **[Healthcare Statistics](./healthcare-stats/)** - Hospitals and medical staff
- **[Education Data](./education-data/)** - Schools and students

### 🎨 Customization Examples
- **[Custom Themes](./custom-themes/)** - Brand integration
- **[Responsive Design](./responsive-design/)** - Mobile-friendly charts
- **[Accessibility](./accessibility/)** - WCAG compliant visualizations

### 🔧 Advanced Examples
- **[Real-time Data](./real-time-data/)** - Live data updates
- **[Interactive Filters](./interactive-filters/)** - Dynamic chart filtering
- **[Export & Sharing](./export-sharing/)** - Multiple export formats
- **[Embedding](./embedding/)** - Integration with websites

## 🚀 Featured Examples

### 1. Serbian Population by Municipality

<InteractiveExample id="population-by-municipality" height="400">
  <template #default="{ data, config }">
    <BarChart :data="data" :config="config" />
  </template>
</InteractiveExample>

**What it shows**: Interactive bar chart displaying population data for all Serbian municipalities.

**Key features**:
- Cyrillic and Latin script support
- Hover tooltips with detailed information
- Sort by population size
- Export to PNG, SVG, PDF

**[View Full Example →](./serbian-demographics/)**

### 2. Economic Indicators Dashboard

<InteractiveExample id="economic-dashboard" height="500">
  <template #default="{ data, config }">
    <Dashboard :data="data" :config="config">
      <LineChart dataKey="gdp" />
      <LineChart dataKey="inflation" />
      <BarChart dataKey="unemployment" />
    </Dashboard>
  </template>
</InteractiveExample>

**What it shows**: Multi-series visualization of Serbia's economic performance.

**Key features**:
- Multiple chart types in one view
- Time series data from 2010-2023
- Interactive legend for series toggling
- Responsive layout

**[View Full Example →](./economic-indicators/)**

### 3. Regional Unemployment Map

<InteractiveExample id="unemployment-map" height="450">
  <template #default="{ data, config }">
    <ChoroplethMap :data="data" :config="config" />
  </template>
</InteractiveExample>

**What it shows**: Color-coded map of unemployment rates across Serbian districts.

**Key features**:
- Interactive Serbian district boundaries
- Color scale customization
- Regional statistics on hover
- Legend with quantile breaks

**[View Full Example →](./choropleth-map/)**

## 📱 Interactive CodeSandbox Examples

All examples are available as editable CodeSandbox demos:

### 🏃‍♂️ 5-Minute Tutorials

1. **[Quick Start Tutorial](https://codesandbox.io/s/vizualni-admin-quick-start)**
   - Basic bar chart setup
   - Data loading from CSV
   - Customization options

2. **[Serbian Data Integration](https://codesandbox.io/s/vizualni-admin-serbian-data)**
   - Connect to data.gov.rs API
   - Process real Serbian datasets
   - Handle character encoding

3. **[Custom Theme Creation](https://codesandbox.io/s/vizualni-admin-custom-theme)**
   - Create brand-consistent themes
   - Customize colors and fonts
   - Apply theme across charts

### 🎯 Complete Applications

1. **[Population Dashboard](https://codesandbox.io/s/vizualni-admin-population-dashboard)**
   - Multiple demographic charts
   - Interactive filters
   - Data export functionality

2. **[Economic Analysis Tool](https://codesandbox.io/s/vizualni-admin-economic-analysis)**
   - Time series analysis
   - Economic indicators comparison
   - Report generation

3. **[Healthcare Data Visualizer](https://codesandbox.io/s/vizualni-admin-healthcare)**
   - Hospital capacity mapping
   - Medical staff statistics
   - Regional health metrics

## 🔧 Example Structure

Each example follows a consistent structure:

```text
examples/
├── example-name/
│   ├── README.md              # Description and setup instructions
│   ├── demo/                  # Live demo files
│   │   ├── index.html         # Demo HTML
│   │   ├── style.css          # Demo styles
│   │   └── script.js          # Demo JavaScript
│   ├── code/                  # Source code examples
│   │   ├── basic.js           # Basic implementation
│   │   ├── advanced.ts        # Advanced TypeScript example
│   │   └── react.jsx          # React component example
│   ├── data/                  # Sample datasets
│   │   ├── population.csv     # Sample data
│   │   └── metadata.json      # Data description
│   └── sandbox/               # CodeSandbox template
│       ├── package.json
│       └── src/
```

## 📝 How to Use Examples

### 1. Clone and Run Locally

```bash
# Clone the repository
git clone https://github.com/acailic/vizualni-admin.git
cd vizualni-admin

# Install dependencies
yarn install

# Run examples
yarn examples:dev

# Open http://localhost:3000/examples
```

### 2. Copy Code Snippets

Each example includes copy-paste ready code snippets:

```typescript
// Import required components
import { BarChart, createDataGovRsClient } from '@acailic/vizualni-admin'

// Load data
const client = createDataGovRsClient()
const data = await client.getPopulationData()

// Create chart
const chart = new BarChart({
  data,
  x: 'municipality',
  y: 'population',
  title: 'Population by Municipality'
})

// Render
chart.render('#chart-container')
```

### 3. Use CodeSandbox Templates

1. Click on any CodeSandbox link
2. Fork the sandbox to your account
3. Modify the code
4. Share your customized version

### 4. Download Example Projects

Each example can be downloaded as a standalone project:

```bash
# Download specific example
npx create-vizualni-app my-app --example population-dashboard

# Download with custom data
npx create-vizualni-app my-app --example economic-analysis --data-source serbia-gdp.csv
```

## 🎨 Customization Guide

### Adapting Examples for Your Data

1. **Replace Data Source**
   ```typescript
   // Original: Serbian population data
   const serbianData = await client.getDataset('serbian-population-2023')

   // Your data: Replace with your dataset
   const myData = await fetch('https://your-api.com/data')
   ```

2. **Update Chart Configuration**
   ```typescript
   const chart = new BarChart({
     data: myData,
     x: 'your-category-field',
     y: 'your-value-field',
     title: 'Your Chart Title',
     colors: ['#your-brand-color', '#your-accent-color']
   })
   ```

3. **Add Custom Styling**
   ```css
   .my-chart-container {
     font-family: 'Your Brand Font', sans-serif;
     background: your-brand-color;
   }
   ```

### Multilingual Support

```typescript
// Serbian (Cyrillic)
const chartCyrl = new BarChart({
  title: 'Број становника по општинама',
  locale: 'sr-Cyrl'
})

// Serbian (Latin)
const chartLatn = new BarChart({
  title: 'Broj stanovnika po opštinama',
  locale: 'sr-Latn'
})

// English
const chartEn = new BarChart({
  title: 'Population by Municipality',
  locale: 'en'
})
```

## 🚀 Contributing Examples

We welcome community contributions! Add your own examples:

1. **Create Example Structure**
   ```bash
   mkdir examples/my-example
   cd examples/my-example
   ```

2. **Add Required Files**
   ```text
   README.md          # Description
   demo/index.html    # Live demo
   code/basic.js      # Basic implementation
   data/sample.csv    # Sample data
   ```

3. **Submit Pull Request**
   ```bash
   git add examples/my-example
   git commit -m "Add my-example: description"
   git push origin my-feature
   ```

### Example Submission Guidelines

- ✅ **Working demo** - Must run without errors
- ✅ **Sample data** - Include realistic sample data
- ✅ **Documentation** - Clear README with instructions
- ✅ **Multiple implementations** - Basic + advanced versions
- ✅ **Responsive design** - Works on all screen sizes
- ✅ **Accessibility** - WCAG compliant where applicable
- ✅ **Serbian context** - Relevant to Serbian data or use cases

## 📞 Get Help

- **📖 [Documentation](../)** - Complete API reference
- **💬 [Discussions](https://github.com/acailic/vizualni-admin/discussions)** - Community forum
- **🐛 [Issues](https://github.com/acailic/vizualni-admin/issues)** - Report problems
- **📧 [Email Support](mailto:support@vizualni-admin.rs)** - Direct assistance

---

*Explore the examples to get inspired and see what you can build with Vizualni Admin!*