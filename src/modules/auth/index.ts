export { GuestRoute } from './guards/guest-route'
export { ProtectedRoute } from './guards/protected-route'
export { RouteLoader } from './guards/route-loader'
export { useAuthSession } from './hooks/use-auth-session'
export { authClient } from './lib/auth-client'
export {
  getSession,
  loginWithEmail,
  registerWithEmail,
  signOut,
} from './lib/auth-api'
export type { AuthRedirectState } from './lib/auth-redirect'
export { DashboardPage } from './pages/dashboard-page'
export { LoginPage } from './pages/login-page'
export { RegisterPage } from './pages/register-page'
