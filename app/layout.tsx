import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'HLC Academy - Master Trading with Neuroscience',
  description: 'Trade with a clearer brain. Neuroscience-led training for institutional-grade decisions. Join 5,000+ traders learning institutional supply & demand.',
  keywords: 'trading psychology, institutional supply and demand, trader bias, spaced repetition, trade journaling, neuroscience trading',
  openGraph: {
    title: 'HLC Academy - Master Trading with Neuroscience',
    description: 'Trade with a clearer brain. Neuroscience-led training for institutional-grade decisions.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
