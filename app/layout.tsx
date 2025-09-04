import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HLC Academy - Master Institutional Supply & Demand Trading',
  description: 'Transform your trading psychology with neuroscience-backed learning. Join 2,400+ traders who\'ve achieved consistent profits through institutional-grade decision making and bias-free execution.',
  keywords: 'trading psychology, institutional supply and demand, trader bias, spaced repetition, trade journaling, neuroscience trading',
  authors: [{ name: 'HLC Academy' }],
  creator: 'HLC Academy',
  publisher: 'HLC Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hlcacademy.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HLC Academy - Master Institutional Supply & Demand Trading',
    description: 'Transform your trading psychology with neuroscience-backed learning. Join 2,400+ traders who\'ve achieved consistent profits.',
    url: 'https://hlcacademy.co.uk',
    siteName: 'HLC Academy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HLC Academy - Master Institutional Supply & Demand Trading',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HLC Academy - Master Institutional Supply & Demand Trading',
    description: 'Transform your trading psychology with neuroscience-backed learning. Join 2,400+ traders who\'ve achieved consistent profits.',
    images: ['/og-image.jpg'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
