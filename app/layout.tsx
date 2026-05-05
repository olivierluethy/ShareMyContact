import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg', // Pfad zum public-Ordner
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL('https://sharemycontact.com'),
  title: {
    default: 'ShareMyContact - Privacy-First Digital Contact Sharing',
    template: '%s | ShareMyContact',
  },
  description:
    'The simplest way to share your contact information. No accounts, no apps, no profiles. Create a beautiful QR code and shareable link instantly. Privacy-first, zero-knowledge architecture.',
  keywords: [
    'digital business card',
    'QR contact sharing',
    'privacy first',
    'vcard',
    'contact sharing',
    'QR code generator',
    'networking',
  ],
  alternates: {
    canonical: 'https://sharemycontact.com',
  },
  openGraph: {
    title: 'ShareMyContact - Privacy-First Digital Contact Sharing',
    description:
      'Create a beautiful QR code and shareable link for your contact info. No accounts, no apps, zero server storage.',
    type: 'website',
    url: 'https://sharemycontact.com',
    siteName: 'ShareMyContact',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1c2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <GoogleAnalytics gaId="G-FJ60QSS8VW" />
      </body>
    </html>
  )
}
