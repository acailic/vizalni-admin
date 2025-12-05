import { I18nProvider } from "@lingui/react";
import "core-js/features/array/flat-map";
// Used for color-picker component. Must include here because of next.js constraints about global CSS imports
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

import PerformanceInitializer from "@/components/app/PerformanceInitializer";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { SnackbarProvider } from "@/components/snackbar";
import { PUBLIC_URL } from "@/domain/env";
import { flag } from "@/flags/flag";
import { GraphqlProvider } from "@/graphql/graphql-provider";
import { i18n, parseLocaleString } from "@/locales/locales";
import { LocaleProvider } from "@/locales/use-locale";
import * as federalTheme from "@/themes/theme";
import { AsyncLocalizationProvider } from "@/utils/async-localization-provider";
import { EventEmitterProvider } from "@/utils/event-emitter";
import { Flashes } from "@/utils/flashes";
import { analyticsPageView } from "@/utils/google-analytics";
import "@/utils/nprogress.css";
import { useNProgress } from "@/utils/use-nprogress";

import "@/configurator/components/color-picker.css";

const GQLDebugPanel = dynamic(
  () => import("@/gql-flamegraph/devtool").then((mod) => mod.DebugPanel),
  { ssr: false }
);

// Performance Analytics - only in development
const PerformanceAnalytics = dynamic(
  () => import("@/components/performance-analytics").then((mod) => mod.PerformanceAnalytics),
  { ssr: false }
);

// PWA Install Prompt - client-side only
const InstallPrompt = dynamic(
  () => import("@/components/pwa/InstallPrompt").then((mod) => mod.default),
  { ssr: false }
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const { events: routerEvents, asPath, locale: routerLocale } = useRouter();
  const locale = parseLocaleString(routerLocale ?? "");

  useNProgress();

  // Immediately activate locale to avoid re-render
  if (i18n.locale !== locale) {
    i18n.activate(locale);
  }

  // Initialize analytics
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      analyticsPageView(url);
    };

    const handleRouteStart = (url: string) => {
      const locale = parseLocaleString(url.slice(1));
      if (i18n.locale !== locale) {
        i18n.activate(locale);
      }
    };

    routerEvents.on("routeChangeStart", handleRouteStart);
    routerEvents.on("routeChangeComplete", handleRouteChange);
    return () => {
      routerEvents.off("routeChangeStart", handleRouteStart);
      routerEvents.off("routeChangeComplete", handleRouteChange);
    };
  }, [routerEvents]);

  const shouldShowGQLDebug =
    process.env.NODE_ENV === "development" || flag("debug");

  const shouldShowPerformanceAnalytics = false; // Disabled to show actual content
  const shouldShowInstallPrompt = process.env.NODE_ENV === "production";

  return (
    <>
      <Head>
        <title key="title">{pageTitleByLocale[locale]}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitleByLocale[locale]} />
        <meta property="og:description" content={descriptionByLocale[locale]} />
        <meta property="og:image" content={`${PUBLIC_URL}/og-image.webp`} />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:url" content={`${PUBLIC_URL}${asPath}`} />

        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#1976d2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vizualni Admin" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Vizualni Admin" />
        <meta name="msapplication-TileColor" content="#1976d2" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />

        {/* Optimized font preloading - critical fonts only */}
        {federalTheme.preloadFonts?.slice(0, 2).map((src) => (
          <link
            key={src}
            rel="preload"
            href={src}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}

        {/* Font performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.data.gov.rs" crossOrigin="anonymous" />
        <meta httpEquiv="accept-ch" content="dpr, width, viewport-width" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Critical CSS for font loading */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: "NotoSans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
              font-display: swap;
            }
          `
        }} />

        {/* Preload critical resources */}
        <link rel="preload" href="/sw.js" as="script" crossOrigin="anonymous" />
      </Head>

      <AppErrorBoundary>
        <SessionProvider session={session}>
          <LocaleProvider value={locale}>
            <I18nProvider i18n={i18n}>
              <GraphqlProvider>
                <ThemeProvider theme={federalTheme.theme}>
                  <EventEmitterProvider>
                    <SnackbarProvider>
                      <CssBaseline />
                      <PerformanceInitializer>
                        <Flashes />
                        {shouldShowGQLDebug ? <GQLDebugPanel /> : null}
                        <AsyncLocalizationProvider locale={locale}>
                          <Component {...pageProps} />
                        </AsyncLocalizationProvider>
                      </PerformanceInitializer>
                    </SnackbarProvider>
                    {/* PWA Install Prompt - Production Only */}
                    {shouldShowInstallPrompt && <InstallPrompt />}
                  </EventEmitterProvider>
                </ThemeProvider>
              </GraphqlProvider>
            </I18nProvider>
          </LocaleProvider>
        </SessionProvider>
      </AppErrorBoundary>

      {/* Performance Analytics - Development Only */}
      {shouldShowPerformanceAnalytics && <PerformanceAnalytics />}
    </>
  );
}

const pageTitleByLocale = {
  "sr-Latn": "Vizualni Admin | Vizualizacija otvorenih podataka Srbije",
  "sr-Cyrl": "Vizualni Admin | Визуализација отворених података Србије",
  en: "Vizualni Admin | Serbian Open Data Visualizations",
};

const descriptionByLocale = {
  "sr-Latn":
    "Napravite i ugradite vizualizacije iz skupova podataka sa portala data.gov.rs, zvaničnog portala otvorenih podataka Srbije.",
  "sr-Cyrl":
    "Направите и уградите визуализације из скупова података са портала data.gov.rs, званичног портала отворених података Србије.",
  en: "Build and embed visualizations from data.gov.rs, Serbia's official open data portal.",
};
