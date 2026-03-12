# Feature Request

## Title
Choropleth and symbol map layers with color scales and legends

## Problem
Feature 11 establishes the map foundation (GeoJSON, basemaps, geo-matching). This feature adds the data visualization layers: choropleths (filled regions), symbols (sized circles), and the legend/interaction system that makes maps analytically useful.

## Proposed behavior

### Choropleth layer
- Fill each administrative boundary with a color from a sequential or diverging color scale
- Color scale mapped to a selected measure (e.g., population, GDP, unemployment rate)
- Missing data regions shown in grey with diagonal hatch pattern
- Boundary strokes: thin dark lines for distinction
- Color scale types:
  - **Sequential** (one color, light to dark): for measures with natural zero (population, count)
  - **Diverging** (two colors around midpoint): for measures with meaningful center (% change, deviation)
  - **Categorical** (discrete colors): for categorical measures or classifications
- Classification methods:
  - Equal intervals
  - Quantiles (equal count per class)
  - Natural breaks (Jenks)
  - Custom breakpoints

### Symbol layer
- Place circles at centroid of each geographic entity
- Circle size mapped to one measure (proportional symbol map)
- Circle color optionally mapped to a second measure or category
- Minimum/maximum circle size configurable
- Symbols must not overlap excessively — adjust opacity or use force-directed displacement for dense areas (e.g., Belgrade municipalities)

### Map legend component
- For choropleth: continuous color bar with tick labels, or discrete color swatches with ranges
- For symbols: graduated circle sizes with value labels
- Legend position: bottom-left or bottom-right of map
- Legend title: measure name and unit
- Locale-aware number formatting in legend labels

### Map tooltip
- On hover: show boundary highlight + tooltip with:
  - Entity name (in current locale: Cyrillic, Latin, or English)
  - Measure value (formatted with locale-aware numbers)
  - Measure unit
  - Rank within dataset (optional: "15th of 174 municipalities")
- On mobile: tap to show tooltip (no hover)

### Map controls
- Zoom in/out buttons
- Reset view button (return to Serbia bounds)
- Layer toggle (if both choropleth and symbols are active)
- Fullscreen toggle
- Basemap switcher (streets / light / satellite — if Mapbox available)

### Color scale selection in configurator
When map chart type is selected in Feature 04 configurator:
- Color scale section shows:
  - Palette selector (sequential/diverging/categorical options)
  - Classification method selector
  - Number of classes (3-9)
  - Preview of how data distributes across classes
  - Option to set custom breakpoints

### D3-geo integration
For Leaflet fallback (no Mapbox), render choropleth with D3-geo:
- SVG overlay on Leaflet map
- `d3.geoMercator()` projection matching Leaflet's zoom/pan
- Synchronized zoom: D3 overlay redraws on Leaflet zoom events

## Affected areas
- `src/components/charts/map/` (extend from Feature 11)
  - `ChoroplethLayer.tsx` — filled boundary rendering
  - `SymbolLayer.tsx` — proportional symbol rendering
  - `MapLegend.tsx` (extend: support continuous and discrete legends)
  - `MapTooltip.tsx` (extend: richer tooltip content)
  - `MapControls.tsx` (new: zoom, reset, layer toggle)
  - `ColorScaleSelector.tsx` (new: configurator component for map colors)
- `src/lib/charts/color-scales.ts` (new: scale construction utilities)
  - `createSequentialScale(data, palette, classes)`
  - `createDivergingScale(data, palette, midpoint)`
  - `classifyData(values, method, classes)` — Jenks, quantiles, equal intervals
- `src/lib/charts/centroids.ts` (new: compute centroids from GeoJSON for symbol placement)
- `public/locales/*/common.json` (labels: "No data", "Rank", classification method names)

## Constraints
- Choropleth + basemap rendering must be smooth at 60fps during zoom/pan
- SVG choropleth layer (D3-geo fallback) must synchronize with Leaflet tile loading — no visual lag
- Color scales must be accessible: avoid red-green only palettes, provide sufficient contrast
- Legend must be readable at small sizes (mobile map takes full width)
- Data classification should happen once, not on every render — memoize scale construction
- Serbian municipality names in tooltips must respect the active locale setting

## Out of scope
- 3D extrusions (building height = value)
- Custom basemap styles
- WMS/WMTS external layer support (Swiss tool has this, defer for now)
- Point data maps (individual GPS coordinates)
- Animation over time (Feature 17)

## Acceptance criteria
- [ ] Choropleth renders municipalities with sequential color scale from a numeric measure
- [ ] Missing data regions shown in grey with visible pattern
- [ ] Diverging color scale works with auto-detected midpoint
- [ ] Quantile and equal interval classification produce correct breaks
- [ ] Symbol layer renders proportional circles at entity centroids
- [ ] Map legend shows color scale with formatted value labels
- [ ] Tooltip shows entity name, value, and unit on hover
- [ ] Zoom/reset/layer toggle controls work
- [ ] Color scale selector in configurator shows palette options and class count
- [ ] Choropleth works with both Mapbox and Leaflet (D3-geo fallback)
- [ ] All map labels and tooltips respect active locale
- [ ] Map rendering is smooth (no jank during zoom/pan)

## Prior art / references
- Swiss tool: `app/charts/map/chart-map.tsx` — choropleth and symbol layer rendering
- Swiss tool: `app/charts/map/map-legend.tsx` — map legend component
- Swiss tool: `app/charts/map/map-tooltip.tsx` — interactive tooltip
- Swiss tool: `app/charts/map/style-helpers.ts` — color scale helpers for maps
- D3 color scales: `d3-scale-chromatic` sequential and diverging schemes
