import { AppComponent } from '@components/common'
import { ThemeProvider } from '@emotion/react'
import theme from '@styles/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import React from 'react'
import { RecoilEnv, RecoilRoot } from 'recoil'
import '../styles/globals.css'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
  }

  return (
    <RecoilRoot>
      <React.Suspense fallback={<p>...Loading</p>}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, user-scalable=no"
          />
        </Head>
        <QueryClientProvider client={queryClient}>
          <Script
            src={process.env.NEXT_PUBLIC_MOBILE_PAY_JS_SCRIPT_URL}
            strategy="afterInteractive"
            onError={(e) => {
              alert(e)
            }}
          />
          <ThemeProvider theme={theme}>
            <AppComponent Component={Component} {...pageProps} />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </React.Suspense>
    </RecoilRoot>
  )
}

export default App
