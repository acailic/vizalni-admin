# Test Infrastructure Documentation

## Overview

This document describes the comprehensive test infrastructure implemented for the vizualni-admin project to achieve Phase 2 quality standards. The infrastructure supports unit tests, integration tests, accessibility tests, visual regression tests, and CI/CD quality gates.

## Coverage Targets (Phase 2)

- **Lines**: 80% (increased from 50%)
- **Functions**: 80% (increased from 50%)
- **Branches**: 75% (increased from 50%)
- **Statements**: 80% (increased from 50%)

## Test Types

### 1. Unit Tests
- **Framework**: Vitest 3.1.4
- **Location**: `app/tests/unit/` and `app/**/*.{test,spec}.{ts,tsx}`
- **Purpose**: Test individual components and functions in isolation

### 2. Integration Tests
- **Framework**: Vitest + MSW for API mocking
- **Location**: `app/tests/integration/`
- **Purpose**: Test component interactions and user journeys
- **Features**:
  - API mocking with MSW
  - User flow testing
  - Form submission testing
  - Performance measurement

### 3. Accessibility Tests
- **Tools**: axe-core + jest-axe
- **Location**: Integrated with unit tests
- **Purpose**: WCAG 2.1 AA compliance
- **Features**:
  - Automated accessibility violation detection
  - Color contrast testing
  - Keyboard navigation testing
  - ARIA attribute validation

### 4. Visual Regression Tests
- **Framework**: Playwright with custom configuration
- **Location**: `app/tests/visual/`
- **Purpose**: Detect visual changes across browsers and viewports
- **Features**:
  - Multi-browser testing (Chrome, Firefox, Safari)
  - Responsive design testing
  - Dark mode testing
  - RTL layout testing
  - High contrast mode testing

## Configuration

### Vitest Configuration
```typescript
// app/vitest.config.ts
export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

### Playwright Visual Configuration
```typescript
// playwright.visual.config.ts
export default defineConfig({
  projects: [
    { name: 'chrome-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chrome-mobile', use: { ...devices['Pixel 5'] } },
    { name: 'chrome-dark', use: { colorScheme: 'dark' } },
    // ... more configurations
  ],
});
```

## Testing Utilities

### Accessibility Testing
```typescript
import { runComprehensiveA11yTests } from '@/test-utils/accessibility';

// Test component for accessibility
await runComprehensiveA11yTests(<MyComponent />);
```

### Integration Testing
```typescript
import { testUserFlow, mockApiHandlers } from '@/test-utils/integration';

// Test user journey
await testUserFlow([
  { action: () => user.click(loginButton), description: "Click login" },
  { expectation: () => expect(screen.getByText("Welcome")).toBeInTheDocument(), description: "Verify welcome" }
]);
```

### Visual Testing
```typescript
import { testResponsiveDesign } from '@/test-utils/visual-regression';

// Test responsive design
await testResponsiveDesign(page, '/dashboard', 'dashboard');
```

## CI/CD Integration

### Quality Gates
1. **Linting**: ESLint must pass
2. **Type Checking**: TypeScript compilation must pass
3. **Coverage**: All thresholds must be met
4. **Accessibility**: No critical violations
5. **E2E Tests**: All critical user paths must work
6. **Security**: No moderate/high vulnerabilities
7. **Performance**: Lighthouse score above threshold

### Workflows
1. **Test Quality Gate** (`.github/workflows/test-quality-gate.yml`)
   - Runs on all PRs and pushes
   - Enforces coverage thresholds
   - Runs all test suites
   - Generates comprehensive reports

2. **Visual Regression** (`.github/workflows/visual-regression.yml`)
   - Runs on all PRs and pushes
   - Tests across browsers and viewports
   - Generates diff reports
   - Comments PRs with results

## Test Commands

```bash
# Run all tests with coverage
yarn test:coverage

# Run accessibility tests only
yarn test:accessibility

# Run visual regression tests
yarn test:visual

# Run integration tests
yarn test:integration

# Run all test suites
yarn test:all

# Check coverage against thresholds
yarn coverage:check
```

## Directory Structure

```
ai_working/vizualni-admin/
├── app/
│   ├── test-utils/
│   │   ├── accessibility.ts      # Accessibility testing utilities
│   │   ├── integration.ts        # Integration testing utilities
│   │   └── visual-regression.ts  # Visual testing utilities
│   ├── tests/
│   │   ├── integration/          # Integration test files
│   │   ├── visual/              # Visual regression test files
│   │   └── *.test.tsx           # Unit test files
│   ├── vitest.config.ts         # Vitest configuration
│   └── vitest.setup.ts          # Test setup file
├── playwright.visual.config.ts  # Playwright visual config
├── screenshots/                # Visual test screenshots
├── coverage/                   # Test coverage reports
└── .github/
    └── workflows/
        ├── test-quality-gate.yml
        └── visual-regression.yml
```

## Best Practices

### Writing Tests
1. **Unit Tests**: Test one thing at a time
2. **Integration Tests**: Test complete user flows
3. **Accessibility Tests**: Use semantic HTML and ARIA
4. **Visual Tests**: Test multiple states and viewports

### Test Organization
1. Group related tests in `describe` blocks
2. Use descriptive test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies

### Coverage
1. Focus on critical paths first
2. Test error conditions
3. Test edge cases and boundaries
4. Avoid testing implementation details

## Performance Considerations

### Test Performance
- Parallel test execution where possible
- Use test isolation to prevent cross-test interference
- Optimize API mocking for faster tests
- Use proper cleanup in test teardown

### Application Performance
- Performance benchmarks in integration tests
- Lighthouse audits in CI/CD
- Bundle size analysis
- Runtime performance monitoring

## Troubleshooting

### Common Issues
1. **Coverage Below Threshold**: Add tests for uncovered paths
2. **Flaky Visual Tests**: Increase wait times or stabilize dynamic content
3. **Mock API Failures**: Verify MSW handlers are correctly configured
4. **Accessibility Violations**: Check semantic HTML and ARIA attributes

### Debugging
1. Use `--reporter=verbose` for detailed test output
2. Check test artifacts in CI/CD
3. Run tests locally with same configuration as CI
4. Use browser dev tools for visual test debugging

## Maintenance

### Regular Updates
1. Update test dependencies monthly
2. Review and update baseline screenshots
3. Audit and update mock API responses
4. Review coverage thresholds periodically

### Monitoring
1. Monitor test execution times
2. Track flaky test rates
3. Review coverage trends
4. Monitor visual test diff rates

## Phase 2 Goals Achievement

✅ **Coverage Thresholds**: Increased to 80% (lines, functions, statements) and 75% (branches)
✅ **Accessibility Testing**: Comprehensive WCAG 2.1 AA compliance testing
✅ **Visual Regression**: Multi-browser, multi-viewport testing
✅ **Integration Testing**: End-to-end user journey testing
✅ **CI/CD Quality Gates**: Automated quality enforcement
✅ **Performance Monitoring**: Lighthouse audits and benchmarks
✅ **Security Testing**: Automated vulnerability scanning

The test infrastructure now provides comprehensive quality assurance suitable for Phase 2 development standards.