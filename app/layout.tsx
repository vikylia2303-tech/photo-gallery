import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Photo Gallery',
  description: 'Professional photo portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-cream text-dark">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
