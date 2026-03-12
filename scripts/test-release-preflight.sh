#!/bin/bash
#
# Release Preflight Test Script
#
# This script validates that all preflight checks for a release pass locally.
# It mirrors the checks performed in .github/workflows/release-preflight.yml
#
# Usage:
#   ./scripts/test-release-preflight.sh
#
# Exit codes:
#   0 - All checks passed
#   1 - One or more checks failed

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0
WARNED=0

# Print header
echo "=================================="
echo "Release Preflight Checks"
echo "=================================="
echo ""

# Helper functions
pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNED++))
}

section() {
    echo ""
    echo "$1"
    echo "${1//?/-}"
}

# Change to app directory
cd "$(dirname "$0")/../app" || exit 1

# 1. Lint Check
section "1. Lint Check"
if yarn lint > /dev/null 2>&1; then
    pass "Linting passed"
else
    fail "Linting failed"
    echo "  Run: yarn lint"
fi

# 2. Type Check
section "2. Type Check"
if yarn typecheck > /dev/null 2>&1; then
    pass "Type checking passed"
else
    fail "Type checking failed"
    echo "  Run: yarn typecheck"
fi

# 3. Unit Tests
section "3. Unit Tests"
if yarn test:coverage > /dev/null 2>&1; then
    pass "Unit tests passed"
else
    fail "Unit tests failed"
    echo "  Run: yarn test:coverage"
fi

# 4. Security Audit
section "4. Security Audit"
if yarn audit --audit-level moderate > /dev/null 2>&1; then
    pass "Security audit passed (no moderate+ vulnerabilities)"
else
    warn "Security audit found vulnerabilities"
    echo "  Run: yarn audit"
    echo "  Review: Check if vulnerabilities are acceptable"
fi

# 5. Build Library
section "5. Build Library"
if yarn build:lib > /dev/null 2>&1; then
    pass "Library build succeeded"
else
    fail "Library build failed"
    echo "  Run: cd app && yarn build:lib"
fi

# 6. Verify Build Output
section "6. Verify Build Output"
if [ ! -d "dist" ]; then
    fail "Build directory (dist/) not found"
else
    pass "Build directory exists"

    # Check for required files
    REQUIRED_FILES=(
        "dist/index.js"
        "dist/index.mjs"
    )

    MISSING_FILES=()
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            MISSING_FILES+=("$file")
        fi
    done

    if [ ${#MISSING_FILES[@]} -gt 0 ]; then
        fail "Missing required build files:"
        for file in "${MISSING_FILES[@]}"; do
            echo "    - $file"
        done
    else
        pass "All required build files present"
    fi

    # Check bundle sizes
    if [ -f "dist/index.js" ] && [ -f "dist/index.mjs" ]; then
        CJS_SIZE=$(stat -f%z "dist/index.js" 2>/dev/null || stat -c%s "dist/index.js")
        ESM_SIZE=$(stat -f%z "dist/index.mjs" 2>/dev/null || stat -c%s "dist/index.mjs")

        CJS_SIZE_KB=$((CJS_SIZE / 1024))
        ESM_SIZE_KB=$((ESM_SIZE / 1024))

        echo "    CJS bundle: ${CJS_SIZE_KB}KB"
        echo "    ESM bundle: ${ESM_SIZE_KB}KB"

        # Reject bundles larger than 10MB
        if [ $CJS_SIZE -gt 10485760 ]; then
            fail "CJS bundle exceeds 10MB limit"
        else
            pass "CJS bundle size acceptable"
        fi

        if [ $ESM_SIZE -gt 10485760 ]; then
            fail "ESM bundle exceeds 10MB limit"
        else
            pass "ESM bundle size acceptable"
        fi
    fi
fi

# 7. Packaging Tests
section "7. Packaging Tests"
if yarn test tests/packaging/ > /dev/null 2>&1; then
    pass "Packaging tests passed"
else
    fail "Packaging tests failed"
    echo "  Run: cd app && yarn test tests/packaging/"
fi

# 8. Validate Export Map
section "8. Validate Export Map"
EXPORT_VALIDATION=$(node -e "
    const fs = require('fs');
    const path = require('path');

    const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const exports = pkgJson.exports || {};

    let missing = [];
    let hasErrors = false;

    for (const [subpath, config] of Object.entries(exports)) {
        if (!config || typeof config !== 'object') continue;

        const conditions = ['import', 'require', 'types'];
        for (const condition of conditions) {
            if (config[condition]) {
                const target = config[condition];
                if (!target.startsWith('./dist/')) {
                    console.log('ERROR: Export ' + subpath + ' [' + condition + '] does not point to dist/: ' + target);
                    hasErrors = true;
                }

                const fullPath = path.join('.', target);
                if (!fs.existsSync(fullPath)) {
                    missing.push(subpath + ' [' + condition + '] -> ' + target);
                }
            }
        }
    }

    if (hasErrors) {
        process.exit(1);
    }

    if (missing.length > 0) {
        console.log('ERROR: Missing export files:');
        missing.forEach(f => console.log('  ' + f));
        process.exit(1);
    }

    console.log('OK');
" 2>&1)

if echo "$EXPORT_VALIDATION" | grep -q "OK"; then
    pass "Export map validation passed"
elif echo "$EXPORT_VALIDATION" | grep -q "ERROR"; then
    fail "Export map validation failed:"
    echo "$EXPORT_VALIDATION" | grep "ERROR" | sed 's/^/    /'
else
    fail "Export map validation failed with unknown error"
fi

# 9. Version Consistency
section "9. Version Consistency"
PACKAGE_VERSION=$(node -e "console.log(require('./package.json').version)")
GIT_TAG=$(git describe --tags --exact-match 2>/dev/null || echo "")

if [ -n "$GIT_TAG" ]; then
    TAG_VERSION="${GIT_TAG#v}"

    echo "    Package version: $PACKAGE_VERSION"
    echo "    Git tag: $GIT_TAG"

    if [ "$PACKAGE_VERSION" != "$TAG_VERSION" ]; then
        fail "Version mismatch: package.json has $PACKAGE_VERSION but tag is $GIT_TAG"
    else
        pass "Version consistency validated"
    fi
else
    warn "No git tag found - skipping version consistency check"
    echo "    Tag your release with: git tag v${PACKAGE_VERSION}"
fi

# 10. Git Status
section "10. Git Status"
cd "$(dirname "$0")/.." || exit 1

if [ -n "$(git status --porcelain)" ]; then
    fail "Working directory has uncommitted changes"
    echo "    Commit or stash changes before releasing"
else
    pass "Working directory is clean"
fi

# Summary
echo ""
echo "=================================="
echo "Summary"
echo "=================================="
echo "Passed:  $PASSED"
echo "Failed:  $FAILED"
echo "Warnings: $WARNED"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Preflight checks failed${NC}"
    echo ""
    echo "Please fix the failures above before creating a release."
    echo "See docs/release/RELEASE.md for detailed troubleshooting."
    exit 1
else
    echo -e "${GREEN}✅ All critical checks passed${NC}"
    echo ""
    echo "The release is ready to proceed."
    echo "Create a git tag to trigger the release workflow:"
    echo "  git tag v${PACKAGE_VERSION}"
    echo "  git push origin v${PACKAGE_VERSION}"
    exit 0
fi
