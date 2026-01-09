/**
 * Interactive Chart Playground
 *
 * A page where users can experiment with chart configurations
 * without writing code. Features live preview and code export.
 *
 * @route /demos/playground
 */

import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import CodeIcon from "@mui/icons-material/Code";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { DemoCodeBlock } from "@/components/demos/demo-code-block";
import { LineChart } from "@/exports/charts";
import type { BaseChartConfig } from "@/exports/charts";

// Sample datasets
const sampleData = {
  simple: [
    { year: "2020", value: 100 },
    { year: "2021", value: 120 },
    { year: "2022", value: 115 },
    { year: "2023", value: 130 },
    { year: "2024", value: 140 },
  ],
  multiSeries: [
    { year: "2020", revenue: 100, expenses: 80 },
    { year: "2021", revenue: 120, expenses: 90 },
    { year: "2022", revenue: 115, expenses: 95 },
    { year: "2023", revenue: 130, expenses: 100 },
    { year: "2024", revenue: 140, expenses: 110 },
  ],
  economy: [
    { year: "2018", gdp: 45.2, inflation: 2.1 },
    { year: "2019", gdp: 47.1, inflation: 1.9 },
    { year: "2020", gdp: 43.5, inflation: 2.3 },
    { year: "2021", gdp: 46.8, inflation: 4.1 },
    { year: "2022", gdp: 49.3, inflation: 9.4 },
    { year: "2023", gdp: 51.6, inflation: 8.9 },
  ],
};

const colorPresets = [
  { value: "#6366f1", label: "Indigo", color: "#6366f1" },
  { value: "#10b981", label: "Emerald", color: "#10b981" },
  { value: "#f59e0b", label: "Amber", color: "#f59e0b" },
  { value: "#ef4444", label: "Red", color: "#ef4444" },
  { value: "#8b5cf6", label: "Violet", color: "#8b5cf6" },
  { value: "#06b6d4", label: "Cyan", color: "#06b6d4" },
];

export default function PlaygroundPage() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const [activeTab, setActiveTab] = useState(0);
  const [dataset, setDataset] = useState<keyof typeof sampleData>("simple");
  const [config, setConfig] = useState<BaseChartConfig>({
    xAxis: "year",
    yAxis: "value",
    color: "#6366f1",
    showArea: true,
    showCrosshair: true,
  });

  const data = sampleData[dataset];

  // Update config helper
  const updateConfig = <K extends keyof BaseChartConfig>(
    key: K,
    value: BaseChartConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Generate code snippet
  const generateCode = () => {
    const isMultiSeries = dataset === "multiSeries" || dataset === "economy";
    const seriesConfig = isMultiSeries
      ? `
  config={{
    xAxis: '${config.xAxis}',
    yAxis: ['${(config.yAxis as string[]).join("', '")}'],
    seriesKeys: ['${(config.yAxis as string[]).join("', '")}'],
    color: '${config.color}',
  }}`
      : `
  config={{
    xAxis: '${config.xAxis}',
    yAxis: '${config.yAxis}',
    color: '${config.color}',
  }}`;

    return `import { LineChart } from '@acailic/vizualni-admin/charts';

function MyChart() {
  const data = ${JSON.stringify(data.slice(0, 3), null, 2).replace(
    /\n/g,
    "\n  "
  )};
  ${data.length > 3 ? "// ... (truncated for demo)" : ""}

  return (
    <LineChart
      data={data}
      ${isMultiSeries ? "multiSeries" : ""}${seriesConfig}
      height={400}
    />
  );
}`;
  };

  const title =
    locale === "sr" ? "🎮 Igralište za grafikone" : "🎮 Chart Playground";

  const description =
    locale === "sr"
      ? "Eksperimentišite sa konfiguracijom grafikona u realnom vremenu"
      : "Experiment with chart configurations in real-time";

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 4 }}>
        {locale === "sr" ? (
          <>
            <strong>🎯 KORISTI OVO STRANICU ZA:</strong> Testiranje različitih
            konfiguracija grafikona, eksperimentisanje sa bojama i opcijama, i
            generisanje koda za vaš projekat.
          </>
        ) : (
          <>
            <strong>🎯 USE THIS PAGE TO:</strong> Test different chart
            configurations, experiment with colors and options, and generate
            code for your project.
          </>
        )}
      </Alert>

      <Grid container spacing={3}>
        {/* Left Panel: Configuration */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              <Trans>Configuration</Trans>
            </Typography>

            <Stack spacing={3}>
              {/* Dataset Selector */}
              <FormControl fullWidth>
                <InputLabel>
                  <Trans>Dataset</Trans>
                </InputLabel>
                <Select
                  value={dataset}
                  label={<Trans>Dataset</Trans>}
                  onChange={(e) => {
                    const newDataset = e.target
                      .value as keyof typeof sampleData;
                    setDataset(newDataset);
                    // Auto-update axis keys based on dataset
                    if (newDataset === "multiSeries") {
                      setConfig({
                        xAxis: "year",
                        yAxis: ["revenue", "expenses"],
                        color: "#6366f1",
                      });
                    } else if (newDataset === "economy") {
                      setConfig({
                        xAxis: "year",
                        yAxis: ["gdp", "inflation"],
                        color: "#6366f1",
                      });
                    } else {
                      setConfig({
                        xAxis: "year",
                        yAxis: "value",
                        color: "#6366f1",
                      });
                    }
                  }}
                >
                  <MenuItem value="simple">
                    <Trans>Simple (Single Series)</Trans>
                  </MenuItem>
                  <MenuItem value="multiSeries">
                    <Trans>Multi-Series (Revenue vs Expenses)</Trans>
                  </MenuItem>
                  <MenuItem value="economy">
                    <Trans>Economic Indicators (GDP, Inflation)</Trans>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* X-Axis Selector */}
              <FormControl fullWidth>
                <InputLabel>
                  <Trans>X-Axis</Trans>
                </InputLabel>
                <Select
                  value={config.xAxis}
                  label={<Trans>X-Axis</Trans>}
                  onChange={(e) => updateConfig("xAxis", e.target.value)}
                >
                  {Object.keys(data[0] || {}).map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Y-Axis Selector */}
              <FormControl fullWidth>
                <InputLabel>
                  <Trans>Y-Axis</Trans>
                </InputLabel>
                <Select
                  value={
                    Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis
                  }
                  label={<Trans>Y-Axis</Trans>}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Check if we should switch to multi-series
                    if (dataset === "multiSeries" && value === "revenue") {
                      updateConfig("yAxis", ["revenue", "expenses"]);
                    } else if (dataset === "economy" && value === "gdp") {
                      updateConfig("yAxis", ["gdp", "inflation"]);
                    } else {
                      updateConfig("yAxis", value);
                    }
                  }}
                >
                  {Object.keys(data[0] || {})
                    .filter((k) => k !== config.xAxis)
                    .map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {/* Color Selector */}
              <FormControl fullWidth>
                <InputLabel>
                  <Trans>Color</Trans>
                </InputLabel>
                <Select
                  value={config.color}
                  label={<Trans>Color</Trans>}
                  onChange={(e) => updateConfig("color", e.target.value)}
                >
                  {colorPresets.map((preset) => (
                    <MenuItem key={preset.value} value={preset.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: preset.color,
                          }}
                        />
                        {preset.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Custom Color Input */}
              <TextField
                fullWidth
                label={<Trans>Custom Color</Trans>}
                type="color"
                value={config.color}
                onChange={(e) => updateConfig("color", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 1,
                          backgroundColor: config.color,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Quick Actions */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => updateConfig("showArea", !config.showArea)}
                >
                  {config.showArea ? (
                    <Trans>Hide Area</Trans>
                  ) : (
                    <Trans>Show Area</Trans>
                  )}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    updateConfig("showCrosshair", !config.showCrosshair)
                  }
                >
                  {config.showCrosshair ? (
                    <Trans>Hide Crosshair</Trans>
                  ) : (
                    <Trans>Show Crosshair</Trans>
                  )}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Panel: Preview */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
              <Tab
                icon={<VisibilityIcon />}
                iconPosition="start"
                label={<Trans>Preview</Trans>}
              />
              <Tab
                icon={<CodeIcon />}
                iconPosition="start"
                label={<Trans>Code</Trans>}
              />
            </Tabs>
          </Box>

          {activeTab === 0 ? (
            <Paper sx={{ p: 3, minHeight: 500 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                <Trans>Chart Preview</Trans>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LineChart data={data} config={config} height={400} animated />
              </Box>
            </Paper>
          ) : (
            <Box>
              <DemoCodeBlock
                title="Generated Code"
                code={generateCode()}
                language="tsx"
                defaultCollapsed={false}
                showLineNumbers
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Usage Instructions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            {locale === "sr" ? "📚 Korišćenje" : "📚 How to Use"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locale === "sr" ? (
              <>
                1. Izaberite set podataka iz padajućeg menija
                <br />
                2. Podesite ose X i Y birajući kolone iz podataka
                <br />
                3. Izaberite boju iz palete ili unesite prilagođenu HEX vrednost
                <br />
                4. Koristite dugmad za uključivanje/isključivanje oblasti i
                nišana
                <br />
                5. Kliknite na tab "Code" da biste videli generisani kod
                <br />
                6. Kopirajte kod i koristite ga u svom projektu
              </>
            ) : (
              <>
                1. Select a dataset from the dropdown menu
                <br />
                2. Configure X and Y axes by selecting columns from the data
                <br />
                3. Choose a color from the palette or enter a custom HEX value
                <br />
                4. Use buttons to toggle area fill and crosshair
                <br />
                5. Click the "Code" tab to see the generated code
                <br />
                6. Copy the code and use it in your project
              </>
            )}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
