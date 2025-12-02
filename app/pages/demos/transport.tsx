// @ts-nocheck
/**
 * Traffic Safety Crisis Visualization
 * Alarming data about road fatalities, preventable accidents, and poor infrastructure
 */

import { useLingui } from '@lingui/react';
import { Alert, Box, Card, CardContent, Chip, Grid, LinearProgress, Paper, Typography } from '@mui/material';

import { DemoPageTemplate } from '@/components/demo/DemoPageTemplate';
import { BarChart, LineChart } from '@/components/demos/charts';
import { LiveDatasetPanel } from '@/components/demos/LiveDatasetPanel';
import {
  accidentCauses,
  comparativeData,
  roadInfrastructure,
  trafficFatalities,
  trafficStats
} from '@/data/serbia-traffic-safety';

export default function TransportDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith('sr') ? 'sr' : 'en';

  const title = locale === 'sr'
    ? '🚨 Saobraćajna kriza - Preventabilne smrti na putevima'
    : '🚨 Traffic Crisis - Preventable Road Deaths';

  const description = locale === 'sr'
    ? 'Alarmantni podaci o saobraćajnim nezgodama, preventabilnim smrtima i lošoj infrastrukturi'
    : 'Alarming data on traffic accidents, preventable deaths, and poor infrastructure';

  const dashboardContent = (
    <Box>
      <LiveDatasetPanel demoId="transport" title={locale === 'sr' ? 'Živi podaci (saobraćaj)' : 'Live data (transport)'} />
      <Box>
        {/* Critical Warning Banner */}
        <Alert
          severity="error"
          sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}
        >
          {locale === 'sr' ? (
            <>
              <strong>⚠️ KRITIČNO STANJE BEZBEDNOSTI:</strong> U 2024. godini, <strong>{trafficStats.current2024Fatalities}</strong> ljudi
              je izgubilo život u saobraćajnim nezgodama - to je <strong>{trafficStats.averageFatalitiesPerDay}</strong> smrti SVAKOG DANA.
              Preko <strong>{trafficStats.preventablePercentage.toFixed(0)}%</strong> nesreća je bilo <strong>preventabilno</strong>
              (prekoračenje brzine, alkohol, nepropisno ponašanje).
              Srbija je <strong>{(trafficStats.comparisonWithEUAvg / 4.2 * 100).toFixed(0)}% gora</strong> od EU proseka.
            </>
          ) : (
            <>
              <strong>⚠️ CRITICAL SAFETY SITUATION:</strong> In 2024, <strong>{trafficStats.current2024Fatalities}</strong> people
              lost their lives in traffic accidents - that&apos;s <strong>{trafficStats.averageFatalitiesPerDay}</strong> deaths EVERY DAY.
              Over <strong>{trafficStats.preventablePercentage.toFixed(0)}%</strong> of accidents were <strong>preventable</strong>
              (speeding, alcohol, improper behavior).
              Serbia is <strong>{(trafficStats.comparisonWithEUAvg / 4.2 * 100).toFixed(0)}% worse</strong> than EU average.
            </>
          )}
        </Alert>

        {/* Key Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Smrtnih slučajeva (2024)' : 'Fatalities (2024)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.main' }}>
                  {trafficStats.current2024Fatalities}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
                    ? `${trafficStats.averageFatalitiesPerDay} smrti/dan`
                    : `${trafficStats.averageFatalitiesPerDay} deaths/day`
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.dark' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Preventabilne smrti' : 'Preventable deaths'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.dark' }}>
                  {trafficStats.preventablePercentage.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
                    ? `${trafficStats.preventableFatalities} života moglo biti spašeno`
                    : `${trafficStats.preventableFatalities} lives could be saved`
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'warning.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Smrti na 100,000 st.' : 'Deaths per 100k pop.'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {trafficStats.fatalitiesPer100k2024}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
                    ? `EU prosek: 4.2`
                    : `EU average: 4.2`
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'info.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Loši putevi' : 'Poor roads'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {trafficStats.poorRoadPercentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'u lošem stanju' : 'in poor condition'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Fatalities Trend */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '📈 Trend smrtnih slučajeva - POGORŠANJE od 2020'
              : '📈 Fatalities Trend - WORSENING since 2020'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Nakon smanjenja 2020. godine (pandemija), broj smrtnih slučajeva konstantno raste.'
              : 'After a decrease in 2020 (pandemic), the number of fatalities is constantly rising.'
            }
          </Typography>

          <LineChart
            data={trafficFatalities.map(item => ({
              label: item.year.toString(),
              value: item.totalFatalities,
              category: locale === 'sr' ? 'Ukupno smrtnih' : 'Total fatalities'
            }))}
            title=""
            width={900}
            height={400}
          />

          <Alert severity="error" sx={{ mt: 3 }}>
            <strong>{locale === 'sr' ? 'ALARMANTNO POVEĆANJE:' : 'ALARMING INCREASE:'}</strong>{' '}
            {locale === 'sr'
              ? `Od 2020. godine, broj smrtnih slučajeva je porastao za ${trafficStats.fatalityIncreaseSince2020}
                 (sa ${trafficFatalities[5].totalFatalities} na ${trafficStats.current2024Fatalities}).
                 Ukupno od 2015-2024: ${trafficStats.totalFatalities2015to2024.toLocaleString()} izgubljenih života.`
              : `Since 2020, fatalities increased by ${trafficStats.fatalityIncreaseSince2020}
                 (from ${trafficFatalities[5].totalFatalities} to ${trafficStats.current2024Fatalities}).
                 Total 2015-2024: ${trafficStats.totalFatalities2015to2024.toLocaleString()} lives lost.`
            }
          </Alert>
        </Paper>

        {/* Accident Causes - PREVENTABLE */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '⚠️ Uzroci nesreća - SVE PREVENTABILNO!'
              : '⚠️ Accident Causes - ALL PREVENTABLE!'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Većina smrtnih ishoda je posledica kršenja propisa i neprilagođenog ponašanja vozača.'
              : 'Most fatalities are result of violations and inappropriate driver behavior.'
            }
          </Typography>

          <Grid container spacing={2}>
            {accidentCauses.map((cause, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: cause.preventable ? 'error.lighter' : 'grey.50'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {locale === 'sr' ? cause.cause : cause.causeEn}
                      </Typography>
                      {cause.preventable && (
                        <Chip label={locale === 'sr' ? 'PREVENTABILNO' : 'PREVENTABLE'} size="small" color="error" />
                      )}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {locale === 'sr' ? 'Učešće u nezgodama' : 'Share in accidents'}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {cause.percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={cause.percentage}
                        sx={{
                          height: 12,
                          borderRadius: 1,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: cause.preventable ? 'error.main' : 'grey.500',
                            borderRadius: 1
                          }
                        }}
                      />
                    </Box>

                    <Typography variant="body2" color="error.dark" fontWeight={600}>
                      {locale === 'sr' ? 'Smrtnih slučajeva:' : 'Fatalities:'} {cause.fatalities} ({((cause.fatalities / trafficStats.current2024Fatalities) * 100).toFixed(1)}%)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <strong>{locale === 'sr' ? 'ZAKLJUČAK:' : 'CONCLUSION:'}</strong>{' '}
            {locale === 'sr'
              ? `${trafficStats.preventablePercentage.toFixed(0)}% nesreća i ${trafficStats.preventableFatalities} smrti
                 moglo je biti sprečeno poštovanjem propisa, odgovornim ponašanjem i boljom kontrolom.`
              : `${trafficStats.preventablePercentage.toFixed(0)}% of accidents and ${trafficStats.preventableFatalities} deaths
                 could have been prevented by following rules, responsible behavior, and better enforcement.`
            }
          </Alert>
        </Paper>

        {/* Vulnerable Groups */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '👥 Najugroženije grupe učesnika u saobraćaju'
              : '👥 Most Vulnerable Traffic Participants'
            }
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderLeft: 4, borderColor: 'error.main', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    🚶 {locale === 'sr' ? 'Pešaci' : 'Pedestrians'}
                  </Typography>
                  <Typography variant="h3" color="error.main" sx={{ fontWeight: 700, mb: 1 }}>
                    {trafficStats.pedestrianFatalities2024}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {locale === 'sr'
                      ? `${((trafficStats.pedestrianFatalities2024 / trafficStats.current2024Fatalities) * 100).toFixed(1)}% ukupnih smrtnih slučajeva`
                      : `${((trafficStats.pedestrianFatalities2024 / trafficStats.current2024Fatalities) * 100).toFixed(1)}% of total fatalities`
                    }
                  </Typography>
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    {locale === 'sr'
                      ? 'Najčešće zbog neosvetljenih pešačkih prelaza i prekoračenja brzine'
                      : 'Mostly due to unlit crosswalks and speeding'
                    }
                  </Alert>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ borderLeft: 4, borderColor: 'warning.main', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    🏍️ {locale === 'sr' ? 'Motociklisti' : 'Motorcyclists'}
                  </Typography>
                  <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700, mb: 1 }}>
                    {trafficFatalities[trafficFatalities.length - 1].motorcyclistFatalities}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {locale === 'sr'
                      ? `${((trafficFatalities[trafficFatalities.length - 1].motorcyclistFatalities / trafficStats.current2024Fatalities) * 100).toFixed(1)}% ukupnih smrtnih slučajeva`
                      : `${((trafficFatalities[trafficFatalities.length - 1].motorcyclistFatalities / trafficStats.current2024Fatalities) * 100).toFixed(1)}% of total fatalities`
                    }
                  </Typography>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {locale === 'sr'
                      ? 'Trend rasta zbog sve više motocikala na putevima'
                      : 'Rising trend due to more motorcycles on roads'
                    }
                  </Alert>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ borderLeft: 4, borderColor: 'info.main', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    👨‍🦱 {locale === 'sr' ? 'Mladi vozači (18-24)' : 'Young drivers (18-24)'}
                  </Typography>
                  <Typography variant="h3" color="info.main" sx={{ fontWeight: 700, mb: 1 }}>
                    {trafficStats.youngDriverFatalities2024}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {locale === 'sr'
                      ? `${((trafficStats.youngDriverFatalities2024 / trafficStats.current2024Fatalities) * 100).toFixed(1)}% ukupnih smrtnih slučajeva`
                      : `${((trafficStats.youngDriverFatalities2024 / trafficStats.current2024Fatalities) * 100).toFixed(1)}% of total fatalities`
                    }
                  </Typography>
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {locale === 'sr'
                      ? 'Prekoračenje brzine i neprilagođena vožnja najčešći uzroci'
                      : 'Speeding and reckless driving most common causes'
                    }
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* International Comparison */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '🌍 Poređenje sa drugim zemljama - Među najgorim u Evropi'
              : '🌍 International Comparison - Among worst in Europe'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Broj smrtnih slučajeva na 100,000 stanovnika - Srbija je daleko iznad EU proseka.'
              : 'Fatalities per 100,000 population - Serbia far above EU average.'
            }
          </Typography>

          <BarChart
            data={comparativeData.map(item => ({
              label: item.country,
              value: item.fatalitiesPer100k,
              category: locale === 'sr' ? 'Smrti/100k' : 'Deaths/100k'
            }))}
            title=""
            width={900}
            height={450}
          />

          <Alert severity="error" sx={{ mt: 3 }}>
            <strong>{locale === 'sr' ? 'ZABRINJAVAJUĆA STATISTIKA:' : 'CONCERNING STATISTICS:'}</strong>{' '}
            {locale === 'sr'
              ? `Srbija ima ${trafficStats.fatalitiesPer100k2024} smrti na 100,000 st., što je
                 ${((trafficStats.comparisonWithEUAvg / 4.2) * 100).toFixed(0)}% gore od EU proseka (4.2).
                 To je ${(trafficStats.fatalitiesPer100k2024 / 2.0).toFixed(1)}x više nego u Norveškoj!`
              : `Serbia has ${trafficStats.fatalitiesPer100k2024} deaths per 100k, which is
                 ${((trafficStats.comparisonWithEUAvg / 4.2) * 100).toFixed(0)}% worse than EU average (4.2).
                 That's ${(trafficStats.fatalitiesPer100k2024 / 2.0).toFixed(1)}x more than Norway!`
            }
          </Alert>
        </Paper>

        {/* Road Infrastructure */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '🛣️ Stanje infrastrukture - Loš kvalitet doprinosi nezgodama'
              : '🛣️ Infrastructure State - Poor quality contributes to accidents'
            }
          </Typography>

          <Grid container spacing={2}>
            {roadInfrastructure.slice(-1).map((infra, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        {locale === 'sr' ? 'Kvalitet puteva' : 'Road quality'}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {locale === 'sr' ? 'U dobrom stanju' : 'Good condition'}
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          {infra.roadQualityGoodPercentage}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {locale === 'sr' ? 'U lošem stanju' : 'Poor condition'}
                        </Typography>
                        <Typography variant="h4" color="error.main">
                          {infra.roadQualityPoorPercentage}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        {locale === 'sr' ? 'Bezbednosna oprema' : 'Safety equipment'}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {locale === 'sr' ? 'Osvetljeni putevi' : 'Lit roads'}
                        </Typography>
                        <Typography variant="h4" color="warning.main">
                          {infra.lightedRoadsPercentage}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {locale === 'sr' ? 'Zaštitne ograde (km)' : 'Safety barriers (km)'}
                        </Typography>
                        <Typography variant="h4" color="info.main">
                          {infra.safetyBarriersKm.toLocaleString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            {locale === 'sr'
              ? `Trećina puteva je u lošem stanju, samo ${roadInfrastructure[roadInfrastructure.length - 1].lightedRoadsPercentage}%
                 puteva je osvetljeno, što doprinosi visokom broju nesreća, posebno noću.`
              : `Third of roads in poor condition, only ${roadInfrastructure[roadInfrastructure.length - 1].lightedRoadsPercentage}%
                 of roads are lit, contributing to high accident rate, especially at night.`
            }
          </Alert>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <DemoPageTemplate
      title={title}
      description={description}
      datasetId="transport-demo"
      chartComponent={dashboardContent}
      fallbackData={trafficFatalities}
      insightsConfig={{
        datasetId: 'transport-demo',
        sampleData: trafficFatalities,
        valueColumn: 'totalFatalities',
        timeColumn: 'year'
      }}
      columns={[
        { key: 'year', header: locale === 'sr' ? 'Godina' : 'Year', width: 100 },
        { key: 'totalFatalities', header: locale === 'sr' ? 'Poginuli' : 'Fatalities', width: 140 },
        { key: 'fatalitiesPer100kPopulation', header: locale === 'sr' ? 'Na 100k' : 'Per 100k', width: 140 },
        { key: 'seriousInjuries', header: locale === 'sr' ? 'Teške povrede' : 'Serious injuries', width: 160 },
        { key: 'totalAccidents', header: locale === 'sr' ? 'Nezgode' : 'Accidents', width: 140 },
        { key: 'pedestrianFatalities', header: locale === 'sr' ? 'Pešaci' : 'Pedestrians', width: 140 },
        { key: 'motorcyclistFatalities', header: locale === 'sr' ? 'Motociklisti' : 'Motorcyclists', width: 160 },
        { key: 'youngDriverFatalities', header: locale === 'sr' ? 'Mladi vozači' : 'Young drivers', width: 160 },
      ]}
    />
  );
}

/**
 * Static generation for GitHub Pages
 */
export async function getStaticProps() {
  return {
    props: {}
  };
}
// @ts-nocheck
