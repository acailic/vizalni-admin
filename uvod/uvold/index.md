# Uvod u Vizualni Admin

## Šta je Vizualni Admin?

**Vizualni Admin** je moderan React toolkit dizajniran specijalno za vizualizaciju zvaničnih otvorenih podataka Republike Srbije. Paket pruža spremne komponente za kreiranje interaktivnih grafikona sa punom podrškom za srpski jezik (latinica i ćirilica) i engleski jezik.

### Ključne karakteristike

- 🇷🇸 **Srpska lokalizacija** - Puna podrška za srpski latinicu, ćirilicu i engleski
- 📊 **Spremne komponente** - LineChart, ColumnChart, i PieChart sa TypeScript podrškom
- 🔗 **Embed ugradnja** - Jednostavna iFrame ugradnja sa generatorom URL-a
- 📱 **Responsive dizajn** - Mobile-first pristup koji funkcioniše na svim uređajima
- ⚡ **Lagke komponente** - Optimizovane za performanse sa minimalnim footprint-om
- 🎨 **Prilagodljive teme** - Podrška za custom teme sa srpskim dizajn elemenima

## Za koga je namenjen?

Vizualni Admin je idealan za:

- **Vladine institucije** koje prikazuju otvorene podatke
- **Novinske redakcije** za vizuelizaciju statističkih podataka
- **Istraživače i analitičare** koji rade sa srpskim podacima
- **Web developere** koji žele brzu integraciju vizuelizacija
- **Obrazovne institucije** za demonstraciju podataka

## Podržani podaci

Paket je optimizovan za rad sa:

- **Službenom statistikom Srbije** (RZS)
- **Podacima sa data.gov.rs**
- **Finansijskim izveštajima**
- **Demografskim podacima**
- **Ekonomskim indikatorima**
- **Bilo kakvim strukturiranim podacima u JSON formatu**

## Tehnološki stack

- **React 18+** - Moderan React sa hook-ovima
- **TypeScript** - Puna tip sigurnost i autocompletion
- **Chart.js** - Moćna biblioteka za vizuelizaciju
- **Lingui** - Internacionalizacija i lokalizacija
- **Vite** - Brz development i build proces

## Primer upotrebe u praksi

### Vladin portal

```tsx
// Prikazivanje stopa nezaposlenosti po regionima
<ColumnChart
  data={regionData}
  xKey="region"
  yKey="unemploymentRate"
  title="Stopa nezaposlenosti po regionima - 2024"
  color="#c6363c" // Srpska crvena
  showTooltip
  formatValue={(value) => `${value.toFixed(1)}%`}
/>
```

### Medijska aplikacija

```tsx
// Vremenska serija za epidemiju
<LineChart
  data={covidData}
  xKey="date"
  yKey="cases"
  title="Dnevni broj slučajeva COVID-19"
  showCrosshair
  animation
  responsive
/>
```

## Integracija sa postojećim sistemima

Vizualni Admin se lako integriše sa:

- **Next.js aplikacijama** kroz SSR i SSG
- **React aplikacijama** (CRA, Vite, itd.)
- **Static site generator-ima** (Gatsby, Astro)
- **iFrame ugradnjom** za sisteme koji ne koriste React

## Community i podrška

- **GitHub Issues** - Prijavite bugove i request-ujte feature-e
- **Dokumentacija** - Detaljna dokumentacija sa primerima
- **Primeri** - Real-world primeri upotrebe
- **Contributing** - Vodič za doprinoše projekte

---

## Sledeći koraci

- [Instalacija](/uvod/instalacija) - Kako da instalirate paket
- [Brzi početak](/uvod/brzi-pocetak) - Kreirajte prvi grafikon
- [Komponente](/komponente/) - Saznajte više o dostupnim komponentama
- [API Reference](/reference/api) - Detaljna API dokumentacija