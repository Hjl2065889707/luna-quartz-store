import { getAllProducts } from '@/api-client/productApi.server'
import Image from 'next/image'
import ToggleProductButton from '@/components/admin/ToggleProductButton'
import ProductDialog from '@/components/admin/ProductDialog'
import { formatCurrency } from '@/lib/formatters'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#2F2523]">Products</h1>
          <p className="mt-2 text-sm text-[#7B6D66]">
            {products.length} products in the catalogue
          </p>
        </div>
        <ProductDialog mode="create" />
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#E8E1D8] bg-white shadow-[0_12px_30px_rgba(74,50,39,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-[780px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E8E1D8] bg-[#FBF7F1]">
                <th className="px-6 py-3.5 text-xs font-bold tracking-wider text-[#7B6D66] uppercase">
                  Product
                </th>
                <th className="px-6 py-3.5 text-xs font-bold tracking-wider text-[#7B6D66] uppercase">
                  Category
                </th>
                <th className="px-6 py-3.5 text-xs font-bold tracking-wider text-[#7B6D66] uppercase">
                  Price
                </th>
                <th className="px-6 py-3.5 text-xs font-bold tracking-wider text-[#7B6D66] uppercase">
                  Stock
                </th>
                <th className="px-6 py-3.5 text-xs font-bold tracking-wider text-[#7B6D66] uppercase">
                  Status
                </th>
                <th className="px-6 py-3.5 text-xs font-bold tracking-wider text-[#7B6D66] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D8]">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`transition-colors hover:bg-[#FBF7F1] ${
                    !product.isActive ? 'opacity-60' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-xl bg-[#F4EEE6]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-[#2F2523]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-[#F4EEE6] px-2.5 py-1 text-xs font-medium text-[#7B6D66]">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#2F2523]">
                    {formatCurrency(product.price)}
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
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ProductDialog mode="edit" product={product} />
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
    </div>
  )
}
