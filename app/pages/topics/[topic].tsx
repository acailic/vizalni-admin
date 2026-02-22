// app/pages/topics/[topic].tsx
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout";
import { DatasetCard } from "@/components/topics/DatasetCard";
import topicIndex from "@/data/topics/index.json";
import type { TopicData, TopicIndex, LocalizedString } from "@/types/topics";

interface TopicPageProps {
  topic: TopicData;
}

function getLocalizedText(text: LocalizedString, locale: string): string {
  if (locale === "sr") return text.sr;
  if (locale === "sr-Latn") return text["sr-Latn"] || text.sr;
  return text.en;
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
  locale,
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
