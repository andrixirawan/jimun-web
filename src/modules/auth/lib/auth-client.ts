import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { getApiBaseUrl } from '@/lib/api/base-url'

export const AUTH_BASE_PATH = '/api/auth'
export const AUTH_CLIENT_TYPE_HEADER = 'X-Client-Type'

export const authClient = createAuthClient({
  baseURL: getApiBaseUrl(),
  basePath: AUTH_BASE_PATH,
  fetchOptions: {
    credentials: 'include',
    headers: {
      [AUTH_CLIENT_TYPE_HEADER]: 'web',
    },
  },
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: {
          type: 'string',
          required: false,
        },
        lastName: {
          type: 'string',
          required: false,
        },
        phoneNumber: {
          type: 'string',
          required: false,
        },
        role: {
          type: 'string',
          required: false,
        },
        banned: {
          type: 'boolean',
          required: false,
        },
        banReason: {
          type: 'string',
          required: false,
        },
      },
      session: {
        clientType: {
          type: 'string',
          required: false,
        },
      },
    }),
  ],
})
