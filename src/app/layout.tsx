import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Sidebar, BottomNav } from '@/components/Navigation'
import { EnvBadge } from '@/components/EnvBadge'

export const metadata: Metadata = {
  title: 'Memora — Save & Organize Links',
  description: 'Your personal link & article saving web app. Save, organize, and revisit interesting content from anywhere.',
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
          <div className="app-shell">
            <Sidebar />
            <BottomNav />
            <main className="main-content">
              {children}
            </main>
          </div>
          <EnvBadge />
        </ThemeProvider>
      </body>
    </html>
  )
}
