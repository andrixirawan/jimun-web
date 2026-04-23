import axios from 'axios'

import { getApiBaseUrl } from '@/lib/api/base-url'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})
