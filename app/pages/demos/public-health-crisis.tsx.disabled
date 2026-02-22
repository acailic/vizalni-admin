/**
 * Serbia Public Health Crisis - A Data Story
 * Narrative demo showing the healthcare system challenges
 * Source: Ministry of Health data via data.gov.rs
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import GroupsIcon from "@mui/icons-material/Groups";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
import { ColumnChart, LineChart } from "@/components/demos/charts";
import { LiveDatasetPanel } from "@/components/demos/LiveDatasetPanel";
import {
  waitingLists,
  hospitalCapacity,
  healthcareWorkerExodus,
  healthIndicators,
  healthcareStats,
} from "@/data/serbia-healthcare";

export default function PublicHealthCrisisDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const title = i18n._(
    defineMessage({
      id: "demos.public-health-crisis.title",
      message: "🏥 Serbia Public Health Crisis - A Data Story",
    })
  );

  const description = i18n._(
    defineMessage({
      id: "demos.public-health-crisis.description",
      message:
        "Exploring the healthcare system challenges: waiting lists, staff shortages, and capacity constraints",
    })
  );

  const dashboardContent = (
    <Box>
      <LiveDatasetPanel
        demoId="public-health-crisis"
        title={
          locale === "sr" ? "Živi podaci (zdravstvo)" : "Live data (healthcare)"
        }
      />

      {/* Critical Warning Banner */}
      <Alert
        severity="error"
        sx={{
          mb: 4,
          fontSize: "1.1rem",
          fontWeight: 500,
          borderLeft: 6,
          borderColor: "error.main",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          {locale === "sr"
            ? "⚠️ ZDRAVSTVENA KRIZA: Sistem pod pritiskom"
            : "⚠️ HEALTHCARE CRISIS: System Under Pressure"}
        </Typography>
        <Typography variant="body2">
          {locale === "sr"
            ? `Više od ${healthcareStats.totalPatientsWaiting.toLocaleString()} pacijenata čeka na preglede ili operacije. Procenat prosečnog vremena čekanja je ${healthcareStats.averageWaitTimeAllProcedures} dana, sa ${healthcareStats.criticalWaitingLists} kategorija koje čekaju 2x duže od preporučenog vremena.`
            : `Over ${healthcareStats.totalPatientsWaiting.toLocaleString()} patients are waiting for examinations or surgeries. Average wait time is ${healthcareStats.averageWaitTimeAllProcedures} days, with ${healthcareStats.criticalWaitingLists} categories waiting 2x longer than recommended.`}
        </Typography>
      </Alert>

      {/* Key Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "error.main" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <GroupsIcon sx={{ mr: 1, color: "error.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr" ? "Na listama čekanja" : "On Waiting Lists"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "error.main" }}
              >
                {healthcareStats.totalPatientsWaiting.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr" ? "pacijenata čeka" : "patients waiting"}
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
                <LocalHospitalIcon sx={{ mr: 1, color: "warning.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Otpad bolničkih kreveta"
                    : "Bed Capacity Loss"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "warning.main" }}
              >
                -{healthcareStats.bedReduction2015to2024}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr" ? "od 2015. do 2024." : "2015-2024"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "error.dark" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: "error.dark" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Odlazak zdravstvenih radnika"
                    : "Health Worker Exodus"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "error.dark" }}
              >
                {healthcareStats.totalWorkersLeft2015to2024.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr" ? "odlazi 2015-2024" : "left 2015-2024"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "info.main" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <HealthAndSafetyIcon sx={{ mr: 1, color: "info.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr" ? "Zauzetost bolnica" : "Hospital Occupancy"}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {healthcareStats.currentOccupancyRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr" ? " prosečna zauzetost" : " average occupancy"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Waiting Lists Crisis */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "⏳ Liste čekanja - Krivično dugačke"
            : "⏳ Waiting Lists - Critically Long"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Neki pacijenti čekaju i do 420 dana za elektivne operacije, što je daleko preko WHO preporuka od maksimalno 180 dana."
            : "Some patients wait up to 420 days for elective surgeries, far exceeding WHO recommendations of maximum 180 days."}
        </Typography>
        <Box sx={{ height: 500 }}>
          <ColumnChart
            data={waitingLists.slice(0, 6).map((item) => ({
              procedure: locale === "sr" ? item.procedure : item.procedureEn,
              Wait: item.averageWaitDays,
              Recommended: item.recommendedMaxDays,
            }))}
            xKey="procedure"
            yKey={["Wait", "Recommended"]}
            multiSeries={true}
            width={950}
            height={500}
          />
        </Box>
      </Paper>

      {/* Detailed Waiting Lists by Category */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "📋 Liste čekanja po kategorijama"
            : "📋 Waiting Lists by Category"}
        </Typography>
        <Grid container spacing={2}>
          {waitingLists.map((item) => {
            const exceedance = item.averageWaitDays / item.recommendedMaxDays;
            const isCritical = exceedance >= 2;
            const isWarning = exceedance >= 1.5;

            return (
              <Grid item xs={12} sm={6} md={4} key={item.procedure}>
                <Card
                  variant="outlined"
                  sx={{
                    borderLeft: 4,
                    borderColor: isCritical
                      ? "error.main"
                      : isWarning
                        ? "warning.main"
                        : "success.main",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {locale === "sr" ? item.procedure : item.procedureEn}
                    </Typography>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {locale === "sr" ? "Čekanje:" : "Wait:"}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {item.averageWaitDays}{" "}
                          {locale === "sr" ? "dana" : "days"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {locale === "sr" ? "Preporučeno:" : "Recommended:"}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {item.recommendedMaxDays}{" "}
                          {locale === "sr" ? "dana" : "days"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {locale === "sr" ? "Čeka:" : "Waiting:"}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {item.patientsWaiting.toLocaleString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${exceedance.toFixed(1)}x ${locale === "sr" ? "preporučeno" : "recommended"}`}
                        size="small"
                        color={
                          isCritical
                            ? "error"
                            : isWarning
                              ? "warning"
                              : "success"
                        }
                        sx={{ mt: 1 }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Hospital Capacity Decline */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "🏥 Kapacitet bolnica - Smanjenje i povećana zauzetost"
            : "🏥 Hospital Capacity - Declining and Increasing Occupancy"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Broj bolničkih kreveta se smanjuje, a zauzetost raste. Odnos pacijenata-po-lekaru se pogoršava za " +
              healthcareStats.patientsPerDoctorIncrease +
              " pacijenata od 2015."
            : "Hospital bed capacity is declining while occupancy rises. Patient-per-doctor ratio has worsened by " +
              healthcareStats.patientsPerDoctorIncrease +
              " patients since 2015."}
        </Typography>
        <Box sx={{ height: 500 }}>
          <LineChart
            data={hospitalCapacity.map((d) => ({
              year: d.year.toString(),
              Beds: d.totalBeds / 1000,
              Occupancy: d.occupancyRate,
              PatientsPerDoctor: d.patientsPerDoctor / 10,
            }))}
            xKey="year"
            yKey="value"
            multiSeries={true}
            width={950}
            height={500}
          />
        </Box>
      </Paper>

      {/* Healthcare Worker Exodus */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? '👨‍⚕️ Odlazak zdravstvenih kadrova - "Brain Drain"'
            : "👨‍⚕️ Healthcare Worker Exodus - 'Brain Drain'"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Svake godine stotine lekara i medicinskih sestara napušta sistem. Samo u 2023. otišlo je " +
              healthcareStats.workersLeftLastYear +
              " zdravstvenih radnika."
            : "Every year, hundreds of doctors and nurses leave the system. In 2023 alone, " +
              healthcareStats.workersLeftLastYear +
              " healthcare workers left."}
        </Typography>
        <Box sx={{ height: 450 }}>
          <ColumnChart
            data={healthcareWorkerExodus.map((d) => ({
              year: d.year.toString(),
              Doctors: d.doctorsLeft,
              Nurses: d.nursesLeft,
              Total: d.totalLeft,
            }))}
            xKey="year"
            yKey={["Doctors", "Nurses", "Total"]}
            multiSeries={true}
            stacked={false}
            width={950}
            height={450}
          />
        </Box>
      </Paper>

      {/* Health Indicators vs EU */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "📊 Zdravstveni pokazatelji vs EU"
            : "📊 Health Indicators vs EU"}
        </Typography>
        <Grid container spacing={2}>
          {healthIndicators.map((indicator) => (
            <Grid item xs={12} sm={6} md={4} key={indicator.indicator}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {locale === "sr"
                      ? indicator.indicator
                      : indicator.indicatorEn}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", mb: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "primary.main", mr: 1 }}
                    >
                      {indicator.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {indicator.unit}
                    </Typography>
                  </Box>
                  <Chip
                    {...(indicator.trend === "improving" ||
                    indicator.trend === "worsening"
                      ? {
                          icon:
                            indicator.trend === "improving" ? (
                              <TrendingUpIcon />
                            ) : (
                              <TrendingUpIcon
                                sx={{ transform: "rotate(180deg)" }}
                              />
                            ),
                        }
                      : {})}
                    label={locale === "sr" ? indicator.trend : indicator.trend}
                    size="small"
                    color={
                      indicator.trend === "improving"
                        ? "success"
                        : indicator.trend === "worsening"
                          ? "error"
                          : "default"
                    }
                    sx={{ mb: 1 }}
                  />
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {locale === "sr"
                      ? indicator.comparison
                      : indicator.comparisonEn}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Key Insights */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          background:
            "linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, rgba(244, 67, 54, 0.05) 100%)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr" ? "🔑 Ključni problemi" : "🔑 Key Issues"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip label="❌ CRISIS" color="error" sx={{ mr: 1, mb: 1 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `${healthcareStats.criticalWaitingLists} od ${waitingLists.length} kategorija liste čekanja su 2x duže od preporučenog vremena.`
                  : `${healthcareStats.criticalWaitingLists} of ${waitingLists.length} waiting list categories are 2x longer than recommended.`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "📉 Smanjenje kapaciteta"
                    : "📉 Capacity Decline"
                }
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `Gubitak od ${healthcareStats.bedReduction2015to2024} bolničkih kreveta (2015-2024).`
                  : `Loss of ${healthcareStats.bedReduction2015to2024} hospital beds (2015-2024).`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr" ? "👨‍⚕️ Odlazak kadrova" : "👨‍⚕️ Staff Exodus"
                }
                color="error"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? `Preko ${healthcareStats.totalWorkersLeft2015to2024.toLocaleString()} zdravstvenih radnika otišlo 2015-2024.`
                  : `Over ${healthcareStats.totalWorkersLeft2015to2024.toLocaleString()} healthcare workers left 2015-2024.`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "💰 Ispod EU proseka"
                    : "💰 Below EU Average"
                }
                color="info"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "Srbija troši 8.6% BDP-a na zdravstvo vs EU proseka 10.9%."
                  : "Serbia spends 8.6% of GDP on healthcare vs EU average 10.9%."}
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
            ? "Podaci su prikupljeni iz izveštaja Ministarstva zdravlja Republike Srbije i Republičkog zavoda za zdravstveno osiguranje. Podaci su dostupni preko portala otvorenih podataka data.gov.rs."
            : "Data sourced from Ministry of Health of the Republic of Serbia and National Health Insurance Office reports. Data available through the open data portal data.gov.rs."}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          endIcon={<OpenInNewIcon />}
          href="https://data.gov.rs/datasets?tags=zdravstvo"
          target="_blank"
          rel="noopener noreferrer"
        >
          {locale === "sr"
            ? "Poseti data.gov.rs - Zdravstvo"
            : "Visit data.gov.rs - Health"}
        </Button>
      </Paper>
    </Box>
  );

  return (
    <DemoPageTemplate
      title={title}
      description={description}
      datasetId="public-health-crisis-demo"
      chartComponent={dashboardContent}
      fallbackData={waitingLists}
      insightsConfig={{
        datasetId: "public-health-crisis-demo",
        sampleData: waitingLists,
        valueColumn: "averageWaitDays",
        timeColumn: "procedure",
      }}
      columns={[
        {
          key: "procedure",
          header: locale === "sr" ? "Procedura" : "Procedure",
          width: 200,
        },
        {
          key: "averageWaitDays",
          header:
            locale === "sr" ? "Prosečno čekanje (dani)" : "Avg Wait (days)",
          width: 150,
        },
        {
          key: "patientsWaiting",
          header: locale === "sr" ? "Čeka (broj)" : "Waiting (count)",
          width: 150,
        },
        {
          key: "recommendedMaxDays",
          header: locale === "sr" ? "Preporučeno (dani)" : "Recommended (days)",
          width: 150,
        },
        {
          key: "category",
          header: locale === "sr" ? "Kategorija" : "Category",
          width: 120,
        },
      ]}
    />
  );
}
