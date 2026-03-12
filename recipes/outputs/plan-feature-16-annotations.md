## Feature: Chart Annotations and Reference Lines

### Goal
Enable analysts to add reference lines (thresholds, averages) and annotations (callouts, highlights) to charts to provide context and tell stories with data.

### Affected files
| File | Change type | Description |
|------|-------------|-------------|
| `src/types/chart-config.ts` | modify | Add Zod schemas for `ReferenceLine` and `ChartAnnotation` validation |
| `src/components/charts/line/LineChart.tsx` | modify | Integrate `ReferenceLinesLayer` and `AnnotationsLayer` using Recharts `<ReferenceLine>` |
| `src/components/charts/bar/BarChart.tsx` | modify | Integrate reference lines on X-axis (vertical bars) |
| `src/components/charts/column/ColumnChart.tsx` | modify | Integrate reference lines on Y-axis |
| `src/components/charts/area/AreaChart.tsx` | modify | Integrate annotation layers |
| `src/components/charts/scatterplot/ScatterplotChart.tsx` | modify | Add custom SVG annotation layer overlay |
| `src/components/charts/combo/ComboChart.tsx` | modify | Integrate annotation layers |
| `src/components/configurator/AnnotationEditor.tsx` | new | UI for adding/editing/removing reference lines and annotations |
| `src/components/configurator/CustomizeStep.tsx` | modify | Add "Annotations" section after chart-specific options |
| `src/stores/configurator.ts` | modify | Add `referenceLines` and `annotations` to config update helpers |
| `tests/unit/charts/annotations.test.tsx` | new | Unit tests for annotation rendering logic |
| `tests/components/AnnotationEditor.test.tsx` | new | Component tests for editor interactions |
| `tests/e2e/annotations.spec.ts` | new | E2E test for full annotation workflow |

### Implementation steps

1. **Add Zod validation schemas** — Extend `chart-config.ts` with `referenceLineSchema` and `chartAnnotationSchema`. Add to existing chart config schemas. Validate id uniqueness, valid style enums, and position constraints. *Validate: tests pass, invalid configs rejected.*

2. **Add annotation helpers to configurator store** — Add `addReferenceLine`, `updateReferenceLine`, `removeReferenceLine`, `addAnnotation`, `updateAnnotation`, `removeAnnotation` actions to `useConfiguratorStore`. *Validate: store updates correctly, isDirty flag set.*

3. **Integrate annotations into LineChart** — Use Recharts' built-in `<ReferenceLine>` component for reference lines. Add annotations via custom SVG layer or `<ReferenceDot>`/`<ReferenceArea>`. Pass `config.referenceLines` and `config.annotations` from props. *Validate: reference lines render at correct values, annotations appear.*

4. **Integrate annotations into ColumnChart** — Add Y-axis reference lines using Recharts `<ReferenceLine y={value}>`. Horizontal lines work directly. *Validate: horizontal threshold lines render correctly.*

5. **Integrate annotations into BarChart** — Add X-axis reference lines using Recharts `<ReferenceLine x={value}>`. Vertical lines for horizontal bar charts. *Validate: vertical threshold lines render correctly.*

6. **Integrate annotations into AreaChart** — Same pattern as LineChart. Support range annotations as shaded regions via `<ReferenceArea>`. *Validate: reference lines and shaded regions render.*

7. **Integrate annotations into ScatterplotChart** — This chart uses custom D3 SVG, not Recharts. Overlay annotation SVG group after data points. Compute pixel positions using existing `xScale`/`yScale`. Import and use `ReferenceLinesLayer` and `AnnotationsLayer` from `./shared/annotations/`. *Validate: annotations position correctly relative to data.*

8. **Integrate annotations into ComboChart** — Follow LineChart pattern with Recharts `<ReferenceLine>`. *Validate: annotations render with combo visualization.*

9. **Create AnnotationEditor component** — New file with two collapsible sections: "Reference Lines" and "Annotations". Each has:
   - Add button (opens inline form)
   - List of existing items with edit/delete buttons
   - Form fields: axis, value, label, style, color, position (for reference lines); type, coordinates, text, style (for annotations)
   - Validation: value within data range, required fields
   - Use existing translation keys from `public/locales/*/common.json` under `annotations.*`
   *Validate: can add/edit/delete, validation errors shown.*

10. **Add AnnotationEditor to CustomizeStep** — Import `AnnotationEditor` and add it as a collapsible section after chart-specific options. Only show for supported chart types (not pie, table, map). Pass `config.referenceLines` and `config.annotations`. Wire up to store actions. *Validate: editor appears in customize step, changes persist.*

11. **Add unit tests for annotation components** — Create `tests/unit/charts/annotations.test.tsx`. Test:
    - `ReferenceLine` renders at correct position for x/y axis
    - `ChartAnnotation` renders point, range, callout, badge, highlight styles
    - Empty arrays render nothing
    - Invalid coordinates return null
    *Validate: all tests pass.*

12. **Add component tests for AnnotationEditor** — Create `tests/components/AnnotationEditor.test.tsx`. Test:
    - Adding reference line updates store
    - Editing annotation updates text
    - Deleting removes from list
    - Validation prevents out-of-range values
    *Validate: all tests pass.*

13. **Add E2E test for annotation workflow** — Create `tests/e2e/annotations.spec.ts`. Test:
    - Navigate to chart configurator
    - Select line chart, map fields
    - Go to customize step
    - Add a reference line at Y=50 with label "Target"
    - Verify line appears in preview
    - Export to PNG, verify annotations in image
    *Validate: E2E test passes.*

14. **Verify PNG export includes annotations** — The existing `ExportMenu` uses `html2canvas` on the chart container. Since annotations render as SVG elements within the chart, they should be captured. Test manually and verify. If not working, may need to adjust SVG structure. *Validate: exported PNG shows annotations.*

### New translation keys
All translation keys already exist in `public/locales/*/common.json` under the `annotations` namespace. No new keys needed.

| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `annotations.title` | Анотације | Anotacije | Annotations |
| `annotations.addReferenceLine` | Додај референтну линију | Dodaj referentnu liniju | Add Reference Line |
| `annotations.addAnnotation` | Додај анотацију | Dodaj anotaciju | Add Annotation |
| `annotations.referenceLines` | Референтне линије | Referentne linije | Reference Lines |
| `annotations.pointAnnotations` | Тачкасте анотације | Tačkaste anotacije | Point Annotations |
| `annotations.rangeAnnotations` | Опсежне анотације | Opsežne anotacije | Range Annotations |
| `annotations.label` | Ознака | Oznaka | Label |
| `annotations.value` | Вредност | Vrednost | Value |
| `annotations.text` | Текст | Tekst | Text |
| `annotations.color` | Боја | Boja | Color |
| `annotations.axis` | Оса | Osa | Axis |
| `annotations.style` | Стил | Stil | Style |
| `annotations.position` | Позиција | Pozicija | Position |
| `annotations.styles.solid` | Пуна | Puna | Solid |
| `annotations.styles.dashed` | Испрекидана | Isprekidana | Dashed |
| `annotations.styles.dotted` | Тачкаста | Tačkasta | Dotted |
| `annotations.styles.callout` | Облачић | Oblačić | Callout |
| `annotations.styles.badge` | Бедж | Bedž | Badge |
| `annotations.styles.highlight` | Истицање | Isticanje | Highlight |
| `annotations.positions.above` | Изнад | Iznad | Above |
| `annotations.positions.below` | Испод | Ispod | Below |
| `annotations.positions.left` | Лево | Levo | Left |
| `annotations.positions.right` | Десно | Desno | Right |
| `annotations.xAxis` | X-оса | X-osa | X-Axis |
| `annotations.yAxis` | Y-оса | Y-osa | Y-Axis |
| `annotations.start` | Почетак | Početak | Start |
| `annotations.end` | Крај | Kraj | End |
| `annotations.delete` | Обриши | Obriši | Delete |
| `annotations.edit` | Уреди | Uredi | Edit |

### Test plan
- **Unit:**
  - ReferenceLine component: position calculation, style rendering, label placement
  - ChartAnnotation component: point/range types, callout/badge/highlight styles
  - Zod schema validation: valid/invalid configs
- **Component:**
  - AnnotationEditor: add/edit/delete flows, form validation
  - Integration with CustomizeStep: state updates
- **E2E:**
  - Full workflow: create chart → add reference line → add annotation → preview → export
  - Locale switching preserves annotations
  - Annotations survive chart type change (when supported)

### Risks and edge cases
- **Recharts ReferenceLine with categorical X-axis** — If X-axis is categorical (strings), reference lines at string values may not align perfectly. *Mitigation: Validate that reference line values match axis type; warn in editor.*
- **Scatterplot custom SVG vs Recharts** — ScatterplotChart uses D3, not Recharts. The existing `ReferenceLinesLayer` and `AnnotationsLayer` components expect scales. *Mitigation: Reuse existing annotation components with D3 scales.*
- **Chart resize** — Annotations positioned by pixel coordinates break on resize. *Mitigation: Existing components use data coordinates via `xScale`/`yScale`; they will re-render on resize.*
- **Cyrillic text width** — Callout boxes have fixed width (120px in `ChartAnnotation.tsx`). Long Cyrillic labels may overflow. *Mitigation: Truncate text with ellipsis (already done) or measure text width dynamically.*
- **Too many annotations** — 10+ annotations could obscure data. *Mitigation: Enforce maximum 10 per type in editor UI (not in types, as per constraints).*
- **PNG export timing** — If annotations render asynchronously, export may capture incomplete state. *Mitigation: Test export; annotations are synchronous SVG so should work.*
- **Dark mode / theme** — Hardcoded colors in annotation components (white backgrounds, specific grays) may not adapt. *Mitigation: Review colors; may need CSS variables for theming support (out of scope for this feature).*

### Open questions
1. **Should annotations persist when switching chart types?** e.g., Line → Pie. Current types indicate pie doesn't support annotations. *Recommendation: Clear annotations with warning when switching to unsupported type, or keep in config but don't render.*
2. **Should we support date values for reference lines on time axes?** The `ReferenceLine.value` type is `number | string`. Date strings (ISO format) should work for X-axis on time series, but this needs validation.
3. **What is the default color for new annotations?** Currently components default to `#64748B` (slate) for lines and `#C6363C` (red) for annotations (Serbian flag red). *Recommendation: Use chart's color palette or provide a color picker.*

### Estimated complexity
**Medium** — The types, rendering components, and translations already exist. The work is primarily integration (6 chart components) and building the editor UI. The editor is the largest piece but follows existing patterns in `CustomizeStep.tsx`. No new dependencies or architectural changes needed.
