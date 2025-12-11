# Contributing to vizualni-admin

Thank you for your interest in contributing to vizualni-admin! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Serbian Language Contributions](#serbian-language-contributions)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- Yarn 1.22.22 (specified in `packageManager`)
- Git

### Setting Up Development Environment

1. **Fork and Clone**
   ```bash
   git fork https://github.com/acailic/vizualni-admin
   cd vizualni-admin
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Set Up Development Environment**
   ```bash
   yarn setup:dev
   ```

   This script will:
   - Install all dependencies
   - Compile locale catalogs
   - Set up the development database (if needed)

4. **Start Development Server**
   ```bash
   yarn dev
   ```

   The application will be available at `http://localhost:3000`

### Project Structure

```
vizualni-admin/
├── app/                    # Main application code
│   ├── pages/             # Next.js pages
│   ├── components/        # React components
│   ├── charts/            # Chart implementations
│   ├── lib/               # Utility libraries
│   ├── locales/           # i18n translations
│   └── domain/            # Domain logic (data-gov-rs client)
├── examples/              # Usage examples
├── docs/                  # Documentation
├── .storybook/           # Storybook configuration
└── tests/                # Test files
```

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-bar-chart` - For new features
- `fix/chart-rendering-bug` - For bug fixes
- `docs/update-readme` - For documentation
- `refactor/simplify-locale-logic` - For refactoring

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(charts): add scatter plot component

Implements scatter plot visualization with:
- D3-based rendering
- Interactive tooltips
- Accessibility support

Closes #123
```

```bash
fix(i18n): correct Serbian Cyrillic date formatting

The date formatter was using Latin script conventions
for Cyrillic dates, causing display issues.
```

### Making Changes

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code style guidelines

3. **Write/update tests** for your changes

4. **Run tests** to ensure everything works
   ```bash
   yarn test
   yarn test:accessibility
   ```

5. **Run linting and formatting**
   ```bash
   yarn lint
   ```

6. **Compile locale catalogs** if you modified translations
   ```bash
   yarn locales:compile
   ```

7. **Commit your changes** using conventional commit format

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create a Pull Request** on GitHub

## Code Style Guidelines

### TypeScript

- **Use TypeScript** for all new code
- **Enable strict mode** - all code must pass TypeScript strict checks
- **Document public APIs** with JSDoc comments
- **Use type inference** where reasonable, explicit types for public APIs

```typescript
/**
 * Parses a locale string and returns a valid locale or default
 * @param locale - The locale string to parse (e.g., "sr-Latn", "en")
 * @returns A valid locale from the supported set
 */
export function parseLocaleString(locale: string): Locale {
  return locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
}
```

### React Components

- **Use functional components** with hooks
- **Prefer composition** over inheritance
- **Keep components focused** - single responsibility
- **Use TypeScript** for props interfaces

```typescript
interface ChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  title: string;
}

export function LineChart({ data, width = 600, height = 400, title }: ChartProps) {
  // Component implementation
}
```

### Styling

- **Use Tailwind CSS** for styling where possible
- **Use MUI components** for complex UI elements
- **Follow accessibility guidelines** (WCAG AAA when possible)
- **Support responsive design** - test on mobile and desktop

### File Organization

- **Co-locate related files** - keep components, styles, and tests together
- **Use index.ts** for clean exports
- **Separate concerns** - presentational vs. container components

## Testing

### Test Requirements

All contributions must include appropriate tests:

- **Unit tests** for utility functions and business logic
- **Component tests** for React components
- **Integration tests** for complex features
- **Accessibility tests** for UI components
- **E2E tests** for critical user flows (optional but recommended)

### Running Tests

```bash
# Run all unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run accessibility tests
yarn test:accessibility

# Run visual regression tests
yarn test:visual

# Run e2e tests
yarn e2e

# Check test coverage
yarn test:coverage
```

### Writing Tests

```typescript
// app/components/Chart/__tests__/LineChart.test.tsx
import { render, screen } from '@testing-library/react';
import { LineChart } from '../LineChart';

describe('LineChart', () => {
  const mockData = [
    { label: '2020', value: 100 },
    { label: '2021', value: 150 },
  ];

  it('renders chart with title', () => {
    render(<LineChart data={mockData} title="Test Chart" />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(<LineChart data={mockData} title="Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Submitting Changes

### Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add or update tests** for your changes
3. **Ensure all tests pass** locally
4. **Update CHANGELOG.md** with your changes (under "Unreleased")
5. **Create Pull Request** with a clear description

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Accessibility tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project's code style
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] I have added tests that prove my fix/feature works
- [ ] All tests pass locally
- [ ] I have updated CHANGELOG.md
```

### Review Process

- At least one maintainer must approve your PR
- CI checks must pass
- Address reviewer feedback promptly
- Be open to suggestions and discussions

## Serbian Language Contributions

### Localization Guidelines

When contributing translations or Serbian-specific features:

1. **Support both scripts** - Latin (sr-Latn) and Cyrillic (sr-Cyrl)
2. **Test with both scripts** - ensure text renders correctly
3. **Follow Serbian conventions** - date formats, number formats, etc.
4. **Update locale catalogs**:
   ```bash
   yarn locales:extract  # Extract new strings
   yarn locales:compile  # Compile catalogs
   ```

### Translation Files

- Locale files are in `app/locales/`
- Use Lingui for i18n: `<Trans>` component or `t` macro
- Follow existing translation patterns

```typescript
import { Trans } from '@lingui/macro';

function MyComponent() {
  return <Trans>Vizualizacija podataka</Trans>;
}
```

### Serbian Data Integration

When working with data.gov.rs integration:
- Follow the API client patterns in `app/domain/data-gov-rs/`
- Handle both Latin and Cyrillic responses
- Include error handling for network issues
- Add appropriate TypeScript types

## Publishing (Maintainers Only)

### Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md with release date
3. Create git tag: `git tag v0.1.0-beta.2`
4. Push tag: `git push --tags`
5. Publish to npm: `yarn release:npm`
6. Create GitHub release with changelog

## Questions or Need Help?

- **Issues**: [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions)
- **Email**: acailic@example.com

## License

By contributing to vizualni-admin, you agree that your contributions will be licensed under the BSD-3-Clause License.

---

Thank you for contributing to making Serbian open data visualization better! 🇷🇸
