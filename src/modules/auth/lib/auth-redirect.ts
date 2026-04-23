export type AuthRedirectState = {
  redirectTo?: string
}

const AUTH_ROUTE_PATHS = new Set(['/login', '/register'])

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

export function getAuthRedirectState(state: unknown) {
  if (!state || typeof state !== 'object') {
    return undefined
  }

  const redirectTo = sanitizeRedirectTarget(
    (state as AuthRedirectState).redirectTo,
  )

  return redirectTo ? { redirectTo } : undefined
}

export function resolveAuthRedirectTarget(
  state: unknown,
  fallback = '/dashboard',
) {
  return getAuthRedirectState(state)?.redirectTo ?? fallback
}
