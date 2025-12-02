# Serbian Data Visualization Components

This directory contains a comprehensive set of React components for visualizing Serbian open government data, with full support for both Latin and Cyrillic Serbian scripts.

## 🚀 Features

- **🌍 Serbian Language Support**: Complete support for both Latin (sr-Latn) and Cyrillic (sr-Cyrl) scripts
- **📊 Interactive Charts**: Multiple chart types using Recharts library
- **💰 Budget Visualization**: Government revenue and expense breakdowns
- **🌬️ Air Quality Monitoring**: PM10, PM2.5, and pollution level tracking
- **👥 Demographics Analysis**: Population data with projections
- **⚡ Energy Statistics**: Production, consumption, and renewable energy metrics
- **📱 Responsive Design**: Mobile-friendly layouts
- **♿ Accessibility**: WCAG AA compliant components
- **🔄 Real-time Updates**: Support for live data refresh

## 📁 File Structure

```
serbian/
├── README.md                    # This documentation
├── index.ts                     # Export file for all components
├── serbian-language-utils.ts    # Language utilities and translations
├── serbian-budget-chart.tsx     # Budget data visualization
├── serbian-air-quality-chart.tsx # Air quality monitoring
├── serbian-demographics-chart.tsx # Demographics and population
├── serbian-energy-chart.tsx     # Energy production and consumption
└── serbian-dashboard.tsx        # Main dashboard component
```

## 🛠️ Installation

The components use the following dependencies:

```bash
npm install recharts
npm install @radix-ui/react-tabs
npm install @radix-ui/react-select
npm install lucide-react
```

## 📖 Usage

### Basic Dashboard

```tsx
import { SerbianDashboard, SerbianLanguageVariant } from "@/components/serbian";

function App() {
  return (
    <SerbianDashboard
      initialLanguage="sr-Latn"
      showInteractiveFeatures={true}
      height={500}
      activeDataset="overview"
    />
  );
}
```

### Individual Chart Components

```tsx
import {
  SerbianBudgetChart,
  SerbianAirQualityChart,
  SerbianDemographicsChart,
  SerbianEnergyChart
} from "@/components/serbian";

function DataVisualization() {
  return (
    <div className="space-y-8">
      <SerbianBudgetChart
        language="sr-Latn"
        showInteractiveFeatures={true}
        height={400}
      />

      <SerbianAirQualityChart
        language="sr-Cyrl"
        showInteractiveFeatures={true}
        height={400}
      />
    </div>
  );
}
```

### Language Utilities

```tsx
import {
  getSerbianTranslation,
  formatSerbianNumber,
  formatSerbianCurrency,
  latinToCyrillic,
  SerbianLanguageVariant
} from "@/components/serbian";

function Example() {
  const language: SerbianLanguageVariant = "sr-Latn";

  // Get translations
  const budgetLabel = getSerbianTranslation('budget', language);

  // Format numbers
  const formattedNumber = formatSerbianNumber(1234567.89, language);

  // Format currency
  const formattedCurrency = formatSerbianCurrency(50000, language);

  // Convert scripts
  const cyrillicText = latinToCyrillic("Budžet Republike Srbije");

  return (
    <div>
      <p>{budgetLabel}: {formattedCurrency}</p>
      <p>{formattedNumber}</p>
      <p>{cyrillicText}</p>
    </div>
  );
}
```

## 🎨 Component Props

### SerbianDashboard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialLanguage` | `SerbianLanguageVariant` | `"sr-Latn"` | Initial language setting |
| `showInteractiveFeatures` | `boolean` | `true` | Enable interactive features |
| `height` | `number` | `400` | Chart height in pixels |
| `activeDataset` | `string` | `"overview"` | Initially selected dataset |

### Individual Chart Components

All chart components accept the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `SerbianLanguageVariant` | `"sr-Latn"` | Language for labels and text |
| `showInteractiveFeatures` | `boolean` | `true` | Enable interactive features |
| `height` | `number` | `400` | Chart height in pixels |

## 🌍 Language Support

### Supported Language Variants

- **`sr-Latn`**: Serbian Latin script
- **`sr-Cyrl`**: Serbian Cyrillic script
- **`en`**: English (fallback)

### Translations

Components use the `serbianTranslations` object for all text content:

```typescript
const serbianTranslations: SerbianTranslations = {
  budget: {
    "sr-Latn": "Budžet",
    "sr-Cyrl": "Буџет",
    en: "Budget"
  },
  // ... more translations
};
```

### Script Conversion

The `latinToCyrillic` function provides automatic script conversion:

```typescript
const latinText = "Kvalitet vazduha";
const cyrillicText = latinToCyrillic(latinText); // "Квалитет ваздуха"
```

## 📊 Data Sources

### Budget Data
- **Source**: data.gov.rs - Ministry of Finance
- **Content**: Revenue, expenses, ministry breakdowns
- **Update Frequency**: Monthly

### Air Quality Data
- **Source**: data.gov.rs - Environmental Protection Agency
- **Content**: PM10, PM2.5, pollution levels
- **Update Frequency**: Hourly/Daily

### Demographics Data
- **Source**: data.gov.rs - Statistical Office
- **Content**: Population census, projections
- **Update Frequency**: Annual

### Energy Data
- **Source**: data.gov.rs - Ministry of Mining and Energy
- **Content**: Production, consumption, renewable energy
- **Update Frequency**: Monthly

## 🎯 Chart Types

Each component includes multiple visualization types:

### SerbianBudgetChart
- **Overview**: Revenue vs Expenses comparison
- **Monthly Trends**: Time series analysis
- **Detailed Analysis**: Category breakdowns

### SerbianAirQualityChart
- **Overview**: PM10 trends with pollution levels
- **Location Comparison**: Multi-city comparisons
- **Detailed Analysis**: Pollutant correlations

### SerbianDemographicsChart
- **Overview**: Population trends and age structure
- **Regional Analysis**: Population by regions
- **Projections**: Future population scenarios
- **Detailed Analysis**: Gender and urban/rural breakdowns

### SerbianEnergyChart
- **Overview**: Monthly energy production
- **Renewable Energy**: Growth tracking
- **Consumption Analysis**: Sector-based consumption
- **Detailed Analysis**: Capacity and efficiency metrics

## 🔧 Customization

### Adding New Translations

```typescript
// In serbian-language-utils.ts
export const serbianTranslations: SerbianTranslations = {
  // Add new translation key
  newKey: {
    "sr-Latn": "Novi ključ",
    "sr-Cyrl": "Нови кључ",
    en: "New key"
  }
};
```

### Styling

Components use Tailwind CSS classes and can be customized:

```css
/* Custom colors for Serbian data */
.serbian-primary {
  background-color: #0c4a6e; /* Serbian blue */
}

.serbian-secondary {
  background-color: #dc2626; /* Serbian red */
}
```

### Chart Configuration

Charts use Recharts and can be extended:

```typescript
import { LineChart, Line, XAxis, YAxis } from "recharts";

// Custom chart configuration
const customConfig = {
  margin: { top: 20, right: 30, left: 20, bottom: 5 },
  colors: ['#0c4a6e', '#dc2626', '#16a34a']
};
```

## 🧪 Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { SerbianBudgetChart } from '@/components/serbian';

describe('SerbianBudgetChart', () => {
  it('renders budget chart with correct title', () => {
    render(<SerbianBudgetChart />);
    expect(screen.getByText('Budžet - Republika Srbija')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
import { render } from '@testing-library/react';
import { SerbianDashboard } from '@/components/serbian';

describe('SerbianDashboard', () => {
  it('renders all dataset components', () => {
    render(<SerbianDashboard />);
    // Test dashboard functionality
  });
});
```

## 📱 Performance

### Optimization Features

- **Lazy Loading**: Charts load data on demand
- **Memoization**: Expensive calculations are cached
- **Responsive Design**: Optimized for mobile devices
- **Bundle Splitting**: Components are code-split

### Bundle Size

The complete Serbian visualization bundle is approximately:

- **Runtime**: ~250KB gzipped
- **Individual components**: ~60KB gzipped each
- **Dependencies**: Recharts (~200KB gzipped)

## 🔄 Updates and Maintenance

### Data Updates

- **Automatic**: Components check for data updates
- **Manual**: Refresh button in dashboard
- **Cache**: Intelligent caching to reduce API calls

### Component Updates

- **Versioning**: Semantic versioning for releases
- **Backward Compatibility**: Maintained across major versions
- **Migration Guides**: Provided for breaking changes

## 🚀 Deployment

### Environment Variables

```bash
NEXT_PUBLIC_SERBIAN_DATA_API_URL=https://data.gov.rs/api
NEXT_PUBLIC_UPDATE_INTERVAL=300000
NEXT_PUBLIC_CACHE_DURATION=3600
```

### Build Configuration

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['recharts']
  }
};
```

## 🤝 Contributing

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/vizualni-admin.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React/TypeScript
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **data.gov.rs**: Serbian Open Data Portal
- **Recharts**: Chart visualization library
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/your-org/vizualni-admin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/vizualni-admin/discussions)
- **Email**: support@vizualni-admin.rs

---

*Built with ❤️ for the citizens of Serbia*