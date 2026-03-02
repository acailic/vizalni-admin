import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Container, Grid, Box, Typography, Tabs, Tab } from "@mui/material";
import Head from "next/head";
import { useEffect } from "react";

import { CodeOutput } from "./_components/CodeOutput";
import { ConfigPanel } from "./_components/ConfigPanel";
import { PreviewPane } from "./_components/PreviewPane";
import { SAMPLE_DATASETS, getThemeById } from "./_constants";
import { usePlaygroundStore } from "./_hooks/usePlaygroundStore";
import { useUrlState } from "./_hooks/useUrlState";

export default function PlaygroundPage() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

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

  // Load state from URL on mount
  useEffect(() => {
    const urlState = getStateFromUrl();
    if (urlState) {
      if (urlState.chartType) setChartType(urlState.chartType);
      if (urlState.data) setData(urlState.data);
      if (urlState.config) setConfig(urlState.config);
      if (urlState.themeId) setThemeId(urlState.themeId);
    } else if (data.length === 0) {
      // Load default dataset
      setData(SAMPLE_DATASETS.sales.data);
      setConfig({ xAxis: "label", yAxis: "value", color: "#6366f1" });
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
                <Tab label={<Trans>Preview</Trans>} value="preview" />
                <Tab label={<Trans>Code</Trans>} value="code" />
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
    </>
  );
}
