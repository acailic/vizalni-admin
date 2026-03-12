import Document, { Head, Html, Main, NextScript } from "next/document";

import { GA_TRACKING_ID } from "@/domain/env";

// Detect static export mode (GitHub Pages) - /api routes don't exist
const isStaticExport = !!process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

class MyDocument extends Document {
  render() {
    return (
      <Html data-app-version={`${process.env.NEXT_PUBLIC_VERSION}`}>
        <Head>
          {/* SPA GitHub Pages redirect handler - must be first */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Single Page Apps for GitHub Pages
                // https://github.com/rafgraph/spa-github-pages
                (function() {
                  var l = window.location;
                  if (l.search[1] === '/' ) {
                    var decoded = l.search.slice(1).split('&').map(function(s) {
                      return s.replace(/~and~/g, '&')
                    }).join('?');
                    window.history.replaceState(null, null,
                      l.pathname.slice(0, -1) + decoded +
                      l.hash
                    );
                  }
                }());
              `,
            }}
          />
          <link
            rel="icon"
            href={`${basePath}/favicon.svg`}
            type="image/svg+xml"
          />
          <link rel="alternate icon" href={`${basePath}/favicon.ico`} />
          {/* Only load client-env from API in non-static builds */}
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          {!isStaticExport && <script src="/api/client-env"></script>}
          {GA_TRACKING_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];function gtag() {window.dataLayer.push(arguments);};gtag("js", new Date());gtag("config", "${GA_TRACKING_ID}", {anonymize_ip:true});`,
                }}
              ></script>
            </>
          )}
        </Head>
        <body>
          <Main />
          <script
            noModule
            src={`${basePath}/static/ie-check.js`}
            defer
          ></script>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
