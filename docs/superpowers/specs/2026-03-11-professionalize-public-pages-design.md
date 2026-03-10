# Professionalize Public Pages Design

**Date**: 2026-03-11 **Status**: Draft **Reference Site**:
https://visualize.admin.ch/en?dataSource=Prod

## Summary

Comprehensive analysis of visualize.admin.ch to identifying gaps and
opportunities to professionalize the public pages of vizualni-admin to project
to achieve a similar level of polish and professionalism.

---

## Reference Site Analysis

### Homepage Structure (visualize.admin.ch)

1. **Header**:

   - Sign in button
   - Language selector (EN dropdown)
   - Logo with separator

2. **Hero Section**:

   - H1: "Visualize Swiss Open Government Data"
   - Subtitle: "Create and embed visualizations from any dataset provided by the
     LINDAS Linked Data Service."
   - CTA: "Create a visualization" → /browse

3. **Tutorial Section** ("Visualize data in just a few steps…"):

   - Step 1: Select a dataset (with icon)
   - Step 2: Edit the visualization (with icon)
   - Step 3: Share & embed (with icon)
   - Visual step cards with illustrations

4. **CTA Sections** (2 row, 4 columns on desktop):

   - Would you like to visualize your own data? → Learn how
   - Subscribe to our Newsletter → Subscribe
   - Found a bug? → Report a bug
   - New feature request → Submit

5. **Footer**:
   - **About Us** section with description
   - **Stay Informed** section with Youtube and News links
   - **Further Information** section with LINDAS, Tutorials, Statistics
   - **Version link** to to - **Imprint** and **Legal Framework** links

### Browse Page Structure

1. **Banner** with:

   - H1: "Swiss Open Government Data"
   - Descriptive text about exploring datasets
   - Search bar integrated in the banner

2. **Filters Section**:

   - Include draft datasets checkbox
   - Sort dropdown

3. **Footer** (same as homepage)

### Statistics Page

- Platform usage statistics with charts
- Footer (same as homepage)

---

## Current Project Analysis

### What's Already present

1. **MDX Homepage** (`app/static-pages/en/index.mdx`,
   `app/static-pages/sr/index.mdx`):

   - `Intro` component with title, teaser, CTA button
   - `Tutorial` component with 3 steps
   - `Examples` component with chart examples
   - `Actions` component with 4 CTAs

2. **Navigation** (`app/components/navigation/NavBar.tsx`):

   - Desktop navigation with icons
   - Mobile drawer

3. **Footer Components** (`app/components/footer-components.tsx`):

   - `Footer`, `FooterSection`, `FooterSectionTitle`, `FooterSectionText`,
     `FooterSectionButton`, `FooterSectionSocialMediaButton`

4. **Homepage Components** (`app/homepage/`):
   - `intro.tsx`, `tutorial.tsx`, `examples.tsx`, `actions.tsx`
   - `step1.tsx`, `step2.tsx`, `step3.tsx`

### What's Missing or Needs Improvement

#### High Priority

1. **Professional Footer Implementation**

   - Current: Footer components exist but not fully integrated into the homepage
   - Needed: 3-column footer with:
     - About Us section with description
     - Stay Informed section with Youtube/News links
     - Further Information section with tutorials link
     - Version display linked to GitHub commit

2. **Version Display**

   - Show current version (from package.json)
   - Link to GitHub commit page

3. **Email Templates with Detailed Forms**

   - Current: Basic mailto links
   - Reference: Detailed forms with contact information fields
   - Templates for bug reports, feature requests, newsletter

4. **Header Improvements**

   - Add Sign in button
   - Add language selector dropdown
   - Logo with separator

5. **Overall Visual Polish**
   - Consistent spacing and typography
   - Professional color scheme
   - Better visual hierarchy

#### Medium Priority

6. **Tutorial Section Illustrations**

   - Add custom icons/illustrations for each step
   - Improve card design

7. **CTA Section Layout**

   - Improve the Actions component layout
   - Better spacing and visual grouping

8. **Browse Page Polish**
   - Professional banner with search
   - Better filter UI

#### Lower Priority

9. **Statistics Page**

   - Create a usage statistics page
   - Show platform metrics

10. **Maintenance Notice Banner**
    - Add alert/banner system for maintenance notices

---

## Design Decisions

### Footer Structure

```
┌─────────────────────────────────────────────────┐
│         ABOUT US           │   STAY INFORMED   │   FURTHER INFO   │
│  Description text...    │   [Youtube] [News] │   [Tutorials] [Stats] │
│                       │               │               │               │
├─────────────────────────────────────────────────┬─────────────────────────────────────┤
│  Version (link)  |  Imprint  |  Legal Framework  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Header Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]     [visualize.admin.ch]  │  [Sign in]  │  [EN ▼]  │
└─────────────────────────────────────────────────────────────────────────┘
```

### CTA Section Layout

```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│  Contribute     │  Newsletter    │  Bug Report     │  Feature Request │
│  Data?          │  Subscribe      │  Found a bug?      │  Request feature  │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

## Implementation Plan

### Phase 1: Footer & Version (High Priority)

**Files to modify:**

- `app/components/footer-components.tsx` - Enhance footer structure
- `app/pages/_app.tsx` or layout file - Add footer to homepage

**Tasks:**

1. Create 3-column footer with About Us, Stay Informed, Further Information
   sections
2. Add version display component that reads from package.json
3. Create Footer component for homepage integration
4. Add bottom links (Imprint, Legal Framework)

### Phase 2: Header Improvements (High Priority)

**Files to modify:**

- `app/components/navigation/NavBar.tsx`
- `app/components/navigation/MainNav.tsx`

**Tasks:**

1. Add Sign in button
2. Add language selector dropdown
3. Add logo with separator

### Phase 3: Email Templates (High Priority)

**Files to modify:**

- `app/templates/email/bug-report.ts`
- `app/templates/email/feature-request.ts`
- `app/templates/email/newsletter.ts`

**Tasks:**

1. Add contact information fields to templates
2. Improve template formatting

### Phase 4: Visual Polish (Medium Priority)

**Files to modify:**

- `app/homepage/intro.tsx`
- `app/homepage/tutorial.tsx`
- `app/homepage/actions.tsx`
- `app/components/layout.tsx`

**Tasks:**

1. Improve spacing and typography
2. Enhance visual hierarchy

### Phase 5: Tutorial Illustrations (Medium Priority)

**Files to modify:**

- `app/homepage/step1.tsx`
- `app/homepage/step2.tsx`
- `app/homepage/step3.tsx`

**Tasks:**

1. Add custom illustrations for each step

### Phase 6: Browse Page Polish (Medium Priority)

**Files to modify:**

- `app/pages/browse/index.tsx`

**Tasks:**

1. Add professional banner with search
2. Improve filter UI

### Phase 7: Statistics Page (Lower Priority)

**Files to create:**

- `app/pages/statistics.tsx` - Enhance or create

**Tasks:**

1. Add usage statistics section
2. Add charts for metrics

### Phase 8: Maintenance Notice System (Lower Priority)

**Files to create:**

- `app/components/maintenance-notice.tsx` - New

**Tasks:**

1. Create alert/banner component for notices
2. Add to homepage

---

## Technical Notes

- Use existing MUI components for consistency
- Maintain i18n support (already using lingui)
- Keep responsive design patterns
- Ensure accessibility compliance

- Use mailto: links for email templates (current approach)
- Keep existing component patterns where possible
