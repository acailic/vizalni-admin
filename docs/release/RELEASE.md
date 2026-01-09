# Release Guide (library publish)

This repository is configured to publish the `@acailic/vizualni-admin` package
from the `app` workspace to npm.

## Prerequisites

- npm account with publish rights to `@acailic` scope.
- `NPM_TOKEN` secret added to GitHub repository settings (for automated
  releases).

## Release Process

### Automated Release (Recommended)

1.  Update the version in `app/package.json`.
2.  Commit and push the change.
3.  Create a new git tag matching the version (e.g., `v3.4.10`).
    ```sh
    git tag v3.4.10
    git push origin v3.4.10
    ```
4.  The GitHub Action `release.yml` will automatically build and publish the
    package to npm.

### Manual Release

1.  Build npm artifacts:
    ```sh
    yarn build:npm
    ```
2.  Publish the `app` workspace:
    ```sh
    yarn release:npm
    ```

## Notes

- The published outputs are in the `app/dist` folder (e.g., `index.js`,
  `index.mjs`, `charts/index.mjs`).
- Ensure you have logged in with `npm login` before manual publishing.
