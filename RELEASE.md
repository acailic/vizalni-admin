# Release Guide (library publish)

This follows the upstream `visualization-tool` release approach to publish the `@interactivethings/visualize-app` package from the `app` workspace.

## Prerequisites
- npm login with publish rights (`npm whoami`)
- Clean working tree and correct version bump in `app/package.json` (mirror in root if you keep them in sync)
- Optional sanity checks: `yarn typecheck`, `yarn test`

## Build & publish
1. Build npm artifacts (runs GraphQL codegen, Lingui compile, preconstruct/rollup):
   ```sh
   yarn build:npm
   ```
2. Publish the `app` workspace (wraps build+npm publish):
   ```sh
   yarn release:npm
   # internally: yarn build:npm && yarn publish app
   ```

## Notes
- The published outputs are `app/dist/interactivethings-visualize-app.{cjs,esm}.js` and are listed under `files` in `app/package.json`.
- Peer deps stay minimal (`react`, `react-dom`, `next`); all other runtime deps remain in `dependencies`.
- Tagging/branching: follow your usual git flow; `postversion` pushes tags after `npm version` if you use it.
