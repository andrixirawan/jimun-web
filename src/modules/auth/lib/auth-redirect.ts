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
