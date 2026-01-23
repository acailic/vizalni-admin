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
    // More steps will be added in subsequent tasks
  ],
};
