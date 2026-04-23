import { startTransition, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/errors'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

import { getSession, registerWithEmail } from '../lib/auth-api'
import { resolveAuthRedirectTarget } from '../lib/auth-redirect'
import { registerSchema } from '../lib/auth-schemas'

export function RegisterForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      try {
        await registerWithEmail(value)
        const session = await getSession()

        if (!session?.user) {
          throw new Error(
            'Registrasi berhasil, tapi session belum terbaca. Cek konfigurasi cookie/CORS di backend Better Auth.',
          )
        }

        toast.success('Akun berhasil dibuat dan session sudah aktif.')

        startTransition(() => {
          navigate(resolveAuthRedirectTarget(location.state), {
            replace: true,
          })
        })
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          'Registrasi gagal. Silakan periksa data kamu.',
        )

        setSubmitError(message)
        toast.error(message)
      }
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/70 bg-card/95 shadow-xl backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Buat akun baru</CardTitle>
          <CardDescription>
            Backend akan membuat akun sekaligus session aktif, lalu frontend
            bootstrap user dari endpoint session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              {submitError ? (
                <Alert variant="destructive">
                  <AlertTitle>Registrasi gagal</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              ) : null}

              <form.Field
                name="name"
                validators={{
                  onBlur: registerSchema.shape.name,
                  onSubmit: registerSchema.shape.name,
                }}
              >
                {(field) => (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        autoComplete="name"
                        placeholder="Nama lengkap"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      {field.state.meta.isTouched ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </FieldContent>
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onBlur: registerSchema.shape.email,
                  onSubmit: registerSchema.shape.email,
                }}
              >
                {(field) => (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        autoComplete="email"
                        placeholder="nama@email.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      {field.state.meta.isTouched ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </FieldContent>
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onBlur: registerSchema.shape.password,
                  onSubmit: registerSchema.shape.password,
                }}
              >
                {(field) => (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        autoComplete="new-password"
                        placeholder="Minimal 8 karakter"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      {field.state.meta.isTouched ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </FieldContent>
                  </Field>
                )}
              </form.Field>

              <form.Subscribe
                selector={(state) => ({
                  canSubmit: state.canSubmit,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ canSubmit, isSubmitting }) => (
                  <Field>
                    <Button
                      className="w-full"
                      disabled={!canSubmit || isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? <Spinner className="size-4" /> : null}
                      {isSubmitting ? 'Membuat akun...' : 'Daftar'}
                    </Button>
                  </Field>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
