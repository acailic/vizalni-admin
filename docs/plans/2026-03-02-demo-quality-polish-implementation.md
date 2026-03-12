# Demo Pages Quality Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Polish all demo and topics pages for visual consistency,
interactivity, and professional appearance.

**Architecture:** Four focused improvements: (1) Make pitch cards clickable, (2)
Add DemoLayout to playground, (3) Add hero sections to topics pages, (4)
Standardize visual styling across all pages.

**Tech Stack:** Next.js, MUI (Material-UI), Lingui i18n

---

## Task 1: Make Pitch Cards Clickable

**Files:**

- Modify: `app/pages/demos/pitch/index.tsx`

**Step 1: Wrap Card in Link component**

Add Link wrapper around each Card and add View Demo button.

Find the Card component around line 102-159 and replace the entire Grid item
with:

```tsx
<Grid item xs={12} sm={6} md={4} key={demo.id}>
  <Link href={`/demos/${demo.id}`} passHref legacyBehavior>
    <Card
      component="a"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        cursor: "pointer",
        textDecoration: "none",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(99, 102, 241, 0.25)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
          opacity: 1,
        },
      }}
    >
      <CardContent
        sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            fontSize: "2.5rem",
            mb: 2,
            textAlign: "center",
            p: 1.5,
            borderRadius: 2,
            background: alpha("#6366f1", 0.08),
            display: "inline-block",
          }}
        >
          {demo.icon}
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 1.5, lineHeight: 1.3 }}
        >
          {demo.title[locale]}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {demo.description[locale]}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{
            mt: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "primary.main",
          }}
        >
          {locale === "sr" ? "Pogledaj" : "View Demo"}
        </Button>
      </CardContent>
    </Card>
  </Link>
</Grid>
```

**Step 2: Verify the page compiles**

Run: `npm run build -- --filter=pitch 2>&1 | head -20` Expected: Build succeeds
(or check with `npm run dev`)

**Step 3: Commit**

```bash
git add app/pages/demos/pitch/index.tsx
git commit -m "feat(pitch): make cards clickable with View Demo button"
```

---

## Task 2: Add DemoLayout to Playground Page

**Files:**

- Modify: `app/pages/demos/playground/index.tsx`

**Step 1: Import DemoLayout and Box**

Add imports at the top of the file:

```tsx
import { DemoLayout } from "@/components/demos/demo-layout";
```

Update the MUI imports to include Box (Box should already be there, verify).

**Step 2: Replace Container with DemoLayout**

Replace the return statement (lines 64-121) with:

```tsx
const introText =
  locale === "sr"
    ? "Eksperimentišite sa različitim tipovima grafikona i podacima u realnom vremenu."
    : "Experiment with different chart types and data in real-time.";

return (
  <DemoLayout title={title} description={description}>
    {/* Intro box */}
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 3,
        background:
          "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {introText}
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
  </DemoLayout>
);
```

**Step 3: Remove unused imports**

Remove `Container` and `Head` from imports as they are no longer needed.

**Step 4: Verify the page compiles**

Run: `npm run build 2>&1 | head -30` Expected: Build succeeds

**Step 5: Commit**

```bash
git add app/pages/demos/playground/index.tsx
git commit -m "feat(playground): wrap in DemoLayout with intro box"
```

---

## Task 3: Add Hero Section to Topics Index

**Files:**

- Modify: `app/pages/topics/index.tsx`

**Step 1: Update imports**

Add `alpha` to MUI imports:

```tsx
import { Container, Typography, Grid, Box, alpha } from "@mui/material";
```

**Step 2: Add hero section and stats**

Replace the content inside `<AppLayout>` (lines 47-66) with:

```tsx
<AppLayout>
  <Container sx={{ py: 6 }}>
    {/* Hero Section */}
    <Box
      sx={{
        mb: 5,
        p: 5,
        borderRadius: 4,
        background:
          "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
        color: "white",
        boxShadow: "0 10px 40px rgba(16, 185, 129, 0.3)",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
      >
        📊 {heading}
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: "center", opacity: 0.95, fontSize: "1.1rem" }}
      >
        {subheading}
      </Typography>
    </Box>

    {/* Stats Row */}
    <Box
      sx={{
        mb: 5,
        display: "flex",
        gap: 3,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
          minWidth: 150,
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "translateY(-5px)" },
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          {topics.length}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {locale === "sr" || locale === "sr-Latn" ? "Тема" : "Topics"}
        </Typography>
      </Box>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          textAlign: "center",
          minWidth: 150,
          boxShadow: "0 10px 30px rgba(245, 87, 108, 0.3)",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "translateY(-5px)" },
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          {topics.reduce((sum, t) => sum + t.datasetCount, 0)}+
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {locale === "sr"
            ? "Скупова података"
            : locale === "sr-Latn"
              ? "Skupova podataka"
              : "Datasets"}
        </Typography>
      </Box>
    </Box>

    <Grid container spacing={3}>
      {topics.map((topic) => (
        <Grid item xs={12} sm={6} md={4} key={topic.id}>
          <TopicCard topic={topic} locale={locale} />
        </Grid>
      ))}
    </Grid>
  </Container>
</AppLayout>
```

**Step 3: Verify the page compiles**

Run: `npm run build 2>&1 | head -30` Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/pages/topics/index.tsx
git commit -m "feat(topics): add gradient hero section and stats"
```

---

## Task 4: Polish TopicCard Hover Effects

**Files:**

- Modify: `app/components/topics/TopicCard.tsx`

**Step 1: Update card hover styles**

Replace the Card sx prop (lines 46-55) with:

```tsx
        sx={{
          cursor: "pointer",
          textDecoration: "none",
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(16, 185, 129, 0.25)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
            opacity: 1,
          },
        }}
```

**Step 2: Update CardContent styling**

Update the CardContent to add padding:

```tsx
        <CardContent sx={{ p: 3 }}>
```

**Step 3: Verify the page compiles**

Run: `npm run build 2>&1 | head -30` Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/components/topics/TopicCard.tsx
git commit -m "feat(topics): polish TopicCard hover effects"
```

---

## Task 5: Add Hero Section to Topic Detail Page

**Files:**

- Modify: `app/pages/topics/[topic].tsx`

**Step 1: Add hero section**

Replace the title section (lines 169-176) with a hero section:

```tsx
{
  /* Hero Section */
}
<Box
  sx={{
    mb: 4,
    p: 4,
    borderRadius: 3,
    background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    color: "white",
  }}
>
  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
    {title}
  </Typography>
  <Typography variant="body1" sx={{ opacity: 0.95 }}>
    {description}
  </Typography>
</Box>;
```

**Step 2: Polish VisualizationCard hover**

Update the Card sx prop in VisualizationCard (lines 59-71):

```tsx
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(14, 165, 233, 0.25)",
        },
      }}
```

**Step 3: Add section divider**

Add a divider between visualizations and datasets sections. Before the Datasets
section (line 216), add:

```tsx
{
  /* Visual separator */
}
<Box
  sx={{
    mt: 4,
    mb: 3,
    borderBottom: "1px solid",
    borderColor: "divider",
  }}
/>;
```

**Step 4: Verify the page compiles**

Run: `npm run build 2>&1 | head -30` Expected: Build succeeds

**Step 5: Commit**

```bash
git add app/pages/topics/[topic].tsx
git commit -m "feat(topics): add hero section and polish visualization cards"
```

---

## Task 6: Final Verification and Polish

**Step 1: Run full build**

Run: `npm run build` Expected: Build succeeds without errors

**Step 2: Visual verification checklist**

Start dev server and check each page:

- `npm run dev`
- Visit `/demos/pitch` - cards should be clickable with hover effects
- Visit `/demos/playground` - should have DemoLayout with back button
- Visit `/topics` - should have gradient hero section and stats
- Visit `/topics/economy` (or any topic) - should have hero section

**Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "fix: final polish adjustments"
```

---

## Summary

| Task | File                                   | Changes              |
| ---- | -------------------------------------- | -------------------- |
| 1    | `app/pages/demos/pitch/index.tsx`      | Make cards clickable |
| 2    | `app/pages/demos/playground/index.tsx` | Add DemoLayout       |
| 3    | `app/pages/topics/index.tsx`           | Add hero section     |
| 4    | `app/components/topics/TopicCard.tsx`  | Polish hover effects |
| 5    | `app/pages/topics/[topic].tsx`         | Add hero section     |
| 6    | -                                      | Final verification   |
