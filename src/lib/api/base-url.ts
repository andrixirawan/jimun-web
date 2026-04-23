function readEnvValue(value: string | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : undefined
}

const apiBaseUrl = readEnvValue(import.meta.env.VITE_API_BASE_URL)

if (!apiBaseUrl) {
  throw new Error(
    'API base URL belum diset. Tambahkan VITE_API_BASE_URL di .env.',
  )
}

export function getApiBaseUrl() {
  return apiBaseUrl
}
