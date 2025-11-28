# Release Action Plan - Vizualni Admin v1.0.0

**Status**: Ready for Beta Release
**Target**: v0.9.0-beta (This Week) → v1.0.0 (3 Weeks)
**Last Updated**: 2025-11-28

---

## Quick Status

| Category | Status | Priority |
|----------|--------|----------|
| Core Features | ✅ 9/15 Complete | High |
| Demo Pages | ✅ Excellent | ✓ |
| Static Export | ✅ Working | ✓ |
| Package Config | ⚠️ Needs Fix | Critical |
| Documentation | ⚠️ Missing | Critical |
| CLI Tools | ❌ Not Started | High |
| Tests | ⚠️ Unknown Coverage | High |

---

## Phase 1: Beta Release (v0.9.0-beta) - This Week

### Day 1: Package Configuration ⚡ CRITICAL

**File**: `package.json`

```json
{
  "name": "vizualni-admin",
  "version": "0.9.0-beta.1",
  "private": false,  // ← REMOVE private flag
  "main": "./app/index.ts",
  "types": "./app/index.ts",
  "exports": {
    ".": {
      "import": "./app/index.ts",
      "require": "./app/index.ts",
      "types": "./app/index.ts"
    },
    "./components": "./app/components/index.ts",
    "./config": "./app/lib/config/index.ts",
    "./hooks": "./app/hooks/index.ts"
  },
  "files": [
    "app/components",
    "app/lib",
    "app/hooks",
    "app/types",
    "app/index.ts",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "keywords": [
    "visualization",
    "open-data",
    "serbia",
    "data-gov-rs",
    "charts",
    "nextjs",
    "react",
    "typescript"
  ]
}
```

**Commands**:
```bash
# 1. Update package.json
# 2. Verify dependencies
yarn install

# 3. Test local package
npm pack
ls -lh vizualni-admin-*.tgz

# 4. Test in separate directory
mkdir /tmp/test-install
cd /tmp/test-install
npm init -y
npm install /path/to/vizualni-admin-0.9.0-beta.1.tgz
```

---

### Day 2: Export Structure

**Create**: `app/components/index.ts`
```typescript
// Export all public components
export { DemoLayout } from "./demos/demo-layout";
export { DemoGallery } from "./demos/demo-gallery";

// Onboarding components
export { StepperWizard } from "./onboarding/StepperWizard";
export { WelcomeStep } from "./onboarding/WelcomeStep";
export { LanguageSelection } from "./onboarding/LanguageSelection";
export { CategorySelection } from "./onboarding/CategorySelection";
export { DatasetBrowser } from "./onboarding/DatasetBrowser";
export { ThemeCustomization } from "./onboarding/ThemeCustomization";
export { DeploymentOptions } from "./onboarding/DeploymentOptions";

// Add more as needed
```

**Create**: `app/lib/index.ts`
```typescript
export * from "./config";
export * from "./demos/config";
```

**Create**: `app/hooks/index.ts`
```typescript
export { useDataGovRs } from "./use-data-gov-rs";
// Export other hooks
```

**Update**: `app/index.ts`
```typescript
// Main entry point
export * from "./components";
export * from "./lib";
export * from "./hooks";
export * from "./types";

// Named exports for convenience
export { DEFAULT_CONFIG } from "./lib/config/defaults";
export { DEMO_CONFIGS } from "./lib/demos/config";
export type { VizualniAdminConfig } from "./lib/config/types";
```

---

### Day 3: npm README

**Create**: `README.npm.md` (will be copied to README.md for npm)

```markdown
# Vizualni Admin 🇷🇸

> Serbian Open Data Visualization Tool

A powerful, modern visualization tool for Serbian open data from [data.gov.rs](https://data.gov.rs).

[![npm version](https://img.shields.io/npm/v/vizualni-admin.svg)](https://www.npmjs.com/package/vizualni-admin)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://acailic.github.io/vizualni-admin/)

## ✨ Features

- 📊 **11+ Demo Visualizations** - Pre-built charts for various data categories
- 🎨 **Beautiful UI** - Modern, responsive design with Material-UI
- 🌍 **Bilingual** - Full Serbian and English support
- ⚡ **Static Export** - Deploy to GitHub Pages, Vercel, or any static host
- 🔧 **Configurable** - JSON schema-based configuration system
- 🎯 **TypeScript** - Full type safety and IntelliSense support

## 🚀 Quick Start

### Installation

```bash
npm install vizualni-admin
# or
yarn add vizualni-admin
```

### Basic Usage

```typescript
import { DemoLayout, DEMO_CONFIGS } from 'vizualni-admin';

function MyVisualization() {
  return (
    <DemoLayout title="My Chart">
      {/* Your visualization content */}
    </DemoLayout>
  );
}
```

### Configuration

```typescript
import { DEFAULT_CONFIG } from 'vizualni-admin/config';

const myConfig = {
  ...DEFAULT_CONFIG,
  project: {
    name: "My Project",
    language: "sr",
    theme: "dark"
  }
};
```

## 📚 Documentation

- **Live Demo**: [https://acailic.github.io/vizualni-admin/](https://acailic.github.io/vizualni-admin/)
- **Demo Gallery**: [https://acailic.github.io/vizualni-admin/demos](https://acailic.github.io/vizualni-admin/demos)
- **Tutorials**: [https://acailic.github.io/vizualni-admin/tutorials](https://acailic.github.io/vizualni-admin/tutorials)
- **GitHub**: [https://github.com/acailic/vizualni-admin](https://github.com/acailic/vizualni-admin)

## 🎯 Demo Categories

- 🌫️ Air Quality
- 💰 Budget & Economy
- 👥 Demographics
- 📱 Digital Services
- 💼 Employment
- ⚡ Energy
- 🏥 Healthcare
- 🚗 Transport
- 🌡️ Climate

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI**: Material-UI
- **Charts**: D3.js, Vega
- **Data**: data.gov.rs API

## 📦 What's Included

```
vizualni-admin/
├── components/     # React components
├── lib/           # Configuration & utilities
├── hooks/         # React hooks
└── types/         # TypeScript types
```

## 🔧 Configuration Schema

```typescript
interface VizualniAdminConfig {
  project: {
    name: string;
    language: "sr" | "en";
    theme: "light" | "dark" | "custom";
  };
  categories: {
    enabled: string[];
    featured: string[];
  };
  datasets: {
    autoDiscovery: boolean;
    manualIds: Record<string, string[]>;
  };
  visualization: {
    defaultChartType: "bar" | "line" | "area" | "pie" | "map" | "table";
    colorPalette: string;
    customColors: string[];
  };
  features: {
    embedding: boolean;
    export: boolean;
    sharing: boolean;
    tutorials: boolean;
  };
  deployment: {
    basePath: string;
    customDomain: string;
    target: "local" | "github-pages" | "custom";
  };
}
```

## 🚀 Deployment

### GitHub Pages

```bash
# Build for GitHub Pages
NEXT_PUBLIC_BASE_PATH=/your-repo yarn build:static

# Deploy
yarn deploy:gh-pages
```

### Vercel / Netlify

```bash
# Build
yarn build

# Deploy using your platform's CLI
```

## 📄 License

BSD-3-Clause © [acailic](https://github.com/acailic)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions)
- **Data Portal**: [data.gov.rs](https://data.gov.rs)

## 🙏 Acknowledgments

- Serbian Open Data Portal team
- Original visualize-admin project
- All contributors

---

**Made with ❤️ for the Serbian open data community**
```

---

### Day 4: CHANGELOG.md

**Create**: `CHANGELOG.md`

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.9.0-beta.1] - 2025-11-28

### Added
- Initial beta release
- 11+ demo visualizations (air quality, budget, demographics, etc.)
- Configuration system with JSON schema validation
- Onboarding wizard (6-step user flow)
- Bilingual support (Serbian and English)
- Static export for GitHub Pages deployment
- Material-UI based component library
- TypeScript type definitions
- Demo gallery with interactive cards
- Showcase page with curated highlights
- Presentation mode for slide-style demos

### Features
- **Configuration System**: JSON schema-based config with TypeScript types
- **Onboarding**: Step-by-step wizard for project setup
- **Demos**: 15 pre-built visualization pages
- **Export**: Static site generation for easy deployment
- **Internationalization**: Full SR/EN language support
- **Responsive**: Mobile-first design

### Technical
- Next.js 14 with App Router
- TypeScript 4.9.5
- Material-UI components
- D3.js and Vega for charts
- Integration with data.gov.rs API
- Optimized build with SWC minifier
- Tree-shaking and code splitting

### Known Issues
- CLI tools not yet implemented
- Test coverage needs expansion
- Documentation site in progress
- Some Wave 2-4 features pending

## [0.1.0] - 2025-11-25

### Added
- Initial project setup
- Fork from visualize-admin
- Adaptation for Serbian data sources

---

[Unreleased]: https://github.com/acailic/vizualni-admin/compare/v0.9.0-beta.1...HEAD
[0.9.0-beta.1]: https://github.com/acailic/vizualni-admin/releases/tag/v0.9.0-beta.1
[0.1.0]: https://github.com/acailic/vizualni-admin/releases/tag/v0.1.0
```

---

### Day 5: Beta Release

**Commands**:
```bash
# 1. Commit all changes
git add .
git commit -m "chore: prepare v0.9.0-beta.1 release"

# 2. Create tag
git tag -a v0.9.0-beta.1 -m "Beta release v0.9.0-beta.1"

# 3. Push to GitHub
git push origin main
git push origin v0.9.0-beta.1

# 4. Publish to npm (beta channel)
npm publish --tag beta

# 5. Create GitHub Release
# Go to GitHub → Releases → Create new release
# - Tag: v0.9.0-beta.1
# - Title: "v0.9.0-beta.1 - Initial Beta Release"
# - Description: Copy from CHANGELOG.md
# - Mark as "pre-release"
```

---

## Phase 2: Documentation (Week 2)

### Documentation Site Structure

```
docs/
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── first-visualization.md
├── guides/
│   ├── configuration.md
│   ├── deployment.md
│   ├── customization.md
│   └── data-integration.md
├── api/
│   ├── components.md
│   ├── hooks.md
│   ├── config.md
│   └── types.md
└── examples/
    ├── basic-usage.md
    ├── custom-theme.md
    └── github-pages.md
```

### Priority Docs

1. **Getting Started** (Day 1-2)
   - Installation
   - Quick start
   - First visualization

2. **Configuration Guide** (Day 3)
   - Schema reference
   - Examples
   - Best practices

3. **API Reference** (Day 4-5)
   - Components
   - Hooks
   - Types

---

## Phase 3: CLI Tools (Week 3)

### CLI Structure

```
app/bin/
├── vizualni-admin.ts        # Main CLI entry
├── commands/
│   ├── init.ts              # Initialize project
│   ├── dev.ts               # Development server
│   ├── build.ts             # Build for production
│   └── deploy.ts            # Deploy to platforms
└── utils/
    ├── logger.ts
    ├── prompts.ts
    └── config.ts
```

### CLI Commands

```bash
# Initialize new project
vizualni-admin init my-project

# Start development server
vizualni-admin dev

# Build for production
vizualni-admin build --target github-pages

# Deploy
vizualni-admin deploy --platform github-pages
```

### Implementation

**Day 1-2**: Basic CLI structure
**Day 3-4**: Implement commands
**Day 5**: Testing and documentation

---

## Phase 4: Testing & v1.0.0 (Week 4)

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Key user flows
- **E2E Tests**: Critical paths
- **Visual Regression**: Chart rendering

### Test Plan

**Day 1-2**: Unit tests
```bash
# Config validation
# Component rendering
# Hook functionality
```

**Day 3**: Integration tests
```bash
# Data loading
# Chart rendering
# Configuration flow
```

**Day 4**: E2E tests
```bash
# Onboarding flow
# Demo pages
# Export functionality
```

**Day 5**: v1.0.0 Release
```bash
# Final review
# Version bump
# Publish to npm
# Announce release
```

---

## Success Metrics

### Beta Release (v0.9.0)
- [ ] npm package published
- [ ] GitHub release created
- [ ] Demo site live
- [ ] At least 5 beta testers
- [ ] Feedback collected

### Stable Release (v1.0.0)
- [ ] Documentation complete
- [ ] CLI tools working
- [ ] 80%+ test coverage
- [ ] No critical bugs
- [ ] Positive user feedback

---

## Risk Mitigation

### Potential Issues

1. **npm Publish Fails**
   - Solution: Test with `npm pack` first
   - Verify package.json configuration
   - Check npm credentials

2. **Breaking Changes**
   - Solution: Semantic versioning
   - Clear migration guide
   - Deprecation warnings

3. **Performance Issues**
   - Solution: Bundle analysis
   - Lazy loading
   - Code splitting

4. **Browser Compatibility**
   - Solution: Polyfills
   - Transpilation
   - Testing matrix

---

## Communication Plan

### Beta Announcement

**Channels**:
- GitHub Discussions
- Twitter/X
- LinkedIn
- Serbian dev communities
- data.gov.rs team

**Message**:
```
🎉 Vizualni Admin v0.9.0-beta is here!

Serbian Open Data Visualization Tool - now available on npm!

✨ Features:
- 11+ demo visualizations
- Bilingual (SR/EN)
- GitHub Pages ready
- TypeScript support

Try it: npm install vizualni-admin@beta
Demo: https://acailic.github.io/vizualni-admin/

Feedback welcome! 🙏
```

### v1.0.0 Announcement

**Channels**: Same as beta + more
**Message**: Full feature announcement

---

## Rollback Plan

If critical issues found:

1. **Unpublish from npm** (within 72 hours)
   ```bash
   npm unpublish vizualni-admin@0.9.0-beta.1
   ```

2. **Mark GitHub release as broken**
   - Add warning to release notes
   - Create hotfix branch

3. **Fix and re-release**
   ```bash
   # Fix issues
   # Bump to v0.9.0-beta.2
   # Re-publish
   ```

---

## Next Actions (Immediate)

### Today
1. ✅ Review CODE_REVIEW_REPORT.md
2. ⚡ Update package.json
3. ⚡ Create export structure
4. ⚡ Test npm pack

### Tomorrow
1. Write npm README
2. Create CHANGELOG
3. Test installation
4. Prepare beta release

### This Week
1. Publish v0.9.0-beta.1
2. Gather feedback
3. Start documentation
4. Plan CLI tools

---

**Status**: Ready to Execute
**Next Review**: After beta release
**Questions**: Open GitHub issue or discussion
