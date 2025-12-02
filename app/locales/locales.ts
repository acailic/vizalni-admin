// If translations get too big, we should load them dynamically. But for now it's fine.
// Use the same number format in each language
import { i18n } from "@lingui/core";
import {
  formatLocale,
  FormatLocaleDefinition,
  FormatLocaleObject,
} from "d3-format";
import {
  timeFormatLocale,
  TimeLocaleDefinition,
  TimeLocaleObject,
} from "d3-time-format";
import {
  en as pluralsEn,
  sr as pluralsSr,
} from "make-plural/plurals";

import { defaultLocale, locales } from "./constants";
import { messages as catalogEn } from "./en/messages";
import { messages as catalogSrCyrl } from "./sr-Cyrl/messages";
import { messages as catalogSrLatn } from "./sr-Latn/messages";

export type Locale = (typeof locales)[number];

export { defaultLocale, locales };
export { i18n };

i18n.loadLocaleData({
  "sr-Latn": { plurals: pluralsSr },
  "sr-Cyrl": { plurals: pluralsSr },
  en: { plurals: pluralsEn },
});

const catalogSrLatnWithOverrides = {
  ...catalogSrLatn,
  "demos.showcase.title": "Galerija demo vizualizacija",
  "demos.showcase.description":
    "Brzi pregled više tipova grafikona sa reprezentativnim skupovima podataka.",
  "demos.showcase.hero":
    "Svež paket ključnih pokazatelja ekonomije, mobilnosti, energetike i digitalizacije.",
  "demos.showcase.cta": "Pregledaj sve demoe",
  "demos.showcase.economy.title": "Regionalni rast BDP-a",
  "demos.showcase.economy.description": "Godišnji rast BDP-a po regionima.",
  "demos.showcase.transport.title": "Momentum javnog prevoza",
  "demos.showcase.transport.description":
    "Milioni putovanja – pad 2020, zatim postepeni oporavak.",
  "demos.showcase.energy.title": "Struktura energetskog miksa",
  "demos.showcase.energy.description": "Udeo izvora u proizvodnji električne energije.",
  "demos.showcase.digital.title": "Jaz u digitalnim veštinama",
  "demos.showcase.digital.description":
    "Udeo populacije sa barem osnovnim digitalnim veštinama.",
  "demos.showcase.dataset.title": "Indikatori za prikaz",
  "demos.showcase.dataset.organization": "Primer skupa podataka",
  "demos.showcase.chip.economy": "Ekonomski puls",
  "demos.showcase.chip.mobility": "Mobilnost",
  "demos.showcase.chip.energy": "Energetika",
  "demos.showcase.chip.digital": "Digitalno",
  "demos.showcase.hero.stat1.label": "BDP YoY: +4,3%",
  "demos.showcase.hero.stat1.hint": "Beograd prednjači",
  "demos.showcase.hero.stat2.label": "Putovanja 2023: 171M",
  "demos.showcase.hero.stat2.hint": "Stabilan oporavak",
  "demos.showcase.hero.stat3.label": "Udeo uglja: 64%",
  "demos.showcase.hero.stat3.hint": "Potrebna diverzifikacija",
  "demos.showcase.hero.body":
    "Koherentan set grafikona koji naglašava zamah, padove, miks izvora i jaz u veštinama.",
  "demos.showcase.economy.xlabel": "Region",
  "demos.showcase.economy.ylabel": "Rast (%)",
  "demos.showcase.transport.xlabel": "Godina",
  "demos.showcase.transport.ylabel": "Milioni putovanja",
  "demos.showcase.digital.xlabel": "Segment",
  "demos.showcase.digital.ylabel": "Udeo (%)",
  "demos.showcase.cta.title": "Želite još?",
  "demos.showcase.cta.body":
    "Posetite kompletnu galeriju za više kategorija i aktuelne podatke.",
};

const catalogSrCyrlWithOverrides = {
  ...catalogSrCyrl,
  "demos.showcase.title": "Галерија демо визуализација",
  "demos.showcase.description":
    "Брзи преглед више типова графикона са репрезентативним скуповима података.",
  "demos.showcase.hero":
    "Свеж пакет кључних показатеља економије, мобилности, енергетике и дигитализације.",
  "demos.showcase.cta": "Прегледај све демое",
  "demos.showcase.economy.title": "Регионални раст БДП-а",
  "demos.showcase.economy.description": "Годишњи раст БДП-а по регионима.",
  "demos.showcase.transport.title": "Моментум јавног превоза",
  "demos.showcase.transport.description":
    "Милиони путовања – пад 2020, затим постепени опоравак.",
  "demos.showcase.energy.title": "Структура енергетског микса",
  "demos.showcase.energy.description": "Удео извора у производњи електричне енергије.",
  "demos.showcase.digital.title": "Јаз у дигиталним вештинама",
  "demos.showcase.digital.description":
    "Удео популације са бар основним дигиталним вештинама.",
  "demos.showcase.dataset.title": "Индикатори за приказ",
  "demos.showcase.dataset.organization": "Пример скупа података",
  "demos.showcase.chip.economy": "Економски пулс",
  "demos.showcase.chip.mobility": "Мобилност",
  "demos.showcase.chip.energy": "Енергетика",
  "demos.showcase.chip.digital": "Дигитално",
  "demos.showcase.hero.stat1.label": "БДП YoY: +4,3%",
  "demos.showcase.hero.stat1.hint": "Београд предњачи",
  "demos.showcase.hero.stat2.label": "Путовања 2023: 171М",
  "demos.showcase.hero.stat2.hint": "Стабилан опоравак",
  "demos.showcase.hero.stat3.label": "Удео угља: 64%",
  "demos.showcase.hero.stat3.hint": "Потребна диверзификација",
  "demos.showcase.hero.body":
    "Кохерентан сет графикона који истиче замах, падове, микс извора и јаз у вештинама.",
  "demos.showcase.economy.xlabel": "Регион",
  "demos.showcase.economy.ylabel": "Раст (%)",
  "demos.showcase.transport.xlabel": "Година",
  "demos.showcase.transport.ylabel": "Милиони путовања",
  "demos.showcase.digital.xlabel": "Сегмент",
  "demos.showcase.digital.ylabel": "Удео (%)",
  "demos.showcase.cta.title": "Желите још?",
  "demos.showcase.cta.body":
    "Посетите комплетну галерију за више категорија и актуелне податке.",
};

i18n.load({
  "sr-Latn": catalogSrLatnWithOverrides,
  "sr-Cyrl": catalogSrCyrlWithOverrides,
  en: catalogEn,
});
i18n.activate(defaultLocale);

/**
 * Parses a valid app locale from a locale string (e.g. a Accept-Language header).
 * If unparseable, returns default locale.
 * @param localeString locale string, e.g. sr,en-US;q=0.7,en;q=0.3
 */
export const parseLocaleString = (
  localeString: string | null | undefined
): Locale => {
  if (localeString == null) {
    return defaultLocale;
  }
  const result = /^(sr-Latn|sr-Cyrl|en)/.exec(localeString);
  return result ? (result[1] as Locale) : defaultLocale;
};

// Below constants are extracted from d3-time-format/locale.
const timeFormatEn = {
  dateTime: "%a %e %b %X %Y",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

// Serbian Latin time format
const timeFormatSrLatn = {
  dateTime: "%A, %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "nedelja",
    "ponedeljak",
    "utorak",
    "sreda",
    "četvrtak",
    "petak",
    "subota",
  ],
  shortDays: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
  months: [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar",
  ],
  shortMonths: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "avg",
    "sep",
    "okt",
    "nov",
    "dec",
  ],
};

// Serbian Cyrillic time format
const timeFormatSrCyrl = {
  dateTime: "%A, %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "недеља",
    "понедељак",
    "уторак",
    "среда",
    "четвртак",
    "петак",
    "субота",
  ],
  shortDays: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"],
  months: [
    "јануар",
    "фебруар",
    "март",
    "април",
    "мај",
    "јун",
    "јул",
    "август",
    "септембар",
    "октобар",
    "новембар",
    "децембар",
  ],
  shortMonths: [
    "јан",
    "феб",
    "мар",
    "апр",
    "мај",
    "јун",
    "јул",
    "авг",
    "сеп",
    "окт",
    "нов",
    "дец",
  ],
};

const d3TimeFormatLocales: { [locale: string]: TimeLocaleObject } = {
  "sr-Latn": timeFormatLocale(timeFormatSrLatn as TimeLocaleDefinition),
  "sr-Cyrl": timeFormatLocale(timeFormatSrCyrl as TimeLocaleDefinition),
  en: timeFormatLocale(timeFormatEn as TimeLocaleDefinition),
};

export const getD3TimeFormatLocale = (locale: string): TimeLocaleObject =>
  d3TimeFormatLocales[locale] ?? d3TimeFormatLocales["sr-Latn"];

const numberFormatSr = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\u00a0RSD"],
};

const numberFormatEn = {
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
};

const d3FormatLocales: { [locale: string]: FormatLocaleObject } = {
  "sr-Latn": formatLocale(numberFormatSr as FormatLocaleDefinition),
  "sr-Cyrl": formatLocale(numberFormatSr as FormatLocaleDefinition),
  en: formatLocale(numberFormatEn as FormatLocaleDefinition),
};

export const getD3FormatLocale = (): FormatLocaleObject => d3FormatLocales["sr-Latn"];
