# QA Regression Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Fix all 6 QA issues from the UI/UX report — embed preview crash, demo
preview gaps, metadata inconsistency, playground code truncation, dataset JSON
population, and embed page localization.

**Architecture:** Direct fixes in existing components — no new files or
abstractions. Each task is an independent fix in 1-2 files.

**Tech Stack:** React, MUI, D3, Next.js, Lingui/i18n

---

### Task 1: Fix embed preview crash (BarChart missing d3-transition import)

**Files:**

- Modify: `app/components/demos/charts/BarChart.tsx:11`
- Test: `app/__tests__/unit/bar-chart-transition.test.ts` (create)

**Step 1: Write the failing test**

Create `app/__tests__/unit/bar-chart-transition.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("BarChart d3-transition import", () => {
  it("imports d3-transition side-effect module", async () => {
    const source = await import("fs").then((fs) =>
      fs.readFileSync("app/components/demos/charts/BarChart.tsx", "utf-8")
    );
    expect(source).toContain('import "d3-transition"');
  });
});
```

**Step 2: Run test to verify it fails**

Run:
`cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run app/__tests__/unit/bar-chart-transition.test.ts`
Expected: FAIL — source does not contain the import

**Step 3: Add the missing import**

In `app/components/demos/charts/BarChart.tsx`, add after line 11
(`import * as d3 from "d3-selection";`):

```ts
import "d3-transition";
```

**Step 4: Run test to verify it passes**

Run:
`cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run app/__tests__/unit/bar-chart-transition.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add app/components/demos/charts/BarChart.tsx app/__tests__/unit/bar-chart-transition.test.ts
git commit -m "fix: add missing d3-transition import to BarChart (fixes embed preview crash)"
```

---

### Task 2: Fix playground code truncation

**Files:**

- Modify: `app/demos/playground/_components/CodeOutput/index.tsx:31-32`

**Step 1: Write the failing test**

Create `app/__tests__/unit/playground-code-output.test.ts`:

```ts
import { describe, it, expect } from "vitest";

// Import the pure function directly
import { generateCode } from "@/demos/playground/_components/CodeOutput/index";

describe("generateCode", () => {
  const sampleData = Array.from({ length: 12 }, (_, i) => ({
    label: `Month ${i + 1}`,
    value: (i + 1) * 100,
  }));

  it("includes ALL data points without truncation", () => {
    const code = generateCode({
      chartType: "bar",
      data: sampleData,
      config: { xAxis: "label", yAxis: "value", color: "#2196f3" },
    });

    // Must NOT contain truncation marker
    expect(code).not.toContain("// ...");
    // Must contain last data point
    expect(code).toContain("Month 12");
    // Must be syntactically complete (has closing brace and export)
    expect(code).toContain("export default MyChart;");
  });

  it("produces valid JSX structure", () => {
    const code = generateCode({
      chartType: "line",
      data: [{ label: "A", value: 10 }],
      config: { xAxis: "label", yAxis: "value", color: "#ff0000" },
    });

    expect(code).toContain("import { LineChart }");
    expect(code).toContain("<LineChart");
    expect(code).toContain("export default MyChart;");
  });
});
```

**Step 2: Run test to verify it fails**

Run:
`cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run app/__tests__/unit/playground-code-output.test.ts`
Expected: FAIL — code contains "// ..."

**Step 3: Fix generateCode to output full data**

In `app/demos/playground/_components/CodeOutput/index.tsx`, replace lines 31-32:

```ts
const dataStr = JSON.stringify(data.slice(0, 4), null, 2);
const truncated = data.length > 4 ? "\n  // ..." : "";
```

with:

```ts
const dataStr = JSON.stringify(data, null, 2);
```

And update line 50 from:

```ts
  const data = ${dataStr}${truncated};
```

to:

```ts
  const data = ${dataStr};
```

**Step 4: Run test to verify it passes**

Run:
`cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run app/__tests__/unit/playground-code-output.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add app/demos/playground/_components/CodeOutput/index.tsx app/__tests__/unit/playground-code-output.test.ts
git commit -m "fix: output complete data in playground code generation (no truncation)"
```

---

### Task 3: Populate playground dataset JSON textarea

**Files:**

- Modify: `app/demos/playground/_components/ConfigPanel/DataEditor.tsx:29,37-39`

**Step 1: Update handleDatasetSelect to populate textarea**

In `app/demos/playground/_components/ConfigPanel/DataEditor.tsx`, change
`handleDatasetSelect`:

From:

```ts
const handleDatasetSelect = (datasetKey: string) => {
  const dataset = SAMPLE_DATASETS[datasetKey];
  if (dataset) {
    onChange(dataset.data);
    setCustomJson("");
    setJsonError(null);
  }
};
```

To:

```ts
const handleDatasetSelect = (datasetKey: string) => {
  const dataset = SAMPLE_DATASETS[datasetKey];
  if (dataset) {
    onChange(dataset.data);
    setCustomJson(JSON.stringify(dataset.data, null, 2));
    setJsonError(null);
  }
};
```

**Step 2: Also initialize customJson when data prop matches a dataset on mount**

No additional change needed — the textarea will now be populated whenever a user
selects a dataset from the dropdown. The empty initial state is correct (no
dataset selected yet).

**Step 3: Verify locally**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run`
Expected: All existing tests pass

**Step 4: Commit**

```bash
git add app/demos/playground/_components/ConfigPanel/DataEditor.tsx
git commit -m "fix: populate JSON textarea when selecting a playground dataset"
```

---

### Task 4: Fix dataset metadata consistency (DatasetCard fallbacks)

**Files:**

- Modify: `app/components/topics/DatasetCard.tsx:65,80`

**Step 1: Add fallback values for empty metadata**

In `app/components/topics/DatasetCard.tsx`, change lines 64-81.

Replace the metadata display section:

```tsx
<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
  <Chip label={dataset.format} size="small" variant="outlined" />
  <Typography
    variant="caption"
    color="text.secondary"
    component="span"
    data-testid="dataset-updated"
    sx={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: 0.5,
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
    }}
  >
    <Box component="span">{`${updatedLabel}:`}</Box>
    <Box component="span">{dataset.lastUpdated}</Box>
  </Typography>
</Box>
```

with:

```tsx
<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
  <Chip
    label={dataset.format || (locale === "en" ? "Unknown" : "Nepoznato")}
    size="small"
    variant="outlined"
  />
  <Typography
    variant="caption"
    color="text.secondary"
    component="span"
    data-testid="dataset-updated"
    sx={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: 0.5,
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
    }}
  >
    <Box component="span">{`${updatedLabel}:`}</Box>
    <Box component="span">
      {dataset.lastUpdated || (locale === "en" ? "Unknown" : "Nepoznato")}
    </Box>
  </Typography>
</Box>
```

Note: The `locale` prop is already available in `DatasetCard`.

**Step 2: Verify**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run`
Expected: All tests pass

**Step 3: Commit**

```bash
git add app/components/topics/DatasetCard.tsx
git commit -m "fix: show fallback text for missing dataset metadata (format/date)"
```

---

### Task 5: Localize embed generator page

**Files:**

- Modify: `app/pages/embed/index.tsx`

**Step 1: Add localized labels**

In `app/pages/embed/index.tsx`, after the existing state declarations (around
line 83), add a labels object:

```tsx
const isSerbian = lang === "sr";

const labels = {
  overline: isSerbian ? "Ugrađivanje" : "Embeds",
  heading: isSerbian
    ? "Generišite iframe kod za vizualni-admin grafikone"
    : "Generate iframe code for vizualni-admin charts",
  subheading: isSerbian
    ? "Prilagodite veličinu, temu, jezik, parametre grafikona i opcije rasporeda, zatim kopirajte kod za ugrađivanje."
    : "Customize size, theme, language, chart params, and layout options, then copy/paste the embed snippet. The preview is embedded on this same screen and updates live.",
  settingsTitle: isSerbian ? "Podešavanja" : "Settings",
  settingsSub: isSerbian ? "Podesite parametre" : "Tweak embed parameters",
  widthLabel: isSerbian ? "Širina" : "Width",
  heightLabel: isSerbian ? "Visina" : "Height",
  themeLabel: isSerbian ? "Tema" : "Theme",
  languageLabel: isSerbian ? "Jezik" : "Language",
  chartParamsTitle: isSerbian ? "Parametri grafikona" : "Chart parameters",
  chartTypeLabel: isSerbian ? "Tip grafikona" : "Chart type",
  datasetLabel: isSerbian ? "Skup podataka" : "Dataset",
  dataSourceLabel: isSerbian ? "Izvor podataka" : "Data source",
  layoutTitle: isSerbian ? "Opcije rasporeda" : "Layout options",
  previewButton: isSerbian ? "Pregled ugrađenog" : "Preview embed",
  copyTitle: isSerbian ? "Kopirajte kod za ugrađivanje" : "Copy embed code",
  copyDescription: isSerbian
    ? "Zalepite ovaj iframe u bilo koji sajt ili CMS."
    : "Paste this iframe into any site or CMS. The generated `src` mirrors the selected chart parameters and locale/theme options.",
  targetRoute: isSerbian ? "Ciljna ruta" : "Target route",
  inlinePreview: isSerbian ? "Pregled uživo" : "Inline preview",
  paramsInUrl: isSerbian ? "Parametri u URL-u:" : "Parameters in embed URL:",
};

const layoutParamLabels: Record<EmbedLayoutParam, string> = isSerbian
  ? {
      removeBorder: "Ukloni okvir",
      optimizeSpace: "Optimizuj prostor",
      removeMoreOptionsButton: "Ukloni dugme za više opcija",
      removeLabelsInteractivity: "Onemogući interaktivnost oznaka",
      removeFootnotes: "Ukloni fusnote",
      removeFilters: "Ukloni filtere",
    }
  : LAYOUT_PARAM_LABELS;
```

**Step 2: Replace all hardcoded English text in JSX**

Replace every hardcoded English string in the return JSX with the corresponding
`labels.*` value, and use `layoutParamLabels` instead of `LAYOUT_PARAM_LABELS`
in the checkbox map.

Key replacements:

- `"Embeds"` → `{labels.overline}`
- `"Generate iframe code..."` → `{labels.heading}`
- `"Customize size..."` → `{labels.subheading}`
- `"Settings"` / `"Tweak embed parameters"` → `{labels.settingsTitle}` /
  `{labels.settingsSub}`
- `"Width"` → `{labels.widthLabel}` etc.
- `"Copy embed code"` → `{labels.copyTitle}`
- `"Inline preview"` → `{labels.inlinePreview}`
- `"Preview embed"` → `{labels.previewButton}`
- `LAYOUT_PARAM_LABELS[param]` → `layoutParamLabels[param]`

**Step 3: Verify**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run`
Expected: All tests pass

**Step 4: Commit**

```bash
git add app/pages/embed/index.tsx
git commit -m "fix: localize embed generator page (Serbian/English)"
```

---

### Task 6: Improve DemoError to hide raw stack traces

**Files:**

- Modify: `app/components/demos/demo-layout.tsx` (DemoError component, lines
  268-321)

**Step 1: Replace raw error message with user-friendly copy**

In the `DemoError` component, replace the raw `errorMessage` display with a
sanitized version that hides stack-trace-like content:

```tsx
export function DemoError({
  error,
  onRetry,
}: {
  error: Error | string;
  onRetry?: () => void;
}) {
  useLingui();
  const errorMessage = typeof error === "string" ? error : error.message;
  const isNoDatasetsError = errorMessage.includes("No datasets found");
  const isStackTrace =
    errorMessage.includes("is not a function") ||
    errorMessage.includes("Cannot read propert") ||
    errorMessage.includes("at ") ||
    errorMessage.length > 200;

  const displayMessage = isStackTrace ? undefined : errorMessage;

  return (
    <Box
      sx={{
        backgroundColor: "error.lighter",
        border: 1,
        borderColor: "error.light",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" color="error.main" sx={{ mb: 2 }}>
        <Trans id="demos.layout.error-title" message="Error loading data" />
      </Typography>
      {displayMessage && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {displayMessage}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {isNoDatasetsError ? (
          <Trans
            id="demos.layout.error-suggestions-no-datasets"
            message="This demo should display fallback data. Check the browser console for more details."
          />
        ) : (
          <Trans
            id="demos.layout.error-suggestions"
            message="Suggestions: try again, check internet connection, or open a different dataset from data.gov.rs."
          />
        )}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          sx={{ textTransform: "none" }}
        >
          {t({ id: "demos.layout.retry", message: "Try again" })}
        </Button>
      )}
    </Box>
  );
}
```

**Step 2: Verify**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run`
Expected: All tests pass

**Step 3: Commit**

```bash
git add app/components/demos/demo-layout.tsx
git commit -m "fix: hide raw stack traces in DemoError, show user-friendly message"
```

---

### Task 7: Final verification

**Step 1: Run full test suite**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run`
Expected: All tests pass

**Step 2: Type check**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && npx tsc --noEmit`
Expected: No errors

**Step 3: Build check**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && yarn build`
Expected: Build succeeds
