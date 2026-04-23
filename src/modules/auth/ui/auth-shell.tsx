import { ShieldCheckIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { AuthRedirectState } from '../lib/auth-redirect'

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
  alternateLabel: string
  alternateHref: string
  alternateText: string
  alternateState?: AuthRedirectState
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  alternateHref,
  alternateLabel,
  alternateState,
  alternateText,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.16),_transparent_32%),linear-gradient(180deg,_var(--background),_oklch(0.98_0.01_220))] text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <section className="hidden rounded-[32px] border border-border/60 bg-[linear-gradient(160deg,_rgba(255,255,255,0.82),_rgba(240,249,255,0.96))] p-10 shadow-xl lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-medium text-sky-800 shadow-sm">
              <ShieldCheckIcon className="size-4" />
              Jimun Auth
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.24em] text-sky-700 uppercase">
                {eyebrow}
              </p>
              <h1 className="max-w-xl text-5xl leading-tight font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                {description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur">
            <p className="text-sm font-medium text-slate-500">
              Flow session backend
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                  Step 1
                </p>
                <p className="mt-2 font-medium">Sign up / sign in</p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                  Step 2
                </p>
                <p className="mt-2 font-medium">Get session</p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                  Step 3
                </p>
                <p className="mt-2 font-medium">Protected area</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="mb-6 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm">
                <ShieldCheckIcon className="size-4 text-sky-700" />
                Jimun Auth
              </div>
            </div>
            <div className="mb-6 space-y-3 lg:hidden">
              <p className="text-sm font-semibold tracking-[0.24em] text-sky-700 uppercase">
                {eyebrow}
              </p>
              <h1 className="text-4xl leading-tight font-semibold tracking-tight">
                {title}
              </h1>
              <p className="text-base text-muted-foreground">{description}</p>
            </div>

            {children}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {alternateText}{' '}
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                to={alternateHref}
                state={alternateState}
              >
                {alternateLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
