# QA Quick Fix Implementation Plan

**Design:** `docs/plans/2026-03-05-qa-quick-fix-design.md` **Date:** 2026-03-05
**Estimated Tasks:** 4

---

## Task 1: Fix Home Page Resource Links (404s)

**File:** `app/pages/index.tsx`

**Problem:** Resources section links point to non-existent tutorial pages.

**Changes:** Update `resourcesCopy` object (~line 366-461) to link to existing
pages.

```tsx
// FIND the resourcesCopy object (around line 352-461)
// REPLACE the entire resourcesCopy object with:

const resourcesCopy: Record<
  Locale,
  {
    label: string;
    heading: string;
    subheading: string;
    cards: Array<{
      title: string;
      description: string;
      link: string;
      cta: string;
    }>;
  }
> = {
  en: {
    label: "Resources",
    heading: "Learn and explore",
    subheading: "Guides to help you get the most out of Vizualni Admin",
    cards: [
      {
        title: "Getting started",
        description: "Explore the demo gallery to see what's possible",
        link: "/demos",
        cta: "Open gallery",
      },
      {
        title: "Featured charts",
        description: "See curated visualizations and examples",
        link: "/demos/showcase",
        cta: "View showcase",
      },
      {
        title: "Embed charts",
        description: "Generate embed code for your website",
        link: "/embed",
        cta: "Open generator",
      },
      {
        title: "Browse datasets",
        description: "Find data from data.gov.rs",
        link: "/browse",
        cta: "Browse data",
      },
    ],
  },
  sr: {
    label: "Resursi",
    heading: "Naučite i istražite",
    subheading:
      "Vodiči koji vam pomažu da izvučete maksimum iz Vizualni Admin-a",
    cards: [
      {
        title: "Prvi koraci",
        description: "Istražite galeriju demo-a da vidite šta je moguće",
        link: "/demos",
        cta: "Otvori galeriju",
      },
      {
        title: "Istaknuti grafikoni",
        description: "Pogledajte kurirane vizualizacije i primere",
        link: "/demos/showcase",
        cta: "Pogledaj showcase",
      },
      {
        title: "Ugradnja grafikona",
        description: "Generišite kod za ugradnju na vaš sajt",
        link: "/embed",
        cta: "Otvori generator",
      },
      {
        title: "Pregled podataka",
        description: "Pronađite podatke sa data.gov.rs",
        link: "/browse",
        cta: "Pregledaj podatke",
      },
    ],
  },
  "sr-Cyrl": {
    label: "Ресурси",
    heading: "Научите и истражите",
    subheading:
      "Водичи који вам помажу да извучете максимум из Визуелни Админ-а",
    cards: [
      {
        title: "Први кораци",
        description: "Истражите галерију демо-а да видите шта је могуће",
        link: "/demos",
        cta: "Отвори галерију",
      },
      {
        title: "Истакнути графикони",
        description: "Погледајте кулиране визуализације и примере",
        link: "/demos/showcase",
        cta: "Погледај showcase",
      },
      {
        title: "Уградња графикона",
        description: "Генеришите код за уградњу на ваш сајт",
        link: "/embed",
        cta: "Отвори генератор",
      },
      {
        title: "Преглед података",
        description: "Пронађите податке са data.gov.rs",
        link: "/browse",
        cta: "Прегледај податке",
      },
    ],
  },
};
```

**Testing:**

```bash
cd app && yarn dev
```

1. Open http://localhost:3000
2. Scroll to "Resources" section
3. Click each card link - all should navigate to working pages (no 404s)

**Commit:** `fix: update home page resource links to existing pages`

---

## Task 2: Fix Header Branding

**File:** `app/components/header.tsx`

**Problem:** Header shows "data.gov.rs" as brand but links to Vizualni Admin
home, causing confusion.

**Changes:** Update brand text (line ~101-106).

```tsx
// FIND (around line 100-107):
{
  hideLogo ? null : (
    <SimpleHeader
      longTitle="data.gov.rs"
      shortTitle="data"
      rootHref="/"
      sx={{ backgroundColor: "white" }}
    />
  );
}

// REPLACE WITH:
{
  hideLogo ? null : (
    <SimpleHeader
      longTitle="Vizualni Admin"
      shortTitle="VA"
      rootHref="/"
      sx={{ backgroundColor: "white" }}
    />
  );
}
```

**Testing:**

```bash
cd app && yarn dev
```

1. Open http://localhost:3000
2. Check header shows "Vizualni Admin" (desktop) or "VA" (mobile)
3. Click the brand - should navigate to home page

**Commit:** `fix: change header brand to Vizualni Admin for clarity`

---

## Task 3: Fix Embed Generator URL Params

**File:** `app/pages/embed/index.tsx`

**Problem:** Embed generator ignores URL params like `type`, `dataset`,
`dataSource` when generating iframe URLs.

**Investigation:** The `passthroughParams` logic excludes these params. Need to
include them.

**Changes:**

```tsx
// FIND the passthroughParams useMemo (around line 45-53):
const passthroughParams = useMemo(() => {
  const excluded = new Set(["theme", "lang", "width", "height"]);
  return Object.fromEntries(
    Object.entries(router.query)
      .filter(([key]) => !excluded.has(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
      .filter(([, value]) => !!value)
  );
}, [router.query]);

// REPLACE WITH:
const passthroughParams = useMemo(() => {
  // Exclude UI-only params, but pass through chart params
  const excluded = new Set(["theme", "lang", "width", "height"]);
  return Object.fromEntries(
    Object.entries(router.query)
      .filter(([key]) => !excluded.has(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
  );
}, [router.query]);
```

**Additional fix:** Add display of current params to make it clear what's being
passed:

```tsx
// FIND the Card with Settings (around line 98-144)
// ADD after the TextField for Language (around line 131):

{
  /* Show current passthrough params */
}
{
  Object.keys(passthroughParams).length > 0 && (
    <Box sx={{ mt: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Chart params from URL:
      </Typography>
      <Box
        sx={{
          mt: 0.5,
          p: 1,
          backgroundColor: "grey.100",
          borderRadius: 1,
          fontFamily: "monospace",
          fontSize: "0.75rem",
        }}
      >
        {Object.entries(passthroughParams).map(([key, value]) => (
          <Box key={key}>
            {key}: {value}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
```

**Testing:**

```bash
cd app && yarn dev
```

1. Open http://localhost:3000/embed?type=bar&dataset=budget&dataSource=Prod
2. Check the "Chart params from URL" section shows the params
3. Check the generated iframe `src` includes
   `type=bar&dataset=budget&dataSource=Prod`
4. Click "Preview embed" - URL should have all params

**Commit:** `fix: embed generator passes through URL params correctly`

---

## Task 4: Improve Demo Placeholder Pages

**File:** `app/pages/demos/[demoId].tsx`

**Problem:** Demo pages show repetitive warning icons and placeholder text.

**Changes:** Improve the placeholder UI to be cleaner and more helpful.

```tsx
// FIND the "Visualization Placeholder" Card (around line 217-265)
// REPLACE the entire Card with:

{
  /* Coming Soon Banner */
}
<Card
  sx={{
    borderRadius: 3,
    overflow: "hidden",
    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
  }}
>
  <CardContent
    sx={{
      p: 6,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 400,
      textAlign: "center",
    }}
  >
    <Chip
      label={locale === "sr" ? "Uskoro dostupno" : "Coming Soon"}
      color="info"
      size="small"
      sx={{ mb: 3, fontWeight: 600 }}
    />

    <Box
      sx={{
        fontSize: "4rem",
        mb: 2,
        opacity: 0.7,
      }}
    >
      {demoConfig.icon}
    </Box>

    <Typography
      variant="h5"
      sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
    >
      {title}
    </Typography>

    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ maxWidth: 480, mb: 3 }}
    >
      {locale === "sr"
        ? "Ova vizualizacija je u razvoju. Vratite uskoro da vidite interaktivne grafikone sa pravim podacima sa data.gov.rs."
        : "This visualization is under development. Check back soon to see interactive charts with real data from data.gov.rs."}
    </Typography>

    <Button
      variant="contained"
      component={Link}
      href="/demos"
      startIcon={<span>←</span>}
      sx={{ textTransform: "none", fontWeight: 600 }}
    >
      {locale === "sr" ? "Nazad u galeriju demo-a" : "Back to demo gallery"}
    </Button>
  </CardContent>
</Card>;
```

**Add missing import:**

```tsx
// At the top, add Button to imports if not present:
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  alpha,
  useTheme,
  Button, // <-- Add this
} from "@mui/material";
```

**Testing:**

```bash
cd app && yarn dev
```

1. Open http://localhost:3000/demos/energy
2. Should show clean "Coming Soon" banner
3. Click "Back to demo gallery" - should navigate to /demos
4. No duplicate icons or warnings

**Commit:** `fix: improve demo placeholder page UI with coming soon banner`

---

## Final Verification

After all tasks, run:

```bash
# Type check
cd app && yarn typecheck

# Run tests
cd app && yarn test

# Build for production
yarn build:gh-pages-local
```

**Manual E2E verification:**

1. Home page → Resources section → all links work (no 404s)
2. Header brand → shows "Vizualni Admin", links to home
3. `/embed?type=bar&dataset=budget` → iframe src includes params
4. `/demos/energy` → clean coming soon page with back link

---

## Summary

| Task | File                           | Commit Message                                                |
| ---- | ------------------------------ | ------------------------------------------------------------- |
| 1    | `app/pages/index.tsx`          | fix: update home page resource links to existing pages        |
| 2    | `app/components/header.tsx`    | fix: change header brand to Vizualni Admin for clarity        |
| 3    | `app/pages/embed/index.tsx`    | fix: embed generator passes through URL params correctly      |
| 4    | `app/pages/demos/[demoId].tsx` | fix: improve demo placeholder page UI with coming soon banner |
