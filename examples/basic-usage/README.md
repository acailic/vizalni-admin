   git clone https://github.com/acailic/vizualni-admin.git
   cd vizualni-admin
   ```

2. Navigate to the basic usage example:
   ```bash
   cd examples/basic-usage
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Example

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. You should see a basic bar chart displaying sample data

## Code Walkthrough

### Project Structure

```
examples/basic-usage/
├── package.json          # Project dependencies and scripts
├── pages/
│   └── index.tsx         # Main page component
└── README.md             # This file
```

### Main Page (pages/index.tsx)

The main page demonstrates the core concepts:

```typescript
import { I18nProvider, parseLocaleString } from 'vizualni-admin';

// Set up internationalization
const locale = parseLocaleString('sr-RS') || defaultLocale;

// Wrap your app with I18nProvider
<I18nProvider locale={locale}>
  {/* Your visualization components go here */}
</I18nProvider>
```

Key components:
- **I18nProvider**: Provides Serbian language support
- **parseLocaleString**: Parses locale strings for proper formatting
- **defaultLocale**: Fallback locale if parsing fails

### Data Loading

The example loads sample data directly in the component:

```typescript
const sampleData = [
  { category: 'Kategorija A', value: 100 },
  { category: 'Kategorija B', value: 200 },
  // ... more data
];
```

In a real application, you would load data from data.gov.rs APIs using the provided client utilities.

### Chart Configuration

Basic chart setup using the library's components:

```typescript
<BarChart
  data={sampleData}
  xKey="category"
  yKey="value"
  title="Primer Vizualizacije"
/>
```

## Expected Output

![Basic Usage Screenshot](./screenshots/basic-chart.png)

*The screenshot shows a simple bar chart with Serbian labels, displaying sample data categories on the x-axis and values on the y-axis.*

## Customization Tips

### Changing the Language

To use a different language, modify the locale in `pages/index.tsx`:

```typescript
const locale = parseLocaleString('en-US') || defaultLocale;
```

### Adding More Data

Replace the sample data with real data from data.gov.rs:

```typescript
import { DataGovRsClient } from 'vizualni-admin';

const client = new DataGovRsClient();
const datasets = await client.searchDatasets('population');
```

### Styling the Chart

Customize chart appearance using theme configuration:

```typescript
<BarChart
  data={sampleData}
  xKey="category"
  yKey="value"
  theme={{
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    fontFamily: 'Arial, sans-serif'
  }}
/>
```

### Responsive Design

The charts are responsive by default. For custom breakpoints:

```typescript
<BarChart
  data={sampleData}
  responsive={{
    mobile: { height: 300 },
    tablet: { height: 400 },
    desktop: { height: 500 }
  }}
/>