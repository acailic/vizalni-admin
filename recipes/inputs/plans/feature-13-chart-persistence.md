# Feature Request

## Title
Chart configuration persistence with database storage and CRUD API

## Problem
Charts created in the configurator are lost on page refresh (only URL state encoding from Feature 09 preserves them). Users need to save, list, edit, and delete their chart configurations. The Swiss tool uses Prisma + PostgreSQL with API routes for full CRUD. We need the same.

## Proposed behavior

### Database schema
Using Prisma (add as dependency) with PostgreSQL (production) or SQLite (development):

```prisma
model ChartConfig {
  id          String   @id @default(cuid())
  title       String
  description String?
  config      Json     // Full ChartConfig object
  datasetIds  String[] // Referenced data.gov.rs dataset IDs
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
  status      Status   @default(DRAFT)
  userId      String?  // null for anonymous charts
  user        User?    @relation(fields: [userId], references: [id])
  views       Int      @default(0)
}

model User {
  id     String        @id @default(cuid())
  email  String        @unique
  name   String?
  charts ChartConfig[]
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### API routes (`src/app/api/charts/`)
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/charts` | Create new chart config |
| GET | `/api/charts` | List published charts (paginated) |
| GET | `/api/charts/[id]` | Get single chart config |
| PUT | `/api/charts/[id]` | Update chart config |
| DELETE | `/api/charts/[id]` | Delete chart config (soft: set status=ARCHIVED) |
| GET | `/api/charts/mine` | List current user's charts (requires auth, Feature 14) |
| POST | `/api/charts/[id]/publish` | Change status from DRAFT to PUBLISHED |

### Request/response validation
- All inputs validated with Zod schemas
- `config` field validated against ChartConfig Zod schema (Feature 03)
- Error responses use consistent format: `{ error: string, details?: ZodError }`

### Saved chart view
- `/v/[id]` — view a saved chart by database ID (instead of URL-encoded state)
- Server component: fetch config from database, render chart
- SEO: generate OpenGraph meta tags (title, description, preview image)
- View counter: increment on each load

### Configurator integration
- "Save" button in configurator (step 5)
- If unsaved: creates new config, redirects to `/v/[id]`
- If editing existing: updates config in place
- Auto-save draft every 30 seconds to prevent loss
- "Save as new" option for creating variants

### Public chart gallery
- `/charts` or `/vizuelizacije` page
- Grid of published chart cards with: title, chart type icon, preview thumbnail, author, date
- Sort by: newest, most viewed, recently updated
- Filter by: chart type, dataset source
- Pagination

### Chart preview thumbnails
- Generate a static PNG thumbnail on save (using the PNG export from Feature 08)
- Store as base64 in the database or as a file (evaluate storage approach)
- Show in gallery cards and OpenGraph meta tags

## Affected areas
- `prisma/schema.prisma` (new)
- `src/app/api/charts/` (new API routes)
- `src/app/v/[id]/page.tsx` (new: saved chart view)
- `src/app/charts/page.tsx` (new: public gallery)
- `src/components/gallery/` (new: ChartGalleryGrid, ChartGalleryCard)
- `src/lib/db/` (new: Prisma client setup, chart CRUD functions)
- `src/components/configurator/` (update: save/update buttons)
- `package.json` (add prisma, @prisma/client)
- `.env.example` (add DATABASE_URL)
- `public/locales/*/common.json` (labels: "Save", "Published", "Draft", "My charts", etc.)

## Constraints
- Database must handle JSON config field up to ~50KB (complex dashboard configs)
- Soft delete only — never hard-delete user data
- Anonymous chart creation allowed (no auth required to save)
- View counter must not slow down page load (fire-and-forget update)
- Gallery must not expose draft or archived charts
- Prisma migrations must be additive (never lose data on schema changes)
- SQLite for local development, PostgreSQL for production (both supported by Prisma)

## Out of scope
- User authentication (that's Feature 14)
- Chart versioning / history
- Chart forking / copying (can build on top of "save as new")
- Comments or ratings on charts
- Admin panel for managing charts

## Acceptance criteria
- [ ] Prisma schema defines ChartConfig and User models
- [ ] CRUD API routes work: create, read, update, soft-delete
- [ ] Config field validates against ChartConfig Zod schema on save
- [ ] `/v/[id]` renders a saved chart with correct metadata
- [ ] OpenGraph meta tags generated for saved charts (title, description)
- [ ] View counter increments on each load
- [ ] Gallery page lists published charts with pagination
- [ ] Configurator "Save" button creates/updates chart config
- [ ] Auto-save draft every 30 seconds
- [ ] SQLite works for local development
- [ ] All gallery and save UI translated in three locales

## Prior art / references
- Swiss tool: `app/db/config.ts` — Prisma-based chart config CRUD
- Swiss tool: `app/pages/api/config/` — API routes for chart management
- Swiss tool: `app/server/config-controller.ts` — server-side controller logic
- Swiss tool: `app/prisma/schema.prisma` — database schema
- Swiss tool: `app/domain/user-configs.ts` — user chart management
