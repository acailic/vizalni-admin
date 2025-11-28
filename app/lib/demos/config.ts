/**
 * Demo configurations for data.gov.rs visualizations
 */

import type { DemoConfig } from '@/types/demos';

import { getValidatedDatasetIds } from './validated-datasets';

export const DEMO_CONFIGS: Record<string, DemoConfig> = {
  'air-quality': {
    id: 'air-quality',
    title: {
      sr: 'Kvalitet vazduha',
      en: 'Air quality'
    },
    description: {
      sr: 'Koncentracije PM čestica i drugih zagađivača u odnosu na smernice Svetske zdravstvene organizacije.',
      en: 'PM concentrations and other pollutants compared with World Health Organization guidelines.'
    },
    searchQuery: ['kvalitet vazduha', 'pm10', 'vazduh'],
    preferredDatasetIds: getValidatedDatasetIds('air-quality'),
    preferredTags: ['kvalitet-vazdukha', 'zivotna-sredina', 'vazduh'],
    slugKeywords: ['pm10', 'pm25', 'vazduh', 'zagadjenje'],
    chartType: 'line',
    tags: ['Životna sredina', 'Zdravlje'],
    icon: '🚨'
  },
  budget: {
    id: 'budget',
    title: {
      sr: 'Budžet Republike Srbije',
      en: 'Republic of Serbia Budget'
    },
    description: {
      sr: 'Prihodi, rashodi i izdaci javnih finansija sa preglednim raspodelama po kategorijama.',
      en: 'Revenues, expenditures, and public spending broken down by category.'
    },
    searchQuery: ['budzet', 'javne finansije', 'finansije'],
    preferredDatasetIds: getValidatedDatasetIds('budget'),
    preferredTags: ['budzet', 'javne-finansije', 'finansije'],
    slugKeywords: ['budzet', 'finansije', 'prihodi'],
    chartType: 'column',
    tags: ['finansije', 'javne-finansije', 'budzet'],
    icon: '💰'
  },
  environment: {
    id: 'environment',
    title: {
      sr: 'Životna sredina',
      en: 'Environment'
    },
    description: {
      sr: 'Praćenje kvaliteta vazduha, vode i zemljišta u gradovima Srbije.',
      en: 'Monitor air, water, and soil quality across Serbian cities.'
    },
    searchQuery: ['kvalitet vazduha', 'pm10'],
    preferredDatasetIds: getValidatedDatasetIds('environment'),
    preferredTags: ['kvalitet-vazdukha', 'zivotna-sredina', 'vazduh'],
    slugKeywords: ['vazduh', 'pm10', 'pm2.5'],
    chartType: 'line',
    tags: ['Životna sredina', 'Ekologija'],
    icon: '🌍'
  },
  demographics: {
    id: 'demographics',
    title: {
      sr: 'Demografski trendovi',
      en: 'Demographic trends'
    },
    description: {
      sr: 'Starosna struktura, projekcije do 2050. godine, medijana starosti i stopa rasta populacije.',
      en: 'Age structure, projections through 2050, median age, and population growth rate.'
    },
    searchQuery: ['stanovnistvo', 'stanovništvo', 'demografija'],
    preferredDatasetIds: getValidatedDatasetIds('demographics'),
    preferredTags: ['stanovnistvo', 'demografija'],
    slugKeywords: ['popis', 'demografija', 'stanovništvo'],
    chartType: 'bar',
    tags: ['Stanovništvo', 'Demografija'],
    icon: '⚠️'
  },
  education: {
    id: 'education',
    title: {
      sr: '🎓 Statistika obrazovanja',
      en: '🎓 Education Statistics'
    },
    description: {
      sr: 'Upis učenika i studenata kroz vreme po nivoima obrazovanja: osnovno, srednje i visoko.',
      en: 'Enrollment over time by education level: primary, secondary, and higher education.'
    },
    searchQuery: ['obrazovanje učenici studenti', 'obrazovanje', 'učenici', 'studenti'],
    preferredDatasetIds: getValidatedDatasetIds('education'),
    preferredTags: ['obrazovanje', 'ucenici', 'studenti', 'skole'],
    slugKeywords: ['obrazovanje', 'učenici', 'studenti', 'škole'],
    chartType: 'column',
    tags: ['obrazovanje', 'skole', 'studenti', 'upis'],
    icon: '🎓'
  },
  transport: {
    id: 'transport',
    title: {
      sr: 'Bezbednost u saobraćaju',
      en: 'Road safety'
    },
    description: {
      sr: 'Saobraćajne nezgode, povređeni i poginuli, sa fokusom na prevenciju i bezbednost na putevima.',
      en: 'Traffic incidents, injuries, and fatalities with a focus on prevention and road safety.'
    },
    searchQuery: ['saobraćaj', 'saobracaj', 'nezgode', 'saobraćajne nesreće'],
    preferredDatasetIds: getValidatedDatasetIds('transport'),
    preferredTags: ['saobracaj', 'nezgode', 'saobraćaj'],
    slugKeywords: ['saobraćaj', 'nezgode', 'saobracaj'],
    chartType: 'column',
    tags: ['Saobraćaj', 'Bezbednost'],
    icon: '🚨'
  },
  healthcare: {
    id: 'healthcare',
    title: {
      sr: 'Zdravstveni sistem',
      en: 'Healthcare system'
    },
    description: {
      sr: 'Liste čekanja, kapaciteti bolnica, zdravstveni kadar i dostupnost usluga.',
      en: 'Waiting lists, hospital capacity, medical workforce, and service availability.'
    },
    searchQuery: ['zdravstvo', 'bolnice', 'liste čekanja'],
    preferredDatasetIds: getValidatedDatasetIds('healthcare'),
    preferredTags: ['zdravstvo', 'bolnica', 'bolnice'],
    slugKeywords: ['zdravstvo', 'bolnica', 'bolnice'],
    chartType: 'bar',
    tags: ['Zdravstvo', 'Bolnice'],
    icon: '🚨'
  },
  health: {
    id: 'health',
    title: {
      sr: 'Zdravstvo',
      en: 'Healthcare'
    },
    description: {
      sr: 'Bolnice, pacijenti i zdravstvene usluge sa pokazateljima dostupnosti i kvaliteta.',
      en: 'Hospitals, patients, and medical services with availability and quality indicators.'
    },
    searchQuery: ['zdravstvo', 'bolnice', 'zdravstvene usluge'],
    preferredTags: ['zdravstvo', 'bolnica', 'bolnice'],
    slugKeywords: ['zdravstvo', 'bolnica', 'bolnice'],
    chartType: 'bar',
    tags: ['Zdravstvo', 'Medicina'],
    icon: '🏥'
  },
  employment: {
    id: 'employment',
    title: {
      sr: 'Tržište rada i migracije',
      en: 'Labor market and migration'
    },
    description: {
      sr: 'Stopa zaposlenosti i nezaposlenosti, kretanje stanovništva i trendovi zarada.',
      en: 'Employment and unemployment rates, population movement, and wage trends.'
    },
    searchQuery: ['zaposlenost', 'nezaposlenost', 'tržište rada'],
    preferredDatasetIds: getValidatedDatasetIds('employment'),
    preferredTags: ['zaposlenost', 'nezaposlenost', 'trziste-rada'],
    slugKeywords: ['zaposlenost', 'nezaposlenost', 'tržište rada'],
    chartType: 'line',
    tags: ['Zaposlenost', 'Migracije'],
    icon: '🚨'
  },
  energy: {
    id: 'energy',
    title: {
      sr: 'Energetski miks i tranzicija',
      en: 'Energy mix and transition'
    },
    description: {
      sr: 'Izvori proizvodnje električne energije, uloga uglja i uvoz/izvoz, uz trendove obnovljivih izvora.',
      en: 'Electricity generation sources, coal dependency, imports/exports, and renewable energy trends.'
    },
    searchQuery: ['energija', 'ugalj', 'struja'],
    preferredDatasetIds: getValidatedDatasetIds('energy'),
    preferredTags: ['energija', 'ugalj', 'struja'],
    slugKeywords: ['energija', 'ugalj', 'struja'],
    chartType: 'column',
    tags: ['Energija', 'Energetska tranzicija'],
    icon: '🚨'
  },
  agriculture: {
    id: 'agriculture',
    title: {
      sr: 'Poljoprivreda',
      en: 'Agriculture'
    },
    description: {
      sr: 'Proizvodnja, usevi i stočarstvo sa pokazateljima prinosa i izvoza.',
      en: 'Production, crops, and livestock with yield and export indicators.'
    },
    searchQuery: ['poljoprivreda', 'usevi'],
    preferredDatasetIds: getValidatedDatasetIds('agriculture'),
    preferredTags: ['poljoprivreda', 'poljoprivredna-proizvodnja'],
    slugKeywords: ['poljoprivreda', 'usevi'],
    chartType: 'bar',
    tags: ['Poljoprivreda', 'Ruralni razvoj'],
    icon: '🌾'
  },
  tourism: {
    id: 'tourism',
    title: {
      sr: 'Turizam',
      en: 'Tourism'
    },
    description: {
      sr: 'Dolasci i noćenja turista, prihodi i sezonski obrasci.',
      en: 'Tourist arrivals, overnight stays, revenues, and seasonal patterns.'
    },
    searchQuery: ['turizam', 'noćenja', 'nocenja', 'dolasci'],
    preferredDatasetIds: getValidatedDatasetIds('tourism'),
    preferredTags: ['turizam', 'turistički promet'],
    slugKeywords: ['turizam', 'nocenja', 'dolasci'],
    chartType: 'line',
    tags: ['Turizam', 'Ugostiteljstvo'],
    icon: '✈️'
  },
  culture: {
    id: 'culture',
    title: {
      sr: 'Kultura i umetnost',
      en: 'Culture and Arts'
    },
    description: {
      sr: 'Kulturne ustanove, događaji i baština sa naglaskom na dostupnost i posećenost.',
      en: 'Cultural institutions, events, and heritage with a focus on access and attendance.'
    },
    searchQuery: ['kultura', 'kulturne institucije'],
    preferredDatasetIds: getValidatedDatasetIds('culture'),
    preferredTags: ['kultura'],
    slugKeywords: ['kultura', 'kulturno'],
    chartType: 'pie',
    tags: ['kultura', 'umetnost', 'muzej'],
    icon: '🎭'
  },
  infrastructure: {
    id: 'infrastructure',
    title: {
      sr: 'Infrastruktura',
      en: 'Infrastructure'
    },
    description: {
      sr: 'Putevi, vodovod, kanalizacija i drugi javni sistemi koji oblikuju kvalitet života.',
      en: 'Roads, water supply, sewage, and other public systems that shape quality of life.'
    },
    searchQuery: 'infrastruktura',
    preferredDatasetIds: getValidatedDatasetIds('infrastructure'),
    chartType: 'column',
    tags: ['infrastruktura', 'javni-radovi', 'gradnja'],
    icon: '🏗️'
  },
  economy: {
    id: 'economy',
    title: {
      sr: 'Ekonomski pokazatelji',
      en: 'Economic indicators'
    },
    description: {
      sr: 'BDP, inflacija, zaposlenost, spoljna trgovina i investicije kroz vreme.',
      en: 'GDP, inflation, employment, foreign trade, and investment over time.'
    },
    searchQuery: 'ekonomija bdp',
    preferredDatasetIds: getValidatedDatasetIds('economy'),
    chartType: 'line',
    tags: ['ekonomija', 'bdp', 'finansije', 'investicije', 'transformacija'],
    icon: '💰'
  },
  climate: {
    id: 'climate',
    title: {
      sr: 'Klimatske promene',
      en: 'Climate change'
    },
    description: {
      sr: 'Porast temperature, ekstremni vremenski događaji, zagađenje i prelazak na obnovljive izvore energije.',
      en: 'Temperature rise, extreme weather events, pollution, and the shift to renewable energy.'
    },
    searchQuery: 'klima temperatura zivotna sredina',
    preferredDatasetIds: getValidatedDatasetIds('climate'),
    chartType: 'line',
    tags: ['Klima', 'Životna sredina', 'Energija'],
    icon: '🌍'
  },
  digital: {
    id: 'digital',
    title: {
      sr: 'Digitalna transformacija',
      en: 'Digital transformation'
    },
    description: {
      sr: 'IT sektor, pristup internetu, e-trgovina i digitalne veštine kao pokazatelji digitalnog napretka.',
      en: 'IT sector growth, internet access, e-commerce, and digital skills as indicators of digital progress.'
    },
    searchQuery: 'digitalizacija internet tehnologija',
    preferredDatasetIds: getValidatedDatasetIds('digital'),
    chartType: 'line',
    tags: ['digitalizacija', 'internet', 'IT', 'tehnologija', 'uspeh'],
    icon: '💻'
  },
  presentation: {
    id: 'presentation',
    title: {
      sr: '🎬 Prezentacioni mod',
      en: '🎬 Presentation Mode'
    },
    description: {
      sr: 'Kurirana kolekcija interaktivnih vizualizacija sa agendom, pričama iz podataka i jasnim koracima.',
      en: 'Curated set of interactive visualizations with an agenda, data stories, and clear next steps.'
    },
    searchQuery: 'vizualizacije prezentacija',
    chartType: 'line',
    tags: ['demo', 'prezentacija', 'vizualizacije'],
    icon: '🎬'
  }
};

/**
 * Get demo config by ID
 */
export function getDemoConfig(id: string): DemoConfig | null {
  return DEMO_CONFIGS[id] || null;
}

/**
 * Get all demo IDs
 */
export function getAllDemoIds(): string[] {
  return Object.keys(DEMO_CONFIGS);
}

/**
 * Get demo title in specified locale
 */
export function getDemoTitle(id: string, locale: 'sr' | 'en' = 'sr'): string {
  const config = getDemoConfig(id);
  return config?.title[locale] || id;
}

/**
 * Get demo description in specified locale
 */
export function getDemoDescription(id: string, locale: 'sr' | 'en' = 'sr'): string {
  const config = getDemoConfig(id);
  return config?.description[locale] || '';
}
