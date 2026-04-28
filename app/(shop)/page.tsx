import { getProducts } from '@/api-client/productApi'
import ItemCell from '@/components/ItemCell'

export default async function Home() {
  const products = await getProducts()
  return (
    // Beautiful subtle gradient background
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-white pt-10 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header / Hero Section */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
            探索今日好物
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            我们精心为你挑选了兼具美学与实用的优质单品。把生活过得更具仪式感吧。
          </p>
        </div>
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((item) => {
            return <ItemCell item={item} key={item.id} />
          })}
        </div>
      </div>
    </div>
  )
}
