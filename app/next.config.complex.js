// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withMDX = require("@next/mdx")();
const withPreconstruct = require("@preconstruct/next");
const { withSentryConfig } = require("@sentry/nextjs");
const { IgnorePlugin } = require("webpack");

const pkg = require("../package.json");

const { defaultLocale, locales } = require("./locales/locales.json");

// Populate build-time variables from package.json
process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;
process.env.NEXT_PUBLIC_GITHUB_REPO = pkg.repository.url.replace(
  /(\/|\.git)$/,
  ""
);
// Dynamic NEXTAUTH_URL logic
const isVercelPreview = !!process.env.VERCEL_URL;

// Dynamically set NEXTAUTH_URL
if (isVercelPreview) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

// Only log in development mode
if (process.env.NODE_ENV === "development") {
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("Version", process.env.NEXT_PUBLIC_VERSION);
  console.log("Commit", process.env.NEXT_PUBLIC_COMMIT);
  console.log("GitHub Repo", process.env.NEXT_PUBLIC_GITHUB_REPO);
  console.log("Extra Certs", process.env.NODE_EXTRA_CA_CERTS);
  console.log("Prevent search bots", process.env.PREVENT_SEARCH_BOTS);
}

// GitHub Pages configuration
const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
if (
  isGitHubPages &&
  (process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEBUG === "true")
) {
  console.log("Building for GitHub Pages with static export mode");
}
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const enableSentryUpload =
  Boolean(process.env.SENTRY_AUTH_TOKEN) &&
  process.env.SENTRY_UPLOAD !== "false";
const imageConfig = {
  // Enable modern image formats
  formats: ["image/avif", "image/webp"],

  // Cache optimized images for longer
  minimumCacheTTL: 31536000, // 1 year for static images

  // Device sizes for responsive images
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

  // Image sizes for srcset generation
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],

  // Enable image optimization
  unoptimized: false,

  // Allow external domains for images (WMS/WMTS services)
  domains: [
    'localhost',
    '127.0.0.1',
  ],

  // Allow any image source for WMS/WMTS services
  remotePatterns: [
    {
      protocol: 'http',
      hostname: '**',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: '**',
      pathname: '/**',
    },
  ],

  // Allow any image source (needed for dynamic map services)
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

const nextConfig = withPreconstruct(
  withBundleAnalyzer(
    withMDX({
      output: isGitHubPages ? "export" : "standalone",
      basePath: basePath,
      assetPrefix: basePath,
      images: imageConfig,
      i18n: isGitHubPages
        ? undefined
        : {
            locales,
            defaultLocale,
          },

      // Headers only work with server/standalone builds, not with static export
      ...(!isGitHubPages && {
        headers: async () => {
          const headers = [];

          // Security headers
          headers.push({
            source: "/:path*",
            headers: [
              {
                key: "X-Content-Type-Options",
                value: "nosniff",
              },
              {
                key: "X-Frame-Options",
                value: "DENY",
              },
              {
                key: "X-XSS-Protection",
                value: "1; mode=block",
              },
              {
                key: "Referrer-Policy",
                value: "strict-origin-when-cross-origin",
              },
              {
                key: "Permissions-Policy",
                value: "camera=(), microphone=(), geolocation=()",
              
              },
              // A+ security headers
              {
                key: "Strict-Transport-Security",
                value: "max-age=31536000; includeSubDomains; preload",
              },
              {
                key: "Cross-Origin-Embedder-Policy",
                value: "require-corp",
              },
              {
                key: "Cross-Origin-Opener-Policy",
                value: "same-origin",
              },
              {
                key: "Cross-Origin-Resource-Policy",
                value: "same-origin",
              },
              {
                key: "X-Permitted-Cross-Domain-Policies",
                value: "none",
              },
              {
                key: "X-Download-Options",
                value: "noopen"},
            ],
          });

          // Static assets caching - aggressive caching for versioned assets
          headers.push({
            source: "/_next/static/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          });

          // Static files in public folder
          headers.push({
            source: "/(static|images|icons|fonts)/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          });

          // API routes - moderate caching for GET requests
          headers.push({
            source: "/api/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=300, stale-while-revalidate=600",
              },
              {
                key: "Vary",
                value: "Accept-Encoding",
              },
            ],
          });

          // Pages - shorter cache for dynamic content
          headers.push({
            source: "/:path*",
            has: [
              {
                type: "header",
                key: "accept",
                value: "text/html",
              },
            ],
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=3600, stale-while-revalidate=7200",
              },
            ],
          });

          // Image optimization caching
          headers.push({
            source: "/_next/image(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          });

          // JSON files and data
          headers.push({
            source: "/(.*).json",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=1800, stale-while-revalidate=3600",
              },
            ],
          });

          // See https://content-security-policy.com/ & https://developers.google.com/tag-platform/security/guides/csp
          if (
            !(process.env.DISABLE_CSP && process.env.DISABLE_CSP === "true")
          ) {
            headers[0].headers.push({
              key: "Content-Security-Policy",
              value: [
                `default-src 'self' 'unsafe-inline'${
                  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
                } https://*.sentry.io https://vercel.live/ https://vercel.com https://*.googletagmanager.com`,
                `script-src 'self' 'unsafe-inline'${
                  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
                } https://*.sentry.io https://vercel.live/ https://vercel.com https://*.googletagmanager.com https://api.mapbox.com`,
                `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net`,
                `font-src 'self'`,
                `form-action 'self'`,

                // * to allow WMS / WMTS endpoints
                `connect-src 'self' *`,

                // * to allow loading legend images from custom WMS / WMTS endpoints and data: to allow downloading images
                `img-src 'self' * data: blob:`,
                `script-src-elem 'self' 'unsafe-inline' https://vercel.live https://vercel.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://api.mapbox.com https://cdn.jsdelivr.net`,
                `worker-src 'self' blob:`,
              ].join("; "),
            });
          }

          if (process.env.PREVENT_SEARCH_BOTS === "true") {
            headers[0].headers.push({
              key: "X-Robots-Tag",
              value: "noindex, nofollow",
            });
          }

          return headers;
        },
      }),

      pageExtensions: ["js", "ts", "tsx", "mdx"],

      // Enable SWC minifier for faster builds
      swcMinify: true,

      // Optimize production builds
      productionBrowserSourceMaps: false,

      // Compiler optimizations
      compiler: {
        // Remove console.log in production (keeps console.error/warn)
        removeConsole:
          process.env.NODE_ENV === "production"
            ? { exclude: ["error", "warn"] }
            : false,
      },

      // Experimental optimizations for faster builds
      experimental: {
        // Optimize package imports to reduce bundle size
        optimizePackageImports: [
          "@mui/material",
          "@mui/icons-material",
          "@mui/lab",
          "date-fns",
          "lodash",
          "d3-array",
          "d3-scale",
          "d3-shape",
          "d3-format",
          "d3-time-format",
          "framer-motion",
          "@emotion/react",
          "@emotion/styled",
          "@hello-pangea/dnd",
          "@dnd-kit/core",
          "@dnd-kit/utilities",
        ],
        // Enable parallel compilation
        cpus: require("os").cpus().length - 1 || 1,
        // Enable webpack 5 optimizations
        optimizeCss: true,
        // Enable Turbopack for faster development builds (when ready)
        // turbo: {
        //   rules: {
        //     '*.svg': ['@svgr/webpack'],
        //   },
        // },
      },

      // Modularize imports for better tree-shaking
      modularizeImports: {
        "@mui/icons-material": {
          transform: "@mui/icons-material/{{member}}",
        },
        lodash: {
          transform: "lodash/{{member}}",
        },
        "date-fns": {
          transform: "date-fns/{{member}}",
        },
      },

      // Configure logging to show info for debugging when enabled
      logging: {
        level: process.env.NEXT_PUBLIC_DEBUG === "true" ? "info" : "error",
        fetches: {
          fullUrl: true,
        },
      },

      eslint: {
        // Lint runs separately in CI; skip in-build lint to keep exports predictable
        ignoreDuringBuilds: true,
      },

      webpack(config, { dev, isServer }) {
        config.module.rules.push({
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader",
        });

        /* Disable source maps in production for faster builds */
        if (!dev) {
          config.devtool = false;
        }

        if (!dev && !isServer) {
          config.optimization.splitChunks = {
            ...config.optimization.splitChunks,
            chunks: "all",
            minSize: 20000,
            maxSize: 244000,
            maxInitialRequests: 30,
            maxAsyncRequests: 50,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                  return `npm.${packageName.replace('@', '')}`;
                },
                priority: 10,
                chunks: "all",
              },
              charts: {
                test: /[\\/]charts[\\/]/,
                name: "charts",
                priority: 20,
                chunks: "all",
              },
              mui: {
                test: /[\\/]node_modules[\\/]@mui[\\/]/,
                name: "mui",
                priority: 30,
                chunks: "all",
              },
              d3: {
                test: /[\\/]node_modules[\\/]d3-[\\/]/,
                name: "d3",
                priority: 25,
                chunks: "all",
              },
            },
          };
          config.optimization.runtimeChunk = "single";
        }

        config.resolve.extensions.push(dev ? ".dev.ts" : ".prod.ts");
        config.resolve.alias = {
          ...config.resolve.alias,
          "mapbox-gl": "maplibre-gl",
        };
        // For some reason these need to be ignored for serverless target
        config.plugins.push(
          new IgnorePlugin({ resourceRegExp: /^(pg-native|vue)$/ })
        );

        return config;
      },

      // Redirects only work with server/standalone builds, not with static export
      ...(!isGitHubPages && {
        async redirects() {
          return [
            {
              source: "/storybook",
              destination: "/storybook/index.html",
              permanent: true,
            },
          ];
        },
      }),
    })
  )
);

module.exports = withSentryConfig(
  nextConfig,
  {
    // Suppress all Sentry build output
    silent: true,
    // Disable build-time Sentry plugins by default; enable when a token is present
    disableServerWebpackPlugin: !enableSentryUpload,
    disableClientWebpackPlugin: !enableSentryUpload,
    // Hide source maps in production to prevent code visibility in browser devtools
    hideSourceMaps: true,
    // Suppress source map upload warnings
    widenClientFileUpload: false,
    tunnelRoute: "/monitoring",
    org: process.env.SENTRY_ORG || "dummy-org",
    project: process.env.SENTRY_PROJECT || "dummy-project",
    // Disable telemetry to suppress additional warnings
    disableLogger: true,
    // Keep builds passing even if Sentry CLI fails (e.g., network timeouts)
    errorHandler(error) {
      console.warn("Sentry upload failed; continuing build.", error?.message || error);
    },
  },
  {
    // Suppress CLI output and warnings
    silent: true,
    // Hide source maps (also controlled by hideSourceMaps above)
    hideSourceMaps: true,
    // CI-friendly: skip uploads when no auth token is provided
    dryRun: !enableSentryUpload,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  }
);
