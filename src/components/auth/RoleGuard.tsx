import type { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { AuthRole } from '../../types'

interface RoleGuardProps {
  allowedRoles: AuthRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { role } = useAuth()
  return role && allowedRoles.includes(role) ? children : fallback
}
