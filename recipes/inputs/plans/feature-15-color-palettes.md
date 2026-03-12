# Feature Request

## Title
Color palette system with built-in palettes, Serbian government scheme, and custom user palettes

## Problem
Charts currently use default library colors. There's no systematic color palette management — no way to pick from curated palettes, enforce government branding, or save custom palettes. The Swiss tool has 20+ D3 palettes, Swiss Federal CI colors, and user-saved custom palettes. We need an equivalent system.

## Proposed behavior

### Built-in palette categories

**Serbian Government Official** (primary):
- `serbian-primary`: #0D4077 (government blue) → #4B90F5 (light blue), 5-7 steps
- `serbian-flag`: #C6363C (red), #0C4076 (blue), #FFFFFF (white) — for categorical data with few categories
- `serbian-neutral`: Government greys and muted tones for backgrounds and secondary data

**Sequential** (from d3-scale-chromatic):
- Blues, Greens, Oranges, Purples, Reds, Greys
- Good for: choropleth maps, ordered data, single-measure intensity

**Diverging** (from d3-scale-chromatic):
- RdBu (red-blue), BrBG, PiYG, PRGn, RdYlGn
- Good for: deviation from center, positive/negative values, comparison to average

**Categorical** (from d3-scale-chromatic):
- Category10, Set1, Set2, Set3, Tableau10, Dark2, Pastel1, Pastel2, Accent
- Good for: distinct categories, legend items, multi-series charts

### Palette registry (`src/lib/charts/palettes.ts`)
```typescript
interface ColorPalette {
  id: string
  name: TranslationKey
  type: 'sequential' | 'diverging' | 'categorical'
  colors: string[]  // hex values
  source: 'built-in' | 'government' | 'user'
}

const PALETTES: Record<string, ColorPalette> = { ... }

function getPaletteColors(paletteId: string, count: number): string[]
// For sequential/diverging: interpolate to count steps
// For categorical: return first count colors, cycle if needed
```

### Color palette selector component
Used in the configurator (Feature 04) customize step:
- Grid of palette swatches grouped by category
- Hover to see palette name and preview with current data
- Selected palette highlighted
- "Custom" option opens color picker

### Custom palette creation
- User can create a custom palette in the configurator or profile page
- Color picker: enter hex values or use a visual picker (use a lightweight color picker, e.g., react-colorful — ~2KB)
- Add/remove colors, reorder by drag
- Name the palette
- Save to database (Feature 13) associated with user account (Feature 14)
- Saved palettes appear in the palette selector alongside built-in options

### Accessibility considerations
- Each palette has a `colorblindSafe` flag
- Palette selector shows a warning icon for non-colorblind-safe palettes
- Provide at least 3 colorblind-safe options per category
- Test against protanopia, deuteranopia, tritanopia simulations

### Integration with chart types
- Line/area: stroke/fill colors from palette
- Bar/column: bar fill from palette
- Pie: segment fills from palette
- Scatterplot: dot fills from palette (or single color gradient)
- Map: choropleth color scale from sequential/diverging palette
- Table: no palette (uses theme colors for headers)

### Default palette logic
- If no palette selected: use Serbian Government Primary for government data
- Chart type hint: maps default to sequential, categorical data defaults to Category10
- If fewer data series than palette colors: use first N colors
- If more series than colors: cycle palette or interpolate additional steps

## Affected areas
- `src/lib/charts/palettes.ts` (new: palette registry and utilities)
- `src/components/configurator/ColorPaletteSelector.tsx` (new)
- `src/components/configurator/CustomPaletteEditor.tsx` (new)
- `src/components/charts/shared/` (update: use palette from config in all chart types)
- `src/types/chart-config.ts` (add `paletteId` and `customColors` fields)
- `src/app/api/user/palettes/` (new API routes for custom palette CRUD)
- `package.json` (add react-colorful for color picker)
- `public/locales/*/common.json` (palette names, category labels)

## Constraints
- d3-scale-chromatic is already available via D3 dependency — use it for built-in palettes
- Do not render color pickers on the server (client-only component)
- Palette colors must have sufficient contrast against both light and dark chart backgrounds
- Custom palette limit: 20 palettes per user (prevent abuse)
- Color values stored as hex strings (6 chars, no alpha — transparency handled separately)
- Serbian government colors are not negotiable for government-branded palettes

## Out of scope
- Per-series color override (e.g., "make this specific bar red")
- Gradient fills or textures
- Dynamic palette generation from data values
- Color extraction from images

## Acceptance criteria
- [ ] 15+ built-in palettes available (sequential, diverging, categorical)
- [ ] Serbian government palette exists with official colors
- [ ] Palette selector renders swatches grouped by category
- [ ] Selected palette applies to all chart elements
- [ ] Custom palette editor allows adding/removing/reordering colors
- [ ] Custom palettes save to database (with auth)
- [ ] Palette interpolation works: 5-color palette correctly expands to 8 steps
- [ ] Colorblind-safe palettes are marked
- [ ] Default palette logic works per chart type
- [ ] All palette names and labels translated in three locales

## Prior art / references
- Swiss tool: `app/palettes.ts` — palette definitions using d3-scale-chromatic
- Swiss tool: `app/utils/color-palette-utils.ts` — palette query and interpolation
- Swiss tool: `app/pages/api/user/color-palette.ts` — custom palette API
- d3-scale-chromatic: categorical, sequential, diverging color schemes
