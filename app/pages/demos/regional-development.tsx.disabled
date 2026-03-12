/**
 * Serbia Regional Development - A Data Story
 * Narrative demo showing regional disparities and development patterns
 * Source: Statistical Office of the Republic of Serbia via data.gov.rs
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import BalanceIcon from "@mui/icons-material/Balance";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { DemoPageTemplate } from "@/components/demo/DemoPageTemplate";
import { ColumnChart, BarChart } from "@/components/demos/charts";
import { LiveDatasetPanel } from "@/components/demos/LiveDatasetPanel";

// ============================================================================
// DATA STORY: Regional Development Disparities in Serbia
// ============================================================================
// This data story explores the significant differences in development between
// Serbian regions, highlighting the Belgrade-centric development pattern and
// the challenges faced by other regions.
//
// KEY NARRATIVES:
// 1. Belgrade dominance in economic output
// 2. Regional GDP per capita disparities
// 3. Population concentration in capital
// 4. Infrastructure gaps between regions
// 5. Investment attraction patterns
// ============================================================================

// Regional GDP (millions EUR)
const regionalGDP = [
  {
    region: "Beograd",
    regionEn: "Belgrade",
    gdp2023: 28500,
    share: 42.3,
    gdpPerCapita: 18200,
    population: 1685000,
  },
  {
    region: "Vojvodina",
    regionEn: "Vojvodina",
    gdp2023: 18500,
    share: 27.5,
    gdpPerCapita: 12500,
    population: 1480000,
  },
  {
    region: "Šumadija i Zapadna Srbija",
    regionEn: "Šumadija and Western Serbia",
    gdp2023: 9200,
    share: 13.7,
    gdpPerCapita: 9800,
    population: 938000,
  },
  {
    region: "Južna i Istočna Srbija",
    regionEn: "Southern and Eastern Serbia",
    gdp2023: 8800,
    share: 13.1,
    gdpPerCapita: 8200,
    population: 1073000,
  },
  {
    region: "Kosovo i Metohija",
    regionEn: "Kosovo and Metohija",
    gdp2023: 2400,
    share: 3.6,
    gdpPerCapita: 4200,
    population: 571000,
  },
];

// Regional GDP trends (2015-2023)
const regionalGDPTrends = [
  {
    year: "2015",
    Belgrade: 19800,
    Vojvodina: 14200,
    Sumadija: 6800,
    South: 6200,
  },
  {
    year: "2016",
    Belgrade: 21200,
    Vojvodina: 14800,
    Sumadija: 7100,
    South: 6400,
  },
  {
    year: "2017",
    Belgrade: 22800,
    Vojvodina: 15500,
    Sumadija: 7500,
    South: 6700,
  },
  {
    year: "2018",
    Belgrade: 24500,
    Vojvodina: 16200,
    Sumadija: 7900,
    South: 7000,
  },
  {
    year: "2019",
    Belgrade: 25800,
    Vojvodina: 16900,
    Sumadija: 8200,
    South: 7300,
  },
  {
    year: "2020",
    Belgrade: 24200,
    Vojvodina: 15800,
    Sumadija: 7800,
    South: 6900,
  },
  {
    year: "2021",
    Belgrade: 26500,
    Vojvodina: 17200,
    Sumadija: 8600,
    South: 8100,
  },
  {
    year: "2022",
    Belgrade: 27800,
    Vojvodina: 18100,
    Sumadija: 9000,
    South: 8500,
  },
  {
    year: "2023",
    Belgrade: 28500,
    Vojvodina: 18500,
    Sumadija: 9200,
    South: 8800,
  },
];

// Foreign Direct Investment by region (millions EUR)
const fdiByRegion = [
  {
    region: "Beograd",
    regionEn: "Belgrade",
    fdi2023: 3200,
    share: 68.5,
    projects: 145,
  },
  {
    region: "Vojvodina",
    regionEn: "Vojvodina",
    fdi2023: 980,
    share: 21.0,
    projects: 68,
  },
  {
    region: "Šumadija i Zapadna Srbija",
    regionEn: "Šumadija and Western Serbia",
    fdi2023: 350,
    share: 7.5,
    projects: 28,
  },
  {
    region: "Južna i Istočna Srbija",
    regionEn: "Southern and Eastern Serbia",
    fdi2023: 140,
    share: 3.0,
    projects: 15,
  },
];

// Unemployment by region
const unemploymentByRegion = [
  {
    region: "Beograd",
    regionEn: "Belgrade",
    unemployment: 5.8,
    youthUnemployment: 18.5,
    trend: -2.3,
  },
  {
    region: "Vojvodina",
    regionEn: "Vojvodina",
    unemployment: 8.2,
    youthUnemployment: 22.8,
    trend: -1.8,
  },
  {
    region: "Šumadija i Zapadna Srbija",
    regionEn: "Šumadija and Western Serbia",
    unemployment: 11.5,
    youthUnemployment: 28.3,
    trend: -0.8,
  },
  {
    region: "Južna i Istočna Srbija",
    regionEn: "Southern and Eastern Serbia",
    unemployment: 14.2,
    youthUnemployment: 35.8,
    trend: -0.5,
  },
];

// Infrastructure indicators by region
const infrastructureByRegion = [
  {
    region: "Beograd",
    regionEn: "Belgrade",
    highwayAccess: 100,
    broadbandCoverage: 99.5,
    digitalSkills: 82.3,
    hospitalBeds: 1250,
  },
  {
    region: "Vojvodina",
    regionEn: "Vojvodina",
    highwayAccess: 78,
    broadbandCoverage: 92.8,
    digitalSkills: 68.5,
    hospitalBeds: 850,
  },
  {
    region: "Šumadija i Zapadna Srbija",
    regionEn: "Šumadija and Western Serbia",
    highwayAccess: 52,
    broadbandCoverage: 85.2,
    digitalSkills: 58.3,
    hospitalBeds: 620,
  },
  {
    region: "Južna i Istočna Srbija",
    regionEn: "Southern and Eastern Serbia",
    highwayAccess: 38,
    broadbandCoverage: 78.5,
    digitalSkills: 48.2,
    hospitalBeds: 580,
  },
];

// Population change by region (2015-2023)
const populationChange = [
  {
    region: "Beograd",
    regionEn: "Belgrade",
    pop2015: 1635000,
    pop2023: 1685000,
    change: 3.1,
  },
  {
    region: "Vojvodina",
    regionEn: "Vojvodina",
    pop2015: 1518000,
    pop2023: 1480000,
    change: -2.5,
  },
  {
    region: "Šumadija i Zapadna Srbija",
    regionEn: "Šumadija and Western Serbia",
    pop2015: 985000,
    pop2023: 938000,
    change: -4.8,
  },
  {
    region: "Južna i Istočna Srbija",
    regionEn: "Southern and Eastern Serbia",
    pop2015: 1152000,
    pop2023: 1073000,
    change: -6.9,
  },
];

export default function RegionalDevelopmentDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const title = i18n._(
    defineMessage({
      id: "demos.regional-development.title",
      message: "🗺️ Serbia Regional Development - A Data Story",
    })
  );

  const description = i18n._(
    defineMessage({
      id: "demos.regional-development.description",
      message:
        "Exploring regional disparities, Belgrade dominance, and development challenges across Serbia",
    })
  );

  const belgradeShare = regionalGDP[0].share;
  const belgradeVsLowestGDP = (
    regionalGDP[0].gdpPerCapita /
    regionalGDP[regionalGDP.length - 1].gdpPerCapita
  ).toFixed(1);

  const dashboardContent = (
    <Box>
      <LiveDatasetPanel
        demoId="regional-development"
        title={
          locale === "sr"
            ? "Živi podaci (regionalni razvoj)"
            : "Live data (regional development)"
        }
      />

      {/* Narrative Introduction */}
      <Alert
        severity="warning"
        sx={{
          mb: 4,
          fontSize: "1.1rem",
          fontWeight: 500,
          borderLeft: 6,
          borderColor: "warning.main",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          {locale === "sr"
            ? "📖 PRIČA IZ PODATAKA: Regionalne nejednakosti u Srbiji"
            : "📖 DATA STORY: Regional Inequalities in Serbia"}
        </Typography>
        <Typography variant="body2">
          {locale === "sr"
            ? `Beograd sačinjava ${belgradeShare}% BDP-a Srbije, iako ima samo 24% stanovništva. BDP po glavi stanovnika u Beogradu (${belgradeVsLowestGDP}x) je ${belgradeVsLowestGDP} puta veći nego u najmanje razvijenom regionu. Ova "centralizacija" predstavlja jedan od najvećih razvojnih izazova Srbije.`
            : `Belgrade accounts for ${belgradeShare}% of Serbia's GDP while having only 24% of the population. GDP per capita in Belgrade is ${belgradeVsLowestGDP}x higher than in the least developed region. This "centralization" represents one of Serbia's major development challenges.`}
        </Typography>
      </Alert>

      {/* Key Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "primary.main" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Beogradov udio u BDP-u"
                    : "Belgrade GDP Share"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "primary.main" }}
              >
                {belgradeShare}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? "od ukupnog BDP-a Srbije"
                  : "of Serbia total GDP"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "warning.main" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <BalanceIcon sx={{ mr: 1, color: "warning.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Razlika u BDP-u po glavi"
                    : "GDP per Capita Gap"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "warning.main" }}
              >
                {belgradeVsLowestGDP}x
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? "Beograd vs najmanje razvijeni"
                  : "Belgrade vs least developed"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "error.main" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingDownIcon sx={{ mr: 1, color: "error.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Nezaposlenost (Jug+Istok)"
                    : "Unemployment (South+East)"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "error.main" }}
              >
                14.2%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr" ? "vs 5.8% u Beogradu" : "vs 5.8% in Belgrade"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "success.main" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: "success.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Beogradski rast stanovništva"
                    : "Belgrade Population Growth"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "success.main" }}
              >
                +3.1%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr" ? "2015-2023" : "2015-2023"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Regional GDP Overview */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "💰 Regionalni BDP - Dominacija Beograda"
            : "💰 Regional GDP - Belgrade Dominance"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Beograd generiše više od 40% ukupnog BDP-a Srbije, slede Vojvodina sa 27.5%, dok ostali regioni znatno zaostaju."
            : "Belgrade generates over 40% of Serbia total GDP, followed by Vojvodina with 27.5%, while other regions significantly lag behind."}
        </Typography>
        <Box sx={{ height: 500 }}>
          <BarChart
            data={regionalGDP.map((d) => ({
              region: locale === "sr" ? d.region : d.regionEn,
              GDP: d.gdp2023,
            }))}
            xKey="region"
            yKey="GDP"
            width={950}
            height={500}
          />
        </Box>
      </Paper>

      {/* GDP per Capita Comparison */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "📊 BDP po glavi stanovnika - Značajna nejednakost"
            : "📊 GDP per Capita - Significant Inequality"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Beogradski BDP po glavi (€18,200) je dvostruko veći od proseka Vojvodine i 4.3x veći od najmanje razvijenog regiona."
            : "Belgrade GDP per capita (€18,200) is double the Vojvodina average and 4.3x higher than the least developed region."}
        </Typography>
        <Box sx={{ height: 450 }}>
          <ColumnChart
            data={regionalGDP.map((d) => ({
              region: locale === "sr" ? d.region : d.regionEn,
              "GDP per Capita": d.gdpPerCapita,
            }))}
            xKey="region"
            yKey="GDP per Capita"
            width={950}
            height={450}
          />
        </Box>
      </Paper>

      {/* Regional GDP Trends Over Time */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "📈 Trendovi regionalnog BDP-a (2015-2023)"
            : "📈 Regional GDP Trends (2015-2023)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Svi regioni su beležili rast, ali Beograd je zadržao prednost u apsolutnom iznosu i tempu rasta."
            : "All regions have shown growth, but Belgrade has maintained its lead in absolute terms and growth rate."}
        </Typography>
        <Box sx={{ height: 500 }}>
          <ColumnChart
            data={regionalGDPTrends.map((d) => ({
              year: d.year,
              Belgrade: d.Belgrade,
              Vojvodina: d.Vojvodina,
              Šumadija: d.Sumadija,
              South: d.South,
            }))}
            xKey="year"
            yKey={["Belgrade", "Vojvodina", "Šumadija", "South"]}
            multiSeries={true}
            stacked={false}
            width={950}
            height={500}
          />
        </Box>
      </Paper>

      {/* Foreign Direct Investment by Region */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "🌍 Strane direktne investicije po regionima (2023)"
            : "🌍 Foreign Direct Investment by Region (2023)"}
        </Typography>
        <Grid container spacing={2}>
          {fdiByRegion.map((region) => (
            <Grid item xs={12} sm={6} md={3} key={region.region}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {locale === "sr" ? region.region : region.regionEn}
                  </Typography>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {locale === "sr" ? "Iznos:" : "Amount:"}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        €{region.fdi2023}M
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {locale === "sr" ? "Udeo:" : "Share:"}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {region.share}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {locale === "sr" ? "Projekti:" : "Projects:"}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {region.projects}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Unemployment by Region */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "💼 Nezaposlenost po regionima"
            : "💼 Unemployment by Region"}
        </Typography>
        <Box sx={{ height: 450 }}>
          <ColumnChart
            data={unemploymentByRegion.map((d) => ({
              region: locale === "sr" ? d.region : d.regionEn,
              Total: d.unemployment,
              Youth: d.youthUnemployment,
            }))}
            xKey="region"
            yKey={["Total", "Youth"]}
            multiSeries={true}
            stacked={false}
            width={950}
            height={450}
          />
        </Box>
      </Paper>

      {/* Infrastructure Gap */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "🏗️ Infrastrukturna razlika"
            : "🏗️ Infrastructure Gap"}
        </Typography>
        <Grid container spacing={2}>
          {infrastructureByRegion.map((region) => (
            <Grid item xs={12} md={6} key={region.region}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {locale === "sr" ? region.region : region.regionEn}
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {locale === "sr"
                            ? "Pristup autoputu:"
                            : "Highway access:"}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {region.highwayAccess}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          backgroundColor: "grey.200",
                          borderRadius: 1,
                          height: 6,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${region.highwayAccess}%`,
                            backgroundColor:
                              region.highwayAccess >= 75
                                ? "success.main"
                                : region.highwayAccess >= 50
                                  ? "warning.main"
                                  : "error.main",
                            height: "100%",
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {locale === "sr"
                            ? "Širokopojasni pristup:"
                            : "Broadband coverage:"}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {region.broadbandCoverage}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          backgroundColor: "grey.200",
                          borderRadius: 1,
                          height: 6,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${region.broadbandCoverage}%`,
                            backgroundColor:
                              region.broadbandCoverage >= 90
                                ? "success.main"
                                : region.broadbandCoverage >= 80
                                  ? "warning.main"
                                  : "error.main",
                            height: "100%",
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justification: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {locale === "sr"
                            ? "Digitalne veštine:"
                            : "Digital skills:"}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {region.digitalSkills}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          backgroundColor: "grey.200",
                          borderRadius: 1,
                          height: 6,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${region.digitalSkills}%`,
                            backgroundColor:
                              region.digitalSkills >= 70
                                ? "success.main"
                                : region.digitalSkills >= 55
                                  ? "warning.main"
                                  : "error.main",
                            height: "100%",
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Population Migration */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "👥 Promena stanovništva (2015-2023)"
            : "👥 Population Change (2015-2023)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Beograd privlači stanovništvo iz cele zemlje, dok ostali regioni beleže pad. Ovo pojačava regionalne nejednakosti."
            : "Belgrade attracts population from across the country, while other regions decline. This amplifies regional inequalities."}
        </Typography>
        <Box sx={{ height: 450 }}>
          <ColumnChart
            data={populationChange.map((d) => ({
              region: locale === "sr" ? d.region : d.regionEn,
              Change: d.change,
            }))}
            xKey="region"
            yKey="Change"
            width={950}
            height={450}
          />
        </Box>
      </Paper>

      {/* Key Insights */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          background:
            "linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr" ? "🔑 Ključni izazovi" : "🔑 Key Challenges"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "⚖️ Ekonomska centralizacija"
                    : "⚖️ Economic Centralization"
                }
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "Beograd generiše 42.3% BDP-a, što je najviši nivo koncentracije ekonomije u Evropi."
                  : "Belgrade generates 42.3% of GDP, the highest level of economic concentration in Europe."}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "💼 Tržište rada neravnoteža"
                    : "💼 Labor Market Imbalance"
                }
                color="error"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "Nezaposlenost je 2.4x viša u južnim regionima (14.2%) nego u Beogradu (5.8%)."
                  : "Unemployment is 2.4x higher in southern regions (14.2%) than in Belgrade (5.8%)."}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "🏗️ Infrastrukturni jaz"
                    : "🏗️ Infrastructure Gap"
                }
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "Pristup autoputu se kreće od 100% u Beogradu do 38% na jugu i istoku."
                  : "Highway access ranges from 100% in Belgrade to 38% in the south and east."}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "🌍 SDI koncentracija"
                    : "🌍 FDI Concentration"
                }
                color="info"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "68.5% stranih investicija odlazi u Beograd, ostatak zemlje dobija samo 31.5%."
                  : "68.5% of foreign investment goes to Belgrade, the rest of the country receives only 31.5%."}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Source */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: "grey.50",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {locale === "sr" ? "📊 Izvor podataka" : "📊 Data Source"}
        </Typography>
        <Typography variant="body2" paragraph>
          {locale === "sr"
            ? "Podaci su prikupljeni iz statističkih publikacija Republičkog zavoda za statistiku, uključujući Statistički godišnjak i regionalne statistike. Podaci su dostupni preko portala otvorenih podataka data.gov.rs."
            : "Data sourced from Statistical Office of the Republic of Serbia publications, including the Statistical Yearbook and regional statistics. Data available through the open data portal data.gov.rs."}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          endIcon={<OpenInNewIcon />}
          href="https://data.gov.rs/datasets?tags=regionalni-razvoj"
          target="_blank"
          rel="noopener noreferrer"
        >
          {locale === "sr"
            ? "Poseti data.gov.rs - Regionalni razvoj"
            : "Visit data.gov.rs - Regional Development"}
        </Button>
      </Paper>
    </Box>
  );

  return (
    <DemoPageTemplate
      title={title}
      description={description}
      datasetId="regional-development-demo"
      chartComponent={dashboardContent}
      fallbackData={regionalGDP}
      insightsConfig={{
        datasetId: "regional-development-demo",
        sampleData: regionalGDP,
        valueColumn: "gdp2023",
        timeColumn: "region",
      }}
      columns={[
        {
          key: "region",
          header: locale === "sr" ? "Region" : "Region",
          width: 200,
        },
        {
          key: "gdp2023",
          header: locale === "sr" ? "BDP 2023 (M€)" : "GDP 2023 (M€)",
          width: 150,
        },
        {
          key: "share",
          header: locale === "sr" ? "Udeo (%)" : "Share (%)",
          width: 120,
        },
        {
          key: "gdpPerCapita",
          header: locale === "sr" ? "BDP po glavi (€)" : "GDP per Capita (€)",
          width: 150,
        },
        {
          key: "population",
          header: locale === "sr" ? "Stanovništvo" : "Population",
          width: 150,
        },
      ]}
    />
  );
}
