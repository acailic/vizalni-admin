/**
 * Minimal Next.js Configuration for Build
 * Focus: Reduce memory usage and complete build successfully
 */

const { defaultLocale, locales } = require("./locales/locales.json");
const pkg = require("../package.json");

// Populate build-time variables
process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;
process.env.NEXT_PUBLIC_GITHUB_REPO = pkg.repository.url.replace(
  /(\/|\.git)$/,
  ""
);

const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

module.exports = {
  output: isGitHubPages ? "export" : "standalone",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  i18n: isGitHubPages ? undefined : { locales, defaultLocale },

  // Basic optimizations only
  swcMinify: true,
  productionBrowserSourceMaps: false,

  pageExtensions: ["js", "ts", "tsx", "mdx"],

  // Minimal webpack config
  webpack(config, { dev, isServer }) {
    // Basic React aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "mapbox-gl": "maplibre-gl",
    };

    // Basic fallbacks for browser
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

    return config;
  },

  // Disable eslint during builds
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["app"],
  },

  // Experimental features - minimal set
  experimental: {
    esmExternals: "loose",
    optimizeCss: true,
  },

  // Logging
  logging: {
    level: "error",
    fetches: {
      fullUrl: true,
    },
  },
};
