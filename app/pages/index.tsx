import { t, Trans } from "@lingui/macro";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { GetStaticProps } from "next";
import Link from "next/link";
import { type ReactNode } from "react";

import { ContentMDXProvider } from "@/components/content-mdx-provider";
import { staticPages } from "@/static-pages";

/**
 * TODO: this page can be combined with [slug].tsx into [[...slug]].tsx,
 * once these issues are resolved:
 *
 * - https://github.com/vercel/next.js/issues/19934
 * - https://github.com/vercel/next.js/issues/19950
 *
 */

interface ContentPageProps {
  staticPage: string;
}

const SectionShell = ({
  children,
  background = "background.paper",
}: {
  children: ReactNode;
  background?: string;
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        px: { xs: 2, md: 5 },
        py: { xs: 8, md: 10 },
        backgroundColor: background,
      }}
    >
      <Box
        sx={{
          maxWidth: 1160,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 4, md: 6 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const TutorialsSection = () => {
  const tutorials = [
    {
      title: t({
        id: "home.tutorials.gettingStarted.title",
        message: "Getting Started",
      }),
      description: t({
        id: "home.tutorials.gettingStarted.description",
        message: "Learn the basics of using Vizualni Admin",
      }),
      link: "/docs/getting-started",
      icon: "🚀",
    },
    {
      title: t({
        id: "home.tutorials.chartTypes.title",
        message: "Chart Types",
      }),
      description: t({
        id: "home.tutorials.chartTypes.description",
        message: "Explore different chart types",
      }),
      link: "/docs/chart-types-guide",
      icon: "📊",
    },
    {
      title: t({ id: "home.tutorials.embedding.title", message: "Embedding" }),
      description: t({
        id: "home.tutorials.embedding.description",
        message: "How to embed visualizations on your site",
      }),
      link: "/docs/embedding-guide",
      icon: "🔗",
    },
    {
      title: t({ id: "home.tutorials.apiGuide.title", message: "API Guide" }),
      description: t({
        id: "home.tutorials.apiGuide.description",
        message: "Using the data.gov.rs API",
      }),
      link: "/docs/data-gov-rs-guide",
      icon: "📡",
    },
  ];

  return (
    <SectionShell>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: 2, color: "text.secondary" }}
        >
          <Trans id="home.tutorials.label">Knowledge</Trans>
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
          <Trans id="home.tutorials.title">Learn and Explore</Trans>
        </Typography>
        <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
          <Trans id="home.tutorials.subtitle">
            Discover our tutorials and guides for creating amazing visualizations
          </Trans>
        </Typography>
      </Box>
      <Grid container spacing={3.5}>
        {tutorials.map((tutorial, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(12,64,118,0.04), rgba(12,64,118,0.01))",
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "left", p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                    display: "grid",
                    placeItems: "center",
                    color: "primary.contrastText",
                    mb: 2,
                    fontSize: 22,
                    boxShadow: "0 10px 30px rgba(12,64,118,0.2)",
                  }}
                >
                  {tutorial.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {tutorial.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tutorial.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
                <Button
                  size="small"
                  component={Link}
                  href={tutorial.link}
                  variant="text"
                  sx={{ fontWeight: 600, textTransform: "none" }}
                >
                  <Trans id="home.tutorials.learnMore">Learn More</Trans>
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </SectionShell>
  );
};

const HeroSection = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;

  return (
    <SectionShell background="linear-gradient(135deg, #0b1a2d, #0e2a45)">
      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        alignItems="center"
        sx={{ color: "white" }}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.85 }}>
            <Trans id="home.hero.overline">Visualize open data</Trans>
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              mt: 2,
            }}
          >
            <Trans id="home.hero.title">
              Get to insights from Serbian open data faster
            </Trans>
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 2.5, maxWidth: 540 }}>
            <Trans id="home.hero.description">
              Browse data.gov.rs, pick a dataset, and craft visualizations you can
              share or embed instantly.
            </Trans>
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/browse"
              sx={{
                minWidth: 180,
                py: 1.25,
                fontWeight: 700,
                boxShadow: "0 12px 30px rgba(12,64,118,0.4)",
              }}
            >
              <Trans id="home.hero.browseButton">Browse datasets</Trans>
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              href="/docs/getting-started"
              sx={{
                minWidth: 180,
                py: 1.25,
                borderColor: "rgba(255,255,255,0.4)",
                color: "white",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <Trans id="home.hero.guideButton">Start guide</Trans>
            </Button>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 4, opacity: 0.9 }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#4ade80",
                  boxShadow: "0 0 0 6px rgba(74,222,128,0.2)",
                }}
              />
              <Typography variant="body2" sx={{ color: "white" }}>
                <Trans id="home.hero.trusted">Data from trusted sources</Trans>
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#60a5fa",
                  boxShadow: "0 0 0 6px rgba(96,165,250,0.2)",
                }}
              />
              <Typography variant="body2" sx={{ color: "white" }}>
                <Trans id="home.hero.embeds">Tailored visuals and embeds</Trans>
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.12)",
              p: 3,
              minHeight: 360,
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 400 260"
              sx={{
                width: "100%",
                height: "100%",
                color: "white",
                display: "block",
              }}
            >
              <defs>
                <linearGradient id="vizGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3BD6C6" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <rect
                x="16"
                y="20"
                width="368"
                height="220"
                rx="16"
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.15)"
              />
              <polyline
                points="40,190 90,150 140,170 190,120 240,140 290,80 340,110"
                fill="none"
                stroke="url(#vizGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g fill="rgba(255,255,255,0.7)">
                <circle cx="90" cy="150" r="6" />
                <circle cx="140" cy="170" r="6" />
                <circle cx="190" cy="120" r="6" />
                <circle cx="240" cy="140" r="6" />
                <circle cx="290" cy="80" r="6" />
                <circle cx="340" cy="110" r="6" />
              </g>
              <rect x="52" y="50" width="296" height="18" rx="6" fill="rgba(255,255,255,0.1)" />
              <rect x="52" y="78" width="220" height="10" rx="5" fill="rgba(255,255,255,0.14)" />
              <rect x="52" y="210" width="140" height="12" rx="6" fill="rgba(59,214,198,0.5)" />
              <rect x="200" y="210" width="110" height="12" rx="6" fill="rgba(255,255,255,0.2)" />
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 24,
                right: 24,
                px: 2,
                py: 1,
                borderRadius: 999,
                backgroundColor: "rgba(12,64,118,0.2)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white",
                fontWeight: 700,
                letterSpacing: 0.4,
              }}
            >
              <Trans id="home.hero.badge">Open data</Trans>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SectionShell>
  );
};

export default function ContentPage({ staticPage }: ContentPageProps) {
  const Component = staticPages[staticPage]?.component;
  const isHomePage = staticPage === "/sr/index" || staticPage === "/en/index";

  return (
    <ContentMDXProvider>
      {isHomePage && <HeroSection />}
      {Component ? <Component /> : "NOT FOUND"}
      {isHomePage && <TutorialsSection />}
    </ContentMDXProvider>
  );
}

export const getStaticProps: GetStaticProps<ContentPageProps> = async ({
  locale,
}) => {
  // When i18n is disabled (e.g., for GitHub Pages), use the default locale
  const actualLocale = locale || "sr";
  const path = `/${actualLocale}/index`;

  // FIXME: this check should not be needed when fallback: false can be used
  const pageExists = !!staticPages[path];

  if (!pageExists) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      staticPage: path,
    },
  };
};
