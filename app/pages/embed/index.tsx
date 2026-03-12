import {
  Alert,
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
  buildEmbedPassthroughParams,
  buildIframeSnippet,
  DEFAULT_LAYOUT_PARAMS,
  EMBED_LAYOUT_PARAMS,
  type EmbedLayoutParam,
  resolveEmbedStateFromQuery,
} from "@/lib/embed-generator";
import {
  buildEmbedUrl,
  type EmbedLang,
  type EmbedTheme,
} from "@/lib/embed-url";
import { useLocale } from "@/locales/use-locale";

const LAYOUT_PARAM_LABELS: Record<EmbedLayoutParam, string> = {
  removeBorder: "Remove border",
  optimizeSpace: "Optimize space",
  removeMoreOptionsButton: "Remove more options button",
  removeLabelsInteractivity: "Disable label interactivity",
  removeFootnotes: "Remove footnotes",
  removeFilters: "Remove filters",
};

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
  const [isInitializedFromUrl, setIsInitializedFromUrl] = useState(false);

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

  // Respect UI params from URL when available.
  useEffect(() => {
    const nextState = resolveEmbedStateFromQuery(resolvedQuery, defaultLang);
    setLang(nextState.lang);
    setTheme(nextState.theme);
    setWidth(nextState.width);
    setHeight(nextState.height);
    setChartType(nextState.chartType);
    setDataset(nextState.dataset);
    setDataSource(nextState.dataSource);
    setLayoutParams(nextState.layoutParams);
    setIsInitializedFromUrl(true);
  }, [
    defaultLang,
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

  const effectiveWidth = isInitializedFromUrl
    ? width
    : resolvedQuery.width?.trim() || width;
  const effectiveHeight = isInitializedFromUrl
    ? height
    : resolvedQuery.height?.trim() || height;
  const effectiveTheme =
    isInitializedFromUrl ||
    !(resolvedQuery.theme === "light" || resolvedQuery.theme === "dark")
      ? theme
      : (resolvedQuery.theme as EmbedTheme);
  const effectiveLang =
    isInitializedFromUrl ||
    !(resolvedQuery.lang === "en" || resolvedQuery.lang === "sr")
      ? lang
      : (resolvedQuery.lang as EmbedLang);
  const effectiveChartType = isInitializedFromUrl
    ? chartType
    : resolvedQuery.type?.trim() || chartType;
  const effectiveDataset = isInitializedFromUrl
    ? dataset
    : (resolvedQuery.dataset ?? dataset);
  const effectiveDataSource = isInitializedFromUrl
    ? dataSource
    : (resolvedQuery.dataSource ?? dataSource);
  const effectiveLayoutParams = isInitializedFromUrl
    ? layoutParams
    : resolveEmbedStateFromQuery(resolvedQuery, defaultLang).layoutParams;

  const isSerbian = effectiveLang === "sr";

  const labels = {
    overline: isSerbian ? "Ugrađivanje" : "Embeds",
    heading: isSerbian
      ? "Generišite iframe kod za vizualni-admin grafikone"
      : "Generate iframe code for vizualni-admin charts",
    subheading: isSerbian
      ? "Prilagodite veličinu, temu, jezik, parametre grafikona i opcije rasporeda, zatim kopirajte kod za ugrađivanje."
      : "Customize size, theme, language, chart params, and layout options, then copy/paste the embed snippet. The preview is embedded on this same screen and updates live.",
    settingsTitle: isSerbian ? "Podešavanja" : "Settings",
    settingsSub: isSerbian
      ? "Podesite parametre iframe-a. Jezik u vrhu stranice menja samo interfejs generatora."
      : "Configure the iframe parameters. The language picker in the header only changes the generator UI.",
    widthLabel: isSerbian ? "Širina" : "Width",
    widthHelper: isSerbian
      ? 'Bilo koja CSS dužina (npr. "100%" ili "720px")'
      : 'Any CSS length (e.g., "100%" or "720px")',
    heightLabel: isSerbian ? "Visina" : "Height",
    heightHelper: isSerbian
      ? 'Bilo koja CSS dužina (npr. "520px")'
      : 'Any CSS length (e.g., "520px")',
    themeLabel: isSerbian ? "Tema embed-a" : "Embed theme",
    languageLabel: isSerbian ? "Jezik embed-a" : "Embed language",
    localeNote: isSerbian
      ? "Zaglavlje kontroliše jezik generatora. Ovo polje menja jezik grafikona unutar iframe-a."
      : "The header controls the generator language. This field controls the language rendered inside the iframe.",
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
    copiedLabel: isSerbian ? "Kod je kopiran." : "Embed code copied.",
    targetRoute: isSerbian ? "Ciljna ruta" : "Target route",
    inlinePreview: isSerbian ? "Pregled uživo" : "Inline preview",
    paramsInUrl: isSerbian ? "Parametri u URL-u:" : "Parameters in embed URL:",
    staticBannerTitle: isSerbian
      ? "Generator i ugrađeni prikaz mogu koristiti različite jezike."
      : "The generator UI and the embedded chart can use different languages.",
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
    return buildEmbedPassthroughParams({
      chartType: effectiveChartType,
      dataset: effectiveDataset,
      dataSource: effectiveDataSource,
      layoutParams: effectiveLayoutParams,
      resolvedQuery,
    });
  }, [
    effectiveChartType,
    effectiveDataSource,
    effectiveDataset,
    effectiveLayoutParams,
    resolvedQuery,
  ]);

  const iframeSrc = useMemo(() => {
    return buildEmbedUrl(baseEmbedUrl, {
      theme: effectiveTheme,
      lang: effectiveLang,
      params: passthroughParams,
    });
  }, [baseEmbedUrl, effectiveLang, effectiveTheme, passthroughParams]);

  const iframeSnippet = useMemo(
    () =>
      buildIframeSnippet({
        iframeSrc,
        width: effectiveWidth,
        height: effectiveHeight,
        removeBorder: effectiveLayoutParams.removeBorder,
        optimizeSpace: effectiveLayoutParams.optimizeSpace,
      }),
    [
      effectiveHeight,
      effectiveLayoutParams.optimizeSpace,
      effectiveLayoutParams.removeBorder,
      effectiveWidth,
      iframeSrc,
    ]
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
                  <Alert severity="info" variant="outlined">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {labels.staticBannerTitle}
                    </Typography>
                    <Typography variant="body2">{labels.localeNote}</Typography>
                  </Alert>
                  <TextField
                    label={labels.widthLabel}
                    value={effectiveWidth}
                    onChange={(e) => setWidth(e.target.value)}
                    helperText={labels.widthHelper}
                  />
                  <TextField
                    label={labels.heightLabel}
                    value={effectiveHeight}
                    onChange={(e) => setHeight(e.target.value)}
                    helperText={labels.heightHelper}
                  />
                  <TextField
                    select
                    label={labels.themeLabel}
                    value={effectiveTheme}
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
                    value={effectiveLang}
                    onChange={(e) => setLang(e.target.value as "en" | "sr")}
                    helperText={labels.localeNote}
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
                    value={effectiveChartType}
                    onChange={(e) => setChartType(e.target.value)}
                    helperText={labels.chartTypeHelper}
                  />
                  <TextField
                    label={labels.datasetLabel}
                    value={effectiveDataset}
                    onChange={(e) => setDataset(e.target.value)}
                    helperText={labels.datasetHelper}
                  />
                  <TextField
                    label={labels.dataSourceLabel}
                    value={effectiveDataSource}
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
                            checked={effectiveLayoutParams[param]}
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
                  copiedLabel={labels.copiedLabel}
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
                      width: effectiveWidth,
                      height: effectiveHeight,
                      border: effectiveLayoutParams.removeBorder
                        ? 0
                        : "1px solid",
                      borderColor: effectiveLayoutParams.removeBorder
                        ? "transparent"
                        : "divider",
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
