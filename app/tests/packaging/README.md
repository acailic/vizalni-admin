# Packaging and Export Tests

This directory contains tests that validate the build artifacts and packaging
configuration for the `@acailic/vizualni-admin` package.

## Test Files

### 1. `dist-artifacts.spec.ts`

Validates the actual built distribution artifacts in the `dist/` directory.

**What it tests:**

- Build output structure (dist directory exists, contains files)
- Main entry points (CJS and ESM bundles)
- TypeScript declaration files (if DTS generation is enabled)
- Dependency bundling (peer dependencies are externalized, regular deps are
  bundled)
- Export validation (expected symbols are exported)
- Bundle quality (size, minification, source maps)
- Package.json consistency (main, module, types fields match actual files)
- Subpath exports configuration
- Build process integration (scripts, hooks)
- Consumption tests (bundles are require-able/import-able)

**Key validations:**

- ✓ Both CJS (`index.js`) and ESM (`index.mjs`) bundles are created
- ✓ Bundles are non-empty and properly formatted
- ✓ Peer dependencies (@lingui/\*, d3-format, etc.) are externalized
- ✓ Expected exports (version, i18n, locales, DataGovRsClient, etc.) are present
- ✓ Bundle sizes are reasonable (~150KB for ESM, ~160KB for CJS)

### 2. `build-config.spec.ts`

Validates the build configuration files and package.json metadata.

**What it tests:**

- `tsup.config.ts` structure and options
- External dependencies configuration
- Package.json build scripts (build:lib, clean, postbuild)
- Entry points configuration (main, module, types, exports)
- Preconstruct configuration (if used)
- Source file structure (barrel files exist)
- TypeScript configuration
- Dependency validation (peer deps, regular deps)

**Key validations:**

- ✓ tsup config specifies entry points, formats, external deps
- ✓ Build scripts are properly configured
- ✓ Package.json exports field is correctly structured
- ✓ Peer dependencies are defined and not in regular dependencies

### 3. `exports.spec.ts`

Validates the package export configuration and source file structure.

**What it tests:**

- Package.json exports field structure
- Export paths match expected values
- Preconstruct entrypoints match exports
- Source barrel files exist and are valid
- Export content validation (re-exports are correct)
- Type safety validation (typesVersions configured)

**Key validations:**

- ✓ All subpath exports (., ./core, ./client, ./charts, ./hooks, ./utils) are
  defined
- ✓ Export paths point to dist directory
- ✓ Source files have correct export statements

## Current Build State

**Build Tool:** tsup (TypeScript bundler)

**Entry Points:**

- Main: `index.ts` → `dist/index.js`, `dist/index.mjs`
- Core: `exports/core.ts` → `dist/core.js`, `dist/core.mjs`
- Client: `exports/client.ts` → `dist/client.js`, `dist/client.mjs`
- Charts: `exports/charts/index.ts` → `dist/charts/index.js`,
  `dist/charts/index.mjs`
- Hooks: `exports/hooks/index.ts` → `dist/hooks/index.js`,
  `dist/hooks/index.mjs`
- Utils: `exports/utils/index.ts` → `dist/utils/index.js`,
  `dist/utils/index.mjs`

**Output Files (representative):**

- `dist/index.js`, `dist/index.mjs`
- `dist/core.js`, `dist/core.mjs`
- `dist/client.js`, `dist/client.mjs`
- `dist/charts/index.js`, `dist/charts/index.mjs`
- `dist/hooks/index.js`, `dist/hooks/index.mjs`
- `dist/utils/index.js`, `dist/utils/index.mjs`

**Known Limitations:**

1. **TypeScript declarations disabled**: DTS generation is currently disabled in
   tsup.config.ts (`dts: false`). This means no `.d.ts` files are generated.

2. **Source maps disabled**: Source map generation is currently disabled
   (`sourcemap: false`).

## Running the Tests

```bash
# Run all packaging tests
npm test -- tests/packaging/

# Run specific test file
npm test -- tests/packaging/dist-artifacts.spec.ts
npm test -- tests/packaging/build-config.spec.ts
npm test -- tests/packaging/exports.spec.ts

# Run with coverage
npm run test:coverage -- tests/packaging/
```

## Recommendations

To improve the build process:

1. **Enable DTS generation**: Set `dts: true` in tsup.config.ts to generate
   TypeScript declarations

2. **Enable source maps**: Set `sourcemap: true` for better debugging

3. **Consider using preconstruct**: The package.json has preconstruct
   configuration, which could handle multi-entry builds more elegantly

## Test Coverage

The packaging tests provide "meta-test" coverage - they validate the build and
packaging process rather than the library functionality. This ensures:

- The package can be properly published to npm
- Consumers can import from the package correctly
- Dependencies are properly externalized
- The bundle structure is correct
- The package follows npm best practices
