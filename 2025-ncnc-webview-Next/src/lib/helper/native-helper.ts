/* eslint-disable @typescript-eslint/no-explicit-any */
import { postMessage } from './webview-messages-helper'

export const nativeLog = (message: any): void => {
  postMessage('log', {
    message: JSON.stringify(message, undefined, 2),
  })
}

export const nativeEvent = (eventName: string, data?: any): void => {
  postMessage('event', { eventName, data })
}
