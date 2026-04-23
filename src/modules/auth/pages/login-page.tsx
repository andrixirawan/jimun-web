import { useLocation } from 'react-router-dom'

import { getAuthRedirectState } from '../lib/auth-redirect'
import { AuthShell } from '../ui/auth-shell'
import { LoginForm } from '../ui/login-form'

export function LoginPage() {
  const location = useLocation()

  return (
    <AuthShell
      alternateHref="/register"
      alternateLabel="Buat akun"
      alternateState={getAuthRedirectState(location.state)}
      alternateText="Belum punya akun?"
      description="Session akan dikelola oleh backend Better Auth. Setelah login sukses, app langsung membaca source of truth dari get-session."
      eyebrow="Login"
      title="Akses dashboard kamu lewat flow session yang rapi."
    >
      <LoginForm />
    </AuthShell>
  )
}
