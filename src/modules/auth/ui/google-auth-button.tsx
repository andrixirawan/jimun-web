import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { beginGoogleOAuth } from '../lib/auth-api'

type GoogleAuthButtonProps = {
  callbackURL: string
  label: string
  onError?: (message: string) => void
  onStart?: () => void
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn('size-4', className)}
    >
      <path
        fill="#4285F4"
        d="M21.64 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.41a4.63 4.63 0 0 1-2 3.04v2.52h3.24c1.9-1.76 2.99-4.35 2.99-7.2Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.44l-3.24-2.52c-.9.6-2.04.96-3.37.96-2.6 0-4.8-1.76-5.58-4.12H3.08v2.6A9.99 9.99 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.42 13.88A6 6 0 0 1 6.1 12c0-.65.12-1.28.32-1.88V7.52H3.08A9.98 9.98 0 0 0 2 12c0 1.61.38 3.13 1.08 4.48l3.34-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 6a5.43 5.43 0 0 1 3.84 1.5l2.88-2.88A9.64 9.64 0 0 0 12 2a9.99 9.99 0 0 0-8.92 5.52l3.34 2.6C7.2 7.76 9.4 6 12 6Z"
      />
    </svg>
  )
}

export function GoogleAuthButton({
  callbackURL,
  label,
  onError,
  onStart,
}: GoogleAuthButtonProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleGoogleSignIn() {
    onStart?.()
    setIsPending(true)

    try {
      const result = await beginGoogleOAuth(callbackURL)

      if (!result?.url) {
        throw new Error('Backend tidak mengembalikan URL redirect Google.')
      }

      window.location.assign(result.url)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Login dengan Google belum berhasil.'

      onError?.(message)
      toast.error(message)
      setIsPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={isPending}
      onClick={() => {
        void handleGoogleSignIn()
      }}
    >
      {isPending ? (
        <>
          <LoaderCircleIcon className="size-4 animate-spin" />
          Mengalihkan ke Google...
        </>
      ) : (
        <>
          <GoogleIcon />
          {label}
        </>
      )}
    </Button>
  )
}
