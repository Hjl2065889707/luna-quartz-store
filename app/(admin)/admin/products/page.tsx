import { getAllProducts } from '@/api-client/productApi.server'
import Image from 'next/image'
import { Plus, Pencil } from 'lucide-react'
import ToggleProductButton from '@/components/admin/ToggleProductButton'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B33]">商品管理</h1>
          <p className="mt-1 text-sm text-[#5D6C7B]">
            共 {products.length} 件商品
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[#0064E0] px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(0,100,224,0.3)] transition-all hover:bg-[#0143B5] hover:shadow-[0_6px_20px_rgba(0,100,224,0.4)] active:scale-[0.98]">
          <Plus size={16} />
          新增商品
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-[#DEE3E9] bg-white shadow-[0_2px_4px_0_rgba(0,0,0,0.04)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#DEE3E9] bg-[#F7F8FA]">
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                商品
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                分类
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                价格
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                库存
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                状态
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DEE3E9]">
            {products.map((product) => (
              <tr
                key={product.id}
                className={`transition-colors hover:bg-[#F7F8FA] ${
                  !product.isActive ? 'opacity-60' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-[#F1F4F7]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-[#1C2B33]">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-[#F1F4F7] px-2.5 py-1 text-xs font-medium text-[#5D6C7B]">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-[#1C2B33]">
                  ${product.price}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-medium ${product.stock > 20 ? 'text-emerald-600' : product.stock > 5 ? 'text-amber-600' : 'text-red-600'}`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      product.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {product.isActive ? '上架中' : '已下架'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-[#5D6C7B] transition-colors hover:bg-[#E8F3FF] hover:text-[#0064E0]">
                      <Pencil size={15} />
                    </button>
                    <ToggleProductButton
                      id={product.id}
                      productName={product.name}
                      isActive={product.isActive}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
