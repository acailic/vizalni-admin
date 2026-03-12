# Implementation Plan: Feature 13 - Chart Config Persistence

## Feature: Chart Configuration Persistence

### Goal
Enable users to save chart configurations to a database, view saved charts via persistent URLs, and browse a public gallery of published visualizations.

### Affected files
| File | Change type | Description |
|------|-------------|-------------|
| `package.json` | modify | Add prisma, @prisma/client dependencies |
| `prisma/schema.prisma` | new | Define ChartConfig, User models |
| `.env.example` | modify | Add DATABASE_URL |
| `src/lib/db/index.ts` | new | Prisma client singleton |
| `src/lib/db/charts.ts` | new | Chart CRUD functions |
| `src/app/api/charts/route.ts` | new | GET (list), POST (create) |
| `src/app/api/charts/[id]/route.ts` | new | GET, PUT, DELETE single chart |
| `src/app/api/charts/[id]/publish/route.ts` | new | POST to publish draft |
| `src/app/api/charts/mine/route.ts` | new | GET current user's charts |
| `src/app/[locale]/v/[id]/page.tsx` | new | Saved chart view page |
| `src/app/[locale]/charts/page.tsx` | new | Public gallery page |
| `src/components/gallery/ChartGalleryGrid.tsx` | new | Gallery grid component |
| `src/components/gallery/ChartGalleryCard.tsx` | new | Gallery card component |
| `src/components/configurator/SaveButton.tsx` | new | Save/update button |
| `src/stores/configurator.ts` | modify | Add savedChartId, isDirty state |
| `src/types/persistence.ts` | new | DbChartConfig, ChartStatus types |
| `public/locales/sr-Cyrl/common.json` | modify | Add persistence labels |
| `public/locales/sr-Latn/common.json` | modify | Add persistence labels |
| `public/locales/en/common.json` | modify | Add persistence labels |

### Implementation steps

#### Step 1: Set up Prisma and database schema
**Changes:**
- Add `prisma` and `@prisma/client` to package.json
- Create `prisma/schema.prisma` with ChartConfig and User models
- Add `DATABASE_URL` to `.env.example`

**Validation:**
- `npx prisma generate` succeeds
- `npx prisma db push` works with SQLite locally

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum ChartStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model ChartConfig {
  id          String       @id @default(cuid())
  title       String
  description String?
  config      String       // JSON stringified ChartConfig
  datasetIds  String       // JSON array of dataset IDs
  thumbnail   String?      // Base64 PNG thumbnail
  status      ChartStatus  @default(DRAFT)
  views       Int          @default(0)
  userId      String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  publishedAt DateTime?

  @@index([status])
  @@index([userId])
  @@index([createdAt])
}

model User {
  id        String       @id @default(cuid())
  email     String       @unique
  name      String?
  charts    ChartConfig[]
  createdAt DateTime     @default(now())
}
```

#### Step 2: Create Prisma client and CRUD functions
**Changes:**
- Create `src/lib/db/index.ts` with Prisma client singleton
- Create `src/lib/db/charts.ts` with CRUD functions:
  - `createChart(data: CreateChartInput)`
  - `getChartById(id: string)`
  - `listCharts(filters, pagination)`
  - `updateChart(id, data)`
  - `deleteChart(id)` (soft delete via status=ARCHIVED)
  - `publishChart(id)`
  - `incrementViews(id)`

**Validation:**
- Unit tests for each CRUD function
- SQLite in-memory database for tests

#### Step 3: Create API routes
**Changes:**
- `src/app/api/charts/route.ts`: GET (list published), POST (create)
- `src/app/api/charts/[id]/route.ts`: GET, PUT, DELETE
- `src/app/api/charts/[id]/publish/route.ts`: POST
- `src/app/api/charts/mine/route.ts`: GET (requires auth later)

**Validation:**
- API routes return correct responses
- Zod validation on input
- Error handling for not found, validation errors

#### Step 4: Create saved chart view page
**Changes:**
- `src/app/[locale]/v/[id]/page.tsx`: Server component
  - Fetch chart from database
  - Render chart with ChartRenderer
  - Generate OpenGraph meta tags
  - Increment view counter (fire-and-forget)

**Validation:**
- Page renders saved chart
- 404 for non-existent charts
- Meta tags generated correctly

#### Step 5: Create public gallery page
**Changes:**
- `src/app/[locale]/charts/page.tsx`: Server component
  - List published charts with pagination
  - Sort options: newest, most viewed
- `src/components/gallery/ChartGalleryGrid.tsx`
- `src/components/gallery/ChartGalleryCard.tsx`

**Validation:**
- Gallery shows published charts only
- Pagination works
- Cards show thumbnail, title, chart type, date

#### Step 6: Add save functionality to configurator
**Changes:**
- `src/stores/configurator.ts`: Add `savedChartId`, `isDirty`, `lastSavedAt`
- `src/components/configurator/SaveButton.tsx`:
  - Create new or update existing
  - Show save status
  - Auto-save every 30 seconds

**Validation:**
- Save button creates new chart
- Save button updates existing chart
- Auto-save triggers correctly
- isDirty state tracked

#### Step 7: Add translations
**Changes:**
- Add persistence labels to all three locale files

**Validation:**
- All UI text translated
- No missing keys

### New translation keys
| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `persistence.save` | Сачувај | Sačuvaj | Save |
| `persistence.saved` | Сачувано | Sačuvano | Saved |
| `persistence.saveAsNew` | Сачувај као ново | Sačuvaj kao novo | Save as new |
| `persistence.saving` | Чувам се... | Čuvam se... | Saving... |
| `persistence.autoSave` | Аутоматски сачувано | Automatski sačuvano | Auto-saved |
| `persistence.unsavedChanges` | Несачуване измене | Nesačuvane izmene | Unsaved changes |
| `persistence.published` | Објављено | Objavljeno | Published |
| `persistence.draft` | Нацрт | Nacrt | Draft |
| `persistence.publish` | Објави | Objavi | Publish |
| `gallery.title` | Галерија визуелизација | Galerija vizuelizacija | Visualization Gallery |
| `gallery.newest` | Најновије | Najnovije | Newest |
| `gallery.mostViewed` | Најгледаније | Najgledanije | Most viewed |
| `gallery.noCharts` | Нема објављених визуелизација | Nema objavljenih vizuelizacija | No published visualizations |
| `gallery.createFirst` | Направите прву | Napravite prvu | Create the first one |
| `chart.source` | Извор | Izvor | Source |
| `chart.viewCount` | {{count}} прегледа | {{count}} pregleda | {{count}} views |
| `errors.chartNotFound` | Визуелизација није пронађена | Vizuelizacija nije pronađena | Chart not found |

### Test plan
- **Unit:**
  - `src/lib/db/charts.test.ts`: CRUD operations
  - `src/lib/db/validation.test.ts`: Config validation against Zod schema
- **Component:**
  - `SaveButton.test.tsx`: Save states, auto-save
  - `ChartGalleryCard.test.tsx`: Rendering with different statuses
- **E2E:**
  - Create chart → save → view at `/v/[id]`
  - Edit saved chart → update → verify changes
  - Gallery shows published charts only

### Risks and edge cases
| Risk | Mitigation |
|------|------------|
| SQLite JSON field limitations | Use TEXT field with JSON.stringify/parse |
| Large config objects (>50KB) | Validate size before save, warn user |
| View counter race conditions | Fire-and-forget with error logging |
| Thumbnail generation slow | Generate async, show placeholder initially |
| Missing dataset after save | Store dataset metadata in config, handle gracefully |

### Open questions
1. **Thumbnail storage:** Store as base64 in DB or as file? Recommendation: base64 in DB for simplicity (thumbnails small ~20KB)
2. **Anonymous vs authenticated:** Allow anonymous chart creation? Recommendation: Yes, userId can be null
3. **Auto-save debounce:** 30 seconds or shorter? Recommendation: 30 seconds with manual save option

### Estimated complexity
**Medium** — 7 implementation steps, ~15 new files, requires new dependency (Prisma) but follows established patterns in the codebase.
