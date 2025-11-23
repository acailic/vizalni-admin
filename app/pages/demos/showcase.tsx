import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";

import { ColumnChart, LineChart, PieChart } from "@/components/demos/charts";
import { DemoLayout } from "@/components/demos/demo-layout";
import {
  showcaseDigitalSkills,
  showcaseEnergyMix,
  showcaseRegionalGrowth,
  showcaseRidershipTrend,
} from "@/data/demo-showcase";

export default function DemoShowcasePage() {
  const { i18n } = useLingui();

  const text = {
    title: i18n._(
      defineMessage({ id: "demos.showcase.title", message: "Demo Showcase Visualizations" })
    ),
    description: i18n._(
      defineMessage({
        id: "demos.showcase.description",
        message: "A quick look at multiple chart types using representative datasets.",
      })
    ),
    hero: i18n._(
      defineMessage({
        id: "demos.showcase.hero",
        message: "A bundle of high-signal indicators across economy, mobility, energy, and digitalization.",
      })
    ),
    cta: i18n._(
      defineMessage({ id: "demos.showcase.cta", message: "Browse all demo pages" })
    ),
    economyTitle: i18n._(
      defineMessage({ id: "demos.showcase.economy.title", message: "Regional GDP Growth" })
    ),
    economyDesc: i18n._(
      defineMessage({
        id: "demos.showcase.economy.description",
        message: "Year-over-year GDP growth by region.",
      })
    ),
    transportTitle: i18n._(
      defineMessage({ id: "demos.showcase.transport.title", message: "Public Transport Momentum" })
    ),
    transportDesc: i18n._(
      defineMessage({
        id: "demos.showcase.transport.description",
        message: "Trips in millions – COVID dip in 2020, then a steady recovery.",
      })
    ),
    energyTitle: i18n._(
      defineMessage({ id: "demos.showcase.energy.title", message: "Energy Mix Snapshot" })
    ),
    energyDesc: i18n._(
      defineMessage({
        id: "demos.showcase.energy.description",
        message: "Share of electricity generation by source.",
      })
    ),
    digitalTitle: i18n._(
      defineMessage({ id: "demos.showcase.digital.title", message: "Digital Skills Gap" })
    ),
    digitalDesc: i18n._(
      defineMessage({
        id: "demos.showcase.digital.description",
        message: "Share of population with at least basic digital skills.",
      })
    ),
    datasetTitle: i18n._(
      defineMessage({ id: "demos.showcase.dataset.title", message: "Showcase indicators" })
    ),
    datasetOrganization: i18n._(
      defineMessage({ id: "demos.showcase.dataset.organization", message: "Sample dataset" })
    ),
    chips: {
      economy: i18n._(
        defineMessage({ id: "demos.showcase.chip.economy", message: "Economic pulse" })
      ),
      mobility: i18n._(
        defineMessage({ id: "demos.showcase.chip.mobility", message: "Mobility" })
      ),
      energy: i18n._(defineMessage({ id: "demos.showcase.chip.energy", message: "Energy" })),
      digital: i18n._(defineMessage({ id: "demos.showcase.chip.digital", message: "Digital" })),
    },
    heroCards: [
      {
        label: i18n._(
          defineMessage({ id: "demos.showcase.hero.stat1.label", message: "GDP YoY: +4.3%" })
        ),
        hint: i18n._(
          defineMessage({ id: "demos.showcase.hero.stat1.hint", message: "Belgrade leads" })
        ),
      },
      {
        label: i18n._(
          defineMessage({ id: "demos.showcase.hero.stat2.label", message: "Trips 2023: 171M" })
        ),
        hint: i18n._(
          defineMessage({ id: "demos.showcase.hero.stat2.hint", message: "Steady recovery" })
        ),
      },
      {
        label: i18n._(
          defineMessage({ id: "demos.showcase.hero.stat3.label", message: "Coal share: 64%" })
        ),
        hint: i18n._(
          defineMessage({ id: "demos.showcase.hero.stat3.hint", message: "Needs diversification" })
        ),
      },
    ],
  };

  return (
    <DemoLayout
      title={text.title}
      description={text.description}
      datasetInfo={{
        title: text.datasetTitle,
        organization: text.datasetOrganization,
        updatedAt: "2024-12-31",
      }}
    >
      <Card
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #22d3ee 100%)",
          color: "white",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.4)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
              {text.hero}
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
              <Chip label={text.chips.economy} color="primary" />
              <Chip
                label={text.chips.mobility}
                sx={{ background: "rgba(255,255,255,0.15)", color: "white" }}
              />
              <Chip
                label={text.chips.energy}
                sx={{ background: "rgba(255,255,255,0.15)", color: "white" }}
              />
              <Chip
                label={text.chips.digital}
                sx={{ background: "rgba(255,255,255,0.15)", color: "white" }}
              />
            </Stack>
            <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 640 }}>
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
                      p: 2,
                      background: "rgba(255,255,255,0.12)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.15)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.economyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.economyDesc}
              </Typography>
              <Box sx={{ overflowX: "auto", pb: 1 }}>
                <ColumnChart
                  data={showcaseRegionalGrowth}
                  xKey="region"
                  yKey="growth"
                  width={760}
                  height={360}
                  xLabel={i18n._(
                    defineMessage({ id: "demos.showcase.economy.xlabel", message: "Region" })
                  )}
                  yLabel={i18n._(
                    defineMessage({ id: "demos.showcase.economy.ylabel", message: "Growth (%)" })
                  )}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.transportTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                    defineMessage({ id: "demos.showcase.transport.xlabel", message: "Year" })
                  )}
                  yLabel={i18n._(
                    defineMessage({ id: "demos.showcase.transport.ylabel", message: "Million trips" })
                  )}
                  color="#0ea5e9"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.energyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.digitalTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                    defineMessage({ id: "demos.showcase.digital.xlabel", message: "Segment" })
                  )}
                  yLabel={i18n._(
                    defineMessage({ id: "demos.showcase.digital.ylabel", message: "Share (%)" })
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
          mt: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(105deg, rgba(14,165,233,0.1), rgba(34,197,94,0.08))",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {i18n._(
                defineMessage({ id: "demos.showcase.cta.title", message: "Want more?" })
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {i18n._(
                defineMessage({
                  id: "demos.showcase.cta.body",
                  message: "Visit the full gallery for more categories and live data pulls.",
                })
              )}
            </Typography>
          </Box>
          <Box
            component="a"
            href="/demos"
            style={{
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1px solid #0ea5e9",
              color: "#0e7490",
              fontWeight: 600,
            }}
          >
            {text.cta}
          </Box>
        </Stack>
      </Card>
    </DemoLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
