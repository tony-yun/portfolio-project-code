'use client'

import { createContext, useEffect, useState, type ReactNode } from 'react'
import {
  postMessage,
  type WebViewPayload,
} from '../helper/webview-messages-helper'
import type { WebViewMessageContextType } from '../types/webview-message.types'

export const WebViewMessageContext =
  createContext<WebViewMessageContextType | null>(null)

const WebViewMessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<WebViewPayload[]>([])

  useEffect(() => {
    const handleMessage = (event: MessageEvent): void => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data

        if (data && typeof data.type === 'string') {
          setMessages((prev) => [...prev, data])
        }
      } catch (error) {
        console.error('메시지 처리 오류:', error)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <WebViewMessageContext.Provider
      value={{
        messages,
        postMessage,
      }}
    >
      {children}
    </WebViewMessageContext.Provider>
  )
}

export default WebViewMessageProvider
