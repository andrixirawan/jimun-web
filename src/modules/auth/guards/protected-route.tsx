import { Navigate, useLocation } from 'react-router-dom'

import { useAuthSession } from '../hooks/use-auth-session'
import { RouteLoader } from './route-loader'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { isAuthenticated, isPending } = useAuthSession()

  if (isPending) {
    return <RouteLoader />
  }

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`

    return (
      <Navigate
        replace
        to="/login"
        state={{ redirectTo }}
      />
    )
  }

  return <>{children}</>
}
