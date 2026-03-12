# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For Serbian language version, see [CHANGELOG_SR.md](./CHANGELOG_SR.md)

## [Unreleased]

### Added
- Initial project structure with Next.js 14
- Bilingual support (Serbian Cyrillic, Serbian Latin, English)
- Integration with data.gov.rs API
- Tailwind CSS configuration with Serbian government brand colors
- Comprehensive documentation (README, CONTRIBUTING, CODE_OF_CONDUCT)
- Environment variable templates
- ESLint and Prettier configuration
- TypeScript configuration with strict mode
- Basic project structure and folder organization

### Changed
- None yet

### Deprecated
- None yet

### Removed
- None yet

### Fixed
- None yet

### Security
- Added security headers in Next.js configuration
- Configured CORS and other security measures

## [0.1.0] - 2026-03-12

### Added
- **Project Initialization**
  - Next.js 14 with App Router
  - TypeScript 5.3+ configuration
  - Tailwind CSS 3.4+ setup
  - ESLint and Prettier for code quality

- **Internationalization (i18n)**
  - Support for Serbian Cyrillic (sr-Cyrl) - default
  - Support for Serbian Latin (sr-Latn)
  - Support for English (en)
  - Translation file structure in public/locales/

- **API Integration**
  - Configuration for data.gov.rs API
  - Environment variables for API credentials
  - API client structure with retry logic

- **Styling & Design**
  - Tailwind CSS with custom Serbian government color palette
  - Responsive design utilities
  - Dark mode support configuration
  - Custom font support for Cyrillic scripts

- **Documentation**
  - Comprehensive README in Serbian and English
  - CONTRIBUTING guide with coding standards
  - CODE_OF_CONDUCT based on Contributor Covenant
  - Environment variable documentation (.env.example)

- **Development Tools**
  - Husky for Git hooks
  - lint-staged for pre-commit checks
  - TypeScript strict mode
  - Path aliases for clean imports

### Project Structure
```
vizuelni-admin-srbije/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Utilities and API
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
├── public/
│   ├── locales/          # Translations
│   └── images/           # Static images
├── docs/                 # Documentation
├── .env.example          # Environment template
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

---

## Version History

| Version | Date       | Description                                      |
|---------|------------|--------------------------------------------------|
| 0.1.0   | 2026-03-12 | Initial project setup and configuration         |

---

## Future Roadmap

### [0.2.0] - Planned
- Dataset browsing and search functionality
- Basic data visualization components
- Organization pages
- Advanced filtering and sorting

### [0.3.0] - Planned
- Interactive charts and graphs
- Map visualizations for geographic data
- Data export functionality
- User bookmarks and favorites

### [0.4.0] - Planned
- Advanced analytics dashboard
- Performance optimizations
- Accessibility improvements (WCAG 2.1 AA)
- Progressive Web App (PWA) features

### [1.0.0] - Planned
- Full production release
- Complete test coverage
- Performance benchmarking
- Security audit completion

---

## How to Read This Changelog

- **Added**: New features
- **Changed**: Changes to existing features
- **Deprecated**: Features to be removed in future releases
- **Removed**: Features removed in this release
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes and improvements

---

For more details about our release process, see [CONTRIBUTING.md](./CONTRIBUTING.md).
