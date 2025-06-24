'use client'

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { setAuth } from '../core/axios'
import type { AuthContextType } from '../types/auth.types'

export const AuthContext = createContext<AuthContextType | null>(null)

const AxiosClientProvider = ({
  children,
  initialToken,
}: {
  children: ReactNode
  initialToken?: string
}) => {
  const [token, setToken] = useState<string | undefined>(initialToken)

  useEffect(() => {
    if (token) {
      setAuth(token)
    }
  }, [token])

  const setUserToken = useCallback((newToken?: string) => {
    setToken(newToken)
  }, [])

  const value = {
    token,
    setUserToken,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AxiosClientProvider
