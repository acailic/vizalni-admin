/** @type {import('next').NextConfig} */
const withMDX = require("@next/mdx")();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["js", "ts", "tsx", "mdx"],
  experimental: {
    // Disable any experimental features that might cause issues
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["en", "sr-Latn", "sr-Cyrl"],
    defaultLocale: "en",
  },
  // Disable webpack optimizations that might cause issues
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    // Configure module resolution for environment-specific files
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/graphql/devtools': dev
        ? require.resolve('./graphql/devtools.dev')
        : require.resolve('./graphql/devtools.prod'),
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
