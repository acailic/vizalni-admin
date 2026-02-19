/**
 * Modern API Demo
 * Showcases the new @vizualni/* packages
 */

import { useLingui } from "@lingui/react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { LineChart, BarChart, PieChart, useChart } from "@vizualni/react";
import { useState } from "react";

import { DemoCodeBlock } from "@/components/demos/demo-code-block";
import { DemoLayout } from "@/components/demos/demo-layout";

// Import from the new packages

import type { ChartConfig, Datum } from "@vizualni/core";

// Sample data
const lineData: Datum[] = [
  { date: new Date("2024-01-01"), value: 100, label: "Jan" },
  { date: new Date("2024-02-01"), value: 150, label: "Feb" },
  { date: new Date("2024-03-01"), value: 120, label: "Mar" },
  { date: new Date("2024-04-01"), value: 180, label: "Apr" },
  { date: new Date("2024-05-01"), value: 200, label: "May" },
  { date: new Date("2024-06-01"), value: 170, label: "Jun" },
];

const barData: Datum[] = [
  { category: "React", downloads: 40000 },
  { category: "Vue", downloads: 25000 },
  { category: "Angular", downloads: 30000 },
  { category: "Svelte", downloads: 15000 },
  { category: "Solid", downloads: 8000 },
];

const pieData: Datum[] = [
  { category: "Production", value: 45 },
  { category: "Development", value: 25 },
  { category: "Testing", value: 15 },
  { category: "Documentation", value: 10 },
  { category: "Other", value: 5 },
];

// Headless chart component demo
function HeadlessChartDemo({ data }: { data: Datum[] }) {
  const config: ChartConfig = {
    type: "line",
    x: { field: "date", type: "date" },
    y: { field: "value", type: "number" },
  };

  const { scales, layout, error } = useChart(data, config, {
    width: 500,
    height: 300,
  });

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Headless Hook Output:
      </Typography>
      <Paper
        variant="outlined"
        sx={{ p: 2, fontFamily: "monospace", fontSize: "0.8rem" }}
      >
        <pre>
          {JSON.stringify(
            {
              layout: {
                width: layout.width,
                height: layout.height,
                chartArea: layout.chartArea,
              },
              scales: {
                x: { domain: scales.x.domain?.().slice(0, 2) },
                y: { domain: scales.y.domain?.() },
              },
            },
            null,
            2
          )}
        </pre>
      </Paper>
    </Box>
  );
}

export default function ModernApiDemo() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [activeTab, setActiveTab] = useState(0);

  const title =
    locale === "sr"
      ? "🚀 Moderna API - @vizualni/* paketi"
      : "🚀 Modern API - @vizualni/* packages";

  const description =
    locale === "sr"
      ? "Istražite novu generaciju vizualizacija sa @vizualni/core, @vizualni/react i @vizualni/connectors"
      : "Explore the next generation of visualizations with @vizualni/core, @vizualni/react and @vizualni/connectors";

  const codeExamples = {
    quickStart: `import { LineChart, BarChart, PieChart } from '@vizualni/react';

// Simple line chart
<LineChart
  data={[
    { date: new Date('2024-01-01'), value: 100 },
    { date: new Date('2024-02-01'), value: 150 },
  ]}
  config={{
    type: 'line',
    x: { field: 'date', type: 'date' },
    y: { field: 'value', type: 'number' },
  }}
  width={600}
  height={400}
/>`,
    headless: `import { useChart } from '@vizualni/react';

function CustomChart({ data }) {
  const { scales, layout, shapes, error } = useChart(data, {
    type: 'line',
    x: { field: 'date', type: 'date' },
    y: { field: 'value', type: 'number' },
  }, { width: 600, height: 400 });

  if (error) return <div>Error: {error}</div>;

  // Full control over rendering
  return (
    <svg width={layout.width} height={layout.height}>
      {shapes.map((shape, i) => (
        <path key={i} d={shape.path} stroke={shape.stroke} />
      ))}
    </svg>
  );
}`,
    connectors: `import { useConnector } from '@vizualni/react';
import { csvConnector, jsonConnector } from '@vizualni/connectors';

function ChartFromCSV() {
  const { data, loading, error } = useConnector(csvConnector, {
    url: 'https://example.com/data.csv',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <BarChart
      data={data}
      config={{
        type: 'bar',
        x: { field: 'category', type: 'string' },
        y: { field: 'value', type: 'number' },
      }}
      width={600}
      height={400}
    />
  );
}`,
    core: `import { computeChart } from '@vizualni/core';

// Framework-agnostic chart computation
const result = computeChart(
  [{ x: 0, y: 10 }, { x: 1, y: 20 }],
  { type: 'line', x: { field: 'x', type: 'number' }, y: { field: 'y', type: 'number' } },
  { width: 600, height: 400 }
);

// Use result.scales, result.layout, result.shapes
// in any framework: React, Vue, Svelte, vanilla JS, Canvas, etc.`,
  };

  const content = (
    <Box>
      {/* Hero Section */}
      <Alert severity="success" sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {locale === "sr"
            ? "Nova generacija vizualizacija!"
            : "Next generation visualizations!"}
        </Typography>
        <Typography variant="body2">
          {locale === "sr"
            ? "Framework-agnostic core sa React binding-ima. Manji bundle, bolja TypeScript podrška."
            : "Framework-agnostic core with React bindings. Smaller bundle, better TypeScript support."}
        </Typography>
      </Alert>

      {/* Package Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="primary" fontWeight={600}>
                @vizualni/core
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {locale === "sr"
                  ? "Framework-agnostic: scales, layouts, shapes"
                  : "Framework-agnostic: scales, layouts, shapes"}
              </Typography>
              <Chip label="11 KB gzipped" size="small" color="success" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="primary" fontWeight={600}>
                @vizualni/react
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {locale === "sr"
                  ? "React komponente i hooks"
                  : "React components and hooks"}
              </Typography>
              <Chip label="8 KB gzipped" size="small" color="success" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="primary" fontWeight={600}>
                @vizualni/connectors
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {locale === "sr"
                  ? "CSV, JSON, REST konektori"
                  : "CSV, JSON, REST connectors"}
              </Typography>
              <Chip label="3 KB gzipped" size="small" color="success" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Demos */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr" ? "📊 Živi primeri" : "📊 Live Examples"}
        </Typography>

        <Grid container spacing={4}>
          {/* Line Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              LineChart
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >
              <LineChart
                data={lineData}
                config={{
                  type: "line",
                  x: { field: "date", type: "date" },
                  y: { field: "value", type: "number" },
                }}
                width={400}
                height={250}
              />
            </Box>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              BarChart
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >
              <BarChart
                data={barData}
                config={{
                  type: "bar",
                  x: { field: "category", type: "string" },
                  y: { field: "downloads", type: "number" },
                }}
                width={400}
                height={250}
              />
            </Box>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              PieChart
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >
              <PieChart
                data={pieData}
                config={{
                  type: "pie",
                  value: { field: "value", type: "number" },
                  category: { field: "category", type: "string" },
                }}
                width={400}
                height={250}
              />
            </Box>
          </Grid>

          {/* Headless Hook Demo */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              useChart Hook (Headless)
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <HeadlessChartDemo data={lineData} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Code Examples */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr" ? "💻 Primeri koda" : "💻 Code Examples"}
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ mb: 2 }}
        >
          <Tab label="Quick Start" />
          <Tab label="Headless Hook" />
          <Tab label="Connectors" />
          <Tab label="Core API" />
        </Tabs>

        {activeTab === 0 && (
          <DemoCodeBlock
            title="Quick Start"
            code={codeExamples.quickStart}
            language="tsx"
          />
        )}
        {activeTab === 1 && (
          <DemoCodeBlock
            title="Headless Hook"
            code={codeExamples.headless}
            language="tsx"
          />
        )}
        {activeTab === 2 && (
          <DemoCodeBlock
            title="Data Connectors"
            code={codeExamples.connectors}
            language="tsx"
          />
        )}
        {activeTab === 3 && (
          <DemoCodeBlock
            title="Core API (Framework-agnostic)"
            code={codeExamples.core}
            language="typescript"
          />
        )}
      </Paper>

      {/* Comparison Table */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {locale === "sr" ? "📦 Poređenje" : "📦 Comparison"}
        </Typography>
        <Box
          component="table"
          sx={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: 8,
                  borderBottom: "1px solid #ddd",
                }}
              >
                {locale === "sr" ? "Karakteristika" : "Feature"}
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: 8,
                  borderBottom: "1px solid #ddd",
                }}
              >
                @vizualni/*
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: 8,
                  borderBottom: "1px solid #ddd",
                }}
              >
                Old API
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 8 }}>Bundle size</td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "success.main",
                }}
              >
                ~22 KB
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "text.secondary",
                }}
              >
                ~275 KB
              </td>
            </tr>
            <tr>
              <td style={{ padding: 8 }}>Framework agnostic</td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "success.main",
                }}
              >
                ✅
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "text.secondary",
                }}
              >
                ❌
              </td>
            </tr>
            <tr>
              <td style={{ padding: 8 }}>Tree-shakeable</td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "success.main",
                }}
              >
                ✅
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "text.secondary",
                }}
              >
                ❌
              </td>
            </tr>
            <tr>
              <td style={{ padding: 8 }}>TypeScript (strict)</td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "success.main",
                }}
              >
                ✅
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "text.secondary",
                }}
              >
                ⚠️
              </td>
            </tr>
            <tr>
              <td style={{ padding: 8 }}>Headless hooks</td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "success.main",
                }}
              >
                ✅
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "text.secondary",
                }}
              >
                ❌
              </td>
            </tr>
            <tr>
              <td style={{ padding: 8 }}>Data connectors</td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "success.main",
                }}
              >
                ✅
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: 8,
                  color: "text.secondary",
                }}
              >
                ⚠️
              </td>
            </tr>
          </tbody>
        </Box>
      </Paper>
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
