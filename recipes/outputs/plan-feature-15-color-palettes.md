## Feature: Color Palette System

### Goal
Implement a systematic color palette management system with Serbian government branding, built-in D3 palettes, and user-customizable palettes for all chart visualizations.

### Affected files
| File | Change type | Description |
|------|-------------|-------------|
| `src/lib/charts/palettes.ts` | **new** | Palette registry, interpolation utilities, built-in palette definitions |
| `src/lib/charts/color-scales.ts` | modify | Refactor to use palette registry; keep classification logic |
| `src/components/charts/shared/chart-data.ts` | modify | Update `getChartColors()` to resolve palette from registry |
| `src/components/configurator/ColorPaletteSelector.tsx` | **new** | Palette selection UI with categorized swatches |
| `src/components/configurator/CustomPaletteEditor.tsx` | **new** | Custom palette creation/editing with color picker |
| `src/components/configurator/CustomizeStep.tsx` | modify | Replace inline palette selection with ColorPaletteSelector |
| `src/types/chart-config.ts` | modify | Add `PaletteType`, extend `MapPalette`, add palette-related types |
| `src/types/persistence.ts` | modify | Add `CustomPalette`, `CreatePaletteInput`, `UpdatePaletteInput` |
| `prisma/schema.prisma` | modify | Add `CustomPalette` model linked to User |
| `src/lib/db/palettes.ts` | **new** | Database CRUD operations for custom palettes |
| `src/lib/db/index.ts` | modify | Re-export palette functions |
| `src/app/api/user/palettes/route.ts` | **new** | GET list, POST create custom palettes |
| `src/app/api/user/palettes/[id]/route.ts` | **new** | GET, PUT, DELETE single palette |
| `package.json` | modify | Add `react-colorful` dependency |
| `public/locales/sr-Cyrl/common.json` | modify | Add palette translations |
| `public/locales/sr-Latn/common.json` | modify | Add palette translations |
| `public/locales/en/common.json` | modify | Add palette translations |

### Implementation steps

**1. Add dependency and types** — Foundation layer
- Add `react-colorful` to `package.json`
- Extend `src/types/chart-config.ts`:
  - Add `PaletteType = 'sequential' | 'diverging' | 'categorical'`
  - Add `ColorPalette` interface (id, name, type, colors, source, colorblindSafe)
  - `ChartOptions` already has `paletteId` and `customColors` — ensure correctly typed
- Extend `src/types/persistence.ts` with `CustomPalette` interface
- **Validate**: Types compile, no circular dependencies

**2. Create palette registry** — Core palette logic
- Create `src/lib/charts/palettes.ts`:
  - Define `ColorPalette` interface
  - Implement Serbian government palettes (serbian-primary, serbian-flag, serbian-neutral)
  - Import and wrap d3-scale-chromatic schemes (Blues, Greens, Category10, etc.)
  - Implement `getPaletteColors(paletteId, count)` with interpolation
  - Implement `getBuiltInPalettes()` returning all palettes by category
  - Add `colorblindSafe` metadata to each palette
- **Validate**: Unit tests for interpolation (5-color → 8-step), palette retrieval

**3. Add database model and CRUD** — Persistence layer
- Add `CustomPalette` model to `prisma/schema.prisma`:
  - id, name, colors (JSON), userId, createdAt, updatedAt
  - Relation to User with cascade delete
  - Unique constraint on (userId, name)
- Run `prisma migrate dev`
- Create `src/lib/db/palettes.ts` with:
  - `createPalette(userId, input)`
  - `getPaletteById(id)`
  - `listUserPalettes(userId, pagination)`
  - `updatePalette(id, input)`
  - `deletePalette(id)`
  - 20 palette limit per user enforcement
- Update `src/lib/db/index.ts` to re-export
- **Validate**: CRUD operations work, limit enforced

**4. Build API routes** — API layer
- Create `src/app/api/user/palettes/route.ts`:
  - GET: list user's custom palettes (requires auth)
  - POST: create new palette (validate with Zod, check limit)
- Create `src/app/api/user/palettes/[id]/route.ts`:
  - GET: single palette details
  - PUT: update palette (owner only)
  - DELETE: delete palette (owner only)
- Add authentication check using NextAuth session
- **Validate**: API responds correctly, auth enforced, validation works

**5. Update chart color resolution** — Integration hook
- Modify `src/components/charts/shared/chart-data.ts`:
  - Import palette registry
  - Update `getChartColors(config)` to:
    1. Check `config.options.customColors` → return if present
    2. Check `config.options.paletteId` → resolve from registry
    3. Fallback to Serbian government primary palette
- **Validate**: Existing charts still render, palette selection applies

**6. Build ColorPaletteSelector component** — UI layer
- Create `src/components/configurator/ColorPaletteSelector.tsx`:
  - Client component (uses state)
  - Props: `selectedId`, `onChange`, `locale`
  - Group palettes by category (Government, Sequential, Diverging, Categorical)
  - Render swatch grid with hover preview
  - Show colorblind-safe indicator
  - "Custom" button to open editor
  - Load user's custom palettes via SWR
- **Validate**: Renders all categories, selection works, custom palettes appear

**7. Build CustomPaletteEditor component** — UI layer
- Create `src/components/configurator/CustomPaletteEditor.tsx`:
  - Client component with `'use client'`
  - Use `react-colorful` for color picking
  - Add/remove color slots (min 2, max 12)
  - Drag-to-reorder (use native drag or simple up/down buttons)
  - Name input field
  - Save/Cancel buttons
  - Call API on save
- **Validate**: Color picker works, save persists, validation shows errors

**8. Integrate into CustomizeStep** — Wire it up
- Modify `src/components/configurator/CustomizeStep.tsx`:
  - Remove inline `colorPalettes` array (lines 45-49)
  - Import and render `ColorPaletteSelector`
  - Pass current `paletteId` from config.options
  - Handle `onChange` to update config
  - Add "Create Custom Palette" button that opens editor in dialog
- **Validate**: Palette selection updates chart preview immediately

**9. Add translations** — i18n
- Add to all three `public/locales/*/common.json`:
  - Palette category labels
  - Palette names (government, sequential, diverging, categorical)
  - Colorblind-safe indicator text
  - Editor labels (add color, remove, save, cancel, name placeholder)
  - Error messages (limit reached, invalid colors)
- **Validate**: All three locales have matching keys

**10. Write tests** — Quality assurance
- Unit tests in `tests/unit/lib/charts/palettes.test.ts`:
  - Palette retrieval
  - Interpolation (sequential/diverging expand correctly)
  - Cycling (categorical repeats when exhausted)
- Component tests in `tests/unit/components/configurator/ColorPaletteSelector.test.tsx`:
  - Renders categories
  - Selection triggers callback
  - Custom palettes display
- E2E test in `tests/e2e/palette-selection.spec.ts`:
  - Create chart → customize → select palette → verify colors
- **Validate**: Tests pass

### New translation keys
| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `palettes.title` | Палете боја | Palete boja | Color Palettes |
| `palettes.categories.government` | Званичне државне | Zvanične državne | Official Government |
| `palettes.categories.sequential` | Секвенцијалне | Sekvencijalne | Sequential |
| `palettes.categories.diverging` | Дивергентне | Divergentne | Diverging |
| `palettes.categories.categorical` | Категоријске | Kategorijske | Categorical |
| `palettes.categories.custom` | Прилагођене | Prilagođene | Custom |
| `palettes.serbianPrimary` | Српска примарна | Srpska primarna | Serbian Primary |
| `palettes.serbianFlag` | Српска застава | Srpska zastava | Serbian Flag |
| `palettes.serbianNeutral` | Српска неутрална | Srpska neutralna | Serbian Neutral |
| `palettes.colorblindSafe` | Безбедно за дальтонисте | Bezbedno za daltoniste | Colorblind Safe |
| `palettes.editor.title` | Направи палету | Napravi paletu | Create Palette |
| `palettes.editor.editTitle` | Уреди палету | Uredi paletu | Edit Palette |
| `palettes.editor.namePlaceholder` | Назив палете | Naziv palete | Palette name |
| `palettes.editor.addColor` | Додај боју | Dodaj boju | Add Color |
| `palettes.editor.removeColor` | Уклони боју | Ukloni boju | Remove Color |
| `palettes.editor.save` | Сачувај | Sačuvaj | Save |
| `palettes.editor.cancel` | Откажи | Otkaži | Cancel |
| `palettes.errors.limitReached` | Достигнут лимит од 20 палета | Dostignut limit od 20 paleta | Limit of 20 palettes reached |
| `palettes.errors.invalidColor` | Неважећа боја | Nevazeća boja | Invalid color |
| `palettes.errors.minColors` | Потребне најмање 2 боје | Potrebne najmanje 2 boje | At least 2 colors required |

### Test plan
- **Unit**: 
  - Palette registry: `getPaletteColors()` returns correct count, interpolation accurate
  - Color cycling for categorical palettes
  - Database CRUD with limit enforcement
- **Component**: 
  - ColorPaletteSelector: renders all categories, selection works, custom palettes load
  - CustomPaletteEditor: color picker updates state, save triggers API, validation shows errors
- **E2E**: 
  - Full flow: create chart → open customize → select palette → verify preview updates
  - Custom palette: create → save → select → verify appears in selector
  - Auth: unauthenticated user sees built-in palettes only

### Risks and edge cases
- **D3 bundle size** — d3-scale-chromatic is ~30KB. Mitigation: Already bundled with D3, lazy-load palette selector if needed.
- **Hydration mismatch** — Color picker must only render client-side. Mitigation: Use dynamic import with `ssr: false` for CustomPaletteEditor.
- **Palette color count mismatch** — Chart has 10 series, palette has 5 colors. Mitigation: Implement interpolation for sequential/diverging, cycling for categorical.
- **User deletes in-use palette** — Chart references deleted palette. Mitigation: Fallback to default palette, show warning toast.
- **Color contrast** — Some palettes may not work on dark backgrounds. Mitigation: Standard palettes are designed for light backgrounds; document limitation.
- **Rate limiting** — User spams palette creation. Mitigation: 20 palette per user limit, API rate limiting.

### Open questions
- Should we allow anonymous users to create temporary custom palettes (stored in localStorage)? Feature spec says "associated with user account" — assume auth required for persistence.
- Should palette interpolation use D3's built-in interpolators or custom logic? Assume D3 interpolators for consistency with Swiss tool.

### Estimated complexity
**Medium** — The feature involves multiple layers (types, database, API, UI components) but follows established patterns in the codebase. No external service integrations, D3 already available, Prisma migrations are straightforward. The main complexity is coordinating the palette selection across all chart types and ensuring the color picker is properly isolated as a client component.
