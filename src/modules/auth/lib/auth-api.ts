import { authClient } from './auth-client'
import type { LoginValues, RegisterValues } from './auth-schemas'

type BetterAuthError =
  | {
      message?: string
      status?: number
    }
  | null
  | undefined

function throwIfAuthError(error: BetterAuthError, fallbackMessage: string) {
  if (error) {
    throw new Error(error.message ?? fallbackMessage)
  }
}

export async function registerWithEmail(payload: RegisterValues) {
  const response = await authClient.signUp.email(payload)
  throwIfAuthError(response.error, 'Registrasi gagal.')

  return response.data
}

export async function loginWithEmail(payload: LoginValues) {
  const response = await authClient.signIn.email(payload)
  throwIfAuthError(response.error, 'Login gagal.')

  return response.data
}

export async function getSession() {
  const response = await authClient.getSession()

  if (response.error?.status === 401) {
    return null
  }

  throwIfAuthError(response.error, 'Gagal mengambil session.')

  return response.data
}

export async function signOut() {
  const response = await authClient.signOut()
  throwIfAuthError(response.error, 'Gagal logout.')
}
