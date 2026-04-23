import { Spinner } from '@/components/ui/spinner'

export function RouteLoader() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm text-muted-foreground shadow-sm">
        <Spinner className="size-4" />
        Menyiapkan session backend...
      </div>
    </main>
  )
}
