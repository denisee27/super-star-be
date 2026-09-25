import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
  }),
});

export const verifyLoginOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Email tidak valid"),
    code: z.string().length(6, "Kode OTP harus 6 digit"),
  }),
});

export const createAdminSchema = z.object({
  body: z.object({
    email: z.string().email("Email tidak valid"),
    name: z.string().min(2, "Nama minimal 2 karakter"),
    password: z.string().min(8, "Password minimal 8 karakter"),
  }),
});
