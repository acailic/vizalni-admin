/**
 * Interactive Playground Demo
 * Live code editor with real-time chart preview
 */

import { useLingui } from "@lingui/react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
} from "@mui/material";
import { LineChart, BarChart, PieChart } from "@vizualni/react";
import { useState, useMemo } from "react";

import { DemoLayout } from "@/components/demos/demo-layout";

import type { ChartConfig, Datum } from "@vizualni/core";

// Chart type options
type ChartType = "line" | "bar" | "pie";
type DataType = "sample" | "random" | "custom";

// Sample datasets
const sampleDatasets: Record<string, Datum[]> = {
  sales: [
    { label: "Jan", value: 4000 },
    { label: "Feb", value: 3000 },
    { label: "Mar", value: 5000 },
    { label: "Apr", value: 4500 },
    { label: "May", value: 6000 },
    { label: "Jun", value: 5500 },
  ],
  population: [
    { label: "0-14", value: 15 },
    { label: "15-24", value: 12 },
    { label: "25-44", value: 28 },
    { label: "45-64", value: 25 },
    { label: "65+", value: 20 },
  ],
  revenue: [
    { label: "Q1", value: 125000 },
    { label: "Q2", value: 180000 },
    { label: "Q3", value: 165000 },
    { label: "Q4", value: 210000 },
  ],
};

// Generate random data
function generateRandomData(count: number): Datum[] {
  return Array.from({ length: count }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 1000) + 100,
  }));
}

// Parse custom JSON data
function parseCustomData(jsonString: string): Datum[] | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export default function PlaygroundDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  // Chart configuration state
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [dataset, setDataset] = useState<string>("sales");
  const [dataType, setDataType] = useState<DataType>("sample");
  const [randomCount, setRandomCount] = useState(6);
  const [customData, setCustomData] = useState(
    JSON.stringify(sampleDatasets.sales, null, 2)
  );
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [showError, setShowError] = useState(true);

  // Get current data
  const data = useMemo(() => {
    if (dataType === "sample") {
      return sampleDatasets[dataset] || [];
    } else if (dataType === "random") {
      return generateRandomData(randomCount);
    } else {
      return parseCustomData(customData) || [];
    }
  }, [dataType, dataset, randomCount, customData]);

  // Generate chart config
  const config = useMemo((): ChartConfig => {
    if (chartType === "line") {
      return {
        type: "line",
        x: { field: "label", type: "string" },
        y: { field: "value", type: "number" },
      };
    } else if (chartType === "bar") {
      return {
        type: "bar",
        x: { field: "label", type: "string" },
        y: { field: "value", type: "number" },
      };
    } else {
      return {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "label", type: "string" },
      };
    }
  }, [chartType]);

  // Generate code snippet
  const codeSnippet = useMemo(() => {
    const chartComponent =
      chartType === "line"
        ? "LineChart"
        : chartType === "bar"
          ? "BarChart"
          : "PieChart";

    const configStr =
      chartType === "pie"
        ? `{
  type: "pie",
  value: { field: "value", type: "number" },
  category: { field: "label", type: "string" },
}`
        : `{
  type: "${chartType}",
  x: { field: "label", type: "string" },
  y: { field: "value", type: "number" },
}`;

    return `import { ${chartComponent} } from "@vizualni/react";

const data = ${JSON.stringify(data.slice(0, 4), null, 2)}${data.length > 4 ? "\n// ..." : ""};

<${chartComponent}
  data={data}
  config={${configStr}}
  width={${width}}
  height={${height}}
/>`;
  }, [chartType, data, width, height]);

  // Render chart
  const renderChart = () => {
    if (data.length === 0 && showError) {
      return (
        <Alert severity="warning">
          {locale === "sr" ? "Nema podataka za prikaz" : "No data to display"}
        </Alert>
      );
    }

    const commonProps = { data, config, width, height };

    switch (chartType) {
      case "line":
        return <LineChart {...commonProps} />;
      case "bar":
        return <BarChart {...commonProps} />;
      case "pie":
        return <PieChart {...commonProps} />;
      default:
        return null;
    }
  };

  const title =
    locale === "sr"
      ? "🎮 Interaktivni playground"
      : "🎮 Interactive Playground";

  const description =
    locale === "sr"
      ? "Eksperimentišite sa različitim tipovima grafikona i podacima u realnom vremenu"
      : "Experiment with different chart types and data in real-time";

  const content = (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          {locale === "sr"
            ? "🎮 Menjajte podešavanja sa leve strane i gledajte kako se grafikon ažurira trenutno!"
            : "🎮 Adjust settings on the left and watch the chart update instantly!"}
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Controls Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {locale === "sr" ? "⚙️ Podešavanja" : "⚙️ Settings"}
            </Typography>

            {/* Chart Type */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>
                {locale === "sr" ? "Tip grafikona" : "Chart Type"}
              </InputLabel>
              <Select
                value={chartType}
                label={locale === "sr" ? "Tip grafikona" : "Chart Type"}
                onChange={(e) => setChartType(e.target.value as ChartType)}
              >
                <MenuItem value="bar">
                  {locale === "sr" ? "📊 Bar" : "📊 Bar"}
                </MenuItem>
                <MenuItem value="line">
                  {locale === "sr" ? "📈 Line" : "📈 Line"}
                </MenuItem>
                <MenuItem value="pie">
                  {locale === "sr" ? "🥧 Pie" : "🥧 Pie"}
                </MenuItem>
              </Select>
            </FormControl>

            {/* Data Source */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>
                {locale === "sr" ? "Izvor podataka" : "Data Source"}
              </InputLabel>
              <Select
                value={dataType}
                label={locale === "sr" ? "Izvor podataka" : "Data Source"}
                onChange={(e) => setDataType(e.target.value as DataType)}
              >
                <MenuItem value="sample">
                  {locale === "sr" ? "Ugrađeni podaci" : "Sample Data"}
                </MenuItem>
                <MenuItem value="random">
                  {locale === "sr" ? "Nasumični podaci" : "Random Data"}
                </MenuItem>
                <MenuItem value="custom">
                  {locale === "sr" ? "Prilagođeni JSON" : "Custom JSON"}
                </MenuItem>
              </Select>
            </FormControl>

            {/* Sample Dataset Selector */}
            {dataType === "sample" && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>
                  {locale === "sr" ? "Skup podataka" : "Dataset"}
                </InputLabel>
                <Select
                  value={dataset}
                  label={locale === "sr" ? "Skup podataka" : "Dataset"}
                  onChange={(e) => setDataset(e.target.value)}
                >
                  <MenuItem value="sales">
                    {locale === "sr" ? "Prodaja" : "Sales"}
                  </MenuItem>
                  <MenuItem value="population">
                    {locale === "sr" ? "Stanovništvo" : "Population"}
                  </MenuItem>
                  <MenuItem value="revenue">
                    {locale === "sr" ? "Prihod" : "Revenue"}
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Random Data Count */}
            {dataType === "random" && (
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  {locale === "sr" ? "Broj tačaka" : "Data Points"}:{" "}
                  {randomCount}
                </Typography>
                <Slider
                  value={randomCount}
                  onChange={(_, v) => setRandomCount(v as number)}
                  min={3}
                  max={20}
                  marks
                  step={1}
                />
              </Box>
            )}

            {/* Custom JSON Input */}
            {dataType === "custom" && (
              <TextField
                fullWidth
                multiline
                rows={8}
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                label="JSON Data"
                placeholder='[{"label": "A", "value": 100}]'
                sx={{ mb: 3, fontFamily: "monospace" }}
                error={parseCustomData(customData) === null}
                helperText={
                  parseCustomData(customData) === null
                    ? "Invalid JSON"
                    : `${parseCustomData(customData)?.length} items`
                }
              />
            )}

            <Divider sx={{ my: 2 }} />

            {/* Dimensions */}
            <Typography variant="subtitle2" gutterBottom>
              {locale === "sr" ? "Dimenzije" : "Dimensions"}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom variant="body2">
                {locale === "sr" ? "Širina" : "Width"}: {width}px
              </Typography>
              <Slider
                value={width}
                onChange={(_, v) => setWidth(v as number)}
                min={300}
                max={900}
                step={50}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom variant="body2">
                {locale === "sr" ? "Visina" : "Height"}: {height}px
              </Typography>
              <Slider
                value={height}
                onChange={(_, v) => setHeight(v as number)}
                min={200}
                max={600}
                step={50}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={showError}
                  onChange={(e) => setShowError(e.target.checked)}
                />
              }
              label={locale === "sr" ? "Prikaži greške" : "Show error messages"}
            />
          </Paper>
        </Grid>

        {/* Chart Preview */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {locale === "sr" ? "📊 Pregled" : "📊 Preview"}
            </Typography>

            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                mb: 3,
                minWidth: "100%",
                display: "flex",
                justifyContent: "center",
                overflow: "auto",
              }}
            >
              {renderChart()}
            </Box>

            {/* Data Info */}
            <Card variant="outlined" sx={{ width: "100%", mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {locale === "sr" ? "Informacije o podacima" : "Data Info"}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    label={`${data.length} ${locale === "sr" ? "tačaka" : "points"}`}
                    size="small"
                  />
                  <Chip
                    label={`${chartType.toUpperCase()}`}
                    size="small"
                    color="primary"
                  />
                  <Chip
                    label={`${width}x${height}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Code Snippet */}
            <Card variant="outlined" sx={{ width: "100%" }}>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {locale === "sr" ? "Kod za kopiranje" : "Copy Code"}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: "#1e1e1e",
                    color: "#d4d4d4",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {codeSnippet}
                </Paper>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <DemoLayout title={title} description={description}>
      {content}
    </DemoLayout>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
