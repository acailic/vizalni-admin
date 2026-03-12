import { BarChart, ColumnChart } from "@/components/demos/charts";
import type { StoryConfig } from "@/types/stories";

import type { ComponentType } from "react";

export const healthcareStory: StoryConfig = {
  id: "healthcare",
  title: {
    sr: "Izazovi Zdravstva: Liste Čekanja i Kapaciteti",
    en: "Healthcare Challenges: Waiting Lists and Capacity",
  },
  description: {
    sr: "Istražite pritisak na srpski zdravstveni sistem: od listi čekanja do neravnomerne raspodele resursa.",
    en: "Explore the pressure on Serbia's healthcare system: from waiting lists to uneven resource distribution.",
  },
  estimatedMinutes: 6,
  difficulty: "intermediate",
  theme: "healthcare",
  steps: [
    {
      id: "waiting-lists",
      title: {
        sr: "Liste Čekanja: Mesecima Za Usluge",
        en: "Waiting Lists: Months for Services",
      },
      narrative: {
        sr: "Stručni pregledi u Srbiji zahtevaju strpljenje: pacijenti čekaju 6-18 meseci zbog ograničenog kapaciteta i osoblja.",
        en: "Specialist consultations in Serbia require patience: patients wait 6-18 months due to limited capacity and staff.",
      },
      chartComponent: BarChart as ComponentType<any>,
      chartProps: {
        data: [
          { specialty: "Ortopedija", months: 18 },
          { specialty: "Kardiologija", months: 14 },
          { specialty: "Neurologija", months: 12 },
          { specialty: "Onkologija", months: 8 },
        ],
        xKey: "specialty",
        yKey: "months",
        xLabel: "Specialty / Specijalističke grane",
        yLabel: "Waiting Time (months) / Vreme čekanja (meseci)",
        color: "#ef4444",
      },
      insights: [
        "Najduže čekanje: ortopedske operacije do 18 meseci / Longest wait: orthopedic surgeries up to 18 months",
        "Hitni slučajevi se tretiraju prioritetno van liste čekanja / Emergency cases are treated outside waiting lists",
        "Uticaj na kvalitet života: odlaganje tretmana pogoršava ishode / Impact on quality of life: delayed treatments worsen outcomes",
      ],
    },
    {
      id: "regional-access",
      title: {
        sr: "Regionalni Pristup: Vraćaji po Bolnicama",
        en: "Regional Access: Hospital Density",
      },
      narrative: {
        sr: "Beograd ima 5x više bolničkih kreveta po glavi stanovnika nego ruralne regije, stvarajući duboku neravnopravnost u pristupu zdravstvenoj zaštiti.",
        en: "Belgrade has 5x more hospital beds per capita than rural regions, creating deep inequality in healthcare access.",
      },
      chartComponent: ColumnChart as ComponentType<any>,
      chartProps: {
        data: [
          { region: "Beograd", bedsPer1000: 6.5 },
          { region: "Vojvodina", bedsPer1000: 4.2 },
          { region: "Šumadija", bedsPer1000: 3.8 },
          { region: "Južna/Istočna", bedsPer1000: 2.1 },
        ],
        xKey: "region",
        yKey: "bedsPer1000",
        xLabel: "Region / Regija",
        yLabel: "Beds per 1,000 people / Kreveta po 1.000 stanovnika",
        color: "#ef4444",
      },
      insights: [
        "Beograd: 6.5 kreveta/1000 naspram 2.1 u ruralnim područjima / Belgrade: 6.5 beds/1000 vs 2.1 in rural areas",
        "EU prosečan: 5.0 kreveta po 1.000 stanovnika / EU average: 5.0 beds per 1,000 population",
        "Razlika od 3x između glavnog grada i perifernih regija / 3x gap between capital and peripheral regions",
      ],
      callout: {
        sr: "Putovanje do specijalizovane nege može trajati 2+ sata za stanovnike južnih i istočnih oblasti.",
        en: "Travel to specialized care can take 2+ hours for residents of southern and eastern regions.",
      },
    },
    {
      id: "medical-workforce",
      title: {
        sr: "Zdravstveni Kadar: Nedostatak Lekara i Medicinski Sestara",
        en: "Medical Workforce: Doctor and Nurse Shortage",
      },
      narrative: {
        sr: "Srbija ima 2.8 lekara na 1.000 stanovnika - ispod EU proseka od 3.7 - sa sve većim odlaskom medicinskog kadra u inostranstvo.",
        en: "Serbia has 2.8 doctors per 1,000 people - below the EU average of 3.7 - with growing medical staff emigration.",
      },
      chartComponent: ColumnChart as ComponentType<any>,
      chartProps: {
        data: [
          { region: "Beograd", doctorsPer1000: 4.1 },
          { region: "Vojvodina", doctorsPer1000: 3.2 },
          { region: "Šumadija", doctorsPer1000: 2.4 },
          { region: "Južna/Istočna", doctorsPer1000: 1.8 },
        ],
        xKey: "region",
        yKey: "doctorsPer1000",
        xLabel: "Region / Regija",
        yLabel: "Doctors per 1,000 people / Lekara po 1.000 stanovnika",
        color: "#ef4444",
      },
      insights: [
        "EU prosečan: 3.7/1000 - Srbija ispod proseka / EU average: 3.7/1000 - Serbia below average",
        "Ruralna područja najviše pogođena: 1.8 u Južnoj/Istočnoj Srbiji / Rural areas most affected: 1.8 in Southern/Eastern Serbia",
        "Starenje stanovništva povećava potražnju za zdravstvenim uslugama / Aging population increases demand for healthcare",
      ],
      callout: {
        sr: "Odliv lekara: procenjuje se da 10-15% diplomiranih lekara odlazi u inostranstvo prvih 5 godina karijere.",
        en: "Brain drain: an estimated 10-15% of medical graduates leave the country within the first 5 years of practice.",
      },
    },
  ],
};
