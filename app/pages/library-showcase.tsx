import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";

import { Header } from "@/components/header";
import CodeBlock from "@/components/tutorials/CodeBlock";

const installSnippet = `# Install the npm package
npm install @acailic/vizualni-admin

# or with yarn
yarn add @acailic/vizualni-admin`;

const chartSnippet = `import { LineChart } from "@acailic/vizualni-admin";

const data = [
  { label: "2019", value: 72 },
  { label: "2020", value: 54 },
  { label: "2021", value: 63 },
  { label: "2022", value: 81 },
];

export function Example() {
  return (
    <LineChart
      data={data}
      xKey="label"
      yKey="value"
      title="Youth employment recovery"
      width={720}
      height={360}
      showCrosshair
      showTooltip
    />
  );
}`;

const columnSnippet = `import { ColumnChart } from "@acailic/vizualni-admin";

const data = [
  { year: "2019", jobs: 180 },
  { year: "2020", jobs: 140 },
  { year: "2021", jobs: 165 },
  { year: "2022", jobs: 190 },
];

export function EmploymentColumn() {
  return (
    <ColumnChart
      data={data}
      xKey="year"
      yKey="jobs"
      title="Jobs created per year"
      color="#0ea5e9"
      showTooltip
      showCrosshair
    />
  );
}`;

const pieSnippet = `import { PieChart } from "@acailic/vizualni-admin";

const data = [
  { label: "Solar", value: 18 },
  { label: "Wind", value: 22 },
  { label: "Hydro", value: 38 },
  { label: "Thermal", value: 22 },
];

export function EnergyMix() {
  return (
    <PieChart
      data={data}
      labelKey="label"
      valueKey="value"
      title="Electricity mix"
      showLegend
    />
  );
}`;

const dataPipelineSnippet = `import { LineChart } from "@acailic/vizualni-admin";
import { useDataGovRs } from "@acailic/vizualni-admin/hooks/use-data-gov-rs";
import { DataSampler } from "@acailic/vizualni-admin/lib/data/data-sampler";

const fallbackEmployment = [
  { year: "2019", rate: 12.1 },
  { year: "2020", rate: 15.4 },
  { year: "2021", rate: 13.8 },
  { year: "2022", rate: 11.2 },
];

const sampler = new DataSampler(42);

export function LiveEmploymentChart() {
  const { data = [], loading, usingFallback } = useDataGovRs({
    searchQuery: ["nezaposlenost", "employment"],
    preferredTags: ["trziste-rada"],
    fallbackData: fallbackEmployment,
    fallbackDatasetInfo: { title: "Employment demo fallback", organization: "data.gov.rs demo" },
  });

  const sampled = sampler.sample(data, { sampleSize: 300, preserveOrder: true });
  const series = sampled
    .map((row: any) => ({
      year: row.godina ?? row.year,
      rate: Number(row.stopanezaposlenosti ?? row.rate),
    }))
    .filter((row) => row.year && Number.isFinite(row.rate));

  return (
    <LineChart
      data={series}
      xKey="year"
      yKey="rate"
      title={usingFallback ? "Employment (demo data)" : "Employment (live data.gov.rs)"}
      height={360}
      showTooltip
      showCrosshair
    />
  );
}`;

const embedSnippet = `<!-- Drop this into any page to embed a published chart -->
<iframe
  src="https://acailic.github.io/vizualni-admin/embed/{chartId}"
  style="width: 100%; height: 520px; border: 0;"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>`;

const demoLinks = [
  { title: "Air quality", href: "/demos/air-quality", tags: ["data.gov.rs", "AQI"] },
  { title: "Employment", href: "/demos/employment", tags: ["labor", "trend"] },
  { title: "Healthcare", href: "/demos/healthcare", tags: ["capacity", "staffing"] },
  { title: "Energy mix", href: "/demos/energy", tags: ["power", "mix"] },
  { title: "Digital skills", href: "/demos/digital", tags: ["education", "skills"] },
  { title: "Transport", href: "/demos/transport", tags: ["ridership", "recovery"] },
];

export default function LibraryShowcasePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Head>
        <title>vizualni-admin library showcase</title>
        <meta
          name="description"
          content="See vizualni-admin components in action, copy ready-made chart recipes, and generate embed code for GitHub Pages or any site."
        />
        <meta property="og:title" content="vizualni-admin library showcase" />
        <meta
          property="og:description"
          content="Interactive charts, data pipelines, and embed examples for the @acailic/vizualni-admin package."
        />
        <meta property="og:type" content="website" />
      </Head>
      <Header />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
              npm library · @acailic/vizualni-admin
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 2, letterSpacing: "-0.02em" }}>
              Build, embed, and share Serbian open data visuals
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 760 }}>
              Use the published package to drop high-quality charts into any React app. The GitHub Pages
              build shows the same components in action—interactive charts, theming, i18n, and data
              fallbacks for reliable demos.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button component={Link} href="/demos" variant="contained" size="large">
                Explore live demos
              </Button>
              <Button
                component={Link}
                href="https://www.npmjs.com/package/@acailic/vizualni-admin"
                variant="outlined"
                size="large"
                target="_blank"
                rel="noreferrer"
              >
                View on npm
              </Button>
              <Button component={Link} href="/embed" variant="outlined" size="large">
                Generate embed code
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Quickstart
                </Typography>
                <CodeBlock code={installSnippet} language="bash" fileName="install.sh" maxLines={8} />
                <Box sx={{ mt: 2 }}>
                  <CodeBlock code={chartSnippet} language="tsx" fileName="Example.tsx" maxLines={16} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            What the GH Pages build demonstrates
          </Typography>
          <Grid container spacing={2}>
            {[
              { title: "Chart gallery", desc: "Line, column, pie, area, and dashboard layouts with shared theming." },
              { title: "Data connectors", desc: "CKAN/data.gov.rs fetch with graceful fallbacks for static hosting." },
              { title: "i18n and accessibility", desc: "Serbian/English copy, focus states, ARIA labels, keyboard navigation." },
              { title: "Embeds", desc: "Publish and drop charts into any site with an iframe-friendly endpoint." },
              { title: "Playground-ready", desc: "Configurable props for tooltips, crosshair, legends, and responsive sizing." },
              { title: "Static export", desc: "Pages are pre-rendered for GitHub Pages while keeping interactive behavior." },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Component recipes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Line chart (fast start)
                  </Typography>
                  <CodeBlock code={chartSnippet} language="tsx" fileName="LineChart.tsx" maxLines={16} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Column chart with tooltip/crosshair
                  </Typography>
                  <CodeBlock code={columnSnippet} language="tsx" fileName="ColumnChart.tsx" maxLines={16} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Pie chart with legend
                  </Typography>
                  <CodeBlock code={pieSnippet} language="tsx" fileName="PieChart.tsx" maxLines={16} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Live data pipeline (data.gov.rs → sample → chart)
          </Typography>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Client-side fetch with graceful fallback for GitHub Pages, plus sampling to keep charts responsive even on
                large datasets.
              </Typography>
              <CodeBlock code={dataPipelineSnippet} language="tsx" fileName="LiveEmploymentChart.tsx" maxLines={22} />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Try it live on GitHub Pages
          </Typography>
          <Grid container spacing={2}>
            {demoLinks.map((demo) => (
              <Grid item xs={12} md={4} key={demo.href}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      <Link href={demo.href}>{demo.title}</Link>
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {demo.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Embed anywhere
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Publish a chart and use the embed endpoint to drop it into portals, blogs, or dashboards. The demo build
                    stays iframe-safe so your consumers do not need a React runtime.
                  </Typography>
                  <CodeBlock code={embedSnippet} language="html" fileName="embed.html" maxLines={8} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Build your own flow
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    The same components used in the demos are available in the npm package. Fetch data, sample it, and feed
                    it into charts with tooltips, crosshairs, legends, and responsive sizing configured via props.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button component={Link} href="/demos/showcase" variant="contained">
                      View component showcase
                    </Button>
                    <Button component={Link} href="/demos" variant="outlined">
                      Browse all demos
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
