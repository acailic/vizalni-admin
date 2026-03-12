import { ColumnChart } from "@/components/demos/charts/ColumnChart";
import { LineChart } from "@/components/demos/charts/LineChart";
import type { StoryConfig } from "@/types/stories";

import type { ComponentType } from "react";

export const demographicsStory: StoryConfig = {
  id: "demographics",
  title: {
    sr: "Demografska Kriza: Priča o Promenama",
    en: "Demographic Crisis: A Story of Change",
  },
  description: {
    sr: "Putujte kroz 20 godina demografskih promena u Srbiji: od opadanja populacije do odliva mozgova.",
    en: "Journey through 20 years of demographic changes in Serbia: from population decline to brain drain.",
  },
  estimatedMinutes: 5,
  difficulty: "beginner",
  theme: "demographics",
  steps: [
    {
      id: "national-trend",
      title: {
        sr: "Nacionalni Trend: Od 7.5M do 6.7M",
        en: "National Trend: From 7.5M to 6.7M",
      },
      narrative: {
        sr: "Od 2002. godine, Srbija je izgubila više od 800.000 stanovnika. Ovaj trend se nastavlja uz posledice po ekonomiju, zdravstveni sistem i društvenu stabilnost.",
        en: "Since 2002, Serbia has lost over 800,000 residents. This trend continues with consequences for the economy, healthcare system, and social stability.",
      },
      chartComponent: LineChart as ComponentType<any>,
      chartProps: {
        data: [
          { year: "2002", population: 7.5 },
          { year: "2010", population: 7.3 },
          { year: "2015", population: 7.1 },
          { year: "2022", population: 6.7 },
        ],
        xKey: "year",
        yKey: "population",
        xLabel: "Year / Godina",
        yLabel: "Population (millions) / Stanovništvo (milioni)",
        color: "#ec4899",
      },
      insights: [
        "Pad od 11% u poslednje dve decenije / 11% decline in the last two decades",
        "Prosečna gubitak od ~40.000 stanovnika godišnje / Average loss of ~40,000 residents annually",
      ],
      callout: {
        sr: "Stopa nataliteta je 8.6 na 1.000 stanovnika - ispod nivoa neophodnog za održavanje populacije.",
        en: "The birth rate is 8.6 per 1,000 residents - below the level needed to maintain population.",
      },
    },
    {
      id: "regional-impact",
      title: {
        sr: "Regionalna Nejednakost: Istok vs Zapad",
        en: "Regional Disparity: East vs West",
      },
      narrative: {
        sr: "Istočna Srbija je najpogođenija sa -22% opadanjem stanovništva, dok Beograd beleži rast od +5%. Regionalni jaz se širi i stvara duboke društvene i ekonomske razlike.",
        en: "Eastern Serbia is most affected with -22% population decline, while Belgrade grew +5%. The regional gap is widening, creating deep social and economic differences.",
      },
      chartComponent: ColumnChart as ComponentType<any>,
      chartProps: {
        data: [
          { region: "Beograd", change: 5.0 },
          { region: "Vojvodina", change: -8.0 },
          { region: "Šumadija", change: -12.0 },
          { region: "Južna Srbija", change: -18.0 },
          { region: "Istočna Srbija", change: -22.0 },
        ],
        xKey: "region",
        yKey: "change",
        xLabel: "Region / Regija",
        yLabel: "Population Change (%) / Promena stanovništva (%)",
        color: "#3b82f6",
        showZeroLine: true,
      },
      insights: [
        "Beograd: +5% rasta / Belgrade: +5% growth",
        "Istok: -22% opadanja / East: -22% decline",
        "Regionalni jaz se širi / Regional gap widening",
      ],
      callout: {
        sr: "Beograd koncentriše 25% populacije Srbije na samo 3% teritorije.",
        en: "Belgrade concentrates 25% of Serbia's population on just 3% of the territory.",
      },
    },
    {
      id: "age-structure",
      title: {
        sr: "Starenje: 65+ dvastruko do 2050",
        en: "Aging: 65+ will double by 2050",
      },
      narrative: {
        sr: "Srbija ima jednu od najstarijih populacija u Evropi. Do 2050. godine, broj stanovnika starijih od 65 godina će se udvostručiti, dok se radno aktivno stanovništvo smanjuje.",
        en: "Serbia has one of the oldest populations in Europe. By 2050, the number of residents over 65 will double, while the working-age population shrinks.",
      },
      chartComponent: ColumnChart as ComponentType<any>,
      chartProps: {
        data: [
          { year: "2000", age_0_14: 18.5, age_15_64: 67.2, age_65_plus: 14.3 },
          { year: "2024", age_0_14: 14.8, age_15_64: 63.5, age_65_plus: 21.7 },
          { year: "2050", age_0_14: 12.5, age_15_64: 55.8, age_65_plus: 31.7 },
        ],
        xKey: "year",
        yKey: ["age_0_14", "age_15_64", "age_65_plus"],
        xLabel: "Year / Godina",
        yLabel: "Population Share (%) / Udio u stanovništvu (%)",
        colors: ["#22c55e", "#3b82f6", "#ef4444"],
        multiSeries: true,
        stacked: true,
      },
      insights: [
        "Srednja starost: 43.5 godina / Median age: 43.5 years",
        "Radno aktivno stanovništvo se smanjuje / Working age shrinking",
        "Teret penzionera raste / Pension burden increasing",
      ],
      callout: {
        sr: "Odnos radnika-prema-penzionerima će pasti sa 3:1 na 2:1 do 2050. godine.",
        en: "Worker-to-pensioner ratio will drop from 3:1 to 2:1 by 2050.",
      },
    },
    {
      id: "brain-drain",
      title: {
        sr: "Odliv Mozgova: 40% Diplomaca Planira Odlazak",
        en: "Brain Drain: 40% of Graduates Plan to Leave",
      },
      narrative: {
        sr: "Visokoobrazovani mladi ljudi odlaze u potrazi za boljim prilikama. IT sektor, medicina i inženjering su najpogođeniji, što dodatno usporava razvoj i inovacije.",
        en: "Highly educated young people leave in search of better opportunities. IT sector, medicine, and engineering are most affected, further slowing development and innovation.",
      },
      chartComponent: ColumnChart as ComponentType<any>,
      chartProps: {
        data: [
          { education: "Osnovno / Primary", intent: 15 },
          { education: "Srednje / Secondary", intent: 32 },
          { education: "Fakultet / University", intent: 40 },
          { education: "IT sektor", intent: 67 },
          { education: "Medicina / Medicine", intent: 52 },
          { education: "Inženjering / Engineering", intent: 48 },
        ],
        xKey: "education",
        yKey: "intent",
        xLabel: "Education Level / Obrazovanje",
        yLabel: "Plan to Leave (%) / Planira odlazak (%)",
        color: "#8b5cf6",
      },
      insights: [
        "IT: 67% planira odlazak / IT: 67% plan to leave",
        "Medicina: 52% planira odlazak / Medicine: 52% plan to leave",
        "Inženjering: 48% planira odlazak / Engineering: 48% plan to leave",
      ],
      callout: {
        sr: "Srbija je među top 5 zemalja u Evropi po odlivu visokoobrazovanih kadrova.",
        en: "Serbia is among the top 5 countries in Europe for brain drain of highly educated personnel.",
      },
    },
    {
      id: "what-can-be-done",
      title: {
        sr: "Šta Možemo Učiniti?",
        en: "What Can We Do?",
      },
      narrative: {
        sr: "Političke scenarije mogu poboljšati izglede. Kombinacija pro-natalnih mera, podsticaja za povratak i ekonomskih reformi značajno može uticati na demografske trendove.",
        en: "Policy scenarios could improve the outlook. A combination of pro-natal measures, return incentives, and economic reforms can significantly impact demographic trends.",
      },
      chartComponent: ColumnChart as ComponentType<any>,
      chartProps: {
        data: [
          { scenario: "Bazna prognoza / Baseline", projection: -15 },
          { scenario: "Pro-natalne mere / Pro-natal", projection: 0 },
          {
            scenario: "Podsticaji za povratak / Return incentives",
            projection: -7,
          },
          { scenario: "Kombinovani scenario / Combined", projection: 10 },
        ],
        xKey: "scenario",
        yKey: "projection",
        xLabel: "Policy Scenario / Scenario",
        yLabel: "Population Change 2050 (%) / Promena stanovništva 2050 (%)",
        color: "#10b981",
        showZeroLine: true,
      },
      insights: [
        "Pro-natalne mere: +15% projekcija / Pro-natal policies: +15% projected",
        "Podsticaji za povratak: +8% projekcija / Return incentives: +8% projected",
        "Kombinovano: +25% poboljšanje / Combined: +25% improvement",
      ],
      callout: {
        sr: "Vlada RH je 2024. usvojila paket demografskih mera vredan 500 miliona evra.",
        en: "The Government of RH adopted a demographic package worth 500 million euros in 2024.",
      },
    },
  ],
};
