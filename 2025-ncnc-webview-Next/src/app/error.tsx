'use client'

import { useWebViewMessage } from '@/lib/hooks/useWebViewMessage'
import { useState } from 'react'

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  const { postMessage } = useWebViewMessage()
  const [isResetting, setIsResetting] = useState(false)

  const onClickHomeButton = () => {
    postMessage('goBack')
  }

  const onClickRetry = () => {
    setIsResetting(true)

    setTimeout(() => {
      reset()
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-800 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
        <h2 className="text-headline-24-bold mb-4 animate-pulse">
          ⚠️ 오류가 발생했어요
        </h2>
        <p className="text-body-16-regular mb-6 text-gray-600">
          {`에러: ${error.message}` || '알 수 없는 오류'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onClickRetry}
            className="px-4 py-2 border-2 border-red-300 text-red-600 text-subtitle-16-medium rounded-full hover:bg-red-100 transition duration-300"
          >
            {isResetting ? '재시도 중...' : '다시 시도하기'}
          </button>

          <button
            type="button"
            onClick={onClickHomeButton}
            className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-subtitle-16-medium rounded-full transition duration-300"
          >
            🏠 홈으로 돌아가기
          </button>
        </div>
      </div>

      {isResetting && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default Error
