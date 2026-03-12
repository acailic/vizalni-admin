import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_TITLE || 'Vizuelni Admin Srbije',
    template: `%s | Vizuelni Admin Srbije`,
  },
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Модерна платформа за визуелизацију и анализу отворених података Републике Србије',
  keywords: process.env.NEXT_PUBLIC_SITE_KEYWORDS || 'отворени подаци, Србија, визуелизација, data.gov.rs',
  authors: [{ name: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Vizuelni Admin Srbije Team' }],
  creator: 'Vizuelni Admin Srbije',
  publisher: 'Vizuelni Admin Srbije',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    alternateLocale: ['sr_RS', 'en_US'],
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Vizuelni Admin Srbije',
    title: 'Vizuelni Admin Srbije - Отворени подаци Републике Србије',
    description: 'Модерна платформа за визуелизацију и анализу отворених података Републике Србије',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vizuelni Admin Srbije',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Vizuelni Admin Srbije - Отворени подаци Републике Србије',
    description: 'Модерна платформа за визуелизацију и анализу отворених података Републике Србије',
    images: ['/twitter-image.png'],
    creator: '@vizuelniadmin',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#2196f3',
      },
    ],
  },

  // Manifest
  manifest: '/site.webmanifest',

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'google-site-verification-code',
    // Add other verification codes as needed
  },

  // Other
  category: 'Open Data Platform',
  classification: 'Government Data Visualization',
  referrer: 'origin-when-cross-origin',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
};
