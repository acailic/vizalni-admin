import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";

import { ColumnChart, LineChart } from "@/components/demos/charts";
import { Header } from "@/components/header";
import { internetAdoption, techIndustryGrowth } from "@/data/serbia-digital";
import { energyProduction, energyStats } from "@/data/serbia-energy";

const adoption = internetAdoption.slice(-6).map((point) => ({
  label: point.year.toString(),
  value: point.individuals,
}));

const exportsSeries = techIndustryGrowth.slice(-6).map((point) => ({
  label: point.year.toString(),
  value: point.exports,
}));

const latestEnergy = energyProduction[energyProduction.length - 1];
const energySplit = [
  { label: "Coal", value: latestEnergy.coal },
  { label: "Hydro", value: latestEnergy.hydropower },
  { label: "Wind/Solar", value: latestEnergy.solarWind },
];

const heroFeatures = [
  { title: "Live + fallback data", body: "data.gov.rs sourcing with graceful fallbacks for stage demos.", tone: "primary" },
  { title: "Embeds that resize", body: "Iframe-resizer ready snippets with theme and language toggles.", tone: "secondary" },
  { title: "Library-first", body: "npm package with typed config, locales, and chart utilities.", tone: "success" },
];

const storyCards = [
  {
    title: "Digital momentum",
    metric: `${adoption[adoption.length - 1].value}% online`,
    detail: "6-year climb in internet adoption across Serbia.",
    href: "/demos/digital",
  },
  {
    title: "IT exports surge",
    metric: `€${exportsSeries[exportsSeries.length - 1].value.toLocaleString()}M`,
    detail: "Exports more than doubled since 2019.",
    href: "/demos/economy",
  },
  {
    title: "Energy transition",
    metric: `${energyStats.coalDependency2024}% coal`,
    detail: "Track diversification away from coal in the mix.",
    href: "/demos/energy",
  },
];

export default function PitchPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Head>
        <title>Vizualni Admin · Demo Pitch</title>
        <meta name="description" content="Presentation-ready demo pages for vizualni-admin with live charts, embeds, and npm quickstarts." />
      </Head>
      <Header />
      <Box
        sx={{
          background: "linear-gradient(120deg, #0f172a 0%, #111827 30%, #0ea5e9 110%)",
          color: "white",
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="overline" sx={{ letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>
            Live showcase · GitHub Pages
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 2, letterSpacing: "-0.03em" }}>
            Demo like a top-tier product
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 840, mb: 4, color: "rgba(255,255,255,0.82)" }}>
            Curated hero, motion-friendly layouts, multilingual embeds, and npm quickstarts so stakeholders see exactly what ships.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button component={Link} href="/demos/showcase" variant="contained" size="large" color="secondary">
              View live showcase
            </Button>
            <Button component={Link} href="/embed" variant="outlined" size="large" sx={{ borderColor: "rgba(255,255,255,0.4)", color: "white" }}>
              Generate embeds
            </Button>
            <Button
              component={Link}
              href="https://www.npmjs.com/package/@acailic/vizualni-admin"
              variant="outlined"
              size="large"
              sx={{ borderColor: "rgba(255,255,255,0.4)", color: "white" }}
              target="_blank"
              rel="noreferrer"
            >
              npm package
            </Button>
          </Stack>
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {heroFeatures.map((feature) => (
              <Grid item xs={12} sm={4} key={feature.title}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(10px)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                  variant="outlined"
                >
                  <CardContent>
                    <Chip label={feature.tone} size="small" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      {feature.body}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Live data stories
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
              Serbia’s digital and energy narrative in one view
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
              Three ready-to-present tiles that mirror what the GitHub Pages site renders: adoption curves, export momentum, and energy mix progress.
            </Typography>
            <Stack spacing={2}>
              {storyCards.map((card) => (
                <Card key={card.title} variant="outlined">
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.detail}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {card.metric}
                      </Typography>
                      <Button component={Link} href={card.href} size="small">
                        Open
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Internet adoption
                </Typography>
                <LineChart
                  data={adoption}
                  xKey="label"
                  yKey="value"
                  title="Online population"
                  height={260}
                  showTooltip
                  showCrosshair
                  color="#38bdf8"
                />
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  IT exports (€M)
                </Typography>
                <ColumnChart
                  data={exportsSeries}
                  xKey="label"
                  yKey="value"
                  title="Tech exports"
                  height={240}
                  color="#a855f7"
                  showTooltip
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Energy mix snapshot
                </Typography>
                <LineChart
                  data={energySplit}
                  xKey="label"
                  yKey="value"
                  title="Energy mix"
                  height={200}
                  showTooltip
                  color="#f59e0b"
                />
                <Typography variant="caption" color="text.secondary">
                  Mix derived from current dependency and hydro share with projected wind/solar remainder.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: "background.paper", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                Shipping toolkit
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
                One path from demo to embed to production
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
                Copy/paste the iframe, switch themes, toggle sr/en, or import the library directly. This page mirrors the GitHub Pages deployment so you can rehearse exactly what audiences will see.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button component={Link} href="/demos/presentation-enhanced" variant="contained" size="large">
                  Open presentation mode
                </Button>
                <Button component={Link} href="/library-showcase" variant="outlined" size="large">
                  Library showcase
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Quick embed snippet
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: "grey.900",
                      color: "grey.100",
                      p: 2,
                      borderRadius: 2,
                      fontSize: 13,
                      overflowX: "auto",
                    }}
                  >{`<iframe
  src="https://acailic.github.io/vizualni-admin/embed/demo?theme=dark&lang=en"
  style="width: 100%; height: 520px; border: 0;"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>`}</Box>
                  <Typography variant="caption" color="text.secondary">
                    Uses the live /embed/demo endpoint with iframe-resizer for responsive sizing.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
