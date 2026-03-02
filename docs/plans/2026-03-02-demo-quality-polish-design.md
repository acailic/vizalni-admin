# Demo Pages Quality Polish Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create
> implementation plan from this design.

**Goal:** Polish all demo and topics pages for visual consistency,
interactivity, and professional appearance.

**Architecture:** Four focused improvements: (1) Make pitch cards clickable, (2)
Add DemoLayout to playground, (3) Add hero sections to topics pages, (4)
Standardize visual styling across all pages.

**Tech Stack:** Next.js, MUI (Material-UI), Lingui i18n

---

## Section 1: Pitch Page - Clickable Cards

**Current state:** Cards display demo info but have no action - just decorative.

**Changes:**

1. Wrap each card in a Link to `/demos/[demoId]`
2. Add hover effects matching showcase cards (translateY + box-shadow)
3. Add "View Demo" button at bottom of each card
4. Keep existing gradient styling (purple/indigo)

**Files to modify:**

- `app/pages/demos/pitch/index.tsx` - Add Link wrapper and button

**Code pattern:**

```tsx
<Link href={`/demos/${demo.id}`} passHref legacyBehavior>
  <Card
    component="a"
    sx={
      {
        /* existing styles + cursor: pointer */
      }
    }
  >
    <CardContent
      sx={
        {
          /* existing content */
        }
      }
    >
      {/* ... icon, title, description ... */}
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
```

---

## Section 2: Playground - Add DemoLayout

**Current state:** Uses raw `Container` without DemoLayout, no back button, no
hero styling.

**Changes:**

1. Wrap content in `DemoLayout` component (same as other demo pages)
2. Remove manual title/description rendering (DemoLayout handles it)
3. Keep existing tabs and config panel layout
4. Add gradient intro box like showcase page

**Files to modify:**

- `app/pages/demos/playground/index.tsx` - Wrap in DemoLayout

**Code pattern:**

```tsx
import { DemoLayout } from "@/components/demos/demo-layout";

export default function PlaygroundPage() {
  // ... existing hooks and state ...

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
        {/* existing config panel and preview pane */}
      </Grid>
    </DemoLayout>
  );
}
```

---

## Section 3: Topics Pages - Visual Polish

**Current state:** Plain styling, no gradient hero sections, inconsistent with
demo pages.

### Topics Index (`/topics/index.tsx`):

**Changes:**

1. Add gradient hero section matching demo index style
2. Add stats section showing topic count
3. Improve TopicCard hover effects

**Code pattern for hero:**

```tsx
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
  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}>
    📊 {heading}
  </Typography>
  <Typography variant="body1" sx={{ textAlign: "center", opacity: 0.95 }}>
    {subheading}
  </Typography>
</Box>
```

### Topic Detail (`/topics/[topic].tsx`):

**Changes:**

1. Add gradient hero section with topic icon and description
2. Add visual separator between visualizations and datasets sections
3. Polish VisualizationCard hover effects
4. Add styled back button

**Code pattern for hero:**

```tsx
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
</Box>
```

**Files to modify:**

- `app/pages/topics/index.tsx` - Add hero section, stats
- `app/pages/topics/[topic].tsx` - Add hero section, polish cards

---

## Section 4: Visual Consistency Standardization

**Current state:** Mixed hover effects, border radiuses, and shadow styles
across pages.

### Standardize card interactions:

- Hover transform: `translateY(-8px)`
- Border radius: `3` (12px)
- Shadow: `0 4px 20px rgba(0, 0, 0, 0.08)` → hover:
  `0 20px 40px rgba(color, 0.25)`
- Transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### Standardize intro boxes:

- Border radius: `3`
- Padding: `p: 4`
- Background: subtle gradient or `alpha(color, 0.08)`
- Border: `1px solid`, `borderColor: "divider"`

### Standardize section headers:

- Typography: `variant="h5"`, `fontWeight: 700`, `mb: 3`
- Include emoji icon where appropriate

**Files to modify:**

- `app/pages/demos/index.tsx` - Ensure consistency
- `app/pages/demos/pitch/index.tsx` - Match card hover styles
- `app/pages/topics/[topic].tsx` - Match card hover styles

---

## Summary of Files to Modify

| File                                   | Changes                                          |
| -------------------------------------- | ------------------------------------------------ |
| `app/pages/demos/pitch/index.tsx`      | Add Link wrapper, View Demo button, hover styles |
| `app/pages/demos/playground/index.tsx` | Wrap in DemoLayout, add intro box                |
| `app/pages/topics/index.tsx`           | Add gradient hero section, stats                 |
| `app/pages/topics/[topic].tsx`         | Add hero section, polish card hover              |
| `app/pages/demos/index.tsx`            | Minor consistency fixes (if needed)              |

---

## Testing

1. **Visual testing:** Check all pages render correctly with consistent styling
2. **Interaction testing:** Verify pitch cards are clickable and navigate
   correctly
3. **Navigation testing:** Verify playground has back button working
4. **Responsive testing:** Check mobile layouts still work
