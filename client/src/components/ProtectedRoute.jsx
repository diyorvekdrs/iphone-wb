import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute({ children, requireSuperAdmin, requireCustomer }) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.location.hash = '#/login'
      return
    }
    if (requireSuperAdmin && user.role !== 'super_admin') {
      window.location.hash = '#/'
    }
    if (requireCustomer && user.role !== 'user') {
      window.location.hash = '#/'
    }
  }, [user, loading, requireSuperAdmin, requireCustomer])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24 text-[14px] text-[#6e6e73]">
        Loading…
      </div>
    )
  }
  if (!user) return null
  if (requireSuperAdmin && user.role !== 'super_admin') return null
  if (requireCustomer && user.role !== 'user') return null
  return children
}
