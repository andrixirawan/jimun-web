import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  type MiddlewareFunction,
} from 'react-router-dom'

import { AuthLayout } from '@/routes/(auth)/layout'
import { LoginRoutePage } from '@/routes/(auth)/login/page'
import { RegisterRoutePage } from '@/routes/(auth)/register/page'
import { ProtectedLayout } from '@/routes/(protected)/layout'
import { DashboardRoutePage } from '@/routes/(protected)/dashboard/page'
import { PublicLayout } from '@/routes/(public)/layout'
import { AuthLoadingRoutePage } from '@/routes/(public)/auth-loading/page'
import { PublicBlogIdRoutePage } from '@/routes/(public)/blog-id/page'
import { PublicBlogRoutePage } from '@/routes/(public)/blog/page'
import { PublicNotFoundRoutePage } from '@/routes/(public)/not-found/page'
import { getSession } from '@modules/auth/lib/auth-api'
import { resolveAuthRedirectTarget } from '@modules/auth/lib/auth-redirect'

const requireGuestSessionMiddleware: MiddlewareFunction = async (
  { request },
  next,
) => {
  const session = await getSession()

  if (session?.user) {
    const requestUrl = new URL(request.url)

    return redirect(
      resolveAuthRedirectTarget(undefined, requestUrl.search, '/dashboard'),
    )
  }

  return next()
}

const requireAuthenticatedSessionMiddleware: MiddlewareFunction = async (
  { request },
  next,
) => {
  const session = await getSession()

  if (!session?.user) {
    const requestUrl = new URL(request.url)
    const redirectTo = `${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`
    const loginSearch = new URLSearchParams({ redirectTo }).toString()

    return redirect(`/login?${loginSearch}`)
  }

  return next()
}

async function resolveDefaultPathLoader() {
  const session = await getSession()

  return redirect(session?.user ? '/dashboard' : '/blog')
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      loader: resolveDefaultPathLoader,
    },
    {
      element: <PublicLayout />,
      children: [
        {
          path: '/auth/loading',
          element: <AuthLoadingRoutePage />,
        },
        {
          path: '/blog',
          element: <PublicBlogRoutePage />,
        },
        {
          path: '/blog/:id',
          element: <PublicBlogIdRoutePage />,
        },
        {
          path: '*',
          element: <PublicNotFoundRoutePage />,
        },
      ],
    },
    {
      element: <AuthLayout />,
      middleware: [requireGuestSessionMiddleware],
      children: [
        {
          path: '/login',
          element: <LoginRoutePage />,
        },
        {
          path: '/register',
          element: <RegisterRoutePage />,
        },
      ],
    },
    {
      element: <ProtectedLayout />,
      middleware: [requireAuthenticatedSessionMiddleware],
      children: [
        {
          path: '/dashboard',
          element: <DashboardRoutePage />,
        },
      ],
    },
  ],
)

export function AppRouter() {
  return <RouterProvider router={router} />
}
