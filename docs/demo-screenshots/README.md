# Demo Screenshots

Screenshots of all working demo pages with charts, captured from the live site.

**Generated:** 2026-03-06 **Source:**
https://acailic.github.io/vizualni-admin/demos/

## Active Pages (5)

| Screenshot         | Route                 | Description                  |
| ------------------ | --------------------- | ---------------------------- |
| `demos-index.png`  | `/demos`              | Main demo gallery index      |
| `playground.png`   | `/demos/playground`   | Interactive chart playground |
| `showcase.png`     | `/demos/showcase`     | Featured charts showcase     |
| `demographics.png` | `/demos/demographics` | Demographics demo page       |
| `pitch.png`        | `/demos/pitch`        | Pitch presentation page      |

## Dynamic Demo Pages (20)

All accessible via `/demos/{demoId}` route:

| Screenshot                | Demo ID        | Has Chart |
| ------------------------- | -------------- | --------- |
| `demo-air-quality.png`    | air-quality    | Yes       |
| `demo-agriculture.png`    | agriculture    | Yes       |
| `demo-budget.png`         | budget         | Yes       |
| `demo-climate.png`        | climate        | Yes       |
| `demo-culture.png`        | culture        | Yes       |
| `demo-demographics.png`   | demographics   | Yes       |
| `demo-digital.png`        | digital        | Yes       |
| `demo-economy.png`        | economy        | Yes       |
| `demo-education.png`      | education      | Yes       |
| `demo-employment.png`     | employment     | Yes       |
| `demo-energy.png`         | energy         | Yes       |
| `demo-environment.png`    | environment    | Yes       |
| `demo-health.png`         | health         | Yes       |
| `demo-healthcare.png`     | healthcare     | Yes       |
| `demo-infrastructure.png` | infrastructure | Yes       |
| `demo-modern-api.png`     | modern-api     | Yes       |
| `demo-playground-v2.png`  | playground-v2  | Yes       |
| `demo-presentation.png`   | presentation   | Yes       |
| `demo-tourism.png`        | tourism        | Yes       |
| `demo-transport.png`      | transport      | Yes       |

## Regenerating Screenshots

```bash
npx playwright test e2e/demo-visual.spec.ts --reporter=list
```
