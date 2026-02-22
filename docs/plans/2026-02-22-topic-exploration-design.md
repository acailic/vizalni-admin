# Topic-Based Data Exploration Design

**Date:** 2026-02-22 **Status:** Approved **Goal:** Help users discover what
datasets exist on data.gov.rs through curated topic pages

## Problem

Users don't know what datasets are available on data.gov.rs. There's no overview
or catalog that helps them discover relevant data for their interests.

## Solution

Topic-based exploration pages that mirror data.gov.rs categories, with manually
curated datasets and direct links to visualization tools.

## Design Decisions

| Decision       | Choice                        | Rationale                        |
| -------------- | ----------------------------- | -------------------------------- |
| Organization   | Mirror data.gov.rs categories | Consistency with official portal |
| Maintenance    | Manually curated              | Higher quality descriptions      |
| Content        | Dataset list + descriptions   | Simple, actionable               |
| Location       | In main app (`/topics`)       | Zero friction to visualize       |
| Implementation | Static pages + JSON data      | Simple, works with static export |

## URL Structure

- `/topics` - Landing page listing all topics
- `/topics/[topic-id]` - Individual topic page (e.g., `/topics/economy`)

## File Structure

```
app/
├── pages/topics/
│   ├── index.tsx          # Topic listing page
│   └── [topic].tsx        # Individual topic page
├── data/topics/
│   ├── index.json         # Topic metadata (titles, icons)
│   ├── economy.json       # Economy & Finance datasets
│   ├── health.json        # Health datasets
│   ├── education.json     # Education datasets
│   ├── environment.json   # Environment datasets
│   ├── agriculture.json   # Agriculture datasets
│   ├── transport.json     # Transport datasets
│   ├── culture.json       # Culture datasets
│   └── demographics.json  # Demographics datasets
├── components/topics/
│   ├── TopicCard.tsx      # Topic card component
│   └── DatasetCard.tsx    # Dataset card component
```

## Topic Categories

Mirroring data.gov.rs categories:

| ID             | Serbian               | Latin                 | English           |
| -------------- | --------------------- | --------------------- | ----------------- |
| `economy`      | Економија и финансије | Ekonomija i finansije | Economy & Finance |
| `health`       | Здравство             | Zdravstvo             | Health            |
| `education`    | Образовање            | Obrazovanje           | Education         |
| `environment`  | Животна средина       | Životna sredina       | Environment       |
| `agriculture`  | Пољопривреда          | Poljoprivreda         | Agriculture       |
| `transport`    | Саобраћај             | Saobraćaj             | Transport         |
| `culture`      | Култура               | Kultura               | Culture           |
| `demographics` | Демографија           | Demografija           | Demographics      |

## Data Schema

### Topic Index (`data/topics/index.json`)

```typescript
interface TopicIndex {
  topics: Topic[];
}

interface Topic {
  id: string;
  title: {
    sr: string;
    "sr-Latn": string;
    en: string;
  };
  icon: string; // MUI icon name
  description: {
    sr: string;
    "sr-Latn": string;
    en: string;
  };
  datasetCount: number;
}
```

### Individual Topic (`data/topics/economy.json`)

```typescript
interface TopicData {
  id: string;
  title: TopicTitle;
  datasets: Dataset[];
}

interface Dataset {
  id: string;
  title: {
    sr: string;
    "sr-Latn"?: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  dataGovRsId: string;
  dataGovRsUrl: string;
  tags: string[];
  lastUpdated: string; // YYYY-MM-DD
  format: "CSV" | "JSON" | "XLSX" | "XML";
  recommendedChart?: "bar" | "line" | "pie" | "map" | "area";
}
```

## UI Design

### Topics Landing Page (`/topics`)

- Grid of topic cards (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each card shows: icon, title (bilingual), description, dataset count
- Clicking card navigates to topic page

### Individual Topic Page (`/topics/[topic]`)

- Back link to topics listing
- Topic title and description
- List of dataset cards
- Each dataset card shows:
  - Title (Serbian + English)
  - Description
  - Format badge
  - Last updated date
  - "Визуализуј" (Visualize) button

## Visualize Flow

When user clicks "Визуализуј":

1. Navigate to `/create?dataset=[dataGovRsId]&topic=[topicId]`
2. Chart creation page pre-loads dataset from data.gov.rs API
3. Chart type pre-selected based on `recommendedChart` field
4. User customizes and saves visualization

### URL Parameters

```
/create?dataset=abc123-def456&topic=economy
```

### Pre-selection Logic

- If `recommendedChart: "bar"` → BarChart component pre-selected
- Dataset auto-fetched via `useDataGovRs` hook
- User sees immediate preview

### Error Handling

- If dataset fetch fails → show error with link to data.gov.rs
- If dataset format unsupported → show message with suggestions

## Implementation Files

### New Files

| File                                    | Purpose                |
| --------------------------------------- | ---------------------- |
| `app/pages/topics/index.tsx`            | Topic listing page     |
| `app/pages/topics/[topic].tsx`          | Individual topic page  |
| `app/data/topics/index.json`            | Topic metadata         |
| `app/data/topics/economy.json`          | Economy datasets       |
| `app/data/topics/health.json`           | Health datasets        |
| `app/data/topics/education.json`        | Education datasets     |
| `app/components/topics/TopicCard.tsx`   | Topic card component   |
| `app/components/topics/DatasetCard.tsx` | Dataset card component |

### Modified Files

| File                           | Change                                |
| ------------------------------ | ------------------------------------- |
| `app/pages/create.tsx`         | Add support for `?dataset=` URL param |
| `app/components/Nav.tsx`       | Add "Истражи" (Explore) nav link      |
| `app/hooks/use-data-gov-rs.ts` | Add fetch-by-ID function if missing   |

## Initial Content

Start with 3-5 curated datasets per topic. Expand via community contributions
through pull requests.

## Maintenance

- Curators update JSON files manually
- Changes submitted via pull requests
- Easy to review and maintain
- Works with static export (GitHub Pages)

## Success Metrics

- Users can discover relevant datasets within 2 clicks
- Topic pages become common entry point for new users
- Increased engagement with data.gov.rs datasets
