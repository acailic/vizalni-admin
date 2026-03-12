import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { AppLayout } from "@/components/layout";
import { useLocale } from "@/locales/use-locale";

type AppLocale = "sr-Latn" | "sr-Cyrl" | "en";
type DocsSlug = "getting-started" | "chart-types-guide" | "embedding-guide";

interface LocalizedText {
  "sr-Latn": string;
  "sr-Cyrl": string;
  en: string;
}

interface GuideSection {
  title: LocalizedText;
  description: LocalizedText;
}

interface GuideLink {
  href: string;
  label: LocalizedText;
}

interface GuideContent {
  title: LocalizedText;
  subtitle: LocalizedText;
  statusLabel: LocalizedText;
  sections: GuideSection[];
  primaryLink: GuideLink;
  secondaryLink: GuideLink;
}

const DOCS_GUIDES: Record<DocsSlug, GuideContent> = {
  "getting-started": {
    title: {
      "sr-Latn": "Vodič: Prvi koraci",
      "sr-Cyrl": "Водич: Први кораци",
      en: "Guide: Getting Started",
    },
    subtitle: {
      "sr-Latn":
        "Brz uvod u glavne tokove Vizualni Admin-a: pregled podataka, demo primeri i kreiranje prvog grafikona.",
      "sr-Cyrl":
        "Брз увод у главне токове Vizualni Admin-а: преглед података, демо примери и креирање првог графикона.",
      en: "Quick introduction to Vizualni Admin core flows: dataset browsing, demos, and creating your first chart.",
    },
    statusLabel: {
      "sr-Latn": "Aktuelno",
      "sr-Cyrl": "Актуелно",
      en: "Up to date",
    },
    sections: [
      {
        title: {
          "sr-Latn": "1. Istražite podatke",
          "sr-Cyrl": "1. Истражите податке",
          en: "1. Explore datasets",
        },
        description: {
          "sr-Latn":
            "Otvorite Topics ili Browse da pronađete odgovarajući skup podataka.",
          "sr-Cyrl":
            "Отворите Topics или Browse да пронађете одговарајући скуп података.",
          en: "Use Topics or Browse to find a dataset that matches your use case.",
        },
      },
      {
        title: {
          "sr-Latn": "2. Pogledajte gotove primere",
          "sr-Cyrl": "2. Погледајте готове примере",
          en: "2. Review working examples",
        },
        description: {
          "sr-Latn":
            "Demo Showcase i Playground pokrivaju najstabilnije i najkorisnije početne primere.",
          "sr-Cyrl":
            "Demo Showcase и Playground покривају најстабилније и најкорисније почетне примере.",
          en: "Demo Showcase and Playground provide the most stable starter examples.",
        },
      },
      {
        title: {
          "sr-Latn": "3. Podelite rezultat",
          "sr-Cyrl": "3. Поделите резултат",
          en: "3. Share the result",
        },
        description: {
          "sr-Latn":
            "Koristite Embed generator da odmah dobijete iframe kod za vaš sajt.",
          "sr-Cyrl":
            "Користите Embed generator да одмах добијете iframe код за ваш сајт.",
          en: "Use the Embed generator to get a ready-to-paste iframe snippet.",
        },
      },
    ],
    primaryLink: {
      href: "/demos",
      label: {
        "sr-Latn": "Otvori demo galeriju",
        "sr-Cyrl": "Отвори демо галерију",
        en: "Open demo gallery",
      },
    },
    secondaryLink: {
      href: "/topics",
      label: {
        "sr-Latn": "Istraži teme",
        "sr-Cyrl": "Истражи теме",
        en: "Explore topics",
      },
    },
  },
  "chart-types-guide": {
    title: {
      "sr-Latn": "Vodič: Tipovi grafikona",
      "sr-Cyrl": "Водич: Типови графикона",
      en: "Guide: Chart Types",
    },
    subtitle: {
      "sr-Latn":
        "Kako odabrati odgovarajući grafikon za poređenje, trendove, raspodele i odnose delova.",
      "sr-Cyrl":
        "Како одабрати одговарајући графикон за поређење, трендове, расподеле и односе делова.",
      en: "How to choose the right chart for comparisons, trends, distributions, and part-to-whole views.",
    },
    statusLabel: {
      "sr-Latn": "Praktični vodič",
      "sr-Cyrl": "Практични водич",
      en: "Practical guide",
    },
    sections: [
      {
        title: {
          "sr-Latn": "Bar/Column",
          "sr-Cyrl": "Bar/Column",
          en: "Bar/Column",
        },
        description: {
          "sr-Latn":
            "Koristite za poređenje kategorija i rangiranje vrednosti.",
          "sr-Cyrl": "Користите за поређење категорија и рангирање вредности.",
          en: "Use for category comparison and ranking values.",
        },
      },
      {
        title: {
          "sr-Latn": "Line/Area",
          "sr-Cyrl": "Line/Area",
          en: "Line/Area",
        },
        description: {
          "sr-Latn": "Najbolje za vremenske serije i trendove kroz period.",
          "sr-Cyrl": "Најбоље за временске серије и трендове кроз период.",
          en: "Best for time-series analysis and trend tracking.",
        },
      },
      {
        title: {
          "sr-Latn": "Pie",
          "sr-Cyrl": "Pie",
          en: "Pie",
        },
        description: {
          "sr-Latn": "Za odnos delova celine, kada je broj segmenata mali.",
          "sr-Cyrl": "За однос делова целине, када је број сегмената мали.",
          en: "Use for part-to-whole relationships with a small number of segments.",
        },
      },
    ],
    primaryLink: {
      href: "/demos/playground",
      label: {
        "sr-Latn": "Otvorite Playground",
        "sr-Cyrl": "Отворите Playground",
        en: "Open Playground",
      },
    },
    secondaryLink: {
      href: "/demos/showcase",
      label: {
        "sr-Latn": "Pogledaj showcase",
        "sr-Cyrl": "Погледај showcase",
        en: "View showcase",
      },
    },
  },
  "embedding-guide": {
    title: {
      "sr-Latn": "Vodič: Ugradnja grafikona",
      "sr-Cyrl": "Водич: Уградња графикона",
      en: "Guide: Embedding Charts",
    },
    subtitle: {
      "sr-Latn":
        "Kreirajte iframe kod, prosledite parametre i proverite prikaz pre objave.",
      "sr-Cyrl":
        "Креирајте iframe код, проследите параметре и проверите приказ пре објаве.",
      en: "Generate iframe code, pass chart parameters, and verify the preview before publishing.",
    },
    statusLabel: {
      "sr-Latn": "Embed",
      "sr-Cyrl": "Embed",
      en: "Embed",
    },
    sections: [
      {
        title: {
          "sr-Latn": "1. Otvorite generator",
          "sr-Cyrl": "1. Отворите генератор",
          en: "1. Open the generator",
        },
        description: {
          "sr-Latn": "Podesite širinu, visinu, temu i jezik za prikaz.",
          "sr-Cyrl": "Подесите ширину, висину, тему и језик за приказ.",
          en: "Configure width, height, theme, and language.",
        },
      },
      {
        title: {
          "sr-Latn": "2. Prosledite parametre grafikona",
          "sr-Cyrl": "2. Проследите параметре графикона",
          en: "2. Pass chart parameters",
        },
        description: {
          "sr-Latn":
            "Parametri poput `type`, `dataset` i `dataSource` ulaze direktno u embed URL.",
          "sr-Cyrl":
            "Параметри попут `type`, `dataset` и `dataSource` улазе директно у embed URL.",
          en: "Parameters such as `type`, `dataset`, and `dataSource` are included in the embed URL.",
        },
      },
      {
        title: {
          "sr-Latn": "3. Kopirajte kod",
          "sr-Cyrl": "3. Копирајте код",
          en: "3. Copy the snippet",
        },
        description: {
          "sr-Latn":
            "Kopirajte generisani iframe i nalepite ga na vaš CMS ili web stranicu.",
          "sr-Cyrl":
            "Копирајте генерисани iframe и налепите га на ваш CMS или web страницу.",
          en: "Copy the generated iframe and paste it into your CMS or site.",
        },
      },
    ],
    primaryLink: {
      href: "/embed",
      label: {
        "sr-Latn": "Otvori embed generator",
        "sr-Cyrl": "Отвори embed генератор",
        en: "Open embed generator",
      },
    },
    secondaryLink: {
      href: "/tutorials/basic-embedding",
      label: {
        "sr-Latn": "Detaljniji tutorijal",
        "sr-Cyrl": "Детаљнији туторијал",
        en: "Detailed tutorial",
      },
    },
  },
};

const t = (text: LocalizedText, locale: AppLocale) => text[locale];

export default function DocsGuidePage({ slug }: { slug: DocsSlug }) {
  const locale = useLocale() as AppLocale;
  const guide = DOCS_GUIDES[slug];

  return (
    <>
      <Head>
        <title>{t(guide.title, locale)} | Vizualni Admin</title>
        <meta name="description" content={t(guide.subtitle, locale)} />
      </Head>
      <AppLayout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Stack spacing={3}>
            <Box>
              <Chip
                label={t(guide.statusLabel, locale)}
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 800, mb: 1.5 }}
              >
                {t(guide.title, locale)}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                {t(guide.subtitle, locale)}
              </Typography>
            </Box>

            <Stack spacing={2}>
              {guide.sections.map((section) => (
                <Card key={t(section.title, locale)} variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {t(section.title, locale)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(section.description, locale)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                component={Link}
                href={guide.primaryLink.href}
                variant="contained"
              >
                {t(guide.primaryLink.label, locale)}
              </Button>
              <Button
                component={Link}
                href={guide.secondaryLink.href}
                variant="outlined"
              >
                {t(guide.secondaryLink.label, locale)}
              </Button>
              <Button component={Link} href="/docs" variant="text">
                {locale === "en"
                  ? "Back to docs"
                  : locale === "sr-Cyrl"
                    ? "Назад на документацију"
                    : "Nazad na dokumentaciju"}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </AppLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: DocsSlug[] = [
    "getting-started",
    "chart-types-guide",
    "embedding-guide",
  ];

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ slug: DocsSlug }> = async ({
  params,
}) => {
  const slug = params?.slug;
  if (
    slug !== "getting-started" &&
    slug !== "chart-types-guide" &&
    slug !== "embedding-guide"
  ) {
    return { notFound: true };
  }

  return {
    props: {
      slug,
    },
  };
};
