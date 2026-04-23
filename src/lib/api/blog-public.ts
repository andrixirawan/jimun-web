import axios from 'axios'

import { getApiBaseUrl } from '@/lib/api/base-url'

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
}

export async function fetchPublicBlogs(params: FetchPublicBlogsParams = {}) {
  const page = params.page ?? 1
  const perPage = params.perPage ?? 9
  const baseUrl = getApiBaseUrl()
  const endpoint = new URL('/api/public/blogs', baseUrl)

  endpoint.searchParams.set('page', String(page))
  endpoint.searchParams.set('per_page', String(perPage))

  const response = await axios.get<BlogPagination>(endpoint.toString())

  return response.data
}

export async function fetchPublicBlogById(id: string) {
  const baseUrl = getApiBaseUrl()
  const endpoint = new URL(`/api/public/blogs/${id}`, baseUrl)
  const response = await axios.get<Blog>(endpoint.toString())

  return response.data
}
