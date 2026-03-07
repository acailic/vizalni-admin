/**
 * Demo Showcase Page
 *
 * A page displaying featured charts from across the demo visualizations.
 * Highlights key data visualizations from economy, transport, energy,
 * and digitalization domains.
 *
 * @route /demos/showcase
 */

import { useLingui } from "@lingui/react";
import { Box, Grid, Typography, alpha, useTheme } from "@mui/material";
import { useState, useEffect } from "react";

import { DemoLayout } from "@/components/demos/demo-layout";
import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import DemoSkeleton from "@/components/demos/DemoSkeleton";
import { ChartPreviewModal } from "@/demos/showcase/_components/ChartPreviewModal";
import { FeaturedChartCard } from "@/demos/showcase/_components/FeaturedChartCard";
import { FEATURED_CHARTS } from "@/lib/demos/config";
const TOPIC_ROUTE_IDS = new Set([
  "economy",
  "health",
  "education",
  "demographics",
  "environment",
  "transport",
]);

const getChartDestination = (demoId: string) =>
  TOPIC_ROUTE_IDS.has(demoId) ? `/topics/${demoId}` : `/demos/${demoId}`;

export default function ShowcasePage() {
  const { i18n } = useLingui();
  const theme = useTheme();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [selectedChart, setSelectedChart] = useState<
    (typeof FEATURED_CHARTS)[0] | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for charts
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const isCyrillic = i18n.locale === "sr-Cyrl";
  const isSerbian = locale === "sr";

  const pageTitle = isCyrillic
    ? "Galerija demo vizualizacija"
    : isSerbian
      ? "Galerija demo vizualizacija"
      : "Featured Charts Showcase";

  const pageDescription = isCyrillic
    ? "Pregled ključnih grafikona iz otvorenih podataka Srbije."
    : isSerbian
      ? "Pregled ključnih grafikona iz otvorenih podataka Srbije."
      : "A curated collection of highlight charts across Serbian open data domains.";

  const introText = isCyrillic
    ? "Istražite ključne vizualizacije iz otvorenih podataka Srbije. Kliknite na karticu za brzi pregled."
    : isSerbian
      ? "Istražite ključne vizualizacije iz otvorenih podataka Srbije. Kliknite na karticu za brzi pregled."
      : "Explore key visualizations from Serbian open data. Click any chart to preview it.";

  const featuredChartsTitle = isCyrillic
    ? "Istaknuti grafikoni"
    : isSerbian
      ? "Istaknuti grafikoni"
      : "Featured Charts";

  const dataSourceTitle = isCyrillic
    ? "Izvor podataka"
    : isSerbian
      ? "Izvor podataka"
      : "Data Source";

  const dataSourceDescription = isCyrillic
    ? "Svi podaci prikazani na ovoj strani dolaze sa portala otvorenih podataka Republike Srbije (data.gov.rs)."
    : isSerbian
      ? "Svi podaci prikazani na ovoj strani dolaze sa portala otvorenih podataka Republike Srbije (data.gov.rs)."
      : "All data displayed on this page comes from the Republic of Serbia open data portal (data.gov.rs).";

  const handleCardClick = (chart: (typeof FEATURED_CHARTS)[0]) => {
    setSelectedChart(chart);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <DemoLayout title={pageTitle} description={pageDescription}>
        <DemoSkeleton
          variant="cards"
          cards={6}
          showHero={true}
          showChart={false}
        />
      </DemoLayout>
    );
  }

  return (
    <DemoLayout title={pageTitle} description={pageDescription}>
      <DemoErrorBoundary>
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
                href={getChartDestination(chart.demoId)}
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
            background: alpha(theme.palette.success.main, 0.08),
            border: "1px solid",
            borderColor: alpha(theme.palette.success.main, 0.2),
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
      </DemoErrorBoundary>
    </DemoLayout>
  );
}

export async function getStaticProps() {
  // Pre-build the showcase page for instant loading
  return {
    props: {},
  };
}
