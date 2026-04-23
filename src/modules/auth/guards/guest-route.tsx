import { Navigate, useLocation } from 'react-router-dom'

import { useAuthSession } from '../hooks/use-auth-session'
import { resolveAuthRedirectTarget } from '../lib/auth-redirect'
import { RouteLoader } from './route-loader'

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { isAuthenticated, isPending } = useAuthSession()

  if (isPending) {
    return <RouteLoader />
  }

  if (isAuthenticated) {
    return (
      <Navigate
        replace
        to={resolveAuthRedirectTarget(location.state)}
      />
    )
  }

  return <>{children}</>
}
