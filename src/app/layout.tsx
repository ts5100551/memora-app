import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { EnvBadge } from '@/components/EnvBadge'

export const metadata: Metadata = {
  title: 'Memora — Save & Organize Links',
  description: 'Your personal link & article saving web app. Save, organize, and revisit interesting content from anywhere.',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0D9488',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {/* AuthProvider handles app shell (nav) and route protection */}
          <AuthProvider>
            {children}
          </AuthProvider>
          <EnvBadge />
        </ThemeProvider>
      </body>
    </html>
  )
}
