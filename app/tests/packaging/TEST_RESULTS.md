# Export Validation Test Results Summary

Note: This summary reflects a previous packaging setup. As of 2026-01-09,
exports now target `dist/index.js`/`dist/index.mjs` and subpath bundles
(`dist/core.*`, `dist/charts/index.*`, etc.) are expected after `build:lib`.

## Current Status: 23/29 Tests Passing ✓

The packaging/export validation test is working as designed. Here's what the
results mean:

## Test Results Breakdown

### ✓ Passing Tests (23 tests)

These tests validate that the package configuration is correct:

1. **Package.json Export Configuration (3/3)**
   - ✓ package.json has exports field
   - ✓ All expected subpath exports are defined
   - ✓ Export paths match expectations

2. **Source File Validation (2/2)**
   - ✓ All source barrel files exist
   - ✓ Source files have valid TypeScript syntax

3. **Export Content Validation (10/10)**
   - ✓ Core exports: locale utils, config validation, types
   - ✓ Core exports TypeScript types
   - ✓ Client exports: DataGovRsClient and types
   - ✓ Charts export all components (LineChart, BarChart, etc.)
   - ✓ Charts export types
   - ✓ LineChart specifically exported
   - ✓ Hooks export all custom hooks
   - ✓ Utils export transforms and formatters

4. **Preconstruct Configuration (2/2)**
   - ✓ Preconstruct entrypoints configured
   - ✓ All expected entrypoints present

5. **Package Metadata (3/3)**
   - ✓ Correct main, module, types fields
   - ✓ Correct package name (@acailic/vizualni-admin)
   - ✓ Correct publishConfig for public registry

6. **Export Consistency (2/2)**
   - ✓ Consistent exports across package.json and preconstruct
   - ✓ Valid file extensions in exports

7. **Type Safety Validation (2/2)**
   - ✓ All subpaths have type definitions configured
   - ✓ typesVersions is configured

8. **Build Artifacts (1/7)**
   - ✓ TypeScript declaration files are valid (when they exist)

### × Failing Tests (6 tests)

These tests fail because the `dist/` directory doesn't contain all built
artifacts:

1. **Main entry point files** - Missing `dist/index.d.ts` and
   `dist/acailic-vizualni-admin.esm.js`
2. **Core subpath files** - Missing `dist/core.*` files
3. **Client subpath files** - Missing `dist/client.*` files
4. **Charts subpath files** - Missing `dist/charts/*.*` files
5. **Hooks subpath files** - Missing `dist/hooks/*.*` files
6. **Utils subpath files** - Missing `dist/utils/*.*` files

## Why These Failures Are Expected

The test detected that `dist/` exists but is incomplete. Currently, only
`dist/acailic-vizualni-admin.cjs.js` exists from a partial build.

### Current dist/ contents:

```
dist/
├── acailic-vizualni-admin.cjs.js       ✓ exists
├── acailic-vizualni-admin.cjs.d.ts     ✓ exists
└── acailic-vizualni-admin.esm.js       → symlink to source (not built)
```

### Expected dist/ contents:

```
dist/
├── acailic-vizualni-admin.cjs.js
├── acailic-vizualni-admin.cjs.d.ts
├── acailic-vizualni-admin.esm.js
├── index.d.ts
├── core.cjs.js
├── core.esm.js
├── core.d.ts
├── client.cjs.js
├── client.esm.js
├── client.d.ts
├── charts/
│   ├── index.cjs.js
│   ├── index.esm.js
│   └── index.d.ts
├── hooks/
│   ├── index.cjs.js
│   ├── index.esm.js
│   └── index.d.ts
└── utils/
    ├── index.cjs.js
    ├── index.esm.js
    └── index.d.ts
```

## How to Achieve Full Test Success

### Option 1: Run the full library build

```bash
cd app
npm run build:lib
npm test -- tests/packaging/exports --run
```

This will build all entrypoints and all 29 tests should pass.

### Option 2: Use preconstruct (recommended)

```bash
cd app
npm run build:preconstruct
npm test -- tests/packaging/exports --run
```

Preconstruct will build all entrypoints correctly with proper types.

## Test Design Philosophy

This test is designed to be **graceful** in development:

1. **If dist doesn't exist**: Tests skip build artifact validation and only
   validate configuration
2. **If dist exists but incomplete**: Tests report missing artifacts (current
   state)
3. **If dist is complete**: All tests pass

This approach ensures:

- Developers get useful feedback about package configuration
- CI/CD can validate actual build artifacts
- Tests don't unnecessarily fail during active development

## What This Test Validates

This is a **"meta-test"** that validates packaging, not functionality:

✓ **Validates**: Package exports are configured correctly ✓ **Validates**: Type
definitions exist and are referenced ✓ **Validates**: Re-exports match
expectations (e.g., LineChart from charts) ✓ **Validates**: Build tooling
(preconstruct) matches package.json ✓ **Validates**: File extensions and naming
conventions

✗ **Does NOT validate**: The actual functionality of the code ✗ **Does NOT
validate**: Runtime behavior ✗ **Does NOT validate**: Component rendering

## Next Steps

1. **For immediate validation**: The test is working correctly and validating
   configuration
2. **For full validation**: Run `npm run build:preconstruct` to generate all
   artifacts
3. **For CI/CD**: Add this test to ensure releases have proper exports

## Files Created

1. **`tests/packaging/exports.spec.ts`** - Main test file (29 tests)
2. **`tests/packaging/README.md`** - Documentation for the test suite

## Test Command

```bash
# Run the test
npm test -- tests/packaging/exports --run

# Run with verbose output
npm test -- tests/packaging/exports --run --reporter=verbose

# Run with coverage
npm run test:coverage -- tests/packaging
```
