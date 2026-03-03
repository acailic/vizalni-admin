// app/pages/topics/index.tsx
import { Container, Typography, Grid, Box } from "@mui/material";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout";
import { TopicCard } from "@/components/topics/TopicCard";
import topicIndex from "@/data/topics/index.json";
import type { Topic, TopicIndex } from "@/types/topics";

interface TopicsPageProps {
  topics: Topic[];
}

export default function TopicsPage({ topics }: TopicsPageProps) {
  const router = useRouter();
  const locale = (router.locale || "sr") as string;

  const pageTitle =
    locale === "sr"
      ? "Истражите отворене податке | Vizualni Admin"
      : locale === "sr-Latn"
        ? "Istražite otvorene podatke | Vizualni Admin"
        : "Explore Open Data | Vizualni Admin";

  const heading =
    locale === "sr"
      ? "Истражите отворене податке"
      : locale === "sr-Latn"
        ? "Istražite otvorene podatke"
        : "Explore Open Data";

  const subheading =
    locale === "sr"
      ? "Пронађите скупове података по категоријама и визуализујте их"
      : locale === "sr-Latn"
        ? "Pronađite skupove podataka po kategorijama i vizualizujte ih"
        : "Find datasets by category and visualize them";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={subheading} />
      </Head>
      <AppLayout>
        <Container sx={{ py: 6 }}>
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
        </Container>
      </AppLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<TopicsPageProps> = async ({
  locale: _locale,
}) => {
  const data = topicIndex as TopicIndex;

  return {
    props: {
      topics: data.topics,
    },
  };
};
