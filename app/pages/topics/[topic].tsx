// app/pages/topics/[topic].tsx
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout";
import { DatasetCard } from "@/components/topics/DatasetCard";
import topicIndex from "@/data/topics/index.json";
import type {
  TopicData,
  TopicIndex,
  LocalizedString,
  Visualization,
} from "@/types/topics";

interface TopicPageProps {
  topic: TopicData;
}

function getLocalizedText(text: LocalizedString, locale: string): string {
  if (locale === "sr") return text.sr;
  if (locale === "sr-Latn") return text["sr-Latn"] || text.sr;
  return text.en;
}

const chartTypeIcons: Record<string, string> = {
  bar: "📊",
  line: "📈",
  pie: "🥧",
  area: "📉",
  column: "📊",
};

function VisualizationCard({
  viz,
  locale,
}: {
  viz: Visualization;
  locale: string;
}) {
  const title = getLocalizedText(viz.title, locale);
  const description = getLocalizedText(viz.description, locale);
  const icon = chartTypeIcons[viz.chartType] || "📊";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px rgba(14, 165, 233, 0.2)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ fontSize: "2.5rem", mb: 2, textAlign: "center" }}>
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={viz.chartType.toUpperCase()}
            size="small"
            sx={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
              color: "white",
              fontWeight: 600,
            }}
          />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Link
          href={viz.embedUrl || `/playground?type=${viz.chartType}`}
          passHref
          legacyBehavior
        >
          <Button
            component="a"
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {locale === "sr" ? "Отвори визуализацију" : "Open Visualization"}
          </Button>
        </Link>
      </Box>
    </Card>
  );
}

export default function TopicPage({ topic }: TopicPageProps) {
  const router = useRouter();
  const locale = (router.locale || "sr") as string;

  const title = getLocalizedText(topic.title, locale);
  const description = getLocalizedText(topic.description, locale);

  const pageTitle = `${title} | Vizualni Admin`;

  const backLabel =
    locale === "sr" ? "Теме" : locale === "sr-Latn" ? "Teme" : "Topics";

  const datasetsLabel =
    locale === "sr"
      ? "Скупови података"
      : locale === "sr-Latn"
        ? "Skupovi podataka"
        : "Datasets";

  const visualizationsLabel =
    locale === "sr"
      ? "Визуализације"
      : locale === "sr-Latn"
        ? "Vizualizacije"
        : "Visualizations";

  const exploreAllLabel =
    locale === "sr"
      ? "Истражите све скупове података"
      : locale === "sr-Latn"
        ? "Istražite sve skupove podataka"
        : "Explore all datasets";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
      </Head>
      <AppLayout>
        <Container sx={{ py: 6 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/topics" passHref legacyBehavior>
              <MuiLink
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
              >
                {backLabel}
              </MuiLink>
            </Link>
            <Typography color="text.primary">{title}</Typography>
          </Breadcrumbs>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {description}
            </Typography>
          </Box>

          {/* Visualizations Section */}
          {topic.visualizations && topic.visualizations.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography variant="h5" component="h2">
                  {visualizationsLabel}
                </Typography>
                <Link href="/demos/playground" passHref legacyBehavior>
                  <Button
                    component="a"
                    variant="text"
                    color="primary"
                    sx={{ textTransform: "none" }}
                  >
                    🎮{" "}
                    {locale === "sr"
                      ? "Интерактивни playground"
                      : "Interactive Playground"}
                  </Button>
                </Link>
              </Box>
              <Grid container spacing={3}>
                {topic.visualizations.map((viz) => (
                  <Grid item xs={12} sm={6} md={4} key={viz.id}>
                    <VisualizationCard viz={viz} locale={locale} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Datasets Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2">
              {datasetsLabel}
            </Typography>
          </Box>

          <Box>
            {topic.datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} locale={locale} />
            ))}
          </Box>

          {/* Explore All CTA */}
          <Box
            sx={{
              mt: 5,
              p: 4,
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {locale === "sr"
                ? "Желите да видите више скупова података?"
                : "Want to see more datasets?"}
            </Typography>
            <Link href="/browse" passHref legacyBehavior>
              <Button
                component="a"
                variant="contained"
                color="primary"
                size="large"
                sx={{ textTransform: "none", fontWeight: 600, px: 4 }}
              >
                {exploreAllLabel}
              </Button>
            </Link>
          </Box>
        </Container>
      </AppLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = topicIndex as TopicIndex;
  const paths = data.topics.map((topic) => ({
    params: { topic: topic.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TopicPageProps> = async ({
  params,
  locale: _locale,
}) => {
  const topicId = params?.topic as string;

  try {
    const topicData = require(`@/data/topics/${topicId}.json`) as TopicData;

    return {
      props: {
        topic: topicData,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
