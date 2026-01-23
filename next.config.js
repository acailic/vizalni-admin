/**
 * CONSOLIDATED Next.js Configuration for Next.js 15
 * Combines previous root and app/next.config.js into single config
 */

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const { defaultLocale, locales } = require("./app/locales/locales.json");
const pkg = require("./package.json");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isGitHubPages = Boolean(basePath);
const isProduction = process.env.NODE_ENV === "production";

// Populate build-time variables
process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;
process.env.NEXT_PUBLIC_GITHUB_REPO = pkg.repository.url.replace(
  /(\/|\.git)$/,
  ""
);

module.exports = withMDX({
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: isGitHubPages,

  // Disable Turbopack to use webpack with custom loaders
  experimental: {
    turbo: undefined,
  },

  // Static export for GitHub Pages
  output: isProduction && isGitHubPages ? "export" : undefined,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // Required for static export
  },

  i18n: isGitHubPages ? undefined : { locales, defaultLocale },

  productionBrowserSourceMaps: false,
  pageExtensions: ["js", "ts", "tsx", "mdx"],

  // Transpile MUI packages instead of babel-loader hacks
  transpilePackages: [
    "@mui/material",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/utils",
    "@mui/styles",
    "@emotion/react",
    "@emotion/styled",
  ],

  // Modular imports for tree-shaking
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
      skipDefaultConversion: true,
    },
    lodash: {
      transform: "lodash/{{member}}",
    },
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
  },

  webpack(config, { dev, isServer }) {
    // Add conditional resolution for .dev.ts and .prod.ts files
    config.resolve.extensions = Array.from(
      new Set([
        dev ? ".dev.ts" : ".prod.ts",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".mjs",
        ".cjs",
        ".json",
        ".wasm",
        ...(config.resolve.extensions || []),
      ])
    );

    config.resolve.alias = {
      ...config.resolve.alias,
      "mapbox-gl": "maplibre-gl",
      // Fix for @mdx-js/loader compatibility
      "@mdx-js/loader": require.resolve("@mdx-js/loader"),
    };

    // GraphQL files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    if (!dev) {
      config.devtool = false;
    }

    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["app"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  logging: {
    level: "error",
    fetches: {
      fullUrl: true,
    },
  },
});
