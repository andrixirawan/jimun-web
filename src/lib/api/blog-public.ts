import { apiClient } from '@/lib/api/http-client'

export type Blog = {
  id: string
  title: string
  media: string | null
  slug: string
  body: string
  timestamp: string
}

export type LaravelPaginationLink = {
  url: string | null
  label: string
  active: boolean
}

export type BlogPagination = {
  current_page: number
  data: Blog[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: LaravelPaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

type FetchPublicBlogsParams = {
  page?: number
  perPage?: number
  search?: string
}

export async function fetchPublicBlogs(params: FetchPublicBlogsParams = {}) {
  const page = params.page ?? 1
  const perPage = params.perPage ?? 9
  const response = await apiClient.get<BlogPagination>('/api/public/blogs', {
    params: {
      page,
      per_page: perPage,
      search: params.search?.trim() || undefined,
    },
  })

  return response.data
}

export async function fetchPublicBlogById(id: string) {
  const response = await apiClient.get<Blog>(`/api/public/blogs/${id}`)

  return response.data
}
