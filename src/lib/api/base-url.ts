function readEnvValue(value: string | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : undefined
}

function resolveApiBaseUrl() {
  const modeBasedApiBaseUrl = import.meta.env.PROD
    ? readEnvValue(import.meta.env.VITE_API_BASE_URL_PROD)
    : readEnvValue(import.meta.env.VITE_API_BASE_URL_DEV)

  return (
    readEnvValue(import.meta.env.VITE_API_BASE_URL) ??
    modeBasedApiBaseUrl ??
    readEnvValue(import.meta.env.VITE_API_BASE_URL_PROD) ??
    readEnvValue(import.meta.env.VITE_API_BASE_URL_DEV)
  )
}

const apiBaseUrl = resolveApiBaseUrl()

if (!apiBaseUrl) {
  throw new Error(
    'API base URL belum diset. Tambahkan VITE_API_BASE_URL, VITE_API_BASE_URL_DEV, atau VITE_API_BASE_URL_PROD di .env.',
  )
}

export function getApiBaseUrl() {
  return apiBaseUrl
}
