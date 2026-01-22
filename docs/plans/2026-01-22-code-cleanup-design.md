# Comprehensive Code Cleanup Design

**Date:** 2026-01-22 **Status:** Approved **Author:** Claude (brainstorming
session with user)

## Overview

Systematic cleanup of the Vizualni Admin codebase focusing on type safety,
logging infrastructure, and technical debt resolution. This cleanup will improve
code quality, maintainability, and developer experience while reducing risk
through a phased approach.

## Objectives

1. Eliminate `any` types in exported code for better type safety
2. Replace ad-hoc console statements with structured logging
3. Resolve or document all TODO/FIXME comments
4. Establish quality gates to prevent future regression

## Approach: Phased Rollout

We use a phased approach for risk mitigation:

- Each phase is isolated and independently testable
- Clear audit trail for each change
- Easy to rollback if issues arise
- Testable commits per phase

## Phase Details

### Phase 1: Type Safety

**Goal:** Replace all `any` types in `app/exports/` with proper TypeScript
types.

**Scope:**

- `app/exports/charts/MapChart.tsx` - index signatures and callback types
- `app/exports/utils/transforms.ts` - result object typing
- Any other `any` types found in exports directory

**Implementation Pattern:**

```typescript
// Before
interface MapChartProps {
  [key: string]: any;
  onDataPointClick?: (data: any, index: number) => void;
}

// After
interface MapDataPoint {
  properties: Record<string, unknown>;
  geometry: GeoJSON.Geometry;
}

interface MapChartProps {
  [key: string]: MapDataPoint;
  onDataPointClick?: (data: MapDataPoint, index: number) => void;
}
```

**Acceptance Criteria:**

- Zero `any` types in `app/exports/`
- `yarn typecheck` passes with no errors
- Exported types are properly documented

### Phase 2: Logging Infrastructure

**Goal:** Replace all `console.*` statements with structured logging.

**Scope:**

- ~15 files with console statements in non-test code
- Create `app/lib/logger/` module

**Architecture:**

```
app/lib/logger/
├── index.ts          # Main logger export
├── config.ts         # Log level configuration
└── formats.ts        # Structured formatting
```

**Configuration:**

- Environment variable: `LOG_LEVEL=debug|info|warn|error`
- In development: All logs to console with colors
- In production: Structured JSON logs, warn+ only

**Replacement Mapping:**

- `console.error` → `logger.error` (always)
- `console.warn` → `logger.warn` (always)
- `console.log` → `logger.debug` (usually)

**Acceptance Criteria:**

- Zero `console.*` statements in production code paths
- Logger works in both dev and production modes
- Logs are properly formatted and include context

### Phase 3: Technical Debt Resolution

**Goal:** Address all TODO/FIXME comments systematically.

**Scope:**

- ~30 TODO/FIXME comments across the codebase
- Create audit document: `docs/TODO_AUDIT.md`

**Triage Process:**

1. **Fixable now:** Implement the fix and remove the comment
2. **Needs discussion:** Create GitHub issue, add issue reference
3. **Obsolete:** Remove without action

**Priority Ordering:**

1. Comments in `app/exports/` (public API)
2. Comments in core chart components
3. Comments in utilities and domain logic
4. Comments in less critical areas

**Acceptance Criteria:**

- Zero TODO/FIXME without:
  - Either: implemented fix
  - Or: linked GitHub issue in format `// TODO(#123)`
- Audit document created and referenced

### Phase 4: Final Polish

**Goal:** Establish clean baseline for future development.

**Scope:**

- Fix ESLint issues in modified files
- Detect and address circular dependencies
- Remove any dead code discovered during cleanup

**Tasks:**

1. Run `madge` to detect circular dependencies
2. Fix import ordering issues
3. Remove unused imports
4. Update `scripts/quality-gates.js` with new checks

**New Quality Gates:**

- No `any` types in `app/exports/`
- No `console.*` in production code
- No TODO/FIXME without linked issue (after Phase 3)

**Acceptance Criteria:**

- All ESLint checks pass
- No circular dependencies in critical paths
- Quality gates updated and passing

## Risk Mitigation

**Per-Phase Testing:** After each phase:

1. Run `yarn typecheck`
2. Run `yarn test`
3. Run `yarn lint`
4. Manual smoke test of affected features

**Rollback Strategy:**

- Each phase in separate git commit
- Revert commit if tests fail
- Document any skipped items in phase notes

**Error Handling:**

- Logger initialization: fallback to console if setup fails
- Type changes: use `unknown` as intermediate step if needed
- TODO fixes: skip to issue creation if fix seems risky

## Out of Scope

The following are explicitly excluded from this cleanup:

- Refactoring algorithms or changing behavior
- Performance optimization (unless directly related)
- Adding new features or tests
- Changes to `node_modules/` or build tooling
- Major architectural refactoring

## Success Criteria

The cleanup is complete when:

- ✅ Zero `any` types in `app/exports/`
- ✅ Zero `console.*` statements in production code paths
- ✅ Zero unresolved TODO/FIXME without linked GitHub issue
- ✅ All tests passing (`yarn test`)
- ✅ All type checks passing (`yarn typecheck`)
- ✅ No new ESLint errors
- ✅ Quality gates updated and passing

## Timeline Estimates

| Phase           | Files Modified | Risk Level  | Estimated Effort |
| --------------- | -------------- | ----------- | ---------------- |
| 1. Type Safety  | ~5 files       | Low         | Small            |
| 2. Logging      | ~15 files      | Medium      | Medium           |
| 3. TODO/FIXME   | ~30 files      | Medium-High | Medium           |
| 4. Final Polish | ~20 files      | Low         | Small            |

## Documentation

- Design document: `docs/plans/2026-01-22-code-cleanup-design.md` (this file)
- TODO audit: `docs/TODO_AUDIT.md` (created during Phase 3)
- Completion report: `docs/CODE_CLEANUP_REPORT_2026-01-22.md` (created after
  completion)

## Related Documents

- `docs/NEXT_STEPS.md` - Project roadmap
- `docs/ARCHITECTURE.md` - Architecture overview
- `scripts/quality-gates.js` - Quality gate definitions
