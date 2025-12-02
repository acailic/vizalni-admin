/**
 * Serbian Language Support Utilities
 * Supports both Latin and Cyrillic scripts for vizualni-admin
 */

export interface SerbianTranslations {
  [key: string]: {
    "sr-Latn": string;
    "sr-Cyrl": string;
    en: string;
  };
}

export const serbianTranslations: SerbianTranslations = {
  // Chart types and general UI
  chart: {
    "sr-Latn": "Grafikon",
    "sr-Cyrl": "Графикон",
    en: "Chart"
  },
  dashboard: {
    "sr-Latn": "Kontrolna ploča",
    "sr-Cyrl": "Контролна плоча",
    en: "Dashboard"
  },

  // Budget related terms
  budget: {
    "sr-Latn": "Budžet",
    "sr-Cyrl": "Буџет",
    en: "Budget"
  },
  revenue: {
    "sr-Latn": "Prihod",
    "sr-Cyrl": "Приход",
    en: "Revenue"
  },
  expenses: {
    "sr-Latn": "Rashodi",
    "sr-Cyrl": "Рашоди",
    en: "Expenses"
  },
  ministry: {
    "sr-Latn": "Ministarstvo",
    "sr-Cyrl": "Министарство",
    en: "Ministry"
  },

  // Air quality related terms
  airQuality: {
    "sr-Latn": "Kvalitet vazduha",
    "sr-Cyrl": "Квалитет ваздуха",
    en: "Air Quality"
  },
  pm10: {
    "sr-Latn": "PM10 (čestice)",
    "sr-Cyrl": "PM10 (честице)",
    en: "PM10 (particles)"
  },
  pm25: {
    "sr-Latn": "PM2.5 (sitne čestice)",
    "sr-Cyrl": "PM2.5 (ситне честице)",
    en: "PM2.5 (fine particles)"
  },
  pollution: {
    "sr-Latn": "Zagađenje",
    "sr-Cyrl": "Загађење",
    en: "Pollution"
  },

  // Demographics related terms
  population: {
    "sr-Latn": "Stanovništvo",
    "sr-Cyrl": "Становништво",
    en: "Population"
  },
  census: {
    "sr-Latn": "Popis",
    "sr-Cyrl": "Попис",
    en: "Census"
  },
  projection: {
    "sr-Latn": "Projekcija",
    "sr-Cyrl": "Пројекција",
    en: "Projection"
  },
  demographics: {
    "sr-Latn": "Demografija",
    "sr-Cyrl": "Демографија",
    en: "Demographics"
  },

  // Energy related terms
  energy: {
    "sr-Latn": "Energija",
    "sr-Cyrl": "Енергија",
    en: "Energy"
  },
  production: {
    "sr-Latn": "Proizvodnja",
    "sr-Cyrl": "Производња",
    en: "Production"
  },
  renewable: {
    "sr-Latn": "Obnovljivi izvori",
    "sr-Cyrl": "Обновљиви извори",
    en: "Renewable"
  },
  consumption: {
    "sr-Latn": "Potrošnja",
    "sr-Cyrl": "Потрошња",
    en: "Consumption"
  },

  // Common terms
  year: {
    "sr-Latn": "Godina",
    "sr-Cyrl": "Година",
    en: "Year"
  },
  month: {
    "sr-Latn": "Mesec",
    "sr-Cyrl": "Месец",
    en: "Month"
  },
  total: {
    "sr-Latn": "Ukupno",
    "sr-Cyrl": "Укупно",
    en: "Total"
  },
  data: {
    "sr-Latn": "Podaci",
    "sr-Cyrl": "Подаци",
    en: "Data"
  },
  source: {
    "sr-Latn": "Izvor",
    "sr-Cyrl": "Извор",
    en: "Source"
  }
};

/**
 * Type for supported language variants
 */
export type SerbianLanguageVariant = "sr-Latn" | "sr-Cyrl" | "en";

/**
 * Get translation for a key in specified language variant
 */
export const getSerbianTranslation = (
  key: string,
  language: SerbianLanguageVariant = "sr-Latn"
): string => {
  const translation = serbianTranslations[key];
  return translation ? translation[language] : key;
};

/**
 * Convert Latin script to Cyrillic script
 * This is a simplified conversion for Serbian
 */
export const latinToCyrillic = (text: string): string => {
  const conversionMap: { [key: string]: string } = {
    'A': 'А', 'B': 'Б', 'C': 'Ц', 'Č': 'Ч', 'Ć': 'Ћ', 'D': 'Д', 'Đ': 'Ђ',
    'E': 'Е', 'F': 'Ф', 'G': 'Г', 'H': 'Х', 'I': 'И', 'J': 'Ј', 'K': 'К',
    'L': 'Л', 'LJ': 'Љ', 'M': 'М', 'N': 'Н', 'NJ': 'Њ', 'O': 'О', 'P': 'П',
    'R': 'Р', 'S': 'С', 'Š': 'Ш', 'T': 'Т', 'U': 'У', 'V': 'В', 'Z': 'З',
    'Ž': 'Ж',
    'a': 'а', 'b': 'б', 'c': 'ц', 'č': 'ч', 'ć': 'ћ', 'd': 'д', 'đ': 'ђ',
    'e': 'е', 'f': 'ф', 'g': 'г', 'h': 'х', 'i': 'и', 'j': 'ј', 'k': 'к',
    'l': 'л', 'lj': 'љ', 'm': 'м', 'n': 'н', 'nj': 'њ', 'o': 'о', 'p': 'п',
    'r': 'р', 's': 'с', 'š': 'ш', 't': 'т', 'u': 'у', 'v': 'в', 'z': 'з',
    'ž': 'ж'
  };

  let result = text;

  // Convert digraphs first
  Object.keys(conversionMap)
    .filter(key => key.length === 2)
    .sort((a, b) => b.length - a.length)
    .forEach(latin => {
      const cyrillic = conversionMap[latin];
      if (cyrillic) {
        result = result.replace(new RegExp(latin, 'g'), cyrillic);
      }
    });

  // Convert single characters
  Object.keys(conversionMap)
    .filter(key => key.length === 1)
    .forEach(latin => {
      const cyrillic = conversionMap[latin];
      if (cyrillic) {
        result = result.replace(new RegExp(latin, 'g'), cyrillic);
      }
    });

  return result;
};

/**
 * Format numbers according to Serbian locale conventions
 */
export const formatSerbianNumber = (
  number: number,
  language: SerbianLanguageVariant = "sr-Latn"
): string => {
  const locale = language === "en" ? "en-US" : "sr-RS";
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format dates according to Serbian locale conventions
 */
export const formatSerbianDate = (
  date: Date,
  language: SerbianLanguageVariant = "sr-Latn"
): string => {
  const locale = language === "en" ? "en-US" : "sr-RS";
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Get currency formatter for Serbian Dinar (RSD)
 */
export const formatSerbianCurrency = (
  amount: number,
  language: SerbianLanguageVariant = "sr-Latn"
): string => {
  const locale = language === "en" ? "en-US" : "sr-RS";
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Determine if text contains Cyrillic characters
 */
export const isCyrillic = (text: string): boolean => {
  return /[а-яА-ЯЁё]/.test(text);
};

/**
 * Auto-detect script and return appropriate language variant
 */
export const detectSerbianScript = (text: string): SerbianLanguageVariant => {
  return isCyrillic(text) ? "sr-Cyrl" : "sr-Latn";
};

/**
 * Get dataset-specific labels with proper Serbian formatting
 */
export const getDatasetLabels = (
  datasetType: string,
  language: SerbianLanguageVariant = "sr-Latn"
): { [key: string]: string } => {
  const baseLabels = {
    title: getSerbianTranslation(datasetType, language),
    source: getSerbianTranslation('source', language),
    total: getSerbianTranslation('total', language),
    data: getSerbianTranslation('data', language)
  };

  switch (datasetType) {
    case 'budget':
      return {
        ...baseLabels,
        revenue: getSerbianTranslation('revenue', language),
        expenses: getSerbianTranslation('expenses', language),
        ministry: getSerbianTranslation('ministry', language)
      };
    case 'air_quality':
      return {
        ...baseLabels,
        pm10: getSerbianTranslation('pm10', language),
        pm25: getSerbianTranslation('pm25', language),
        pollution: getSerbianTranslation('pollution', language)
      };
    case 'demographics':
      return {
        ...baseLabels,
        population: getSerbianTranslation('population', language),
        census: getSerbianTranslation('census', language),
        projection: getSerbianTranslation('projection', language)
      };
    case 'energy':
      return {
        ...baseLabels,
        production: getSerbianTranslation('production', language),
        renewable: getSerbianTranslation('renewable', language),
        consumption: getSerbianTranslation('consumption', language)
      };
    default:
      return baseLabels;
  }
};