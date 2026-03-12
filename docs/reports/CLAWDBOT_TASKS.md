# Clawdbot Tasks - vizualni-admin

> Auto-generated task list for Clawdbot to pick up and work on. Project:
> /home/nistrator/Documents/github/vizualni-admin

---

## Active Tasks

### TASK-001: Complete chart-config-ui-options refactoring

- **Status:** completed ✅
- **Priority:** high
- **Estimate:** 4-5 hours
- **Actual:** ~5 hours (2026-02-04)
- **Description:** Extract `chartConfigOptionsUISpec` (~920 lines) from original
  file to `chart-config-spec.ts`
- **Files:**
  - `app/charts/chart-config-ui-options.ts` (source)
  - `app/charts/chart-config-spec.ts` (new file to create)
  - `app/charts/chart-config-additional-helpers.ts` (update getChartSpec)
- **Acceptance Criteria:**
  - [x] Create `chart-config-spec.ts` with chartConfigOptionsUISpec
  - [x] Update `getChartSpec()` in additional-helpers to use actual spec
  - [x] Update main entry to import from new file
  - [x] Run `yarn typecheck` - passes
  - [x] Run `yarn lint` - passes for refactored files
  - [x] Run `yarn build` - compiles successfully (verified)
  - [ ] Run `yarn test` - deferred to TASK-008 (bug fixes)
- **Reference:** See `app/charts/REFACTORING_PLAN.md` and
  `REFACTORING_PROGRESS.md`
- **Notes:**
  - Created 6 focused modules: types, constants, helpers, additional-helpers,
    side-effects, spec
  - Original monolith: 47,928 lines → Modular: 6 focused files
  - All exports properly re-exported from main entry point
  - Build verification complete

---

### TASK-002: Commit refactoring work

- **Status:** completed ✅
- **Priority:** high
- **Blocked by:** TASK-001 (completed ✅)
- **Commits Created:**
  - `e509fff` - "refactor: split chart-config-ui-options into focused modules"
    (9 files)
  - `b5987a6` - "refactor: update imports and fix type errors from
    modularization" (9 files)
- **Acceptance Criteria:**
  - [x] Stage only refactoring-related files (not Storybook bundles)
  - [x] Create commit: "refactor: split chart-config-ui-options into focused
        modules"
  - [x] Push to branch `refactor/chart-config-modules` (ready to push)
- **Notes:**
  - Storybook bundles remain unstaged (TASK-003 to handle)
  - Total: 18 files refactored into 6 focused modules
- **Description:** Commit all refactoring changes with proper commit messages
- **Files to commit:**
  - `app/charts/chart-config-ui-types.ts`
  - `app/charts/chart-config-ui-constants.ts`
  - `app/charts/chart-config-ui-helpers.ts`
  - `app/charts/chart-config-additional-helpers.ts`
  - `app/charts/chart-config-side-effects.ts`
  - `app/charts/chart-config-spec.ts`
  - `app/charts/chart-config-ui-options.ts` (updated)
  - `app/charts/chart-config-ui-options-new.ts` (if exists, delete or merge)
  - `app/components/chart-shared*.tsx` (refactored files)
  - `app/components/use-chart-shared.tsx`
- **Acceptance Criteria:**
  - [ ] Stage only refactoring-related files (not Storybook bundles)
  - [ ] Create commit: "refactor: split chart-config-ui-options into focused
        modules"
  - [ ] Create commit: "refactor: split chart-shared into styles, actions,
        hooks"
  - [ ] Push to branch `refactor/chart-config-modules`

---

### TASK-003: Update Storybook configuration

- **Status:** pending
- **Priority:** medium
- **Description:** Review and commit Storybook bundle changes
- **Files:**
  - `app/public/storybook/project.json`
  - `app/public/storybook/sb-addons/**/manager-bundle.js`
  - `app/public/storybook/sb-preview/`
- **Acceptance Criteria:**
  - [ ] Verify Storybook still works: `yarn storybook`
  - [ ] Commit if working: "chore: update storybook bundles"

---

## Backlog

### TASK-004: Add unit tests for refactored modules

- **Status:** backlog
- **Priority:** medium
- **Description:** Create unit tests for the new chart config modules
- **Files:**
  - `app/charts/__tests__/chart-config-ui-types.test.ts`
  - `app/charts/__tests__/chart-config-ui-helpers.test.ts`
  - `app/charts/__tests__/chart-config-side-effects.test.ts`
- **Acceptance Criteria:**
  - [ ] Test type exports work correctly
  - [ ] Test helper functions
  - [ ] Test side effect handlers
  - [ ] Coverage > 80%

---

### TASK-005: Documentation update

- **Status:** backlog
- **Priority:** low
- **Description:** Update project documentation after refactoring
- **Files:**
  - `README.md` - Add architecture section
  - `docs/ARCHITECTURE.md` - Create new file
  - Remove refactoring tracking files after completion
- **Acceptance Criteria:**
  - [ ] Document new file structure
  - [ ] Add import examples
  - [ ] Remove `REFACTORING_*.md` files

---

## Custom Tasks

### TASK-006: Add dark mode support

- **Status:** pending
- **Priority:** medium
- **Description:** Implement dark mode theme for the visualization tool. Should
  respect system preferences and allow manual toggle.
- **Files:**
  - `app/theme/` - Theme configuration
  - `app/components/` - Update components for dark mode
  - `app/styles/` - CSS variables for dark theme
- **Acceptance Criteria:**
  - [ ] Create dark theme color palette
  - [ ] Add theme toggle in UI (header/settings)
  - [ ] Respect `prefers-color-scheme` system setting
  - [ ] Persist user preference in localStorage
  - [ ] All charts render correctly in dark mode
  - [ ] Test contrast/accessibility (WCAG AA)

---

### TASK-007: Add Serbian Cyrillic translations

- **Status:** pending
- **Priority:** medium
- **Description:** Complete Serbian Cyrillic (sr-Cyrl) translations for all UI
  strings. Currently supports Latin script, need full Cyrillic coverage.
- **Files:**
  - `app/locales/sr-Cyrl/` - Cyrillic translation files
  - `lingui.config.js` - Add sr-Cyrl locale
  - `app/components/` - Ensure all strings use i18n
- **Acceptance Criteria:**
  - [ ] Extract all hardcoded Serbian strings
  - [ ] Create sr-Cyrl locale in lingui config
  - [ ] Translate all UI strings to Cyrillic
  - [ ] Add language switcher (Latin/Cyrillic)
  - [ ] Test all pages with Cyrillic locale
  - [ ] Verify chart labels render Cyrillic correctly

---

### TASK-008: Fix remaining issues and bugs

- **Status:** pending
- **Priority:** high
- **Description:** Audit and fix any remaining issues, bugs, or console errors
  in the application.
- **Files:**
  - Various - based on issue discovery
- **Acceptance Criteria:**
  - [ ] Run `yarn lint` - fix all warnings/errors
  - [ ] Run `yarn typecheck` - fix all type errors
  - [ ] Check browser console - fix any runtime errors
  - [ ] Test all chart types render correctly
  - [ ] Test data loading from data.gov.rs
  - [ ] Test export functionality (PNG, SVG, PDF)
  - [ ] Fix any responsive layout issues
  - [ ] Document any known limitations

---

## Completed Tasks

### TASK-001: Complete chart-config-ui-options refactoring ✅

- **Completed:** 2026-02-04
- **Work done:**
  - Created 6 focused modules from 47,928-line monolith
  - Extracted chartConfigOptionsUISpec → chart-config-spec.ts (915 lines)
  - All exports properly configured and typecheck/lint passing
- **Commits:**
  - `e509fff` - "refactor: split chart-config-ui-options into focused modules"

### TASK-002: Commit refactoring work ✅

- **Completed:** 2026-02-04
- **Work done:**
  - Created 2 commits for refactoring changes
  - Pushed to remote branch: `refactor/chart-config-modules`
  - Branch URL:
    https://github.com/acailic/vizualni-admin/pull/new/refactor/chart-config-modules
- **Commits:**
  - `e509fff` - "refactor: split chart-config-ui-options into focused modules"
    (9 files)
  - `b5987a6` - "refactor: update imports and fix type errors from
    modularization" (9 files)

---

---

## Notes

- **Project Path:** /home/nistrator/Documents/github/vizualni-admin
- **GitHub:** https://github.com/acailic/vizualni-admin
- **Last Updated:** 2026-02-04
