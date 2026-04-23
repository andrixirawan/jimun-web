import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Spinner } from '@/components/ui/spinner'

import { getSession } from '../lib/auth-api'
import {
  resolveAuthLoadingIntent,
  resolveAuthLoadingTarget,
} from '../lib/auth-redirect'

const MIN_LOADING_MS = 700
const MAX_SESSION_CHECK_TRIES = 10
const SESSION_CHECK_INTERVAL_MS = 250

function delay(durationMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs)
  })
}

async function waitForExpectedSession(intent: 'login' | 'logout') {
  let latestIsAuthenticated = false

  for (let index = 0; index < MAX_SESSION_CHECK_TRIES; index += 1) {
    const session = await getSession()
    latestIsAuthenticated = Boolean(session?.user)

    if (intent === 'login' && latestIsAuthenticated) {
      return true
    }

    if (intent === 'logout' && !latestIsAuthenticated) {
      return false
    }

    await delay(SESSION_CHECK_INTERVAL_MS)
  }

  return latestIsAuthenticated
}

export function AuthLoadingPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const intent = resolveAuthLoadingIntent(location.search)
  const nextTarget = resolveAuthLoadingTarget(
    location.search,
    intent === 'logout' ? '/login' : '/dashboard',
  )

  useEffect(() => {
    let isCancelled = false

    async function resolveTransition() {
      const startedAt = Date.now()
      const isAuthenticated = await waitForExpectedSession(intent)
      const elapsedMs = Date.now() - startedAt

      if (elapsedMs < MIN_LOADING_MS) {
        await delay(MIN_LOADING_MS - elapsedMs)
      }

      if (isCancelled) {
        return
      }

      if (intent === 'logout') {
        navigate(isAuthenticated ? '/dashboard' : nextTarget, { replace: true })
        return
      }

      navigate(isAuthenticated ? nextTarget : '/login', { replace: true })
    }

    void resolveTransition()

    return () => {
      isCancelled = true
    }
  }, [intent, navigate, nextTarget])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_30%),linear-gradient(180deg,_var(--background),_oklch(0.99_0.01_240))]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-10 lg:px-10">
        <section
          className="relative grid size-28 place-items-center rounded-full border border-border/60 bg-card/90 shadow-[0_20px_60px_-30px_rgba(14,116,144,0.55)] backdrop-blur"
          aria-live="polite"
          aria-busy="true"
        >
          <span className="sr-only">Memproses autentikasi</span>
          <span className="absolute inset-3 rounded-full border border-cyan-500/20" />
          <span className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl" />
          <Spinner className="relative z-10 size-8 text-cyan-600" />
        </section>
      </div>
    </main>
  )
}
