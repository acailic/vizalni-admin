/**
 * Dynamic Demo Page
 *
 * Renders demo charts using live data from data.gov.rs with resilient fallback
 * datasets, so demo routes remain functional on static deployments.
 *
 * @route /demos/[demoId]
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { ChartVisualizer } from "@/components/demos/ChartVisualizer";
import {
  DemoError,
  DemoLayout,
  DemoLoading,
} from "@/components/demos/demo-layout";
import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import DemoSkeleton from "@/components/demos/DemoSkeleton";
import { Header } from "@/components/header";
import { useDataGovRs } from "@/hooks/use-data-gov-rs";
import { getDemoConfig, getAllDemoIds } from "@/lib/demos/config";
import { DEMO_FALLBACKS } from "@/lib/demos/fallbacks";
import { getValidatedDatasetIds } from "@/lib/demos/validated-datasets";
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const fallbackInfo = useMemo(() => {
    const demoId = demoConfig?.id;
    if (!demoId) return undefined;

    const fallbackDatasetInfo = DEMO_FALLBACKS[demoId]?.fallbackDatasetInfo;
    if (!fallbackDatasetInfo) return undefined;

    const localizedFallbackTitle =
      locale === "sr"
        ? fallbackDatasetInfo.title
        : `${demoConfig?.title.en ?? "Demo dataset"} (sample data)`;

    return {
      title: localizedFallbackTitle,
      organization: {
        id: "demo-org",
        name: fallbackDatasetInfo.organization ?? "Demo data.gov.rs",
        title: fallbackDatasetInfo.organization ?? "Demo data.gov.rs",
      },
    };
  }, [demoConfig, locale]);

  const {
    data,
    dataset,
    loading: dataLoading,
    error,
    usingFallback,
    fallbackReason,
    fallbackError,
    refetch,
  } = useDataGovRs({
    searchQuery: demoConfig?.searchQuery,
    preferredDatasetIds: demoConfig
      ? getValidatedDatasetIds(demoConfig.id)
      : [],
    preferredTags: demoConfig?.preferredTags,
    slugKeywords: demoConfig?.slugKeywords,
    fallbackData: demoConfig
      ? DEMO_FALLBACKS[demoConfig.id]?.fallbackData
      : undefined,
    fallbackDatasetInfo: fallbackInfo,
    autoFetch: Boolean(demoConfig),
  });

  const chartData = useMemo(
    () =>
      Array.isArray(data)
        ? data.filter((row) => row && typeof row === "object")
        : [],
    [data]
  );

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
  const normalizedTitle = title.startsWith(demoConfig.icon)
    ? title.slice(demoConfig.icon.length).trimStart()
    : title;
  const displayTitle = `${demoConfig.icon} ${normalizedTitle}`;
  const fallbackNotice =
    usingFallback && fallbackReason
      ? {
          severity:
            fallbackReason === "fetch-error"
              ? ("warning" as const)
              : ("info" as const),
          title:
            locale === "sr"
              ? "Prikazujemo demo podatke"
              : "Showing demo fallback data",
          message:
            fallbackReason === "static-export"
              ? locale === "sr"
                ? "Ova GitHub Pages verzija nema serverski pristup API-ju data.gov.rs, pa koristimo ugrađen primer podataka da stranica ostane funkcionalna."
                : "This GitHub Pages build cannot fetch live data from data.gov.rs, so the page uses built-in sample data to stay functional."
              : fallbackReason === "dataset-unavailable"
                ? locale === "sr"
                  ? "Nismo pronašli odgovarajući dataset za ovu temu, pa prikazujemo reprezentativan demo skup podataka."
                  : "We could not find a matching live dataset for this topic, so a representative demo dataset is shown instead."
                : fallbackReason === "resource-unavailable"
                  ? locale === "sr"
                    ? "Dataset je pronađen, ali nema resurs pogodan za vizualizaciju, zato prikazujemo demo podatke."
                    : "A dataset was found, but it does not expose a resource suitable for visualization, so demo data is shown instead."
                  : locale === "sr"
                    ? "Živi podaci trenutno nisu dostupni. Demo podaci ostaju prikazani dok ponovni pokušaj ne uspe."
                    : "Live data is temporarily unavailable. Demo data stays visible until a retry succeeds.",
          detail:
            fallbackReason === "fetch-error" && fallbackError
              ? locale === "sr"
                ? `Razlog poslednjeg neuspelog pokušaja: ${fallbackError.message}`
                : `Last live-data error: ${fallbackError.message}`
              : null,
        }
      : null;
  const refreshDisabled = usingFallback && fallbackReason === "static-export";

  if (isLoading) {
    return (
      <DemoLayout title={displayTitle} description={description}>
        <DemoSkeleton variant="chart" chartHeight={400} />
      </DemoLayout>
    );
  }

  return (
    <DemoLayout title={displayTitle} description={description}>
      <DemoErrorBoundary>
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {normalizedTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  color={usingFallback ? "warning" : "success"}
                  label={
                    usingFallback
                      ? locale === "sr"
                        ? "Fallback podaci"
                        : "Fallback data"
                      : locale === "sr"
                        ? "Živi podaci"
                        : "Live data"
                  }
                />
              </Stack>

              <Stack direction="row" gap={1} flexWrap="wrap">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => refetch()}
                  disabled={refreshDisabled}
                >
                  {refreshDisabled
                    ? locale === "sr"
                      ? "Živi refresh nije dostupan"
                      : "Live refresh unavailable"
                    : locale === "sr"
                      ? "Osveži podatke"
                      : "Refresh data"}
                </Button>
                {dataset?.page ? (
                  <Button
                    size="small"
                    variant="outlined"
                    component="a"
                    href={dataset.page}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {locale === "sr"
                      ? "Dataset na data.gov.rs"
                      : "Dataset on data.gov.rs"}
                  </Button>
                ) : null}
                <Button
                  size="small"
                  component={Link}
                  href="/demos"
                  variant="text"
                >
                  {locale === "sr" ? "Nazad u galeriju" : "Back to gallery"}
                </Button>
              </Stack>

              {dataset ? (
                <Typography variant="caption" color="text.secondary">
                  {dataset.title}
                  {dataset.organization?.title || dataset.organization?.name
                    ? ` - ${dataset.organization?.title || dataset.organization?.name}`
                    : ""}
                </Typography>
              ) : null}
            </Stack>
          </CardContent>
        </Card>

        {fallbackNotice ? (
          <Alert
            severity={fallbackNotice.severity}
            sx={{ mb: 3, borderRadius: 3 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              {fallbackNotice.title}
            </Typography>
            <Typography variant="body2">{fallbackNotice.message}</Typography>
            {fallbackNotice.detail ? (
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                {fallbackNotice.detail}
              </Typography>
            ) : null}
          </Alert>
        ) : null}

        {dataLoading && chartData.length === 0 ? (
          <DemoLoading
            message={
              locale === "sr"
                ? "Učitavanje podataka i grafikona..."
                : "Loading data and chart..."
            }
          />
        ) : error && chartData.length === 0 ? (
          <DemoError error={error.message} />
        ) : chartData.length > 0 ? (
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <ChartVisualizer
                data={chartData}
                chartType={demoConfig.chartType}
                title={
                  locale === "sr"
                    ? "Interaktivna vizualizacija"
                    : "Interactive visualization"
                }
              />
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">
            {locale === "sr"
              ? "Nema dostupnih podataka za prikaz za ovu vizualizaciju."
              : "No data is currently available for this visualization."}
          </Alert>
        )}
      </DemoErrorBoundary>
    </DemoLayout>
  );
}

/**
 * Generate static paths for all demo IDs
 */
export async function getStaticPaths() {
  const demoIds = getAllDemoIds().filter((id) => id !== "demographics");

  const paths = demoIds.map((id) => ({
    params: { demoId: id },
  }));

  return {
    paths,
    fallback: true,
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
