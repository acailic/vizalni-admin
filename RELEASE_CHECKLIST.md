# Release Checklist - Vizualni Admin

**Version**: v0.9.0-beta.1 → v1.0.0
**Last Updated**: 2025-11-28

---

## 📋 Phase 1: Beta Release (v0.9.0-beta.1)

### Prerequisites
- [ ] Git repository is clean
- [ ] All changes committed
- [ ] Tests passing locally
- [ ] Build successful

### Package Configuration (30 min)
- [ ] Remove `"private": true` from package.json
- [ ] Add `"main": "./app/index.ts"`
- [ ] Add `"types": "./app/index.ts"`
- [ ] Add `"exports"` field with proper mappings
- [ ] Add `"files"` array with included files
- [ ] Add `"keywords"` for npm search
- [ ] Verify `"version": "0.9.0-beta.1"`

### Export Structure (2 hours)
- [ ] Create `app/components/index.ts`
- [ ] Create `app/lib/index.ts`
- [ ] Create `app/hooks/index.ts`
- [ ] Update `app/index.ts` with all exports
- [ ] Test imports in TypeScript
- [ ] Verify type definitions work

### Documentation (2 hours)
- [ ] Create npm README.md
- [ ] Update CHANGELOG.md
- [ ] Add installation instructions
- [ ] Add quick start example
- [ ] Add configuration guide
- [ ] Add links to live demo

### Testing (1 hour)
- [ ] Run `npm pack`
- [ ] Verify package contents: `tar -tzf vizualni-admin-*.tgz`
- [ ] Create test project in /tmp
- [ ] Install package locally
- [ ] Test imports work
- [ ] Test TypeScript types
- [ ] Test build process

### Release (30 min)
- [ ] Commit all changes
- [ ] Create git tag: `git tag -a v0.9.0-beta.1 -m "Beta release"`
- [ ] Push to GitHub: `git push origin main --tags`
- [ ] Publish to npm: `npm publish --tag beta`
- [ ] Create GitHub Release
- [ ] Mark as pre-release
- [ ] Add release notes

### Verification
- [ ] Package visible on npm
- [ ] GitHub release created
- [ ] Demo site still working
- [ ] Installation works: `npm install vizualni-admin@beta`
- [ ] No critical errors

---

## 📋 Phase 2: Documentation (Week 2)

### Getting Started Docs
- [ ] Installation guide
- [ ] Quick start tutorial
- [ ] First visualization example
- [ ] Configuration basics
- [ ] Deployment guide

### API Documentation
- [ ] Components reference
- [ ] Hooks reference
- [ ] Configuration schema
- [ ] Type definitions
- [ ] Utility functions

### Examples
- [ ] Basic usage example
- [ ] Custom theme example
- [ ] GitHub Pages deployment
- [ ] Embedded chart example
- [ ] Data integration example

### Documentation Site
- [ ] Choose framework (Docusaurus/VitePress)
- [ ] Set up project structure
- [ ] Write content
- [ ] Add search functionality
- [ ] Deploy to GitHub Pages

---

## 📋 Phase 3: CLI Tools (Week 3)

### CLI Structure
- [ ] Create `app/bin/vizualni-admin.ts`
- [ ] Add shebang and executable permissions
- [ ] Install commander.js
- [ ] Set up CLI framework
- [ ] Add help text

### Commands
- [ ] `init` - Initialize new project
- [ ] `dev` - Start development server
- [ ] `build` - Build for production
- [ ] `deploy` - Deploy to platforms
- [ ] `validate` - Validate configuration

### Testing
- [ ] Test each command
- [ ] Test error handling
- [ ] Test help text
- [ ] Test on different platforms
- [ ] Write CLI documentation

---

## 📋 Phase 4: Testing & v1.0.0 (Week 4)

### Unit Tests
- [ ] Config validation tests
- [ ] Component rendering tests
- [ ] Hook functionality tests
- [ ] Utility function tests
- [ ] Achieve 80%+ coverage

### Integration Tests
- [ ] Data loading tests
- [ ] Chart rendering tests
- [ ] Configuration flow tests
- [ ] Export functionality tests

### E2E Tests
- [ ] Onboarding flow
- [ ] Demo pages
- [ ] Configuration editor
- [ ] Build and deploy

### Performance
- [ ] Run Lighthouse audit
- [ ] Measure bundle size
- [ ] Profile load times
- [ ] Optimize if needed

### Final Release
- [ ] Update version to 1.0.0
- [ ] Update CHANGELOG
- [ ] Create git tag
- [ ] Publish to npm (stable)
- [ ] Create GitHub Release
- [ ] Announce release

---

## 🎯 Quick Start (Today)

### Minimum Viable Beta (6 hours)

**Hour 1: Package Config**
```bash
# Edit package.json
# Remove "private": true
# Add main, types, exports, files
```

**Hour 2-3: Exports**
```bash
# Create index files
# Export components
# Export lib functions
# Export hooks
```

**Hour 4-5: Documentation**
```bash
# Write npm README
# Update CHANGELOG
# Add examples
```

**Hour 6: Release**
```bash
npm pack
npm publish --tag beta
git tag v0.9.0-beta.1
git push --tags
```

---

## 📊 Progress Tracking

### Overall Progress
- [x] Code implementation (60% complete)
- [x] Demo pages (100% complete)
- [x] Static export (100% complete)
- [ ] npm package (0% - needs config)
- [ ] Documentation (20% - needs expansion)
- [ ] CLI tools (0% - not started)
- [ ] Tests (40% - needs expansion)

### Wave 1 Tasks (Foundation)
- [x] Task 1A: Dataset Discovery ✅
- [x] Task 1B: Quality Scorer ✅
- [x] Task 1C: Onboarding Wizard ✅
- [x] Task 1D: Configuration System ✅
- [ ] Task 1E: Client Dashboard 🔵 In Progress

### Wave 2 Tasks (Integration)
- [ ] Task 2A: Validation Pipeline ⏳
- [x] Task 2B: Demo Pages ✅ (Excellent)
- [ ] Task 2C: AI Insights 🔵 In Progress
- [ ] Task 2D: Performance ⏳

### Wave 3 Tasks (Polish)
- [ ] Task 3A: CLI Tools ⏳
- [ ] Task 3B: Documentation ⏳
- [ ] Task 3C: Video Tutorials ⏳

### Wave 4 Tasks (Release)
- [ ] Task 4A: Test Suite ⏳
- [ ] Task 4B: Package Prep ⏳
- [ ] Task 4C: Release Automation ⏳

---

## 🚨 Blockers & Issues

### Critical Blockers (Must Fix)
- [ ] package.json "private": true
- [ ] Missing export configuration
- [ ] No npm README

### High Priority Issues
- [ ] CLI tools not implemented
- [ ] Documentation incomplete
- [ ] Test coverage unknown

### Medium Priority Issues
- [ ] Dashboard incomplete
- [ ] AI Insights in progress
- [ ] Performance not profiled

### Low Priority Issues
- [ ] Video tutorials not started
- [ ] Some Wave 2-4 tasks pending

---

## 📞 Support & Resources

### Documentation
- [CODE_REVIEW_REPORT.md](./CODE_REVIEW_REPORT.md) - Full review
- [CODE_REVIEW_SUMMARY.md](./CODE_REVIEW_SUMMARY.md) - Executive summary
- [RELEASE_ACTION_PLAN.md](./RELEASE_ACTION_PLAN.md) - Detailed plan
- [PARALLEL_TASKS.md](./PARALLEL_TASKS.md) - Task breakdown

### Links
- **Live Demo**: https://acailic.github.io/vizualni-admin/
- **GitHub**: https://github.com/acailic/vizualni-admin
- **npm**: https://www.npmjs.com/package/vizualni-admin (after publish)

### Commands Reference
```bash
# Development
yarn dev

# Build
yarn build:static

# Test
yarn test
yarn e2e

# Package
npm pack
npm publish --tag beta

# Deploy
yarn deploy:gh-pages
```

---

## ✅ Success Criteria

### Beta Release Success
- [ ] Package published to npm
- [ ] Can install: `npm install vizualni-admin@beta`
- [ ] Imports work in TypeScript
- [ ] Demo site still functional
- [ ] No critical bugs reported

### v1.0.0 Success
- [ ] Documentation complete
- [ ] CLI tools working
- [ ] 80%+ test coverage
- [ ] Positive user feedback
- [ ] Ready for production use

---

## 🎉 Celebration Milestones

- [ ] 🎊 First npm publish (beta)
- [ ] 🎉 10 npm downloads
- [ ] 🚀 100 npm downloads
- [ ] ⭐ First GitHub star
- [ ] 💬 First user feedback
- [ ] 🏆 v1.0.0 stable release
- [ ] 🌟 100 GitHub stars
- [ ] 📈 1000 npm downloads

---

**Ready to ship?** Let's do this! 🚀

**Next Step**: Start with Phase 1, Beta Release checklist above.
