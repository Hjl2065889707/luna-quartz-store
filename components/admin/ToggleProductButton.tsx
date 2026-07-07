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
      if (!res.ok) throw new Error('操作失败')
      closeDialog()
      router.refresh()
      showToast(isActive ? `${productName} 已下架` : `${productName} 已上架`, 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error')
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
        title={isActive ? '下架' : '上架'}
      >
        {isActive ? <Trash2 size={15} /> : <RotateCcw size={15} />}
      </button>

      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-full max-w-sm rounded-2xl border border-[#DEE3E9] bg-white p-0 shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] backdrop:bg-black/60"
      >
        <div className="p-6">
          {/* Icon */}
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

          {/* Text */}
          <h3 className="text-center text-lg font-bold text-[#1C2B33]">
            {isActive ? '确认下架' : '确认上架'}
          </h3>
          <p className="mt-2 text-center text-sm text-[#5D6C7B]">
            确定要{isActive ? '下架' : '重新上架'}{' '}
            <span className="font-medium text-[#1C2B33]">{productName}</span>{' '}
            吗？
            {isActive && '下架后前台不再展示该商品。'}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={closeDialog}
              className="flex-1 rounded-full border-2 border-[rgba(10,19,23,0.12)] px-5 py-2.5 text-sm font-medium text-[#1C2B33] transition-all hover:bg-[#F1F4F7] active:scale-[0.98]"
            >
              取消
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
                ? '处理中...'
                : isActive
                  ? '确认下架'
                  : '确认上架'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default ToggleProductButton
