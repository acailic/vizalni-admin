# Changelog

All notable changes to the Vizualni Admin project will be documented in this
file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-beta.1] - 2025-11-28

### Added

- **NPM Package Release**: First beta release of `@acailic/vizualni-admin` npm package
- Professional package metadata (description, keywords, repository, author, license)
- TypeScript support with declaration files
- CommonJS and ESM module formats for maximum compatibility
- Minimal beta exports:
  - Locale utilities (`defaultLocale`, `locales`, `parseLocaleString`)
  - TypeScript configuration types
  - I18nProvider re-export from @lingui/react

### Changed

- Switched build tooling from preconstruct to tsup for simpler, focused builds
- Fixed import paths to use relative imports instead of @/ aliases
- Updated package.json entry points for modern module resolution
- Configured package for npm registry publication

### Technical Details

- Package size: 256.6 KB (gzipped)
- Unpacked size: 1.3 MB
- 22 files included in distribution
- Supports Node.js with ES2018+ compatibility

### Notes

- This is a **minimal beta release** focusing on core utilities
- Full component exports (Configurator, Charts, etc.) are planned for future releases
- Current exports are standalone and don't require Next.js app context

## [1.0.1] - 2025-11-28

### Removed

- Removed duplicate configuration files
- Removed deprecated component files
- Removed build artifacts
- Consolidated documentation
- Removed temporary planning documents

## [1.0.0] - 2025-11-18

### Added

- Initial fork from visualize-admin/visualization-tool
- Serbian language support
- Integration with data.gov.rs API
- Updated documentation for Serbian Open Data Portal
- Configured for Serbian datasets and organizations
- Support for Cyrillic and Latin scripts
- Updated README with Serbian context
- Added configuration for data.gov.rs endpoints

### Changed

- Updated project name to vizualni-admin
- Updated repository URLs to acailic/vizualni-admin
- Adapted branding for Serbian context
- Modified configuration to work with data.gov.rs instead of Swiss data sources

### Notes

- Based on visualize-admin/visualization-tool v6.2.0
- Maintained BSD-3-Clause license from original project
- Full credit to original authors at Federal Office for the Environment FOEN
