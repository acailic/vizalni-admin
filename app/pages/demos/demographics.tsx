import { useLingui } from "@lingui/react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import { DemoPageTemplate } from "@/components/demo/DemoPageTemplate";
import { PopulationPyramid, PopulationTrends } from "@/components/demos/charts";
import { LiveDatasetPanel } from "@/components/demos/LiveDatasetPanel";
import {
  agePopulationData,
  demographicStats,
  dependencyRatios,
  populationTrends,
  regionalPopulation,
} from "@/data/serbia-demographics";

export default function DemographicsDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const totalMale = agePopulationData.reduce((sum, age) => sum + age.male, 0);
  const totalFemale = agePopulationData.reduce(
    (sum, age) => sum + age.female,
    0
  );
  const totalPopulation = (totalMale + totalFemale) * 1000;

  const population2024 = populationTrends[14];
  const populationChange2024to2050 =
    populationTrends[populationTrends.length - 1].total - population2024.total;
  const percentageChange = (
    (populationChange2024to2050 / population2024.total) *
    100
  ).toFixed(1);
  const malePercent = (((totalMale * 1000) / totalPopulation) * 100).toFixed(1);
  const femalePercent = (
    ((totalFemale * 1000) / totalPopulation) *
    100
  ).toFixed(1);
  const changeValue = Math.abs(populationChange2024to2050).toFixed(2);

  const title =
    locale === "sr"
      ? "Demografija Srbije - Starosna piramida i trendovi"
      : "Serbia Demographics - Age Pyramid and Trends";

  const description =
    locale === "sr"
      ? "Analiza starosne strukture stanovnistva Srbije po polu, sa projekcijama do 2050. godine"
      : "Analysis of Serbia's population structure by age and gender, with projections to 2050";

  const dashboardContent = (
    <Box>
      <LiveDatasetPanel
        demoId="demographics"
        title={
          locale === "sr"
            ? "Zivi podaci (demografija)"
            : "Live data (demographics)"
        }
      />

      <Alert
        severity="warning"
        sx={{ mb: 4, fontSize: "1.1rem", fontWeight: 500 }}
      >
        {locale === "sr" ? (
          <>
            <strong>DEMOGRAFSKO UPOZORENJE:</strong> Stanovnistvo Srbije opada.
            Projekcije pokazuju smanjenje od{" "}
            <strong>{Math.abs(parseFloat(percentageChange))}%</strong> do 2050.
            godine (sa {population2024.total.toFixed(2)}M na{" "}
            {populationTrends[populationTrends.length - 1].total.toFixed(2)}M).
            Medijalna starost je{" "}
            <strong>{demographicStats.medianAge} godina</strong>.
          </>
        ) : (
          <>
            <strong>DEMOGRAPHIC WARNING:</strong> Serbia's population is
            declining. Projections show a decrease of{" "}
            <strong>{Math.abs(parseFloat(percentageChange))}%</strong> by 2050
            (from {population2024.total.toFixed(2)}M to{" "}
            {populationTrends[populationTrends.length - 1].total.toFixed(2)}M).
            Median age is <strong>{demographicStats.medianAge} years</strong>.
          </>
        )}
      </Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "primary.main" }}
          >
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {locale === "sr"
                  ? "Ukupno stanovnika (2024)"
                  : "Total Population (2024)"}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {(totalPopulation / 1000000).toFixed(2)}M
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? `Muskarci: ${malePercent}% • Zene: ${femalePercent}%`
                  : `Male: ${malePercent}% • Female: ${femalePercent}%`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "error.main" }}
          >
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {locale === "sr" ? "Promena do 2050." : "Change by 2050"}
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "error.main" }}
              >
                {percentageChange}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? `Smanjenje za ~${changeValue}M ljudi`
                  : `Decrease of ~${changeValue}M people`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "warning.main" }}
          >
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {locale === "sr" ? "Medijalna starost" : "Median Age"}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {demographicStats.medianAge}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr" ? "godina" : "years"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "info.main" }}
          >
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {locale === "sr"
                  ? "Odnos zavisnosti starijih"
                  : "Elderly Dependency Ratio"}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {dependencyRatios.elderly}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? "65+ na 100 radno sposobnih"
                  : "65+ per 100 working-age"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "Starosna piramida stanovnistva (2024)"
            : "Population Age Pyramid (2024)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Raspodela stanovnistva po starosti i polu pokazuje starenje populacije sa znatno manje mladih u odnosu na starije generacije."
            : "Population distribution by age and gender shows an aging population with significantly fewer young people compared to older generations."}
        </Typography>
        <PopulationPyramid
          data={agePopulationData}
          title=""
          width={900}
          height={650}
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "Trendovi stanovnistva (1950-2050)"
            : "Population Trends (1950-2050)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Istorijski podaci pokazuju konstantan rast do 2000-ih, zatim period stagnacije i opadanja. Projekcije ukazuju na nastavak negativnog trenda."
            : "Historical data shows constant growth until the 2000s, followed by a period of stagnation and decline. Projections indicate continuation of the negative trend."}
        </Typography>
        <PopulationTrends
          data={populationTrends}
          title=""
          width={950}
          height={550}
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "Regionalna raspodela stanovnistva (2024)"
            : "Regional Population Distribution (2024)"}
        </Typography>
        <Grid container spacing={2}>
          {regionalPopulation.map((region) => (
            <Grid item xs={12} sm={6} md={3} key={region.region}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {locale === "sr" ? region.region : region.regionEn}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="primary.main"
                    sx={{ fontWeight: 700 }}
                  >
                    {(region.population / 1000).toFixed(2)}M
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {locale === "sr"
                      ? `${((region.population / (totalPopulation / 1000)) * 100).toFixed(1)}% od ukupnog stanovnistva`
                      : `${((region.population / (totalPopulation / 1000)) * 100).toFixed(1)}% of total population`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "Kljucni demografski izazovi"
            : "Key Demographic Challenges"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "Negativna stopa rasta"
                    : "Negative growth rate"
                }
                color="error"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `Stopa rasta: ${demographicStats.populationGrowthRate}% godisnje`
                  : `Growth rate: ${demographicStats.populationGrowthRate}% annually`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr" ? "Niska stopa radjananja" : "Low birth rate"
                }
                color="error"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `Stopa radjananja: ${demographicStats.birthRate} na 1.000 stanovnika`
                  : `Birth rate: ${demographicStats.birthRate} per 1,000 population`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr" ? "Visoka stopa smrtnosti" : "High death rate"
                }
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `Stopa smrtnosti: ${demographicStats.deathRate} na 1.000 stanovnika`
                  : `Death rate: ${demographicStats.deathRate} per 1,000 population`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr" ? "Starenje stanovnistva" : "Aging population"
                }
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `Visok odnos starijih: ${dependencyRatios.elderly} (65+ na 100 radno sposobnih)`
                  : `High elderly ratio: ${dependencyRatios.elderly} (65+ per 100 working-age)`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr" ? "Ocekivani zivotni vek" : "Life expectancy"
                }
                color="info"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `Muskarci: ${demographicStats.lifeExpectancyMale} god. • Zene: ${demographicStats.lifeExpectancyFemale} god.`
                  : `Males: ${demographicStats.lifeExpectancyMale} yrs • Females: ${demographicStats.lifeExpectancyFemale} yrs`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={locale === "sr" ? "Urbanizacija" : "Urbanization"}
                color="default"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `${demographicStats.urbanPopulation}% stanovnika zivi u gradskim podrucjima`
                  : `${demographicStats.urbanPopulation}% of population lives in urban areas`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  return (
    <DemoPageTemplate
      title={title}
      description={description}
      datasetId="demographics-demo"
      chartComponent={dashboardContent}
      fallbackData={populationTrends}
      insightsConfig={{
        datasetId: "demographics-demo",
        sampleData: populationTrends,
        valueColumn: "total",
        timeColumn: "year",
      }}
      columns={[
        {
          key: "year",
          header: locale === "sr" ? "Godina" : "Year",
          width: 100,
        },
        {
          key: "total",
          header: locale === "sr" ? "Ukupno (mil)" : "Total (mil)",
          width: 150,
        },
        {
          key: "male",
          header: locale === "sr" ? "Muskarci (mil)" : "Male (mil)",
          width: 150,
        },
        {
          key: "female",
          header: locale === "sr" ? "Zene (mil)" : "Female (mil)",
          width: 150,
        },
      ]}
    />
  );
}
