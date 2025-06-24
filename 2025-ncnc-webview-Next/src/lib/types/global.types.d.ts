import { AxiosError } from 'axios'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReactNativeWebView: any
  }

  interface Document {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReactNativeWebView: any
  }
}

export interface ErrorResponseData {
  error: string
  description?: string
}

type RequiredMeta = {
  title: string
  message?: string
  pass?: false
}

type QueryMeta = { pass: true } | RequiredMeta

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError<ErrorResponseData>
    queryMeta: QueryMeta
  }
}

/**
 * InfiniteQuery에 사용되는 응답 데이터 형식
 *
 * @param T (required) 배열 형태로 반환되는 데이터 타입
 * @param K (required) 프로퍼티 키
 * @param P (optional) 추가로 반환되는 프로퍼티 타입
 */
export type InfiniteQueryResponse<
  T,
  K extends string,
  P extends Record<string, unknown> = Record<string, unknown>,
> = {
  hasNext: boolean
  limit: number
} & {
  [key in K]: Array<T>
} & P
