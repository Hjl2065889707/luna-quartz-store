'use client'

import { Trash2, AlertTriangle, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useToast } from '@/context/ToastContext'

const ToggleProductButton = ({
  id,
  productName,
  isActive,
}: {
  id: string
  productName: string
  isActive: boolean
}) => {
  const router = useRouter()
  const { showToast } = useToast()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openDialog = () => dialogRef.current?.showModal()
  const closeDialog = () => dialogRef.current?.close()

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (!res.ok) throw new Error('Action failed')
      closeDialog()
      router.refresh()
      showToast(
        isActive ? `${productName} is now inactive` : `${productName} is now active`,
        'success',
      )
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Action failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={openDialog}
        className={`rounded-lg p-2 transition-colors ${
          isActive
            ? 'text-[#5D6C7B] hover:bg-red-50 hover:text-red-600'
            : 'text-[#5D6C7B] hover:bg-emerald-50 hover:text-emerald-600'
        }`}
        title={isActive ? 'Deactivate' : 'Reactivate'}
      >
        {isActive ? <Trash2 size={15} /> : <RotateCcw size={15} />}
      </button>

      <dialog
        ref={dialogRef}
        className="fixed inset-x-4 inset-y-6 m-auto w-auto max-w-sm rounded-3xl border border-[#E8E1D8] bg-white p-0 shadow-[0_24px_70px_rgba(74,50,39,0.20)] backdrop:bg-black/60 sm:inset-0 sm:w-full"
      >
        <div className="p-6">
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isActive ? 'bg-red-50' : 'bg-emerald-50'
            }`}
          >
            {isActive ? (
              <AlertTriangle size={24} className="text-red-600" />
            ) : (
              <RotateCcw size={24} className="text-emerald-600" />
            )}
          </div>

          <h3 className="text-center text-lg font-bold text-[#2F2523]">
            {isActive ? 'Deactivate product?' : 'Reactivate product?'}
          </h3>
          <p className="mt-2 text-center text-sm text-[#7B6D66]">
            {isActive ? 'This will hide ' : 'This will restore '}
            <span className="font-medium text-[#2F2523]">{productName}</span>
            {isActive
              ? ' from the public storefront.'
              : ' to the public storefront.'}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={closeDialog}
              className="flex-1 rounded-full border border-[#E8E1D8] px-5 py-2.5 text-sm font-medium text-[#2F2523] transition-all hover:bg-[#F4EEE6] active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isLoading
                ? 'Updating...'
                : isActive
                  ? 'Deactivate'
                  : 'Reactivate'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default ToggleProductButton
