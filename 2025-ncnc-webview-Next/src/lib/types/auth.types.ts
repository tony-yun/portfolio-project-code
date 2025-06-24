export interface AuthContextType {
  token?: string
  setUserToken: (token: string | undefined) => void
  isAuthenticated: boolean
}
