## Feature: Choropleth and Symbol Map Layers (Enhancement)

### Goal
Enhance the existing map visualization system with improved accessibility, D3-geo fallback for Leaflet, categorical color scale support, custom breakpoints editor, and symbol collision avoidance for dense areas.

### Current State Assessment

The codebase already implements most of Feature 12's scope:

| Feature | Status | Location |
|---------|--------|----------|
| Choropleth layer with color scales | ✅ Implemented | `ChoroplethLayer.tsx` |
| Sequential/Diverging color palettes | ✅ Implemented | `color-scales.ts` |
| Quantile/Equal-Interval/Natural Breaks | ✅ Implemented | `color-scales.ts` |
| Symbol layer (proportional circles) | ✅ Implemented | `SymbolLayer.tsx` |
| Centroid calculation | ✅ Implemented | `centroids.ts` |
| Map legend (continuous + discrete) | ✅ Implemented | `MapLegend.tsx` |
| Map tooltip with locale support | ✅ Implemented | `MapTooltip.tsx` |
| Zoom/Reset/Fullscreen/Layer toggle | ✅ Implemented | `MapControls.tsx` |
| Color scale selector in configurator | ✅ Implemented | `ColorScaleSelector.tsx`, `CustomizeStep.tsx` |
| Map chart type in ChartRenderer | ✅ Implemented | `ChartRenderer.tsx`, `registry.ts` |
| Map options in types | ✅ Implemented | `chart-config.ts` |

### Missing/Incomplete Features

Based on my inspection, these items from the feature spec need implementation or enhancement:

1. **Categorical color scale support** — Types and palettes exist but no categorical palette definitions
2. **Custom breakpoints editor** — Type exists (`customBreaks`) but no UI to set them
3. **D3-geo fallback for Leaflet** — Spec mentions SVG overlay with synchronized zoom, not implemented
4. **Symbol collision avoidance** — Spec mentions force-directed displacement for dense areas (Belgrade)
5. **Accessibility improvements** — Keyboard navigation for tooltips on mobile
6. **Translation keys in locale files** — Map labels are hardcoded in components, not in translation JSONs

### Affected files

| File | Change type | Description |
|------|-------------|-------------|
| `src/lib/charts/color-scales.ts` | modify | Add categorical palette definitions |
| `src/components/charts/map/ColorScaleSelector.tsx` | modify | Add custom breakpoint editor UI |
| `src/components/charts/map/SymbolLayer.tsx` | modify | Add collision avoidance algorithm |
| `src/components/charts/map/D3GeoOverlay.tsx` | **new** | D3-geo SVG overlay for Leaflet fallback |
| `src/components/charts/map/MapChart.tsx` | modify | Integrate D3GeoOverlay, mobile touch handling |
| `src/components/charts/map/MapTooltip.tsx` | modify | Add mobile tap-to-show support |
| `src/locales/en.json` | modify | Add map visualization translation keys |
| `src/locales/sr-cyr.json` | modify | Add map visualization translation keys |
| `src/locales/sr-lat.json` | modify | Add map visualization translation keys |
| `tests/unit/lib/charts/color-scales.test.ts` | **new** | Unit tests for classification and categorical palettes |
| `tests/unit/lib/charts/centroids.test.ts` | **new** | Unit tests for centroid calculations |
| `tests/unit/components/map/MapLegend.test.tsx` | **new** | Component tests for legend |
| `tests/e2e/map-visualization.spec.ts` | **new** | E2E tests for map interactions |

### Implementation steps

1. **Add categorical color palettes** — Extend `color-scales.ts` with categorical palette definitions (e.g., `category10`, `accent`, `paired`). Add `getPalettesByType().categorical` entries. Validate by updating type definitions and checking `getPaletteInfo()`.

2. **Add translation keys for map labels** — Move hardcoded labels from `MapLegend.tsx`, `MapTooltip.tsx`, `MapControls.tsx`, `ColorScaleSelector.tsx` into the three locale JSON files under a new `maps` namespace. Validate by removing hardcoded strings and confirming translations load.

3. **Add custom breakpoints editor UI** — Extend `ColorScaleSelector.tsx` with breakpoint input fields when `classificationMethod === 'custom'`. Add validation for ascending order. Validate by entering custom breaks and verifying choropleth renders correctly.

4. **Create D3-geo overlay component** — New file `D3GeoOverlay.tsx` that renders choropleth as SVG on Leaflet using `d3.geoMercator()`. Synchronize with Leaflet zoom/pan via `zoomend` events. Validate by testing with Mapbox token unavailable.

5. **Add symbol collision avoidance** — Implement simple force-directed displacement in `SymbolLayer.tsx` for overlapping circles. Use a grid-based spatial index for performance. Validate by testing Belgrade municipalities view.

6. **Improve mobile tooltip support** — Extend `MapTooltip.tsx` to show on tap instead of hover for touch devices. Add touch event handlers in `ChoroplethLayer.tsx` and `SymbolLayer.tsx`. Validate on mobile viewport.

7. **Add unit tests for color-scales** — Test `classifyData()` with edge cases (empty, single value, all same). Test `getColorForValue()` boundary conditions. Test categorical palette retrieval.

8. **Add unit tests for centroids** — Test polygon centroid calculation, multipolygon handling, degenerate geometry fallbacks.

9. **Add component tests for MapLegend** — Test rendering with continuous/discrete scales, symbol legend, locale formatting.

10. **Add E2E tests for map interactions** — Playwright tests for zoom, layer toggle, tooltip display, locale switching on a map chart.

### New translation keys

| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `maps.legend` | Легенда | Legenda | Legend |
| `maps.noData` | Нема података | Nema podataka | No data |
| `maps.rank` | Ранг | Rang | Rank |
| `maps.of` | од | od | of |
| `maps.code` | Шифра | Šifra | Code |
| `maps.zoomIn` | Увећај | Uvećaj | Zoom in |
| `maps.zoomOut` | Умањи | Umanji | Zoom out |
| `maps.resetView` | Ресетуј поглед | Resetuj pogled | Reset view |
| `maps.fullscreen` | Пун екран | Pun ekran | Fullscreen |
| `maps.layers` | Слојеви | Slojevi | Layers |
| `maps.choropleth` | Боје области | Boje oblasti | Area colors |
| `maps.symbols` | Симболи | Simboli | Symbols |
| `maps.basemap` | Позадинска мапа | Pozadinska mapa | Basemap |
| `maps.colorPalette` | Палета боја | Paleta boja | Color palette |
| `maps.scaleType` | Тип скале | Tip skale | Scale type |
| `maps.sequential` | Секвенцијална | Sekvencijalna | Sequential |
| `maps.diverging` | Дивергентна | Divergentna | Diverging |
| `maps.categorical` | Категоријска | Kategorijska | Categorical |
| `maps.classificationMethod` | Метод класификације | Metod klasifikacije | Classification method |
| `maps.equalIntervals` | Једнаки интервали | Jednaki intervali | Equal intervals |
| `maps.quantiles` | Квантили | Kvantili | Quantiles |
| `maps.naturalBreaks` | Природне границе | Prirodne granice | Natural breaks |
| `maps.custom` | Прилагођено | Prilagođeno | Custom |
| `maps.classCount` | Број класа | Broj klasa | Class count |
| `maps.preview` | Преглед | Pregled | Preview |
| `maps.histogram` | Хистограм | Histogram | Histogram |
| `maps.symbolSize` | Величина симбола | Veličina simbola | Symbol size |
| `maps.symbolOpacity` | Непрозирност симбола | Neprovidnost simbola | Symbol opacity |
| `maps.missingDataPattern` | Прикажи шаблон за недостајуће | Prikaži šablon za nedostajuće | Show missing data pattern |
| `maps.customBreakpoints` | Прилагођене тачке прелома | Prilagođene tačke preloma | Custom breakpoints |
| `maps.min` | Мин | Min | Min |
| `maps.max` | Макс | Max | Max |

### Test plan

- **Unit:**
  - `classifyData()` with empty array, single value, identical values, negative values
  - `equalIntervals()`, `quantiles()`, `naturalBreaks()` algorithms produce correct breaks
  - `getColorForValue()` returns correct color for edge and mid values
  - `geometryCentroid()` for Point, Polygon, MultiPolygon, LineString, degenerate geometries
  - `calculateCentroids()` produces correct Map of feature ID → centroid

- **Component:**
  - `MapLegend` renders continuous gradient with tick labels
  - `MapLegend` renders discrete color swatches with ranges
  - `MapLegend` renders symbol size legend
  - `MapLegend` formats numbers per locale
  - `ColorScaleSelector` changes palette and updates preview
  - `MapControls` zoom in/out/reset buttons call correct handlers

- **E2E:**
  - Navigate to a map chart page, verify choropleth renders
  - Click on a region, verify tooltip shows correct locale name
  - Toggle layer visibility, verify choropleth/symbols hide/show
  - Switch locale, verify all map labels update
  - Test map on mobile viewport, verify tap-to-tooltip works

### Risks and edge cases

- **D3-geo + Leaflet synchronization lag** — If zoom events fire rapidly, SVG redraw may lag behind tiles. Mitigation: debounce redraw events, use `requestAnimationFrame`.
- **Symbol overlap in Belgrade** — 17 municipalities in small area may still overlap even with collision avoidance. Mitigation: add `minZoom` threshold below which symbols hide.
- **Natural breaks algorithm performance** — Jenks algorithm is O(n²) for large datasets. Mitigation: cap classification at reasonable feature counts (~200), use sampling if needed.
- **Missing GeoJSON files** — `GEO_JSON_PATHS` references files in `/public/geo/`. If missing, map fails silently. Mitigation: add error boundary with clear error message.
- **Categorical palette color count** — If data has more categories than palette colors, colors repeat. Mitigation: warn in console, consider generating distinct colors.
- **Custom breakpoint validation** — User could enter non-ascending values or values outside data range. Mitigation: validate and show error message.
- **Locale fallback** — If a translation key is missing in a locale, should fall back to English. Mitigation: use i18next fallback mechanism.

### Open questions

1. **D3-geo fallback priority** — Should D3GeoOverlay be the default for Leaflet, or only when Mapbox is unavailable? Currently Mapbox is not implemented (using OSM tiles). Should we prioritize D3-geo implementation?

2. **Symbol collision avoidance aggressiveness** — How much displacement is acceptable before symbols appear too far from their true centroids? Needs UX input.

3. **Categorical palette source** — Should we use D3's built-in categorical schemes (`d3.schemeCategory10`) or define our own for government branding consistency?

4. **Basemap switcher visibility** — The spec mentions basemap switcher (streets/light/satellite) but Mapbox isn't configured. Should we implement with free tile sources only (OSM, CartoDB)?

5. **Mapchart in configurator preview** — The ColorScaleSelector shows a histogram preview. Should we also show a mini-map preview in the configurator?

### Estimated complexity

**Small** — The core infrastructure (Feature 11 + partial Feature 12) is already implemented. This enhancement adds categorical palettes, custom breakpoint UI, D3-geo fallback, mobile touch support, collision avoidance, and tests. Each step is self-contained and independently testable. The main risk is D3-geo synchronization, but that's an optional enhancement for the Leaflet fallback path.
