/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WebViewPayload {
  type: string
  option: any
}

export const postMessage = (type: string, option: any = null): void => {
  const payload: WebViewPayload = {
    type,
    option,
  }

  if (typeof window !== 'undefined' && window?.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload))
  } else if (typeof window !== 'undefined') {
    window.postMessage(JSON.stringify(payload))
  }
}
