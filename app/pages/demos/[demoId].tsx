/**
 * Dynamic Demo Page
 *
 * A dynamic route that renders any configured demo based on the demoId parameter.
 * Uses getStaticPaths to pre-render all demo IDs from DEMO_CONFIGS.
 *
 * @route /demos/[demoId]
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import {
  DemoError,
  DemoLayout,
  DemoLoading,
} from "@/components/demos/demo-layout";
import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import DemoSkeleton from "@/components/demos/DemoSkeleton";
import { Header } from "@/components/header";
import { getDemoConfig, getAllDemoIds } from "@/lib/demos/config";
import type { DemoConfig } from "@/types/demos";

interface DemoPageProps {
  demoConfig: DemoConfig | null;
}

export default function DynamicDemoPage({ demoConfig }: DemoPageProps) {
  const router = useRouter();
  const { i18n } = useLingui();
  const theme = useTheme();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo content
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner during fallback
  if (router.isFallback) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "monochrome.100",
        }}
      >
        <Header />
        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          <DemoLoading
            message={i18n._(
              defineMessage({
                id: "demos.dynamic.loading",
                message: "Loading demo...",
              })
            )}
          />
        </Container>
      </Box>
    );
  }

  // Show error message if demo config not found
  if (!demoConfig) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "monochrome.100",
        }}
      >
        <Header />
        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          <DemoError
            error={i18n._(
              defineMessage({
                id: "demos.dynamic.not-found",
                message:
                  "Demo not found. The requested demo configuration does not exist.",
              })
            )}
          />
        </Container>
      </Box>
    );
  }

  const title = demoConfig.title[locale] || demoConfig.title.en;
  const description =
    demoConfig.description[locale] || demoConfig.description.en;

  // Show skeleton while loading
  if (isLoading) {
    return (
      <DemoLayout
        title={`${demoConfig.icon} ${title}`}
        description={description}
      >
        <DemoSkeleton variant="chart" chartHeight={400} />
      </DemoLayout>
    );
  }

  return (
    <DemoLayout title={`${demoConfig.icon} ${title}`} description={description}>
      <DemoErrorBoundary>
        {/* Coming Soon Banner */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <CardContent
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Chip
              label={locale === "sr" ? "Uskoro dostupno" : "Coming Soon"}
              color="info"
              size="small"
              sx={{ mb: 2, fontWeight: 600 }}
            />

            <Box sx={{ fontSize: "3rem", mb: 1, opacity: 0.7 }}>
              {demoConfig.icon}
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {title}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 480, mb: 2 }}
            >
              {locale === "sr"
                ? "Ova vizualizacija je u razvoju. Za kompletne interaktivne primere koristite galeriju, showcase ili playground."
                : "This visualization is under development. For complete interactive examples, use the gallery, showcase, or playground."}
            </Typography>

            {/* Tags */}
            {demoConfig.tags && demoConfig.tags.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {demoConfig.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Chart Type */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                {locale === "sr" ? "Tip grafikona" : "Chart type"}:
              </Typography>
              <Chip
                label={demoConfig.chartType}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "capitalize",
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Explore Interactive Pages */}
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <CardContent
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {locale === "sr"
                ? "Istražite interaktivne stranice"
                : "Explore interactive pages"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {locale === "sr"
                ? "Koristite sledeće stranice za funkcionalne grafikone i ugrađivanje:"
                : "Use these pages for fully functional charts and embedding:"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                component={Link}
                href="/demos/showcase"
                variant="contained"
                startIcon={<span>←</span>}
              >
                {locale === "sr" ? "Demo showcase" : "Demo showcase"}
              </Button>
              <Button
                component={Link}
                href="/demos/playground"
                variant="outlined"
              >
                {locale === "sr"
                  ? "Interaktivni playground"
                  : "Interactive playground"}
              </Button>
              <Button component={Link} href="/topics" variant="outlined">
                {locale === "sr" ? "Teme i dataseti" : "Topics and datasets"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </DemoErrorBoundary>
    </DemoLayout>
  );
}

/**
 * Generate static paths for all demo IDs
 */
export async function getStaticPaths() {
  const demoIds = getAllDemoIds();

  const paths = demoIds.map((id) => ({
    params: { demoId: id },
  }));

  return {
    paths,
    fallback: true, // Enable fallback for future demos
  };
}

/**
 * Get static props for a specific demo
 */
export async function getStaticProps({
  params,
}: {
  params: { demoId: string };
}) {
  const demoConfig = getDemoConfig(params.demoId);

  // Return 404 if demo doesn't exist
  if (!demoConfig) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      demoConfig,
    },
  };
}
