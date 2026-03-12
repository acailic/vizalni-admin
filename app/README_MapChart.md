# MapChart Component - Quick Start

A production-ready D3-based map component for geospatial visualization in React
applications.

## Quick Start

```tsx
import { MapChart } from "@acailic/vizualni-admin/charts";

<MapChart
  data={{
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Region", value: 100 },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [20, 44],
              [21, 44],
              [21, 45],
              [20, 45],
              [20, 44],
            ],
          ],
        },
      },
    ],
  }}
  config={{ xAxis: "name", yAxis: "value" }}
  height={500}
/>;
```

## What's Included

### Core Features

- ✅ Choropleth maps with color-coded regions
- ✅ Point markers for cities/locations
- ✅ Interactive tooltips on hover
- ✅ Zoom and pan support
- ✅ Multiple map projections (Mercator, Equal Earth)
- ✅ Custom color scales
- ✅ Region labels
- ✅ Responsive design
- ✅ Accessibility support (ARIA)
- ✅ TypeScript types

### Visual Features

- Smooth animations
- Professional color palettes
- Customizable borders and styles
- Legend with gradient bar
- Hover effects
- Zoom controls

## Installation

```bash
npm install @acailic/vizualni-admin
```

## Common Use Cases

### 1. Population Map

```tsx
<MapChart
  data={serbiaRegions}
  config={{
    xAxis: "name",
    yAxis: "population",
    title: "Population by Region",
    colorScale: ["#f0f9ff", "#0ea5e9", "#0369a1"],
  }}
  height={500}
/>
```

### 2. City Markers

```tsx
<MapChart
  data={[]}
  config={{
    xAxis: "name",
    yAxis: "population",
    showPoints: true,
    pointData: cities,
    pointColor: "#ef4444",
  }}
/>
```

### 3. Combined Visualization

```tsx
<MapChart
  data={regions}
  config={{
    xAxis: "name",
    yAxis: "value",
    colorScale: ["#fff7ed", "#fed7aa", "#fb923c", "#f97316"],
    showPoints: true,
    pointData: majorCities,
    pointSize: 6,
    zoomEnabled: true,
  }}
/>
```

## API Reference

### Required Props

- `data`: MapData or MapFeature[] - GeoJSON data
- `config`: MapChartConfig - Configuration options

### Common Optional Props

- `height`: number (default: 500)
- `width`: number | '100%' (default: '100%')
- `onDataPointClick`: (data, index) => void
- `renderTooltip`: (data) => ReactNode
- `showTooltip`: boolean (default: true)
- `animated`: boolean (default: true)

### Config Options

- `colorScale`: string[] - Custom color palette
- `showLegend`: boolean - Show color legend
- `projection`: 'mercator' | 'equalEarth'
- `zoomEnabled`: boolean
- `showPoints`: boolean
- `pointData`: MapPoint[]
- `showLabels`: boolean
- `buckets`: number - Color scale buckets

## Data Format

### GeoJSON Regions

```typescript
{
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: string,
        value: number,
        // ... custom properties
      },
      geometry: GeoJSON.Geometry
    }
  ]
}
```

### Point Data

```typescript
[
  {
    id: string,
    name: string,
    value: number,
    coordinates: [longitude, latitude],
  },
];
```

## Color Palettes

Pre-defined professional palettes:

- Blue: Light blues to dark blue
- Green: Light greens to dark green
- Purple: Light purples to dark purple
- Orange: Light oranges to dark orange
- Red: Light reds to dark red

## Examples Directory

See `/examples/MapChart.example.tsx` for 10+ working examples.

## Documentation

Full documentation: `/docs/MapChart.md`

## Tests

Run tests:

```bash
npm test -- tests/exports/MapChart.integration.test.tsx
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Touch-enabled

## License

BSD-3-Clause

## Support

For issues, questions, or contributions, please visit the GitHub repository.
