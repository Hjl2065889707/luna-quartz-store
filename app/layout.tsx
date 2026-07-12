import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { siteConfig } from '@/lib/site'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: `${siteConfig.name} | Crystal Store Demo`,
    description: siteConfig.description,
    path: '/',
  }),
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Crystal Store Demo`,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
