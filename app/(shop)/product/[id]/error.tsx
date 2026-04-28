'use client' // 必须是客户端组件！

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 工业级应用里，这里可以接入 Sentry 等日志系统上报错误
    console.error('页面渲染崩溃:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="mb-6 h-12 w-12 text-red-500" />
      <h2 className="mb-4 text-2xl font-bold text-zinc-900">
        糟糕，加载页面时出现了一点小问题
      </h2>
      <p className="mb-8 max-w-md text-zinc-500">
        可能是网络不稳定或服务器开了个小差。请稍后重试。
      </p>

      {/* reset() 函数会尝试重新渲染触发错误的路由组件 */}
      <button
        onClick={() => reset()}
        className="rounded-full bg-zinc-900 px-8 py-3 font-bold text-white transition-all hover:bg-zinc-800"
      >
        重新尝试
      </button>
    </div>
  )
}
