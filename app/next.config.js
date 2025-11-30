const withPreconstruct = require("@preconstruct/next");

const nextConfig = withPreconstruct({
  // Minimal configuration for testing
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig;