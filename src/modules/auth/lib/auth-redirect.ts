export type AuthRedirectState = {
  redirectTo?: string
}

export const AUTH_LOADING_PATH = '/auth/loading'
const AUTH_ROUTE_PATHS = new Set(['/login', '/register', AUTH_LOADING_PATH])
const AUTH_LOADING_INTENTS = new Set(['login', 'logout'] as const)

export type AuthLoadingIntent = 'login' | 'logout'

function sanitizeRedirectTarget(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return null
  }

  const pathname = value.split(/[?#]/, 1)[0] ?? value

  if (AUTH_ROUTE_PATHS.has(pathname)) {
    return null
  }

  return value
}

function sanitizeLoadingIntent(value: unknown): AuthLoadingIntent | null {
  if (typeof value !== 'string') {
    return null
  }

  if (AUTH_LOADING_INTENTS.has(value as AuthLoadingIntent)) {
    return value as AuthLoadingIntent
  }

  return null
}

export function getAuthRedirectState(state: unknown, search?: string) {
  const redirectToFromState = getAuthRedirectStateFromObject(state)

  if (redirectToFromState) {
    return { redirectTo: redirectToFromState }
  }

  if (search) {
    const redirectToFromSearch = sanitizeRedirectTarget(
      new URLSearchParams(search).get('redirectTo'),
    )

    if (redirectToFromSearch) {
      return { redirectTo: redirectToFromSearch }
    }
  }

  return undefined
}

function getAuthRedirectStateFromObject(state: unknown) {
  if (!state || typeof state !== 'object') {
    return null
  }

  return sanitizeRedirectTarget((state as AuthRedirectState).redirectTo)
}

export function resolveAuthRedirectTarget(
  state: unknown,
  search?: string,
  fallback = '/dashboard',
) {
  const redirectToFromState = getAuthRedirectStateFromObject(state)

  if (redirectToFromState) {
    return redirectToFromState
  }

  if (search) {
    const redirectToFromSearch = sanitizeRedirectTarget(
      new URLSearchParams(search).get('redirectTo'),
    )

    if (redirectToFromSearch) {
      return redirectToFromSearch
    }
  }

  return fallback
}

export function resolveOAuthCallbackUrl(
  state: unknown,
  search?: string,
  fallback = '/dashboard',
) {
  const redirectTarget = resolveAuthRedirectTarget(state, search, fallback)
  const authLoadingPath = buildAuthLoadingPath('login', redirectTarget)

  if (typeof window === 'undefined') {
    return authLoadingPath
  }

  return new URL(authLoadingPath, window.location.origin).toString()
}

export function buildAuthLoadingPath(
  intent: AuthLoadingIntent,
  nextPath?: string,
) {
  const params = new URLSearchParams()
  const fallbackTarget = intent === 'logout' ? '/login' : '/dashboard'

  params.set('intent', intent)
  params.set(
    'next',
    sanitizeRedirectTarget(nextPath) ?? fallbackTarget,
  )

  return `${AUTH_LOADING_PATH}?${params.toString()}`
}

export function resolveAuthLoadingIntent(
  search?: string,
  fallback: AuthLoadingIntent = 'login',
) {
  if (!search) {
    return fallback
  }

  return sanitizeLoadingIntent(new URLSearchParams(search).get('intent')) ?? fallback
}

export function resolveAuthLoadingTarget(search?: string, fallback = '/dashboard') {
  if (!search) {
    return fallback
  }

  return sanitizeRedirectTarget(new URLSearchParams(search).get('next')) ?? fallback
}
