import Head from "next/head";
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
import { useMemo, useState } from "react";

import { Header } from "@/components/header";
import { buildEmbedUrl, type EmbedLang, type EmbedTheme } from "@/lib/embed-url";
import CodeBlock from "@/components/tutorials/CodeBlock";

const baseEmbedUrl = "https://acailic.github.io/vizualni-admin/embed/demo";

export default function EmbedGeneratorPage() {
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("520px");
  const [theme, setTheme] = useState<EmbedTheme>("light");
  const [lang, setLang] = useState<EmbedLang>("en");

  const iframeSrc = useMemo(() => {
    return buildEmbedUrl(baseEmbedUrl, { theme, lang });
  }, [lang, theme]);

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
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 2, letterSpacing: "-0.02em" }}>
          Generate iframe code for vizualni-admin charts
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 800 }}>
          Customize size, theme, and language, then copy/paste the embed snippet. The demo endpoint is always available on
          GitHub Pages so you can verify embedding without provisioning a backend.
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
                    onChange={(e) => setTheme(e.target.value as "light" | "dark")}
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Paste this iframe into any site or CMS. The demo endpoint responds with a ready-to-embed chart and uses
                  iframe-resizer for responsive sizing.
                </Typography>
                <CodeBlock code={iframeSnippet} language="html" fileName="embed.html" maxLines={10} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
