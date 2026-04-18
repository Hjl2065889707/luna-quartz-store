import Navbar from '@/components/Navbar'
import { CartProvider } from '@/context/CartContext'

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <CartProvider>
      {/* 属于商城专属的头部大吊灯 */}
      <Navbar />
      {/* 商城里所有奇奇怪怪的页面，比如大首页主卧、商品详情次卧，全部插进这里 */}
      <main className="min-h-screen">{children}</main>
    </CartProvider>
  )
}
