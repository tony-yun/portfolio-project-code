import { useContext } from 'react'
import { AuthContext } from '../registry/AxiosClientProvider'
import type { AuthContextType } from '../types/auth.types'

// * AxiosClientProvider.tsx 참조
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
