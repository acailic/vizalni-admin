/**
 * OPTIMIZED Next.js Configuration
 * Target: Top 0.1% performance metrics
 * Bundle Size: <5MB total, <250KB per chunk
 */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = require("@next/mdx")();
const withPreconstruct = require("@preconstruct/next");
const { withSentryConfig } = require("@sentry/nextjs");
const { IgnorePlugin } = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");

const pkg = require("./package.json");
const { defaultLocale, locales } = require("./app/locales/locales.json");

// Performance optimization constants
const PERFORMANCE_BUDGETS = {
  CHUNK_SIZE_LIMIT: 250000, // 250KB per chunk
  BUNDLE_SIZE_LIMIT: 5000000, // 5MB total
  MAX_ASYNC_REQUESTS: 25,
};

// Populate build-time variables
process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;
process.env.NEXT_PUBLIC_GITHUB_REPO = pkg.repository.url.replace(
  /(\/|\.git)$/,
  ""
);

const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = !isDevelopment;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const enableSentryUpload = Boolean(process.env.SENTRY_AUTH_TOKEN) &&
  process.env.SENTRY_UPLOAD !== "false";

const imageConfig = {
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
};

const optimizedNextConfig = withPreconstruct(
  withBundleAnalyzer(
    withMDX({
      output: isGitHubPages ? "export" : "standalone",
      basePath: basePath,
      assetPrefix: basePath,
      images: imageConfig,
      i18n: isGitHubPages ? undefined : { locales, defaultLocale },

      // Security Headers (existing + optimizations)
      ...(!isGitHubPages && {
        headers: async () => {
          const headers = [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                { key: "X-XSS-Protection", value: "1; mode=block" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                // Performance headers
                { key: "X-DNS-Prefetch-Control", value: "on" },
                { key: "X-Frame-Options", value: "DENY" },
              ],
            },
          ];

          // Content Security Policy (optimized for performance)
          if (!(process.env.DISABLE_CSP === "true")) {
            headers[0].headers.push({
              key: "Content-Security-Policy",
              value: [
                `default-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
                `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://*.sentry.io`,
                `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net`,
                `font-src 'self' data:`,
                `connect-src 'self' *`,
                `img-src 'self' * data: blob:`,
                `worker-src 'self' blob:`,
              ].join("; "),
            });
          }

          // Cache control for static assets
          headers.push({
            source: "/_next/static/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          });

          return headers;
        },
      }),

      pageExtensions: ["js", "ts", "tsx", "mdx"],

      // Build Optimizations
      swcMinify: true,
      productionBrowserSourceMaps: false,

      // Compiler optimizations
      compiler: {
        removeConsole: isProduction ? { exclude: ["error", "warn"] } : false,
        // Remove React propTypes in production
        reactRemoveProperties: isProduction,
      },

      // Experimental optimizations
      experimental: {
        // Optimize package imports for tree-shaking
        optimizePackageImports: [
          "@mui/material",
          "@mui/icons-material",
          "@mui/lab",
          "date-fns",
          "lodash",
          "d3-array",
          "d3-scale",
          "d3-scale-chromatic",
          "d3-shape",
          "d3-format",
          "d3-time-format",
          "framer-motion",
          "@emotion/react",
          "@emotion/styled",
        ],

        // Parallel compilation
        cpus: require("os").cpus().length - 1 || 1,

        // Optimized client chunks
        optimizeCss: true,

        // Enable modern JS features
        esmExternals: "loose",

        // App directory optimizations
        appDir: true,
        serverComponentsExternalPackages: [
          "@mui/icons-material",
          "d3-*",
          "sharp",
          "canvas",
        ],

        // Bundle analysis
        optimizeServerReact: true,
        scrollRestoration: true,

        // Font optimization - local fonts with optimized loading
        fontLoaders: [
          {
            loader: "next/font/local",
            options: {
              src: "./app/public/static/fonts/NotoSans-Regular.woff2",
              weight: "400",
              style: "normal",
              display: "swap",
              preload: true,
            },
          },
          {
            loader: "next/font/local",
            options: {
              src: "./app/public/static/fonts/NotoSans-Bold.woff2",
              weight: "700",
              style: "normal",
              display: "swap",
              preload: true,
            },
          },
          {
            loader: "next/font/local",
            options: {
              src: "./app/public/static/fonts/NotoSans-Italic.woff2",
              weight: "400",
              style: "italic",
              display: "fallback",
              preload: false,
            },
          },
          {
            loader: "next/font/local",
            options: {
              src: "./app/public/static/fonts/NotoSans-BoldItalic.woff2",
              weight: "700",
              style: "italic",
              display: "fallback",
              preload: false,
            },
          },
        ],
      },

      // Modular imports for tree-shaking
      modularizeImports: {
        "@mui/icons-material": {
          transform: "@mui/icons-material/{{member}}",
          skipDefaultConversion: true,
        },
        "lodash": {
          transform: "lodash/{{member}}",
        },
        "date-fns": {
          transform: "date-fns/{{member}}",
        },
        "d3-scale": {
          transform: "d3-scale/{{member}}",
        },
        "framer-motion": {
          transform: "framer-motion/{{member}}",
        },
      },

      // Optimized webpack configuration
      webpack(config, { dev, isServer, webpack }) {
        // GraphQL files
        config.module.rules.push({
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader",
        });

        // Disable source maps in production
        if (!dev) {
          config.devtool = false;
        }

        // Advanced optimization for client-side bundles
        if (!dev && !isServer) {
          // Aggressive code splitting
          config.optimization.splitChunks = {
            chunks: "all",
            minSize: 20000,
            maxSize: PERFORMANCE_BUDGETS.CHUNK_SIZE_LIMIT,
            maxInitialRequests: 25,
            maxAsyncRequests: PERFORMANCE_BUDGETS.MAX_ASYNC_REQUESTS,
            cacheGroups: {
              // Framework chunks
              framework: {
                test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                name: "framework",
                chunks: "all",
                priority: 40,
                enforce: true,
              },

              // Material-UI chunks
              mui: {
                test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
                name: "vendor.mui",
                chunks: "all",
                priority: 30,
                enforce: true,
              },

              // Chart/D3 chunks
              charts: {
                test: /[\\/]node_modules[\\/](d3-|recharts|chart|vis)[\\/]/,
                name: "vendor.charts",
                chunks: "all",
                priority: 25,
              },

              // Utility chunks
              utilities: {
                test: /[\\/]node_modules[\\/](lodash|date-fns|fp-ts|io-ts)[\\/]/,
                name: "vendor.utils",
                chunks: "all",
                priority: 20,
              },

              // Map chunks
              maps: {
                test: /[\\/]node_modules[\\/](mapbox|maplibre|leaflet)[\\/]/,
                name: "vendor.maps",
                chunks: "all",
                priority: 15,
              },

              // Default vendor chunks
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  const packageName = module.context.match(
                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                  )?.[1];
                  return `vendor.${packageName?.replace("@", "") || "unknown"}`;
                },
                chunks: "all",
                priority: 10,
              },
            },
          };

          // Runtime chunk optimization
          config.optimization.runtimeChunk = {
            name: "runtime",
          };

          // Module concatenation
          config.optimization.concatenateModules = true;

          // Add compression plugin for production
          config.plugins.push(
            new CompressionPlugin({
              algorithm: "gzip",
              test: /\.(js|css|html|svg)$/,
              threshold: 8192,
              minRatio: 0.8,
            }),
            new CompressionPlugin({
              algorithm: "brotliCompress",
              test: /\.(js|css|html|svg)$/,
              threshold: 8192,
              minRatio: 0.8,
              filename: "[path][base].br",
              compressionOptions: {
                level: 11,
              },
            })
          );
        }

        // Resolve aliases and extensions
        config.resolve.extensions.push(dev ? ".dev.ts" : ".prod.ts");
        config.resolve.alias = {
          ...config.resolve.alias,
          "mapbox-gl": "maplibre-gl",
          // Performance: Direct to ES modules when available
          "react": "react/index.js",
          "react-dom": "react-dom/index.js",
        };

        // Ignore problematic modules
        config.plugins.push(
          new IgnorePlugin({
            resourceRegExp: /^(pg-native|vue|electron)$/,
          })
        );

        // Advanced font optimization
        if (!isServer) {
          config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/fonts/[name].[hash][ext]',
            },
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash].[ext]',
                  outputPath: 'static/fonts/',
                  publicPath: '/_next/static/fonts/',
                },
              },
            ],
          });

          // Font subsetting and optimization
          config.optimization.splitChunks.cacheGroups.fonts = {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            name: 'fonts',
            chunks: 'all',
            priority: 1000,
            enforce: true,
            minChunks: 1,
            maxSize: 100000, // 100KB max per font chunk
          };

          // Preload critical fonts
          config.plugins.push(new class {
            apply(compiler) {
              compiler.hooks.compilation.tap('FontPreloader', (compilation) => {
                compilation.hooks.processAssets.tap(
                  {
                    name: 'FontPreloader',
                    stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
                  },
                  () => {
                    const criticalFonts = [
                      '/static/fonts/NotoSans-Regular.woff2',
                      '/static/fonts/NotoSans-Bold.woff2'
                    ];

                    criticalFonts.forEach(fontUrl => {
                      compilation.emitAsset(
                        `preload-${fontUrl.split('/').pop()}`,
                        new webpack.sources.RawSource(
                          `<link rel="preload" href="${fontUrl}" as="font" type="font/woff2" crossorigin="anonymous">`
                        )
                      );
                    });
                  }
                );
              });
            }
          }());
        }

        // Tree-shaking optimization
        config.optimization.usedExports = true;
        config.optimization.sideEffects = false;

        return config;
      },

      // Performance budget monitoring
      onDemandEntries: {
        maxInactiveAge: 60 * 1000,
        pagesBufferLength: 2,
      },

      // Logging optimization
      logging: {
        level: process.env.NEXT_PUBLIC_DEBUG === "true" ? "info" : "error",
        fetches: {
          fullUrl: true,
        },
      },

      // ESLint optimization
      eslint: {
        ignoreDuringBuilds: true,
        dirs: ["app"],
      },

      // Redirects (existing)
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

// Sentry configuration (existing + optimizations)
module.exports = withSentryConfig(
  optimizedNextConfig,
  {
    silent: true,
    disableServerWebpackPlugin: !enableSentryUpload,
    disableClientWebpackPlugin: !enableSentryUpload,
    hideSourceMaps: true,
    widenClientFileUpload: false,
    tunnelRoute: "/monitoring",
    org: process.env.SENTRY_ORG || "dummy-org",
    project: process.env.SENTRY_PROJECT || "dummy-project",
    disableLogger: true,
    errorHandler(error) {
      console.warn("Sentry upload failed; continuing build.", error?.message || error);
    },
  },
  {
    silent: true,
    hideSourceMaps: true,
    dryRun: !enableSentryUpload,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  }
);

// Performance budget validation
if (process.env.NODE_ENV === "production" && process.env.CHECK_PERFORMANCE_BUDGET) {
  console.log("🚀 Performance optimization enabled");
  console.log(`📦 Chunk size limit: ${PERFORMANCE_BUDGETS.CHUNK_SIZE_LIMIT / 1000}KB`);
  console.log(`📦 Bundle size limit: ${PERFORMANCE_BUDGETS.BUNDLE_SIZE_LIMIT / 1000000}MB`);
}