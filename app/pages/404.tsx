import Head from "next/head";

/**
 * 404 page for GitHub Pages SPA routing.
 *
 * For GitHub Pages static hosting, this page must redirect to the main app
 * with the route path preserved in the URL. The main app's _document.tsx
 * contains the handler that restores the route client-side.
 *
 * This enables client-side routing to work on GitHub Pages.
 */
const Page = () => (
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

export default Page;
