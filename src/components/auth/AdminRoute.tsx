import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function AdminRoute() {
  const { isAuthenticated, role } = useAuth()
  return isAuthenticated && role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
