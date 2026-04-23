import { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ArrowRightIcon, NewspaperIcon, SearchIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { fetchPublicBlogs, type BlogPagination } from '@/lib/api/blog-public'
import { getApiErrorMessage } from '@/lib/api/errors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

const PER_PAGE = 9

function useDebouncedValue(value: string, delay = 450) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [delay, value])

  return debouncedValue
}

function formatDate(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return '-'
  }

  return parsed.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getSnippet(body: string) {
  const normalized = body.trim()

  if (!normalized) {
    return 'Konten belum tersedia.'
  }

  if (normalized.length <= 140) {
    return normalized
  }

  return `${normalized.slice(0, 140)}...`
}

function BlogCardSkeleton() {
  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="space-y-3">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-9/12" />
        <Skeleton className="h-9 w-28" />
      </CardContent>
    </Card>
  )
}

export function PublicBlogRoutePage() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput)
  const normalizedSearch = debouncedSearch.trim().toLowerCase()

  const blogsQuery = useInfiniteQuery({
    queryKey: ['public-blog-list', PER_PAGE, normalizedSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return fetchPublicBlogs({
        page: pageParam,
        perPage: PER_PAGE,
        search: normalizedSearch || undefined,
      })
    },
    getNextPageParam: (lastPage: BlogPagination) => {
      if (lastPage.current_page >= lastPage.last_page) {
        return undefined
      }

      return lastPage.current_page + 1
    },
  })

  const blogs = useMemo(
    () => blogsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [blogsQuery.data?.pages],
  )

  const visibleBlogs = useMemo(() => {
    if (!normalizedSearch) {
      return blogs
    }

    return blogs.filter((blog) => {
      const haystack = `${blog.title} ${blog.body}`.toLowerCase()

      return haystack.includes(normalizedSearch)
    })
  }, [blogs, normalizedSearch])

  const totalItems = blogsQuery.data?.pages[0]?.total ?? 0
  const errorMessage = blogsQuery.error
    ? getApiErrorMessage(blogsQuery.error, 'Gagal mengambil daftar blog.')
    : null
  const isSearchDebouncing = searchInput.trim() !== debouncedSearch.trim()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.18),_transparent_30%),linear-gradient(180deg,_var(--background),_oklch(0.99_0.02_110))]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-10">
        <header className="rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-teal-700 uppercase">
            <NewspaperIcon className="size-4" />
            Public Blog
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Artikel terbaru dari tim</h1>
          <p className="mt-2 text-muted-foreground">Data diambil dari endpoint public blog tanpa login.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Cari post"
                className="h-10 pl-9"
                onChange={(event) => {
                  setSearchInput(event.target.value)
                }}
                placeholder="Cari judul atau isi post..."
                value={searchInput}
              />
            </div>
            <Button render={<Link to="/login" />} size="sm" variant="outline">
              Login dashboard
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="secondary">{visibleBlogs.length} ditampilkan</Badge>
            <Badge variant="outline">{totalItems} total</Badge>
            {isSearchDebouncing ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Spinner className="size-3" />
                Menyiapkan pencarian...
              </span>
            ) : null}
          </div>
        </header>

        {blogsQuery.isPending ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={`initial-skeleton-${index}`} />
            ))}
          </section>
        ) : null}

        {!blogsQuery.isPending && errorMessage ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle>Gagal memuat blog</CardTitle>
              <CardDescription>{errorMessage}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  void blogsQuery.refetch()
                }}
                variant="outline"
              >
                Coba lagi
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!blogsQuery.isPending && !errorMessage && visibleBlogs.length === 0 ? (
          <Empty className="rounded-[24px] border border-dashed border-border bg-card/90">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <NewspaperIcon />
              </EmptyMedia>
              <EmptyTitle>{normalizedSearch ? 'Post tidak ditemukan' : 'Belum ada blog'}</EmptyTitle>
              <EmptyDescription>
                {normalizedSearch
                  ? 'Coba kata kunci lain untuk mencari artikel.'
                  : 'Tidak ada artikel yang bisa ditampilkan saat ini.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {!blogsQuery.isPending && !errorMessage && visibleBlogs.length > 0 ? (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleBlogs.map((blog) => (
                <Card key={blog.id} className="flex h-full flex-col border-border/70 bg-card/95 shadow-sm">
                  <CardHeader className="space-y-3">
                    {blog.media ? (
                      <div className="overflow-hidden rounded-xl border border-border bg-muted">
                        <img alt={blog.title} className="aspect-video w-full object-cover" src={blog.media} />
                      </div>
                    ) : null}
                    <div>
                      <CardTitle className="line-clamp-2 text-xl">{blog.title}</CardTitle>
                      <CardDescription className="mt-2">{formatDate(blog.timestamp)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    {!blog.media ? <p className="line-clamp-4 text-sm text-muted-foreground">{getSnippet(blog.body)}</p> : null}
                    <Button render={<Link to={`/blog/${blog.id}`} />} variant="outline">
                      Lihat detail
                      <ArrowRightIcon className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/90 px-4 py-3">
              <p className="text-sm text-muted-foreground">{visibleBlogs.length} artikel ditampilkan</p>
              <Button
                disabled={!blogsQuery.hasNextPage || blogsQuery.isFetchingNextPage}
                onClick={() => {
                  void blogsQuery.fetchNextPage()
                }}
                size="sm"
              >
                {blogsQuery.isFetchingNextPage ? (
                  <>
                    <Spinner className="size-4" />
                    Memuat lagi...
                  </>
                ) : (
                  'Muat lebih banyak'
                )}
              </Button>
            </section>

            {blogsQuery.isFetchingNextPage ? (
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <BlogCardSkeleton key={`next-skeleton-${index}`} />
                ))}
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  )
}