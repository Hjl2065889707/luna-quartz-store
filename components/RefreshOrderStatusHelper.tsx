'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const REFRESH_INTERVAL_MS = 2000
const MAX_REFRESH_COUNT = 6

const RefreshOrderStatusHelper = () => {
  const router = useRouter()

  useEffect(() => {
    let refreshCount = 0

    const intervalId = window.setInterval(() => {
      refreshCount += 1
      router.refresh()

      if (refreshCount >= MAX_REFRESH_COUNT) {
        window.clearInterval(intervalId)
      }
    }, REFRESH_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [router])

  return null
}

export default RefreshOrderStatusHelper
