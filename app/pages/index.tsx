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
import { useRouter } from "next/router";
import { type ReactNode, useMemo } from "react";

import { ContentMDXProvider } from "@/components/content-mdx-provider";
import { staticPages } from "@/static-pages";

interface ContentPageProps {
  staticPage: string;
}

type Locale = "sr" | "sr-Cyrl" | "en";

const heroCopy: Record<
  Locale,
  {
    overline: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
    badge: string;
    trusted: string;
    embeds: string;
  }
> = {
  en: {
    overline: "Serbian open data, ready to use",
    title: "Turn Serbia's open data into insights in minutes",
    body: "Explore data.gov.rs, choose a dataset, and build visualizations you can publish or embed without extra work.",
    primary: "Explore datasets",
    secondary: "View quickstart",
    badge: "Open data portal",
    trusted: "Official data.gov.rs sources",
    embeds: "Shareable visuals and embeds",
  },
  sr: {
    overline: "Otvoreni podaci Srbije, spremni za rad",
    title: "Pretvorite otvorene podatke Srbije u uvid za nekoliko minuta",
    body: "Istražite data.gov.rs, izaberite skup podataka i napravite vizualizacije spremne za objavu ili ugradnju.",
    primary: "Istraži skupove podataka",
    secondary: "Brzi vodič",
    badge: "Portal otvorenih podataka",
    trusted: "Zvanični izvori data.gov.rs",
    embeds: "Deljive vizualizacije i embed kod",
  },
  "sr-Cyrl": {
    overline: "Отворени подаци Србије, спремни за рад",
    title: "Претворите отворене податке Србије у увид за неколико минута",
    body: "Истражите data.gov.rs, изаберите скуп података и направите визуализације спремне за објаву или уградњу.",
    primary: "Истражи скупове података",
    secondary: "Брзи водич",
    badge: "Портал отворених података",
    trusted: "Званични извори data.gov.rs",
    embeds: "Дељиве визуализације и embed код",
  },
};

const tutorialsCopy: Record<
  Locale,
  {
    heading: string;
    subheading: string;
    label: string;
    learnMore: string;
    cards: Array<{ title: string; description: string; link: string; icon: string }>;
  }
> = {
  en: {
    heading: "Learn the essentials",
    subheading: "Guides that help you design, publish, and embed clear visualizations",
    label: "Resources",
    learnMore: "Open guide",
    cards: [
      {
        title: "Getting started",
        description: "Set up Vizualni Admin and create your first chart.",
        link: "/docs/getting-started",
        icon: "🚀",
      },
      {
        title: "Chart types",
        description: "Choose the right chart for your data story.",
        link: "/docs/chart-types-guide",
        icon: "📊",
      },
      {
        title: "Embedding",
        description: "Add visualizations to your site or app.",
        link: "/docs/embedding-guide",
        icon: "🔗",
      },
      {
        title: "API guide",
        description: "Work with the data.gov.rs API.",
        link: "/docs/data-gov-rs-guide",
        icon: "📡",
      },
    ],
  },
  sr: {
    heading: "Naučite osnove",
    subheading: "Vodiči koji pomažu da dizajnirate, objavite i ugradite jasne vizualizacije",
    label: "Resursi",
    learnMore: "Otvori vodič",
    cards: [
      {
        title: "Prvi koraci",
        description: "Podesite Vizualni Admin i napravite prvi grafikon.",
        link: "/docs/getting-started",
        icon: "🚀",
      },
      {
        title: "Tipovi grafikona",
        description: "Izaberite pravi grafikon za svoju priču o podacima.",
        link: "/docs/chart-types-guide",
        icon: "📊",
      },
      {
        title: "Ugradnja",
        description: "Dodajte vizualizacije na svoj sajt ili aplikaciju.",
        link: "/docs/embedding-guide",
        icon: "🔗",
      },
      {
        title: "API vodič",
        description: "Rad sa data.gov.rs API-jem.",
        link: "/docs/data-gov-rs-guide",
        icon: "📡",
      },
    ],
  },
  "sr-Cyrl": {
    heading: "Научите основе",
    subheading: "Водичи који помажу да дизајнирате, објавите и уградите јасне визуализације",
    label: "Ресурси",
    learnMore: "Отвори водич",
    cards: [
      {
        title: "Први кораци",
        description: "Подесите Визуелни Админ и направите први графикон.",
        link: "/docs/getting-started",
        icon: "🚀",
      },
      {
        title: "Типови графикона",
        description: "Изаберите прави графикон за своју причу о подацима.",
        link: "/docs/chart-types-guide",
        icon: "📊",
      },
      {
        title: "Уградња",
        description: "Додајте визуализације на свој сајт или апликацију.",
        link: "/docs/embedding-guide",
        icon: "🔗",
      },
      {
        title: "API водич",
        description: "Рад са data.gov.rs API-јем.",
        link: "/docs/data-gov-rs-guide",
        icon: "📡",
      },
    ],
  },
};

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

const TutorialsSection = ({ locale }: { locale: Locale }) => {
  const copy = tutorialsCopy[locale];

  return (
    <SectionShell>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="overline" sx={{ letterSpacing: 2, color: "text.secondary" }}>
          {copy.label}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
          {copy.heading}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
          {copy.subheading}
        </Typography>
      </Box>
      <Grid container spacing={3.5}>
        {copy.cards.map((tutorial, index) => (
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
                background: "linear-gradient(135deg, rgba(12,64,118,0.04), rgba(12,64,118,0.01))",
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
                  {copy.learnMore}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </SectionShell>
  );
};

const HeroSection = ({ locale }: { locale: Locale }) => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const copy = heroCopy[locale];

  return (
    <SectionShell background="linear-gradient(135deg, #0b1a2d, #0e2a45)">
      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ color: "white" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.85 }}>
            {copy.overline}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              mt: 2,
            }}
          >
            {copy.title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 2.5, maxWidth: 540 }}>
            {copy.body}
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
              {copy.primary}
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
              {copy.secondary}
            </Button>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4, opacity: 0.9 }}>
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
                {copy.trusted}
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
                {copy.embeds}
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
              {copy.badge}
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
  const router = useRouter();
  const locale: Locale = useMemo(() => {
    if (router.locale?.startsWith("sr")) {
      return router.locale === "sr-Cyrl" ? "sr-Cyrl" : "sr";
    }
    if (staticPage.startsWith("/sr")) {
      return "sr";
    }
    return "en";
  }, [router.locale, staticPage]);

  return (
    <ContentMDXProvider>
      {isHomePage && <HeroSection key={locale} locale={locale} />}
      {Component ? <Component /> : "NOT FOUND"}
      {isHomePage && <TutorialsSection locale={locale} />}
    </ContentMDXProvider>
  );
}

export const getStaticProps: GetStaticProps<ContentPageProps> = async ({ locale }) => {
  const normalizedLocale: Locale = locale && locale.startsWith("en") ? "en" : "sr";
  const path = normalizedLocale === "sr" ? "/sr/index" : "/en/index";
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
