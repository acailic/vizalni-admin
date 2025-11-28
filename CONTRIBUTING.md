# Contributing to Vizualni Admin

Thank you for your interest in contributing to Vizualni Admin! This document
provides guidelines and instructions for contributing to the project. We welcome
contributions from developers of all skill levels and backgrounds, including
those from Serbia and internationally.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your fork:
   `git clone https://github.com/YOUR_USERNAME/vizualni-admin.git`
3. Create a new branch for your changes:
   `git checkout -b feature/your-feature-name` (use `fix/` for bug fixes,
   `docs/` for documentation).
4. Make your changes following the guidelines below.
5. Test your changes thoroughly.
6. Commit your changes using conventional commit messages (see below).
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request (PR) against the main branch.

## Development Setup

### Prerequisites

- Node.js 18+ (we recommend using [nvm](https://github.com/nvm-sh/nvm) for
  version management)
- Yarn package manager
- Git

### Installation

1. Install dependencies: `yarn install`
2. Set up the development environment: `yarn dev` (starts the Next.js dev
   server)
3. For full setup, including linting and testing tools, run: `yarn prepare`
   (installs Husky hooks)

### Useful Scripts

- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn lint`: Run ESLint
- `yarn typecheck`: Run TypeScript type checking
- `yarn test`: Run unit tests
- `yarn test:e2e`: Run E2E tests
- `yarn test:coverage`: Run tests with coverage report
- `yarn benchmark`: Run performance benchmarks

See [README.md](README.md) for more details on the project structure and
available scripts.

## Code Style Guidelines

This project uses:

- **ESLint** for code linting (config in `.eslintrc.js`)
- **Prettier** for code formatting (config in `.prettierrc`)
- **TypeScript** for type safety (config in `tsconfig.json`)

### Key Rules

- Use TypeScript for all new code; avoid `any` types.
- Follow React best practices: use functional components with hooks.
- Use descriptive variable/function names; prefer English for code comments.
- Keep functions small and focused; aim for single responsibility.
- Use JSDoc comments for public APIs and complex logic.

Before committing, run:

```sh
yarn lint
yarn typecheck
```

Fix any issues automatically with `yarn lint:fix`.

## Testing Requirements

All changes must include appropriate tests to maintain our 80%+ coverage goal:

- **Unit tests** for components, utilities, and hooks (using Vitest)
- **Integration tests** for feature interactions
- **E2E tests** for critical user flows (using Playwright)

### Guidelines

- Write tests before or alongside code changes (TDD encouraged).
- Use descriptive test names and cover edge cases.
- Mock external dependencies (e.g., API calls).
- Run `yarn test:coverage` to check coverage; aim for >80% overall.

New features require tests; bug fixes should include regression tests. See
[TESTING_GUIDE.md](docs/TESTING_GUIDE.md) for detailed instructions.

## Commit Message Conventions

We follow [Conventional Commits](https://conventionalcommits.org/) for
consistent and parseable commit messages:

- Format: `type(scope): description`
- Types: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style`
  (formatting), `refactor`, `test`, `chore`
- Scope: Optional, e.g., `feat(locale): add Serbian translations`
- Description: Imperative mood, e.g., "add feature" not "added feature"
- Body: Optional, for detailed explanations
- Footer: For breaking changes or issue references

Examples:

- `feat: add dark mode toggle`
- `fix(config): resolve validation error for empty datasets`
- `docs: update API reference for new exports`

Commits are validated via Husky hooks; invalid messages will be rejected.

## Pull Request Process and Review Guidelines

### Opening a PR

- Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md) for structure.
- Keep PRs focused on one feature/fix; split large changes if needed.
- Reference related issues with `#issue_number`.
- Include screenshots for UI changes.
- Ensure CI passes (linting, tests, type checks).

### Review Process

- At least one maintainer review is required.
- Reviews focus on code quality, tests, and adherence to guidelines.
- Address feedback promptly; use "Request changes" for blockers.
- Once approved, a maintainer will merge (squash or rebase as appropriate).
- For breaking changes, discuss in advance and update migration docs.

### Checklist Before Merging

- [ ] Code follows style guidelines
- [ ] All tests pass and coverage maintained
- [ ] Documentation updated (if needed)
- [ ] Changelog updated (for user-facing changes)
- [ ] No security vulnerabilities introduced

## How to Contribute: Features, Bugs, and Documentation

### Adding New Features

1. Check existing issues or create a
   [feature request](.github/ISSUE_TEMPLATE/feature_request.yml).
2. Discuss the design with maintainers if it's a major change.
3. Implement with tests and documentation.
4. Follow the PR process above.

### Fixing Bugs

1. Reproduce the issue and create a
   [bug report](.github/ISSUE_TEMPLATE/bug_report.yml) if it doesn't exist.
2. Write a failing test first.
3. Fix the bug and ensure tests pass.
4. Update docs if the fix changes behavior.

### Improving Documentation

- Update existing docs for accuracy.
- Add examples or guides for new features.
- Use clear, concise language; include code snippets.
- Test docs locally (e.g., via `yarn docs:serve` if available).

For all contributions, ensure changes align with the project's goals of
accessibility, performance, and Serbian data integration.

## Reporting Issues

Use our issue templates for structured reports:

- [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml): For bugs with
  reproduction steps.
- [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml): For new ideas.

Include environment details (Node version, OS, browser) and screenshots where
relevant.

## Language Support

This project supports Serbian (Cyrillic and Latin) and English. When adding new
text:

- Add translations to `app/locales/` files.
- Use the i18n system for all user-facing text.
- Test with both languages enabled.

## Data Integration

When working with data.gov.rs:

- Follow the [API docs](https://data.gov.rs/apidoc/).
- Handle errors gracefully with fallbacks.
- Implement caching for performance.
- Test with real datasets from the portal.

## Questions?

- Open a discussion issue or contact maintainers via GitHub.

## Code of Conduct

We follow a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming
community. Be respectful and constructive in all interactions.

## Recognition for Contributors

We appreciate all contributions! Contributors are recognized in:

- The [CHANGELOG.md](CHANGELOG.md) for releases.
- GitHub's contributor insights.
- Our [showcase](docs/SHOWCASE.md) for featured projects.

Top contributors may be invited to join as maintainers. Thank you for helping
make Vizualni Admin better!

## License

By contributing, you agree that your contributions will be licensed under the
BSD-3-Clause License.
