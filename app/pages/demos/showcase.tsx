import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { ColumnChart, LineChart, PieChart } from "@/components/demos/charts";
import { DemoLayout } from "@/components/demos/demo-layout";
import { ShowcaseCard } from "@/components/demos/showcase-card";
import {
  showcaseDigitalSkills,
  showcaseEnergyMix,
  showcaseRegionalGrowth,
  showcaseRidershipTrend,
} from "@/data/demo-showcase";
import { FEATURED_CHARTS } from "@/lib/demos/config";

export default function DemoShowcasePage() {
  const { i18n } = useLingui();
  const router = useRouter();
  const locale = i18n.locale || "en";

  const text = {
    title: i18n._(
      defineMessage({
        id: "demos.showcase.title",
        message: "Demo Showcase Visualizations",
      })
    ),
    description: i18n._(
      defineMessage({
        id: "demos.showcase.description",
        message:
          "A quick look at multiple chart types using representative datasets.",
      })
    ),
    hero: i18n._(
      defineMessage({
        id: "demos.showcase.hero",
        message:
          "A bundle of high-signal indicators across economy, mobility, energy, and digitalization.",
      })
    ),
    cta: i18n._(
      defineMessage({
        id: "demos.showcase.cta",
        message: "Browse all demo pages",
      })
    ),
    economyTitle: i18n._(
      defineMessage({
        id: "demos.showcase.economy.title",
        message: "Regional GDP Growth",
      })
    ),
    economyDesc: i18n._(
      defineMessage({
        id: "demos.showcase.economy.description",
        message: "Year-over-year GDP growth by region.",
      })
    ),
    transportTitle: i18n._(
      defineMessage({
        id: "demos.showcase.transport.title",
        message: "Public Transport Momentum",
      })
    ),
    transportDesc: i18n._(
      defineMessage({
        id: "demos.showcase.transport.description",
        message:
          "Trips in millions – COVID dip in 2020, then a steady recovery.",
      })
    ),
    energyTitle: i18n._(
      defineMessage({
        id: "demos.showcase.energy.title",
        message: "Energy Mix Snapshot",
      })
    ),
    energyDesc: i18n._(
      defineMessage({
        id: "demos.showcase.energy.description",
        message: "Share of electricity generation by source.",
      })
    ),
    digitalTitle: i18n._(
      defineMessage({
        id: "demos.showcase.digital.title",
        message: "Digital Skills Gap",
      })
    ),
    digitalDesc: i18n._(
      defineMessage({
        id: "demos.showcase.digital.description",
        message: "Share of population with at least basic digital skills.",
      })
    ),
    datasetTitle: i18n._(
      defineMessage({
        id: "demos.showcase.dataset.title",
        message: "Showcase indicators",
      })
    ),
    datasetOrganization: i18n._(
      defineMessage({
        id: "demos.showcase.dataset.organization",
        message: "Sample dataset",
      })
    ),
    chips: {
      economy: i18n._(
        defineMessage({
          id: "demos.showcase.chip.economy",
          message: "Economic pulse",
        })
      ),
      mobility: i18n._(
        defineMessage({
          id: "demos.showcase.chip.mobility",
          message: "Mobility",
        })
      ),
      energy: i18n._(
        defineMessage({ id: "demos.showcase.chip.energy", message: "Energy" })
      ),
      digital: i18n._(
        defineMessage({ id: "demos.showcase.chip.digital", message: "Digital" })
      ),
    },
    heroCards: [
      {
        label: i18n._(
          defineMessage({
            id: "demos.showcase.hero.stat1.label",
            message: "GDP YoY: +4.3%",
          })
        ),
        hint: i18n._(
          defineMessage({
            id: "demos.showcase.hero.stat1.hint",
            message: "Belgrade leads",
          })
        ),
      },
      {
        label: i18n._(
          defineMessage({
            id: "demos.showcase.hero.stat2.label",
            message: "Trips 2023: 171M",
          })
        ),
        hint: i18n._(
          defineMessage({
            id: "demos.showcase.hero.stat2.hint",
            message: "Steady recovery",
          })
        ),
      },
      {
        label: i18n._(
          defineMessage({
            id: "demos.showcase.hero.stat3.label",
            message: "Coal share: 64%",
          })
        ),
        hint: i18n._(
          defineMessage({
            id: "demos.showcase.hero.stat3.hint",
            message: "Needs diversification",
          })
        ),
      },
    ],
  };

  // Calculate data freshness
  const lastUpdated = new Date("2024-12-31");
  const daysSinceUpdate = Math.floor(
    (new Date().getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isDataStale = daysSinceUpdate > 90; // Consider data stale after 90 days

  // SEO metadata
  const seoTitle = locale.startsWith("sr")
    ? "Galerija demo vizualizacija | Vizualni Admin"
    : "Demo Showcase Visualizations | Vizualni Admin";
  const seoDescription = locale.startsWith("sr")
    ? "Brzi pregled više tipova grafikona sa reprezentativnim skupovima podataka. Ekonomija, mobilnost, energija i digitalizacija."
    : "A quick look at multiple chart types using representative datasets. Economy, mobility, energy, and digitalization.";
  const seoUrl = `https://vizualni-admin.app${router.asPath}`;

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content={
            locale.startsWith("sr")
              ? "vizualizacija podataka, grafikoni, Srbija, BDP, energija, digitalizacija, otvoreni podaci"
              : "data visualization, charts, Serbia, GDP, energy, digitalization, open data"
          }
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta
          property="og:image"
          content="https://vizualni-admin.app/images/showcase-og.png"
        />
        <meta property="og:locale" content={locale} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoUrl} />
        <meta property="twitter:title" content={seoTitle} />
        <meta property="twitter:description" content={seoDescription} />
        <meta
          property="twitter:image"
          content="https://vizualni-admin.app/images/showcase-og.png"
        />

        {/* Additional SEO */}
        <link rel="canonical" href={seoUrl} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Vizualni Admin" />
        <meta name="last-modified" content={lastUpdated.toISOString()} />
      </Head>

      <DemoLayout
        title={text.title}
        description={text.description}
        datasetInfo={{
          title: text.datasetTitle,
          organization: text.datasetOrganization,
          updatedAt: "2024-12-31",
        }}
      >
        {/* Breadcrumb Navigation */}
        <Box
          sx={{ mb: 3 }}
          role="navigation"
          aria-label={
            locale.startsWith("sr")
              ? "Navigaciona putanja"
              : "Breadcrumb navigation"
          }
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" passHref legacyBehavior>
              <MuiLink
                color="inherit"
                underline="hover"
                sx={{
                  "&:focus": {
                    outline: "2px solid #0ea5e9",
                    outlineOffset: "2px",
                    borderRadius: "4px",
                  },
                }}
              >
                {locale.startsWith("sr") ? "Početna" : "Home"}
              </MuiLink>
            </Link>
            <Link href="/demos" passHref legacyBehavior>
              <MuiLink
                color="inherit"
                underline="hover"
                sx={{
                  "&:focus": {
                    outline: "2px solid #0ea5e9",
                    outlineOffset: "2px",
                    borderRadius: "4px",
                  },
                }}
              >
                {locale.startsWith("sr") ? "Demoi" : "Demos"}
              </MuiLink>
            </Link>
            <Typography color="text.primary">
              {locale.startsWith("sr") ? "Galerija" : "Showcase"}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Data Freshness Indicator */}
        {isDataStale && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "warning.lighter",
              border: "1px solid",
              borderColor: "warning.light",
              borderRadius: 2,
            }}
            role="alert"
            aria-live="polite"
          >
            <Typography
              variant="body2"
              color="warning.main"
              sx={{ fontWeight: 600 }}
            >
              ⚠️{" "}
              {locale.startsWith("sr")
                ? `Podaci su ažurirani pre ${daysSinceUpdate} dana. Razmotrite proveru izvora za najnovije informacije.`
                : `Data last updated ${daysSinceUpdate} days ago. Consider checking the source for the latest information.`}
            </Typography>
          </Box>
        )}

        {/* Data Type & Last Updated Badges */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Chip
            icon={<span>🎨</span>}
            label={locale.startsWith("sr") ? "Demo Podaci" : "Demo Data"}
            size="small"
            sx={{
              bgcolor: "warning.lighter",
              color: "warning.main",
              fontWeight: 700,
              border: "2px solid",
              borderColor: "warning.light",
            }}
          />
          <Chip
            label={`${locale.startsWith("sr") ? "Poslednje ažuriranje" : "Last updated"}: ${lastUpdated.toLocaleDateString(
              locale,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}`}
            size="small"
            sx={{
              bgcolor: "grey.100",
              color: "text.secondary",
              fontWeight: 600,
            }}
          />
          <Chip
            label={
              locale.startsWith("sr") ? "Ilustrativni podaci" : "Sample dataset"
            }
            size="small"
            sx={{
              bgcolor: "grey.100",
              color: "text.secondary",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Demo Data Notice */}
        <Box
          sx={{
            mb: 4,
            p: 2.5,
            bgcolor: "info.lighter",
            border: "1px solid",
            borderColor: "info.light",
            borderRadius: 2,
            borderLeft: "4px solid",
            borderLeftColor: "info.main",
          }}
          role="note"
          aria-label={
            locale.startsWith("sr")
              ? "Obaveštenje o demo podacima"
              : "Demo data notice"
          }
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box sx={{ fontSize: "1.5rem", lineHeight: 1 }}>ℹ️</Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, mb: 0.5, color: "info.main" }}
              >
                {locale.startsWith("sr")
                  ? "Demonstracioni Podaci"
                  : "Demonstration Data"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale.startsWith("sr")
                  ? "Grafikoni na ovoj stranici koriste simulirane podatke za demonstraciju različitih tipova vizualizacija. Za prave podatke iz izvora data.gov.rs, posetite posebne stranice za svaku kategoriju (ekonomija, saobraćaj, energija, digitalizacija)."
                  : "The charts on this page use simulated data to demonstrate different visualization types. For real data from data.gov.rs, visit the dedicated pages for each category (economy, transport, energy, digitalization)."}
              </Typography>
              <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  href="/demos/economy"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "info.main",
                    color: "info.main",
                    "&:hover": {
                      bgcolor: "info.lighter",
                      borderColor: "info.dark",
                    },
                  }}
                >
                  {locale.startsWith("sr")
                    ? "→ Prave ekonomske podatke"
                    : "→ Real economy data"}
                </Button>
                <Button
                  component={Link}
                  href="/demos"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "info.main",
                    color: "info.main",
                    "&:hover": {
                      bgcolor: "info.lighter",
                      borderColor: "info.dark",
                    },
                  }}
                >
                  {locale.startsWith("sr")
                    ? "→ Sve kategorije"
                    : "→ All categories"}
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
        <Card
          component="section"
          aria-labelledby="hero-heading"
          sx={{
            mb: 6,
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0ea5e9 100%)",
            color: "white",
            boxShadow: "0 24px 48px -12px rgba(15, 23, 42, 0.6)",
            position: "relative",
            overflow: "hidden",
            "&:focus-within": {
              outline: "3px solid rgba(14, 165, 233, 0.5)",
              outlineOffset: "2px",
            },
          }}
        >
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
            spacing={4}
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                component="h1"
                id="hero-heading"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {text.hero}
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                flexWrap="wrap"
                sx={{ mb: 4, gap: 1.5 }}
                role="list"
                aria-label={
                  locale.startsWith("sr")
                    ? "Kategorije podataka"
                    : "Data categories"
                }
              >
                <Chip
                  component="div"
                  role="listitem"
                  label={text.chips.economy}
                  tabIndex={0}
                  sx={{
                    bgcolor: "white",
                    color: "#0f172a",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    "&:focus": {
                      outline: "2px solid #fbbf24",
                      outlineOffset: "2px",
                    },
                  }}
                />
                <Chip
                  component="div"
                  role="listitem"
                  label={text.chips.mobility}
                  tabIndex={0}
                  sx={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:focus": {
                      outline: "2px solid #fbbf24",
                      outlineOffset: "2px",
                    },
                  }}
                />
                <Chip
                  component="div"
                  role="listitem"
                  label={text.chips.energy}
                  tabIndex={0}
                  sx={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:focus": {
                      outline: "2px solid #fbbf24",
                      outlineOffset: "2px",
                    },
                  }}
                />
                <Chip
                  component="div"
                  role="listitem"
                  label={text.chips.digital}
                  tabIndex={0}
                  sx={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:focus": {
                      outline: "2px solid #fbbf24",
                      outlineOffset: "2px",
                    },
                  }}
                />
              </Stack>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  maxWidth: 640,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {i18n._(
                  defineMessage({
                    id: "demos.showcase.hero.body",
                    message:
                      "A visually coherent set of charts spotlighting momentum, drops, source mix, and the skills gap.",
                  })
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                {text.heroCards.map((item, idx) => (
                  <Grid item xs={6} sm={4} md={12} key={idx}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        p: 2.5,
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backdropFilter: "blur(12px)",
                        borderRadius: 3,
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          background: "rgba(255,255,255,0.15)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {item.hint}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {/* Featured Charts Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Featured Visualizations
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Curated charts showcasing the best of Serbian open data
          </Typography>
          <Grid container spacing={3}>
            {FEATURED_CHARTS.map((chart) => (
              <Grid item xs={12} sm={6} md={4} key={chart.id}>
                <ShowcaseCard
                  title={chart.title[locale as "sr" | "en"]}
                  description={chart.description[locale as "sr" | "en"]}
                  demoUrl={`/demos/${chart.demoId}`}
                  embedUrl={`/embed/${chart.demoId}`}
                  shareUrl={`https://acailic.github.io/vizualni-admin/demos/${chart.demoId}`}
                  onEmbed={() => {
                    /* TODO: Open embed modal */
                  }}
                  onShare={() => {
                    /* TODO: Open share modal */
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid
          container
          spacing={4}
          component="section"
          aria-label={
            locale.startsWith("sr")
              ? "Vizualizacije podataka"
              : "Data visualizations"
          }
        >
          <Grid item xs={12} md={6}>
            <Card
              component="article"
              aria-labelledby="economy-heading"
              tabIndex={0}
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
                "&:focus": {
                  outline: "3px solid #0ea5e9",
                  outlineOffset: "2px",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  id="economy-heading"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {text.economyTitle}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  {text.economyDesc}
                </Typography>
                {/* Screen reader summary */}
                <Box
                  component="div"
                  sx={{
                    position: "absolute",
                    left: "-10000px",
                    top: "auto",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                  aria-live="polite"
                >
                  {locale.startsWith("sr")
                    ? `Stubični grafikon prikazuje regionalni rast BDP-a. Beograd: 4.3%, Vojvodina: 3.1%, Šumadija i zapadna Srbija: 2.7%, Južna i istočna Srbija: 2.1%`
                    : `Column chart showing regional GDP growth. Belgrade: 4.3%, Vojvodina: 3.1%, Sumadija and Western Serbia: 2.7%, Southern and Eastern Serbia: 2.1%`}
                </Box>
                <Box
                  sx={{ overflowX: "auto", pb: 1 }}
                  role="img"
                  aria-label={text.economyTitle}
                >
                  <ColumnChart
                    data={showcaseRegionalGrowth}
                    xKey="region"
                    yKey="growth"
                    width={760}
                    height={360}
                    xLabel={i18n._(
                      defineMessage({
                        id: "demos.showcase.economy.xlabel",
                        message: "Region",
                      })
                    )}
                    yLabel={i18n._(
                      defineMessage({
                        id: "demos.showcase.economy.ylabel",
                        message: "Growth (%)",
                      })
                    )}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {text.transportTitle}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  {text.transportDesc}
                </Typography>
                <Box sx={{ overflowX: "auto", pb: 1 }}>
                  <LineChart
                    data={showcaseRidershipTrend}
                    xKey="year"
                    yKey="trips"
                    width={760}
                    height={360}
                    xLabel={i18n._(
                      defineMessage({
                        id: "demos.showcase.transport.xlabel",
                        message: "Year",
                      })
                    )}
                    yLabel={i18n._(
                      defineMessage({
                        id: "demos.showcase.transport.ylabel",
                        message: "Million trips",
                      })
                    )}
                    color="#0ea5e9"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {text.energyTitle}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  {text.energyDesc}
                </Typography>
                <Box sx={{ overflowX: "auto", pb: 1 }}>
                  <PieChart
                    data={showcaseEnergyMix}
                    labelKey="source"
                    valueKey="share"
                    width={540}
                    height={420}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {text.digitalTitle}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  {text.digitalDesc}
                </Typography>
                <Box sx={{ overflowX: "auto", pb: 1 }}>
                  <ColumnChart
                    data={showcaseDigitalSkills}
                    xKey="segment"
                    yKey="share"
                    width={760}
                    height={360}
                    xLabel={i18n._(
                      defineMessage({
                        id: "demos.showcase.digital.xlabel",
                        message: "Segment",
                      })
                    )}
                    yLabel={i18n._(
                      defineMessage({
                        id: "demos.showcase.digital.ylabel",
                        message: "Share (%)",
                      })
                    )}
                    colors={["#22c55e"]}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card
          sx={{
            mt: 6,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(105deg, rgba(14,165,233,0.05), rgba(34,197,94,0.05))",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={3}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {i18n._(
                  defineMessage({
                    id: "demos.showcase.cta.title",
                    message: "Want more?",
                  })
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.showcase.cta.body",
                    message:
                      "Visit the full gallery for more categories and live data pulls.",
                  })
                )}
              </Typography>
            </Box>
            <Link href="/demos" passHref legacyBehavior>
              <Box
                component="a"
                sx={{
                  textDecoration: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  background: "#0ea5e9",
                  color: "white",
                  fontWeight: 600,
                  boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.3)",
                  transition: "all 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                  "&:hover": {
                    background: "#0284c7",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 8px -1px rgba(14, 165, 233, 0.4)",
                  },
                }}
              >
                {text.cta}
              </Box>
            </Link>
          </Stack>
        </Card>
      </DemoLayout>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
