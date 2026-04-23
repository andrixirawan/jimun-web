import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon, CalendarIcon, HashIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { fetchPublicBlogById } from '@/lib/api/blog-public'
import { getApiErrorMessage } from '@/lib/api/errors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

function formatDateTime(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return '-'
  }

  return parsed.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[320px] w-full rounded-[28px]" />
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-36 rounded-full" />
            <Skeleton className="h-5 w-44 rounded-full" />
          </div>
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-8/12" />
        </CardContent>
      </Card>
    </div>
  )
}

export function PublicBlogIdRoutePage() {
  const { id } = useParams<{ id: string }>()
  const detailQuery = useQuery({
    queryKey: ['public-blog-detail', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) {
        throw new Error('ID blog tidak ditemukan di URL.')
      }

      return fetchPublicBlogById(id)
    },
  })
  const errorMessage = detailQuery.error
    ? getApiErrorMessage(detailQuery.error, 'Gagal mengambil detail blog.')
    : null

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.14),_transparent_30%),linear-gradient(180deg,_var(--background),_oklch(0.99_0.02_140))]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-8 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <Button render={<Link to="/blog" />} variant="outline">
            <ArrowLeftIcon className="size-4" />
            Kembali ke blog
          </Button>
          <Button render={<Link to="/login" />} size="sm" variant="ghost">
            Login
          </Button>
        </div>

        {detailQuery.isPending ? <DetailSkeleton /> : null}

        {!detailQuery.isPending && errorMessage ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle>Detail blog tidak tersedia</CardTitle>
              <CardDescription>{errorMessage}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  void detailQuery.refetch()
                }}
                variant="outline"
              >
                {detailQuery.isFetching ? (
                  <>
                    <Spinner className="size-4" />
                    Mencoba lagi...
                  </>
                ) : (
                  'Coba lagi'
                )}
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!detailQuery.isPending && !errorMessage && detailQuery.data ? (
          <article className="space-y-4">
            {detailQuery.data.media ? (
              <div className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm">
                <img
                  alt={detailQuery.data.title}
                  className="h-full max-h-[420px] w-full object-cover"
                  src={detailQuery.data.media}
                />
              </div>
            ) : null}

            <Card className="border-border/70 bg-card/95 shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    <HashIcon className="size-3.5" />
                    {detailQuery.data.id}
                  </Badge>
                  <Badge variant="outline">
                    <CalendarIcon className="size-3.5" />
                    {formatDateTime(detailQuery.data.timestamp)}
                  </Badge>
                </div>
                <CardTitle className="text-3xl tracking-tight">{detailQuery.data.title}</CardTitle>
                <CardDescription className="break-all text-xs text-muted-foreground">
                  Slug: {detailQuery.data.slug}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-[15px] leading-7 text-foreground/95">
                  {detailQuery.data.body
                    .split('\n')
                    .filter((line) => line.trim().length > 0)
                    .map((line, index) => (
                      <p key={`${detailQuery.data.id}-${index}`}>{line}</p>
                    ))}
                </div>
              </CardContent>
            </Card>
          </article>
        ) : null}
      </div>
    </main>
  )
}