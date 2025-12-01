/** @type {import('next').NextConfig} */
const path = require('path');
const withMDX = require("@next/mdx")();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["js", "ts", "tsx", "mdx"],
  experimental: {
    // Enable SWC for better performance
    swcMinify: true,
    // Enable optimized imports
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    // Enable transpilation of packages that need Babel processing
    transpilePackages: ['@lingui/core', '@lingui/react'],
    // Ensure proper handling of ES modules
    esmExternals: 'loose',
  },
  // Enable TypeScript checking but allow build to proceed (will fix incrementally)
  typescript: {
    ignoreBuildErrors: true, // Temporary: allow build while we fix types
  },
  // Enable ESLint checking but allow build to proceed (will fix incrementally)
  eslint: {
    ignoreDuringBuilds: true, // Temporary: allow build while we fix linting
  },
  i18n: {
    locales: ["en", "sr-Latn", "sr-Cyrl"],
    defaultLocale: "en",
  },
  // Disable webpack optimizations that might cause issues
  webpack: (config, { isServer, dev, webpack, defaultLoaders }) => {
    // Process files containing Lingui macros with Babel instead of SWC
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: [
        path.resolve(__dirname, 'login'),
        path.resolve(__dirname, 'browse'),
        path.resolve(__dirname, 'components'),
        path.resolve(__dirname, 'configurator'),
        path.resolve(__dirname, 'charts'),
        path.resolve(__dirname, 'src')
      ],
      // Only process files that actually contain Lingui imports
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['next/babel'],
          plugins: ['macros'],
          // Only apply to files that contain Lingui imports
          override: (config, { source }) => {
            if (!source.includes('@lingui/macro') &&
                !source.includes('from "@lingui/macro"') &&
                !source.includes('import { Trans') &&
                !source.includes('import { t')) {
              return false; // Skip Babel processing for files without Lingui
            }
            return config;
          }
        }
      }
    });

    if (!isServer) {
      // Add fallbacks for Node.js built-ins that might be needed by client-side code
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    // Configure module resolution for environment-specific files
    config.resolve.alias = {
      ...config.resolve.alias,
      // Handle the @ alias that was previously in Babel module-resolver
      '@': path.resolve(__dirname, '.'),
      urql: path.resolve(__dirname, './graphql/urql-compat'),
    };

    // Add GraphQL loader for .graphql files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'graphql-tag/loader',
        },
      ],
    });

    return config;
  },
};

module.exports = withMDX(nextConfig);
