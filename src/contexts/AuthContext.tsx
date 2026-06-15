import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface AuthContextValue {
  isAuthenticated: boolean
  role: 'admin'
  isConfigured: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim() ?? ''

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    role: 'admin',
    isConfigured: adminPassword.length > 0,
    login: (password: string) => {
      const isValid = adminPassword.length > 0 && password === adminPassword
      setIsAuthenticated(isValid)
      return isValid
    },
    logout: () => setIsAuthenticated(false),
  }), [isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  }

  return context
}
