---
layout: home
hero:
  name: Vizualni Admin
  text: Alat za vizualizaciju otvorenih podataka Srbije
  tagline: Moderan React toolkit za srpske podatke sa punom podrškom za latinicu, ćirilicu i engleski
  actions:
    - theme: brand
      text: Započnite
      link: /uvod/
    - theme: alt
      text: Pogledajte primere
      link: /primeri/
    - theme: alt
      text: GitHub
      link: https://github.com/acailic/vizualni-admin

features:
  - icon: 🇷🇸
    title: Srpska lokalizacija
    details: Puna podrška za srpsku latinicu, ćirilicu i engleski jezik sa Lingui i18n framework-om.
  - icon: 📊
    title: Spremne komponente
    details: LineChart, ColumnChart, i PieChart komponente sa TypeScript tipovima i konfiguracijom.
  - icon: 🔗
    title: Embed ugradnja
    details: Jednostavna iFrame ugradnja sa generatorom URL-a i podrškom za više tema.
  - icon: 📱
    title: Responsive dizajn
    details: Mobile-first pristup koji savršeno funkcioniše na svim uređajima i veličinama ekrana.
  - icon: ⚡
    title: Lagke komponente
    details: Optimizovane za performanse sa minimalnim uticajem na veličinu aplikacije.
  - icon: 🎨
    title: Prilagodljive teme
    details: Podrška za svetle, tamne i custom teme sa srpskim dizajn elemenata.
---

## 🚀 Brzi početak

Instalirajte paket i kreirajte prvi vizuelni prikaz za manje od 5 minuta.

### Instalacija

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

### Osnovna upotreba

```tsx
import { LineChart } from '@acailic/vizualni-admin';

const data = [
  { label: '2019', value: 72 },
  { label: '2020', value: 54 },
  { label: '2021', value: 63 },
  { label: '2022', value: 81 },
];

export function ZaposlenostGrafikon() {
  return (
    <LineChart
      data={data}
      xKey="label"
      yKey="value"
      title="Oporavak zaposlenosti"
      width={720}
      height={360}
      showTooltip
      showCrosshair
    />
  );
}
```

## 🇷🇸 Srpski jezik i lokalizacija

Vizualni Admin dolazi sa ugrađenom podrškom za srpski jezik:

```ts
import { defaultLocale, locales, parseLocaleString } from '@acailic/vizualni-admin';

console.log(defaultLocale); // 'sr-Latn'
console.log(locales);       // ['sr-Latn', 'sr-Cyrl', 'en']
console.log(parseLocaleString('sr-Cyrl')); // 'sr-Cyrl'
```

### Podržane lokalizacije

- **sr-Latn** (Srpski Latinica) - Podrazumevana
- **sr-Cyrl** (Srpski Ćirilica)
- **en** (English)

## 🔗 Embed ugradnja

Koristite našu javnu demo stranicu za jednostavnu ugradnju:

```html
<iframe
  src="https://acailic.github.io/vizualni-admin/embed/demo?theme=light&lang=sr"
  style="width: 100%; height: 520px; border: 0;"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>
```

## 📱 Dostupne komponente

### LineChart
Prikazivanje trendova vremenskih serija i podataka sa kontinualnim promenama.

### ColumnChart
Upoređivanje kategoričkih podataka i vrednosti po kategorijama.

### PieChart
Prikazivanje proporcija i procenatnih udela unutar celog skupa.

## 🎚️ Konfiguracija

Sve komponente podržavaju bogate opcije za konfiguraciju:

- **Responsive dizajn** - Automatska prilagođavanje veličini
- **Interaktivni tooltip-ovi** - Informacije pri hover-u
- **Animacije** - Glatke tranzicije između stanja
- **Custom boje** - Prilagođene teme i boje
- **Izvoz podataka** - PNG, SVG, i JSON export
- **Pristupačnost** - WCAG 2.1 AA compliance

## 🔧 Tipovi i TypeScript

Puna TypeScript podrška sa rigoroznim tipovima:

```ts
interface ChartData {
  label: string;
  value: number;
  metadata?: Record<string, any>;
}

interface LineChartConfig {
  data: ChartData[];
  xKey: keyof ChartData;
  yKey: keyof ChartData;
  title?: string;
  width?: number;
  height?: number;
  showTooltip?: boolean;
  showCrosshair?: boolean;
  color?: string;
  animation?: boolean;
}
```

## 📚 Dokumentacija

- [Instalacija](/uvod/instalacija) - Detaljna uputstva za instalaciju
- [Komponente](/komponente/) - Reference za sve komponente
- [Vodiči](/vodic/) - Praktični primeri i tutorijali
- [API Referenca](/reference/api) - Kompletna API dokumentacija

## 🌐 Zvanični resursi

- **NPM Package**: [@acailic/vizualni-admin](https://www.npmjs.com/package/@acailic/vizualni-admin)
- **GitHub Repository**: [acailic/vizualni-admin](https://github.com/acailic/vizualni-admin)
- **Live Demo**: [acailic.github.io/vizualni-admin](https://acailic.github.io/vizualni-admin)
- **Srpski otvoreni podaci**: [data.gov.rs](https://data.gov.rs)

## 🤏 License

BSD-3-Clause - Pogledajte [LICENSE](https://github.com/acailic/vizualni-admin/blob/main/LICENSE) za detalje.

---

<div style="text-align: center; margin-top: 3rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(16, 185, 129, 0.05)); border-radius: 0.75rem; border: 1px solid rgba(14, 165, 233, 0.1);">
  <p style="font-size: 1.125rem; font-weight: 600; color: var(--serbian-primary); margin-bottom: 0.5rem;">
    🇷🇸 Izgrađeno sa ljubavlju za srpsku zajednicu
  </p>
  <p style="color: var(--vp-c-text-2); margin: 0;">
    Moderan alat za vizualizaciju zvaničnih otvorenih podataka Republike Srbije
  </p>
</div>