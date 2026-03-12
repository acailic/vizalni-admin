# Feature Request

## Title
Serbian geographic map visualizations with administrative boundaries

## Problem
Serbia's open data frequently references geographic entities — municipalities (opštine), districts (okruzi), regions, and statistical areas. Currently the app has Mapbox/Leaflet configured but no Serbian geographic data or map-based chart types. The Swiss tool has full map support with choropleth, symbol, and basemap layers via Deck.gl/Maplibre. We need equivalent Serbian-specific geographic visualization.

## Proposed behavior

### Serbian boundary data
Include GeoJSON boundary files for Serbian administrative divisions:

| Level | Count | Source |
|-------|-------|--------|
| Country outline | 1 | Natural Earth / OSM |
| Statistical regions (NUTS 2) | 5 | Šumadija i Zapadna Srbija, Južna i Istočna Srbija, Beogradski region, Vojvodina, Kosovo* |
| Districts (okruzi) | 29 | Serbian statistical office (RZS) |
| Municipalities (opštine/gradovi) | 174 | Serbian statistical office (RZS) |
| Settlements (naselja) | optional/future | Too granular for now |

*Kosovo boundaries: include with note about status per Serbian law.

### GeoJSON storage
- `public/geo/serbia-regions.geojson` — 5 statistical regions
- `public/geo/serbia-districts.geojson` — 29 districts
- `public/geo/serbia-municipalities.geojson` — 174 municipalities
- Each feature has properties: `{ id, name_sr_cyrl, name_sr_latn, name_en, code }`
- Geographic codes must match codes used in data.gov.rs datasets (RZS codes)

### Map chart type
Add `map` to the chart type registry (Feature 03):
- Available when data contains a geographic dimension (detected by column classifier)
- Geographic dimension detection: match column values against known municipality/district/region names or codes

### Map rendering
Using existing Mapbox GL + Leaflet stack:

**Basemap**: Mapbox streets/light/dark OR OpenStreetMap (Leaflet fallback if no Mapbox token)

**Data layers**:
1. **Choropleth**: Fill administrative boundaries with color scale mapped to a measure
2. **Symbol/bubble**: Place circles at centroids with size mapped to a measure
3. (Feature 12 will detail these further)

**Interaction**:
- Hover: highlight boundary, show tooltip with entity name + value
- Click: select entity, optionally filter other dashboard charts (Feature 07)
- Zoom: auto-fit to Serbia's bounds on load, allow free zoom/pan

### Geographic dimension matching (`src/lib/data/geo-matcher.ts`)
Match dataset column values to GeoJSON features:
```typescript
function matchGeoColumn(
  values: string[],
  geoLevel: 'region' | 'district' | 'municipality'
): GeoMatchResult

interface GeoMatchResult {
  matchRate: number           // 0-1
  matched: Map<string, string>  // dataValue → geoFeatureId
  unmatched: string[]          // values that couldn't be matched
}
```

Matching heuristics:
- Exact match on name (Cyrillic or Latin)
- Normalized match (lowercase, remove diacritics)
- Code match (if column contains RZS administrative codes)
- Fuzzy match (Levenshtein distance < 2) with confirmation

### Map configuration in configurator
When user selects map chart type:
- Select geographic level (region/district/municipality)
- Select which column maps to geography
- Select which measure to visualize
- Preview match rate: "Matched 165/174 municipalities (95%)"
- Unmatched values listed for manual review

## Affected areas
- `public/geo/` (new directory with GeoJSON files)
- `src/components/charts/map/` (new chart type directory)
  - `MapChart.tsx` — main map component
  - `MapChartConfig.ts` — Zod schema for map config
  - `MapTooltip.tsx` — hover tooltip
  - `MapLegend.tsx` — color scale legend
- `src/lib/data/geo-matcher.ts` (new: geographic dimension matching)
- `src/lib/charts/registry.ts` (register map chart type)
- `src/lib/data/classifier.ts` (extend: detect geographic dimensions)
- `public/locales/*/common.json` (map labels: "Region", "District", "Municipality", "No data", etc.)
- Serbian administrative division names in all three scripts (Cyrillic, Latin, English)

## Constraints
- GeoJSON files can be large (municipality boundaries: ~2-5MB). Lazy-load them.
- Use simplified boundaries (topojson or pre-simplified GeoJSON) for web performance
- Mapbox token is optional — fall back to Leaflet + OSM tiles if not configured
- Geographic codes from data.gov.rs may not be standardized — the matcher must be flexible
- Kosovo boundary display is politically sensitive — match official Serbian government mapping
- Map projection: Web Mercator (standard for web maps, what Mapbox/Leaflet use)

## Out of scope
- Street-level maps
- Point data (individual locations) — only administrative boundary areas
- 3D terrain or buildings
- Custom basemap styling
- Time-animated maps (that's Feature 17)

## Acceptance criteria
- [ ] GeoJSON files load for regions, districts, and municipalities with <1MB total (simplified)
- [ ] Each GeoJSON feature has name in three scripts and administrative code
- [ ] Map chart type appears in configurator when data has a geographic dimension
- [ ] Geo-matcher matches >90% of values for a typical data.gov.rs dataset with municipality data
- [ ] Choropleth rendering: boundaries filled with color scale from measure values
- [ ] Hover tooltip shows entity name + value in current locale
- [ ] Map auto-fits to Serbia's bounds on load
- [ ] Map works without Mapbox token (falls back to Leaflet + OSM)
- [ ] All map UI text translated in three locales
- [ ] GeoJSON files lazy-loaded (not in main bundle)

## Prior art / references
- Swiss tool: `app/charts/map/` — full map implementation with Maplibre + Deck.gl
- Swiss tool: `app/rdf/query-geo-shapes.ts` — geographic boundary loading
- Swiss tool: `app/charts/map/map-state.tsx` — map state management
- Serbian Statistical Office (RZS): administrative division boundaries and codes
- Natural Earth data: country outline
