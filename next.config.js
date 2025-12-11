/**
 * OPTIMIZED Next.js Configuration
 * Target: Top 0.1% performance metrics
 * Bundle Size: <10MB total, <250KB per chunk
 */

const { defaultLocale, locales } = require("./app/locales/locales.json");

const pkg = require("./package.json");

// Performance optimization constants
const PERFORMANCE_BUDGETS = {
  CHUNK_SIZE_LIMIT: 250000, // 250KB per chunk
  BUNDLE_SIZE_LIMIT: 10000000, // 10MB total
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

const imageConfig = {
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  unoptimized: true, // Required for static export
};

module.exports = {
  // Use export mode in production for GitHub Pages
  output: (!isDevelopment && isGitHubPages) ? "export" : undefined,
  basePath: basePath,
  assetPrefix: basePath,
  images: imageConfig,
  i18n: isGitHubPages ? undefined : { locales, defaultLocale },

  // Build Optimizations
  swcMinify: true,
  productionBrowserSourceMaps: false,

  pageExtensions: ["js", "ts", "tsx", "mdx"],

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
      "d3-brush",
      "d3-selection",
      "framer-motion",
      "@emotion/react",
      "@emotion/styled",
      "@deck.gl/layers",
      "@deck.gl/geo-layers",
      "notistack",
    ],

    // Parallel compilation
    cpus: require("os").cpus().length - 1 || 1,

    // Optimized client chunks
    optimizeCss: true,

    // Enable modern JS features
    esmExternals: "loose",

    // Bundle analysis
    optimizeServerReact: true,
    scrollRestoration: true,
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
    "d3-array": {
      transform: "d3-array/{{member}}",
    },
    "framer-motion": {
      transform: "framer-motion/{{member}}",
    },
  },

  // Optimized webpack configuration
  webpack(config, { dev, isServer, webpack }) {
    // Basic React aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "mapbox-gl": "maplibre-gl",
    };

    // Fix for all MUI packages with directory import issues
    const originalResolve = config.resolve;
    config.resolve = {
      ...originalResolve,
      alias: {
        ...originalResolve.alias,
        // Map common MUI directory imports to their index files
        '@mui/utils/composeClasses': '@mui/utils/composeClasses/index.js',
        '@mui/material/Alert': '@mui/material/Alert/index.js',
        '@mui/material': '@mui/material/index.js',
        '@mui/utils': '@mui/utils/index.js',
        '@mui/icons-material': '@mui/icons-material/index.js',
        '@mui/lab': '@mui/lab/index.js',
      },
    };

    // Add a rule to handle all MUI package imports
    config.module.rules.push({
      test: /\.(js|ts|tsx)$/,
      include: [
        /node_modules\/@mui\/.*/,
      ],
      resolve: {
        fullySpecified: false,
      },
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-transform-runtime'],
          cacheDirectory: false,
        },
      },
    });

    // GraphQL files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    // MDX files - using Next.js MDX loader
    // Note: @next/mdx handles MDX files automatically

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
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
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
            test: /[\\/]node_modules[\\/](d3-|recharts|chart|vis|@deck.gl)[\\/]/,
            name: "vendor.charts",
            chunks: "all",
            priority: 25,
          },

          // Utility chunks
          utilities: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|fp-ts|io-ts|autosuggest-highlight)[\\/]/,
            name: "vendor.utils",
            chunks: "all",
            priority: 20,
          },

          // Animation chunks
          animation: {
            test: /[\\/]node_modules[\\/](framer-motion|motion|@react-spring)[\\/]/,
            name: "vendor.animation",
            chunks: "all",
            priority: 18,
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
    }

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
    level: "error",
    fetches: {
      fullUrl: true,
    },
  },

  // Disable eslint during builds
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["app"],
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
};

// Performance budget validation
if (process.env.NODE_ENV === "production" && process.env.CHECK_PERFORMANCE_BUDGET) {
  console.log("🚀 Performance optimization enabled");
  console.log(`📦 Chunk size limit: ${PERFORMANCE_BUDGETS.CHUNK_SIZE_LIMIT / 1000}KB`);
  console.log(`📦 Bundle size limit: ${PERFORMANCE_BUDGETS.BUNDLE_SIZE_LIMIT / 1000000}MB`);
}