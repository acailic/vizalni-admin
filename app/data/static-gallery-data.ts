/**
 * Static demo gallery data for GitHub Pages deployment
 * This provides fallback data when API is not available
 */

export interface GalleryDataset {
  id: string;
  title: string;
  notes: string;
  resources: {
    id: string;
    name: string;
    format: string;
    url: string;
  }[];
  tags: {
    name: string;
  }[];
  organization?: {
    title: string;
    image_url: string;
  };
}

/**
 * Static datasets for demo gallery
 * These are representative datasets from data.gov.rs
 */
export const staticGalleryDatasets: GalleryDataset[] = [
  {
    id: "6616cc69e9cf23a1ec8096b5",
    title: "Kvalitet vazduha - PM10 i PM2.5 čestice",
    notes: "Podaci o koncentraciji PM10 i PM2.5 čestica u vazduhu mereni na stanicama širom Srbije. Podaci su važni za praćenje kvaliteta vazduha i uticaja na zdravlje stanovništva.",
    resources: [
      {
        id: "1",
        name: "PM10 podaci",
        format: "CSV",
        url: "https://data.gov.rs/sr/datasets/kvalitet-vazduha/"
      }
    ],
    tags: [
      { name: "kvalitet-vazduha" },
      { name: "pm10" },
      { name: "zivotna-sredina" },
      { name: "vazduh" }
    ],
    organization: {
      title: "Agencija za zaštitu životne sredine",
      image_url: ""
    }
  },
  {
    id: "demographics-001",
    title: "Demografski trendovi Republike Srbije",
    notes: "Podaci o broju stanovnika, starosnoj strukturi, natalitetu i mortalitetu. Uključuje projekcije do 2050. godine i analizu demografskih promena.",
    resources: [
      {
        id: "2",
        name: "Demografski podaci",
        format: "JSON",
        url: "https://data.gov.rs/sr/datasets/demografija/"
      }
    ],
    tags: [
      { name: "stanovnistvo" },
      { name: "demografija" },
      { name: "statistika" }
    ],
    organization: {
      title: "Republički zavod za statistiku",
      image_url: ""
    }
  },
  {
    id: "economy-001",
    title: "Ekonomski pokazatelji Srbije",
    notes: "BDP, inflacija, zaposlenost, spoljna trgovina i investicije. Podaci pokazuju ekonomski razvoj i transformaciju privrede kroz vreme.",
    resources: [
      {
        id: "3",
        name: "Ekonomski podaci",
        format: "CSV",
        url: "https://data.gov.rs/sr/datasets/ekonomija/"
      }
    ],
    tags: [
      { name: "ekonomija" },
      { name: "bdp" },
      { name: "finansije" },
      { name: "investicije" }
    ],
    organization: {
      title: "Republički zavod za statistiku",
      image_url: ""
    }
  },
  {
    id: "energy-001",
    title: "Energetski miks i proizvodnja električne energije",
    notes: "Podaci o izvorima proizvodnje električne energije, uključujući ugalj, hidro, vetar i solarnu energiju. Prati se tranzicija ka obnovljivim izvorima.",
    resources: [
      {
        id: "4",
        name: "Energetski podaci",
        format: "JSON",
        url: "https://data.gov.rs/sr/datasets/energija/"
      }
    ],
    tags: [
      { name: "energija" },
      { name: "obnovljivi-izvori" },
      { name: "struja" }
    ],
    organization: {
      title: "Ministarstvo rudarstva i energetike",
      image_url: ""
    }
  },
  {
    id: "transport-001",
    title: "Bezbednost u saobraćaju",
    notes: "Statistika saobraćajnih nezgoda, povređenih i poginulih. Podaci su ključni za analizu bezbednosti na putevima i planiranje preventivnih mera.",
    resources: [
      {
        id: "5",
        name: "Saobraćajni podaci",
        format: "CSV",
        url: "https://data.gov.rs/sr/datasets/saobracaj/"
      }
    ],
    tags: [
      { name: "saobracaj" },
      { name: "bezbednost" },
      { name: "nezgode" }
    ],
    organization: {
      title: "Ministarstvo unutrašnjih poslova",
      image_url: ""
    }
  },
  {
    id: "healthcare-001",
    title: "Zdravstveni sistem i kapaciteti",
    notes: "Podaci o bolnicama, zdravstvenom kadru, listama čekanja i dostupnosti zdravstvenih usluga. Važni za praćenje kvaliteta zdravstvene zaštite.",
    resources: [
      {
        id: "6",
        name: "Zdravstveni podaci",
        format: "JSON",
        url: "https://data.gov.rs/sr/datasets/zdravstvo/"
      }
    ],
    tags: [
      { name: "zdravstvo" },
      { name: "bolnice" },
      { name: "zdravstvene-usluge" }
    ],
    organization: {
      title: "Ministarstvo zdravlja",
      image_url: ""
    }
  },
  {
    id: "digital-001",
    title: "Digitalna transformacija i IT sektor",
    notes: "Podaci o rastu IT sektora, pristupu internetu, e-trgovini i digitalnim veštinama. Pokazuju napredak Srbije u digitalnoj ekonomiji.",
    resources: [
      {
        id: "7",
        name: "Digitalni podaci",
        format: "CSV",
        url: "https://data.gov.rs/sr/datasets/digitalizacija/"
      }
    ],
    tags: [
      { name: "digitalizacija" },
      { name: "internet" },
      { name: "IT" },
      { name: "tehnologija" }
    ],
    organization: {
      title: "Ministarstvo trgovine, turizma i telekomunikacija",
      image_url: ""
    }
  },
  {
    id: "climate-001",
    title: "Klimatske promene i temperatura",
    notes: "Podaci o porastu temperature, ekstremnim vremenskim događajima, kvalitetu vazduha i prelazaku na obnovljive izvore energije.",
    resources: [
      {
        id: "8",
        name: "Klimatski podaci",
        format: "JSON",
        url: "https://data.gov.rs/sr/datasets/klima/"
      }
    ],
    tags: [
      { name: "klima" },
      { name: "temperatura" },
      { name: "zivotna-sredina" }
    ],
    organization: {
      title: "Republički hidrometeorološki zavod",
      image_url: ""
    }
  },
  {
    id: "employment-001",
    title: "Tržište rada i zaposlenost",
    notes: "Stopa zaposlenosti i nezaposlenosti, kretanje stanovništva, trendovi zarada i migracije radne snage.",
    resources: [
      {
        id: "9",
        name: "Podaci o zaposlenosti",
        format: "CSV",
        url: "https://data.gov.rs/sr/datasets/zaposlenost/"
      }
    ],
    tags: [
      { name: "zaposlenost" },
      { name: "nezaposlenost" },
      { name: "trziste-rada" }
    ],
    organization: {
      title: "Nacionalna služba za zapošljavanje",
      image_url: ""
    }
  },
  {
    id: "education-001",
    title: "Obrazovanje i upis učenika",
    notes: "Statistika upisa učenika i studenata po nivoima obrazovanja: osnovno, srednje i visoko obrazovanje.",
    resources: [
      {
        id: "10",
        name: "Obrazovni podaci",
        format: "JSON",
        url: "https://data.gov.rs/sr/datasets/obrazovanje/"
      }
    ],
    tags: [
      { name: "obrazovanje" },
      { name: "ucenici" },
      { name: "studenti" },
      { name: "skole" }
    ],
    organization: {
      title: "Ministarstvo prosvete, nauke i tehnološkog razvoja",
      image_url: ""
    }
  }
];
