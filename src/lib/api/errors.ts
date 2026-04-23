import axios from 'axios'

type ApiErrorShape = {
  error?: string
  message?: string
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Terjadi kesalahan. Silakan coba lagi.',
) {
  if (axios.isAxiosError<ApiErrorShape>(error)) {
    return (
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      fallback
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
