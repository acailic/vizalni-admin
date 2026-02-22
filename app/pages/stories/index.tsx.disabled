import { useLingui } from "@lingui/react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Link from "next/link";

import { StoryCard } from "@/components/stories/StoryCard";
import { StoryLayout } from "@/components/stories/StoryLayout";
import { ALL_STORIES } from "@/lib/stories";

export default function StoriesIndexPage() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const pageTitle =
    locale === "sr"
      ? "Interaktivne Priče iz Podataka"
      : "Interactive Data Stories";

  const pageDescription =
    locale === "sr"
      ? "Istražite ključne teme o Srbiji kroz angažirajuće priče zasnovane na stvarnim podacima."
      : "Explore key topics about Serbia through engaging stories based on real data.";

  return (
    <StoryLayout title={pageTitle} description={pageDescription}>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 6,
          p: 5,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0ea5e9 100%)",
          borderRadius: 4,
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          {locale === "sr" ? "📊 Priče iz Podataka" : "📊 Data Stories"}
        </Typography>
        <Typography
          variant="body1"
          sx={{ opacity: 0.9, maxWidth: 600, mx: "auto" }}
        >
          {locale === "sr"
            ? "Otkrijte ključne trenutke u razvoju Srbije kroz interaktivne priče zasnovane na stvarnim podacima sa data.gov.rs"
            : "Discover key moments in Serbia's development through interactive stories based on real data from data.gov.rs"}
        </Typography>
      </Box>

      {/* Stories Grid */}
      <Grid container spacing={3}>
        {ALL_STORIES.map((story) => (
          <Grid item xs={12} sm={6} md={3} key={story.id}>
            <StoryCard story={story as any} href={`/stories/${story.id}`} />
          </Grid>
        ))}
      </Grid>

      {/* CTA */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          {locale === "sr"
            ? "Želite da kreirate svoju priču?"
            : "Want to create your own story?"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Naš paket vam omogućava da kreirate interaktivne vizualizacije za vaše podatke."
            : "Our package enables you to create interactive visualizations for your data."}
        </Typography>
        <Link href="/docs" passHref legacyBehavior>
          <Button variant="outlined" component="a">
            {locale === "sr" ? "Dokumentacija" : "Documentation"}
          </Button>
        </Link>
      </Box>
    </StoryLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
