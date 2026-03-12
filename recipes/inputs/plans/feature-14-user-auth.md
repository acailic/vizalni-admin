# Feature Request

## Title
User authentication with chart ownership and personal workspace

## Problem
Without authentication, all saved charts are anonymous — no ownership, no personal workspace, no edit protection. The Swiss tool uses NextAuth with ADFS (Swiss federal auth). We need authentication for Serbian users, adapted for our context.

## Proposed behavior

### Authentication providers
Use NextAuth.js (already in `.env.example` as NEXTAUTH_*):
- **Email/password**: basic credential auth for general users
- **GitHub OAuth**: for developers and technical users
- **Google OAuth**: for broad accessibility
- Future: Serbian eGovernment integration (eID/eUprava) — not in initial scope but design for extensibility

### User model (extend Feature 13 Prisma schema)
```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String?
  image         String?
  role          Role          @default(USER)
  charts        ChartConfig[]
  colorPalettes UserPalette[]
  createdAt     DateTime      @default(now())
  sessions      Session[]
  accounts      Account[]     // NextAuth managed
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])
}

model Account {
  // NextAuth standard fields for OAuth
}

enum Role {
  USER
  EDITOR   // Can publish charts
  ADMIN    // Can manage users and all charts
}
```

### Auth flow pages
- `/login` — sign in page with provider options
- `/register` — email registration form
- `/profile` — user profile with chart list
- Redirect to login when accessing protected routes

### Protected routes
| Route | Auth required | Notes |
|-------|--------------|-------|
| `/browse`, `/v/*`, `/embed/*` | No | Public viewing |
| `/create` | No (save requires auth) | Can create without auth, prompted on save |
| `/api/charts` (POST/PUT/DELETE) | Yes | Must own the chart to edit/delete |
| `/api/charts/mine` | Yes | User's chart list |
| `/profile` | Yes | User settings |
| `/dashboard/new` | Yes | Dashboard creation |

### Chart ownership rules
- Creating a chart while logged in → chart belongs to user
- Creating a chart while anonymous → chart has no owner, editable by anyone with the URL
- Only the owner (or admin) can edit/delete a chart
- Publishing requires EDITOR or ADMIN role
- Viewing published charts requires no auth

### Personal workspace (`/profile`)
- "My charts" tab: list of user's charts (draft + published)
- "My palettes" tab: custom color palettes (Feature 15)
- Account settings: name, email, avatar
- "Delete account" with confirmation (soft-delete, archive all charts)

### UI components
- Login button in header (shows user avatar when logged in)
- User menu dropdown: My Charts, Profile, Sign Out
- Auth gate component: wraps protected content with login prompt

### Session management
- JWT sessions (stateless, no database session table needed for MVP)
- Session duration: 30 days with sliding expiry
- CSRF protection via NextAuth's built-in mechanisms

## Affected areas
- `src/app/login/page.tsx` (new)
- `src/app/register/page.tsx` (new)
- `src/app/profile/page.tsx` (new)
- `src/app/api/auth/[...nextauth]/route.ts` (new: NextAuth config)
- `src/lib/auth/` (new directory)
  - `auth-options.ts` — NextAuth provider configuration
  - `session.ts` — session helpers (getCurrentUser, requireAuth)
- `src/components/auth/` (new)
  - `LoginButton.tsx` — header login/user menu
  - `AuthGate.tsx` — wraps content requiring auth
  - `LoginForm.tsx` — email/password form
- `prisma/schema.prisma` (extend with Session, Account models)
- `src/app/api/charts/` (add ownership checks to PUT/DELETE)
- `src/components/ui/` (update header with auth state)
- `.env.example` (add NEXTAUTH_SECRET, GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET)
- `package.json` (add next-auth if not already present, @next-auth/prisma-adapter)
- `public/locales/*/common.json` (auth labels: "Sign in", "Sign out", "My charts", "Register", etc.)

## Constraints
- Do not block chart viewing on authentication. Public access is essential for government data.
- Email/password auth requires proper password hashing (bcrypt via next-auth adapter)
- OAuth secrets must never be exposed client-side
- Login page must work in all three locales
- NextAuth's Prisma adapter handles Account/Session tables — don't fight it
- Rate limiting on login attempts (prevent brute force)
- GDPR-like considerations: users can request data deletion

## Out of scope
- Serbian eGovernment SSO (eID/eUprava) — requires government partnership
- Role management UI (admin panel)
- Two-factor authentication
- Password reset flow (use OAuth for simpler auth in MVP)
- Collaborative editing (multiple users editing same chart)

## Acceptance criteria
- [ ] NextAuth configured with GitHub and Google OAuth providers
- [ ] Login page renders with provider buttons in three locales
- [ ] Successful login redirects to previous page or /profile
- [ ] User avatar and menu appear in header when logged in
- [ ] Chart creation works without auth; save prompts login
- [ ] Chart PUT/DELETE API routes reject requests from non-owners
- [ ] /profile page shows user's charts
- [ ] Session persists across page refreshes (30-day JWT)
- [ ] Logout clears session completely
- [ ] Protected API routes return 401 for unauthenticated requests

## Prior art / references
- Swiss tool: `app/auth-providers/` — ADFS auth provider configuration
- Swiss tool: `app/pages/api/auth/[...nextauth].ts` — NextAuth setup
- Swiss tool: `app/login/` — login page components
- Swiss tool: `app/server/user-controller.ts` — user-related server logic
- NextAuth.js docs: Prisma adapter, OAuth providers
