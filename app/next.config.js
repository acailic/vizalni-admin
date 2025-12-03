/**
 * Next.js configuration tuned for the docs and app bundle.
 * Adds MDX + GraphQL loaders and prefers TypeScript sources during resolution.
 */
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
  },
});
const pkg = require("./package.json");
const { defaultLocale, locales } = require("./locales/locales.json");

// Populate build-time variables
process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;
process.env.NEXT_PUBLIC_GITHUB_REPO = pkg.repository.url.replace(
  /(\/|\.git)$/,
  ""
);

module.exports = withMDX({
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  swcMinify: true,
  productionBrowserSourceMaps: false,
  pageExtensions: ["js", "ts", "tsx", "mdx"],
  i18n: {
    locales,
    defaultLocale,
  },
  transpilePackages: ["@mui/lab", "@mui/material"],
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/material": {
      transform: "@mui/material/{{member}}",
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
      "@mui/material/useAutocomplete": require.resolve(
        "@mui/material/node/useAutocomplete/index.js"
      ),
    };

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: require.resolve("graphql-tag/loader"),
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
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  experimental: {
    esmExternals: false,
    optimizeCss: true,
  },
  logging: {
    level: "error",
    fetches: {
      fullUrl: true,
    },
  },
});
