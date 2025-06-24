import { useContext } from 'react'
import { WebViewMessageContext } from '../registry/WebViewMessageProvider'
import type { WebViewMessageContextType } from '../types/webview-message.types'

// * WebViewMessageProvider.tsx 참조
export const useWebViewMessage = (): WebViewMessageContextType => {
  const context = useContext(WebViewMessageContext)

  if (!context) {
    throw new Error(
      'useWebViewMessage는 WebViewMessageProvider 내에서만 사용할 수 있습니다',
    )
  }

  return context
}
