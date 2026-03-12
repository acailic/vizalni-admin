# Showcase & Demographics Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Polish showcase page with clickable modal previews and enable + polish
demographics page with improved layout.

**Architecture:**

- Showcase: Extract card to component, add modal with chart preview
- Demographics: Enable page, add hero section, polish stats/charts

**Tech Stack:** React, MUI, Lingui i18n, Next.js

---

## Phase 1: Showcase Page - Components

### Task 1: Create Category Gradient Constants

**Files:**

- Create: `app/pages/demos/showcase/_constants/gradients.ts`

**Step 1: Create the gradients constant file**

```typescript
/**
 * Gradient colors for featured chart categories
 */
export const CATEGORY_GRADIENTS: Record<string, string> = {
  demographics: "linear-gradient(135deg, #f59e0b, #d97706)",
  energy: "linear-gradient(135deg, #10b981, #059669)",
  education: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  healthcare: "linear-gradient(135deg, #ef4444, #dc2626)",
  transport: "linear-gradient(135deg, #3b82f6, #2563eb)",
  economy: "linear-gradient(135deg, #f97316, #ea580c)",
};

export const CATEGORY_COLORS: Record<string, string> = {
  demographics: "#f59e0b",
  energy: "#10b981",
  education: "#8b5cf6",
  healthcare: "#ef4444",
  transport: "#3b82f6",
  economy: "#f97316",
};
```

**Step 2: Commit**

```bash
git add app/pages/demos/showcase/_constants/gradients.ts
git commit -m "feat: add category gradient constants for showcase"
```

---

### Task 2: Create FeaturedChartCard Component

**Files:**

- Create: `app/pages/demos/showcase/_components/FeaturedChartCard.tsx`

**Step 1: Create the card component**

```tsx
/**
 * Featured Chart Card Component
 *
 * Enhanced card with thumbnail, gradient, and click handler for modal preview.
 */

import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

import { DEMO_CONFIGS } from "@/lib/demos/config";

import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from "../_constants/gradients";

interface FeaturedChartCardProps {
  chart: {
    id: string;
    demoId: string;
    title: { sr: string; en: string };
    description: { sr: string; en: string };
    featuredReason: { sr: string; en: string };
  };
  locale: "sr" | "en";
  onClick: () => void;
}

export function FeaturedChartCard({
  chart,
  locale,
  onClick,
}: FeaturedChartCardProps) {
  const demoConfig = DEMO_CONFIGS[chart.demoId];
  const icon = demoConfig?.icon || "📊";
  const gradient =
    CATEGORY_GRADIENTS[chart.demoId] || CATEGORY_GRADIENTS.demographics;
  const color = CATEGORY_COLORS[chart.demoId] || CATEGORY_COLORS.demographics;

  return (
    <Card
      onClick={onClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: `0 20px 40px ${color}40`,
        },
      }}
    >
      {/* Thumbnail area with gradient */}
      <Box
        sx={{
          height: 120,
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            fontSize: "3rem",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        >
          {icon}
        </Box>
      </Box>

      <CardContent
        sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 1.5, lineHeight: 1.3 }}
        >
          {chart.title[locale]}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flex: 1 }}
        >
          {chart.description[locale]}
        </Typography>
        <Chip
          label={chart.featuredReason[locale]}
          size="small"
          sx={{
            alignSelf: "flex-start",
            background: gradient,
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      </CardContent>
    </Card>
  );
}
```

**Step 2: Commit**

```bash
git add app/pages/demos/showcase/_components/FeaturedChartCard.tsx
git commit -m "feat: add FeaturedChartCard component with thumbnail"
```

---

### Task 3: Create ChartPreviewModal Component

**Files:**

- Create: `app/pages/demos/showcase/_components/ChartPreviewModal.tsx`

**Step 1: Create the modal component**

```tsx
/**
 * Chart Preview Modal Component
 *
 * Modal with mini chart preview, description, and CTA button.
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { DEMO_CONFIGS } from "@/lib/demos/config";

import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from "../_constants/gradients";

interface ChartPreviewModalProps {
  open: boolean;
  onClose: () => void;
  chart: {
    id: string;
    demoId: string;
    title: { sr: string; en: string };
    description: { sr: string; en: string };
    featuredReason: { sr: string; en: string };
  } | null;
}

export function ChartPreviewModal({
  open,
  onClose,
  chart,
}: ChartPreviewModalProps) {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  if (!chart) return null;

  const demoConfig = DEMO_CONFIGS[chart.demoId];
  const icon = demoConfig?.icon || "📊";
  const gradient =
    CATEGORY_GRADIENTS[chart.demoId] || CATEGORY_GRADIENTS.demographics;

  const viewDemoText = i18n._(
    defineMessage({
      id: "demos.showcase.modal.viewDemo",
      message: "View Full Demo",
    })
  );

  const closeText = i18n._(
    defineMessage({
      id: "demos.showcase.modal.close",
      message: "Close",
    })
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1,
        }}
      >
        <Box sx={{ fontSize: "1.5rem" }}>{icon}</Box>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {chart.title[locale]}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Preview area with gradient placeholder */}
        <Box
          sx={{
            height: 200,
            background: gradient,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              fontSize: "4rem",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {chart.description[locale]}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {demoConfig?.description[locale]}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          {closeText}
        </Button>
        <Button
          component={Link}
          href={`/topics/${chart.demoId}`}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            background: gradient,
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          {viewDemoText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

**Step 2: Commit**

```bash
git add app/pages/demos/showcase/_components/ChartPreviewModal.tsx
git commit -m "feat: add ChartPreviewModal component"
```

---

### Task 4: Update Showcase Page to Use New Components

**Files:**

- Modify: `app/pages/demos/showcase/index.tsx`

**Step 1: Replace the card grid with new components**

Replace the entire file content with:

```tsx
/**
 * Demo Showcase Page
 *
 * A page displaying featured charts from across the demo visualizations.
 * Highlights key data visualizations from economy, transport, energy,
 * and digitalization domains.
 *
 * @route /demos/showcase
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Box, Grid, Typography, alpha } from "@mui/material";
import { useState } from "react";

import { DemoLayout } from "@/components/demos/demo-layout";
import { FEATURED_CHARTS } from "@/lib/demos/config";

import { ChartPreviewModal } from "./_components/ChartPreviewModal";
import { FeaturedChartCard } from "./_components/FeaturedChartCard";

export default function ShowcasePage() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [selectedChart, setSelectedChart] = useState<
    (typeof FEATURED_CHARTS)[0] | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);

  const pageTitle = i18n._(
    defineMessage({
      id: "demos.showcase.title",
      message: "Featured Charts Showcase",
    })
  );

  const pageDescription = i18n._(
    defineMessage({
      id: "demos.showcase.description",
      message:
        "A curated collection of highlight charts across economy, transport, energy, and digitalization domains.",
    })
  );

  const introText = i18n._(
    defineMessage({
      id: "demos.showcase.intro",
      message:
        "Explore key visualizations from Serbian open data. Click any chart to preview it.",
    })
  );

  const featuredChartsTitle = i18n._(
    defineMessage({
      id: "demos.showcase.featured.title",
      message: "Featured Charts",
    })
  );

  const dataSourceTitle = i18n._(
    defineMessage({
      id: "demos.showcase.datasource.title",
      message: "Data Source",
    })
  );

  const dataSourceDescription = i18n._(
    defineMessage({
      id: "demos.showcase.datasource.description",
      message:
        "All data displayed on this page comes from the Republic of Serbia open data portal (data.gov.rs).",
    })
  );

  const handleCardClick = (chart: (typeof FEATURED_CHARTS)[0]) => {
    setSelectedChart(chart);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <DemoLayout title={pageTitle} description={pageDescription}>
      <Box
        sx={{
          mb: 5,
          p: 4,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {introText}
        </Typography>
      </Box>

      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
        {featuredChartsTitle}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {FEATURED_CHARTS.map((chart) => (
          <Grid item xs={12} sm={6} md={4} key={chart.id}>
            <FeaturedChartCard
              chart={chart}
              locale={locale}
              onClick={() => handleCardClick(chart)}
            />
          </Grid>
        ))}
      </Grid>

      <ChartPreviewModal
        open={modalOpen}
        onClose={handleModalClose}
        chart={selectedChart}
      />

      <Box
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 3,
          background: alpha("#10b981", 0.08),
          border: "1px solid",
          borderColor: alpha("#10b981", 0.2),
        }}
      >
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          {dataSourceTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dataSourceDescription}
        </Typography>
      </Box>
    </DemoLayout>
  );
}

export async function getStaticProps() {
  // Pre-build the showcase page for instant loading
  return {
    props: {},
  };
}
```

**Step 2: Commit**

```bash
git add app/pages/demos/showcase/index.tsx
git commit -m "feat: integrate modal preview system in showcase page"
```

---

## Phase 2: Demographics Page - Enable and Polish

### Task 5: Enable Demographics Page

**Files:**

- Rename: `app/pages/demos/demographics.tsx.disabled` →
  `app/pages/demos/demographics.tsx`

**Step 1: Rename the file**

```bash
git mv app/pages/demos/demographics.tsx.disabled app/pages/demos/demographics.tsx
```

**Step 2: Commit**

```bash
git add app/pages/demos/demographics.tsx
git commit -m "feat: enable demographics page"
```

---

### Task 6: Add Hero Section and Polish Demographics Page

**Files:**

- Modify: `app/pages/demos/demographics.tsx`

**Step 1: Add imports and hero section**

Add `LinearProgress` to MUI imports and create hero section. Replace the
`dashboardContent` with the improved version that includes:

1. Hero section with gradient background
2. Stats cards with icons
3. Improved chart sections with insight callouts
4. Regional distribution with progress bars
5. Better challenges section

The full updated file:

```tsx
import { useLingui } from "@lingui/react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  alpha,
} from "@mui/material";

import { DemoPageTemplate } from "@/components/demo/DemoPageTemplate";
import { PopulationPyramid, PopulationTrends } from "@/components/demos/charts";
import { LiveDatasetPanel } from "@/components/demos/LiveDatasetPanel";
import {
  agePopulationData,
  demographicStats,
  dependencyRatios,
  populationTrends,
  regionalPopulation,
} from "@/data/serbia-demographics";

export default function DemographicsDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const totalMale = agePopulationData.reduce((sum, age) => sum + age.male, 0);
  const totalFemale = agePopulationData.reduce(
    (sum, age) => sum + age.female,
    0
  );
  const totalPopulation = (totalMale + totalFemale) * 1000;

  const population2024 = populationTrends[14];
  const populationChange2024to2050 =
    populationTrends[populationTrends.length - 1].total - population2024.total;
  const percentageChange = (
    (populationChange2024to2050 / population2024.total) *
    100
  ).toFixed(1);
  const malePercent = (((totalMale * 1000) / totalPopulation) * 100).toFixed(1);
  const femalePercent = (
    ((totalFemale * 1000) / totalPopulation) *
    100
  ).toFixed(1);
  const changeValue = Math.abs(populationChange2024to2050).toFixed(2);

  const title =
    locale === "sr"
      ? "Demografija Srbije - Starosna piramida i trendovi"
      : "Serbia Demographics - Age Pyramid and Trends";

  const description =
    locale === "sr"
      ? "Analiza starosne strukture stanovništva Srbije po polu, sa projekcijama do 2050. godine"
      : "Analysis of Serbia's population structure by age and gender, with projections to 2050";

  const dashboardContent = (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          color: "white",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            👥 {locale === "sr" ? "Demografija Srbije" : "Serbia Demographics"}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 2 }}>
            {locale === "sr"
              ? "Analiza starosne strukture stanovništva Srbije po polu, sa projekcijama do 2050. godine"
              : "Analysis of Serbia's population structure by age and gender, with projections to 2050"}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 3,
            p: 3,
            textAlign: "center",
            minWidth: 180,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            {(totalPopulation / 1000000).toFixed(2)}M
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {locale === "sr" ? "Stanovnika (2024)" : "Population (2024)"}
          </Typography>
        </Box>
      </Box>

      <LiveDatasetPanel
        demoId="demographics"
        title={
          locale === "sr"
            ? "Živi podaci (demografija)"
            : "Live data (demographics)"
        }
      />

      <Alert
        severity="warning"
        icon={<span style={{ fontSize: "1.5rem" }}>⚠️</span>}
        sx={{ mb: 4, fontSize: "1rem", fontWeight: 500 }}
      >
        {locale === "sr" ? (
          <>
            <strong>DEMOGRAFSKO UPOZORENJE:</strong> Stanovništvo Srbije opada.
            Projekcije pokazuju smanjenje od{" "}
            <strong>{Math.abs(parseFloat(percentageChange))}%</strong> do 2050.
            godine (sa {population2024.total.toFixed(2)}M na{" "}
            {populationTrends[populationTrends.length - 1].total.toFixed(2)}M).
            Medijalna starost je{" "}
            <strong>{demographicStats.medianAge} godina</strong>.
          </>
        ) : (
          <>
            <strong>DEMOGRAPHIC WARNING:</strong> Serbia's population is
            declining. Projections show a decrease of{" "}
            <strong>{Math.abs(parseFloat(percentageChange))}%</strong> by 2050
            (from {population2024.total.toFixed(2)}M to{" "}
            {populationTrends[populationTrends.length - 1].total.toFixed(2)}M).
            Median age is <strong>{demographicStats.medianAge} years</strong>.
          </>
        )}
      </Alert>

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "primary.main",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>👥</Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Ukupno stanovnika (2024)"
                    : "Total Population (2024)"}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {(totalPopulation / 1000000).toFixed(2)}M
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? `Muškarci: ${malePercent}% • Žene: ${femalePercent}%`
                  : `Male: ${malePercent}% • Female: ${femalePercent}%`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "error.main",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>📉</Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr" ? "Promena do 2050." : "Change by 2050"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "error.main" }}
              >
                {percentageChange}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? `Smanjenje za ~${changeValue}M ljudi`
                  : `Decrease of ~${changeValue}M people`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "warning.main",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>🎂</Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr" ? "Medijalna starost" : "Median Age"}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {demographicStats.medianAge}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr" ? "godina" : "years"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "info.main",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>⚖️</Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Odnos zavisnosti starijih"
                    : "Elderly Dependency Ratio"}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {dependencyRatios.elderly}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? "65+ na 100 radno sposobnih"
                  : "65+ per 100 working-age"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Population Age Pyramid */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: "1.5rem" }}>📊</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {locale === "sr"
              ? "Starosna piramida stanovništva (2024)"
              : "Population Age Pyramid (2024)"}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Raspodela stanovništva po starosti i polu pokazuje starenje populacije sa znatno manje mladih u odnosu na starije generacije."
            : "Population distribution by age and gender shows an aging population with significantly fewer young people compared to older generations."}
        </Typography>
        <PopulationPyramid
          data={agePopulationData}
          title=""
          width={900}
          height={650}
        />
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha("#f59e0b", 0.08),
            borderRadius: 2,
            borderLeft: 3,
            borderColor: "warning.main",
          }}
        >
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            💡{" "}
            {locale === "sr"
              ? "Ključni uvid: Oblik piramide pokazuje izraženo starenje populacije, sa najvećim grupama u srednjim i starijim godinama."
              : "Key insight: The pyramid shape shows pronounced population aging, with largest groups in middle and older ages."}
          </Typography>
        </Box>
      </Paper>

      {/* Population Trends */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: "1.5rem" }}>📈</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {locale === "sr"
              ? "Trendovi stanovništva (1950-2050)"
              : "Population Trends (1950-2050)"}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Istorijski podaci pokazuju konstantan rast do 2000-ih, zatim period stagnacije i opadanja. Projekcije ukazuju na nastavak negativnog trenda."
            : "Historical data shows constant growth until the 2000s, followed by a period of stagnation and decline. Projections indicate continuation of the negative trend."}
        </Typography>
        <PopulationTrends
          data={populationTrends}
          title=""
          width={950}
          height={550}
        />
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha("#ef4444", 0.08),
            borderRadius: 2,
            borderLeft: 3,
            borderColor: "error.main",
          }}
        >
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            💡{" "}
            {locale === "sr"
              ? "Ključni uvid: Vrhunac populacije dostignut je oko 1990. godine, od tada prati konstantan pad."
              : "Key insight: Population peaked around 1990, since then showing constant decline."}
          </Typography>
        </Box>
      </Paper>

      {/* Regional Distribution */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: "1.5rem" }}>🗺️</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {locale === "sr"
              ? "Regionalna raspodela stanovništva (2024)"
              : "Regional Population Distribution (2024)"}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {regionalPopulation.map((region) => {
            const percentage =
              (region.population / (totalPopulation / 1000)) * 100;
            return (
              <Grid item xs={12} sm={6} md={3} key={region.region}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {locale === "sr" ? region.region : region.regionEn}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary.main"
                      sx={{ fontWeight: 700 }}
                    >
                      {(region.population / 1000).toFixed(2)}M
                    </Typography>
                    <Box sx={{ mt: 1.5, mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha("#f59e0b", 0.2),
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#f59e0b",
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {percentage.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Key Challenges */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: "1.5rem" }}>⚠️</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {locale === "sr"
              ? "Ključni demografski izazovi"
              : "Key Demographic Challenges"}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha("#ef4444", 0.05),
                mb: 2,
              }}
            >
              <Chip
                label={
                  locale === "sr"
                    ? "Negativna stopa rasta"
                    : "Negative growth rate"
                }
                size="small"
                sx={{
                  bgcolor: "#ef4444",
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Stopa rasta: ${demographicStats.populationGrowthRate}% godišnje`
                  : `Growth rate: ${demographicStats.populationGrowthRate}% annually`}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha("#ef4444", 0.05),
                mb: 2,
              }}
            >
              <Chip
                label={
                  locale === "sr" ? "Niska stopa rađanja" : "Low birth rate"
                }
                size="small"
                sx={{
                  bgcolor: "#ef4444",
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Stopa rađanja: ${demographicStats.birthRate} na 1.000 stanovnika`
                  : `Birth rate: ${demographicStats.birthRate} per 1,000 population`}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha("#f59e0b", 0.05),
              }}
            >
              <Chip
                label={
                  locale === "sr" ? "Visoka stopa smrtnosti" : "High death rate"
                }
                size="small"
                sx={{
                  bgcolor: "#f59e0b",
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Stopa smrtnosti: ${demographicStats.deathRate} na 1.000 stanovnika`
                  : `Death rate: ${demographicStats.deathRate} per 1,000 population`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha("#f59e0b", 0.05),
                mb: 2,
              }}
            >
              <Chip
                label={
                  locale === "sr" ? "Starenje stanovništva" : "Aging population"
                }
                size="small"
                sx={{
                  bgcolor: "#f59e0b",
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Visok odnos starijih: ${dependencyRatios.elderly} (65+ na 100 radno sposobnih)`
                  : `High elderly ratio: ${dependencyRatios.elderly} (65+ per 100 working-age)`}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha("#3b82f6", 0.05),
                mb: 2,
              }}
            >
              <Chip
                label={
                  locale === "sr" ? "Očekivani životni vek" : "Life expectancy"
                }
                size="small"
                sx={{
                  bgcolor: "#3b82f6",
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Muškarci: ${demographicStats.lifeExpectancyMale} god. • Žene: ${demographicStats.lifeExpectancyFemale} god.`
                  : `Males: ${demographicStats.lifeExpectancyMale} yrs • Females: ${demographicStats.lifeExpectancyFemale} yrs`}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha("#6b7280", 0.05),
              }}
            >
              <Chip
                label={locale === "sr" ? "Urbanizacija" : "Urbanization"}
                size="small"
                sx={{
                  bgcolor: "#6b7280",
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `${demographicStats.urbanPopulation}% stanovnika živi u gradskim područjima`
                  : `${demographicStats.urbanPopulation}% of population lives in urban areas`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  return (
    <DemoPageTemplate
      title={title}
      description={description}
      datasetId="demographics-demo"
      chartComponent={dashboardContent}
      fallbackData={populationTrends}
      insightsConfig={{
        datasetId: "demographics-demo",
        sampleData: populationTrends,
        valueColumn: "total",
        timeColumn: "year",
      }}
      columns={[
        {
          key: "year",
          header: locale === "sr" ? "Godina" : "Year",
          width: 100,
        },
        {
          key: "total",
          header: locale === "sr" ? "Ukupno (mil)" : "Total (mil)",
          width: 150,
        },
        {
          key: "male",
          header: locale === "sr" ? "Muškarci (mil)" : "Male (mil)",
          width: 150,
        },
        {
          key: "female",
          header: locale === "sr" ? "Žene (mil)" : "Female (mil)",
          width: 150,
        },
      ]}
    />
  );
}
```

**Step 2: Commit**

```bash
git add app/pages/demos/demographics.tsx
git commit -m "feat: polish demographics page with hero and improved layout"
```

---

### Task 7: Run Test Suite

**Files:**

- None (verification only)

**Step 1: Run the test suite**

```bash
npm test -- --run
```

Expected: Tests pass (or only pre-existing failures related to React 19/MUI 6
test environment issues)

**Step 2: Run type check**

```bash
npm run typecheck
```

Expected: No TypeScript errors

**Step 3: Commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: resolve type errors from showcase/demographics polish"
```

---

## Summary

| Task | Description               | Files                               |
| ---- | ------------------------- | ----------------------------------- |
| 1    | Create gradient constants | `_constants/gradients.ts`           |
| 2    | Create FeaturedChartCard  | `_components/FeaturedChartCard.tsx` |
| 3    | Create ChartPreviewModal  | `_components/ChartPreviewModal.tsx` |
| 4    | Update showcase page      | `index.tsx`                         |
| 5    | Enable demographics       | Rename `.disabled`                  |
| 6    | Polish demographics       | `demographics.tsx`                  |
| 7    | Run tests                 | Verification                        |
