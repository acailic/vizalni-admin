# Release Guide (library publish)

This repository is configured to publish the `@acailic/vizualni-admin` package
from the `app` workspace to npm.

## Prerequisites

- npm account with publish rights to `@acailic` scope.
- `NPM_TOKEN` secret added to GitHub repository settings (for automated
  releases).
- All CI checks passing on the branch to be released

## Release Process

### Automated Release (Recommended)

1.  Update the version in `app/package.json`.
2.  Commit and push the change.
3.  Create a new git tag matching the version (e.g., `v3.4.10`).
    ```sh
    git tag v3.4.10
    git push origin v3.4.10
    ```
4.  The GitHub Action `release.yml` will automatically build and publish the
    package to npm.

### Manual Release

1.  Build npm artifacts:
    ```sh
    yarn build:lib
    ```
2.  Publish the `app` workspace:
    ```sh
    cd app && npm publish
    ```

## Pre-Release Checklist

Before creating a release tag or publishing, ensure all preflight checks pass:

### 1. Code Quality Gates

```bash
# Linting
yarn lint

# Type checking
yarn typecheck

# Unit tests with coverage
yarn test:coverage
```

**Success criteria:**

- No linting errors
- No type errors
- All tests pass
- Coverage meets minimum thresholds (if configured)

### 2. Build Validation

```bash
# Build the library
cd app && yarn build:lib

# Verify build output
ls -la app/dist/
```

**Success criteria:**

- `app/dist/` directory exists and contains built files
- Both CJS (`.js`) and ESM (`.mjs`) bundles are present
- TypeScript declaration files (`.d.ts`) are generated (if enabled)
- Bundle sizes are reasonable (< 10MB per bundle)

### 3. Packaging Tests

```bash
# Run packaging validation tests
cd app && yarn test tests/packaging/
```

**Success criteria:**

- All packaging tests pass
- All export paths in `package.json` have corresponding files in `dist/`
- Peer dependencies are externalized (not bundled)
- Expected exports are accessible

### 4. Documentation Checks

```bash
# Build documentation
yarn docs:build

# Verify documentation builds successfully
```

**Success criteria:**

- Documentation builds without errors
- API documentation is up-to-date (if applicable)
- CHANGELOG.md is updated for the release

### 5. Version Validation

```bash
# Verify version consistency
grep '"version"' app/package.json
```

**Success criteria:**

- Version in `app/package.json` matches intended release version
- Version follows semantic versioning (MAJOR.MINOR.PATCH)
- For pre-releases: use `-alpha.N`, `-beta.N`, or `-rc.N` suffix

### 6. Dependency Audit

```bash
# Check for vulnerabilities
yarn audit

# Check for outdated dependencies
yarn outdated
```

**Success criteria:**

- No high or critical vulnerabilities
- Outdated dependencies are reviewed and acceptable for release

### 7. Git Status

```bash
# Check working directory is clean
git status

# Verify correct branch is checked out
git branch --show-current
```

**Success criteria:**

- Working directory is clean (no uncommitted changes)
- On the correct branch (typically `main` for releases)
- All intended changes are committed

## Release Preflight CI Workflow

The project includes a CI workflow (`.github/workflows/release-preflight.yml`)
that automatically runs all preflight checks when a release tag is pushed. This
ensures that releases cannot be published if any check fails.

### What the CI Checks

1. **Lint & Type Check**: Runs ESLint and TypeScript compiler
2. **Unit Tests**: Executes full test suite with coverage
3. **Build Library**: Compiles the library bundle (`yarn build:lib`)
4. **Packaging Tests**: Validates dist artifacts and export configuration
5. **Security Audit**: Runs npm audit for vulnerabilities

### CI Gates

The release workflow will **fail** if:

- Any linting errors are present
- Type checking fails
- Any tests fail
- Build produces errors
- Packaging tests fail
- High/critical security vulnerabilities are found

## Post-Release Verification

After a release is published:

### 1. Verify npm Package

```bash
# View published package info
npm view @acailic/vizualni-admin

# Check published files
npm view @acailic/vizualni-admin dist.tarball
```

### 2. Test Installation

```bash
# Create a test project
mkdir test-release && cd test-release
npm init -y
npm install @acailic/vizualni-admin

# Verify imports work
node -e "const pkg = require('@acailic/vizualni-admin'); console.log(pkg.version)"
```

### 3. Verify GitHub Release

- Check that the GitHub release was created
- Verify release notes are correct
- Check that release tags are properly formatted

## Rollback Procedure

If a release needs to be rolled back:

### Automated Rollback

Use the GitHub Actions workflow dispatch:

1. Go to Actions → Release Package
2. Click "Run workflow"
3. Enter the version to rollback
4. The workflow will unpublish from npm and delete the GitHub release

### Manual Rollback

```bash
# Unpublish from npm (within 72 hours)
npm unpublish @acailic/vizualni-admin@version --force

# Delete the git tag
git tag -d vversion
git push origin :refs/tags/vversion
```

## Release Artifacts

The following files are published to npm:

### Built Files

- `dist/index.js` - CommonJS bundle
- `dist/index.mjs` - ES Module bundle
- `dist/index.d.ts` - TypeScript declarations (if enabled)
- `dist/core.js`, `dist/core.mjs` - Core exports
- `dist/client.js`, `dist/client.mjs` - Client exports
- `dist/charts/index.js`, `dist/charts/index.mjs` - Chart exports
- `dist/hooks/index.js`, `dist/hooks/index.mjs` - Hook exports
- `dist/utils/index.js`, `dist/utils/index.mjs` - Utility exports

### Metadata Files

- `package.json` - Package metadata
- `README.md` - Package documentation
- `LICENSE` - License file
- `CHANGELOG.md` - Version history

### Locale Files

- `locales/*.json` - Translation files

## Troubleshooting

### Build Fails

**Symptom**: `yarn build:lib` fails with errors

**Solutions**:

- Check TypeScript errors: `yarn typecheck`
- Verify all dependencies are installed: `yarn install`
- Check for circular dependencies in imports
- Review tsup.config.ts for configuration errors

### Packaging Tests Fail

**Symptom**: Packaging tests report missing files

**Solutions**:

- Run `yarn build:lib` to regenerate dist files
- Check that tsup.config.ts includes all entry points
- Verify package.json exports match built files
- Check for typos in export paths

### Type Declaration Errors

**Symptom**: Missing or incorrect `.d.ts` files

**Solutions**:

- Ensure `yarn build:dts` runs successfully
- Check `scripts/copy-dts.js` for errors
- Verify tsconfig.dts.json configuration
- Manually run: `cd app && yarn build:dts`

### CI Fails on Release Tag

**Symptom**: Release workflow fails after pushing tag

**Solutions**:

- Check workflow logs for specific failure
- Ensure all tests pass locally first
- Verify NPM_TOKEN secret is set in GitHub
- Check that tag format matches version in package.json

## Notes

- The published outputs are in the `app/dist` folder (e.g., `index.js`,
  `index.mjs`, `charts/index.mjs`).
- Ensure you have logged in with `npm login` before manual publishing.
- CI preflight checks prevent releases that fail any validation step.
- Always test releases in a clean environment before announcing.
