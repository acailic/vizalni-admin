import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { Header } from "@/components/header";
import CodeBlock from "@/components/tutorials/CodeBlock";
import { PUBLIC_URL } from "@/domain/env";
import {
  buildEmbedUrl,
  type EmbedLang,
  type EmbedTheme,
} from "@/lib/embed-url";
import { useLocale } from "@/locales/use-locale";

const UI_ONLY_PARAMS = new Set(["theme", "lang", "width", "height"]);
const CHART_PARAMS = new Set(["type", "dataset", "dataSource"]);
const EMBED_LAYOUT_PARAMS = [
  "removeBorder",
  "optimizeSpace",
  "removeMoreOptionsButton",
  "removeLabelsInteractivity",
  "removeFootnotes",
  "removeFilters",
] as const;
type EmbedLayoutParam = (typeof EMBED_LAYOUT_PARAMS)[number];

const DEFAULT_LAYOUT_PARAMS: Record<EmbedLayoutParam, boolean> = {
  removeBorder: false,
  optimizeSpace: false,
  removeMoreOptionsButton: false,
  removeLabelsInteractivity: false,
  removeFootnotes: false,
  removeFilters: false,
};

const LAYOUT_PARAM_LABELS: Record<EmbedLayoutParam, string> = {
  removeBorder: "Remove border",
  optimizeSpace: "Optimize space",
  removeMoreOptionsButton: "Remove more options button",
  removeLabelsInteractivity: "Disable label interactivity",
  removeFootnotes: "Remove footnotes",
  removeFilters: "Remove filters",
};

const FORM_MANAGED_PARAMS = new Set([
  ...UI_ONLY_PARAMS,
  ...CHART_PARAMS,
  ...EMBED_LAYOUT_PARAMS,
]);

export default function EmbedGeneratorPage() {
  const router = useRouter();
  const locale = useLocale();
  // Default to Serbian if locale is any Serbian variant, otherwise English
  const defaultLang: EmbedLang = locale === "en" ? "en" : "sr";
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("520px");
  const [theme, setTheme] = useState<EmbedTheme>("light");
  const [lang, setLang] = useState<EmbedLang>(defaultLang);
  const [chartType, setChartType] = useState("line");
  const [dataset, setDataset] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [layoutParams, setLayoutParams] = useState<
    Record<EmbedLayoutParam, boolean>
  >(() => ({ ...DEFAULT_LAYOUT_PARAMS }));

  const resolvedQuery = useMemo<Record<string, string>>(() => {
    const queryFromRouter = Object.fromEntries(
      Object.entries(router.query)
        .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        .filter(
          (entry): entry is [string, string] =>
            typeof entry[1] === "string" && entry[1].trim() !== ""
        )
    );

    if (typeof window === "undefined") {
      return queryFromRouter;
    }

    const [, rawSearch = ""] = router.asPath.split("?");
    const search =
      rawSearch.trim() !== "" ? rawSearch : window.location.search.slice(1);
    const queryFromSearch = Object.fromEntries(
      Array.from(new URLSearchParams(search).entries()).filter(
        ([, value]) => value.trim() !== ""
      )
    );

    return { ...queryFromSearch, ...queryFromRouter };
  }, [router.asPath, router.query]);

  // Update lang when locale changes
  useEffect(() => {
    setLang(defaultLang);
  }, [defaultLang]);

  // Respect UI params from URL when available.
  useEffect(() => {
    const urlLang = resolvedQuery.lang;
    const urlTheme = resolvedQuery.theme;
    const urlWidth = resolvedQuery.width;
    const urlHeight = resolvedQuery.height;
    const urlType = resolvedQuery.type;
    const urlDataset = resolvedQuery.dataset;
    const urlDataSource = resolvedQuery.dataSource;

    if (urlLang === "en" || urlLang === "sr") {
      setLang(urlLang);
    }
    if (urlTheme === "light" || urlTheme === "dark") {
      setTheme(urlTheme);
    }
    if (urlWidth && urlWidth.trim() !== "") {
      setWidth(urlWidth);
    }
    if (urlHeight && urlHeight.trim() !== "") {
      setHeight(urlHeight);
    }
    setChartType(urlType && urlType.trim() !== "" ? urlType : "line");
    setDataset(urlDataset ?? "");
    setDataSource(urlDataSource ?? "");
    setLayoutParams({
      removeBorder: resolvedQuery.removeBorder === "true",
      optimizeSpace: resolvedQuery.optimizeSpace === "true",
      removeMoreOptionsButton: resolvedQuery.removeMoreOptionsButton === "true",
      removeLabelsInteractivity:
        resolvedQuery.removeLabelsInteractivity === "true",
      removeFootnotes: resolvedQuery.removeFootnotes === "true",
      removeFilters: resolvedQuery.removeFilters === "true",
    });
  }, [
    resolvedQuery.dataSource,
    resolvedQuery.dataset,
    resolvedQuery.height,
    resolvedQuery.lang,
    resolvedQuery.removeBorder,
    resolvedQuery.removeFilters,
    resolvedQuery.removeFootnotes,
    resolvedQuery.removeLabelsInteractivity,
    resolvedQuery.removeMoreOptionsButton,
    resolvedQuery.optimizeSpace,
    resolvedQuery.theme,
    resolvedQuery.type,
    resolvedQuery.width,
  ]);

  const isSerbian = lang === "sr";

  const labels = {
    overline: isSerbian ? "Ugrađivanje" : "Embeds",
    heading: isSerbian
      ? "Generišite iframe kod za vizualni-admin grafikone"
      : "Generate iframe code for vizualni-admin charts",
    subheading: isSerbian
      ? "Prilagodite veličinu, temu, jezik, parametre grafikona i opcije rasporeda, zatim kopirajte kod za ugrađivanje."
      : "Customize size, theme, language, chart params, and layout options, then copy/paste the embed snippet. The preview is embedded on this same screen and updates live.",
    settingsTitle: isSerbian ? "Podešavanja" : "Settings",
    settingsSub: isSerbian ? "Podesite parametre" : "Tweak embed parameters",
    widthLabel: isSerbian ? "Širina" : "Width",
    widthHelper: isSerbian
      ? 'Bilo koja CSS dužina (npr. "100%" ili "720px")'
      : 'Any CSS length (e.g., "100%" or "720px")',
    heightLabel: isSerbian ? "Visina" : "Height",
    heightHelper: isSerbian
      ? 'Bilo koja CSS dužina (npr. "520px")'
      : 'Any CSS length (e.g., "520px")',
    themeLabel: isSerbian ? "Tema" : "Theme",
    languageLabel: isSerbian ? "Jezik" : "Language",
    chartParamsTitle: isSerbian ? "Parametri grafikona" : "Chart parameters",
    chartTypeLabel: isSerbian ? "Tip grafikona" : "Chart type",
    chartTypeHelper: isSerbian
      ? 'Primeri: "bar", "line", "column", "pie"'
      : 'Examples: "bar", "line", "column", "pie"',
    datasetLabel: isSerbian ? "Skup podataka" : "Dataset",
    datasetHelper: isSerbian
      ? 'Primeri: "age", "budget", "air"'
      : 'Examples: "age", "budget", "air"',
    dataSourceLabel: isSerbian ? "Izvor podataka" : "Data source",
    dataSourceHelper: isSerbian ? 'Primer: "Prod"' : 'Example: "Prod"',
    layoutTitle: isSerbian ? "Opcije rasporeda" : "Layout options",
    previewButton: isSerbian ? "Pregled ugrađenog" : "Preview embed",
    copyTitle: isSerbian ? "Kopirajte kod za ugrađivanje" : "Copy embed code",
    copyDescription: isSerbian
      ? "Zalepite ovaj iframe u bilo koji sajt ili CMS."
      : "Paste this iframe into any site or CMS. The generated `src` mirrors the selected chart parameters and locale/theme options.",
    targetRoute: isSerbian ? "Ciljna ruta" : "Target route",
    inlinePreview: isSerbian ? "Pregled uživo" : "Inline preview",
    paramsInUrl: isSerbian ? "Parametri u URL-u:" : "Parameters in embed URL:",
  };

  const layoutParamLabels: Record<EmbedLayoutParam, string> = isSerbian
    ? {
        removeBorder: "Ukloni okvir",
        optimizeSpace: "Optimizuj prostor",
        removeMoreOptionsButton: "Ukloni dugme za više opcija",
        removeLabelsInteractivity: "Onemogući interaktivnost oznaka",
        removeFootnotes: "Ukloni fusnote",
        removeFilters: "Ukloni filtere",
      }
    : LAYOUT_PARAM_LABELS;

  const embedPreviewPath = useMemo(() => {
    // Keep generator preview pinned to a stable embed-safe route.
    // Dynamic chart routes are not pre-rendered in static builds.
    return `${PUBLIC_URL}/embed/demo`.replace(/\/{2,}/g, "/");
  }, []);

  const baseEmbedUrl = useMemo(() => {
    const embedPath = embedPreviewPath;
    if (typeof window === "undefined") {
      return embedPath;
    }
    return `${window.location.origin}${embedPath.startsWith("/") ? embedPath : `/${embedPath}`}`;
  }, [embedPreviewPath]);

  const passthroughParams = useMemo(() => {
    const additionalParams = Object.fromEntries(
      Object.entries(resolvedQuery)
        .filter(([key]) => !FORM_MANAGED_PARAMS.has(key))
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
    );

    const fromForm: Record<string, string> = {
      ...additionalParams,
    };

    if (chartType.trim() !== "") {
      fromForm.type = chartType.trim();
    }
    if (dataset.trim() !== "") {
      fromForm.dataset = dataset.trim();
    }
    if (dataSource.trim() !== "") {
      fromForm.dataSource = dataSource.trim();
    }

    EMBED_LAYOUT_PARAMS.forEach((param) => {
      if (layoutParams[param]) {
        fromForm[param] = "true";
      }
    });

    return fromForm;
  }, [chartType, dataSource, dataset, layoutParams, resolvedQuery]);

  const iframeSrc = useMemo(() => {
    return buildEmbedUrl(baseEmbedUrl, {
      theme,
      lang,
      params: passthroughParams,
    });
  }, [baseEmbedUrl, lang, passthroughParams, theme]);

  const iframeSnippet = useMemo(
    () => `<iframe
  src="${iframeSrc}"
  style="width: ${width}; height: ${height}; border: 0;"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>`,
    [height, iframeSrc, width]
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Head>
        <title>{isSerbian ? "Ugrađivanje" : "Embed"} | vizualni-admin</title>
        <meta name="description" content={labels.subheading} />
        <meta property="og:title" content={labels.overline} />
        <meta property="og:description" content={labels.subheading} />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
          {labels.overline}
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, mt: 1, mb: 2, letterSpacing: "-0.02em" }}
        >
          {labels.heading}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 800 }}
        >
          {labels.subheading}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card variant="outlined">
              <CardHeader
                title={labels.settingsTitle}
                subheader={labels.settingsSub}
              />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label={labels.widthLabel}
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    helperText={labels.widthHelper}
                  />
                  <TextField
                    label={labels.heightLabel}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    helperText={labels.heightHelper}
                  />
                  <TextField
                    select
                    label={labels.themeLabel}
                    value={theme}
                    onChange={(e) =>
                      setTheme(e.target.value as "light" | "dark")
                    }
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                  </TextField>
                  <TextField
                    select
                    label={labels.languageLabel}
                    value={lang}
                    onChange={(e) => setLang(e.target.value as "en" | "sr")}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="sr">Serbian</MenuItem>
                  </TextField>
                  <Divider />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {labels.chartParamsTitle}
                  </Typography>
                  <TextField
                    label={labels.chartTypeLabel}
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    helperText={labels.chartTypeHelper}
                  />
                  <TextField
                    label={labels.datasetLabel}
                    value={dataset}
                    onChange={(e) => setDataset(e.target.value)}
                    helperText={labels.datasetHelper}
                  />
                  <TextField
                    label={labels.dataSourceLabel}
                    value={dataSource}
                    onChange={(e) => setDataSource(e.target.value)}
                    helperText={labels.dataSourceHelper}
                  />
                  <Divider />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {labels.layoutTitle}
                  </Typography>
                  <FormGroup>
                    {EMBED_LAYOUT_PARAMS.map((param) => (
                      <FormControlLabel
                        key={param}
                        control={
                          <Checkbox
                            checked={layoutParams[param]}
                            onChange={(e) =>
                              setLayoutParams((prev) => ({
                                ...prev,
                                [param]: e.target.checked,
                              }))
                            }
                          />
                        }
                        label={layoutParamLabels[param]}
                      />
                    ))}
                  </FormGroup>

                  {/* Show current params that will be included in embed URL */}
                  {Object.keys(passthroughParams).length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {labels.paramsInUrl}
                      </Typography>
                      <Box
                        sx={{
                          mt: 0.5,
                          p: 1,
                          backgroundColor: "grey.100",
                          borderRadius: 1,
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                        }}
                      >
                        {Object.entries(passthroughParams).map(
                          ([key, value]) => (
                            <Box key={key}>
                              {key}: {String(value)}
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    href={iframeSrc}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {labels.previewButton}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  {labels.copyTitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {labels.copyDescription}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {labels.targetRoute}: <code>{embedPreviewPath}</code>
                </Typography>
                <CodeBlock
                  code={iframeSnippet}
                  language="html"
                  fileName="embed.html"
                  maxLines={10}
                  copyLabel={labels.copyTitle}
                />

                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {labels.inlinePreview}
                  </Typography>
                  <Box
                    component="iframe"
                    title="Embed preview"
                    src={iframeSrc}
                    sandbox="allow-scripts allow-same-origin"
                    referrerPolicy="no-referrer"
                    sx={{
                      width,
                      height,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      maxWidth: "100%",
                      bgcolor: "background.paper",
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
