import { Inter } from 'next/font/google'

import type { Metadata } from 'next'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Визуелни Администратор Србије | Visual Admin Serbia',
  description: 'Create and embed visualizations from Serbian open government data - Креирајте и уградите визуализације из отворених података владе Србије',
  keywords: 'open data, visualization, Serbia, отворени подаци, визуелизација, Србија, data.gov.rs',
  authors: [{ name: 'Vizuelni Admin Srbije Team' }],
  openGraph: {
    title: 'Визуелни Администратор Србије',
    description: 'Explore and visualize Serbian government open data',
    locale: 'sr_RS',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
