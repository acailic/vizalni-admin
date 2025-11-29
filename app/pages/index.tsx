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
  Chip,
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

// ============================================================================
// LOCALIZED COPY
// ============================================================================

const heroCopy: Record<
  Locale,
  {
    overline: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
  }
> = {
  en: {
    overline: "Serbian Open Data Visualization",
    title: "Transform data.gov.rs datasets into beautiful charts",
    body: "Create, customize, and embed interactive visualizations from Serbia's official open data portal. No coding required.",
    primary: "Browse datasets",
    secondary: "View demos",
  },
  sr: {
    overline: "Vizualizacija otvorenih podataka Srbije",
    title: "Pretvorite data.gov.rs skupove podataka u prelepe grafikone",
    body: "Kreirajte, prilagodite i ugradite interaktivne vizualizacije sa zvaničnog portala otvorenih podataka Srbije. Bez programiranja.",
    primary: "Pregledaj datasete",
    secondary: "Pogledaj demo",
  },
  "sr-Cyrl": {
    overline: "Визуализација отворених података Србије",
    title: "Претворите data.gov.rs скупове података у прелепе графиконе",
    body: "Креирајте, прилагодите и уградите интерактивне визуализације са званичног портала отворених података Србије. Без програмирања.",
    primary: "Прегледај датасете",
    secondary: "Погледај демо",
  },
};

const featuresCopy: Record<
  Locale,
  {
    label: string;
    heading: string;
    subheading: string;
    features: Array<{ title: string; description: string; icon: ReactNode }>;
  }
> = {
  en: {
    label: "Capabilities",
    heading: "Everything you need to visualize Serbian open data",
    subheading: "Powerful tools designed for simplicity",
    features: [
      {
        title: "10+ Chart Types",
        description:
          "Bar, line, pie, area, scatter, map and more. Choose the right visualization for your data story.",
        icon: <ChartIcon />,
      },
      {
        title: "Direct data.gov.rs Integration",
        description:
          "Browse and select from hundreds of official Serbian government datasets.",
        icon: <DatabaseIcon />,
      },
      {
        title: "Instant Embedding",
        description:
          "Copy embed code and add interactive charts to any website or application.",
        icon: <EmbedIcon />,
      },
      {
        title: "Fully Customizable",
        description:
          "Colors, labels, filters, and interactivity. Make every chart your own.",
        icon: <CustomizeIcon />,
      },
    ],
  },
  sr: {
    label: "Mogućnosti",
    heading: "Sve što vam je potrebno za vizualizaciju otvorenih podataka",
    subheading: "Moćni alati dizajnirani za jednostavnost",
    features: [
      {
        title: "10+ tipova grafikona",
        description:
          "Stubičasti, linijski, kružni, prostorni, tačkasti, mapa i još. Izaberite pravu vizualizaciju.",
        icon: <ChartIcon />,
      },
      {
        title: "Direktna data.gov.rs integracija",
        description:
          "Pregledajte i izaberite iz stotina zvaničnih skupova podataka Vlade Srbije.",
        icon: <DatabaseIcon />,
      },
      {
        title: "Instant ugradnja",
        description:
          "Kopirajte embed kod i dodajte interaktivne grafikone na bilo koji sajt.",
        icon: <EmbedIcon />,
      },
      {
        title: "Potpuno prilagodljivo",
        description:
          "Boje, oznake, filteri i interaktivnost. Napravite svaki grafikon svojim.",
        icon: <CustomizeIcon />,
      },
    ],
  },
  "sr-Cyrl": {
    label: "Могућности",
    heading: "Све што вам је потребно за визуализацију отворених података",
    subheading: "Моћни алати дизајнирани за једноставност",
    features: [
      {
        title: "10+ типова графикона",
        description:
          "Стубичасти, линијски, кружни, просторни, тачкасти, мапа и још. Изаберите праву визуализацију.",
        icon: <ChartIcon />,
      },
      {
        title: "Директна data.gov.rs интеграција",
        description:
          "Прегледајте и изаберите из стотина званичних скупова података Владе Србије.",
        icon: <DatabaseIcon />,
      },
      {
        title: "Инстант уградња",
        description:
          "Копирајте embed код и додајте интерактивне графиконе на било који сајт.",
        icon: <EmbedIcon />,
      },
      {
        title: "Потпуно прилагодљиво",
        description:
          "Боје, ознаке, филтери и интерактивност. Направите сваки графикон својим.",
        icon: <CustomizeIcon />,
      },
    ],
  },
};

const howItWorksCopy: Record<
  Locale,
  {
    label: string;
    heading: string;
    steps: Array<{ step: string; title: string; description: string }>;
  }
> = {
  en: {
    label: "How it works",
    heading: "Three simple steps to your visualization",
    steps: [
      {
        step: "1",
        title: "Choose a dataset",
        description:
          "Browse data.gov.rs and select the data you want to visualize",
      },
      {
        step: "2",
        title: "Customize your chart",
        description: "Pick a chart type, adjust colors, add filters and labels",
      },
      {
        step: "3",
        title: "Share or embed",
        description: "Publish your visualization or embed it on your website",
      },
    ],
  },
  sr: {
    label: "Kako funkcioniše",
    heading: "Tri jednostavna koraka do vaše vizualizacije",
    steps: [
      {
        step: "1",
        title: "Izaberite dataset",
        description:
          "Pregledajte data.gov.rs i izaberite podatke za vizualizaciju",
      },
      {
        step: "2",
        title: "Prilagodite grafikon",
        description: "Izaberite tip, podesite boje, dodajte filtere i oznake",
      },
      {
        step: "3",
        title: "Podelite ili ugradite",
        description: "Objavite vizualizaciju ili je ugradite na svoj sajt",
      },
    ],
  },
  "sr-Cyrl": {
    label: "Како функционише",
    heading: "Три једноставна корака до ваше визуализације",
    steps: [
      {
        step: "1",
        title: "Изаберите датасет",
        description:
          "Прегледајте data.gov.rs и изаберите податке за визуализацију",
      },
      {
        step: "2",
        title: "Прилагодите графикон",
        description: "Изаберите тип, подесите боје, додајте филтере и ознаке",
      },
      {
        step: "3",
        title: "Поделите или уградите",
        description: "Објавите визуализацију или је уградите на свој сајт",
      },
    ],
  },
};

const useCasesCopy: Record<
  Locale,
  {
    label: string;
    heading: string;
    subheading: string;
    cases: Array<{ title: string; description: string; tags: string[] }>;
  }
> = {
  en: {
    label: "Use cases",
    heading: "Who benefits from Vizualni Admin?",
    subheading: "Built for everyone working with Serbian open data",
    cases: [
      {
        title: "Journalists & Media",
        description:
          "Create data-driven stories with interactive charts. Embed visualizations directly in articles.",
        tags: ["Stories", "Embed"],
      },
      {
        title: "Researchers & Academics",
        description:
          "Analyze government statistics. Export data for further research and publication.",
        tags: ["Analysis", "Export"],
      },
      {
        title: "Government & NGOs",
        description:
          "Present public data transparently. Build dashboards for citizen engagement.",
        tags: ["Transparency", "Reports"],
      },
      {
        title: "Developers & Analysts",
        description:
          "Quickly prototype visualizations. Use embed codes in web applications.",
        tags: ["API", "Integration"],
      },
    ],
  },
  sr: {
    label: "Primeri upotrebe",
    heading: "Kome koristi Vizualni Admin?",
    subheading: "Napravljen za sve koji rade sa otvorenim podacima Srbije",
    cases: [
      {
        title: "Novinari i mediji",
        description:
          "Kreirajte priče zasnovane na podacima sa interaktivnim grafikonima. Ugradite ih u članke.",
        tags: ["Priče", "Embed"],
      },
      {
        title: "Istraživači i akademici",
        description:
          "Analizirajte državne statistike. Izvezite podatke za dalje istraživanje.",
        tags: ["Analiza", "Izvoz"],
      },
      {
        title: "Vlada i NVO",
        description:
          "Transparentno predstavite javne podatke. Napravite dashboard-e za angažovanje građana.",
        tags: ["Transparentnost", "Izveštaji"],
      },
      {
        title: "Programeri i analitičari",
        description:
          "Brzo prototipišite vizualizacije. Koristite embed kodove u web aplikacijama.",
        tags: ["API", "Integracija"],
      },
    ],
  },
  "sr-Cyrl": {
    label: "Примери употребе",
    heading: "Коме користи Визуелни Админ?",
    subheading: "Направљен за све који раде са отвореним подацима Србије",
    cases: [
      {
        title: "Новинари и медији",
        description:
          "Креирајте приче засноване на подацима са интерактивним графиконима. Уградите их у чланке.",
        tags: ["Приче", "Embed"],
      },
      {
        title: "Истраживачи и академици",
        description:
          "Анализирајте државне статистике. Извезите податке за даље истраживање.",
        tags: ["Анализа", "Извоз"],
      },
      {
        title: "Влада и НВО",
        description:
          "Транспарентно представите јавне податке. Направите dashboard-е за ангажовање грађана.",
        tags: ["Транспарентност", "Извештаји"],
      },
      {
        title: "Програмери и аналитичари",
        description:
          "Брзо прототипишите визуализације. Користите embed кодове у web апликацијама.",
        tags: ["API", "Интеграција"],
      },
    ],
  },
};

const resourcesCopy: Record<
  Locale,
  {
    label: string;
    heading: string;
    subheading: string;
    learnMore: string;
    cards: Array<{ title: string; description: string; link: string }>;
  }
> = {
  en: {
    label: "Resources",
    heading: "Learn and explore",
    subheading: "Guides to help you get the most out of Vizualni Admin",
    learnMore: "Read guide",
    cards: [
      {
        title: "Getting started",
        description: "Create your first visualization in minutes",
        link: "/docs/getting-started",
      },
      {
        title: "Chart types guide",
        description: "Choose the right chart for your data",
        link: "/docs/chart-types-guide",
      },
      {
        title: "Embedding guide",
        description: "Add charts to your website or app",
        link: "/docs/embedding-guide",
      },
      {
        title: "Demo gallery",
        description: "Explore example visualizations",
        link: "/demos",
      },
    ],
  },
  sr: {
    label: "Resursi",
    heading: "Naučite i istražite",
    subheading:
      "Vodiči koji vam pomažu da izvučete maksimum iz Vizualni Admin-a",
    learnMore: "Pročitaj vodič",
    cards: [
      {
        title: "Prvi koraci",
        description: "Napravite prvu vizualizaciju za nekoliko minuta",
        link: "/docs/getting-started",
      },
      {
        title: "Vodič za grafikone",
        description: "Izaberite pravi grafikon za vaše podatke",
        link: "/docs/chart-types-guide",
      },
      {
        title: "Vodič za ugradnju",
        description: "Dodajte grafikone na svoj sajt ili aplikaciju",
        link: "/docs/embedding-guide",
      },
      {
        title: "Galerija primera",
        description: "Istražite primere vizualizacija",
        link: "/demos",
      },
    ],
  },
  "sr-Cyrl": {
    label: "Ресурси",
    heading: "Научите и истражите",
    subheading:
      "Водичи који вам помажу да извучете максимум из Визуелни Админ-а",
    learnMore: "Прочитај водич",
    cards: [
      {
        title: "Први кораци",
        description: "Направите прву визуализацију за неколико минута",
        link: "/docs/getting-started",
      },
      {
        title: "Водич за графиконе",
        description: "Изаберите прави графикон за ваше податке",
        link: "/docs/chart-types-guide",
      },
      {
        title: "Водич за уградњу",
        description: "Додајте графиконе на свој сајт или апликацију",
        link: "/docs/embedding-guide",
      },
      {
        title: "Галерија примера",
        description: "Истражите примере визуализација",
        link: "/demos",
      },
    ],
  },
};

const ctaCopy: Record<
  Locale,
  { heading: string; subheading: string; button: string }
> = {
  en: {
    heading: "Ready to visualize Serbian open data?",
    subheading: "Start exploring datasets and create your first chart today.",
    button: "Get started free",
  },
  sr: {
    heading: "Spremni da vizualizujete otvorene podatke Srbije?",
    subheading:
      "Počnite da istražujete datasete i napravite prvi grafikon danas.",
    button: "Započnite besplatno",
  },
  "sr-Cyrl": {
    heading: "Спремни да визуализујете отворене податке Србије?",
    subheading:
      "Почните да истражујете датасете и направите први графикон данас.",
    button: "Започните бесплатно",
  },
};

// ============================================================================
// SVG ICONS
// ============================================================================

function ChartIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function EmbedIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CustomizeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

const SectionShell = ({
  children,
  background = "background.paper",
  id,
}: {
  children: ReactNode;
  background?: string;
  id?: string;
}) => {
  return (
    <Box
      id={id}
      sx={{
        position: "relative",
        px: { xs: 2, md: 5 },
        py: { xs: 8, md: 12 },
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

const HeroSection = ({ locale }: { locale: Locale }) => {
  const theme = useTheme();
  const copy = heroCopy[locale];

  return (
    <SectionShell background="linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0ea5e9 100%)">
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <Grid
        container
        spacing={{ xs: 4, md: 8 }}
        alignItems="center"
        sx={{ color: "white", position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} md={7}>
          <Chip
            label={copy.overline}
            size="small"
            sx={{
              mb: 3,
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "white",
              fontWeight: 600,
              letterSpacing: 0.5,
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {copy.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              mt: 3,
              maxWidth: 560,
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: "1.125rem",
            }}
          >
            {copy.body}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 5 }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/browse"
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 700,
                fontSize: "1rem",
                backgroundColor: "white",
                color: "#0f172a",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                },
              }}
            >
              {copy.primary}
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/demos"
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 700,
                fontSize: "1rem",
                borderColor: "rgba(255,255,255,0.3)",
                color: "white",
                backdropFilter: "blur(4px)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {copy.secondary}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              p: 3,
              boxShadow: "0 24px 48px -12px rgba(0,0,0,0.3)",
              transform: "perspective(1000px) rotateY(-5deg)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "perspective(1000px) rotateY(0deg)",
              },
            }}
          >
            {/* Hero illustration - Multiple chart types preview */}
            <Box
              component="svg"
              viewBox="0 0 320 240"
              sx={{ width: "100%", display: "block" }}
            >
              {/* Bar chart */}
              <rect
                x="20"
                y="140"
                width="30"
                height="80"
                fill={theme.palette.primary.main}
                rx="4"
                opacity="0.9"
              />
              <rect
                x="60"
                y="100"
                width="30"
                height="120"
                fill={theme.palette.primary.main}
                rx="4"
                opacity="0.8"
              />
              <rect
                x="100"
                y="60"
                width="30"
                height="160"
                fill={theme.palette.primary.main}
                rx="4"
                opacity="0.9"
              />
              <rect
                x="140"
                y="120"
                width="30"
                height="100"
                fill={theme.palette.primary.main}
                rx="4"
                opacity="0.7"
              />

              {/* Line chart overlay */}
              <polyline
                points="35,130 75,85 115,45 155,105"
                fill="none"
                stroke="#3BD6C6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="35" cy="130" r="6" fill="#3BD6C6" />
              <circle cx="75" cy="85" r="6" fill="#3BD6C6" />
              <circle cx="115" cy="45" r="6" fill="#3BD6C6" />
              <circle cx="155" cy="105" r="6" fill="#3BD6C6" />

              {/* Pie chart */}
              <g transform="translate(250, 120)">
                <circle r="50" fill="rgba(255,255,255,0.1)" />
                <path
                  d="M0,0 L0,-50 A50,50 0 0,1 43,25 Z"
                  fill={theme.palette.primary.main}
                  opacity="0.9"
                />
                <path
                  d="M0,0 L43,25 A50,50 0 0,1 -43,25 Z"
                  fill="#3BD6C6"
                  opacity="0.8"
                />
                <path
                  d="M0,0 L-43,25 A50,50 0 0,1 0,-50 Z"
                  fill="rgba(255,255,255,0.3)"
                />
              </g>

              {/* Labels */}
              <rect
                x="20"
                y="20"
                width="120"
                height="12"
                rx="4"
                fill="rgba(255,255,255,0.2)"
              />
              <rect
                x="200"
                y="20"
                width="80"
                height="8"
                rx="3"
                fill="rgba(255,255,255,0.15)"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SectionShell>
  );
};

const FeaturesSection = ({ locale }: { locale: Locale }) => {
  const copy = featuresCopy[locale];

  return (
    <SectionShell id="features">
      <Box sx={{ textAlign: "center", maxWidth: 700, mx: "auto" }}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: 2, color: "primary.main", fontWeight: 700 }}
        >
          {copy.label}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5 }}>
          {copy.heading}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          {copy.subheading}
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {copy.features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  backgroundColor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  boxShadow: "0 8px 24px rgba(12,64,118,0.25)",
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </SectionShell>
  );
};

const HowItWorksSection = ({ locale }: { locale: Locale }) => {
  const copy = howItWorksCopy[locale];

  return (
    <SectionShell background="grey.50" id="how-it-works">
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: 2, color: "primary.main", fontWeight: 700 }}
        >
          {copy.label}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5 }}>
          {copy.heading}
        </Typography>
      </Box>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {copy.steps.map((step, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  mb: 3,
                  boxShadow: "0 6px 20px rgba(12,64,118,0.3)",
                }}
              >
                {step.step}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                {step.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 280 }}
              >
                {step.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </SectionShell>
  );
};

const UseCasesSection = ({ locale }: { locale: Locale }) => {
  const copy = useCasesCopy[locale];

  return (
    <SectionShell id="use-cases">
      <Box sx={{ textAlign: "center", maxWidth: 700, mx: "auto" }}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: 2, color: "primary.main", fontWeight: 700 }}
        >
          {copy.label}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5 }}>
          {copy.heading}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          {copy.subheading}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {copy.cases.map((useCase, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": {
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                {useCase.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {useCase.description}
              </Typography>
              <Stack direction="row" spacing={1}>
                {useCase.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </SectionShell>
  );
};

const ResourcesSection = ({ locale }: { locale: Locale }) => {
  const copy = resourcesCopy[locale];

  return (
    <SectionShell background="grey.50" id="resources">
      <Box sx={{ textAlign: "center", maxWidth: 700, mx: "auto" }}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: 2, color: "primary.main", fontWeight: 700 }}
        >
          {copy.label}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5 }}>
          {copy.heading}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          {copy.subheading}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {copy.cards.map((card, index) => (
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
                backgroundColor: "background.paper",
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 3, pb: 3 }}>
                <Button
                  size="small"
                  component={Link}
                  href={card.link}
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

const CTASection = ({ locale }: { locale: Locale }) => {
  const copy = ctaCopy[locale];

  return (
    <SectionShell background="linear-gradient(135deg, #0c4076, #0e2a45)">
      <Box sx={{ textAlign: "center", color: "white", py: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          {copy.heading}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontWeight: 400 }}>
          {copy.subheading}
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/browse"
          sx={{
            py: 1.5,
            px: 5,
            fontWeight: 700,
            fontSize: "1.1rem",
            backgroundColor: "white",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.9)",
            },
          }}
        >
          {copy.button}
        </Button>
      </Box>
    </SectionShell>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

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

  if (isHomePage) {
    return (
      <ContentMDXProvider>
        <HeroSection locale={locale} />
        <FeaturesSection locale={locale} />
        <HowItWorksSection locale={locale} />
        <UseCasesSection locale={locale} />
        <ResourcesSection locale={locale} />
        <CTASection locale={locale} />
      </ContentMDXProvider>
    );
  }

  return (
    <ContentMDXProvider>
      {Component ? <Component /> : "NOT FOUND"}
    </ContentMDXProvider>
  );
}

export const getStaticProps: GetStaticProps<ContentPageProps> = async ({
  locale,
}) => {
  const normalizedLocale: Locale =
    locale && locale.startsWith("en") ? "en" : "sr";
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
    revalidate: 3600, // Revalidate every hour for potential content updates
  };
};
