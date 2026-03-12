## Description

Please provide a clear and concise description of the changes made in this pull
request. Explain the problem this PR solves and how it addresses the issue.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to
      not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Tests (adding or updating tests)
- [ ] Other (please describe):

## Breaking Changes

If this PR includes breaking changes, please describe them here:

- [ ] No breaking changes
- [ ] Breaking changes: (describe what breaks and migration path)

## Related Issues

Link to any related issues or pull requests. Use `Closes #issue_number` or
`Fixes #issue_number` to automatically close issues when this PR is merged.

- Closes #
- Related to #

## Checklist

### Code Quality

- [ ] My code follows the project's code style guidelines
- [ ] I have run `yarn lint` and it passes
- [ ] I have run `yarn typecheck` and it passes
- [ ] I have performed a self-review of my code

### Testing

- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] I have run `yarn test` and all tests pass
- [ ] I have run `yarn test:accessibility` and it passes (for UI changes)
- [ ] I have tested manually in the browser
- [ ] I have tested in both sr-Latn and sr-Cyrl locales (if applicable)

### Documentation

- [ ] I have updated the documentation accordingly
- [ ] I have updated API documentation (for API changes)
- [ ] I have updated CHANGELOG.md with my changes
- [ ] I have added comments to complex code sections

### Release Readiness

- [ ] I have run `yarn release:preflight` locally
- [ ] I have checked that my changes do not introduce any security
      vulnerabilities
- [ ] All new and existing tests pass in CI

## Testing Performed

Describe the testing you performed for this changes:

```bash
# Commands you ran
yarn test
yarn lint
yarn typecheck

# Manual testing steps
# 1. Went to...
# 2. Clicked on...
# 3. Verified...
```

## Screenshots (if applicable)

If this PR includes UI changes, please add screenshots or a short video to
demonstrate the changes.

### Before

[Add screenshot(s) of before state]

### After

[Add screenshot(s) of after state]

## Performance Impact

If this PR affects performance, please describe the impact:

- [ ] No performance impact
- [ ] Performance improvement: (describe improvement)
- [ ] Performance regression: (explain and provide justification)

## Locale Changes

If this PR affects translations:

- [ ] No locale changes
- [ ] I have run `yarn locales:extract` to update translation catalogs
- [ ] I have run `yarn locales:compile` to compile translations
- [ ] I have verified translations in both sr-Latn and sr-Cyrl

## Additional Notes

Any additional information, context, or considerations for reviewers:

---

**Reminder:** Please ensure you have followed the
[Contributing Guidelines](CONTRIBUTING.md) and reviewed our
[Governance documentation](docs/GOVERNANCE.md).

**Need help?** See our [Triage process](docs/TRIAGE.md) or ask in
[GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions).

Thank you for your contribution! 🚀
