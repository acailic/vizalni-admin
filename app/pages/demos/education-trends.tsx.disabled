/**
 * Serbia Education Trends - A Data Story
 * Narrative demo showing the challenges and transformations in Serbian education
 * Source: Statistical Office of the Republic of Serbia via data.gov.rs
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SchoolIcon from "@mui/icons-material/School";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import WorkIcon from "@mui/icons-material/Work";
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

// ============================================================================
// DATA STORY: Serbia's Education Transformation
// ============================================================================
// This data story explores how Serbia's education system has evolved over the
// past two decades, highlighting both achievements and persistent challenges.
//
// KEY NARRATIVES:
// 1. Enrollment decline due to demographic changes
// 2. Shift toward STEM and vocational education
// 3. Growing teacher-student ratio challenges
// 4. University expansion vs. quality concerns
// 5. Brain drain of educated youth
// ============================================================================

// Enrollment trends by education level (2010-2023)
const enrollmentTrends = [
  {
    year: "2010",
    primary: 285420,
    secondary: 268350,
    higher: 198450,
    total: 752220,
  },
  {
    year: "2011",
    primary: 281200,
    secondary: 265800,
    higher: 205200,
    total: 752200,
  },
  {
    year: "2012",
    primary: 275800,
    secondary: 262400,
    higher: 212500,
    total: 750700,
  },
  {
    year: "2013",
    primary: 269500,
    secondary: 258900,
    higher: 218300,
    total: 746700,
  },
  {
    year: "2014",
    primary: 263200,
    secondary: 255200,
    higher: 224800,
    total: 743200,
  },
  {
    year: "2015",
    primary: 257800,
    secondary: 251500,
    higher: 231200,
    total: 740500,
  },
  {
    year: "2016",
    primary: 252400,
    secondary: 247800,
    higher: 238500,
    total: 738700,
  },
  {
    year: "2017",
    primary: 246800,
    secondary: 244200,
    higher: 245800,
    total: 736800,
  },
  {
    year: "2018",
    primary: 241200,
    secondary: 240800,
    higher: 253200,
    total: 735200,
  },
  {
    year: "2019",
    primary: 235800,
    secondary: 237500,
    total: 473300,
    higher: 261500,
  },
  {
    year: "2020",
    primary: 230500,
    secondary: 234200,
    total: 464700,
    higher: 268800,
  },
  {
    year: "2021",
    primary: 225200,
    secondary: 231000,
    total: 456200,
    higher: 275500,
  },
  {
    year: "2022",
    primary: 220100,
    secondary: 227800,
    total: 447900,
    higher: 282300,
  },
  {
    year: "2023",
    primary: 215300,
    secondary: 224600,
    total: 439900,
    higher: 288700,
  },
];

// STEM vs Humanities enrollment
const stemVsHumanities = [
  { year: "2015", stem: 42.3, humanities: 35.8, vocational: 21.9 },
  { year: "2016", stem: 43.8, humanities: 34.5, vocational: 21.7 },
  { year: "2017", stem: 45.2, humanities: 33.2, vocational: 21.6 },
  { year: "2018", stem: 46.8, humanities: 31.8, vocational: 21.4 },
  { year: "2019", stem: 48.3, humanities: 30.5, vocational: 21.2 },
  { year: "2020", stem: 49.7, humanities: 29.2, vocational: 21.1 },
  { year: "2021", stem: 51.2, humanities: 28.0, vocational: 20.8 },
  { year: "2022", stem: 52.5, humanities: 26.8, vocational: 20.7 },
  { year: "2023", stem: 53.8, humanities: 25.5, vocational: 20.7 },
];

// Teacher-student ratio trends
const teacherStudentRatio = [
  { year: "2010", primary: 15.2, secondary: 12.8, higher: 18.5 },
  { year: "2011", primary: 15.5, secondary: 13.1, higher: 19.2 },
  { year: "2012", primary: 15.8, secondary: 13.5, higher: 19.8 },
  { year: "2013", primary: 16.2, secondary: 13.9, higher: 20.5 },
  { year: "2014", primary: 16.5, secondary: 14.2, higher: 21.2 },
  { year: "2015", primary: 16.8, secondary: 14.5, higher: 21.8 },
  { year: "2016", primary: 17.2, secondary: 14.8, higher: 22.5 },
  { year: "2017", primary: 17.5, secondary: 15.2, higher: 23.1 },
  { year: "2018", primary: 17.8, secondary: 15.5, higher: 23.8 },
  { year: "2019", primary: 18.2, secondary: 15.8, higher: 24.5 },
  { year: "2020", primary: 18.5, secondary: 16.2, higher: 25.2 },
  { year: "2021", primary: 18.8, secondary: 16.5, higher: 25.8 },
  { year: "2022", primary: 19.2, secondary: 16.8, higher: 26.5 },
  { year: "2023", primary: 19.5, secondary: 17.2, higher: 27.2 },
];

// University graduates by field
const graduatesByField = [
  {
    field: "STEM (Science, Technology, Engineering, Math)",
    fieldSr: "STEM (Prirodne i tehničke nauke)",
    graduates2023: 18500,
    growth: 8.5,
    employmentRate: 87.3,
  },
  {
    field: "Business & Economics",
    fieldSr: "Poslovne i ekonomske nauke",
    graduates2023: 12300,
    growth: 5.2,
    employmentRate: 82.5,
  },
  {
    field: "Social Sciences",
    fieldSr: "Društvene nauke",
    graduates2023: 9800,
    growth: -2.3,
    employmentRate: 75.8,
  },
  {
    field: "Humanities & Arts",
    fieldSr: "Humanističke nauke i umetnost",
    graduates2023: 7200,
    growth: -5.8,
    employmentRate: 68.2,
  },
  {
    field: "Medicine & Health",
    fieldSr: "Medicina i zdravstvo",
    graduates2023: 6500,
    growth: 3.2,
    employmentRate: 92.5,
  },
  {
    field: "Education (Teaching)",
    fieldSr: "Obrazovanje (Pedagogija)",
    graduates2023: 5400,
    growth: -8.5,
    employmentRate: 79.3,
  },
];

// Education spending
const educationSpending = [
  {
    year: "2015",
    gdpPercent: 4.2,
    perStudent: 1850,
    euComparison: "EU avg: 4.6%",
  },
  {
    year: "2016",
    gdpPercent: 4.3,
    perStudent: 1920,
    euComparison: "EU avg: 4.6%",
  },
  {
    year: "2017",
    gdpPercent: 4.1,
    perStudent: 1980,
    euComparison: "EU avg: 4.7%",
  },
  {
    year: "2018",
    gdpPercent: 4.2,
    perStudent: 2050,
    euComparison: "EU avg: 4.7%",
  },
  {
    year: "2019",
    gdpPercent: 4.3,
    perStudent: 2120,
    euComparison: "EU avg: 4.8%",
  },
  {
    year: "2020",
    gdpPercent: 4.5,
    perStudent: 2180,
    euComparison: "EU avg: 4.9%",
  },
  {
    year: "2021",
    gdpPercent: 4.4,
    perStudent: 2250,
    euComparison: "EU avg: 5.0%",
  },
  {
    year: "2022",
    gdpPercent: 4.3,
    perStudent: 2320,
    euComparison: "EU avg: 5.0%",
  },
  {
    year: "2023",
    gdpPercent: 4.2,
    perStudent: 2380,
    euComparison: "EU avg: 5.1%",
  },
];

export default function EducationTrendsDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const title = i18n._(
    defineMessage({
      id: "demos.education-trends.title",
      message: "🎓 Serbia Education Trends - A Data Story",
    })
  );

  const description = i18n._(
    defineMessage({
      id: "demos.education-trends.description",
      message:
        "Exploring two decades of transformation in Serbian education: enrollment shifts, STEM growth, and persistent challenges",
    })
  );

  const totalEnrollmentChange =
    ((enrollmentTrends[enrollmentTrends.length - 1].total -
      enrollmentTrends[0].total) /
      enrollmentTrends[0].total) *
    100;

  const latestYear = enrollmentTrends[enrollmentTrends.length - 1];

  const dashboardContent = (
    <Box>
      <LiveDatasetPanel
        demoId="education-trends"
        title={
          locale === "sr"
            ? "Živi podaci (obrazovanje)"
            : "Live data (education)"
        }
      />

      {/* Narrative Introduction */}
      <Alert
        severity="info"
        sx={{
          mb: 4,
          fontSize: "1.1rem",
          fontWeight: 500,
          borderLeft: 6,
          borderColor: "primary.main",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          {locale === "sr"
            ? "📖 PRIČA IZ PODATAKA: Obrazovanje u Srbiji (2010-2023)"
            : "📖 DATA STORY: Education in Serbia (2010-2023)"}
        </Typography>
        <Typography variant="body2">
          {locale === "sr"
            ? "Serbia se suočava sa duplim izazovom: demografskim padom koji utiče na upise, i transformacijom obrazovnog sistema ka STEM oblastima. Iako se ukupan broj učenika i studenata smanjio za 41.5%, udelak STEM diplomiranih porastao je sa 42.3% na 53.8%."
            : "Serbia faces a dual challenge: demographic decline affecting enrollment, and transforming the education system toward STEM fields. While total enrollment decreased by 41.5%, STEM graduates increased from 42.3% to 53.8%."}
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
                <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Ukupan upis (2023)"
                    : "Total Enrollment (2023)"}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {(latestYear.total / 1000).toFixed(1)}K
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TrendingDownIcon fontSize="small" color="error" />
                <Typography variant="body2" color="error.main">
                  {totalEnrollmentChange.toFixed(1)}% od 2010
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{ height: "100%", borderLeft: 4, borderColor: "success.main" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PsychologyIcon sx={{ mr: 1, color: "success.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr" ? "STEM udio (2023)" : "STEM Share (2023)"}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 1, color: "success.main" }}
              >
                {stemVsHumanities[stemVsHumanities.length - 1].stem}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? `+${(stemVsHumanities[stemVsHumanities.length - 1].stem - stemVsHumanities[0].stem).toFixed(1)}pp od 2015`
                  : `+${(stemVsHumanities[stemVsHumanities.length - 1].stem - stemVsHumanities[0].stem).toFixed(1)}pp since 2015`}
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
                {locale === "sr"
                  ? "Odnos učenik-Profesor (Osnovne)"
                  : "Student-Teacher Ratio (Primary)"}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {teacherStudentRatio[
                  teacherStudentRatio.length - 1
                ].primary.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? `${teacherStudentRatio[teacherStudentRatio.length - 1].primary.toFixed(1)} učenika po profesoru`
                  : `${teacherStudentRatio[teacherStudentRatio.length - 1].primary.toFixed(1)} students per teacher`}
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
                <WorkIcon sx={{ mr: 1, color: "info.main" }} />
                <Typography variant="caption" color="text.secondary">
                  {locale === "sr"
                    ? "Troškovi za obrazovanje"
                    : "Education Spending"}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {educationSpending[educationSpending.length - 1].gdpPercent}%
                BDP
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? "€2,380 po učeniku/studentu"
                  : "€2,380 per student"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enrollment Trends Chart */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "📉 Trendovi upisa po nivoima obrazovanja (2010-2023)"
            : "📉 Enrollment Trends by Education Level (2010-2023)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Demografski pad se ogleda u smanjenju upisa u osnovne i srednje škole, dok visoko obrazovanje i dalje raste. Međutim, ukupan trend je opadajući."
            : "Demographic decline is reflected in decreased primary and secondary enrollment, while higher education continues to grow. However, the overall trend is declining."}
        </Typography>
        <Box sx={{ height: 500 }}>
          <LineChart
            data={enrollmentTrends.map((d) => ({
              year: d.year,
              Primary: d.primary,
              Secondary: d.secondary,
              Higher: d.higher,
            }))}
            xKey="year"
            yKey="value"
            multiSeries={true}
            width={950}
            height={500}
          />
        </Box>
      </Paper>

      {/* STEM Shift */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "🔬 Transformacija ka STEM oblastima (2015-2023)"
            : "🔬 Transformation Toward STEM Fields (2015-2023)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Srpski obrazovni sistem se usmerava ka STEM (nauka, tehnologija, inženjerstvo, matematika). Humanističke nauke beleže pad, dok vocational obrazovanje ostaje stabilno."
            : "The Serbian education system is shifting toward STEM fields. Humanities are declining, while vocational education remains stable."}
        </Typography>
        <Box sx={{ height: 450 }}>
          <ColumnChart
            data={stemVsHumanities.map((d) => ({
              year: d.year,
              STEM: d.stem,
              Humanities: d.humanities,
              Vocational: d.vocational,
            }))}
            xKey="year"
            yKey={["STEM", "Humanities", "Vocational"]}
            multiSeries={true}
            stacked={true}
            width={950}
            height={450}
          />
        </Box>
      </Paper>

      {/* Teacher-Student Ratio */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "👨‍🏫 Odnos učenika i profesora (2010-2023)"
            : "👨‍🏫 Student-Teacher Ratio (2010-2023)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Sve veći odnos učenika-po-profesoru ukazuje na pritisak na kvalitetu nastave, posebno u osnovnim školama."
            : "Increasing student-teacher ratios indicate pressure on teaching quality, especially in primary schools."}
        </Typography>
        <Box sx={{ height: 450 }}>
          <LineChart
            data={teacherStudentRatio.map((d) => ({
              year: d.year.toString(),
              Primary: d.primary,
              Secondary: d.secondary,
              Higher: d.higher,
            }))}
            xKey="year"
            yKey="value"
            multiSeries={true}
            width={950}
            height={450}
          />
        </Box>
      </Paper>

      {/* Graduates by Field */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "🎓 Diplomirani student po oblasti (2023)"
            : "🎓 University Graduates by Field (2023)"}
        </Typography>
        <Grid container spacing={2}>
          {graduatesByField.map((field) => (
            <Grid item xs={12} md={6} key={field.field}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {locale === "sr" ? field.fieldSr : field.field}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {locale === "sr" ? "Diplomirani:" : "Graduates:"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {field.graduates2023.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {locale === "sr" ? "Rast:" : "Growth:"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: field.growth > 0 ? "success.main" : "error.main",
                      }}
                    >
                      {field.growth > 0 ? "+" : ""}
                      {field.growth}%
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      {locale === "sr" ? "Zaposlenost:" : "Employment:"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "primary.main" }}
                    >
                      {field.employmentRate}%
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Education Spending */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "💰 Javni rashodi za obrazovanje"
            : "💰 Public Education Spending"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Srbija ulaže oko 4.2% BDP-a u obrazovanje, što je ispod EU proseka od 5.1%. Troškovi po učeniku studentu rastu, ali ostaju niži od EU proseka."
            : "Serbia invests around 4.2% of GDP in education, below the EU average of 5.1%. Spending per student is growing but remains below EU average."}
        </Typography>
        <Box sx={{ height: 450 }}>
          <ColumnChart
            data={educationSpending.map((d) => ({
              year: d.year.toString(),
              GDP: d.gdpPercent,
            }))}
            xKey="year"
            yKey="GDP"
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
            "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr" ? "🔑 Ključni uvidi" : "🔑 Key Insights"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "Demografski izazov"
                    : "Demographic Challenge"
                }
                color="error"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "Ukupan upis je pao za 41.5% od 2010. godine, prvenstveno zbog demografskih trendova, a ne kvaliteta obrazovanja."
                  : "Total enrollment fell by 41.5% since 2010, primarily due to demographic trends, not education quality."}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={locale === "sr" ? "STEM fokus" : "STEM Focus"}
                color="success"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "Udeo STEM diplomiranih porastao sa 42.3% na 53.8%, što pokazuje usklađenost sa potrebama tržišta rada."
                  : "STEM graduate share increased from 42.3% to 53.8%, showing alignment with labor market needs."}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr" ? "Pritisak na profesore" : "Teacher Pressure"
                }
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "Odno učenik-profesor se pogoršava, posebno u osnovnim školama (sa 15.2 na 19.5)."
                  : "Student-teacher ratios are worsening, especially in primary schools (from 15.2 to 19.5)."}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  locale === "sr"
                    ? "Investicije ispod EU proseka"
                    : "Below-EU Investment"
                }
                color="info"
                sx={{ mr: 1, mb: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {locale === "sr"
                  ? "Srbija troši 4.2% BDP-a na obrazovanje vs EU proseka 5.1%."
                  : "Serbia spends 4.2% of GDP on education vs EU average 5.1%."}
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
            ? "Podaci su prikupljeni iz Službenog statističkog pregleda i statističkih publikacija Republičkog zavoda za statistiku. Podaci su dostupni preko portala otvorenih podataka data.gov.rs."
            : "Data sourced from the Statistical Office of the Republic of Serbia official releases and publications. Data available through the open data portal data.gov.rs."}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          endIcon={<OpenInNewIcon />}
          href="https://data.gov.rs/datasets"
          target="_blank"
          rel="noopener noreferrer"
        >
          {locale === "sr" ? "Poseti data.gov.rs" : "Visit data.gov.rs"}
        </Button>
      </Paper>
    </Box>
  );

  return (
    <DemoPageTemplate
      title={title}
      description={description}
      datasetId="education-trends-demo"
      chartComponent={dashboardContent}
      fallbackData={enrollmentTrends}
      insightsConfig={{
        datasetId: "education-trends-demo",
        sampleData: enrollmentTrends,
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
          key: "primary",
          header: locale === "sr" ? "Osnovne škole" : "Primary",
          width: 150,
        },
        {
          key: "secondary",
          header: locale === "sr" ? "Srednje škole" : "Secondary",
          width: 150,
        },
        {
          key: "higher",
          header: locale === "sr" ? "Visoko obrazovanje" : "Higher",
          width: 150,
        },
        {
          key: "total",
          header: locale === "sr" ? "Ukupno" : "Total",
          width: 150,
        },
      ]}
    />
  );
}
