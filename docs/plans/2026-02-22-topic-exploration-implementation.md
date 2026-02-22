# Topic-Based Data Exploration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Add topic-based exploration pages to help users discover Serbian open
data datasets.

**Architecture:** Static pages (`/topics` and `/topics/[topic]`) that read from
curated JSON files. Topic pages list datasets with "Visualize" buttons that link
to the chart creation flow with pre-filled dataset parameters.

**Tech Stack:** Next.js Pages Router, MUI components, TypeScript, JSON data
files

---

## Task 1: Create Topic Types

**Files:**

- Create: `app/types/topics.ts`

**Step 1: Write the types**

```typescript
// app/types/topics.ts

export interface LocalizedString {
  sr: string;
  "sr-Latn"?: string;
  en: string;
}

export interface Topic {
  id: string;
  title: LocalizedString;
  icon: string;
  description: LocalizedString;
  datasetCount: number;
}

export interface Dataset {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  dataGovRsId: string;
  dataGovRsUrl: string;
  tags: string[];
  lastUpdated: string;
  format: "CSV" | "JSON" | "XLSX" | "XML";
  recommendedChart?: "bar" | "line" | "pie" | "map" | "area";
}

export interface TopicData {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  datasets: Dataset[];
}

export interface TopicIndex {
  topics: Topic[];
}
```

**Step 2: Commit**

```bash
git add app/types/topics.ts
git commit -m "feat: add topic and dataset types"
```

---

## Task 2: Create Topic Index Data

**Files:**

- Create: `app/data/topics/index.json`

**Step 1: Write the topic index**

```json
{
  "topics": [
    {
      "id": "economy",
      "title": {
        "sr": "Економија и финансије",
        "sr-Latn": "Ekonomija i finansije",
        "en": "Economy & Finance"
      },
      "icon": "AttachMoney",
      "description": {
        "sr": "Буджети, порези, јавни дуг и финансијски показатељи",
        "sr-Latn": "Budžeti, porezi, javni dug i finansijski pokazatelji",
        "en": "Budgets, taxes, public debt and financial indicators"
      },
      "datasetCount": 3
    },
    {
      "id": "health",
      "title": {
        "sr": "Здравство",
        "sr-Latn": "Zdravstvo",
        "en": "Health"
      },
      "icon": "LocalHospital",
      "description": {
        "sr": "Здравствени подаци, болнице, апотеке и јавно здравље",
        "sr-Latn": "Zdravstveni podaci, bolnice, apoteke i javno zdravlje",
        "en": "Health data, hospitals, pharmacies and public health"
      },
      "datasetCount": 3
    },
    {
      "id": "education",
      "title": {
        "sr": "Образовање",
        "sr-Latn": "Obrazovanje",
        "en": "Education"
      },
      "icon": "School",
      "description": {
        "sr": "Школе, универзитети, ученици и образовни ресурси",
        "sr-Latn": "Škole, univerziteti, učenici i obrazovni resursi",
        "en": "Schools, universities, students and educational resources"
      },
      "datasetCount": 3
    },
    {
      "id": "demographics",
      "title": {
        "sr": "Демографија",
        "sr-Latn": "Demografija",
        "en": "Demographics"
      },
      "icon": "Groups",
      "description": {
        "sr": "Популација, миграције, старосна структура и становништво",
        "sr-Latn": "Populacija, migracije, starosna struktura i stanovništvo",
        "en": "Population, migrations, age structure and residents"
      },
      "datasetCount": 3
    },
    {
      "id": "environment",
      "title": {
        "sr": "Животна средина",
        "sr-Latn": "Životna sredina",
        "en": "Environment"
      },
      "icon": "Nature",
      "description": {
        "sr": "Квалитет ваздуха, вода, отпад и заштита животне средине",
        "sr-Latn": "Kvalitet vazduha, voda, otpad i zaštita životne sredine",
        "en": "Air quality, water, waste and environmental protection"
      },
      "datasetCount": 3
    },
    {
      "id": "transport",
      "title": {
        "sr": "Саобраћај",
        "sr-Latn": "Saobraćaj",
        "en": "Transport"
      },
      "icon": "DirectionsCar",
      "description": {
        "sr": "Путни саобраћај, безбедност, јавни превоз и инфраструктура",
        "sr-Latn": "Putni saobraćaj, bezbednost, javni prevoz i infrastruktura",
        "en": "Road traffic, safety, public transport and infrastructure"
      },
      "datasetCount": 3
    }
  ]
}
```

**Step 2: Commit**

```bash
git add app/data/topics/index.json
git commit -m "feat: add topic index data"
```

---

## Task 3: Create Economy Topic Data

**Files:**

- Create: `app/data/topics/economy.json`

**Step 1: Write economy datasets**

```json
{
  "id": "economy",
  "title": {
    "sr": "Економија и финансије",
    "sr-Latn": "Ekonomija i finansije",
    "en": "Economy & Finance"
  },
  "description": {
    "sr": "Буджети, порези, јавни дуг и финансијски показатељи",
    "en": "Budgets, taxes, public debt and financial indicators"
  },
  "datasets": [
    {
      "id": "republic-budget-2024",
      "title": {
        "sr": "Републички буџет за 2024. годину",
        "en": "Republic Budget for 2024"
      },
      "description": {
        "sr": "Приходи и расходи Републике Србије по категоријама",
        "en": "Revenues and expenditures of the Republic of Serbia by category"
      },
      "dataGovRsId": "budzet-republike-srbije",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/budzet-republike-srbije/",
      "tags": ["budget", "annual", "finance"],
      "lastUpdated": "2024-01-15",
      "format": "CSV",
      "recommendedChart": "bar"
    },
    {
      "id": "public-debt",
      "title": {
        "sr": "Јавни дуг Републике Србије",
        "en": "Public Debt of the Republic of Serbia"
      },
      "description": {
        "sr": "Месечни подаци о јавном дугу по врсти и валути",
        "en": "Monthly public debt data by type and currency"
      },
      "dataGovRsId": "javni-dug-srbije",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/javni-dug-srbije/",
      "tags": ["debt", "monthly", "finance"],
      "lastUpdated": "2024-01-01",
      "format": "CSV",
      "recommendedChart": "line"
    },
    {
      "id": "foreign-trade",
      "title": {
        "sr": "Спољна трговина",
        "en": "Foreign Trade"
      },
      "description": {
        "sr": "Извоз и увоз робе по земљама и категоријама",
        "en": "Export and import of goods by country and category"
      },
      "dataGovRsId": "spoljna-trgovina",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/spoljna-trgovina/",
      "tags": ["trade", "export", "import"],
      "lastUpdated": "2024-02-01",
      "format": "CSV",
      "recommendedChart": "bar"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add app/data/topics/economy.json
git commit -m "feat: add economy topic datasets"
```

---

## Task 4: Create Health Topic Data

**Files:**

- Create: `app/data/topics/health.json`

**Step 1: Write health datasets**

```json
{
  "id": "health",
  "title": {
    "sr": "Здравство",
    "sr-Latn": "Zdravstvo",
    "en": "Health"
  },
  "description": {
    "sr": "Здравствени подаци, болнице, апотеке и јавно здравље",
    "en": "Health data, hospitals, pharmacies and public health"
  },
  "datasets": [
    {
      "id": "healthcare-institutions",
      "title": {
        "sr": "Здравствене установе",
        "en": "Healthcare Institutions"
      },
      "description": {
        "sr": "Листа болница, здравствених центара и амбуланти",
        "en": "List of hospitals, health centers and clinics"
      },
      "dataGovRsId": "zdravstvene-ustanove",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/zdravstvene-ustanove/",
      "tags": ["hospitals", "facilities", "healthcare"],
      "lastUpdated": "2023-12-01",
      "format": "CSV",
      "recommendedChart": "map"
    },
    {
      "id": "pharmacies",
      "title": {
        "sr": "Јавно здравствена апотеке",
        "en": "Public Health Pharmacies"
      },
      "description": {
        "sr": "Листа јавних апотека и њихова локација",
        "en": "List of public pharmacies and their locations"
      },
      "dataGovRsId": "javne-apoteke",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/javne-apoteke/",
      "tags": ["pharmacies", "facilities", "healthcare"],
      "lastUpdated": "2023-11-15",
      "format": "CSV",
      "recommendedChart": "map"
    },
    {
      "id": "vaccination-coverage",
      "title": {
        "sr": "Вакцинација и превенција",
        "en": "Vaccination and Prevention"
      },
      "description": {
        "sr": "Стопа вакцинисаности по старосним групама",
        "en": "Vaccination coverage rates by age groups"
      },
      "dataGovRsId": "vakcinacija-prevencija",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/vakcinacija-prevencija/",
      "tags": ["vaccination", "prevention", "public-health"],
      "lastUpdated": "2023-12-31",
      "format": "CSV",
      "recommendedChart": "bar"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add app/data/topics/health.json
git commit -m "feat: add health topic datasets"
```

---

## Task 5: Create Education Topic Data

**Files:**

- Create: `app/data/topics/education.json`

**Step 1: Write education datasets**

```json
{
  "id": "education",
  "title": {
    "sr": "Образовање",
    "sr-Latn": "Obrazovanje",
    "en": "Education"
  },
  "description": {
    "sr": "Школе, универзитети, ученици и образовни ресурси",
    "en": "Schools, universities, students and educational resources"
  },
  "datasets": [
    {
      "id": "primary-schools",
      "title": {
        "sr": "Основне школе",
        "en": "Primary Schools"
      },
      "description": {
        "sr": "Основне школе у Републици Србији са подацима о ученицима",
        "en": "Primary schools in Serbia with student data"
      },
      "dataGovRsId": "osnovne-skole",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/osnovne-skole/",
      "tags": ["schools", "primary", "education"],
      "lastUpdated": "2023-09-01",
      "format": "CSV",
      "recommendedChart": "map"
    },
    {
      "id": "secondary-schools",
      "title": {
        "sr": "Средње школе",
        "en": "Secondary Schools"
      },
      "description": {
        "sr": "Средње школе и гимназије са подацима о ученицима",
        "en": "Secondary schools and gymnasiums with student data"
      },
      "dataGovRsId": "srednje-skole",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/srednje-skole/",
      "tags": ["schools", "secondary", "education"],
      "lastUpdated": "2023-09-01",
      "format": "CSV",
      "recommendedChart": "map"
    },
    {
      "id": "university-enrollment",
      "title": {
        "sr": "Упис на факултете",
        "en": "University Enrollment"
      },
      "description": {
        "sr": "Број уписаних студената по факултетима и годинама",
        "en": "Number of enrolled students by faculty and year"
      },
      "dataGovRsId": "univerzitet-upis",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/univerzitet-upis/",
      "tags": ["university", "enrollment", "education"],
      "lastUpdated": "2023-10-15",
      "format": "CSV",
      "recommendedChart": "bar"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add app/data/topics/education.json
git commit -m "feat: add education topic datasets"
```

---

## Task 6: Create Demographics Topic Data

**Files:**

- Create: `app/data/topics/demographics.json`

**Step 1: Write demographics datasets**

```json
{
  "id": "demographics",
  "title": {
    "sr": "Демографија",
    "sr-Latn": "Demografija",
    "en": "Demographics"
  },
  "description": {
    "sr": "Популација, миграције, старосна структура и становништво",
    "en": "Population, migrations, age structure and residents"
  },
  "datasets": [
    {
      "id": "population-by-municipality",
      "title": {
        "sr": "Становништво по општинама",
        "en": "Population by Municipality"
      },
      "description": {
        "sr": "Број становника по општинама и градовима",
        "en": "Population count by municipalities and cities"
      },
      "dataGovRsId": "stanovnistvo-opstine",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/stanovnistvo-opstine/",
      "tags": ["population", "municipalities", "census"],
      "lastUpdated": "2022-12-31",
      "format": "CSV",
      "recommendedChart": "map"
    },
    {
      "id": "age-structure",
      "title": {
        "sr": "Старосна структура",
        "en": "Age Structure"
      },
      "description": {
        "sr": "Расподела становништва по старосним групама",
        "en": "Population distribution by age groups"
      },
      "dataGovRsId": "starosna-struktura",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/starosna-struktura/",
      "tags": ["population", "age", "demographics"],
      "lastUpdated": "2022-12-31",
      "format": "CSV",
      "recommendedChart": "bar"
    },
    {
      "id": "migration-statistics",
      "title": {
        "sr": "Миграције становништва",
        "en": "Population Migration"
      },
      "description": {
        "sr": "Подаци о усељавању и исељавању",
        "en": "Data on immigration and emigration"
      },
      "dataGovRsId": "migracije-stanovnistva",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/migracije-stanovnistva/",
      "tags": ["migration", "population", "demographics"],
      "lastUpdated": "2023-06-30",
      "format": "CSV",
      "recommendedChart": "line"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add app/data/topics/demographics.json
git commit -m "feat: add demographics topic datasets"
```

---

## Task 7: Create Environment Topic Data

**Files:**

- Create: `app/data/topics/environment.json`

**Step 1: Write environment datasets**

```json
{
  "id": "environment",
  "title": {
    "sr": "Животна средина",
    "sr-Latn": "Životna sredina",
    "en": "Environment"
  },
  "description": {
    "sr": "Квалитет ваздуха, вода, отпад и заштита животне средине",
    "en": "Air quality, water, waste and environmental protection"
  },
  "datasets": [
    {
      "id": "air-quality-index",
      "title": {
        "sr": "Индекс квалитета ваздуха",
        "en": "Air Quality Index"
      },
      "description": {
        "sr": "Мерења квалитета ваздуха по градовима",
        "en": "Air quality measurements by city"
      },
      "dataGovRsId": "kvalitet-vazduha",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/kvalitet-vazduha/",
      "tags": ["air", "quality", "environment"],
      "lastUpdated": "2024-02-15",
      "format": "CSV",
      "recommendedChart": "line"
    },
    {
      "id": "water-quality",
      "title": {
        "sr": "Квалитет воде",
        "en": "Water Quality"
      },
      "description": {
        "sr": "Квалитет површинских и подземних вода",
        "en": "Quality of surface and groundwater"
      },
      "dataGovRsId": "kvalitet-vode",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/kvalitet-vode/",
      "tags": ["water", "quality", "environment"],
      "lastUpdated": "2023-12-31",
      "format": "CSV",
      "recommendedChart": "line"
    },
    {
      "id": "waste-management",
      "title": {
        "sr": "Управљање отпадом",
        "en": "Waste Management"
      },
      "description": {
        "sr": "Подаци о прикупљању и рециклажи отпада",
        "en": "Data on waste collection and recycling"
      },
      "dataGovRsId": "upravljanje-otpadom",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/upravljanje-otpadom/",
      "tags": ["waste", "recycling", "environment"],
      "lastUpdated": "2023-12-31",
      "format": "CSV",
      "recommendedChart": "pie"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add app/data/topics/environment.json
git commit -m "feat: add environment topic datasets"
```

---

## Task 8: Create Transport Topic Data

**Files:**

- Create: `app/data/topics/transport.json`

**Step 1: Write transport datasets**

```json
{
  "id": "transport",
  "title": {
    "sr": "Саобраћај",
    "sr-Latn": "Saobraćaj",
    "en": "Transport"
  },
  "description": {
    "sr": "Путни саобраћај, безбедност, јавни превоз и инфраструктура",
    "en": "Road traffic, safety, public transport and infrastructure"
  },
  "datasets": [
    {
      "id": "traffic-accidents",
      "title": {
        "sr": "Саобраћајне незгоде",
        "en": "Traffic Accidents"
      },
      "description": {
        "sr": "Број и врсте саобраћајних незгода по регионима",
        "en": "Number and types of traffic accidents by region"
      },
      "dataGovRsId": "saobracajne-nezgode",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/saobracajne-nezgode/",
      "tags": ["traffic", "accidents", "safety"],
      "lastUpdated": "2023-12-31",
      "format": "CSV",
      "recommendedChart": "bar"
    },
    {
      "id": "registered-vehicles",
      "title": {
        "sr": "Регистрована возила",
        "en": "Registered Vehicles"
      },
      "description": {
        "sr": "Број регистрованих возила по врсти и региону",
        "en": "Number of registered vehicles by type and region"
      },
      "dataGovRsId": "registrovana-vozila",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/registrovana-vozila/",
      "tags": ["vehicles", "registration", "transport"],
      "lastUpdated": "2024-01-31",
      "format": "CSV",
      "recommendedChart": "bar"
    },
    {
      "id": "road-network",
      "title": {
        "sr": "Мрежа путева",
        "en": "Road Network"
      },
      "description": {
        "sr": "Дужина и категорије путева у Србији",
        "en": "Length and categories of roads in Serbia"
      },
      "dataGovRsId": "mreza-puteva",
      "dataGovRsUrl": "https://data.gov.rs/sr/datasets/mreza-puteva/",
      "tags": ["roads", "infrastructure", "transport"],
      "lastUpdated": "2023-06-30",
      "format": "CSV",
      "recommendedChart": "pie"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add app/data/topics/transport.json
git commit -m "feat: add transport topic datasets"
```

---

## Task 9: Create TopicCard Component

**Files:**

- Create: `app/components/topics/TopicCard.tsx`

**Step 1: Write the failing test**

Create: `app/components/topics/__tests__/TopicCard.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import { TopicCard } from "../TopicCard";
import type { Topic } from "@/types/topics";

const mockTopic: Topic = {
  id: "economy",
  title: {
    sr: "Економија и финансије",
    "sr-Latn": "Ekonomija i finansije",
    en: "Economy & Finance",
  },
  icon: "AttachMoney",
  description: {
    sr: "Буджети, порези, јавни дуг",
    "sr-Latn": "Budžeti, porezi, javni dug",
    en: "Budgets, taxes, public debt",
  },
  datasetCount: 5,
};

describe("TopicCard", () => {
  it("renders topic title in English", () => {
    render(<TopicCard topic={mockTopic} locale="en" />);
    expect(screen.getByText("Economy & Finance")).toBeInTheDocument();
  });

  it("renders topic title in Serbian", () => {
    render(<TopicCard topic={mockTopic} locale="sr" />);
    expect(screen.getByText("Економија и финансије")).toBeInTheDocument();
  });

  it("renders dataset count", () => {
    render(<TopicCard topic={mockTopic} locale="en" />);
    expect(screen.getByText("5 datasets")).toBeInTheDocument();
  });

  it("links to topic page", () => {
    render(<TopicCard topic={mockTopic} locale="en" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/topics/economy");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- components/topics/__tests__/TopicCard.test.tsx`
Expected: FAIL - Cannot find module '../TopicCard'

**Step 3: Write the component**

```typescript
// app/components/topics/TopicCard.tsx
import { Card, CardContent, Typography, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import NatureIcon from "@mui/icons-material/Nature";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Link from "next/link";
import type { Topic, LocalizedString } from "@/types/topics";

const iconMap: Record<string, React.ComponentType> = {
  AttachMoney: AttachMoneyIcon,
  LocalHospital: LocalHospitalIcon,
  School: SchoolIcon,
  Groups: GroupsIcon,
  Nature: NatureIcon,
  DirectionsCar: DirectionsCarIcon,
};

function getLocalizedText(text: LocalizedString, locale: string): string {
  if (locale === "sr") return text.sr;
  if (locale === "sr-Latn") return text["sr-Latn"] || text.sr;
  return text.en;
}

interface TopicCardProps {
  topic: Topic;
  locale: string;
}

export function TopicCard({ topic, locale }: TopicCardProps) {
  const IconComponent = iconMap[topic.icon] || AttachMoneyIcon;
  const title = getLocalizedText(topic.title, locale);
  const description = getLocalizedText(topic.description, locale);
  const datasetLabel = locale === "sr" || locale === "sr-Latn" ? "скупова података" : "datasets";

  return (
    <Link href={`/topics/${topic.id}`} passHref legacyBehavior>
      <Card
        component="a"
        sx={{
          cursor: "pointer",
          textDecoration: "none",
          height: "100%",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconComponent
              sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
            />
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, minHeight: 40 }}
          >
            {description}
          </Typography>
          <Typography variant="caption" color="primary">
            {topic.datasetCount} {datasetLabel}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- components/topics/__tests__/TopicCard.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/components/topics/TopicCard.tsx app/components/topics/__tests__/TopicCard.test.tsx
git commit -m "feat: add TopicCard component"
```

---

## Task 10: Create DatasetCard Component

**Files:**

- Create: `app/components/topics/DatasetCard.tsx`

**Step 1: Write the failing test**

Create: `app/components/topics/__tests__/DatasetCard.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import { DatasetCard } from "../DatasetCard";
import type { Dataset } from "@/types/topics";

const mockDataset: Dataset = {
  id: "republic-budget-2024",
  title: {
    sr: "Републички буџет за 2024. годину",
    en: "Republic Budget for 2024",
  },
  description: {
    sr: "Приходи и расходи Републике Србије",
    en: "Revenues and expenditures of the Republic of Serbia",
  },
  dataGovRsId: "budzet-republike-srbije",
  dataGovRsUrl: "https://data.gov.rs/sr/datasets/budzet-republike-srbije/",
  tags: ["budget", "annual", "finance"],
  lastUpdated: "2024-01-15",
  format: "CSV",
  recommendedChart: "bar",
};

describe("DatasetCard", () => {
  it("renders dataset title in English", () => {
    render(<DatasetCard dataset={mockDataset} locale="en" />);
    expect(screen.getByText("Republic Budget for 2024")).toBeInTheDocument();
  });

  it("renders dataset title in Serbian", () => {
    render(<DatasetCard dataset={mockDataset} locale="sr" />);
    expect(
      screen.getByText("Републички буџет за 2024. годину")
    ).toBeInTheDocument();
  });

  it("renders format badge", () => {
    render(<DatasetCard dataset={mockDataset} locale="en" />);
    expect(screen.getByText("CSV")).toBeInTheDocument();
  });

  it("renders visualize button", () => {
    render(<DatasetCard dataset={mockDataset} locale="en" />);
    expect(
      screen.getByRole("link", { name: /visualize/i })
    ).toBeInTheDocument();
  });

  it("links to create page with dataset parameter", () => {
    render(<DatasetCard dataset={mockDataset} locale="en" />);
    const link = screen.getByRole("link", { name: /visualize/i });
    expect(link).toHaveAttribute(
      "href",
      "/create/new?dataset=budzet-republike-srbije&chart=bar"
    );
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- components/topics/__tests__/DatasetCard.test.tsx`
Expected: FAIL - Cannot find module '../DatasetCard'

**Step 3: Write the component**

```typescript
// app/components/topics/DatasetCard.tsx
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Link from "next/link";
import type { Dataset, LocalizedString } from "@/types/topics";

function getLocalizedText(text: LocalizedString, locale: string): string {
  if (locale === "sr") return text.sr;
  if (locale === "sr-Latn") return text["sr-Latn"] || text.sr;
  return text.en;
}

interface DatasetCardProps {
  dataset: Dataset;
  locale: string;
}

export function DatasetCard({ dataset, locale }: DatasetCardProps) {
  const title = getLocalizedText(dataset.title, locale);
  const description = getLocalizedText(dataset.description, locale);
  const visualizeLabel =
    locale === "sr"
      ? "Визуализуј"
      : locale === "sr-Latn"
      ? "Vizualizuj"
      : "Visualize";
  const viewOnDataGovLabel =
    locale === "sr"
      ? "Погледај на data.gov.rs"
      : locale === "sr-Latn"
      ? "Pogledaj na data.gov.rs"
      : "View on data.gov.rs";

  const visualizeHref = dataset.recommendedChart
    ? `/create/new?dataset=${dataset.dataGovRsId}&chart=${dataset.recommendedChart}`
    : `/create/new?dataset=${dataset.dataGovRsId}`;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip label={dataset.format} size="small" variant="outlined" />
              <Typography variant="caption" color="text.secondary">
                {locale === "sr" || locale === "sr-Latn" ? "Ажурирано" : "Updated"}:{" "}
                {dataset.lastUpdated}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
            <Link href={visualizeHref} passHref legacyBehavior>
              <Button variant="contained" color="primary" component="a">
                {visualizeLabel}
              </Button>
            </Link>
            <Link href={dataset.dataGovRsUrl} passHref legacyBehavior>
              <Button
                variant="text"
                size="small"
                component="a"
                target="_blank"
                endIcon={<OpenInNewIcon />}
              >
                {viewOnDataGovLabel}
              </Button>
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- components/topics/__tests__/DatasetCard.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/components/topics/DatasetCard.tsx app/components/topics/__tests__/DatasetCard.test.tsx
git commit -m "feat: add DatasetCard component"
```

---

## Task 11: Create Topics Index Page

**Files:**

- Create: `app/pages/topics/index.tsx`

**Step 1: Write the page**

```typescript
// app/pages/topics/index.tsx
import { Container, Typography, Grid, Box } from "@mui/material";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout";
import { TopicCard } from "@/components/topics/TopicCard";
import topicIndex from "@/data/topics/index.json";
import type { Topic, TopicIndex } from "@/types/topics";

interface TopicsPageProps {
  topics: Topic[];
}

export default function TopicsPage({ topics }: TopicsPageProps) {
  const router = useRouter();
  const locale = (router.locale || "sr") as string;

  const pageTitle =
    locale === "sr"
      ? "Истражите отворене податке | Vizualni Admin"
      : locale === "sr-Latn"
      ? "Istražite otvorene podatke | Vizualni Admin"
      : "Explore Open Data | Vizualni Admin";

  const heading =
    locale === "sr"
      ? "Истражите отворене податке"
      : locale === "sr-Latn"
      ? "Istražite otvorene podatke"
      : "Explore Open Data";

  const subheading =
    locale === "sr"
      ? "Пронађите скупове података по категоријама и визуализујте их"
      : locale === "sr-Latn"
      ? "Pronađite skupove podataka po kategorijama i vizualizujte ih"
      : "Find datasets by category and visualize them";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={subheading}
        />
      </Head>
      <AppLayout>
        <Container sx={{ py: 6 }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {heading}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {subheading}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {topics.map((topic) => (
              <Grid item xs={12} sm={6} md={4} key={topic.id}>
                <TopicCard topic={topic} locale={locale} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </AppLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<TopicsPageProps> = async ({
  locale,
}) => {
  const data = topicIndex as TopicIndex;

  return {
    props: {
      topics: data.topics,
    },
  };
};
```

**Step 2: Commit**

```bash
git add app/pages/topics/index.tsx
git commit -m "feat: add topics listing page"
```

---

## Task 12: Create Individual Topic Page

**Files:**

- Create: `app/pages/topics/[topic].tsx`

**Step 1: Write the page**

```typescript
// app/pages/topics/[topic].tsx
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout";
import { DatasetCard } from "@/components/topics/DatasetCard";
import topicIndex from "@/data/topics/index.json";
import type { Topic, TopicData, TopicIndex, LocalizedString } from "@/types/topics";

interface TopicPageProps {
  topic: TopicData;
}

function getLocalizedText(text: LocalizedString, locale: string): string {
  if (locale === "sr") return text.sr;
  if (locale === "sr-Latn") return text["sr-Latn"] || text.sr;
  return text.en;
}

export default function TopicPage({ topic }: TopicPageProps) {
  const router = useRouter();
  const locale = (router.locale || "sr") as string;

  const title = getLocalizedText(topic.title, locale);
  const description = getLocalizedText(topic.description, locale);

  const pageTitle = `${title} | Vizualni Admin`;

  const backLabel =
    locale === "sr"
      ? "Теме"
      : locale === "sr-Latn"
      ? "Teme"
      : "Topics";

  const datasetsLabel =
    locale === "sr"
      ? "Скупови података"
      : locale === "sr-Latn"
      ? "Skupovi podataka"
      : "Datasets";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
      </Head>
      <AppLayout>
        <Container sx={{ py: 6 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/topics" passHref legacyBehavior>
              <MuiLink
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
              >
                {backLabel}
              </MuiLink>
            </Link>
            <Typography color="text.primary">{title}</Typography>
          </Breadcrumbs>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {description}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2">
              {datasetsLabel}
            </Typography>
          </Box>

          <Box>
            {topic.datasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
                locale={locale}
              />
            ))}
          </Box>
        </Container>
      </AppLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = topicIndex as TopicIndex;
  const paths = data.topics.map((topic) => ({
    params: { topic: topic.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TopicPageProps> = async ({
  params,
  locale,
}) => {
  const topicId = params?.topic as string;

  try {
    const topicData = require(`@/data/topics/${topicId}.json`) as TopicData;

    return {
      props: {
        topic: topicData,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
```

**Step 2: Commit**

```bash
git add app/pages/topics/[topic].tsx
git commit -m "feat: add individual topic page"
```

---

## Task 13: Add Navigation Link

**Files:**

- Modify: `app/components/navigation/NavBar.tsx`

**Step 1: Add Explore link to navigation**

Update the `navigationItems` array in `app/components/navigation/NavBar.tsx`:

```typescript
// Add import at top
import ExploreIcon from '@mui/icons-material/Explore';

// Update navigationItems array
const navigationItems = [
  { label: { sr: 'Početna', en: 'Home' }, href: '/', icon: <HomeIcon /> },
  { label: { sr: 'Istraži', en: 'Explore' }, href: '/topics', icon: <ExploreIcon /> },
  { label: { sr: 'Demo', en: 'Demos' }, href: '/demos', icon: <BarChartIcon /> },
  { label: { sr: 'Tutorijali', en: 'Tutorials' }, href: '/tutorials', icon: <MenuBookIcon /> },
  { label: { sr: 'Dokumentacija', en: 'Docs' }, href: '/docs', icon: <DescriptionIcon /> },
];
```

**Step 2: Commit**

```bash
git add app/components/navigation/NavBar.tsx
git commit -m "feat: add Explore link to navigation"
```

---

## Task 14: Run Full Test Suite

**Step 1: Run all tests**

Run: `cd app && npm test` Expected: All tests pass

**Step 2: Run type check**

Run: `cd app && npm run typecheck` Expected: No TypeScript errors

**Step 3: Run lint**

Run: `cd app && npm run lint` Expected: No lint errors

---

## Task 15: Final Integration Commit

**Step 1: Verify build works**

Run: `cd app && npm run build` Expected: Build succeeds

**Step 2: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: integration fixes for topic exploration"
```

---

## Summary

| Task | Description                  |
| ---- | ---------------------------- |
| 1    | Create Topic types           |
| 2-8  | Create topic data JSON files |
| 9    | Create TopicCard component   |
| 10   | Create DatasetCard component |
| 11   | Create topics listing page   |
| 12   | Create individual topic page |
| 13   | Add navigation link          |
| 14   | Run tests and type checks    |
| 15   | Final integration            |

**Total:** 15 tasks
