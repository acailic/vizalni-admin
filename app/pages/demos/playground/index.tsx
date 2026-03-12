import { useLingui } from "@lingui/react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import Head from "next/head";
import { useEffect } from "react";

import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import { CodeOutput } from "@/demos/playground/_components/CodeOutput";
import { ConfigPanel } from "@/demos/playground/_components/ConfigPanel";
import { PreviewPane } from "@/demos/playground/_components/PreviewPane";
import { SAMPLE_DATASETS, getThemeById } from "@/demos/playground/_constants";
import { usePlaygroundStore } from "@/demos/playground/_hooks/usePlaygroundStore";
import { useUrlState } from "@/demos/playground/_hooks/useUrlState";

export default function PlaygroundPage() {
  const { i18n } = useLingui();
  const theme = useTheme();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const isSerbian = locale === "sr";

  const {
    chartType,
    data,
    config,
    themeId,
    ui,
    setChartType,
    setData,
    setConfig,
    setThemeId,
    setActiveTab,
  } = usePlaygroundStore();

  const { getStateFromUrl } = useUrlState();

  const loadDefaultDataset = () => {
    setData(SAMPLE_DATASETS.sales.data);
    setConfig({
      xAxis: "label",
      yAxis: "value",
      color: theme.palette.primary.main,
    });
  };

  const normalizePlayableState = (
    nextData: typeof data,
    nextConfig: typeof config
  ) => {
    if (!Array.isArray(nextData) || nextData.length === 0) {
      return null;
    }

    const firstRow = nextData[0];
    if (!firstRow || typeof firstRow !== "object") {
      return null;
    }

    const keys = Object.keys(firstRow);
    if (keys.length < 2) {
      return null;
    }

    const xAxis =
      typeof nextConfig.xAxis === "string" && keys.includes(nextConfig.xAxis)
        ? nextConfig.xAxis
        : keys.includes("label")
          ? "label"
          : keys[0];

    const yAxisCandidate = Array.isArray(nextConfig.yAxis)
      ? nextConfig.yAxis[0]
      : nextConfig.yAxis;
    const yAxis =
      typeof yAxisCandidate === "string" && keys.includes(yAxisCandidate)
        ? yAxisCandidate
        : keys.includes("value")
          ? "value"
          : (keys.find((key) => key !== xAxis) ?? keys[1]);

    return {
      data: nextData,
      config: {
        ...nextConfig,
        xAxis,
        yAxis,
        color: nextConfig.color || theme.palette.primary.main,
      },
    };
  };

  // Load state from URL on mount
  useEffect(() => {
    const urlState = getStateFromUrl();
    if (urlState) {
      if (urlState.chartType) setChartType(urlState.chartType);
      const normalizedUrlState = normalizePlayableState(urlState.data ?? [], {
        xAxis: urlState.config?.xAxis ?? "",
        yAxis: urlState.config?.yAxis ?? "",
        color: urlState.config?.color ?? theme.palette.primary.main,
      });

      if (normalizedUrlState) {
        setData(normalizedUrlState.data);
        setConfig(normalizedUrlState.config);
      } else {
        loadDefaultDataset();
      }
      if (urlState.themeId) setThemeId(urlState.themeId);
    } else {
      const normalizedCurrentState = normalizePlayableState(data, config);

      if (normalizedCurrentState) {
        setConfig(normalizedCurrentState.config);
      } else {
        loadDefaultDataset();
      }
    }
  }, []);

  // Update color when theme changes
  useEffect(() => {
    const theme = getThemeById(themeId);
    if (theme) {
      setConfig({ ...config, color: theme.primary });
    }
  }, [themeId]);

  const title =
    locale === "sr" ? "🎮 Igralište za grafikone" : "🎮 Chart Playground";

  const description =
    locale === "sr"
      ? "Eksperimentišite sa konfiguracijom grafikona u realnom vremenu"
      : "Experiment with chart configurations in real-time";

  return (
    <>
      <Head>
        <title>{`Playground - Vizualni Admin`}</title>
        <meta name="description" content={description} />
      </Head>
      <DemoErrorBoundary>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ConfigPanel
                chartType={chartType}
                data={data}
                config={config}
                themeId={themeId}
                onChartTypeChange={setChartType}
                onDataChange={setData}
                onConfigChange={setConfig}
                onThemeChange={setThemeId}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Tabs value={ui.activeTab} onChange={(_, v) => setActiveTab(v)}>
                  <Tab
                    label={isSerbian ? "Pregled" : "Preview"}
                    value="preview"
                  />
                  <Tab label={isSerbian ? "Kod" : "Code"} value="code" />
                </Tabs>
              </Box>

              {ui.activeTab === "preview" ? (
                <PreviewPane
                  chartType={chartType}
                  data={data}
                  config={config}
                  height={450}
                />
              ) : (
                <CodeOutput chartType={chartType} data={data} config={config} />
              )}
            </Grid>
          </Grid>
        </Container>
      </DemoErrorBoundary>
    </>
  );
}
