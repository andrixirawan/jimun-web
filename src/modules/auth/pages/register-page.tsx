import { useLocation } from 'react-router-dom'

import { getAuthRedirectState } from '../lib/auth-redirect'
import { AuthShell } from '../ui/auth-shell'
import { RegisterForm } from '../ui/register-form'

export function RegisterPage() {
  const location = useLocation()

  return (
    <AuthShell
      alternateHref="/login"
      alternateLabel="Masuk ke akun"
      alternateState={getAuthRedirectState(location.state)}
      alternateText="Sudah punya akun?"
      description="Flow register mengikuti backend Better Auth: akun dibuat, session aktif, lalu frontend bootstrap user dari endpoint session."
      eyebrow="Register"
      title="Buat akun dan lanjut masuk tanpa step tambahan."
    >
      <RegisterForm />
    </AuthShell>
  )
}
