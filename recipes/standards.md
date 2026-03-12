# Engineering Standards

## Code style

- TypeScript strict mode. No `any` unless genuinely unavoidable — use `unknown` and narrow.
- Prettier handles formatting. Do not fight it. Config: no semis, single quotes, 100 char width, es5 trailing commas.
- ESLint catches the rest. Fix warnings before they become blockers.
- Use path aliases (`@/components/...`, `@/lib/...`, `@/types/...`). Never use relative paths that climb more than one level (`../../` is a smell).

## Naming

- Components: PascalCase files and exports. Co-locate with styles if component-specific.
- Utilities and services: camelCase files.
- Types: PascalCase for interfaces/types. Suffix API response types with `Response` or `Result`.
- Translation keys: dot-notation namespaced (`common.navigation.home`, `datasets.filters.search`).
- CSS: Tailwind utility classes via `cn()` helper. No custom CSS unless Tailwind genuinely can't express it.

## Components

- Prefer server components (default in App Router). Only add `'use client'` when the component needs browser APIs, state, or event handlers.
- Keep components focused. If a component file exceeds ~150 lines, consider splitting.
- Props interfaces go in the same file as the component, not in a shared types file, unless reused across 3+ components.
- Use Radix UI for interactive primitives (dialogs, dropdowns, etc.). Do not build custom accessibility from scratch.
- All interactive elements must be keyboard-navigable and have appropriate ARIA attributes.

## Data fetching

- Server components: use the `datagov-client.ts` methods directly with React `cache()`.
- Client components: use SWR or React Query. Do not use raw `fetch` or `axios` in components.
- API routes (`src/app/api/`): validate inputs, handle errors with proper HTTP status codes, return typed responses.
- Never expose API keys or secrets in client-side code.

## i18n

- All user-facing strings must be translated. No hardcoded English or Serbian in JSX.
- Translation files live in `public/locales/{locale}/common.json` and `src/lib/i18n/locales/{locale}/`.
- When adding a feature, add translations for all three locales (sr-Cyrl, sr-Latn, en) in the same PR.
- Locale-aware formatting: use the i18n config helpers for dates, numbers, and relative time.

## Testing

- Unit tests (Jest): test utilities, hooks, data transformations, and API client logic.
- Component tests (@testing-library/react): test rendering, user interactions, and accessibility (jest-axe).
- E2E tests (Playwright): test critical user flows — navigation, locale switching, chart rendering, dataset browsing.
- MSW for mocking API responses. Do not mock `fetch` directly.
- Test files go in `tests/` mirroring `src/` structure, or co-located as `*.test.ts(x)`.
- Coverage is tracked but not gated. Focus on meaningful tests over coverage numbers.

## Git workflow

- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`.
- Keep commits atomic. One logical change per commit.
- PRs should be reviewable in under 30 minutes. If a change is too large, split it.
- Husky pre-commit hook runs lint-staged. Do not bypass with `--no-verify`.

## Performance

- Images: use Next.js `Image` component with proper dimensions and remote patterns.
- Charts: lazy-load heavy visualization libraries (Plotly, D3) where possible.
- Translations: load only the active locale's strings.
- Bundle analysis: run `ANALYZE=true npm run build` before merging large dependency additions.

## Security

- Validate all external input (API responses, query params, form data) with Zod schemas.
- Sanitize any user-generated content before rendering.
- CSP headers should be configured for production.
- CORS origins restricted to known domains.
- No secrets in client bundles. Use `NEXT_PUBLIC_` prefix only for genuinely public config.

## What we reject

- `// @ts-ignore` or `// @ts-expect-error` without an adjacent comment explaining why.
- `eslint-disable` without a clear, specific reason.
- Components that mix data fetching, business logic, and presentation in one function.
- PRs that add dependencies without justification.
- Untranslated user-facing strings.
- Tests that only assert "it renders without crashing" with no behavioral checks.
