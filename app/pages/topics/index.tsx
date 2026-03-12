// app/pages/topics/index.tsx
import { promises as fs } from "fs";
import path from "path";

import { Container, Typography, Grid, Box } from "@mui/material";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";

import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import DemoSkeleton from "@/components/demos/DemoSkeleton";
import { AppLayout } from "@/components/layout";
import { TopicCard } from "@/components/topics/TopicCard";
import topicIndex from "@/data/topics/index.json";
import { useLocale } from "@/locales/use-locale";
import type { Topic, TopicIndex } from "@/types/topics";

interface TopicsPageProps {
  topics: Topic[];
}

export default function TopicsPage({ topics }: TopicsPageProps) {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for topic cards
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const pageTitle =
    locale === "sr-Cyrl"
      ? "Истражите отворене податке | Vizualni Admin"
      : locale === "sr-Latn"
        ? "Istražite otvorene podatke | Vizualni Admin"
        : "Explore Open Data | Vizualni Admin";

  const heading =
    locale === "sr-Cyrl"
      ? "Истражите отворене податке"
      : locale === "sr-Latn"
        ? "Istražite otvorene podatke"
        : "Explore Open Data";

  const subheading =
    locale === "sr-Cyrl"
      ? "Пронађите скупове података по категоријама и визуализујте их"
      : locale === "sr-Latn"
        ? "Pronađite skupove podataka po kategorijama i vizualizujte ih"
        : "Find datasets by category and visualize them";

  // Show skeleton while loading
  if (isLoading) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={subheading} />
        </Head>
        <AppLayout>
          <Container sx={{ py: 6 }}>
            <DemoSkeleton variant="cards" cards={6} showChart={false} />
          </Container>
        </AppLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={subheading} />
      </Head>
      <AppLayout>
        <Container sx={{ py: 6 }}>
          <DemoErrorBoundary>
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {heading}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {subheading}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {topics.map((topic) => (
                <Grid item xs={12} sm={6} md={4} key={topic.id}>
                  <TopicCard topic={topic} locale={locale} />
                </Grid>
              ))}
            </Grid>
          </DemoErrorBoundary>
        </Container>
      </AppLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<TopicsPageProps> = async ({
  locale: _locale,
}) => {
  const data = topicIndex as TopicIndex;
  const topicDataDir = path.join(process.cwd(), "app", "data", "topics");

  const topicsWithDatasetCounts = await Promise.all(
    data.topics.map(async (topic) => {
      try {
        const topicFile = path.join(topicDataDir, `${topic.id}.json`);
        const raw = await fs.readFile(topicFile, "utf8");
        const parsed = JSON.parse(raw) as { datasets?: unknown[] };
        const datasetCount = Array.isArray(parsed.datasets)
          ? parsed.datasets.length
          : topic.datasetCount;

        return { ...topic, datasetCount };
      } catch {
        return topic;
      }
    })
  );

  return {
    props: {
      topics: topicsWithDatasetCounts,
    },
  };
};
