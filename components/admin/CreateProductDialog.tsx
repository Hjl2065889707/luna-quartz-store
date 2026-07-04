'use client'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductFormValues } from '@/lib/schemas/product'
import { useRouter } from 'next/navigation'
import { Plus, Package } from 'lucide-react'

const CreateProductDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openDialog = () => dialogRef.current?.showModal()
  const closeDialog = () => dialogRef.current?.close()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  })

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('创建失败')
      reset()
      closeDialog()
      router.refresh()
    } catch (error) {
      console.error('创建商品失败', error)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openDialog}
        className="flex items-center gap-2 rounded-full bg-[#0064E0] px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(0,100,224,0.3)] transition-all hover:bg-[#0143B5] hover:shadow-[0_6px_20px_rgba(0,100,224,0.4)] active:scale-[0.98]"
      >
        <Plus size={16} />
        新增商品
      </button>

      {/* Dialog */}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-full max-w-lg rounded-2xl border border-[#DEE3E9] bg-white p-0 shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] backdrop:bg-black/60"
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3FF]">
              <Package size={20} className="text-[#0064E0]" />
            </div>
            <h3 className="text-lg font-bold text-[#1C2B33]">新增商品</h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]">
                商品名称
              </label>
              <input
                {...register('name')}
                placeholder="输入商品名称"
                className="w-full rounded-xl border-2 border-[rgba(10,19,23,0.12)] bg-white px-4 py-2.5 text-sm text-[#1C2B33] outline-none transition-all placeholder:text-[#A0ABB5] focus:border-[#0064E0] focus:shadow-[0_0_0_3px_rgba(0,100,224,0.15)]"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]">
                商品描述
              </label>
              <input
                {...register('description')}
                placeholder="输入商品描述"
                className="w-full rounded-xl border-2 border-[rgba(10,19,23,0.12)] bg-white px-4 py-2.5 text-sm text-[#1C2B33] outline-none transition-all placeholder:text-[#A0ABB5] focus:border-[#0064E0] focus:shadow-[0_0_0_3px_rgba(0,100,224,0.15)]"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category & Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]">
                  分类
                </label>
                <input
                  {...register('category')}
                  placeholder="如: Headphones"
                  className="w-full rounded-xl border-2 border-[rgba(10,19,23,0.12)] bg-white px-4 py-2.5 text-sm text-[#1C2B33] outline-none transition-all placeholder:text-[#A0ABB5] focus:border-[#0064E0] focus:shadow-[0_0_0_3px_rgba(0,100,224,0.15)]"
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]">
                  价格
                </label>
                <input
                  {...register('price')}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-xl border-2 border-[rgba(10,19,23,0.12)] bg-white px-4 py-2.5 text-sm text-[#1C2B33] outline-none transition-all placeholder:text-[#A0ABB5] focus:border-[#0064E0] focus:shadow-[0_0_0_3px_rgba(0,100,224,0.15)]"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]">
                库存
              </label>
              <input
                {...register('stock')}
                type="number"
                placeholder="0"
                className="w-full rounded-xl border-2 border-[rgba(10,19,23,0.12)] bg-white px-4 py-2.5 text-sm text-[#1C2B33] outline-none transition-all placeholder:text-[#A0ABB5] focus:border-[#0064E0] focus:shadow-[0_0_0_3px_rgba(0,100,224,0.15)]"
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]">
                图片地址
              </label>
              <input
                {...register('image')}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border-2 border-[rgba(10,19,23,0.12)] bg-white px-4 py-2.5 text-sm text-[#1C2B33] outline-none transition-all placeholder:text-[#A0ABB5] focus:border-[#0064E0] focus:shadow-[0_0_0_3px_rgba(0,100,224,0.15)]"
              />
              {errors.image && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  reset()
                  closeDialog()
                }}
                className="flex-1 rounded-full border-2 border-[rgba(10,19,23,0.12)] px-5 py-2.5 text-sm font-medium text-[#1C2B33] transition-all hover:bg-[#F1F4F7] active:scale-[0.98]"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-[#0064E0] px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(0,100,224,0.3)] transition-all hover:bg-[#0143B5] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? '创建中...' : '确认创建'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default CreateProductDialog
