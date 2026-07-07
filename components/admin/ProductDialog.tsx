'use client'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductFormValues } from '@/lib/schemas/product'
import { useRouter } from 'next/navigation'
import { Plus, Package, Upload, X, Pencil } from 'lucide-react'
import Image from 'next/image'
import {
  uploadImage,
  createProduct,
  updateProduct,
} from '@/api-client/productApi'
import { Product } from '@/types'
import { useToast } from '@/context/ToastContext'

// Discriminated Union：TypeScript 根据 mode 自动推断 product 是否存在
type ProductDialogProps =
  | { mode: 'create' }
  | { mode: 'edit'; product: Product }

const ProductDialog = (props: ProductDialogProps) => {
  const isEdit = props.mode === 'edit'
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { showToast } = useToast()

  // 编辑模式下，初始预览使用现有图片
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    isEdit ? props.product.image : null,
  )
  const [uploadError, setUploadError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: isEdit
      ? {
          name: props.product.name,
          description: props.product.description,
          category: props.product.category,
          price: props.product.price,
          stock: props.product.stock,
        }
      : undefined,
  })

  const openDialog = () => dialogRef.current?.showModal()
  const closeDialog = () => {
    if (!isEdit) {
      reset()
      setPreviewUrl(null)
      setImageFile(null)
    } else {
      // 编辑模式：重置回原始值
      reset()
      setPreviewUrl(props.product.image)
      setImageFile(null)
    }
    setUploadError('')
    dialogRef.current?.close()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError('')
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('仅支持 JPG、PNG、WebP、AVIF 格式')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('文件大小不能超过 5MB')
      return
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data: ProductFormValues) => {
    // 无论创建还是编辑，都必须有图片
    if (!previewUrl && !imageFile) {
      setUploadError('请上传商品图片')
      return
    }

    try {
      // 如果选了新图片就上传，否则保留原图
      let imageUrl = isEdit ? props.product.image : ''
      if (imageFile) {
        const { url } = await uploadImage(imageFile)
        imageUrl = url
      }

      if (isEdit) {
        await updateProduct(props.product.id, { ...data, image: imageUrl })
      } else {
        await createProduct({ ...data, image: imageUrl })
      }

      closeDialog()
      router.refresh()
      showToast(isEdit ? '商品已更新' : '商品已创建', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error')
    }
  }

  const inputClassName =
    'w-full rounded-xl border-2 border-[rgba(10,19,23,0.12)] bg-white px-4 py-2.5 text-sm text-[#1C2B33] outline-none transition-all placeholder:text-[#A0ABB5] focus:border-[#0064E0] focus:shadow-[0_0_0_3px_rgba(0,100,224,0.15)]'

  return (
    <>
      {/* Trigger Button — 创建和编辑样式不同 */}
      {isEdit ? (
        <button
          onClick={openDialog}
          className="rounded-lg p-2 text-[#5D6C7B] transition-colors hover:bg-[#E8F3FF] hover:text-[#0064E0]"
        >
          <Pencil size={15} />
        </button>
      ) : (
        <button
          onClick={openDialog}
          className="flex items-center gap-2 rounded-full bg-[#0064E0] px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(0,100,224,0.3)] transition-all hover:bg-[#0143B5] hover:shadow-[0_6px_20px_rgba(0,100,224,0.4)] active:scale-[0.98]"
        >
          <Plus size={16} />
          新增商品
        </button>
      )}

      {/* Dialog */}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-full max-w-lg rounded-2xl border border-[#DEE3E9] bg-white p-0 shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] backdrop:bg-black/60"
      >
        <div className="max-h-[85vh] overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3FF]">
              <Package size={20} className="text-[#0064E0]" />
            </div>
            <h3 className="text-lg font-bold text-[#1C2B33]">
              {isEdit ? '编辑商品' : '新增商品'}
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]">
                商品图片
              </label>
              {previewUrl ? (
                <div className="relative inline-block">
                  <Image
                    src={previewUrl}
                    alt="预览"
                    width={120}
                    height={120}
                    className="h-28 w-28 rounded-xl border border-[#DEE3E9] object-cover"
                    unoptimized={previewUrl.startsWith('blob:')}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white shadow-md transition-transform hover:scale-110"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-28 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[rgba(10,19,23,0.2)] text-sm text-[#5D6C7B] transition-all hover:border-[#0064E0] hover:bg-[#E8F3FF]/30 hover:text-[#0064E0]"
                >
                  <Upload size={18} />
                  点击上传图片
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploadError && (
                <p className="mt-1 text-xs text-red-600">{uploadError}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]">
                商品名称
              </label>
              <input
                {...register('name')}
                placeholder="输入商品名称"
                className={inputClassName}
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
                className={inputClassName}
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
                  className={inputClassName}
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
                  className={inputClassName}
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
                className={inputClassName}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeDialog}
                className="flex-1 rounded-full border-2 border-[rgba(10,19,23,0.12)] px-5 py-2.5 text-sm font-medium text-[#1C2B33] transition-all hover:bg-[#F1F4F7] active:scale-[0.98]"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-[#0064E0] px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(0,100,224,0.3)] transition-all hover:bg-[#0143B5] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? isEdit
                    ? '保存中...'
                    : '创建中...'
                  : isEdit
                    ? '保存修改'
                    : '确认创建'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default ProductDialog
