'use client'

import { useWebViewMessage } from '@/lib/hooks/useWebViewMessage'

const NotFound = () => {
  const { postMessage } = useWebViewMessage()

  const onClickHomeButton = () => {
    postMessage('goBack')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-blue-400 animate-pulse">
          404
        </h1>
        <p className="text-subtitle-16-medium mb-6">
          올바르지 않은 접근입니다.
        </p>
        <button
          onClick={onClickHomeButton}
          className="px-6 py-4 rounded-full bg-blue-600 hover:bg-blue-500 transition duration-300"
        >
          <span className="text-subtitle-14-medium">🏠 홈으로 돌아가기</span>
        </button>
      </div>
    </div>
  )
}

export default NotFound
