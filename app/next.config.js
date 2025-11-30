/** @type {import('next').NextConfig} */
const withMDX = require("@next/mdx")();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["js", "ts", "tsx", "mdx"],
  experimental: {
    // Disable any experimental features that might cause issues
  },
  // Disable webpack optimizations that might cause issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

module.exports = withMDX(nextConfig);