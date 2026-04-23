import { authClient } from '../lib/auth-client'

export function useAuthSession() {
  const sessionQuery = authClient.useSession()

  return {
    ...sessionQuery,
    user: sessionQuery.data?.user ?? null,
    session: sessionQuery.data?.session ?? null,
    isAuthenticated: Boolean(sessionQuery.data?.user),
  }
}
