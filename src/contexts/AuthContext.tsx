import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { resolveAccessProfile } from '../config/accessControl'
import { auth, isFirebaseConfigured } from '../services/firebase'
import type { AccessProfile, AuthRole } from '../types'

interface AuthContextValue {
  user: User | null
  role: AuthRole | null
  accessProfile: AccessProfile | null
  loading: boolean
  isConfigured: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

async function getAccessProfile(user: User) {
  const tokenResult = await user.getIdTokenResult()
  return resolveAccessProfile({
    email: user.email,
    claims: tokenResult.claims,
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessProfile, setAccessProfile] = useState<AccessProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (!currentUser) {
        setAccessProfile(null)
        setLoading(false)
        return
      }

      try {
        setAccessProfile(await getAccessProfile(currentUser))
      } catch (error) {
        console.error('Não foi possível obter o papel do usuário.', error)
        setAccessProfile({ role: 'corretor', source: 'default' })
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    role: accessProfile?.role ?? null,
    accessProfile,
    loading,
    isConfigured: isFirebaseConfigured,
    signInWithGoogle: async () => {
      if (!isFirebaseConfigured) {
        throw new Error('Firebase não configurado. Preencha as variáveis VITE_FIREBASE_* no arquivo .env.')
      }
      await signInWithPopup(auth, googleProvider)
    },
    signOut: () => firebaseSignOut(auth),
  }), [accessProfile, loading, user])

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
