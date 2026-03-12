const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',

  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query', 'recharts'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.gov.rs',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'stats.data.gov.rs',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://data.gov.rs https://stats.data.gov.rs; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dataset/:slug',
        destination: '/datasets/:slug',
        permanent: true,
      },
      {
        source: '/organization/:slug',
        destination: '/organizations/:slug',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/datasets',
          destination: '/api/v1/datasets',
        },
        {
          source: '/api/organizations',
          destination: '/api/v1/organizations',
        },
      ],
    };
  },

  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_DATA_GOV_API_URL ||
      process.env.NEXT_PUBLIC_DATA_GOV_RS_API_URL,
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'sr-Cyrl',
    NEXT_PUBLIC_ENABLE_DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE || 'true',
  },

  webpack: (config) => {
    return config;
  },

  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = withNextIntl(nextConfig);
