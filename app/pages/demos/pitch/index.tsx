/**
 * Demo Pitch Page
 *
 * A page displaying curated visualizations for presentations.
 * Shows the first 6 demos in a grid layout, designed for
 * pitch-ready walkthroughs.
 *
 * @route /demos/pitch
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React from "react";

import { DemoLayout } from "@/components/demos/demo-layout";
import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import DemoSkeleton from "@/components/demos/DemoSkeleton";
import { DEMO_CONFIGS } from "@/lib/demos/config";

export default function PitchPage() {
  const { i18n } = useLingui();
  const theme = useTheme();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate loading for demo cards
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const pageTitle = i18n._(
    defineMessage({
      id: "demos.pitch.title",
      message: "Pitch Demo",
    })
  );

  const pageDescription = i18n._(
    defineMessage({
      id: "demos.pitch.description",
      message: "Curated visualizations for presentations",
    })
  );

  const introText = i18n._(
    defineMessage({
      id: "demos.pitch.intro",
      message:
        "A curated selection of key visualizations from Serbian open data. Perfect for presentations and demonstrations.",
    })
  );

  const viewAllDemosText = i18n._(
    defineMessage({
      id: "demos.pitch.viewAllDemos",
      message: "View All Demos",
    })
  );

  const homeText = i18n._(
    defineMessage({
      id: "demos.pitch.home",
      message: "Home",
    })
  );

  const curatedDemosTitle = i18n._(
    defineMessage({
      id: "demos.pitch.curatedDemos",
      message: "Curated Demos",
    })
  );

  // Get first 6 demos from DEMO_CONFIGS
  const pitchDemos = Object.values(DEMO_CONFIGS).slice(0, 6);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <DemoLayout title={pageTitle} description={pageDescription}>
        <DemoSkeleton variant="cards" cards={6} showChart={false} />
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
              "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {introText}
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          {locale === "sr" ? "Kurirani demo prikazi" : curatedDemosTitle}
        </Typography>

        <Grid container spacing={3}>
          {pitchDemos.map((demo) => (
            <Grid item xs={12} sm={6} md={4} key={demo.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.25)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    opacity: 1,
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "2.5rem",
                      mb: 2,
                      textAlign: "center",
                      p: 1.5,
                      borderRadius: 2,
                      background: alpha(theme.palette.primary.main, 0.08),
                      display: "inline-block",
                    }}
                  >
                    {demo.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1.5, lineHeight: 1.3 }}
                  >
                    {demo.title[locale]}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flex: 1 }}
                  >
                    {demo.description[locale]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 6,
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/demos" passHref legacyBehavior>
            <Button
              component="a"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                },
              }}
            >
              {locale === "sr" ? "Pogledaj sve demo prikaze" : viewAllDemosText}
            </Button>
          </Link>
          <Link href="/" passHref legacyBehavior>
            <Button
              component="a"
              variant="outlined"
              size="large"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                borderColor: "divider",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              {locale === "sr" ? "Pocetna" : homeText}
            </Button>
          </Link>
        </Box>

        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 3,
            background: alpha(theme.palette.primary.main, 0.04),
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.15),
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
          >
            {locale === "sr" ? "Izvor podataka" : "Data Source"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locale === "sr"
              ? "Svi podaci prikazani na ovoj stranici dolaze sa portala otvorenih podataka Republike Srbije (data.gov.rs)."
              : "All data displayed on this page comes from the Republic of Serbia open data portal (data.gov.rs)."}
          </Typography>
        </Box>
      </DemoErrorBoundary>
    </DemoLayout>
  );
}

export async function getStaticProps() {
  // Pre-build the pitch page for instant loading
  return {
    props: {},
  };
}
