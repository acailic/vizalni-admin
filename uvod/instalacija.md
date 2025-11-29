# Instalacija

Vizualni Admin se instalira kao npm paket i podržava sve popularne package manager-e.

## Sistemski zahtevi

### Node.js verzija
- **Node.js 18.0.0** ili noviji
- **npm 7.0.0** ili noviji (ili ekvivalentni yarn/pnpm)

### React verzije
- **React 18.0.0** ili noviji
- **React DOM 18.0.0** ili noviji

## Instalacija paketa

::: code-group

```bash [npm]
npm install @acailic/vizualni-admin
```

```bash [yarn]
yarn add @acailic/vizualni-admin
```

```bash [pnpm]
pnpm add @acailic/vizualni-admin
```

:::

## Zavisnosti (Dependencies)

### Auto-installed (bundled)
Ove zavisnosti se automatski instaliraju sa paketom:

- `d3-format` - Formatiranje brojeva
- `d3-time-format` - Formatiranje datuma
- `make-plural` - Pluralizacija za i18n
- `fp-ts` - Functional programming TypeScript
- `io-ts` - Runtime type validacija

### Peer dependencies
Ove zavisnosti morate imati u vašem projektu:

```json
{
  "@lingui/core": "^4.0.0",
  "@lingui/react": "^4.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

### Optional dependencies
Za dodatne funkcionalnosti:

```json
{
  "chart.js": "^4.0.0",        // Za napredne chart opcije
  "react-chartjs-2": "^5.0.0"  // Za React integraciju
}
```

## Provjera instalacije

Nakon instalacije, možete provjeriti da li je sve ispravno postavljeno:

```tsx
// Provera import-a
import { LineChart, ColumnChart, PieChart } from '@acailic/vizualni-admin';
import { defaultLocale, locales } from '@acailic/vizualni-admin';

// Provera konstanti
console.log(defaultLocale); // Treba da prikaže 'sr-Latn'
console.log(locales);       // Treba da prikaže ['sr-Latn', 'sr-Cyrl', 'en']
```

## Integration sa različitim framework-ima

### Next.js (App Router)

```tsx
// app/components/charts.tsx
'use client';

import { LineChart } from '@acailic/vizualni-admin';

export function DataChart({ data }: { data: ChartData[] }) {
  return (
    <LineChart
      data={data}
      xKey="date"
      yKey="value"
      title="Podaci"
      width={800}
      height={400}
    />
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/index.tsx
import { LineChart } from '@acailic/vizualni-admin';
import type { GetServerSideProps } from 'next';

export default function HomePage({ data }) {
  return (
    <div>
      <LineChart data={data} xKey="date" yKey="value" title="Podaci" />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data from API
  const data = await fetchData();

  return {
    props: { data },
  };
};
```

### Create React App

```tsx
// src/App.tsx
import { useState } from 'react';
import { LineChart, ColumnChart } from '@acailic/vizualni-admin';

function App() {
  const [data, setData] = useState([]);

  return (
    <div className="App">
      <LineChart data={data} xKey="date" yKey="value" />
      <ColumnChart data={data} xKey="category" yKey="count" />
    </div>
  );
}

export default App;
```

### Vite + React

```tsx
// src/components/Dashboard.tsx
import { LineChart, PieChart } from '@acailic/vizualni-admin';

export function Dashboard() {
  return (
    <div className="dashboard">
      <LineChart
        data={timeSeriesData}
        xKey="timestamp"
        yKey="value"
        title="Vremenska serija"
      />
      <PieChart
        data={categoryData}
        labelKey="name"
        valueKey="count"
        title="Distribucija"
      />
    </div>
  );
}
```

## Troubleshooting

### Common greške

#### Error: Cannot resolve module '@acailic/vizualni-admin'

**Problem:** Paket nije pronađen
**Rešenje:**
1. Proverite da li ste u pravom direktorijumu
2. Pokrenite `npm install` ili `yarn install`
3. Proverite package.json da li je paket dodat

```bash
npm install  # ili yarn install
```

#### Error: React version mismatch

**Problem:** Neusaglašenost verzija React-a
**Rešenje:** Ažurirajte React na verziju 18+

```bash
npm install react@latest react-dom@latest
# ili
yarn add react@latest react-dom@latest
```

#### Error: Lingui dependencies missing

**Problem:** Nedostaju Lingui zavisnosti
**Rešenje:** Instalirajte potrebne zavisnosti

```bash
npm install @lingui/core @lingui/react
# ili
yarn add @lingui/core @lingui/react
```

#### TypeScript greške

**Problem:** TypeScript ne prepoznaje tipove
**Rešenje:** Dodajte `types` u tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["@acailic/vizualni-admin"]
  }
}
```

### Development vs Production

#### Development
Za development, možete koristiti default podešavanja:

```tsx
import { LineChart } from '@acailic/vizualni-admin';

<LineChart data={data} xKey="date" yKey="value" />
```

#### Production
Za production, preporučujemo:

```tsx
import { LineChart } from '@acailic/vizualni-admin';

<LineChart
  data={data}
  xKey="date"
  yKey="value"
  width={800}
  height={400}
  responsive
  animation={false}  // Bolje performanse
  showTooltip
/>
```

## Verzije i release-ovi

Paket prati [Semantic Versioning](https://semver.org/lang/sr/):

- **Major (X.0.0)** - Breaking changes
- **Minor (0.X.0)** - Nove feature-e, backward compatible
- **Patch (0.0.X)** - Bug fix-ove, backward compatible

### Latest verzija

```bash
npm view @acailic/vizualni-admin version
```

### Lista svih verzija

```bash
npm view @acailic/vizualni-admin versions --json
```

## Sledeći koraci

- [Brzi početak](/uvod/brzi-pocetak) - Kreirajte prvi grafikon
- [Konfiguracija](/uvod/konfiguracija) - Podesite komponente
- [Lokalizacija](/uvod/lokalizacije) - Podesite jezik i format
- [Primeri](/primeri/) - Pogledajte real-world primere