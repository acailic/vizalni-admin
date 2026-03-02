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
