import '../styles/fonts.css'
import '../styles/globals.css'

import { setAuth } from '@/lib/core/axios'
import {
  AxiosClientProvider,
  ClientPortalProvider,
  ReactQueryProvider,
  WebViewMessageProvider,
} from '@/lib/registry'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Provider as JotaiProvider } from 'jotai'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

export const metadata: Metadata = {
  title: '니콘내콘 트러블',
  description: 'ncnc-trouble',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const cookieStore = await cookies()
  const ssrToken = cookieStore.get('x-auth-token')?.value

  if (ssrToken) {
    setAuth(ssrToken)
  }

  return (
    <html lang="ko">
      <body className="h-screen flex flex-col">
        <ReactQueryProvider>
          <JotaiProvider>
            <ClientPortalProvider>
              <WebViewMessageProvider>
                <AxiosClientProvider initialToken={ssrToken}>
                  <main className="flex flex-col w-full h-full pt-2">
                    {children}
                  </main>
                </AxiosClientProvider>
              </WebViewMessageProvider>
            </ClientPortalProvider>
          </JotaiProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
