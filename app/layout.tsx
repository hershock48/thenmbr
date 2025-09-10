import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/AuthContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'NMBR Platform - Turn Stories Into Revenue',
    template: '%s | NMBR Platform'
  },
  description: 'The complete story-driven commerce platform that combines storytelling, multi-channel communications, and e-commerce to turn your impact stories into sustainable revenue streams. Perfect for nonprofits, businesses, and social enterprises.',
  keywords: [
    'storytelling platform',
    'social commerce',
    'nonprofit fundraising',
    'impact stories',
    'revenue attribution',
    'story-driven marketing',
    'social enterprise',
    'cause marketing',
    'digital storytelling',
    'commerce platform'
  ],
  authors: [{ name: 'NMBR Platform Team' }],
  creator: 'NMBR Platform',
  publisher: 'NMBR Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.thenmbr.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.thenmbr.com',
    title: 'NMBR Platform - Turn Stories Into Revenue',
    description: 'The complete story-driven commerce platform that combines storytelling, multi-channel communications, and e-commerce to turn your impact stories into sustainable revenue streams.',
    siteName: 'NMBR Platform',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NMBR Platform - Turn Stories Into Revenue',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NMBR Platform - Turn Stories Into Revenue',
    description: 'The complete story-driven commerce platform that combines storytelling, multi-channel communications, and e-commerce to turn your impact stories into sustainable revenue streams.',
    images: ['/og-image.jpg'],
    creator: '@thenmbr',
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <SubscriptionProvider>
            {children}
          </SubscriptionProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
