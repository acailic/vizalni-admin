/**
 * Application Constants
 *
 * Centralized configuration for the Serbian Government Data Visualization Platform
 */

// Application Information
export const APP_CONFIG = {
  name: 'Визуелни Админ Србије',
  nameLatin: 'Vizuelni Admin Srbije',
  nameEn: 'Serbian Government Data Visualization Platform',
  shortName: 'VAS',
  version: '0.1.0',
  description: {
    srCyr: 'Јединствени приступ отвореним подацима Републике Србије',
    srLat: 'Jedinstveni pristup otvorenim podacima Republike Srbije',
    en: 'A unified approach to open data of the Republic of Serbia',
  },
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  repository: 'https://github.com/yourusername/vizuelni-admin-srbije',
} as const;

// Languages
export const LANGUAGES = {
  SR_CYR: 'sr-cyr',
  SR_LAT: 'sr-lat',
  EN: 'en',
} as const;

export const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || LANGUAGES.SR_CYR;

export const SUPPORTED_LANGUAGES = [
  {
    code: LANGUAGES.SR_CYR,
    name: 'Српски',
    nameEn: 'Serbian Cyrillic',
    direction: 'ltr',
    locale: 'sr_RS',
    script: 'Cyrillic',
  },
  {
    code: LANGUAGES.SR_LAT,
    name: 'Srpski',
    nameEn: 'Serbian Latin',
    direction: 'ltr',
    locale: 'sr_RS@latin',
    script: 'Latin',
  },
  {
    code: LANGUAGES.EN,
    name: 'English',
    nameEn: 'English',
    direction: 'ltr',
    locale: 'en_US',
    script: 'Latin',
  },
] as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_DATA_GOV_RS_API_URL || 'https://data.gov.rs/api/1',
  timeout: parseInt(process.env.DATA_GOV_RS_API_TIMEOUT || '30000', 10),
  enableCache: process.env.ENABLE_API_CACHE === 'true',
  cacheTTL: parseInt(process.env.API_CACHE_TTL || '3600', 10),
} as const;

// Feature Flags
export const FEATURES = {
  darkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
  dataExport: process.env.NEXT_PUBLIC_ENABLE_DATA_EXPORT === 'true',
  socialSharing: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_SHARING === 'true',
  print: process.env.NEXT_PUBLIC_ENABLE_PRINT === 'true',
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
  showPerformanceMetrics: process.env.NEXT_PUBLIC_SHOW_PERFORMANCE_METRICS === 'true',
} as const;

// Serbia Map Configuration
export const MAP_CONFIG = {
  defaultCenter: {
    lat: parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LAT || '44.0165'),
    lng: parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LNG || '21.0059'),
  },
  defaultZoom: parseInt(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM || '7', 10),
  minZoom: 6,
  maxZoom: 18,
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const;

// Data Categories from data.gov.rs
export const DATA_CATEGORIES = {
  'javne-finansije': {
    srCyr: 'Јавне финансије',
    srLat: 'Javne finansije',
    en: 'Public Finances',
    icon: 'finance',
  },
  mobilnost: {
    srCyr: 'Мобилност',
    srLat: 'Mobilnost',
    en: 'Mobility',
    icon: 'transport',
  },
  obrazovanje: {
    srCyr: 'Образовање',
    srLat: 'Obrazovanje',
    en: 'Education',
    icon: 'education',
  },
  zdravlje: {
    srCyr: 'Здравље',
    srLat: 'Zdravlje',
    en: 'Health',
    icon: 'health',
  },
  'zivotna-sredina': {
    srCyr: 'Животна средина',
    srLat: 'Zivotna sredina',
    en: 'Environment',
    icon: 'environment',
  },
  uprava: {
    srCyr: 'Управа',
    srLat: 'Uprava',
    en: 'Administration',
    icon: 'government',
  },
  'ranjive-grupe': {
    srCyr: 'Рањиве групе',
    srLat: 'Ranjive grupe',
    en: 'Vulnerable Groups',
    icon: 'vulnerable',
  },
  'ciljevi-odrzivog-razvoja': {
    srCyr: 'Циљеви одрживог развоја',
    srLat: 'Ciljevi održivog razvoja',
    en: 'Sustainable Development Goals',
    icon: 'sustainable',
  },
} as const;

// Theme Configuration
export const THEME = {
  colors: {
    primary: '#2196f3', // Serbian Blue
    secondary: '#ff9800', // Serbian Orange
    accent: '#e91e63',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// Date Formats
export const DATE_FORMATS = {
  srCyr: {
    short: 'dd.MM.yyyy.',
    medium: 'dd. MMM yyyy.',
    long: 'dd. MMMM yyyy.',
    full: 'EEEE, dd. MMMM yyyy.',
  },
  srLat: {
    short: 'dd.MM.yyyy.',
    medium: 'dd. MMM yyyy.',
    long: 'dd. MMMM yyyy.',
    full: 'EEEE, dd. MMMM yyyy.',
  },
  en: {
    short: 'MM/dd/yyyy',
    medium: 'MMM dd, yyyy',
    long: 'MMMM dd, yyyy',
    full: 'EEEE, MMMM dd, yyyy',
  },
} as const;

// Social Links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/vizuelniadmin',
  linkedin: 'https://www.linkedin.com/company/vizuelni-admin-srbije',
  github: 'https://github.com/yourusername/vizuelni-admin-srbije',
  email: 'contact@example.com',
} as const;

// External Links
export const EXTERNAL_LINKS = {
  dataGovRs: 'https://data.gov.rs',
  dataGovRsApi: 'https://data.gov.rs/api/1',
  dataGovRsDocs: 'https://data.gov.rs/sr/apidoc/',
  openDataHub: 'https://hub.data.gov.rs',
  itOffice: 'https://www.ite.gov.rs/',
} as const;

// Chart Colors
export const CHART_COLORS = [
  '#2196f3', // Primary Blue
  '#ff9800', // Secondary Orange
  '#e91e63', // Accent Pink
  '#4caf50', // Green
  '#9c27b0', // Purple
  '#00bcd4', // Cyan
  '#ff5722', // Deep Orange
  '#795548', // Brown
  '#607d8b', // Blue Grey
  '#3f51b5', // Indigo
] as const;

// Export Types
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export type DataCategory = keyof typeof DATA_CATEGORIES;
