import Navbar from '@/components/Navbar'
import { CartProvider } from '@/context/CartContext'

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </CartProvider>
  )
}
