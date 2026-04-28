'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CheckoutPage() {
  const { cartState } = useCart()
  const router = useRouter()

  // 工业级防御：如果用户清空了购物车还强行手敲 URL 进这个页面，就踢回首页
  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push('/')
    }
  }, [cartState.items.length, router])

  if (cartState.items.length === 0) return null

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-3xl font-black text-zinc-900">安全结算</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* 左侧：配送信息表单 (占 7 列) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-zinc-900">配送地址</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    名字
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 transition-all outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    姓氏
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 transition-all outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  详细地址
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 transition-all outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  联系电话
                </label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 transition-all outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </form>
          </div>
        </div>

        {/* 右侧：订单摘要 (占 5 列) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-zinc-900">订单摘要</h2>

            {/* 商品列表 */}
            <div className="custom-scrollbar mb-6 max-h-[40vh] space-y-4 overflow-y-auto pr-2">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {/* 右上角数量角标 */}
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white ring-2 ring-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="line-clamp-2 text-sm font-bold text-zinc-900">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-sm font-black text-zinc-900">
                      ¥{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 价格统计 */}
            <div className="space-y-3 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
              <div className="flex justify-between">
                <span>商品总计</span>
                <span className="font-medium text-zinc-900">
                  ¥{cartState.totalAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>预计运费</span>
                <span className="font-medium text-zinc-900">免运费</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-black text-zinc-900">
                <span>应付总额</span>
                <span className="text-xl text-zinc-900">
                  ¥{cartState.totalAmount}
                </span>
              </div>
            </div>

            <button className="mt-8 w-full rounded-xl bg-zinc-900 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-zinc-800 active:scale-[0.98]">
              确认并支付
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
