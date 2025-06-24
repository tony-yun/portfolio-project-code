'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const usePreventBack = (callback: () => void) => {
  const router = useRouter()

  useEffect(() => {
    const handler = () => {
      callback()
    }

    window.history.pushState(null, '', location.href)
    window.addEventListener('popstate', handler)

    return () => window.removeEventListener('popstate', handler)
  }, [router, callback])
}
