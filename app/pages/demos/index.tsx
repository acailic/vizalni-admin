import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";

import { DemoLayout } from "@/components/demos/demo-layout";
import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import DemoSkeleton from "@/components/demos/DemoSkeleton";
import { DEMO_CONFIGS } from "@/lib/demos/config";

export default function DemosIndex() {
  const { i18n } = useLingui();
  const theme = useTheme();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo cards
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const pageTitle = i18n._(
    defineMessage({ id: "demos.index.title", message: "Demo Visualizations" })
  );
  const pageDescription = i18n._(
    defineMessage({
      id: "demos.index.description",
      message: "Explore different visualizations of Serbian open data",
    })
  );
  const heroTitle =
    locale === "sr"
      ? "Galerija demo vizualizacija"
      : "Demo Visualization Gallery";
  const heroIntro = i18n._(
    defineMessage({
      id: "demos.index.hero.intro",
      message:
        "Welcome to the demo visualization gallery using data from data.gov.rs. Each demo showcases different ways to visualize open data from the Republic of Serbia.",
    })
  );
  const heroBody = i18n._(
    defineMessage({
      id: "demos.index.hero.body",
      message:
        "Click on any demo below to see an interactive visualization with real data.",
    })
  );
  const showcaseTitle = i18n._(
    defineMessage({
      id: "demos.index.showcase.title",
      message: "New Demo Showcase",
    })
  );
  const showcaseDesc = i18n._(
    defineMessage({
      id: "demos.index.showcase.description",
      message:
        "A compact set of highlight charts across economy, transport, energy, and digitalization.",
    })
  );
  const showcaseCta = i18n._(
    defineMessage({ id: "demos.index.showcase.cta", message: "Open showcase" })
  );
  const aboutTitle =
    locale === "sr" ? "O demo vizualizacijama" : "About Demo Visualizations";
  const topicsTitle =
    locale === "sr"
      ? "Istražite otvorene podatke po temama"
      : "Explore Open Data by Topics";
  const toolsTitle =
    locale === "sr" ? "Interaktivni alati" : "Interactive Tools";
  const aboutParagraph1 = i18n._(
    defineMessage({
      id: "demos.index.about.paragraph1",
      message:
        "These visualizations use real data from the Republic of Serbia open data portal (data.gov.rs). Data is loaded in real-time directly from the API.",
    })
  );
  const aboutParagraph2 = i18n._(
    defineMessage({
      id: "demos.index.about.paragraph2",
      message:
        "The project is built with Next.js and optimized for GitHub Pages deployment with static export.",
    })
  );
  const statsAvailable = i18n._(
    defineMessage({
      id: "demos.index.stats.available",
      message: "Available Demos",
    })
  );
  const statsResources = i18n._(
    defineMessage({
      id: "demos.index.stats.resources",
      message: "Resources on data.gov.rs",
    })
  );
  const statsOrganizations = i18n._(
    defineMessage({
      id: "demos.index.stats.organizations",
      message: "Organizations",
    })
  );

  // Show skeleton while loading
  if (isLoading) {
    return (
      <DemoLayout
        title={pageTitle}
        description={pageDescription}
        hideBackButton
      >
        <DemoSkeleton variant="cards" cards={6} showChart={false} />
      </DemoLayout>
    );
  }

  return (
    <DemoLayout title={pageTitle} description={pageDescription} hideBackButton>
      <DemoErrorBoundary>
        <Box
          sx={{
            mb: 6,
            p: 5,
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0ea5e9 100%)",
            borderRadius: 4,
            color: "white",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.3)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.4,
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
            >
              {heroTitle}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ textAlign: "center", fontSize: "1.1rem", opacity: 0.95 }}
            >
              {heroIntro}
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", opacity: 0.9 }}
            >
              {heroBody}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mb: 5,
            p: 4,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
            color: "white",
            boxShadow: "0 10px 40px rgba(16, 185, 129, 0.3)",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {topicsTitle}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
            {i18n._(
              defineMessage({
                id: "demos.index.topics.description",
                message:
                  'The new "Explore by Topics" feature offers a curated list of datasets from economy, health, education, demographics, environment, and transport.',
              })
            )}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Link href="/topics" passHref legacyBehavior>
              <Button
                component="a"
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: theme.palette.success.main,
                  fontWeight: 700,
                  "&:hover": { bgcolor: alpha("#fff", 0.9) },
                }}
              >
                {i18n._(
                  defineMessage({
                    id: "demos.index.topics.cta",
                    message: "Open Topics",
                  })
                )}
              </Button>
            </Link>
            <Link href="/browse" passHref legacyBehavior>
              <Button
                component="a"
                variant="outlined"
                sx={{
                  borderColor: "white",
                  color: "white",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: alpha("#fff", 0.1),
                  },
                }}
              >
                {i18n._(
                  defineMessage({
                    id: "demos.index.topics.browse",
                    message: "Browse All Datasets",
                  })
                )}
              </Button>
            </Link>
          </Box>
        </Box>

        <Box
          sx={{
            mb: 5,
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(115deg, rgba(14,165,233,0.08), rgba(37,99,235,0.06))",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              {showcaseTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {showcaseDesc}
            </Typography>
          </Box>
          <Link href="/demos/showcase" passHref legacyBehavior>
            <Button
              component="a"
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", fontWeight: 700, px: 2.5 }}
            >
              {showcaseCta}
            </Button>
          </Link>
        </Box>

        {/* Working Demos */}
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
          {toolsTitle}
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Link href="/demos/playground" passHref legacyBehavior>
              <Card
                component="a"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(14, 165, 233, 0.25)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    opacity: 1,
                  },
                }}
              >
                <CardActionArea sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        fontSize: "3rem",
                        mb: 2,
                        textAlign: "center",
                        p: 2,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.1)} 100%)`,
                      }}
                    >
                      🎮
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {i18n._(
                        defineMessage({
                          id: "demos.index.playground.title",
                          message: "Interactive Playground",
                        })
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {i18n._(
                        defineMessage({
                          id: "demos.index.playground.description",
                          message:
                            "Experiment with different chart types and data in real-time.",
                        })
                      )}
                    </Typography>
                    <Chip
                      label={i18n._(
                        defineMessage({
                          id: "demos.index.playground.status",
                          message: "Working",
                        })
                      )}
                      size="small"
                      sx={{
                        mt: 2,
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        </Grid>

        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 1, fontWeight: 700, color: "text.primary" }}
          >
            {locale === "sr"
              ? "Više kategorija je dostupno kroz Topics i Showcase stranice"
              : "More categories are available through Topics and Showcase"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locale === "sr"
              ? "Za stabilne primere i dataset putanje koristite Explore by Topics, Demo Showcase i Embed generator."
              : "For stable examples and dataset-oriented flows, use Explore by Topics, Demo Showcase, and the Embed generator."}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 8,
            p: 5,
            background:
              "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)",
            borderRadius: 4,
            textAlign: "center",
            border: "2px solid",
            borderColor: "rgba(67, 233, 123, 0.2)",
            boxShadow: "0 10px 40px rgba(67, 233, 123, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 3, fontWeight: 700, color: "text.primary" }}
          >
            {aboutTitle}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}
          >
            {aboutParagraph1}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}
          >
            {aboutParagraph2}
          </Typography>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {Object.keys(DEMO_CONFIGS).length}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 500 }}
                >
                  {statsAvailable}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(245, 87, 108, 0.3)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  6,162+
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 500 }}
                >
                  {statsResources}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(79, 172, 254, 0.3)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  93
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 500 }}
                >
                  {statsOrganizations}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DemoErrorBoundary>
    </DemoLayout>
  );
}

export async function getStaticProps() {
  // Pre-build the demo index page for instant loading
  // Demo configs are static at build time, but we may want to refresh occasionally
  return {
    props: {},
  };
}
