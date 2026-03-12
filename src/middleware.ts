import createMiddleware from 'next-intl/middleware';
import {locales} from './lib/i18n/routing';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales,
 
  // Used when no locale matches
  defaultLocale: 'sr-Cyrl',
  
  // Always use a locale prefix (e.g., /sr-Cyrl)
  localePrefix: 'always'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(sr-Cyrl|sr-Latn|en)/:path*']
};
