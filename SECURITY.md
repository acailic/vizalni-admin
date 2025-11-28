# Security Policy

## Supported Versions

We actively support the following versions of Vizualni Admin with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

For versions that are no longer supported, we recommend upgrading to the latest version as soon as possible to ensure you receive security updates.

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in Vizualni Admin, please report it to us privately.

### Private Disclosure Process

1. **Do not create a public GitHub issue** for the vulnerability.
2. Email your report to [security@vizualni-admin.dev](mailto:security@vizualni-admin.dev).
3. Include the following information:
   - A clear description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact and severity
   - Any suggested fixes or mitigations
4. We will acknowledge receipt within 48 hours and provide a timeline for fixing the issue.
5. Once the vulnerability is fixed, we will publicly disclose it with credit to the reporter (unless you prefer to remain anonymous).

We follow responsible disclosure practices and will work with you to ensure the issue is resolved before public disclosure.

## Security Update Policy

- Security updates are released as patch versions (e.g., 0.1.1, 0.1.2) without breaking changes.
- Critical vulnerabilities are addressed within 7 days of disclosure.
- High-severity issues are fixed within 14 days.
- Medium and low-severity issues are addressed in the next regular release cycle.
- All security updates include detailed changelogs and are announced via GitHub releases.

## Known Security Considerations

Vizualni Admin is designed for data visualization and may handle sensitive data. Please consider the following security aspects:

### Data Visualization Security

Following OWASP guidelines for secure data handling:

- **Data Exposure Risks**: Visualizations may inadvertently expose sensitive data through chart labels, tooltips, or exported images. Always sanitize data before rendering.
- **Cross-Site Scripting (XSS)**: User-provided data used in chart configurations should be validated and escaped to prevent XSS attacks.
- **Injection Attacks**: When integrating with data sources, use parameterized queries and validate input to prevent SQL injection or similar attacks.
- **Access Control**: Implement proper authentication and authorization when deploying visualizations that access restricted data.
- **Data Privacy**: Comply with regulations like GDPR when handling personal data in visualizations.

### Dependency Security

- We regularly scan dependencies for known vulnerabilities using automated tools.
- All third-party dependencies are reviewed for security before inclusion.
- We use tools like npm audit and Snyk for continuous vulnerability monitoring.

### Automated Security Updates

- Dependabot automatically creates pull requests for dependency updates, including security patches.
- Security scanning workflows run weekly and on every pull request to detect vulnerabilities.
- CodeQL analysis is performed to identify potential security issues in the codebase.

For more information on secure data visualization practices, refer to the [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) and general [OWASP Top 10](https://owasp.org/www-project-top-ten/) guidelines.

## Contact Information

For security-related questions or concerns:

- Email: [security@vizualni-admin.dev](mailto:security@vizualni-admin.dev)
- GitHub Security Advisories: [Report via GitHub](https://github.com/acailic/vizualni-admin/security/advisories/new)

We appreciate your help in keeping Vizualni Admin and its users secure!