/**
 * Getting Started Demo
 * Interactive quick start with minimal sample data
 */

import { useLingui } from "@lingui/react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { DemoPageTemplate } from "@/components/demo/DemoPageTemplate";
import {
  BarChart,
  ColumnChart,
  LineChart,
  PieChart,
} from "@/components/demos/charts";
import { DemoCodeBlock } from "@/components/demos/demo-code-block";

// Sample data for getting started
const sampleSalesData = [
  { month: "Jan", sales: 4000, target: 3500 },
  { month: "Feb", sales: 3000, target: 3500 },
  { month: "Mar", sales: 5000, target: 4000 },
  { month: "Apr", sales: 4500, target: 4000 },
  { month: "May", sales: 6000, target: 5000 },
  { month: "Jun", sales: 5500, target: 5000 },
];

const sampleCategoryData = [
  { category: "Electronics", value: 35 },
  { category: "Clothing", value: 25 },
  { category: "Food", value: 20 },
  { category: "Books", value: 12 },
  { category: "Other", value: 8 },
];

const sampleTrendData = [
  { period: "Week 1", visitors: 1200, signups: 120 },
  { period: "Week 2", visitors: 1900, signups: 180 },
  { period: "Week 3", visitors: 2300, signups: 250 },
  { period: "Week 4", visitors: 2800, signups: 320 },
];

type ChartType = "line" | "bar" | "column" | "pie";

export default function GettingStartedDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [selectedChart, setSelectedChart] = useState<ChartType>("line");
  const [selectedDataset, setSelectedDataset] = useState<
    "sales" | "categories" | "trends"
  >("sales");

  const handleChartTypeChange = (event: SelectChangeEvent<ChartType>) => {
    setSelectedChart(event.target.value as ChartType);
  };

  const handleDatasetChange = (event: SelectChangeEvent) => {
    setSelectedDataset(event.target.value as "sales" | "categories" | "trends");
  };

  const title =
    locale === "sr"
      ? "📊 Počnite - Brzi vodič kroz grafikone"
      : "📊 Getting Started - Quick Chart Guide";

  const description =
    locale === "sr"
      ? "Interaktivni uvod u biblioteku grafikona sa minimalnim podacima. Saznajte kako kreirati lepe vizualizacije za samo nekoliko minuta."
      : "Interactive introduction to the chart library with minimal sample data. Learn how to create beautiful visualizations in just a few minutes.";

  // Render the appropriate chart based on selection
  const renderChart = () => {
    const commonProps = {
      width: 900,
      height: 400,
    };

    switch (selectedChart) {
      case "line":
        if (selectedDataset === "sales") {
          return (
            <LineChart
              data={sampleSalesData.map((d) => ({
                label: d.month,
                value: d.sales,
                category: locale === "sr" ? "Prodaja" : "Sales",
              }))}
              xKey="label"
              yKey="value"
              {...commonProps}
            />
          );
        } else if (selectedDataset === "trends") {
          return (
            <LineChart
              data={sampleTrendData.map((d) => ({
                label: d.period,
                value: d.visitors,
                category: locale === "sr" ? "Posetioci" : "Visitors",
              }))}
              xKey="label"
              yKey="value"
              {...commonProps}
            />
          );
        }
        return (
          <LineChart
            data={sampleCategoryData.map((d) => ({
              label: d.category,
              value: d.value,
              category: locale === "sr" ? "Vrednost" : "Value",
            }))}
            xKey="label"
            yKey="value"
            {...commonProps}
          />
        );

      case "bar":
        if (selectedDataset === "sales") {
          return (
            <BarChart
              data={sampleSalesData.map((d) => ({
                label: d.month,
                value: d.sales,
                category: locale === "sr" ? "Prodaja" : "Sales",
              }))}
              xKey="label"
              yKey="value"
              {...commonProps}
            />
          );
        } else if (selectedDataset === "trends") {
          return (
            <BarChart
              data={sampleTrendData.map((d) => ({
                label: d.period,
                value: d.signups,
                category: locale === "sr" ? "Registracije" : "Sign-ups",
              }))}
              xKey="label"
              yKey="value"
              {...commonProps}
            />
          );
        }
        return (
          <BarChart
            data={sampleCategoryData.map((d) => ({
              label: d.category,
              value: d.value,
              category: locale === "sr" ? "Vrednost" : "Value",
            }))}
            xKey="label"
            yKey="value"
            {...commonProps}
          />
        );

      case "column":
        if (selectedDataset === "sales") {
          return (
            <ColumnChart
              data={sampleSalesData.map((d) => ({
                label: d.month,
                value: d.sales,
              }))}
              xKey="label"
              yKey="value"
              {...commonProps}
            />
          );
        } else if (selectedDataset === "trends") {
          return (
            <ColumnChart
              data={sampleTrendData.map((d) => ({
                label: d.period,
                value: d.visitors,
              }))}
              xKey="label"
              yKey="value"
              {...commonProps}
            />
          );
        }
        return (
          <ColumnChart
            data={sampleCategoryData.map((d) => ({
              label: d.category,
              value: d.value,
            }))}
            xKey="label"
            yKey="value"
            {...commonProps}
          />
        );

      case "pie":
        if (selectedDataset === "categories") {
          return (
            <PieChart
              data={sampleCategoryData.map((d) => ({
                label: d.category,
                value: d.value,
              }))}
              labelKey="label"
              valueKey="value"
              {...commonProps}
            />
          );
        }
        return (
          <Alert severity="info">
            {locale === "sr"
              ? "Pie grafikon radi najbolje sa podacima o kategorijama. Izaberite 'Categories' skup podataka."
              : "Pie chart works best with category data. Select 'Categories' dataset."}
          </Alert>
        );

      default:
        return null;
    }
  };

  // Generate code example based on current selection
  const generateCodeExample = () => {
    const datasetVar =
      selectedDataset === "sales"
        ? "sampleSalesData"
        : selectedDataset === "trends"
          ? "sampleTrendData"
          : "sampleCategoryData";

    const chartComponent =
      selectedChart === "line"
        ? "LineChart"
        : selectedChart === "bar"
          ? "BarChart"
          : selectedChart === "column"
            ? "ColumnChart"
            : "PieChart";

    let xKey = "label";
    let yKey = "value";
    let dataMapping = "";

    if (selectedDataset === "sales") {
      dataMapping = `.map(d => ({
    label: d.month,
    value: d.sales,
    category: '${locale === "sr" ? "Prodaja" : "Sales"}'
  }))`;
    } else if (selectedDataset === "trends") {
      dataMapping = `.map(d => ({
    label: d.period,
    value: d.visitors,
    category: '${locale === "sr" ? "Posetioci" : "Visitors"}'
  }))`;
    } else {
      dataMapping = `.map(d => ({
    label: d.category,
    value: d.value
  }))`;
    }

    if (selectedChart === "pie") {
      xKey = "labelKey";
      yKey = "valueKey";
      dataMapping = dataMapping
        .replace("label: ", "label: ")
        .replace("value: ", "value: ");
    }

    return `import { ${chartComponent} } from '@/components/demos/charts';

// Sample data
const ${datasetVar} = ${JSON.stringify(
      selectedDataset === "sales"
        ? sampleSalesData
        : selectedDataset === "trends"
          ? sampleTrendData
          : sampleCategoryData,
      null,
      2
    )};

// Create the chart
<${chartComponent}
  data={${datasetVar}${dataMapping}}
  ${xKey}="${xKey === "labelKey" ? "label" : "label"}"
  ${yKey}="${yKey === "valueKey" ? "value" : "value"}"
  width={900}
  height={400}
/>

// Or using the standalone export
import { ${chartComponent} } from '@acailic/vizualni-admin/charts';

<${chartComponent}
  data={${datasetVar}}
  config={{
    ${xKey === "labelKey" ? "labelKey" : "xAxis"}: "${selectedDataset === "sales" ? "month" : selectedDataset === "trends" ? "period" : "category"}",
    ${yKey === "valueKey" ? "valueKey" : "yAxis"}: "${selectedDataset === "sales" ? "sales" : selectedDataset === "trends" ? "visitors" : "value"}",
    ${selectedChart === "line" ? "color: '#6366f1'," : ""}
    ${selectedChart === "bar" || selectedChart === "column" ? "barRadius: 6," : ""}
  }}
  height={400}
/>`;
  };

  const dashboardContent = (
    <Box>
      {/* Welcome Alert */}
      <Alert
        severity="success"
        sx={{ mb: 4, fontSize: "1.1rem", fontWeight: 500 }}
      >
        {locale === "sr" ? (
          <>
            <strong>👋 Dobrodošli!</strong> Ovo je interaktivni uvod u
            biblioteku grafikona. Probajte različite tipove grafikona i skupove
            podataka da biste videli kako rade.
          </>
        ) : (
          <>
            <strong>👋 Welcome!</strong> This is an interactive introduction to
            the chart library. Try different chart types and datasets to see how
            they work.
          </>
        )}
      </Alert>

      {/* Interactive Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr"
            ? "🎛️ Interaktivni kontrolni panel"
            : "🎛️ Interactive Control Panel"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Izaberite tip grafikona i skup podataka da biste videli kako se vizualizacija menja u realnom vremenu."
            : "Select chart type and dataset to see how the visualization changes in real-time."}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>
                {locale === "sr" ? "Tip grafikona" : "Chart Type"}
              </InputLabel>
              <Select
                value={selectedChart}
                label={locale === "sr" ? "Tip grafikona" : "Chart Type"}
                onChange={handleChartTypeChange}
              >
                <option value="line">
                  {locale === "sr" ? "📈 Linijski grafikon" : "📈 Line Chart"}
                </option>
                <option value="bar">
                  {locale === "sr" ? "📊 Trakaasti grafikon" : "📊 Bar Chart"}
                </option>
                <option value="column">
                  {locale === "sr" ? "📊 Kolonski grafikon" : "📊 Column Chart"}
                </option>
                <option value="pie">
                  {locale === "sr" ? "🥧 Pita grafikon" : "🥧 Pie Chart"}
                </option>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>
                {locale === "sr" ? "Skup podataka" : "Dataset"}
              </InputLabel>
              <Select
                value={selectedDataset}
                label={locale === "sr" ? "Skup podataka" : "Dataset"}
                onChange={handleDatasetChange}
              >
                <option value="sales">
                  {locale === "sr" ? "💰 Mesečna prodaja" : "💰 Monthly Sales"}
                </option>
                <option value="categories">
                  {locale === "sr"
                    ? "📦 Prodaja po kategorijama"
                    : "📦 Sales by Category"}
                </option>
                <option value="trends">
                  {locale === "sr" ? "📈 Trendovi poseta" : "📈 Visitor Trends"}
                </option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Current Selection Info */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "info.lighter",
            borderRadius: 1,
            mb: 3,
          }}
        >
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            {locale === "sr" ? "Trenutna selekcija:" : "Current Selection:"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>
              {locale === "sr" ? "Tip grafikona:" : "Chart Type:"}
            </strong>{" "}
            {selectedChart === "line"
              ? locale === "sr"
                ? "Linijski grafikon"
                : "Line Chart"
              : selectedChart === "bar"
                ? locale === "sr"
                  ? "Trakaasti grafikon"
                  : "Bar Chart"
                : selectedChart === "column"
                  ? locale === "sr"
                    ? "Kolonski grafikon"
                    : "Column Chart"
                  : locale === "sr"
                    ? "Pita grafikon"
                    : "Pie Chart"}
            {" | "}
            <strong>{locale === "sr" ? "Podaci:" : "Data:"}</strong>{" "}
            {selectedDataset === "sales"
              ? locale === "sr"
                ? "Mesečna prodaja"
                : "Monthly Sales"
              : selectedDataset === "categories"
                ? locale === "sr"
                  ? "Prodaja po kategorijama"
                  : "Sales by Category"
                : locale === "sr"
                  ? "Trendovi poseta"
                  : "Visitor Trends"}
          </Typography>
        </Box>

        {/* Chart Display */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {locale === "sr" ? "📊 Pregled grafikona" : "📊 Chart Preview"}
          </Typography>
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              p: 3,
              border: 1,
              borderColor: "divider",
            }}
          >
            {renderChart()}
          </Box>
        </Box>
      </Paper>

      {/* Code Example */}
      <DemoCodeBlock
        title={
          locale === "sr" ? "📝 Kod za ovaj grafikon" : "📝 Code for This Chart"
        }
        code={generateCodeExample()}
        language="tsx"
      />

      {/* Quick Tips */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card
            variant="outlined"
            sx={{ height: "100%", borderLeft: 4, borderColor: "primary.main" }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === "sr" ? "🚀 Brzi početak" : "🚀 Quick Start"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? "Svi grafikoni koriste isti API. Samo promenite tip komponente i podatke su spremni."
                  : "All charts use the same API. Just change the component type and your data is ready."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "success.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === "sr" ? "📦 Prilagodljivo" : "📦 Customizable"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? "Promenite boje, veličine, labele i više kroz jednostavne prop opcije."
                  : "Change colors, sizes, labels and more through simple prop options."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderLeft: 4,
              borderColor: "info.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === "sr" ? "🌐 Višejezično" : "🌐 Multilingual"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === "sr"
                  ? "Podrška za srpski (latinica/ćirilica) i engleski jezik."
                  : "Support for Serbian (Latin/Cyrillic) and English languages."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Next Steps */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr" ? "🎯 Sledeći koraci" : "🎯 Next Steps"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Button variant="outlined" fullWidth href="/demos/economy">
              {locale === "sr" ? "📊 Ekonomija Demo" : "📊 Economy Demo"}
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="outlined" fullWidth href="/demos/healthcare">
              {locale === "sr" ? "🏥 Zdravstvo Demo" : "🏥 Healthcare Demo"}
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="outlined" fullWidth href="/demos/transport">
              {locale === "sr" ? "🚗 Saobraćaj Demo" : "🚗 Transport Demo"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  return (
    <DemoPageTemplate
      title={title}
      description={description}
      datasetId="getting-started-demo"
      chartComponent={dashboardContent}
      fallbackData={sampleSalesData}
      insightsConfig={{
        datasetId: "getting-started-demo",
        sampleData: sampleSalesData,
        valueColumn: "sales",
        timeColumn: "month",
      }}
      columns={[
        {
          key: "month",
          header: locale === "sr" ? "Mesec" : "Month",
          width: 100,
        },
        {
          key: "sales",
          header: locale === "sr" ? "Prodaja" : "Sales",
          width: 120,
        },
        {
          key: "target",
          header: locale === "sr" ? "Cilj" : "Target",
          width: 120,
        },
      ]}
    />
  );
}

/**
 * Static generation for GitHub Pages
 */
export async function getStaticProps() {
  return {
    props: {},
  };
}
