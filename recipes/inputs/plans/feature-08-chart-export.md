# Feature Request

## Title
Chart export: PNG image, CSV data download, and Excel export

## Problem
Users create charts but have no way to export them for reports, presentations, or further analysis. The Swiss tool supports PNG export (html-to-image) and Excel export (ExcelJS). We need the same for Serbian data users.

## Proposed behavior

### PNG export
- "Download as image" button on every chart
- Captures the chart as rendered, including title, legend, and source attribution
- Uses `html-to-image` library (lightweight, no canvas dependency issues)
- Options: width (default: chart width), scale factor (default: 2x for retina), background (white/transparent)
- Filename: `{chart-title}-{date}.png` (transliterated to Latin for filesystem safety)
- The export should include source attribution line: "Извор: data.gov.rs — {dataset}"

### CSV data download
- "Download data" button on every chart
- Exports the filtered/transformed data (what the chart shows, not raw dataset)
- CSV with UTF-8 BOM (so Excel on Windows opens it correctly with Cyrillic)
- Column headers in original language (Serbian or as-in-dataset)
- Semicolon-delimited (`;`) by default for Serbian locale (comma is decimal separator)
- Filename: `{chart-title}-{date}.csv`

### Excel export
- "Download as Excel" button (separate from CSV)
- Uses ExcelJS (or a lighter alternative like SheetJS/xlsx — evaluate bundle size)
- Formatted spreadsheet with:
  - Header row with bold, colored background (Serbian government blue)
  - Data rows with proper number formatting for Serbian locale
  - Sheet name: chart title (truncated to 31 chars, Excel limit)
  - Metadata row at bottom: source attribution, export date, filters applied
- Filename: `{chart-title}-{date}.xlsx`

### Export menu component
A dropdown menu on every chart with:
```
📥 Download
  ├── Image (PNG)
  ├── Data (CSV)
  └── Spreadsheet (Excel)
```
Using Radix UI dropdown (already a dependency).

### Table export
For table chart type, same exports plus:
- "Copy to clipboard" option (tab-separated for pasting into spreadsheets)
- CSV/Excel include all visible columns with current sort/filter applied

### Implementation details
- PNG: `html-to-image` needs to be added as dependency (~15KB gzipped)
- CSV: use papaparse `unparse()` (already a dependency)
- Excel: evaluate `exceljs` vs `xlsx` — prefer smaller bundle, lazy-load
- All export functions are client-side (no server round-trip)
- Show a brief loading indicator during export generation

## Affected areas
- `src/lib/export/` (new directory)
  - `export-png.ts` — html-to-image wrapper
  - `export-csv.ts` — CSV generation with BOM and semicolons
  - `export-excel.ts` — Excel generation
  - `filename.ts` — safe filename generation with Cyrillic → Latin transliteration
- `src/components/charts/shared/ExportMenu.tsx` (new)
- `src/components/charts/ChartRenderer.tsx` (add export menu)
- `package.json` (add html-to-image, potentially xlsx or exceljs)
- `public/locales/*/common.json` (export labels: "Download", "Image", "Data", "Spreadsheet", "Copying...")

## Constraints
- PNG export must capture SVG-based charts correctly (Recharts renders SVG)
- Chart.js renders to canvas — html-to-image handles both SVG and canvas
- Cyrillic filenames cause issues on some OS — transliterate to Latin for filenames
- Excel files with 100k+ rows will be slow to generate — show progress or limit to current view
- Lazy-load the Excel library (large bundle) — only load when user clicks "Excel"
- Must work without authentication (export is client-side, no server needed)

## Out of scope
- PDF export (complex, low priority)
- Chart embedding (that's Feature 10)
- Sharing via URL (that's Feature 09)
- Bulk export of multiple charts

## Acceptance criteria
- [ ] PNG export captures the chart including title, legend, and source attribution
- [ ] PNG export produces a 2x resolution image by default
- [ ] CSV export uses UTF-8 BOM and semicolon delimiter
- [ ] CSV export includes filtered data (respects active filters)
- [ ] Excel export produces a formatted .xlsx with styled headers
- [ ] Excel export includes metadata (source, date, applied filters) in a footer row
- [ ] Filenames use transliterated Latin characters
- [ ] Export menu renders as a dropdown on every chart
- [ ] Excel library is lazy-loaded (not in main bundle)
- [ ] All export-related UI text translated in three locales
- [ ] Export works for all chart types including table

## Prior art / references
- Swiss tool: `app/utils/use-screenshot.ts` — html-to-image chart export
- Swiss tool: uses ExcelJS for Excel export
- papaparse: `Papa.unparse()` for CSV generation
- html-to-image: `toPng()`, `toSvg()` functions
