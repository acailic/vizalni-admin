import { Box, Typography } from "@mui/material";
import Head from "next/head";

import {
  Actions,
  ErrorPageHint,
  HomeLink,
} from "@/components/error-pages-components";
import { ContentLayout } from "@/components/layout";
import { isStaticExportMode } from "@/utils/public-paths";

/**
 * 404 page.
 *
 * In GitHub Pages static mode, redirects to the main app with the route path
 * preserved in the URL (SPA routing). In server mode, shows a proper 404 page.
 */
const Page = () => {
  if (isStaticExportMode) {
    return (
      <>
        <Head>
          <title>Redirecting...</title>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              // Single Page Apps for GitHub Pages
              // MIT License
              // https://github.com/rafgraph/spa-github-pages
              (function() {
                var pathSegmentsToKeep = 1; // Keep one segment for /vizualni-admin

                var l = window.location;
                l.replace(
                  l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
                  l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
                  l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
                  (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
                  l.hash
                );
              }());
            `,
            }}
          />
        </Head>
        <p>Redirecting...</p>
      </>
    );
  }

  return (
    <ContentLayout>
      <Box sx={{ backgroundColor: "muted.main", my: "auto" }}>
        <ErrorPageHint>
          <Typography component="div" variant="h2" sx={{ my: 3 }}>
            404 – Stranica nije pronađena.
          </Typography>
          <Actions>
            <HomeLink locale="sr-Latn">Vrati se na početnu stranu</HomeLink>.
          </Actions>
        </ErrorPageHint>

        <ErrorPageHint>
          <Typography component="div" variant="h2" sx={{ my: 3 }}>
            404 – Страница није пронађена.
          </Typography>
          <Actions>
            <HomeLink locale="sr-Cyrl">Врати се на почетну страну</HomeLink>.
          </Actions>
        </ErrorPageHint>

        <ErrorPageHint>
          <Typography component="div" variant="h2" sx={{ my: 3 }}>
            404 – Page not found.
          </Typography>
          <Actions>
            <HomeLink locale="en">Go back to Homepage</HomeLink>.
          </Actions>
        </ErrorPageHint>
      </Box>
    </ContentLayout>
  );
};

export default Page;
