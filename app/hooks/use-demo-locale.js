import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { DEFAULT_DEMO_LOCALE, isDemoLocale } from '@/types/demos';
export function useDemoLocale(options) {
    const { locale } = useRouter();
    const { fallback = DEFAULT_DEMO_LOCALE } = options !== null && options !== void 0 ? options : {};
    return useMemo(() => {
        if (isDemoLocale(locale)) {
            return locale;
        }
        return fallback;
    }, [locale, fallback]);
}
export function useDemoTranslations(translations, options) {
    var _a;
    const contextLocale = useDemoLocale();
    const targetLocale = (_a = options === null || options === void 0 ? void 0 : options.locale) !== null && _a !== void 0 ? _a : contextLocale;
    return useMemo(() => {
        return Object.keys(translations).reduce((acc, key) => {
            const typedKey = key;
            acc[typedKey] = translations[typedKey][targetLocale];
            return acc;
        }, {});
    }, [targetLocale, translations]);
}
export function useLocaleValue(content, options) {
    var _a;
    const contextLocale = useDemoLocale();
    const targetLocale = (_a = options === null || options === void 0 ? void 0 : options.locale) !== null && _a !== void 0 ? _a : contextLocale;
    return content[targetLocale];
}
