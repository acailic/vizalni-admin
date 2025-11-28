// @ts-nocheck
import { defineMessage } from "@lingui/macro";
import { Trans, useLingui } from "@lingui/react";
import { Alert, Box, Card, CardContent, Chip, Grid, Paper, Typography } from "@mui/material";
import { DemoPageTemplate } from "@/components/demo/DemoPageTemplate";
import { PopulationPyramid } from "@/components/demos/charts/PopulationPyramid";
import { PopulationTrends } from "@/components/demos/charts/PopulationTrends";
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
  const totalFemale = agePopulationData.reduce((sum, age) => sum + age.female, 0);
  const totalPopulation = (totalMale + totalFemale) * 1000;

  const population2024 = populationTrends[14];
  const populationChange2024to2050 =
    populationTrends[populationTrends.length - 1].total - population2024.total;
  const percentageChange = (
    (populationChange2024to2050 / population2024.total) * 100
  ).toFixed(1);
  const malePercent = (((totalMale * 1000) / totalPopulation) * 100).toFixed(1);
  const femalePercent = (((totalFemale * 1000) / totalPopulation) * 100).toFixed(1);
  const changeValue = Math.abs(populationChange2024to2050).toFixed(2);

  const title = i18n._(
    defineMessage({
      id: "demos.demographics.title",
      message: "👥 Serbia Demographics - Age Pyramid and Trends",
    })
  );
  const description = i18n._(
    defineMessage({
      id: "demos.demographics.description",
      message: "Analysis of Serbia's population structure by age and gender, with projections to 2050",
    })
  );

  const dashboardContent = (
    <Box>
      <LiveDatasetPanel
        demoId="demographics"
        title={locale === "sr" ? "Živi podaci (demografija)" : "Live data (demographics)"}
      />

      <Alert
        severity="warning"
        sx={{ mb: 4, fontSize: "1.1rem", fontWeight: 500 }}
      >
        <Trans
          id="demos.demographics.alert.detail"
          components={{ strong: <strong /> }}
          values={{
            percent: Math.abs(parseFloat(percentageChange)),
            from: population2024.total.toFixed(2),
            to: populationTrends[populationTrends.length - 1].total.toFixed(2),
            median: demographicStats.medianAge,
          }}
        >
          ⚠️ DEMOGRAPHIC WARNING: Serbia's population is declining.
          Projections show a decrease of
          <strong>{Math.abs(parseFloat(percentageChange))}%</strong> by 2050
          (from {population2024.total.toFixed(2)}M to
          {populationTrends[populationTrends.length - 1].total.toFixed(2)}M).
          Median age is <strong>{demographicStats.medianAge} years</strong>.
        </Trans>
      </Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: "100%", borderLeft: 4, borderColor: "primary.main" }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.cards.total.title",
                    message: "Total Population (2024)",
                  })
                )}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {(totalPopulation / 1000000).toFixed(2)}M
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.cards.total.detail",
                    message: "Male: {male}% • Female: {female}%",
                  }),
                  { male: malePercent, female: femalePercent }
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: "100%", borderLeft: 4, borderColor: "error.main" }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.cards.change.title",
                    message: "Change by 2050",
                  })
                )}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: "error.main" }}>
                {percentageChange}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.cards.change.detail",
                    message: "Decrease of ~{value}M people",
                  }),
                  { value: changeValue }
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: "100%", borderLeft: 4, borderColor: "warning.main" }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.cards.median.title",
                    message: "Median Age",
                  })
                )}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {demographicStats.medianAge}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.cards.median.detail",
                    message: "years",
                  })
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: "100%", borderLeft: 4, borderColor: "info.main" }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.cards.dependency.title",
                    message: "Elderly Dependency Ratio",
                  })
                )}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {dependencyRatios.elderly}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.cards.dependency.detail",
                    message: "65+ per 100 working-age",
                  })
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {i18n._(
            defineMessage({
              id: "demos.demographics.pyramid.title",
              message: "Population Age Pyramid (2024)",
            })
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {i18n._(
            defineMessage({
              id: "demos.demographics.pyramid.description",
              message:
                "Population distribution by age and gender shows an aging population with significantly fewer young people compared to older generations.",
            })
          )}
        </Typography>
        <PopulationPyramid data={agePopulationData} title="" width={900} height={650} />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {i18n._(
            defineMessage({
              id: "demos.demographics.trends.title",
              message: "Population Trends (1950-2050)",
            })
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {i18n._(
            defineMessage({
              id: "demos.demographics.trends.description",
              message:
                "Historical data shows constant growth until the 2000s, followed by a period of stagnation and decline. Projections indicate continuation of the negative trend.",
            })
          )}
        </Typography>
        <PopulationTrends data={populationTrends} title="" width={950} height={550} />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {i18n._(
            defineMessage({
              id: "demos.demographics.regional.title",
              message: "Regional Population Distribution (2024)",
            })
          )}
        </Typography>
        <Grid container spacing={2}>
          {regionalPopulation.map((region) => (
            <Grid item xs={12} sm={6} md={3} key={region.region}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {locale === "sr" ? region.region : region.regionEn}
                  </Typography>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                    {(region.population / 1000).toFixed(2)}M
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {i18n._(
                      defineMessage({
                        id: "demos.demographics.regional.share",
                        message: "{share}% of total population",
                      }),
                      {
                        share: ((region.population / (totalPopulation / 1000)) * 100).toFixed(1),
                      }
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {i18n._(
            defineMessage({
              id: "demos.demographics.challenges.title",
              message: "Key Demographic Challenges",
            })
          )}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.negative-growth",
                    message: "Negative growth rate",
                  })
                )}
                color="error"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.growth-rate",
                    message: "Growth rate: {rate}% annually",
                  }),
                  { rate: demographicStats.populationGrowthRate }
                )}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.low-birth",
                    message: "Low birth rate",
                  })
                )}
                color="error"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.birth-rate",
                    message: "Birth rate: {rate} per 1,000 population",
                  }),
                  { rate: demographicStats.birthRate }
                )}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.high-death",
                    message: "High death rate",
                  })
                )}
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.death-rate",
                    message: "Death rate: {rate} per 1,000 population",
                  }),
                  { rate: demographicStats.deathRate }
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.aging",
                    message: "Aging population",
                  })
                )}
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.elderly-ratio",
                    message: "High elderly ratio: {ratio} (65+ per 100 working-age)",
                  }),
                  { ratio: dependencyRatios.elderly }
                )}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.life-expectancy",
                    message: "Life expectancy",
                  })
                )}
                color="info"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.life-expectancy.detail",
                    message: "Males: {male} yrs • Females: {female} yrs",
                  }),
                  {
                    male: demographicStats.lifeExpectancyMale,
                    female: demographicStats.lifeExpectancyFemale,
                  }
                )}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.urbanization",
                    message: "Urbanization",
                  })
                )}
                color="default"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {i18n._(
                  defineMessage({
                    id: "demos.demographics.challenges.urbanization.detail",
                    message: "{share}% of population lives in urban areas",
                  }),
                  { share: demographicStats.urbanPopulation }
                )}
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
        datasetId: 'demographics-demo',
        sampleData: populationTrends,
        valueColumn: 'total',
        timeColumn: 'year',
      }}
      columns={[
        { key: 'year', header: locale === 'sr' ? 'Godina' : 'Year', width: 100 },
        { key: 'total', header: locale === 'sr' ? 'Ukupno (mil)' : 'Total (mil)', width: 150 },
        { key: 'male', header: locale === 'sr' ? 'Muškarci (mil)' : 'Male (mil)', width: 150 },
        { key: 'female', header: locale === 'sr' ? 'Žene (mil)' : 'Female (mil)', width: 150 },
      ]}
    />
  );
}
