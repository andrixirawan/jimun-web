import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOutIcon, RefreshCcwIcon, ShieldCheckIcon } from 'lucide-react'
import { toast } from 'sonner'

import { getApiBaseUrl } from '@/lib/api/base-url'
import { getApiErrorMessage } from '@/lib/api/errors'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

import { useAuthSession } from '../hooks/use-auth-session'
import { getSession, signOut } from '../lib/auth-api'
import { buildAuthLoadingPath } from '../lib/auth-redirect'

export function DashboardPage() {
  const navigate = useNavigate()
  const { refetch, session, user } = useAuthSession()
  const [action, setAction] = useState<'refresh' | 'logout' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleRefreshSession() {
    setAction('refresh')
    setErrorMessage(null)

    try {
      await refetch()
      const response = await getSession()

      if (!response?.user) {
        throw new Error('Session tidak ditemukan. Silakan login ulang.')
      }

      toast.success('Session berhasil diperbarui.')
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Gagal mengambil session terbaru.',
      )

      setErrorMessage(message)
      toast.error(message)
    } finally {
      setAction(null)
    }
  }

  async function handleLogout() {
    setAction('logout')
    setErrorMessage(null)
    let revokeFailedMessage: string | null = null

    try {
      await signOut()
    } catch (error) {
      revokeFailedMessage = getApiErrorMessage(
        error,
        'Logout server gagal, tapi sesi lokal sudah ditutup.',
      )
      setErrorMessage(revokeFailedMessage)
    } finally {
      navigate(buildAuthLoadingPath('logout', '/login'), { replace: true })

      if (revokeFailedMessage) {
        toast.warning(revokeFailedMessage)
      } else {
        toast.success('Kamu sudah logout.')
      }

      setAction(null)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.14),_transparent_25%),linear-gradient(180deg,_var(--background),_oklch(0.99_0.01_240))]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-emerald-700 uppercase">
              <ShieldCheckIcon className="size-4" />
              Authenticated
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Halo, {user?.name ?? 'User'}
              </h1>
              <p className="text-muted-foreground">
                Dashboard ini membaca session aktif dari backend auth sebagai
                source of truth.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                void handleRefreshSession()
              }}
            >
              {action === 'refresh' ? (
                <Spinner className="size-4" />
              ) : (
                <RefreshCcwIcon className="size-4" />
              )}
              Refresh session
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                void handleLogout()
              }}
            >
              {action === 'logout' ? (
                <Spinner className="size-4" />
              ) : (
                <LogOutIcon className="size-4" />
              )}
              Logout
            </Button>
          </div>
        </header>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Aksi gagal</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle>Ringkasan akun</CardTitle>
              <CardDescription>
                State auth dibaca lewat `useSession`, lalu bisa diverifikasi
                ulang ke endpoint `get-session`.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Name
                </p>
                <p className="mt-2 text-base font-medium">{user?.name ?? '-'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Email
                </p>
                <p className="mt-2 text-base font-medium">{user?.email ?? '-'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Role
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">{user?.role ?? 'User'}</Badge>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Token mode
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">Cookie session</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle>Session aktif</CardTitle>
              <CardDescription>
                Endpoint session membaca cookie Better Auth yang aktif di
                browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Session ID
                </p>
                <p className="mt-2 break-all font-medium">
                  {session?.id ?? 'Belum tersedia'}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Client type
                </p>
                <p className="mt-2 font-medium">{session?.clientType ?? 'web'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Expires At
                </p>
                <p className="mt-2 font-medium">
                  {session?.expiresAt
                    ? new Date(session.expiresAt).toLocaleString('id-ID')
                    : 'Belum tersedia'}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  API Base URL
                </p>
                <p className="mt-2 break-all font-medium">{getApiBaseUrl()}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
