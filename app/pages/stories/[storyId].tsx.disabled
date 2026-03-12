import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Container, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { StoryContainer } from "@/components/stories";
import { StoryLayout } from "@/components/stories/StoryLayout";
import { ALL_STORIES } from "@/lib/stories";

// Create a lookup object for stories
const stories = Object.fromEntries(
  ALL_STORIES.map((story) => [story.id, story])
) as Record<string, (typeof ALL_STORIES)[number]>;

export default function StoryPage() {
  const { i18n } = useLingui();
  const router = useRouter();
  const { storyId } = router.query;

  const story = useMemo(() => {
    if (typeof storyId !== "string") return null;
    return stories[storyId] || null;
  }, [storyId]);

  if (!story) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          {i18n._(
            defineMessage({
              id: "stories.notFound",
              message: "Story Not Found",
            })
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {i18n._(
            defineMessage({
              id: "stories.notFoundDesc",
              message: "The story you're looking for doesn't exist.",
            })
          )}
        </Typography>
      </Container>
    );
  }

  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const title = story.title[locale];
  const description = story.description[locale];

  return (
    <>
      <Head>
        <title>{title} | Vizualni Admin</title>
        <meta name="description" content={description} />
      </Head>
      <StoryLayout title={title} description={description}>
        <StoryContainer storyId={story.id} config={story as any} />
      </StoryLayout>
    </>
  );
}

export async function getStaticPaths() {
  const paths = ALL_STORIES.map((story) => ({
    params: { storyId: story.id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
