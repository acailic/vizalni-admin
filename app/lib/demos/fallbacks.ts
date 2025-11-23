import type { DemoDatasetInfo } from "@/types/demos";

type DemoFallback = {
  searchQueries?: string[];
  fallbackData?: any[];
  fallbackDatasetInfo?: DemoDatasetInfo;
};

export const DEMO_FALLBACKS: Record<string, DemoFallback> = {
  "air-quality": {
    searchQueries: ["kvalitet vazduha", "zagađenje vazduha", "pm10", "pm2.5"],
    fallbackDatasetInfo: {
      title: "Indeksi zagađenja vazduha (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2018, PM25: 32, PM10: 45 },
      { Godina: 2019, PM25: 35, PM10: 48 },
      { Godina: 2020, PM25: 38, PM10: 52 },
      { Godina: 2021, PM25: 34, PM10: 47 },
      { Godina: 2022, PM25: 36, PM10: 49 },
      { Godina: 2023, PM25: 39, PM10: 53 },
      { Godina: 2024, PM25: 37, PM10: 51 },
    ],
  },
  budget: {
    searchQueries: ["budžet", "budzet", "budget", "javne finansije"],
    fallbackDatasetInfo: {
      title: "Rashodi i prihodi budžeta (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2018, Prihodi: 950, Rashodi: 980 },
      { Godina: 2019, Prihodi: 1020, Rashodi: 1045 },
      { Godina: 2020, Prihodi: 980, Rashodi: 1120 },
      { Godina: 2021, Prihodi: 1105, Rashodi: 1130 },
      { Godina: 2022, Prihodi: 1180, Rashodi: 1195 },
      { Godina: 2023, Prihodi: 1240, Rashodi: 1265 },
      { Godina: 2024, Prihodi: 1300, Rashodi: 1315 },
    ],
  },
  environment: {
    searchQueries: ["kvalitet vazduha", "pm10", "zagađenje"],
    fallbackDatasetInfo: {
      title: "Indeks kvaliteta vazduha po gradovima (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Grad: "Beograd", AQI: 78 },
      { Grad: "Novi Sad", AQI: 71 },
      { Grad: "Niš", AQI: 82 },
      { Grad: "Kragujevac", AQI: 76 },
      { Grad: "Subotica", AQI: 69 },
    ],
  },
  education: {
    searchQueries: ["obrazovanje učenici studenti", "broj učenika", "obrazovanje"],
    fallbackDatasetInfo: {
      title: "Upis učenika i studenata (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2018, Osnovno: 520000, Srednje: 260000, Visoko: 235000 },
      { Godina: 2019, Osnovno: 515000, Srednje: 255000, Visoko: 240000 },
      { Godina: 2020, Osnovno: 510000, Srednje: 250000, Visoko: 245000 },
      { Godina: 2021, Osnovno: 505000, Srednje: 248000, Visoko: 250000 },
      { Godina: 2022, Osnovno: 500000, Srednje: 246000, Visoko: 255000 },
    ],
  },
  transport: {
    searchQueries: ["saobraćaj", "saobracaj", "nezgode", "saobraćajne nesreće"],
    fallbackDatasetInfo: {
      title: "Saobraćajne nezgode i poginuli (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2018, Nezgode: 33500, Poginuli: 550 },
      { Godina: 2019, Nezgode: 34000, Poginuli: 520 },
      { Godina: 2020, Nezgode: 31000, Poginuli: 480 },
      { Godina: 2021, Nezgode: 32000, Poginuli: 510 },
      { Godina: 2022, Nezgode: 33000, Poginuli: 505 },
      { Godina: 2023, Nezgode: 34500, Poginuli: 482 },
    ],
  },
  healthcare: {
    searchQueries: ["zdravstvo", "bolnice", "liste cekanja"],
    fallbackDatasetInfo: {
      title: "Zdravstveni kapaciteti (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2019, PacijentiNaCekanju: 42000, Lekari: 28000, BolnickiKreveti: 19000 },
      { Godina: 2020, PacijentiNaCekanju: 53000, Lekari: 27500, BolnickiKreveti: 18800 },
      { Godina: 2021, PacijentiNaCekanju: 50000, Lekari: 27300, BolnickiKreveti: 18750 },
      { Godina: 2022, PacijentiNaCekanju: 48000, Lekari: 27000, BolnickiKreveti: 18600 },
      { Godina: 2023, PacijentiNaCekanju: 50500, Lekari: 26800, BolnickiKreveti: 18500 },
    ],
  },
  health: {
    searchQueries: ["zdravstvo", "bolnice", "zdravstvene usluge"],
    fallbackDatasetInfo: {
      title: "Zdravstveni pokazatelji (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2019, Posete: 5200000, HirurskeIntervencije: 185000, AmbulantnePosete: 3100000 },
      { Godina: 2020, Posete: 4800000, HirurskeIntervencije: 178000, AmbulantnePosete: 2950000 },
      { Godina: 2021, Posete: 5000000, HirurskeIntervencije: 182000, AmbulantnePosete: 3000000 },
      { Godina: 2022, Posete: 5150000, HirurskeIntervencije: 184500, AmbulantnePosete: 3050000 },
    ],
  },
  employment: {
    searchQueries: ["zaposlenost", "nezaposlenost", "tržište rada"],
    fallbackDatasetInfo: {
      title: "Tržište rada (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2018, Nezaposlenost: 13.5, NezaposlenostMladi: 27.0, Emigracije: 62000 },
      { Godina: 2019, Nezaposlenost: 12.0, NezaposlenostMladi: 25.0, Emigracije: 65000 },
      { Godina: 2020, Nezaposlenost: 11.2, NezaposlenostMladi: 24.5, Emigracije: 70000 },
      { Godina: 2021, Nezaposlenost: 10.5, NezaposlenostMladi: 23.0, Emigracije: 74000 },
      { Godina: 2022, Nezaposlenost: 9.8, NezaposlenostMladi: 22.5, Emigracije: 75900 },
      { Godina: 2023, Nezaposlenost: 9.5, NezaposlenostMladi: 21.5, Emigracije: 75900 },
    ],
  },
  energy: {
    searchQueries: ["energija", "elektricna energija", "ugalj", "obnovljivi izvori"],
    fallbackDatasetInfo: {
      title: "Proizvodnja i uvoz energije (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2018, Ugalj: 68, Obnovljivi: 8, Uvoz: 12 },
      { Godina: 2019, Ugalj: 67, Obnovljivi: 9, Uvoz: 13 },
      { Godina: 2020, Ugalj: 69, Obnovljivi: 10, Uvoz: 11 },
      { Godina: 2021, Ugalj: 68, Obnovljivi: 11, Uvoz: 12 },
      { Godina: 2022, Ugalj: 66, Obnovljivi: 12, Uvoz: 14 },
      { Godina: 2023, Ugalj: 65, Obnovljivi: 14, Uvoz: 13 },
    ],
  },
  agriculture: {
    searchQueries: ["poljoprivreda", "proizvodnja", "usevi"],
    fallbackDatasetInfo: {
      title: "Poljoprivredna proizvodnja (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2019, Žitarice: 6200, Voće: 1450, Povrće: 2100 },
      { Godina: 2020, Žitarice: 6100, Voće: 1500, Povrće: 2150 },
      { Godina: 2021, Žitarice: 6300, Voće: 1520, Povrće: 2200 },
      { Godina: 2022, Žitarice: 6400, Voće: 1540, Povrće: 2230 },
      { Godina: 2023, Žitarice: 6500, Voće: 1560, Povrće: 2250 },
    ],
  },
  tourism: {
    searchQueries: ["turizam", "dolasci", "noćenja", "nocenja"],
    fallbackDatasetInfo: {
      title: "Turistički promet (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2018, DOLASCI: 3100000, NOCENJA: 8200000 },
      { Godina: 2019, DOLASCI: 3400000, NOCENJA: 8800000 },
      { Godina: 2020, DOLASCI: 1900000, NOCENJA: 5100000 },
      { Godina: 2021, DOLASCI: 2500000, NOCENJA: 6400000 },
      { Godina: 2022, DOLASCI: 3200000, NOCENJA: 7700000 },
      { Godina: 2023, DOLASCI: 3550000, NOCENJA: 8400000 },
    ],
  },
  culture: {
    searchQueries: ["kultura", "kulturne ustanove", "kulturna bastina"],
    fallbackDatasetInfo: {
      title: "Kulturne institucije i događaji (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Kategorija: "Muzeji", Broj: 120 },
      { Kategorija: "Pozorišta", Broj: 65 },
      { Kategorija: "Biblioteke", Broj: 190 },
      { Kategorija: "Festivali", Broj: 80 },
    ],
  },
  infrastructure: {
    searchQueries: ["infrastruktura", "putevi", "saobraćajnice"],
    fallbackDatasetInfo: {
      title: "Infrastrukturni pokazatelji (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2019, NoviPuteviKm: 120, RekonstrukcijaKm: 350, InvesticijeMEUR: 820 },
      { Godina: 2020, NoviPuteviKm: 90, RekonstrukcijaKm: 300, InvesticijeMEUR: 780 },
      { Godina: 2021, NoviPuteviKm: 140, RekonstrukcijaKm: 360, InvesticijeMEUR: 890 },
      { Godina: 2022, NoviPuteviKm: 160, RekonstrukcijaKm: 380, InvesticijeMEUR: 940 },
      { Godina: 2023, NoviPuteviKm: 170, RekonstrukcijaKm: 400, InvesticijeMEUR: 980 },
    ],
  },
  economy: {
    searchQueries: ["ekonomija", "bnp", "bdp", "inflacija", "izvoz"],
    fallbackDatasetInfo: {
      title: "Makroekonomski indikatori (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2019, BDPRealniRast: 4.1, Inflacija: 2.0, IzvozMEUR: 19000 },
      { Godina: 2020, BDPRealniRast: -0.9, Inflacija: 1.6, IzvozMEUR: 18200 },
      { Godina: 2021, BDPRealniRast: 7.4, Inflacija: 3.8, IzvozMEUR: 21000 },
      { Godina: 2022, BDPRealniRast: 2.5, Inflacija: 11.5, IzvozMEUR: 23000 },
      { Godina: 2023, BDPRealniRast: 2.0, Inflacija: 8.0, IzvozMEUR: 24500 },
    ],
  },
  climate: {
    searchQueries: ["klima", "emisije", "temperature"],
    fallbackDatasetInfo: {
      title: "Klimatski pokazatelji (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2018, ProsecnaTemp: 12.5, CO2Mt: 45 },
      { Godina: 2019, ProsecnaTemp: 12.7, CO2Mt: 44 },
      { Godina: 2020, ProsecnaTemp: 12.8, CO2Mt: 43 },
      { Godina: 2021, ProsecnaTemp: 13.1, CO2Mt: 42 },
      { Godina: 2022, ProsecnaTemp: 13.4, CO2Mt: 41 },
      { Godina: 2023, ProsecnaTemp: 13.6, CO2Mt: 40 },
    ],
  },
  digital: {
    searchQueries: ["digitalizacija", "e-uprava", "broadband"],
    fallbackDatasetInfo: {
      title: "Digitalni pokazatelji (primer podaci)",
      organization: "Demo data.gov.rs",
    },
    fallbackData: [
      { Godina: 2019, EUsluge: 62, Broadband: 75, IKTIZvozMEUR: 1200 },
      { Godina: 2020, EUsluge: 68, Broadband: 78, IKTIZvozMEUR: 1350 },
      { Godina: 2021, EUsluge: 73, Broadband: 82, IKTIZvozMEUR: 1500 },
      { Godina: 2022, EUsluge: 78, Broadband: 85, IKTIZvozMEUR: 1700 },
      { Godina: 2023, EUsluge: 81, Broadband: 87, IKTIZvozMEUR: 1900 },
    ],
  },
};
