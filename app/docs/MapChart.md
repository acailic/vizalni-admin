# MapChart Component

A powerful D3-based map component for geospatial visualization with support for
choropleth maps, point markers, zoom/pan interactions, and custom tooltips.

## Features

- **Choropleth Maps**: Color-coded regions based on data values
- **Point Markers**: Display cities, locations, or custom points
- **Interactive Tooltips**: Hover over regions or points for detailed
  information
- **Zoom & Pan**: Navigate around the map with smooth transitions
- **Multiple Projections**: Mercator and Equal Earth projections
- **Custom Color Scales**: Sequential, threshold-based, or custom palettes
- **Responsive Design**: Automatically adapts to container size
- **Accessibility**: Full ARIA support and keyboard navigation
- **TypeScript**: Full type safety with exported types

## Installation

The MapChart is part of the `@acailic/vizualni-admin/charts` package.

```bash
npm install @acailic/vizualni-admin
```

## Basic Usage

```tsx
import { MapChart } from "@acailic/vizualni-admin/charts";

function MyMap() {
  const geoData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Beograd",
          value: 2000000,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [20.0, 44.0],
              [21.0, 44.0],
              [21.0, 45.0],
              [20.0, 45.0],
              [20.0, 44.0],
            ],
          ],
        },
      },
    ],
  };

  return (
    <MapChart
      data={geoData}
      config={{ xAxis: "name", yAxis: "value" }}
      height={500}
    />
  );
}
```

## Data Format

### GeoJSON FeatureCollection

```typescript
interface MapData {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {
      name: string;
      value?: number;
      [key: string]: any;
    };
    geometry: GeoJSON.Geometry;
  }>;
}
```

### Point Data

```typescript
interface MapPoint {
  id: string;
  name: string;
  value?: number;
  coordinates: [number, number]; // [longitude, latitude]
  [key: string]: any;
}
```

## Configuration Options

### MapChartConfig

```typescript
interface MapChartConfig extends BaseChartConfig {
  /** Color scale for choropleth (sequential colors) */
  colorScale?: string[];
  /** Show legend */
  showLegend?: boolean;
  /** Map projection type */
  projection?: "mercator" | "equalEarth";
  /** Enable zoom and pan */
  zoomEnabled?: boolean;
  /** Initial center coordinates [longitude, latitude] */
  center?: [number, number];
  /** Initial scale */
  scale?: number;
  /** Show point markers */
  showPoints?: boolean;
  /** Point data array */
  pointData?: MapPoint[];
  /** Point marker size */
  pointSize?: number;
  /** Point color */
  pointColor?: string;
  /** Border color for regions */
  borderColor?: string;
  /** Border width */
  borderWidth?: number;
  /** Hover effect color */
  hoverColor?: string;
  /** Show region labels */
  showLabels?: boolean;
  /** Label property key */
  labelKey?: string;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Number of color scale buckets */
  buckets?: number;
}
```

## Examples

### 1. Basic Choropleth Map

```tsx
<MapChart
  data={geoData}
  config={{
    xAxis: "name",
    yAxis: "value",
    title: "Population by Region",
    colorScale: ["#f0f9ff", "#0ea5e9", "#0369a1"],
  }}
  height={500}
/>
```

### 2. Map with Point Markers

```tsx
const cities = [
  { id: "1", name: "Beograd", value: 1689125, coordinates: [20.4573, 44.7872] },
  { id: "2", name: "Novi Sad", value: 341625, coordinates: [19.8335, 45.2671] },
];

<MapChart
  data={[]}
  config={{
    xAxis: "name",
    yAxis: "value",
    showPoints: true,
    pointData: cities,
    pointSize: 8,
    pointColor: "#ef4444",
  }}
/>;
```

### 3. Combined Choropleth and Points

```tsx
<MapChart
  data={regionsData}
  config={{
    xAxis: "name",
    yAxis: "value",
    title: "Population Distribution with Major Cities",
    colorScale: ["#fff7ed", "#fed7aa", "#fb923c", "#f97316"],
    showPoints: true,
    pointData: cityPoints,
    pointSize: 6,
    pointColor: "#7c3aed",
    showLegend: true,
    zoomEnabled: true,
  }}
/>
```

### 4. Custom Color Scales

```tsx
// Blue theme
<MapChart
  data={geoData}
  config={{
    colorScale: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'],
  }}
/>

// Green theme
<MapChart
  data={geoData}
  config={{
    colorScale: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e'],
  }}
/>

// Purple theme
<MapChart
  data={geoData}
  config={{
    colorScale: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7'],
  }}
/>
```

### 5. Interactive Map with Click Handlers

```tsx
const handleRegionClick = (properties: any, index: number) => {
  console.log("Clicked region:", properties.name);
  alert(`You clicked on ${properties.name}!`);
};

<MapChart
  data={geoData}
  config={{ xAxis: "name", yAxis: "value" }}
  onDataPointClick={handleRegionClick}
/>;
```

### 6. Custom Tooltip

```tsx
const customTooltip = (properties: any) => (
  <div>
    <h3>{properties.name}</h3>
    <p>Population: {properties.value?.toLocaleString()}</p>
  </div>
);

<MapChart
  data={geoData}
  config={{ xAxis: "name", yAxis: "value" }}
  renderTooltip={customTooltip}
/>;
```

### 7. Equal Earth Projection

```tsx
<MapChart
  data={geoData}
  config={{
    xAxis: "name",
    yAxis: "value",
    projection: "equalEarth",
    title: "Equal Earth Projection",
  }}
/>
```

### 8. Map with Labels

```tsx
<MapChart
  data={geoData}
  config={{
    xAxis: "name",
    yAxis: "value",
    showLabels: true,
    labelKey: "name",
  }}
/>
```

### 9. Static Map (No Zoom/Tooltip)

```tsx
<MapChart
  data={geoData}
  config={{
    xAxis: "name",
    yAxis: "value",
    zoomEnabled: false,
  }}
  showTooltip={false}
  animated={false}
/>
```

### 10. Responsive Map with Custom Styling

```tsx
<MapChart
  data={geoData}
  config={{
    xAxis: "name",
    yAxis: "value",
    borderColor: "#fbbf24",
    borderWidth: 2,
  }}
  width="100%"
  height={400}
  className="my-custom-map"
  style={{ border: "2px solid #e5e7eb", borderRadius: "8px" }}
/>
```

## Props Reference

### MapChartProps

| Prop               | Type                                 | Default       | Description                         |
| ------------------ | ------------------------------------ | ------------- | ----------------------------------- |
| `data`             | `MapData \| MapFeature[]`            | _required_    | GeoJSON data or array of features   |
| `config`           | `MapChartConfig`                     | _required_    | Map configuration options           |
| `height`           | `number`                             | `500`         | Chart height in pixels              |
| `width`            | `number \| '100%'`                   | `'100%'`      | Chart width (responsive by default) |
| `locale`           | `'sr-Latn' \| 'sr-Cyrl' \| 'en'`     | `'sr-Latn'`   | Locale for number formatting        |
| `className`        | `string`                             | `''`          | Additional CSS class name           |
| `style`            | `React.CSSProperties`                | `{}`          | Additional inline styles            |
| `onDataPointClick` | `(data: any, index: number) => void` | `undefined`   | Click handler for regions/points    |
| `renderTooltip`    | `(data: any) => React.ReactNode`     | `undefined`   | Custom tooltip renderer             |
| `showTooltip`      | `boolean`                            | `true`        | Show tooltip on hover               |
| `animated`         | `boolean`                            | `true`        | Enable animations                   |
| `id`               | `string`                             | `'map-chart'` | Unique identifier for the chart     |
| `ariaLabel`        | `string`                             | `undefined`   | Accessibility label                 |
| `description`      | `string`                             | `undefined`   | Description for screen readers      |

## Accessibility

The MapChart component includes built-in accessibility features:

- **ARIA labels**: Automatically generated from title or custom `ariaLabel`
- **Screen reader support**: Optional `description` prop for detailed context
- **Keyboard navigation**: Full keyboard support for zoom controls
- **Semantic HTML**: Proper role and ARIA attribute usage

```tsx
<MapChart
  data={geoData}
  config={{ xAxis: "name", yAxis: "value", title: "Population Map" }}
  ariaLabel="Interactive map showing population distribution"
  description="A choropleth map displaying population data across Serbian regions with color coding from low to high values"
/>
```

## Performance Tips

1. **Limit features**: For large datasets, consider simplifying geometries
2. **Disable animations**: Set `animated={false}` for better performance with
   many features
3. **Use threshold scales**: Set `buckets` to reduce color calculations
4. **Optimize GeoJSON**: Remove unnecessary precision from coordinates

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Touch-enabled zoom/pan

## Dependencies

- `d3-geo`: ^3.1.1
- `d3-zoom`: Latest
- `d3-scale`: Latest
- `d3-array`: Latest
- `d3-selection`: Latest
- `react`: ^18.2.0

## TypeScript Support

All types are exported for use in your projects:

```typescript
import type {
  MapData,
  MapFeature,
  MapPoint,
  MapChartConfig,
  MapChartProps,
} from "@acailic/vizualni-admin/charts";
```

## License

BSD-3-Clause

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
