// @ts-nocheck
/**
 * Energy Crisis Visualization
 * Alarming data about coal dependency, renewable energy lag, and aging infrastructure
 */

import { useLingui } from '@lingui/react';
import { Alert, Box, Card, CardContent, Chip, Grid, LinearProgress, Paper, Typography } from '@mui/material';

import { BarChart } from '@/components/demos/charts/BarChart';
import { LineChart } from '@/components/demos/charts/LineChart';
import { PieChart } from '@/components/demos/charts/PieChart';
import { LiveDatasetPanel } from '@/components/demos/LiveDatasetPanel';
import { DemoPageTemplate } from '@/components/demo/DemoPageTemplate';
import {
  energyImports,
  energyInfrastructure,
  energyProduction,
  energyStats,
  renewableComparison
} from '@/data/serbia-energy';

export default function EnergyDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith('sr') ? 'sr' : 'en';

  const title = locale === 'sr'
    ? '🚨 Energetska kriza - Zavisnost od uglja i fosilnih goriva'
    : '🚨 Energy Crisis - Coal and Fossil Fuel Dependency';

  const description = locale === 'sr'
    ? 'Alarmantni podaci o zavisnosti od uglja, zaostajanju u obnovljivim izvorima i zagađenju'
    : 'Alarming data on coal dependency, renewable energy lag, and pollution';

  // Prepare pie chart data for energy mix
  const currentEnergyMix = energyProduction[energyProduction.length - 1];
  const energyMixData = [
    { label: locale === 'sr' ? 'Ugalj' : 'Coal', value: currentEnergyMix.coal, category: locale === 'sr' ? 'Ugalj' : 'Coal' },
    { label: locale === 'sr' ? 'Hidroenergija' : 'Hydropower', value: currentEnergyMix.hydropower, category: locale === 'sr' ? 'Hidroenergija' : 'Hydropower' },
    { label: locale === 'sr' ? 'Prirodni gas' : 'Natural gas', value: currentEnergyMix.naturalGas, category: locale === 'sr' ? 'Prirodni gas' : 'Natural gas' },
    { label: locale === 'sr' ? 'Sunce/Vetar' : 'Solar/Wind', value: currentEnergyMix.solarWind, category: locale === 'sr' ? 'Sunce/Vetar' : 'Solar/Wind' },
    { label: locale === 'sr' ? 'Ostalo' : 'Other', value: currentEnergyMix.other, category: locale === 'sr' ? 'Ostalo' : 'Other' }
  ];

  const dashboardContent = (
    <Box>
      <LiveDatasetPanel demoId="energy" title={locale === 'sr' ? 'Živi podaci (energija)' : 'Live data (energy)'} />
      {/* Critical Warning Banner */}
      <Alert
        severity="error"
        sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}
      >
        {locale === 'sr' ? (
          <>
            <strong>⚠️ ENERGETSKA NESIGURNOST:</strong> Srbija zavisi <strong>{energyStats.coalDependency2024.toFixed(1)}%</strong> od UGLJA
            za proizvodnju električne energije. Obnovljivi izvori (samo sunce/vetar) čine
            svega <strong>{energyStats.solarWindOnly2024}%</strong>. Prosečna starost termoelektrana je <strong>{energyStats.averagePlantAge} godina</strong>,
            efikasnost samo <strong>{energyStats.averagePlantEfficiency}%</strong>. Troškovi uvoza energije su porasli za
            <strong> €{energyStats.importCostIncrease2015to2024}M</strong> od 2015. godine.
          </>
        ) : (
          <>
            <strong>⚠️ ENERGY INSECURITY:</strong> Serbia depends <strong>{energyStats.coalDependency2024.toFixed(1)}%</strong> on COAL
            for electricity production. Renewable sources (solar/wind only) are just <strong>{energyStats.solarWindOnly2024}%</strong>.
            Average coal plant age is <strong>{energyStats.averagePlantAge} years</strong>, efficiency only <strong>{energyStats.averagePlantEfficiency}%</strong>.
            Energy import costs increased by <strong>€{energyStats.importCostIncrease2015to2024}M</strong> since 2015.
          </>
        )}
      </Alert>

      {/* Key Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.main' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {locale === 'sr' ? 'Zavisnost od uglja' : 'Coal dependency'}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.main' }}>
                {energyStats.coalDependency2024.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === 'sr' ? 'proizvodnje el. energije' : 'of electricity production'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {locale === 'sr' ? 'Obnovljivi izvori (S/V)' : 'Renewables (S/W)'}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {energyStats.solarWindOnly2024}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === 'sr'
                  ? `EU prosek: ${energyStats.euRenewableAverage}%`
                  : `EU average: ${energyStats.euRenewableAverage}%`
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.dark' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Troškovi uvoza (2024)' : 'Import costs (2024)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.dark' }}>
                  €{energyStats.importCost2024}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
                    ? `+€${energyStats.importCostIncrease2015to2024}M od 2015`
                    : `+€${energyStats.importCostIncrease2015to2024}M since 2015`
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'info.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'CO₂ emisije po glavi' : 'CO₂ per capita'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {energyStats.co2PerCapita2024}t
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'godišnje' : 'annually'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Energy Mix - Pie Chart */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '⚡ Energetski miks 2024 - Dominacija uglja'
              : '⚡ Energy Mix 2024 - Coal Domination'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Struktura proizvodnje električne energije pokazuje kritičnu zavisnost od uglja.'
              : 'Electricity production structure shows critical dependency on coal.'
            }
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <PieChart
              data={energyMixData}
              title=""
              width={600}
              height={450}
            />
          </Box>

          <Alert severity="error">
            <strong>{locale === 'sr' ? 'KRITIČNA ZAVISNOST:' : 'CRITICAL DEPENDENCY:'}</strong>{' '}
            {locale === 'sr'
              ? `Ugalj čini ${energyStats.coalDependency2024.toFixed(1)}% proizvodnje, dok modern obnovljivi izvori
                 (sunce i vetar) čine samo ${energyStats.solarWindOnly2024}%. To je ${(energyStats.euRenewableAverage / energyStats.solarWindOnly2024).toFixed(0)}x
                 manje od EU proseka.`
              : `Coal makes up ${energyStats.coalDependency2024.toFixed(1)}% of production, while modern renewables
                 (solar and wind) are only ${energyStats.solarWindOnly2024}%. That's ${(energyStats.euRenewableAverage / energyStats.solarWindOnly2024).toFixed(0)}x
                 less than EU average.`
            }
          </Alert>
        </Paper>

        {/* Coal Dependency Trend */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '📈 Trend zavisnosti od uglja - BEZ POBOLJŠANJA'
              : '📈 Coal Dependency Trend - NO IMPROVEMENT'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Zavisnost od uglja nije se smanjila, već je čak i porasla u poslednjih 10 godina.'
              : 'Coal dependency has not decreased, it even increased in the last 10 years.'
            }
          </Typography>

          <LineChart
            data={energyProduction.map(item => ({
              label: item.year.toString(),
              value: item.coal,
              category: locale === 'sr' ? 'Ugalj %' : 'Coal %'
            }))}
            title=""
            width={900}
            height={400}
          />

          <Alert severity="warning" sx={{ mt: 3 }}>
            {locale === 'sr'
              ? `Zavisnost od uglja je porasla sa ${energyProduction[0].coal}% (2015) na ${energyStats.coalDependency2024.toFixed(1)}% (2024).
                 Umesto tranzicije ka čistijim izvorima, Srbija postaje još zavisnija od fosilnih goriva.`
              : `Coal dependency increased from ${energyProduction[0].coal}% (2015) to ${energyStats.coalDependency2024.toFixed(1)}% (2024).
                 Instead of transitioning to cleaner sources, Serbia is becoming even more dependent on fossil fuels.`
            }
          </Alert>
        </Paper>

        {/* Renewable Energy Comparison */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '🌍 Poređenje obnovljivih izvora - Srbija daleko iza'
              : '🌍 Renewable Energy Comparison - Serbia far behind'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Učešće obnovljivih izvora energije u ukupnoj proizvodnji (uključujući hidroenergiju).'
              : 'Share of renewable energy sources in total production (including hydropower).'
            }
          </Typography>

          <BarChart
            data={renewableComparison.map(item => ({
              label: item.country,
              value: item.renewablePercentage,
              category: locale === 'sr' ? 'Obnovljivi %' : 'Renewable %'
            }))}
            title=""
            width={900}
            height={450}
          />

          <Alert severity="error" sx={{ mt: 3 }}>
            <strong>{locale === 'sr' ? 'ZABRINJAVAJUĆE ZAOSTAJANJE:' : 'CONCERNING LAG:'}</strong>{' '}
            {locale === 'sr'
              ? `Srbija ima ${energyStats.renewableShare2024.toFixed(1)}% obnovljivih izvora (uglavnom hidroenergija),
                 što je ${energyStats.renewableGapWithEU.toFixed(1)} p.p. ispod EU proseka. Zemlje kao Norveška, Danska i Austrija
                 imaju preko 75% obnovljivih izvora.`
              : `Serbia has ${energyStats.renewableShare2024.toFixed(1)}% renewable sources (mostly hydropower),
                 which is ${energyStats.renewableGapWithEU.toFixed(1)} p.p. below EU average. Countries like Norway, Denmark, and Austria
                 have over 75% renewable sources.`
            }
          </Alert>
        </Paper>

        {/* Energy Imports and Costs */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '💰 Rastući uvoz i troškovi energije'
              : '💰 Growing Energy Imports and Costs'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Troškovi uvoza električne energije i gasa konstantno rastu.'
              : 'Costs of electricity and gas imports are constantly rising.'
            }
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                {locale === 'sr' ? 'Uvezena energija (GWh)' : 'Imported energy (GWh)'}
              </Typography>
              <LineChart
                data={energyImports.map(item => ({
                  label: item.year.toString(),
                  value: item.importedGWh,
                  category: locale === 'sr' ? 'GWh' : 'GWh'
                }))}
                title=""
                width={450}
                height={350}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                {locale === 'sr' ? 'Troškovi uvoza (milioni EUR)' : 'Import costs (million EUR)'}
              </Typography>
              <LineChart
                data={energyImports.map(item => ({
                  label: item.year.toString(),
                  value: item.importCostMillionEUR,
                  category: locale === 'sr' ? 'EUR (M)' : 'EUR (M)'
                }))}
                title=""
                width={450}
                height={350}
              />
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            {locale === 'sr'
              ? `Uvoz električne energije je porastao sa ${energyImports[0].importedGWh.toLocaleString()} GWh na
                 ${energyImports[energyImports.length - 1].importedGWh.toLocaleString()} GWh.
                 Troškovi su porasli sa €${energyImports[0].importCostMillionEUR}M na €${energyStats.importCost2024}M -
                 povećanje od ${((energyStats.importCost2024 / energyImports[0].importCostMillionEUR - 1) * 100).toFixed(0)}%.`
              : `Electricity imports increased from ${energyImports[0].importedGWh.toLocaleString()} GWh to
                 ${energyImports[energyImports.length - 1].importedGWh.toLocaleString()} GWh.
                 Costs rose from €${energyImports[0].importCostMillionEUR}M to €${energyStats.importCost2024}M -
                 an increase of ${((energyStats.importCost2024 / energyImports[0].importCostMillionEUR - 1) * 100).toFixed(0)}%.`
            }
          </Alert>
        </Paper>

        {/* Coal Plants - Old and Inefficient */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '🏭 Termoelektrane na ugalj - Stare i neefikasne'
              : '🏭 Coal Power Plants - Old and Inefficient'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Prosečna starost termoelektrana je preko 45 godina, efikasnost ispod 30%.'
              : 'Average age of coal plants is over 45 years, efficiency below 30%.'
            }
          </Typography>

          <Grid container spacing={2}>
            {energyInfrastructure.coalPlants.map((plant, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: plant.pollutionLevel === 'very high' ? 'error.lighter' : 'warning.lighter'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {locale === 'sr' ? plant.name : plant.nameEn}
                      </Typography>
                      <Chip
                        label={plant.pollutionLevel === 'very high'
                          ? (locale === 'sr' ? 'JAKO ZAGAĐUJE' : 'VERY HIGH POLLUTION')
                          : (locale === 'sr' ? 'ZAGAĐUJE' : 'HIGH POLLUTION')
                        }
                        size="small"
                        color="error"
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          {locale === 'sr' ? 'Starost' : 'Age'}
                        </Typography>
                        <Typography variant="h6" color="error.dark" sx={{ fontWeight: 700 }}>
                          {plant.ageYears} {locale === 'sr' ? 'god.' : 'yrs'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          {locale === 'sr' ? 'Efikasnost' : 'Efficiency'}
                        </Typography>
                        <Typography variant="h6" color="warning.dark" sx={{ fontWeight: 700 }}>
                          {plant.efficiencyPercentage}%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          {locale === 'sr' ? 'Kapacitet' : 'Capacity'}
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {plant.capacityMW} MW
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="error" sx={{ mt: 3 }}>
            <strong>{locale === 'sr' ? 'ZASTARELA INFRASTRUKTURA:' : 'OUTDATED INFRASTRUCTURE:'}</strong>{' '}
            {locale === 'sr'
              ? `Prosečna starost termoelektrana je ${energyStats.averagePlantAge} godina, a efikasnost
                 samo ${energyStats.averagePlantEfficiency}%. Moderne termoelektrane imaju efikasnost preko 45%.
                 To znači da više od polovine energije iz uglja se GUBI kao otpad.`
              : `Average age of coal plants is ${energyStats.averagePlantAge} years, efficiency only ${energyStats.averagePlantEfficiency}%.
                 Modern coal plants have 45%+ efficiency. This means over half the energy from coal is WASTED.`
            }
          </Alert>
        </Paper>

        {/* Renewable Projects - Delayed */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '🌱 Projekti obnovljivih izvora - Kašnjenja i spor napredak'
              : '🌱 Renewable Energy Projects - Delays and Slow Progress'
            }
          </Typography>

          <Grid container spacing={2}>
            {energyInfrastructure.renewableProjects.map((project, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {locale === 'sr' ? project.type : project.typeEn}
                      </Typography>
                      <Chip
                        label={project.status === 'delayed'
                          ? (locale === 'sr' ? 'KAŠNJENJE' : 'DELAYED')
                          : project.status === 'in progress'
                          ? (locale === 'sr' ? 'U toku' : 'In progress')
                          : (locale === 'sr' ? 'Završeno' : 'Completed')
                        }
                        size="small"
                        color={project.status === 'delayed' ? 'error' : project.status === 'in progress' ? 'warning' : 'success'}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {locale === 'sr' ? 'Napredak' : 'Progress'}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {project.completedPercentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.completedPercentage}
                        sx={{
                          height: 12,
                          borderRadius: 1,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: project.status === 'delayed' ? 'error.main' : 'success.main',
                            borderRadius: 1
                          }
                        }}
                      />
                    </Box>

                    <Typography variant="body2">
                      <strong>{locale === 'sr' ? 'Planirano:' : 'Planned:'}</strong> {project.plannedCapacityMW} MW
                    </Typography>
                    <Typography variant="body2">
                      <strong>{locale === 'sr' ? 'Završeno:' : 'Completed:'}</strong>{' '}
                      {Math.round(project.plannedCapacityMW * project.completedPercentage / 100)} MW
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            {locale === 'sr'
              ? `Od ukupno ${energyStats.totalPlannedRenewableCapacity} MW planiranih kapaciteta obnovljivih izvora,
                 završeno je samo ${energyStats.completedRenewableCapacity} MW (${((energyStats.completedRenewableCapacity / energyStats.totalPlannedRenewableCapacity) * 100).toFixed(0)}%).
                 ${energyStats.renewableProjectsDelayed} projekta kasne u realizaciji.`
              : `Of ${energyStats.totalPlannedRenewableCapacity} MW planned renewable capacity,
                 only ${energyStats.completedRenewableCapacity} MW completed (${((energyStats.completedRenewableCapacity / energyStats.totalPlannedRenewableCapacity) * 100).toFixed(0)}%).
                 ${energyStats.renewableProjectsDelayed} projects are delayed.`
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
      datasetId="energy-demo"
      chartComponent={dashboardContent}
      fallbackData={energyProduction}
      insightsConfig={{
        datasetId: 'energy-demo',
        sampleData: energyProduction,
        valueColumn: 'totalProductionGWh',
        timeColumn: 'year'
      }}
      columns={[
        { key: 'year', header: locale === 'sr' ? 'Godina' : 'Year', width: 100 },
        { key: 'totalProductionGWh', header: locale === 'sr' ? 'Proizvodnja (GWh)' : 'Production (GWh)', width: 180 },
        { key: 'coal', header: locale === 'sr' ? 'Ugalj (%)' : 'Coal (%)', width: 120 },
        { key: 'hydropower', header: locale === 'sr' ? 'Hidro (%)' : 'Hydro (%)', width: 120 },
        { key: 'naturalGas', header: locale === 'sr' ? 'Gas (%)' : 'Gas (%)', width: 120 },
        { key: 'solarWind', header: locale === 'sr' ? 'Sunce/Vetar (%)' : 'Solar/Wind (%)', width: 150 },
        { key: 'other', header: locale === 'sr' ? 'Ostalo (%)' : 'Other (%)', width: 120 },
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
