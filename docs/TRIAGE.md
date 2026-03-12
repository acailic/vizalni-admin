# Issue and Pull Request Triage Process

This document describes the triage process for issues and pull requests in
vizualni-admin. It defines our labeling scheme, workflow for new contributions,
and how we ensure predictable handling of community contributions.

## Table of Contents

- [Label Scheme](#label-scheme)
- [Issue Triage Workflow](#issue-triage-workflow)
- [Pull Request Triage Workflow](#pull-request-triage-workflow)
- [Reviewer Assignment](#reviewer-assignment)
- [Merge Criteria](#merge-criteria)
- [Triage Team](#triage-team)
- [Automation](#automation)

## Label Scheme

We use GitHub labels to categorize and prioritize issues and pull requests.
Labels help us track the status of contributions and ensure they receive
appropriate attention.

### Issue Type Labels

| Label           | Description                            | Color  |
| --------------- | -------------------------------------- | ------ |
| `bug`           | Bug report or unexpected behavior      | red    |
| `enhancement`   | Feature request or enhancement         | purple |
| `documentation` | Documentation improvements or issues   | blue   |
| `question`      | Questions that aren't bugs or features | green  |

### Priority Labels

| Label               | Description                                           | Color  |
| ------------------- | ----------------------------------------------------- | ------ |
| `priority-critical` | Urgent issue affecting many users or blocking release | red    |
| `priority-high`     | Important issue affecting key functionality           | orange |
| `priority-medium`   | Normal priority issue                                 | yellow |
| `priority-low`      | Minor issue or nice-to-have enhancement               | blue   |

### Contributor Labels

| Label              | Description                                      | Color  |
| ------------------ | ------------------------------------------------ | ------ |
| `good-first-issue` | Good for newcomers, well-scoped                  | green  |
| `help-wanted`      | Community contributions welcome                  | pink   |
| `starter`          | Simple task suitable for first-time contributors | 7ED321 |

### Status Labels

| Label                      | Description                          | Color  |
| -------------------------- | ------------------------------------ | ------ |
| `status:needs-triage`      | New contribution awaiting triage     | gray   |
| `status:needs-design`      | Requires design discussion           | purple |
| `status:needs-review`      | Awaiting code review                 | yellow |
| `status:approved`          | Approved and ready to merge          | green  |
| `status:changes-requested` | Reviewer requested changes           | red    |
| `status:blocked`           | Blocked by another issue or decision | gray   |
| `status:stale`             | No activity for extended period      | gray   |

### Component Labels

| Label                   | Description                           |
| ----------------------- | ------------------------------------- |
| `component:charts`      | Chart components and visualizations   |
| `component:data`        | Data processing and fetching          |
| `component:ui`          | UI components and styling             |
| `component:i18n`        | Internationalization and localization |
| `component:docs`        | Documentation                         |
| `component:tests`       | Testing infrastructure                |
| `component:build`       | Build system and packaging            |
| `component:performance` | Performance optimization              |

### Other Labels

| Label                 | Description                                  |
| --------------------- | -------------------------------------------- |
| `breaking-change`     | Breaking change requiring major version bump |
| `security`            | Security vulnerability or fix                |
| `dependencies`        | Dependency updates                           |
| `duplicate`           | Duplicate of another issue                   |
| `wontfix`             | Issue will not be fixed                      |
| `working-as-intended` | Behavior is correct, not a bug               |

## Issue Triage Workflow

### 1. Initial Triage (within 48 hours)

When a new issue is created:

1. **Apply Status Label**
   - Add `status:needs-triage` if not automatically applied
   - This signals the issue needs initial review

2. **Categorize the Issue**
   - Apply appropriate type label (`bug`, `enhancement`, `documentation`,
     `question`)
   - Apply component label if applicable
   - Apply `security` label if it's a security vulnerability

3. **Check for Duplicates**
   - Search for similar existing issues
   - If duplicate: apply `duplicate` label and reference original issue
   - Close the duplicate with comment linking to original

4. **Assess Priority**
   - `priority-critical`: Security issues, crashes, data loss
   - `priority-high`: Major features, important bugs
   - `priority-medium`: Normal issues
   - `priority-low`: Nice-to-have features, minor issues

5. **Assign Issue**
   - Assign to appropriate maintainer or contributor
   - If no clear assignee, leave unassigned but add `help-wanted` or
     `good-first-issue`

6. **Update Status**
   - Remove `status:needs-triage`
   - Add appropriate status label based on next steps

### 2. Issue Discussion

1. **Clarification**
   - Ask for missing information if needed
   - Reproduce bugs if possible
   - Request minimal reproduction for complex bugs

2. **Design Discussion**
   - For features: add `status:needs-design`
   - Discuss API design and implementation approach
   - Document decisions in comments or decision records

3. **Scope Definition**
   - Break large issues into smaller sub-issues
   - Create tracking issue for multi-part features
   - Define acceptance criteria

### 3. Ready for Implementation

1. **Apply Labels**
   - Remove `status:needs-design` if applicable
   - Add `status:ready` or `help-wanted`
   - Consider `good-first-issue` for well-scoped tasks

2. **Create Checklist**
   - Define clear acceptance criteria
   - List related files and components
   - Note any breaking changes

3. **Link Related Issues**
   - Reference blocking or blocked issues
   - Link to related features or bugs

## Pull Request Triage Workflow

### 1. Initial PR Review (within 72 hours)

When a new PR is created:

1. **Apply Status Label**
   - Add `status:needs-triage` if not automatic
   - This signals PR needs initial review

2. **Automatic Checks**
   - CI checks must pass (lint, typecheck, tests)
   - If failing, apply `ci-failed` label and request fixes

3. **Initial Review**
   - Review PR description for completeness
   - Check if linked to an issue
   - Verify CHANGELOG.md is updated (if applicable)
   - Check if documentation is updated

4. **Categorize PR**
   - Apply type label (`bug`, `enhancement`, `documentation`, etc.)
   - Apply component label
   - Apply `breaking-change` if applicable

5. **Assign Reviewer**
   - Assign based on component and expertise
   - Use CODEOWNERS file for automatic assignment
   - At least one maintainer approval required

6. **Update Status**
   - Remove `status:needs-triage`
   - Add `status:needs-review`

### 2. Code Review Process

1. **Review Checklist**
   - Code quality and style
   - Test coverage
   - Documentation
   - Breaking changes
   - Performance impact
   - Security considerations

2. **Review Outcome**
   - **Approve**: Add `status:approved` label
   - **Request Changes**: Add `status:changes-requested` with feedback
   - **Discuss**: Ask questions or suggest improvements

3. **Multiple Rounds**
   - Author addresses feedback
   - Reviewer re-reviews
   - Continue until approved

### 3. Pre-Merge Checklist

Before merging, ensure:

- [ ] All CI checks pass
- [ ] At least one maintainer approval
- [ ] All review comments addressed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)
- [ ] No merge conflicts
- [ ] Branch is up-to-date with main

### 4. Merge Process

1. **Final Status**
   - Ensure `status:approved` label is present
   - Verify all checklist items complete

2. **Merge Method**
   - Use squash merge for most PRs
   - Use merge commit for multi-PR features
   - Maintain clean commit history

3. **Post-Merge**
   - Remove triage labels
   - Close related issues (with "Closes" or "Fixes")
   - Thank the contributor
   - Update milestone if applicable

## Reviewer Assignment

### Automatic Assignment via CODEOWNERS

The project uses a `.github/CODEOWNERS` file to automatically assign PR
reviewers based on changed files:

```plaintext
# Charts
app/exports/charts/  @acailic

# Data processing
app/domain/data-gov-rs/  @acailic

# Documentation
docs/  @acailic

# Build and packaging
app/package.json  @acailic
scripts/build-embed.js  @acailic
```

### Manual Assignment Guidelines

When manually assigning reviewers:

1. **Component Expertise**
   - Assign based on code area expertise
   - Consider past contributions to similar areas

2. **Workload Balance**
   - Check current review load
   - Avoid overloading single reviewers

3. **Maintainer Approval**
   - At least one maintainer must approve
   - Complex changes may require multiple approvals

4. **New Contributors**
   - Provide extra guidance and detailed feedback
   - Be patient and supportive
   - Offer to pair program if needed

## Merge Criteria

### Must Have (Blocking)

These criteria must be met for any PR to merge:

- [ ] All CI checks pass (lint, typecheck, tests)
- [ ] At least one maintainer approval
- [ ] No merge conflicts
- [ ] Tests added for new functionality
- [ ] Tests updated for bug fixes
- [ ] Security vulnerabilities addressed
- [ ] Breaking changes documented

### Should Have (Non-blocking but important)

These are strongly recommended but may be waived with justification:

- [ ] Accessibility tests pass (for UI changes)
- [ ] Visual regression tests pass (for chart changes)
- [ ] Performance tests pass (for performance-sensitive changes)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Translation keys added (for user-facing features)
- [ ] API documentation updated (for API changes)

### Nice to Have

Optional but appreciated:

- [ ] Examples added
- [ ] Demo created
- [ ] Tests improved beyond minimum
- [ ] Code comments added
- [ ] Related issues linked

### Exception Process

If a PR cannot meet all "Should Have" criteria:

1. Document the exception in the PR
2. Create follow-up issue for missing items
3. Get explicit approval from a maintainer
4. Add `tech-debt` label to track improvements

## Triage Team

### Maintainers

- **@acailic** - Project lead, final authority on merges

### Triage Responsibilities

1. **Daily (weekdays)**
   - Check for new issues and PRs
   - Apply initial labels
   - Respond to urgent issues
   - Review PRs in queue

2. **Weekly**
   - Review stale items
   - Update milestones
   - Clean up duplicate issues
   - Review and update documentation

3. **Monthly**
   - Review label effectiveness
   - Update triage process
   - Analyze contribution metrics
   - Report on community health

### Becoming a Triage Team Member

Experienced contributors can become triage team members by:

1. Consistent, quality contributions over 3+ months
2. Demonstrated understanding of codebase
3. Successful review of 5+ PRs
4. Agreement to participate in triage duties
5. Approval from existing maintainers

## Automation

### GitHub Actions

We use GitHub Actions to automate triage tasks:

1. **Labeler Workflow** (`.github/workflows/labeler.yml`)
   - Automatically applies labels based on changed files
   - Runs on every PR

2. **Stale Issue Bot** (`.github/workflows/stale.yml`)
   - Marks issues/PRs as stale after 60 days of inactivity
   - Closes after 30 additional days if no response

3. **CI Checks** (`.github/workflows/ci.yml`)
   - Runs lint, typecheck, tests on every PR
   - Blocks merge if checks fail

### Automatable Labels

The following labels can be automatically applied:

- `ci-failed`: When CI checks fail
- `status:needs-triage`: On new issues/PRs
- `component:*`: Based on changed files
- `documentation`: When only docs files change
- `tests`: When only test files change

## Metrics and Reporting

We track the following metrics to ensure healthy triage:

- Time to triage (new issues → triaged)
- Time to first response (new issues → first comment)
- Time to review (new PRs → review started)
- Time to merge (approved PRs → merged)
- Open issues by priority
- Open PRs by status

## Questions or Issues?

If you have questions about the triage process or need help:

1. Check this document first
2. Ask in
   [GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions)
3. Tag a maintainer in a comment
4. Open an issue with the `documentation` label

---

For governance information, see [docs/GOVERNANCE.md](GOVERNANCE.md).

For contribution guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).
