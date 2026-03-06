# Demo Screenshots

Screenshots of demo pages captured from the live site.

**Generated:** 2026-03-06 **Source:**
https://acailic.github.io/vizualni-admin/demos/

## Live Site Status (E2E Verified)

| Page         | Screenshot         | Route                 | Chart Status   |
| ------------ | ------------------ | --------------------- | -------------- |
| Demos Index  | `demos-index.png`  | `/demos`              | N/A (cards)    |
| Playground   | `playground.png`   | `/demos/playground`   | ✅ Working     |
| Showcase     | `showcase.png`     | `/demos/showcase`     | N/A (cards)    |
| Demographics | `demographics.png` | `/demos/demographics` | ⚠️ Placeholder |
| Pitch        | `pitch.png`        | `/demos/pitch`        | N/A (cards)    |

## Dynamic Demo Pages

All accessible via `/demos/{demoId}` route:

| Screenshot                | Demo ID        | Chart Status   |
| ------------------------- | -------------- | -------------- |
| `demo-air-quality.png`    | air-quality    | ⚠️ Placeholder |
| `demo-agriculture.png`    | agriculture    | ⚠️ Placeholder |
| `demo-budget.png`         | budget         | ⚠️ Placeholder |
| `demo-climate.png`        | climate        | ⚠️ Placeholder |
| `demo-culture.png`        | culture        | ⚠️ Placeholder |
| `demo-demographics.png`   | demographics   | ⚠️ Placeholder |
| `demo-digital.png`        | digital        | ⚠️ Placeholder |
| `demo-economy.png`        | economy        | ⚠️ Placeholder |
| `demo-education.png`      | education      | ⚠️ Placeholder |
| `demo-employment.png`     | employment     | ⚠️ Placeholder |
| `demo-energy.png`         | energy         | ⚠️ Placeholder |
| `demo-environment.png`    | environment    | ⚠️ Placeholder |
| `demo-health.png`         | health         | ⚠️ Placeholder |
| `demo-healthcare.png`     | healthcare     | ⚠️ Placeholder |
| `demo-infrastructure.png` | infrastructure | ⚠️ Placeholder |
| `demo-modern-api.png`     | modern-api     | ⚠️ Placeholder |
| `demo-playground-v2.png`  | playground-v2  | ⚠️ Placeholder |
| `demo-presentation.png`   | presentation   | ⚠️ Placeholder |
| `demo-tourism.png`        | tourism        | ⚠️ Placeholder |
| `demo-transport.png`      | transport      | ⚠️ Placeholder |

## Status Legend

| Status         | Meaning                                           |
| -------------- | ------------------------------------------------- |
| ✅ Working     | Chart renders correctly with D3 SVG elements      |
| ⚠️ Placeholder | Shows "Vizualizacija će biti prikazana ovde"      |
| N/A (cards)    | Page uses card layout, no actual charts by design |

## Notes

**Placeholder Issue:** Dynamic demo pages show placeholder messages on the live
GitHub Pages site that don't exist in the current source code. The
`ChartVisualizer` component in the source code shows different messages ("Nema
dostupnih podataka za vizualizaciju"). This suggests the deployed version is
outdated.

**Solution:** Redeploy the current source code to GitHub Pages to get working
charts on all dynamic demo pages.

## Regenerating Screenshots

```bash
npx playwright test e2e/demo-visual.spec.ts --reporter=list
```
