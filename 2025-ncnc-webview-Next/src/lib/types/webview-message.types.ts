/* eslint-disable @typescript-eslint/no-explicit-any */

import type { WebViewPayload } from '../helper/webview-messages-helper'

export interface WebViewMessageContextType {
  messages: WebViewPayload[]
  postMessage: (type: string, option?: any) => void
}
