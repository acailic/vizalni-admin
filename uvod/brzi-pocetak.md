# Brzi početak

Kreirajte prvi interaktivni grafikon za manje od 5 minuta!

## 1. Osnovni primer

### Import i korišćenje

```tsx
import { LineChart } from '@acailic/vizualni-admin';

const data = [
  { label: '2019', value: 72 },
  { label: '2020', value: 54 },
  { label: '2021', value: 63 },
  { label: '2022', value: 81 },
  { label: '2023', value: 95 },
];

export function ZaposlenostChart() {
  return (
    <LineChart
      data={data}
      xKey="label"
      yKey="value"
      title="Oporavak zaposlenosti (%)"
      width={800}
      height={400}
      showTooltip
      showCrosshair
    />
  );
}
```

### Rezultat

Ovaj kod kreira interaktivni linijski grafikon koji prikazuje oporavak zaposlenosti u procentima.

## 2. Različite vrste grafikona

### Stubičasti grafikon

```tsx
import { ColumnChart } from '@acailic/vizualni-admin';

const godisnjiPodaci = [
  { godina: '2019', zarade: 65000 },
  { godina: '2020', zarade: 62000 },
  { godina: '2021', zarade: 68000 },
  { godina: '2022', zarade: 75000 },
];

<ColumnChart
  data={godisnjiPodaci}
  xKey="godina"
  yKey="zarade"
  title="Prosečne mesečne zarade (RSD)"
  color="#0ea5e9"
  showTooltip
  formatValue={(value) => `${value.toLocaleString('sr-RS')} RSD`}
/>
```

### Pie grafikon

```tsx
import { PieChart } from '@acailic/vizualni-admin';

const sektori = [
  { naziv: 'Industrija', udio: 35 },
  { naziv: 'Usluge', udio: 45 },
  { naziv: 'Poljoprivreda', udio: 12 },
  { naziv: 'Ostalo', udio: 8 },
];

<PieChart
  data={sektori}
  labelKey="naziv"
  valueKey="udio"
  title="Struktura GDP po sektorima (%)"
  showLegend
  colors={['#c6363c', '#0c4076', '#0ea5e9', '#10b981']}
/>
```

## 3. Podaci sa data.gov.rs

Evo primera korišćenjem stvarnih srpskih podataka:

```tsx
import { useState, useEffect } from 'react';
import { LineChart } from '@acailic/vizualni-admin';

export function PopulationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch podataka sa data.gov.rs API
    fetch('https://data.gov.rs/api/datasets/population-trends')
      .then(response => response.json())
      .then(json => {
        const formattedData = json.data.map(item => ({
          label: item.godina.toString(),
          value: item.broj_stanovnika,
          metadata: {
            region: item.region,
            source: ' Republički zavod za statistiku'
          }
        }));
        setData(formattedData);
      });
  }, []);

  return (
    <LineChart
      data={data}
      xKey="label"
      yKey="value"
      title="Kretanje stanovništva Srbije"
      subtitle="Podaci: RZS (2020-2024)"
      width={900}
      height={500}
      showTooltip
      showCrosshair
      animation
      formatValue={(value) => value.toLocaleString('sr-RS')}
      formatTooltip={(dataPoint) => ({
        title: `${dataPoint.label}. godina`,
        content: [
          `Stanovnika: ${dataPoint.value.toLocaleString('sr-RS')}`,
          dataPoint.metadata?.region || ''
        ]
      })}
    />
  );
}
```

## 4. Responsive dizajn

Svi grafikoni su automatski responsive, ali možete i eksplicitno kontrolisati:

```tsx
<LineChart
  data={data}
  xKey="date"
  yKey="value"
  responsive  // Automatska prilagođavanje veličine
  maintainAspectRatio={false}  // Popunjava dostupan prostor
  width={undefined}  // Koristi 100% širine parent-a
  height={400}  // Fiksna visina
/>
```

## 5. Custom boje i teme

### Korišćenje srpskih boja

```tsx
import { ColumnChart } from '@acailic/vizualni-admin';

<ColumnChart
  data={podaci}
  xKey="kategorija"
  yKey="vrednost"
  title="Ekonomske indikacije"
  // Srpska zastava boje
  colors={['#c6363c', '#0c4076', '#ffffff', '#c6363c']}
  //ili pojedinačno
  color="#c6363c"
/>
```

### Tamna tema

```tsx
<LineChart
  data={data}
  xKey="date"
  yKey="value"
  theme="dark"
  gridColor="#374151"
  textColor="#e5e7eb"
  backgroundColor="#1f2937"
/>
```

## 6. Export funkcionalnost

```tsx
<LineChart
  data={data}
  xKey="date"
  yKey="value"
  exportOptions={{
    enabled: true,
    formats: ['png', 'svg', 'json'],
    filename: 'chart-export',
    buttonLabel: 'Preuzmi grafikon'
  }}
/>
```

## 7. Error handling i loading stanja

```tsx
import { useState, useEffect } from 'react';
import { LineChart } from '@acailic/vizualni-admin';

function ChartWithLoading() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Greška pri učitavanju');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Učitavanje podataka...</div>;
  if (error) return <div>Greška: {error}</div>;
  if (!data || data.length === 0) return <div>Nema podataka za prikaz</div>;

  return (
    <LineChart
      data={data}
      xKey="date"
      yKey="value"
      title="Podaci"
      showTooltip
    />
  );
}
```

## 8. Kompletna komponenta

Evo kompletnog primera sa svim funkcionalnostima:

```tsx
import { useState } from 'react';
import { LineChart, ColumnChart, PieChart } from '@acailic/vizualni-admin';

export function CompleteDashboard() {
  const [selectedChart, setSelectedChart] = useState('line');

  const data = [
    { mesec: 'Jan', prodaja: 120000, porez: 24000, profit: 96000 },
    { mesec: 'Feb', prodaja: 135000, porez: 27000, profit: 108000 },
    { mesec: 'Mar', prodaja: 155000, porez: 31000, profit: 124000 },
    { mesec: 'Apr', prodaja: 145000, porez: 29000, profit: 116000 },
  ];

  const renderChart = () => {
    const commonProps = {
      data,
      responsive: true,
      showTooltip: true,
      animation: true,
    };

    switch (selectedChart) {
      case 'line':
        return (
          <LineChart
            {...commonProps}
            xKey="mesec"
            yKey="prodaja"
            title="Mesečna prodaja"
            formatValue={(value) => `${value.toLocaleString('sr-RS')} RSD`}
          />
        );
      case 'column':
        return (
          <ColumnChart
            {...commonProps}
            xKey="mesec"
            yKey="profit"
            title="Mesečni profit"
            color="#10b981"
          />
        );
      case 'pie':
        const pieData = [
          { naziv: 'Prodaja', vrednost: data.reduce((sum, d) => sum + d.prodaja, 0) },
          { naziv: 'Porez', vrednost: data.reduce((sum, d) => sum + d.porez, 0) },
          { naziv: 'Profit', vrednost: data.reduce((sum, d) => sum + d.profit, 0) },
        ];
        return (
          <PieChart
            data={pieData}
            labelKey="naziv"
            valueKey="vrednost"
            title="Ukupni prihodi"
            showLegend
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setSelectedChart('line')}>Linijski</button>
        <button onClick={() => setSelectedChart('column')}>Stubičasti</button>
        <button onClick={() => setSelectedChart('pie')}>Pie</button>
      </div>
      <div style={{ minHeight: '400px' }}>
        {renderChart()}
      </div>
    </div>
  );
}
```

## Vežbe

Probajte ove vežbe da biste savladali osnove:

1. **Kreirajte grafikon** za temperature u vašem gradu poslednjih 7 dana
2. **Dodajte interaktivnost** sa tooltip-om koji prikazuje više informacija
3. **Primenite custom boje** koje odgovaraju vašem brand-u
4. **Implementirajte export** funkcionalnost za preuzimanje grafikona
5. **Dodajte animacije** i transition efekte

## Sledeći koraci

- [Konfiguracija](/uvod/konfiguracija) - Detaljna podešavanja komponenti
- [API Reference](/reference/api) - Kompletna lista opcija i prop-ova
- [Primeri](/primeri/) - Još real-world primera
- [Lokalizacija](/uvod/lokalizacije) - Rad sa srpskim jezikom i formatima