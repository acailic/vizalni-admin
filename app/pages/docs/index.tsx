import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { AppLayout } from "@/components/layout";
import { useLocale } from "@/locales/use-locale";

type AppLocale = "sr-Latn" | "sr-Cyrl" | "en";

type LocalizedText = {
  "sr-Latn": string;
  "sr-Cyrl": string;
  en: string;
};

interface DocsCard {
  href: string;
  title: LocalizedText;
  description: LocalizedText;
  cta: LocalizedText;
}

const DOCS_CARDS: DocsCard[] = [
  {
    href: "/docs/getting-started",
    title: {
      "sr-Latn": "Prvi koraci",
      "sr-Cyrl": "Први кораци",
      en: "Getting started",
    },
    description: {
      "sr-Latn": "Osnovni tokovi kroz browse, demos, topics i embed.",
      "sr-Cyrl": "Основни токови кроз browse, demos, topics и embed.",
      en: "Core flow through browse, demos, topics, and embed.",
    },
    cta: {
      "sr-Latn": "Otvori vodič",
      "sr-Cyrl": "Отвори водич",
      en: "Open guide",
    },
  },
  {
    href: "/docs/chart-types-guide",
    title: {
      "sr-Latn": "Tipovi grafikona",
      "sr-Cyrl": "Типови графикона",
      en: "Chart types",
    },
    description: {
      "sr-Latn":
        "Kako odabrati pravi prikaz za trendove, poređenja i raspodele.",
      "sr-Cyrl":
        "Како одабрати прави приказ за трендове, поређења и расподеле.",
      en: "How to choose the right chart for trends, comparisons, and distributions.",
    },
    cta: {
      "sr-Latn": "Pogledaj vodič",
      "sr-Cyrl": "Погледај водич",
      en: "View guide",
    },
  },
  {
    href: "/docs/embedding-guide",
    title: {
      "sr-Latn": "Ugradnja grafikona",
      "sr-Cyrl": "Уградња графикона",
      en: "Embedding charts",
    },
    description: {
      "sr-Latn": "Kreiranje iframe koda i prosleđivanje parametara grafikona.",
      "sr-Cyrl": "Креирање iframe кода и прослеђивање параметара графикона.",
      en: "Generate iframe code and pass chart parameters.",
    },
    cta: {
      "sr-Latn": "Otvori embed vodič",
      "sr-Cyrl": "Отвори embed водич",
      en: "Open embed guide",
    },
  },
];

const t = (text: LocalizedText, locale: AppLocale) => text[locale];

export default function DocsIndexPage() {
  const locale = useLocale() as AppLocale;

  const pageTitle =
    locale === "en"
      ? "Documentation"
      : locale === "sr-Cyrl"
        ? "Документација"
        : "Dokumentacija";

  const pageDescription =
    locale === "en"
      ? "Quick guides for Vizualni Admin core workflows."
      : locale === "sr-Cyrl"
        ? "Брзи водичи за кључне токове у Vizualni Admin-у."
        : "Brzi vodiči za ključne tokove u Vizualni Admin-u.";

  return (
    <>
      <Head>
        <title>{pageTitle} | Vizualni Admin</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <AppLayout>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ mb: 4 }}>
            <Chip label="Docs" size="small" sx={{ mb: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 800, mb: 1.5 }}
            >
              {pageTitle}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              {pageDescription}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {DOCS_CARDS.map((card) => (
              <Grid item xs={12} md={4} key={card.href}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {t(card.title, locale)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(card.description, locale)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      component={Link}
                      href={card.href}
                      size="small"
                      sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                      {t(card.cta, locale)}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </AppLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
