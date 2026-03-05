import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
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

// Params that are UI-only and should not be passed through to embed
const EXCLUDED_PARAMS = new Set(["theme", "lang", "width", "height"]);

export default function EmbedGeneratorPage() {
  const router = useRouter();
  const locale = useLocale();
  const defaultLang: EmbedLang = locale === "en" ? "en" : "sr";
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("520px");
  const [theme, setTheme] = useState<EmbedTheme>("light");
  const [lang, setLang] = useState<EmbedLang>(defaultLang);

  useEffect(() => {
    setLang(defaultLang);
  }, [defaultLang]);

  const baseEmbedUrl = useMemo(() => {
    const embedPath = `${PUBLIC_URL}/embed/demo`.replace(/\/{2,}/g, "/");
    if (typeof window === "undefined") {
      return embedPath;
    }
    return `${window.location.origin}${embedPath.startsWith("/") ? embedPath : `/${embedPath}`}`;
  }, []);

  const passthroughParams = useMemo(() => {
    // Exclude UI-only params, pass through chart params (type, dataset, dataSource, etc.)
    return Object.fromEntries(
      Object.entries(router.query)
        .filter(([key]) => !EXCLUDED_PARAMS.has(key))
        .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
    );
  }, [router.query]);

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
        <title>Embed | vizualni-admin</title>
        <meta
          name="description"
          content="Generate iframe embed code for vizualni-admin charts with theme and language toggles. Copy/paste into any site or CMS."
        />
        <meta property="og:title" content="Embed vizualni-admin charts" />
        <meta
          property="og:description"
          content="Customize size, theme, and language, then copy/paste the iframe embed snippet."
        />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
          Embeds
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, mt: 1, mb: 2, letterSpacing: "-0.02em" }}
        >
          Generate iframe code for vizualni-admin charts
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 800 }}
        >
          Customize size, theme, and language, then copy/paste the embed
          snippet. Chart settings from the current URL (for example `type`,
          `dataset`, `dataSource`) are included automatically.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card variant="outlined">
              <CardHeader title="Settings" subheader="Tweak embed parameters" />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    helperText='Any CSS length (e.g., "100%" or "720px")'
                  />
                  <TextField
                    label="Height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    helperText='Any CSS length (e.g., "520px")'
                  />
                  <TextField
                    select
                    label="Theme"
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
                    label="Language"
                    value={lang}
                    onChange={(e) => setLang(e.target.value as "en" | "sr")}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="sr">Serbian</MenuItem>
                  </TextField>
                  {/* Show current passthrough params */}
                  {Object.keys(passthroughParams).length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Chart params from URL:
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
                              {key}: {value}
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
                    Preview embed
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Copy embed code
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Paste this iframe into any site or CMS. The generated `src`
                  mirrors the selected chart parameters and locale/theme
                  options.
                </Typography>
                <CodeBlock
                  code={iframeSnippet}
                  language="html"
                  fileName="embed.html"
                  maxLines={10}
                />

                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Inline preview
                  </Typography>
                  <Box
                    component="iframe"
                    title="Embed preview"
                    src={iframeSrc}
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
