import { useLingui } from "@lingui/react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  alpha,
  useTheme,
  Skeleton,
} from "@mui/material";
import React from "react";

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
  const theme = useTheme();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate loading for data fetch
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
      ? "Analiza starosne strukture stanovništva Srbije po polu, sa projekcijama do 2050. godine"
      : "Analysis of Serbia's population structure by age and gender, with projections to 2050";

  const dashboardContent = (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
          color: "white",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
        }}
        role="banner"
        aria-label={
          locale === "sr" ? "Demografija Srbije" : "Serbia Demographics"
        }
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            👥 {locale === "sr" ? "Demografija Srbije" : "Serbia Demographics"}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 2 }}>
            {locale === "sr"
              ? "Analiza starosne strukture stanovništva Srbije po polu, sa projekcijama do 2050. godine"
              : "Analysis of Serbia's population structure by age and gender, with projections to 2050"}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 3,
            p: 3,
            textAlign: "center",
            minWidth: 180,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            {(totalPopulation / 1000000).toFixed(2)}M
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {locale === "sr" ? "Stanovnika (2024)" : "Population (2024)"}
          </Typography>
        </Box>
      </Box>

      <LiveDatasetPanel
        demoId="demographics"
        title={
          locale === "sr"
            ? "Živi podaci (demografija)"
            : "Live data (demographics)"
        }
      />

      <Alert
        severity="warning"
        icon={<span style={{ fontSize: "1.5rem" }}>⚠️</span>}
        sx={{ mb: 4, fontSize: "1rem", fontWeight: 500 }}
      >
        {locale === "sr" ? (
          <>
            <strong>DEMOGRAFSKO UPOZORENJE:</strong> Stanovništvo Srbije opada.
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

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "primary.main",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>👥</Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Ukupno stanovnika (2024)"
                    : "Total Population (2024)"}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {(totalPopulation / 1000000).toFixed(2)}M
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? `Muškarci: ${malePercent}% • Žene: ${femalePercent}%`
                  : `Male: ${malePercent}% • Female: ${femalePercent}%`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "error.main",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>📉</Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr" ? "Promena do 2050." : "Change by 2050"}
                </Typography>
              </Box>
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
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "warning.main",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>🎂</Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr" ? "Medijalna starost" : "Median Age"}
                </Typography>
              </Box>
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
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "info.main",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>⚖️</Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Odnos zavisnosti starijih"
                    : "Elderly Dependency Ratio"}
                </Typography>
              </Box>
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

      {/* Population Age Pyramid */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: "1.5rem" }}>📊</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {locale === "sr"
              ? "Starosna piramida stanovništva (2024)"
              : "Population Age Pyramid (2024)"}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Raspodela stanovništva po starosti i polu pokazuje starenje populacije sa znatno manje mladih u odnosu na starije generacije."
            : "Population distribution by age and gender shows an aging population with significantly fewer young people compared to older generations."}
        </Typography>
        {isLoading ? (
          <Box
            sx={{
              width: "100%",
              height: 650,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 900 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="80%" height={30} />
            </Box>
          </Box>
        ) : (
          <PopulationPyramid
            data={agePopulationData}
            title=""
            width={900}
            height={650}
            aria-label={
              locale === "sr" ? "Starosna piramida" : "Age pyramid chart"
            }
          />
        )}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.08),
            borderRadius: 2,
            borderLeft: 3,
            borderColor: "warning.main",
          }}
        >
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            💡{" "}
            {locale === "sr"
              ? "Ključni uvid: Oblik piramide pokazuje izraženo starenje populacije, sa najvećim grupama u srednjim i starijim godinama."
              : "Key insight: The pyramid shape shows pronounced population aging, with largest groups in middle and older ages."}
          </Typography>
        </Box>
      </Paper>

      {/* Population Trends */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: "1.5rem" }}>📈</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {locale === "sr"
              ? "Trendovi stanovništva (1950-2050)"
              : "Population Trends (1950-2050)"}
          </Typography>
        </Box>
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
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha(theme.palette.error.main, 0.08),
            borderRadius: 2,
            borderLeft: 3,
            borderColor: "error.main",
          }}
        >
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            💡{" "}
            {locale === "sr"
              ? "Ključni uvid: Vrhunac populacije dostignut je oko 1990. godine, od tada prati konstantan pad."
              : "Key insight: Population peaked around 1990, since then showing constant decline."}
          </Typography>
        </Box>
      </Paper>

      {/* Regional Distribution */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: "1.5rem" }}>🗺️</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {locale === "sr"
              ? "Regionalna raspodela stanovništva (2024)"
              : "Regional Population Distribution (2024)"}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {regionalPopulation.map((region) => {
            const percentage =
              (region.population / (totalPopulation / 1000)) * 100;
            return (
              <Grid item xs={12} sm={6} md={3} key={region.region}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
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
                    <Box sx={{ mt: 1.5, mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.warning.main, 0.2),
                          "& .MuiLinearProgress-bar": {
                            bgcolor: theme.palette.warning.main,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {percentage.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Key Challenges */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: "1.5rem" }}>⚠️</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {locale === "sr"
              ? "Ključni demografski izazovi"
              : "Key Demographic Challenges"}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.05),
                mb: 2,
              }}
            >
              <Chip
                label={
                  locale === "sr"
                    ? "Negativna stopa rasta"
                    : "Negative growth rate"
                }
                size="small"
                sx={{
                  bgcolor: theme.palette.error.main,
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Stopa rasta: ${demographicStats.populationGrowthRate}% godišnje`
                  : `Growth rate: ${demographicStats.populationGrowthRate}% annually`}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.05),
                mb: 2,
              }}
            >
              <Chip
                label={
                  locale === "sr" ? "Niska stopa rađanja" : "Low birth rate"
                }
                size="small"
                sx={{
                  bgcolor: theme.palette.error.main,
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Stopa rađanja: ${demographicStats.birthRate} na 1.000 stanovnika`
                  : `Birth rate: ${demographicStats.birthRate} per 1,000 population`}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.05),
              }}
            >
              <Chip
                label={
                  locale === "sr" ? "Visoka stopa smrtnosti" : "High death rate"
                }
                size="small"
                sx={{
                  bgcolor: theme.palette.warning.main,
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Stopa smrtnosti: ${demographicStats.deathRate} na 1.000 stanovnika`
                  : `Death rate: ${demographicStats.deathRate} per 1,000 population`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.05),
                mb: 2,
              }}
            >
              <Chip
                label={
                  locale === "sr" ? "Starenje stanovništva" : "Aging population"
                }
                size="small"
                sx={{
                  bgcolor: theme.palette.warning.main,
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Visok odnos starijih: ${dependencyRatios.elderly} (65+ na 100 radno sposobnih)`
                  : `High elderly ratio: ${dependencyRatios.elderly} (65+ per 100 working-age)`}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                mb: 2,
              }}
            >
              <Chip
                label={
                  locale === "sr" ? "Očekivani životni vek" : "Life expectancy"
                }
                size="small"
                sx={{
                  bgcolor: theme.palette.info.main,
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `Muškarci: ${demographicStats.lifeExpectancyMale} god. • Žene: ${demographicStats.lifeExpectancyFemale} god.`
                  : `Males: ${demographicStats.lifeExpectancyMale} yrs • Females: ${demographicStats.lifeExpectancyFemale} yrs`}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.grey[500], 0.05),
              }}
            >
              <Chip
                label={locale === "sr" ? "Urbanizacija" : "Urbanization"}
                size="small"
                sx={{
                  bgcolor: theme.palette.grey[500],
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                {locale === "sr"
                  ? `${demographicStats.urbanPopulation}% stanovnika živi u gradskim područjima`
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
          header: locale === "sr" ? "Muškarci (mil)" : "Male (mil)",
          width: 150,
        },
        {
          key: "female",
          header: locale === "sr" ? "Žene (mil)" : "Female (mil)",
          width: 150,
        },
      ]}
    />
  );
}
