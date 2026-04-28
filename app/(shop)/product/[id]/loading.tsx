import Skeleton from '@/components/Skeleton'
import ProductPageLayout from './ProductPageLayout'

export default function Loading() {
  return (
    <ProductPageLayout
      imageSlot={<Skeleton className="aspect-square w-full rounded-2xl" />}
      infoSlot={
        <div className="flex flex-col justify-center gap-6 py-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-8 border-t border-zinc-100 pt-8">
            <Skeleton className="mb-6 h-4 w-32" />
            <Skeleton className="h-14 w-full rounded-full sm:w-48" />
          </div>
        </div>
      }
    />
  )
}
