import { Navigate, Route, Routes } from 'react-router-dom'

import { PublicBlogDetailPage } from '@/pages/public-blog-detail-page'
import { PublicBlogsPage } from '@/pages/public-blogs-page'
import {
  DashboardPage,
  GuestRoute,
  LoginPage,
  ProtectedRoute,
  RegisterPage,
  RouteLoader,
  useAuthSession,
} from '@modules/auth'

export function AppRouter() {
  const { isAuthenticated, isPending } = useAuthSession()
  const defaultPath = isAuthenticated ? '/dashboard' : '/blogs'

  return (
    <Routes>
      {isPending ? (
        <Route path="*" element={<RouteLoader />} />
      ) : null}
      <Route
        path="/"
        element={<Navigate replace to={defaultPath} />}
      />
      <Route path="/blogs" element={<PublicBlogsPage />} />
      <Route path="/blogs/:id" element={<PublicBlogDetailPage />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate replace to={defaultPath} />}
      />
    </Routes>
  )
}
