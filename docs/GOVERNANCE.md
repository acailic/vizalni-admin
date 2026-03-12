# vizualni-admin Governance

This document describes the governance model, decision-making process, and
community guidelines for the vizualni-admin project.

## Table of Contents

- [Overview](#overview)
- [Governance Model](#governance-model)
- [Roles and Responsibilities](#roles-and-responsibilities)
- [Decision-Making Process](#decision-making-process)
- [Release Management](#release-management)
- [Community Guidelines](#community-guidelines)
- [Code of Conduct](#code-of-conduct)
- [Contributor Recognition](#contributor-recognition)
- [Funding and Sustainability](#funding-and-sustainability)

## Overview

vizualni-admin is an open-source Serbian data visualization tool maintained by
the community. The project aims to:

- Provide accessible data visualization tools for Serbian open data
- Support both Serbian Latin (sr-Latn) and Cyrillic (sr-Cyrl) scripts
- Enable no-code visualization for non-technical users
- Provide a library for developers to build custom visualizations

### Project Status

- **Started**: 2024
- **Current Version**: 1.0.0
- **License**: BSD-3-Clause
- **Repository**: https://github.com/acailic/vizualni-admin
- **Package**: `@acailic/vizualni-admin` on npm

## Governance Model

vizualni-admin follows a **benevolent dictator governance model** with open
participation:

### Key Principles

1. **Open Participation**: Anyone can contribute through pull requests
2. **Transparent Decisions**: Major decisions are documented publicly
3. **Merit-Based**: Contributions earn influence and trust
4. **Final Authority**: Project lead maintains final decision authority
5. **Collaboration**: Community input shapes the project direction

### Decision Authority

- **Project Lead**: @acailic has final authority on all decisions
- **Technical Decisions**: Made by consensus among maintainers
- **Community Decisions**: Discussed openly with input from all contributors
- **Disagreements**: Resolved by project lead

### Leadership Structure

```
Project Lead (@acailic)
├── Maintainers
├── Triage Team
├── Regular Contributors
└── Community Members
```

## Roles and Responsibilities

### Project Lead

The project lead (@acailic) is responsible for:

- **Strategic Direction**: Setting project vision and priorities
- **Final Decisions**: Making binding decisions on conflicts
- **Release Management**: Approving and publishing releases
- **Community Health**: Fostering a welcoming community
- **Security**: Handling security vulnerabilities
- **Finance**: Managing funding and expenses

### Maintainers

Maintainers are experienced contributors with:

- **Write Access**: Direct commit access to the repository
- **Review Authority**: Can approve and merge PRs
- **Issue Triage**: Responsible for triaging issues and PRs
- **Technical Leadership**: Guide technical decisions
- **Mentorship**: Help onboard new contributors

**Becoming a Maintainer**:

Requires:

1. Consistent, high-quality contributions over 6+ months
2. Deep understanding of the codebase
3. Successful review of 10+ PRs
4. Participation in triage duties
5. Agreement with governance model
6. Invitation from project lead

### Triage Team

Triage team members help manage the contribution flow:

- **Initial Triage**: Label and categorize new issues/PRs
- **Review**: Provide feedback on contributions
- **Support**: Answer questions and help contributors
- **Documentation**: Keep docs in sync with changes

**Becoming a Triage Team Member**:

Requires:

1. Consistent contributions over 3+ months
2. Understanding of contribution process
3. Successful review of 5+ PRs
4. Participation in triage duties
5. Approval from existing maintainers

### Regular Contributors

Contributors who regularly participate:

- **Submit PRs**: Contribute code, docs, tests
- **Review PRs**: Provide feedback on others' work
- **Report Issues**: Identify bugs and suggest features
- **Help Others**: Support in discussions and issues

### Community Members

Anyone interested in the project:

- **Use the Tool**: Provide feedback through usage
- **Report Issues**: Help identify problems
- **Participate**: Engage in discussions
- **Spread the Word**: Share and promote the project

## Decision-Making Process

### Types of Decisions

1. **Routine Decisions** (Day-to-day)
   - Bug fixes
   - Documentation improvements
   - Test additions
   - Code refactoring
   - **Process**: Any contributor can propose, maintainers approve

2. **Technical Decisions** (Architecture/API)
   - New features
   - API changes
   - Dependency updates
   - Performance improvements
   - **Process**: Proposal, discussion, consensus among maintainers

3. **Strategic Decisions** (Direction/Policy)
   - Project roadmap
   - Governance changes
   - Breaking changes
   - Major features
   - **Process**: Proposal, community discussion, project lead decides

### Decision Process

For non-routine decisions:

1. **Proposal**
   - Create issue or discussion with proposal
   - Clearly state problem and proposed solution
   - Provide context and rationale

2. **Discussion**
   - Open to community for comments
   - Minimum 7-day discussion period for major decisions
   - Seek input from affected parties

3. **Decision**
   - Maintainers discuss and form consensus
   - Project lead makes final decision if needed
   - Document decision with rationale

4. **Implementation**
   - Create implementation plan
   - Track with milestones and issues
   - Update documentation

### Decision Records

Major decisions are documented in `ai_working/decisions/`:

- Title and date
- Context and problem statement
- Considered options
- Decision and rationale
- Consequences and impact
- Review date

Example: `ai_working/decisions/2026-01-09-mapchart-packaging.md`

## Release Management

### Release Versioning

vizualni-admin follows [Semantic Versioning 2.0](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

Example: `1.2.3`

- MAJOR: 1
- MINOR: 2
- PATCH: 3

### Release Types

1. **Stable Releases**
   - Finalized, production-ready versions
   - Published to npm
   - Tagged on GitHub
   - Full release notes

2. **Pre-releases**
   - Alpha/Beta/RC versions
   - For testing new features
   - May have instability
   - Marked with suffix (e.g., `1.0.0-beta.1`)

3. **Canary Releases**
   - Automated builds from main branch
   - For testing latest changes
   - Not officially supported
   - May contain breaking changes

### Release Process

1. **Preparation**
   - Ensure all tests pass
   - Update CHANGELOG.md
   - Run `yarn release:preflight`
   - Verify documentation is current

2. **Version Bump**
   - Update version in `app/package.json`
   - Commit with message: "chore: release v1.2.3"

3. **Tag and Publish**
   - Create git tag: `git tag v1.2.3`
   - Push tag: `git push origin v1.2.3`
   - CI automatically builds and publishes to npm

4. **Announcement**
   - Create GitHub release with notes
   - Update release documentation
   - Announce in discussions

For detailed procedures, see [docs/release/RELEASE.md](release/RELEASE.md).

### Release Cadence

- **Patch Releases**: As needed for bug fixes
- **Minor Releases**: Every 4-6 weeks for features
- **Major Releases**: Every 6-12 months for breaking changes

## Community Guidelines

### Our Values

- **Inclusivity**: Welcome everyone regardless of background
- **Collaboration**: Work together openly and respectfully
- **Quality**: Maintain high standards for code and documentation
- **User-Focus**: Prioritize user needs and experience
- **Transparency**: Be open about decisions and changes

### Communication

**Appropriate Channels**:

- **Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions
- **Discussions**: Questions, ideas, general conversation
- **Security**: Private vulnerability reporting

**Expectations**:

- Be respectful and constructive
- Assume good intentions
- Listen to different perspectives
- Focus on what is best for the community
- Show empathy towards other community members

### Conflict Resolution

1. **Direct Resolution**: Try to resolve directly first
2. **Mediation**: Ask a maintainer to help mediate
3. **Escalation**: Project lead makes final decision
4. **Appeals**: Contact project lead directly if needed

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to make participation in our project and our
community a harassment-free experience for everyone.

### Our Standards

**Positive Behavior**:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable Behavior**:

- Use of sexualized language or imagery
- Trolling, insulting/derogatory comments
- Personal or political attacks
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

### Reporting

To report a Code of Conduct violation:

1. Email: acailic@example.com
2. Use GitHub's private reporting feature
3. Contact the project lead directly

All reports will be reviewed and investigated.

### Enforcement

Project lead is responsible for:

- Clarifying standards of acceptable behavior
- Taking appropriate corrective action
- Responding to reported incidents

Consequences may include:

- Warning
- Temporary or permanent ban from community
- Removal of contributions

For the full Code of Conduct, see [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md).

## Contributor Recognition

### Recognition System

We recognize and appreciate all contributions:

1. **Contributors List**
   - All contributors listed in README.md
   - Updated with each release
   - Includes code, docs, and other contributions

2. **Release Credits**
   - Contributors mentioned in release notes
   - Specific contributions highlighted
   - Thank you for major contributions

3. **Maintenance Recognition**
   - Triage team listed in docs
   - Maintainers listed in docs
   - Special recognition for long-term contributors

### Ways to Contribute

All forms of contribution are valued:

- **Code**: Bug fixes, features, tests
- **Documentation**: Guides, examples, API docs
- **Design**: UI/UX improvements, mockups
- **Testing**: Bug reports, test cases
- **Support**: Helping others in discussions
- **Translation**: Improving Serbian localization
- **Promotion**: Blog posts, talks, demos

### Contributor Benefits

Active contributors receive:

- Influence on project direction
- Early access to new features
- Recognition in releases and docs
- Opportunities for leadership roles
- Professional networking
- Portfolio enhancement

## Funding and Sustainability

### Current Funding

vizualni-admin is currently funded by:

- **Individual Sponsors**: GitHub Sponsors
- **Project Lead**: Self-funded development time
- **Community**: Volunteer contributions

### Financial Transparency

Funding is used for:

- Development time
- Infrastructure costs (CI/CD, hosting)
- Tools and services
- Community events

See [FUNDING.yml](../.github/FUNDING.yml) for sponsorship options.

### Sustainability Plan

Long-term sustainability goals:

1. **Diverse Funding**: Multiple funding sources
2. **Paid Development**: Fund core maintainer time
3. **Community Growth**: Grow contributor base
4. **Corporate Sponsorship**: Partner with organizations
5. **Grant Funding**: Apply for relevant grants

## Governance Evolution

This governance document is a living document. It may evolve as the project
grows.

### Review Process

This document will be reviewed:

- **Annually**: Full governance review
- **As Needed**: For major changes
- **Community Input**: Open to suggestions

### Proposed Changes

To propose governance changes:

1. Create a GitHub Discussion with proposal
2. Get feedback from community
3. Maintainers discuss and refine
4. Project lead makes final decision
5. Update this document

### Amendment History

- **2024-01-09**: Initial governance document created

## Questions or Concerns?

If you have questions about governance or need clarification:

1. Review this document thoroughly
2. Check [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution process
3. Open a GitHub Discussion
4. Contact project lead: acailic@example.com

---

**Last Updated**: 2026-01-09

**Next Review**: 2027-01-09
