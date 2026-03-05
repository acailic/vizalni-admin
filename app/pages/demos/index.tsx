import { useLingui } from "@lingui/react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DemoLayout } from "@/components/demos/demo-layout";
import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import DemoSkeleton from "@/components/demos/DemoSkeleton";
import { DEMO_CONFIGS } from "@/lib/demos/config";

export default function DemosIndex() {
  const { i18n } = useLingui();
  const theme = useTheme();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo cards
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const pageTitle =
    locale === "sr" ? "Demo vizualizacije" : "Demo Visualizations";
  const pageDescription =
    locale === "sr"
      ? "Istražite dostupne i najavljene vizualizacije otvorenih podataka Srbije"
      : "Explore live and upcoming visualizations of Serbian open data";
  const heroTitle =
    locale === "sr"
      ? "Vizualizacije otvorenih podataka Srbije"
      : "Serbian Open Data Visualizations";
  const heroIntro =
    locale === "sr"
      ? "Istražite kurirane interaktivne primere zasnovane na otvorenim podacima Republike Srbije."
      : "Explore curated, interactive examples powered by Republic of Serbia open data.";
  const heroBody =
    locale === "sr"
      ? "Počnite od showcase strane, zatim nastavite kroz teme, datasete i interaktivni playground."
      : "Start with the showcase, then continue through topics, datasets, and the interactive playground.";
  const primaryCta = locale === "sr" ? "Otvori Showcase" : "Open Showcase";
  const topicsCta = locale === "sr" ? "Istraži Teme" : "Explore Topics";
  const browseCta = locale === "sr" ? "Pregledaj Datasete" : "Browse Datasets";
  const playgroundCta =
    locale === "sr" ? "Otvori Playground" : "Open Playground";
  const toolsTitle =
    locale === "sr" ? "Interaktivni alati" : "Interactive Tools";
  const atGlanceTitle = locale === "sr" ? "Na prvi pogled" : "At a glance";
  const comingSoonTitle = locale === "sr" ? "Uskoro" : "Coming Soon";
  const comingSoonDescription =
    locale === "sr"
      ? "Naredne demonstracije su planirane i biće objavljene čim budu spremne."
      : "The next demo categories are planned and will be released when ready.";
  const liveStatusLabel = locale === "sr" ? "Uživo" : "Live";
  const comingSoonStatusLabel = locale === "sr" ? "Uskoro" : "Coming soon";
  const aboutTitle = locale === "sr" ? "O ovoj stranici" : "About this page";
  const aboutParagraph1 =
    locale === "sr"
      ? "Ove vizualizacije koriste podatke sa zvaničnog portala otvorenih podataka Republike Srbije (data.gov.rs). Podaci se učitavaju direktno kroz API."
      : "These visualizations use real data from the Republic of Serbia open data portal (data.gov.rs). Data is loaded in real-time directly from the API.";
  const aboutParagraph2 =
    locale === "sr"
      ? "Projekat je razvijen u Next.js okruženju i optimizovan za statičku isporuku na GitHub Pages."
      : "The project is built with Next.js and optimized for GitHub Pages deployment with static export.";
  const statsAvailable =
    locale === "sr" ? "Dostupni demo primeri" : "Available Demos";
  const statsResources =
    locale === "sr" ? "Resursi na data.gov.rs" : "Resources on data.gov.rs";
  const statsOrganizations = locale === "sr" ? "Organizacije" : "Organizations";

  const comingSoonItems =
    locale === "sr"
      ? [
          {
            id: "air",
            icon: "🌍",
            title: "Kvalitet vazduha",
            description: "Praćenje zagađenja i trendova po regionima.",
          },
          {
            id: "budget",
            icon: "💰",
            title: "Budžet Republike Srbije",
            description:
              "Poređenje rashoda i prihoda kroz institucije i godine.",
          },
          {
            id: "environment",
            icon: "🌿",
            title: "Zaštita životne sredine",
            description: "Indikatori otpada, vode i ekologije.",
          },
          {
            id: "demographics",
            icon: "👥",
            title: "Demografija",
            description: "Kretanje stanovništva po opštinama i starosti.",
          },
          {
            id: "education",
            icon: "🎓",
            title: "Obrazovanje",
            description: "Upis, ishodi i raspodela obrazovnih ustanova.",
          },
          {
            id: "traffic",
            icon: "🚦",
            title: "Bezbednost saobraćaja",
            description: "Nezgode, učesnici i trendovi kroz vreme.",
          },
        ]
      : [
          {
            id: "air",
            icon: "🌍",
            title: "Air Quality",
            description: "Pollution levels and trend monitoring by region.",
          },
          {
            id: "budget",
            icon: "💰",
            title: "Republic of Serbia Budget",
            description:
              "Spending and revenue comparisons across institutions.",
          },
          {
            id: "environment",
            icon: "🌿",
            title: "Environment",
            description: "Waste, water, and sustainability indicators.",
          },
          {
            id: "demographics",
            icon: "👥",
            title: "Demographics",
            description: "Population movement by municipality and age.",
          },
          {
            id: "education",
            icon: "🎓",
            title: "Education Outcomes",
            description: "Enrollment, outcomes, and school distribution.",
          },
          {
            id: "traffic",
            icon: "🚦",
            title: "Traffic Safety",
            description: "Incidents, participants, and historical trends.",
          },
        ];

  // Show skeleton while loading
  if (isLoading) {
    return (
      <DemoLayout
        title={pageTitle}
        description={pageDescription}
        hideBackButton
      >
        <DemoSkeleton variant="cards" cards={6} showChart={false} />
      </DemoLayout>
    );
  }

  return (
    <DemoLayout title={pageTitle} description={pageDescription} hideBackButton>
      <DemoErrorBoundary>
        <Box
          sx={{
            mb: 6,
            p: 5,
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0ea5e9 100%)",
            borderRadius: 4,
            color: "white",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.3)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.4,
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
            >
              {heroTitle}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ textAlign: "center", fontSize: "1.1rem", opacity: 0.95 }}
            >
              {heroIntro}
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", opacity: 0.9 }}
            >
              {heroBody}
            </Typography>
            <Box
              sx={{
                mt: 4,
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Link href="/demos/showcase" passHref legacyBehavior>
                <Button
                  component="a"
                  variant="contained"
                  sx={{
                    bgcolor: "white",
                    color: "#0f172a",
                    fontWeight: 700,
                    px: 2.5,
                    "&:hover": { bgcolor: alpha("#fff", 0.9) },
                    "&:focus-visible": {
                      outline: "3px solid rgba(255,255,255,0.7)",
                      outlineOffset: 2,
                    },
                  }}
                >
                  {primaryCta}
                </Button>
              </Link>
              <Link href="/topics" passHref legacyBehavior>
                <Button
                  component="a"
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    fontWeight: 700,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: alpha("#fff", 0.1),
                    },
                    "&:focus-visible": {
                      outline: "3px solid rgba(255,255,255,0.7)",
                      outlineOffset: 2,
                    },
                  }}
                >
                  {topicsCta}
                </Button>
              </Link>
              <Link href="/browse" passHref legacyBehavior>
                <Button
                  component="a"
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    fontWeight: 700,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: alpha("#fff", 0.1),
                    },
                    "&:focus-visible": {
                      outline: "3px solid rgba(255,255,255,0.7)",
                      outlineOffset: 2,
                    },
                  }}
                >
                  {browseCta}
                </Button>
              </Link>
              <Link href="/demos/playground" passHref legacyBehavior>
                <Button
                  component="a"
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    fontWeight: 700,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: alpha("#fff", 0.1),
                    },
                    "&:focus-visible": {
                      outline: "3px solid rgba(255,255,255,0.7)",
                      outlineOffset: 2,
                    },
                  }}
                >
                  {playgroundCta}
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 1, mb: 6 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
          >
            {atGlanceTitle}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {Object.keys(DEMO_CONFIGS).length}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 500 }}
                >
                  {statsAvailable}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(245, 87, 108, 0.3)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  6,162+
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 500 }}
                >
                  {statsResources}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(79, 172, 254, 0.3)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  93
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 500 }}
                >
                  {statsOrganizations}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
          {toolsTitle}
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Link href="/demos/playground" passHref legacyBehavior>
              <Card
                component="a"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(14, 165, 233, 0.25)",
                  },
                  "&:focus-visible": {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.45)}`,
                    outlineOffset: 2,
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    opacity: 1,
                  },
                }}
              >
                <CardActionArea sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      component="span"
                      aria-hidden="true"
                      sx={{
                        display: "block",
                        fontSize: "3rem",
                        mb: 2,
                        textAlign: "center",
                        p: 2,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.1)} 100%)`,
                      }}
                    >
                      🎮
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {locale === "sr"
                        ? "Interaktivni playground"
                        : "Interactive Playground"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {locale === "sr"
                        ? "Eksperimentišite sa različitim tipovima grafikona i podacima u realnom vremenu."
                        : "Experiment with different chart types and data in real-time."}
                    </Typography>
                    <Chip
                      label={liveStatusLabel}
                      size="small"
                      sx={{
                        mt: 2,
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        </Grid>

        <Box
          sx={{
            mb: 6,
            p: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(115deg, rgba(15,23,42,0.03), rgba(14,165,233,0.08))",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 1.5, fontWeight: 700, color: "text.primary" }}
          >
            {comingSoonTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {comingSoonDescription}
          </Typography>
          <Grid container spacing={2.5}>
            {comingSoonItems.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    borderStyle: "dashed",
                    borderColor: alpha(theme.palette.text.primary, 0.2),
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        component="span"
                        aria-hidden="true"
                        sx={{ fontSize: "1.25rem", lineHeight: 1 }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1.2, minHeight: 42 }}
                    >
                      {item.description}
                    </Typography>
                    <Chip
                      label={comingSoonStatusLabel}
                      size="small"
                      sx={{ mt: 2, fontWeight: 600 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 5,
            background:
              "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)",
            borderRadius: 4,
            textAlign: "center",
            border: "2px solid",
            borderColor: "rgba(67, 233, 123, 0.2)",
            boxShadow: "0 10px 40px rgba(67, 233, 123, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 3, fontWeight: 700, color: "text.primary" }}
          >
            {aboutTitle}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}
          >
            {aboutParagraph1}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}
          >
            {aboutParagraph2}
          </Typography>
        </Box>
      </DemoErrorBoundary>
    </DemoLayout>
  );
}

export async function getStaticProps() {
  // Pre-build the demo index page for instant loading
  // Demo configs are static at build time, but we may want to refresh occasionally
  return {
    props: {},
  };
}
