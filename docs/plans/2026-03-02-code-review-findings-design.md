# Code Review Findings & Remediation Design

**Date**: 2026-03-02
**Status**: Pre-release Review
**Reviewer**: Claude Code Assistant
**Scope**: @vizualni/core, @vizualni/connectors, @vizualni/react

## Executive Summary

Comprehensive code review identified **20+ issues** across the three packages, with **4 critical** bugs that could cause runtime failures. The review focused on bug prevention as the primary concern for this pre-release review.

### Issue Distribution

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 4 | Will cause runtime failures |
| 🟠 High | 9 | API correctness issues |
| 🟡 Medium | 6 | Code quality/maintenance |
| 🟢 Low | 1+ | Style/minor improvements |

---

## Critical Issues (Must Fix Before Release)

### 1. Empty Data Array Crash in `computeScales`

**Location**: `packages/core/src/scales/index.ts:66-68`

**Problem**: When `data` is empty, `d3.extent` returns `[undefined, undefined]`, which gets cast to `[Date, Date]` and passed to `scaleTime`.

**Solution**:
```typescript
function computeLineScales(...) {
  if (data.length === 0) {
    // Return default/empty scales
    return {
      x: createTimeScale({ domain: [new Date(), new Date()], range: [0, chartWidth] }),
      y: createLinearScale({ domain: [0, 1], range: [chartHeight, 0] }),
    };
  }
  // ... existing logic
}
```

**Files to modify**:
- `packages/core/src/scales/index.ts`
- Add tests in `packages/core/test/scales/index.test.ts`

---

### 2. Bar Height Calculation Incorrect for Negative Values

**Location**: `packages/core/src/shapes/index.ts:143-144`

**Problem**: The formula `Math.abs(yRange[0] - yRange[1]) - scales.y(value)` doesn't correctly handle bars spanning from y=0 for negative values.

**Solution**:
```typescript
data.forEach((d, i) => {
  const category = String(d[config.x.field]);
  const value = d[config.y.field] as number;

  const x = chartArea.x + (xScale(category) ?? 0);
  const y0 = scales.y(0);  // y position of zero line

  let barY: number;
  let barHeight: number;

  if (value >= 0) {
    barY = scales.y(value);
    barHeight = y0 - barY;
  } else {
    barY = y0;
    barHeight = scales.y(value) - y0;
  }

  // ... rest of shape creation
});
```

**Files to modify**:
- `packages/core/src/shapes/index.ts`
- Add tests for negative value bars

---

### 3. CSV Parser Memory Exhaustion

**Location**: `packages/connectors/src/csv/index.ts:21-42`

**Problem**: Unbounded string growth in CSV parsing with long quoted fields.

**Solution**: Add maximum field length validation:
```typescript
const MAX_FIELD_LENGTH = 100000; // 100KB per field

function parseCsv(text: string, delimiter = ","): string[][] {
  // ... existing logic
  for (let i = 0; i < line.length; i++) {
    // ... existing logic
    current += char;
    if (current.length > MAX_FIELD_LENGTH) {
      throw new Error(`CSV field exceeds maximum length of ${MAX_FIELD_LENGTH}`);
    }
  }
}
```

**Files to modify**:
- `packages/connectors/src/csv/index.ts`

---

### 4. LineChart Scale Type Mismatch

**Location**: `packages/react/src/charts/LineChart.tsx:28`

**Problem**: `scales.x` is asserted as `ScaleTime` regardless of actual scale type.

**Solution**: Use type narrowing or validate config:
```typescript
export function LineChart({ data, config, width, height, className }: LineChartProps) {
  const { scales, layout } = useChart(data, config, { width, height });

  // Validate that we received the expected scale type
  if (typeof scales.x !== 'function' || !('invert' in scales.x)) {
    console.warn('LineChart expects a continuous x-scale (time or linear)');
  }

  // Use type-safe accessor
  const getX = (d: Datum) => {
    const val = d[config.x.field];
    // Handle both Date and number x-values
    return scales.x(val as Parameters<typeof scales.x>[0]);
  };
  // ...
}
```

**Files to modify**:
- `packages/react/src/charts/LineChart.tsx`

---

## High Priority Issues

### 5. Remove Type Casting Bypass

**Location**: `packages/core/src/shapes/index.ts:107-109`

Replace `as (value: unknown) => number` with proper type handling using generics or union types.

### 6. Implement or Remove `orientation` and `stack` Options

**Location**: `packages/core/src/config/index.ts:44-50`

Either:
- Remove these options from the schema until implemented
- Add implementation with proper tests

### 7. Redesign Pie Chart Scale Handling

**Location**: `packages/core/src/scales/index.ts:145-161`

Consider making `Scales.x` and `Scales.y` optional for pie charts, or create a discriminated union type.

### 8. Support Band Scales in XAxis Component

**Location**: `packages/react/src/svg/Axes.tsx:4`

Add `ScaleBand` to the accepted scale types and handle tick rendering appropriately.

### 9. Add Error Handling to PieChart

**Location**: `packages/react/src/charts/PieChart.tsx:25`

Handle `error` property from `useChart` similar to `BarChart`.

### 10. Sort Data in LinePath Component

**Location**: `packages/react/src/svg/LinePath.tsx`

Sort data by x-value before rendering, consistent with core library behavior.

### 11. Improve Date Type Inference

**Location**: `packages/connectors/src/csv/index.ts:57`

Support additional date formats:
```typescript
const DATE_FORMATS = [
  /^\d{4}-\d{2}-\d{2}/,  // ISO: 2024-01-15
  /^\d{2}\/\d{2}\/\d{4}$/,  // US: 01/15/2024
  /^\d{2}-\d{2}-\d{4}$/,  // EU: 15-01-2024
];
```

### 12. Add Network Error Recovery

**Location**: `packages/connectors/src/csv/index.ts`, `packages/connectors/src/json/index.ts`

Add:
- Timeout configuration option
- Retry mechanism
- AbortController support

### 13. Fix useConnector Config Serialization

**Location**: `packages/react/src/hooks/useConnector.ts:44`

Use a stable serialization method or require users to memoize config objects.

---

## Medium Priority Issues

### 14. Consolidate Default Margins

Create a single source of truth for default margins in `packages/core/src/constants.ts`.

### 15. Document Color Scale Behavior

Add JSDoc explaining that `scaleOrdinal` returns `range[0]` for unseen categories.

### 16. Remove Duplicate Type Definitions

Consolidate `FieldSchema` and `FieldType` in core and re-export from connectors.

### 17. Use Core Default Colors in React Components

Replace hardcoded `#4e79a7` with `getDefaultColor(0)`.

### 18. Add Accessibility Improvements

- Keyboard navigation for data points
- Screen reader value announcements
- Focus indicators

### 19. Document JSON Connector Single Object Behavior

Clarify in JSDoc that single objects are wrapped in arrays.

---

## Test Coverage Gaps

| Package | Missing Test | Priority |
|---------|-------------|----------|
| core | Empty data array handling | Critical |
| core | Unknown chart type error | High |
| core | Single-point line chart | High |
| connectors | Network timeout | High |
| connectors | Malformed CSV edge cases | High |
| connectors | Circular JSON in config | Medium |
| react | Component unmount during fetch | High |
| react | Rapid config changes (race conditions) | Medium |

---

## Implementation Priority Order

1. **Phase 1 - Critical Fixes** (Must complete before any release)
   - Empty data handling
   - Negative bar calculation
   - CSV memory protection
   - LineChart type safety

2. **Phase 2 - API Correctness** (Before stable release)
   - Remove unimplemented config options OR implement them
   - Fix scale type issues in axes
   - Error handling consistency
   - Data sorting in LinePath

3. **Phase 3 - Polish** (Before 1.0)
   - Date format support
   - Network resilience
   - Accessibility
   - Test coverage gaps

---

## Files Modified Summary

### Core Package
- `src/scales/index.ts` - Empty data handling, pie scale redesign
- `src/shapes/index.ts` - Negative bar fix, type safety
- `src/config/index.ts` - Remove unimplemented options
- `src/constants.ts` - New file for shared constants
- `test/scales/index.test.ts` - Empty data tests
- `test/shapes/index.test.ts` - Negative value tests

### Connectors Package
- `src/csv/index.ts` - Memory protection, date format support
- `src/json/index.ts` - Network resilience
- `src/types/index.ts` - Remove duplicate types (re-export from core)
- `test/csv/index.test.ts` - Edge case tests

### React Package
- `src/charts/LineChart.tsx` - Type safety
- `src/charts/PieChart.tsx` - Error handling
- `src/charts/BarChart.tsx` - Use core colors
- `src/svg/LinePath.tsx` - Data sorting
- `src/svg/Axes.tsx` - Band scale support
- `src/hooks/useConnector.ts` - Config serialization
- `test/hooks/useConnector.test.ts` - Race condition tests

---

## Acceptance Criteria

Before release, the following must pass:

1. [ ] All existing tests pass
2. [ ] New tests for critical issues pass
3. [ ] No TypeScript errors with strict mode
4. [ ] Empty data doesn't crash any chart type
5. [ ] Negative values render correctly in bar charts
6. [ ] CSV parser handles edge cases gracefully
7. [ ] All chart components handle errors consistently
