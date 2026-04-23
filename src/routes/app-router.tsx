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
import { PublicBlogDetailRoutePage } from '@/routes/(public)/blog-detail/page'
import { PublicBlogsRoutePage } from '@/routes/(public)/blogs/page'
import { RouteLoader } from '@modules/auth'
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

  return redirect(session?.user ? '/dashboard' : '/blogs')
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
          path: '/blogs',
          element: <PublicBlogsRoutePage />,
        },
        {
          path: '/blogs/:id',
          element: <PublicBlogDetailRoutePage />,
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
    {
      path: '*',
      loader: resolveDefaultPathLoader,
    },
  ],
  {
    future: {
      v8_middleware: true,
    },
  },
)

export function AppRouter() {
  return <RouterProvider fallbackElement={<RouteLoader />} router={router} />
}
