import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Masukkan email yang valid.'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .max(128, 'Password terlalu panjang.'),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter.')
    .max(80, 'Nama terlalu panjang.'),
  email: loginSchema.shape.email,
  password: loginSchema.shape.password,
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
