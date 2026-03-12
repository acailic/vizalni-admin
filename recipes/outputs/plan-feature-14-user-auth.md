## Feature: User Authentication with Chart Ownership

### Goal

Add registration, header auth UI, ownership-enforced publishing, and proper password handling to complete the authentication system that is already partially implemented.

### Affected files

| File | Change type | Description |
|------|-------------|-------------|
| `src/app/[locale]/register/page.tsx` | new | Registration page server component |
| `src/app/[locale]/register/client.tsx` | new | Registration form with email/password |
| `src/components/auth/AuthGate.tsx` | new | Client component to protect UI sections |
| `src/components/auth/LoginButton.tsx` | new | Header login button / user avatar dropdown |
| `src/components/auth/index.ts` | new | Barrel export for auth components |
| `src/lib/auth/auth-options.ts` | modify | Replace placeholder password check with bcrypt |
| `src/lib/auth/session.ts` | new | Server-side helpers: `getCurrentUser()`, `requireAuth()` |
| `src/app/api/charts/[id]/publish/route.ts` | modify | Add ownership verification |
| `src/app/api/auth/register/route.ts` | new | Registration API endpoint |
| `src/app/api/charts/route.ts` | modify | Attach userId from session on chart creation |
| `public/locales/en/common.json` | modify | Add registration translation keys |
| `public/locales/sr-Cyrl/common.json` | modify | Add registration translation keys |
| `public/locales/sr-Latn/common.json` | modify | Add registration translation keys |
| `src/app/providers.tsx` | modify | Add NextAuthProvider wrapper |
| `package.json` | modify | Add bcryptjs dependency |
| `tests/unit/lib/auth/session.test.ts` | new | Unit tests for session helpers |
| `tests/unit/components/auth/AuthGate.test.tsx` | new | Component tests for AuthGate |
| `tests/e2e/auth.spec.ts` | new | E2E tests for login/register flows |

### Implementation steps

1. **Add bcryptjs dependency and update credentials provider** — Install `bcryptjs` and its types. Replace the placeholder `credentials.password === 'password'` check in `auth-options.ts` with proper `bcrypt.compare()`. Validate: Credentials login works with hashed passwords.

2. **Create server-side session helpers** — Add `src/lib/auth/session.ts` with `getCurrentUser()` wrapping `getServerSession()`, and `requireAuth()` that throws/redirects if unauthenticated. Validate: Helpers correctly return user or null.

3. **Create registration API endpoint** — Add `src/app/api/auth/register/route.ts` with POST handler that validates email/password with Zod, hashes password with bcrypt, creates user via Prisma. Validate: Can register new user via curl/Postman.

4. **Create registration page** — Add `src/app/[locale]/register/page.tsx` and `client.tsx` with form (email, password, confirm password). Call `/api/auth/register` then auto-sign-in. Validate: Registration flow works in browser.

5. **Add registration translations** — Add keys to all three locale files: `register_title`, `register_subtitle`, `create_account`, `confirm_password`, `password_mismatch`, `email_taken`, `weak_password`. Validate: All locales show correct labels.

6. **Wrap app with NextAuthProvider** — Update `src/app/providers.tsx` to include `SessionProvider` from `next-auth/react` around children. Validate: `useSession()` works in client components.

7. **Create AuthGate component** — Add `src/components/auth/AuthGate.tsx` that checks `useSession()`, shows loading spinner, redirects to login if unauthenticated, or renders children if authenticated. Validate: Wrapping profile content redirects when logged out.

8. **Create LoginButton component** — Add `src/components/auth/LoginButton.tsx` that shows "Sign In" link when logged out, user avatar + dropdown (My Charts, Profile, Sign Out) when logged in. Validate: Header shows correct state.

9. **Update chart creation to attach userId** — Modify `POST /api/charts` to get session and attach `userId` to new charts when authenticated. Validate: Creating chart while logged in associates it with user.

10. **Add ownership check to publish endpoint** — Modify `POST /api/charts/[id]/publish` to verify session user owns the chart before publishing. Validate: Non-owners get 403 when trying to publish.

11. **Add unit tests for session helpers** — Test `getCurrentUser()` and `requireAuth()` with mocked `getServerSession`. Validate: Tests pass.

12. **Add component tests for AuthGate** — Test loading state, authenticated render, unauthenticated redirect. Validate: Tests pass.

13. **Add E2E tests for auth flows** — Playwright tests for: register → login → profile redirect, login → create chart → appears in profile, logout → profile redirects. Validate: All E2E tests pass.

### New translation keys

| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `auth.register_title` | Направите налог | Napravite nalog | Create Account |
| `auth.register_subtitle` | Региструјте се да бисте чували визуелизације | Registrujte se da biste čuvali vizuelizacije | Register to save your visualizations |
| `auth.create_account` | Направи налог | Napravi nalog | Create Account |
| `auth.confirm_password` | Потврди лозинку | Potvrdi lozinku | Confirm Password |
| `auth.password_mismatch` | Лозинке се не поклапају | Lozinke se ne poklapaju | Passwords do not match |
| `auth.email_taken` | И-мејл је већ заузет | I-mejl je već zauzet | Email is already taken |
| `auth.weak_password` | Лозинка мора имати најмање 8 знакова | Lozinka mora imati najmanje 8 znakova | Password must be at least 8 characters |
| `auth.already_have_account` | Већ имате налог? | Već imate nalog? | Already have an account? |
| `auth.sign_in_link` | Пријавите се | Prijavite se | Sign in |
| `auth.my_charts` | Моји графикони | Moji grafikoni | My Charts |
| `auth.loading` | Учитавање... | Učitavanje... | Loading... |

### Test plan

- **Unit:**
  - `session.test.ts`: `getCurrentUser()` returns user when session exists, null otherwise; `requireAuth()` throws/redirects when unauthenticated
  - `auth-options.ts`: Credentials provider correctly hashes on register and compares on login

- **Component:**
  - `AuthGate.test.tsx`: Shows spinner while loading, renders children when authenticated, shows login prompt when unauthenticated
  - `LoginButton.test.tsx`: Shows "Sign In" when logged out, shows avatar + dropdown when logged in

- **E2E:**
  - Registration flow: fill form → submit → redirected to profile
  - Login flow: OAuth redirect or credentials → redirected to callback URL
  - Protected route: access /profile while logged out → redirected to /login
  - Chart ownership: create chart logged in → appears in /profile → delete works
  - Publish ownership: try to publish another user's chart → 403 error

### Risks and edge cases

- **Credentials provider is currently insecure** — The placeholder `=== 'password'` check is a critical vulnerability. Mitigation: Step 1 must replace with bcrypt before any production use.

- **Anonymous charts ownership transfer** — Current logic allows first editor to claim anonymous charts. This could lead to disputes. Mitigation: Document this behavior clearly; consider adding explicit "claim ownership" action in future.

- **OAuth without email** — Some OAuth providers may not return email. Mitigation: Require email in OAuth callback before creating user.

- **Session hydration mismatch** — SSR with `useSession()` can cause hydration errors if server and client session states differ. Mitigation: Use `SessionProvider` with `basePath` and ensure consistent cookie handling.

- **Rate limiting on registration/login** — Not in scope but important for production. Mitigation: Add TODO comment for rate limiting middleware.

- **SQLite concurrent writes** — SQLite doesn't handle concurrent writes well. For production, migrate to PostgreSQL. Mitigation: Already documented in architecture notes.

- **Translation key drift** — Forgetting to add keys to all three locales. Mitigation: Add a CI check that compares keys across locale files.

### Open questions

- **Should we implement password reset flow in this feature?** The spec says "out of scope" but users will inevitably forget passwords. Recommend: Keep out of scope for MVP, add as follow-up.

- **What is the minimum password strength requirement?** Proposing 8 characters minimum. Should we require complexity (uppercase, numbers, symbols)? Recommend: Start simple (8+ chars), add strength meter in follow-up.

- **Should profile page show anonymous charts created by the user's session?** Currently anonymous charts have no `userId`. We could track via a cookie-based session ID. Recommend: Keep anonymous charts unclaimed unless explicitly saved while logged in.

- **Role-based access for publishing?** Spec mentions `EDITOR` and `ADMIN` roles for publishing. Should we enforce this now? Recommend: Implement roles in schema but don't gate publishing yet — all authenticated users can publish in MVP.

### Estimated complexity

**Medium** — The foundation is already in place (NextAuth configured, Prisma schema ready, login/profile pages exist). The work is primarily: (1) completing the credentials provider with real password hashing, (2) adding registration flow, (3) adding UI components for header auth state, (4) adding ownership checks to publish endpoint, and (5) writing tests. No major architectural changes needed.
