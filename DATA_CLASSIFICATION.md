# Data Classification Guide

## Overview
This document clarifies the distinction between **demo/sample data** and **real data** in the Vizualni Admin application.

---

## 📊 Data Types

### 🎨 Demo Data (Sample/Simulated)

**Purpose:** Demonstrate chart capabilities and visualization types

**Characteristics:**
- ✅ Small, curated datasets
- ✅ Simplified for illustration
- ✅ Not from official sources
- ✅ Used for UI/UX demonstration

**Location:**
```
app/data/demo-showcase.ts
```

**Pages Using Demo Data:**
- ✅ `/demos/showcase` - Showcase page (main demo gallery)

**Visual Indicators:**
1. **🎨 Demo Data** badge (yellow/warning color)
2. **Blue info box** with explanation
3. **Links to real data** pages
4. **Clear warning** in file header comments

**Example:**
```tsx
<Chip
  icon={<span>🎨</span>}
  label="Demo Data"
  sx={{
    bgcolor: 'warning.lighter',
    color: 'warning.main',
    fontWeight: 700,
    border: '2px solid',
    borderColor: 'warning.light',
  }}
/>
```

---

### 📈 Real Data (From Official Sources)

**Purpose:** Actual data visualization from data.gov.rs and official sources

**Characteristics:**
- ✅ From data.gov.rs
- ✅ Real government statistics
- ✅ Regularly updated
- ✅ Traceable to source

**Location:**
```
app/data/serbian-*.ts
- serbian-budget.ts
- serbian-energy.ts
- serbian-air-quality.ts
- serbian-demographics.ts
```

**Pages Using Real Data:**
- ✅ `/serbian-data` - Serbian data dashboard
- ✅ `/demos/economy` - Real economic data
- ✅ `/demos/transport` - Real transport statistics
- ✅ `/demos/energy` - Real energy data
- ✅ `/demos/air-quality` - Real air quality data
- ✅ `/demos/demographics` - Real demographic data

**Visual Indicators:**
1. **📊 Real Data** badge (green/success color)
2. **Data source link** to data.gov.rs
3. **Last updated** timestamp
4. **Organization name** displayed

**Example:**
```tsx
<Chip
  icon={<span>📊</span>}
  label="Real Data"
  sx={{
    bgcolor: 'success.lighter',
    color: 'success.main',
    fontWeight: 700,
  }}
/>
```

---

## 🏷️ Clear Labeling System

### Demo Data Page (`/demos/showcase`)

**Header Badges:**
```tsx
<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
  {/* Demo Data Badge */}
  <Chip
    icon={<span>🎨</span>}
    label="Demo Data"
    sx={{ bgcolor: 'warning.lighter', color: 'warning.main' }}
  />

  {/* Last Updated */}
  <Chip label="Last updated: Dec 31, 2024" />

  {/* Sample Dataset */}
  <Chip label="Sample dataset" />
</Box>
```

**Prominent Notice Box:**
```tsx
<Box
  sx={{
    p: 2.5,
    bgcolor: 'info.lighter',
    border: '1px solid',
    borderColor: 'info.light',
    borderLeft: '4px solid',
    borderLeftColor: 'info.main',
  }}
>
  <Typography variant="body2" sx={{ fontWeight: 600 }}>
    Demonstration Data
  </Typography>
  <Typography variant="body2">
    The charts on this page use simulated data to demonstrate
    different visualization types. For real data from data.gov.rs,
    visit the dedicated pages for each category.
  </Typography>

  {/* Links to Real Data */}
  <Button href="/demos/economy">→ Real economy data</Button>
  <Button href="/demos">→ All categories</Button>
</Box>
```

### Real Data Pages (`/serbian-data`, `/demos/*`)

**Header Badges:**
```tsx
<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
  {/* Real Data Badge */}
  <Chip
    icon={<span>📊</span>}
    label="Real Data"
    sx={{ bgcolor: 'success.lighter', color: 'success.main' }}
  />

  {/* Data Source */}
  <Chip
    label="Source: data.gov.rs"
    sx={{ bgcolor: 'primary.lighter' }}
  />

  {/* Last Updated */}
  <Chip label="Last updated: Dec 31, 2024" />
</Box>
```

**Data Source Footer:**
```tsx
<Typography variant="body2" color="text.secondary">
  Izvor podataka: data.gov.rs
  <Link href="https://data.gov.rs">
    Visit data source
  </Link>
</Typography>
```

---

## 📁 File Organization

### Demo Data Files
```
app/data/
├── demo-showcase.ts          // 🎨 Demo data for showcase
└── demo-showcase.js           // Legacy JS version
```

**File Header:**
```typescript
/**
 * DEMO/SAMPLE DATASETS - FOR ILLUSTRATION PURPOSES ONLY
 *
 * ⚠️ WARNING: These are NOT real data from data.gov.rs
 *
 * For REAL data from official sources, visit:
 * - /demos/economy
 * - /demos/transport
 * - /demos/energy
 */
```

### Real Data Files
```
app/data/
├── serbian-budget.ts          // 📊 Real budget data
├── serbian-energy.ts          // 📊 Real energy data
├── serbian-air-quality.ts     // 📊 Real air quality data
└── serbian-demographics.ts    // 📊 Real demographic data
```

**File Header:**
```typescript
/**
 * Real Serbian Government Data
 *
 * Source: data.gov.rs
 * Organization: Ministry of Finance / Statistical Office
 * Last Updated: 2024-12-31
 * License: Open Data Commons
 */
```

---

## 🎨 Visual Design

### Color Coding

| Data Type | Background | Border | Icon |
|-----------|------------|--------|------|
| Demo Data | `warning.lighter` (#FFF7ED) | `warning.light` (#FFEDD5) | 🎨 |
| Real Data | `success.lighter` (#ECFDF5) | `success.light` (#D1FAE5) | 📊 |
| Stale Data Alert | `warning.lighter` | `warning.light` | ⚠️ |
| Info Notice | `info.lighter` | `info.light` | ℹ️ |

### Typography

**Demo Data Notice:**
```tsx
<Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
  Demonstration Data
</Typography>
```

**Real Data Source:**
```tsx
<Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
  Official Government Data
</Typography>
```

---

## 🔍 User Experience Flow

### Discovery Path

**1. User lands on `/demos/showcase`**
```
✅ Sees prominent "🎨 Demo Data" badge
✅ Reads info box explaining demo nature
✅ Finds links to real data pages
```

**2. User clicks "→ Real economy data"**
```
✅ Navigates to `/demos/economy`
✅ Sees "📊 Real Data" badge
✅ Sees "Source: data.gov.rs" link
✅ Can verify data source
```

**3. User explores real data**
```
✅ All charts show real statistics
✅ Footer links to data.gov.rs
✅ Last updated timestamp visible
✅ Organization attribution clear
```

### Accessibility Considerations

**Screen Reader Announcement:**
```tsx
<Box
  role="note"
  aria-label="Demo data notice"
>
  <Typography>
    This page uses demonstration data...
  </Typography>
</Box>
```

**Keyboard Navigation:**
```tsx
<Button
  href="/demos/economy"
  sx={{
    '&:focus': {
      outline: '2px solid #0ea5e9',
      outlineOffset: '2px'
    }
  }}
>
  → Real economy data
</Button>
```

---

## 📋 Implementation Checklist

### For Demo Data Pages
- [ ] Add `🎨 Demo Data` badge
- [ ] Include prominent info box
- [ ] Provide links to real data pages
- [ ] Add warning comment in data file
- [ ] Use `warning` color theme
- [ ] Set `aria-label="Demo data notice"`

### For Real Data Pages
- [ ] Add `📊 Real Data` badge
- [ ] Include `Source: data.gov.rs` chip
- [ ] Link to actual data source
- [ ] Display last updated date
- [ ] Show organization name
- [ ] Use `success` color theme
- [ ] Add data license information

---

## 🚀 Best Practices

### 1. **Always Label Data Type**
Every page with charts must clearly indicate whether data is demo or real.

### 2. **Provide Data Source Links**
For real data, always link to the original source on data.gov.rs.

### 3. **Show Last Updated Date**
Display when the data was last refreshed, especially for real data.

### 4. **Warn About Stale Data**
If data is older than 90 days, show a warning message.

### 5. **Use Consistent Colors**
- Demo = Yellow/Warning
- Real = Green/Success
- Stale = Orange/Warning
- Info = Blue/Info

### 6. **Make It Obvious**
Don't hide important information. Make data classification immediately visible.

---

## 📊 Current Page Status

| Page | Data Type | Badge | Notice | Source Link | Status |
|------|-----------|-------|--------|-------------|--------|
| `/demos/showcase` | Demo | ✅ | ✅ | ✅ | Complete |
| `/serbian-data` | Real | ⏳ | N/A | ✅ | Needs badge |
| `/demos/economy` | Real | ⏳ | N/A | ⏳ | Needs implementation |
| `/demos/transport` | Real | ⏳ | N/A | ⏳ | Needs implementation |
| `/demos/energy` | Real | ⏳ | N/A | ⏳ | Needs implementation |
| `/demos/air-quality` | Real | ⏳ | N/A | ⏳ | Needs implementation |

---

## 🔄 Maintenance

### When Adding New Demo Data
1. Add file to `app/data/`
2. Include warning comment in file header
3. Add `🎨 Demo Data` badge to page
4. Include info notice box
5. Link to corresponding real data page

### When Adding New Real Data
1. Add file to `app/data/serbian-*.ts`
2. Include source attribution in file header
3. Add `📊 Real Data` badge to page
4. Link to data.gov.rs source
5. Display last updated timestamp
6. Show organization name

### Regular Updates
- [ ] Check data.gov.rs monthly for updates
- [ ] Update last-modified timestamps
- [ ] Refresh demo data if visualization types change
- [ ] Verify all source links still work
- [ ] Review data freshness warnings

---

## 📝 Examples

### Demo Data File Header
```typescript
/**
 * DEMO/SAMPLE DATASETS - FOR ILLUSTRATION PURPOSES ONLY
 *
 * ⚠️ WARNING: These are NOT real data from data.gov.rs
 *
 * Created: 2024-01-12
 * Purpose: Demonstrate chart capabilities
 * Type: Simulated/Sample data
 *
 * For REAL data, visit:
 * - /demos/economy
 * - /serbian-data
 */

export const showcaseEnergyMix = [
  { source: 'Ugalj', share: 64 },
  { source: 'Hidro', share: 24 },
  // ... demo values
];
```

### Real Data File Header
```typescript
/**
 * Serbian Energy Data - REAL DATA
 *
 * Source: data.gov.rs
 * Organization: Ministry of Mining and Energy
 * Last Updated: 2024-12-31
 * License: Open Data Commons ODC-BY
 * Dataset ID: energy-mix-2024
 *
 * Direct Link: https://data.gov.rs/sr/datasets/...
 */

export const serbianEnergyData = [
  {
    id: "energy-001",
    year: 2024,
    source: "Ugalj",
    production: 28500,
    // ... real values from API
  },
];
```

---

## 🎯 Summary

**Key Principles:**
1. ✅ **Transparency** - Always disclose data type
2. ✅ **Clarity** - Use clear visual indicators
3. ✅ **Traceability** - Link to original sources
4. ✅ **Timeliness** - Show last updated dates
5. ✅ **Accessibility** - Support screen readers and keyboard navigation

**User Benefits:**
- Users know exactly what data they're looking at
- Demo data clearly separated from real data
- Easy navigation to official sources
- Trust in data authenticity
- Better informed decision-making

---

**Document Version:** 1.0
**Last Updated:** 2025-01-12
**Applies To:** All data visualization pages
