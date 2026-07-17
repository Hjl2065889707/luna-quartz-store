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

type ProductDialogProps =
  | { mode: 'create' }
  | { mode: 'edit'; product: Product }

const ProductDialog = (props: ProductDialogProps) => {
  const isEdit = props.mode === 'edit'
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { showToast } = useToast()

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
      setUploadError('Only JPG, PNG, WebP and AVIF files are supported')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be under 5MB')
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
    if (!previewUrl && !imageFile) {
      setUploadError('Please upload a product image')
      return
    }

    try {
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
      showToast(isEdit ? 'Product updated' : 'Product created', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Action failed', 'error')
    }
  }

  const inputClassName =
    'w-full rounded-2xl border border-[#E8E1D8] bg-white px-4 py-2.5 text-sm text-[#2F2523] outline-none transition-all placeholder:text-[#B9AAA2] focus:border-[#B76E79] focus:shadow-[0_0_0_3px_rgba(183,110,121,0.16)]'

  return (
    <>
      {isEdit ? (
        <button
          onClick={openDialog}
          className="rounded-lg p-2 text-[#7B6D66] transition-colors hover:bg-[#F4EEE6] hover:text-[#8F4F5B]"
        >
          <Pencil size={15} />
        </button>
      ) : (
        <button
          onClick={openDialog}
          className="flex items-center gap-2 rounded-full bg-[#2F2523] px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_22px_rgba(74,50,39,0.18)] transition-all hover:bg-[#4A3732] active:scale-[0.98]"
        >
          <Plus size={16} />
          Add product
        </button>
      )}

      {/* Dialog */}
      <dialog
        ref={dialogRef}
        className="fixed inset-x-4 inset-y-6 m-auto w-auto max-w-lg rounded-3xl border border-[#E8E1D8] bg-white p-0 shadow-[0_24px_70px_rgba(74,50,39,0.20)] backdrop:bg-black/60 sm:inset-0 sm:w-full"
      >
        <div className="max-h-[85vh] overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9D8DC]">
              <Package size={20} className="text-[#8F4F5B]" />
            </div>
            <h3 className="text-lg font-bold text-[#2F2523]">
              {isEdit ? 'Edit product' : 'Add product'}
            </h3>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => handleSubmit(onSubmit)(e)}
            className="space-y-4"
          >
            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#2F2523]">
                Product image
              </label>
              {previewUrl ? (
                <div className="relative inline-block">
                  <Image
                    src={previewUrl}
                    alt="Product image preview"
                    width={120}
                    height={120}
                    className="h-28 w-28 rounded-xl border border-[#DEE3E9] object-cover"
                    unoptimized={previewUrl.startsWith('blob:')}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white shadow-md transition-transform hover:scale-110"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-28 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D8CBBF] text-sm text-[#7B6D66] transition-all hover:border-[#B76E79] hover:bg-[#FBF7F1] hover:text-[#8F4F5B]"
                >
                  <Upload size={18} />
                  Upload image
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
              <label className="mb-1.5 block text-sm font-medium text-[#2F2523]">
                Product name
              </label>
              <input
                {...register('name')}
                placeholder="Enter product name"
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
              <label className="mb-1.5 block text-sm font-medium text-[#2F2523]">
                Description
              </label>
              <input
                {...register('description')}
                placeholder="Enter product description"
                className={inputClassName}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category & Price Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2F2523]">
                  Category
                </label>
                <input
                  {...register('category')}
                  placeholder="e.g. Bracelets"
                  className={inputClassName}
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2F2523]">
                  Price
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
              <label className="mb-1.5 block text-sm font-medium text-[#2F2523]">
                Stock
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
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={closeDialog}
                className="flex-1 rounded-full border border-[#E8E1D8] px-5 py-2.5 text-sm font-medium text-[#2F2523] transition-all hover:bg-[#F4EEE6] active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-[#2F2523] px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_22px_rgba(74,50,39,0.18)] transition-all hover:bg-[#4A3732] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? isEdit
                    ? 'Saving...'
                    : 'Creating...'
                  : isEdit
                    ? 'Save changes'
                    : 'Create product'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default ProductDialog
