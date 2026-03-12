/**
 * Interactive Chart Playground
 *
 * A page where users can experiment with chart configurations
 * using all the playground components. Features live preview,
 * customization options, and sharing capabilities.
 *
 * @route /playground
 */

import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";

import { ChartPreview } from "@/components/playground/chart-preview";
import { ChartTypeSelector } from "@/components/playground/chart-type-selector";
import { ColorPicker } from "@/components/playground/color-picker";
import { DataInput } from "@/components/playground/data-input";
import { LabelEditor } from "@/components/playground/label-editor";
import { SharePanel } from "@/components/playground/share-panel";
import { usePlaygroundState } from "@/hooks/use-playground-state";

/**
 * Control Panel Section wrapper component
 */
interface ControlSectionProps {
  title: string;
  children: React.ReactNode;
}

const ControlSection = ({ title, children }: ControlSectionProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          mb: 1.5,
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

/**
 * Interactive Chart Playground Page
 *
 * Split-screen layout:
 * - Left: Chart preview (60% width on desktop)
 * - Right: Control panel with customization options (40% width on desktop)
 * - Mobile: Stacked vertically
 */
const PlaygroundPage: NextPage = () => {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const {
    state,
    updateState,
    resetState,
    getShareUrl,
    getEmbedCode,
    isLoaded,
  } = usePlaygroundState();

  // Handle label changes
  const handleLabelsChange = (labels: {
    title?: string;
    subtitle?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
  }) => {
    updateState(labels);
  };

  // Show loading state while URL state is being loaded
  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const pageTitle =
    locale === "sr" ? "Igralište za grafikone" : "Chart Playground";
  const pageDescription =
    locale === "sr"
      ? "Eksperimentišite sa konfiguracijom grafikona u realnom vremenu. Prilagodite tip, boje, oznake i podatke."
      : "Experiment with chart configurations in real-time. Customize type, colors, labels, and data.";

  return (
    <>
      <Head>
        <title>{pageTitle} - Vizualni Admin</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            {pageTitle}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {pageDescription}
          </Typography>
        </Box>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 4 }}>
          {locale === "sr" ? (
            <>
              <strong>Kako koristiti:</strong> Prilagodite grafikon koristeći
              kontrole sa desne strane. Promene se primenjuju odmah. Koristite
              panel za deljenje da biste dobili link ili kod za ugradnju.
            </>
          ) : (
            <>
              <strong>How to use:</strong> Customize the chart using the
              controls on the right. Changes are applied instantly. Use the
              share panel to get a link or embed code.
            </>
          )}
        </Alert>

        {/* Main Content - Split Screen Layout */}
        <Grid container spacing={3}>
          {/* Left Panel: Chart Preview (60%) */}
          <Grid item xs={12} lg={7}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                minHeight: 500,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600}>
                <Trans>Chart Preview</Trans>
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flex: 1 }}>
                <ChartPreview state={state} />
              </Box>
            </Paper>
          </Grid>

          {/* Right Panel: Control Panel (40%) */}
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                <Trans>Customization</Trans>
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Chart Type Selector */}
              <ControlSection
                title={locale === "sr" ? "Tip grafikona" : "Chart Type"}
              >
                <ChartTypeSelector
                  value={state.chartType}
                  onChange={(type) => updateState({ chartType: type })}
                />
              </ControlSection>

              <Divider sx={{ my: 2 }} />

              {/* Label Editor */}
              <ControlSection title={locale === "sr" ? "Oznake" : "Labels"}>
                <LabelEditor
                  title={state.title}
                  subtitle={state.subtitle}
                  xAxisLabel={state.xAxisLabel}
                  yAxisLabel={state.yAxisLabel}
                  onChange={handleLabelsChange}
                />
              </ControlSection>

              <Divider sx={{ my: 2 }} />

              {/* Color Picker */}
              <ControlSection title={locale === "sr" ? "Boje" : "Colors"}>
                <ColorPicker
                  value={state.colors}
                  onChange={(colors) => updateState({ colors })}
                />
              </ControlSection>

              <Divider sx={{ my: 2 }} />

              {/* Data Input */}
              <ControlSection title={locale === "sr" ? "Podaci" : "Data"}>
                <DataInput
                  value={state.data}
                  onChange={(data) => updateState({ data })}
                />
              </ControlSection>

              <Divider sx={{ my: 2 }} />

              {/* Share Panel */}
              <ControlSection title={locale === "sr" ? "Deljenje" : "Share"}>
                <SharePanel
                  getShareUrl={getShareUrl}
                  getEmbedCode={getEmbedCode}
                />
              </ControlSection>

              {/* Reset Button */}
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Card sx={{ width: "100%" }}>
                    <CardContent sx={{ py: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {locale === "sr"
                          ? "Vrati na podrazumevane vrednosti"
                          : "Reset to defaults"}
                      </Typography>
                      <Box
                        component="button"
                        onClick={resetState}
                        sx={{
                          padding: "8px 16px",
                          backgroundColor: "transparent",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontSize: "0.875rem",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        {locale === "sr" ? "Resetuj" : "Reset"}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Usage Instructions */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {locale === "sr" ? "Uputstvo za korišćenje" : "How to Use"}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              {locale === "sr" ? (
                <ol style={{ margin: 0, paddingLeft: 20 }}>
                  <li>
                    Izaberite tip grafikona (linijski, stubicasti, piticu, itd.)
                  </li>
                  <li>Unesite naslov i podnaslov za grafikon</li>
                  <li>Izaberite palete boja ili dodajte prilagođene boje</li>
                  <li>Unesite podatke u CSV ili JSON formatu</li>
                  <li>Kopirajte link za deljenje ili kod za ugradnju</li>
                </ol>
              ) : (
                <ol style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Select a chart type (line, bar, pie, etc.)</li>
                  <li>Enter a title and subtitle for your chart</li>
                  <li>Choose color palettes or add custom colors</li>
                  <li>Enter data in CSV or JSON format</li>
                  <li>Copy the share link or embed code</li>
                </ol>
              )}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default PlaygroundPage;
