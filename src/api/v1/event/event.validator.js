import { z } from "zod";

const EVENT_PLATFORMS = ["TIKTOK_SHOP", "SHOPEE", "TOKOPEDIA", "INSTAGRAM"];

const dateRange = z.object({
  startsAt: z.string().datetime({ message: "Format tanggal tidak valid" }),
  expiresAt: z.string().datetime({ message: "Format tanggal tidak valid" }),
}).refine((d) => new Date(d.startsAt) < new Date(d.expiresAt), {
  message: "Tanggal mulai harus sebelum tanggal berakhir",
  path: ["startsAt"],
});

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nama event minimal 3 karakter"),
    platform: z.enum(EVENT_PLATFORMS, { errorMap: () => ({ message: "Platform tidak valid" }) }),
    accountLink: z.string().url("Link akun harus berupa URL valid"),
    startsAt: z.string().datetime({ message: "Format tanggal tidak valid" }),
    expiresAt: z.string().datetime({ message: "Format tanggal tidak valid" }),
    isActive: z.boolean().optional().default(true),
  }).refine((d) => new Date(d.startsAt) < new Date(d.expiresAt), {
    message: "Tanggal mulai harus sebelum tanggal berakhir",
    path: ["startsAt"],
  }),
});

export const updateEventSchema = z.object({
  params: z.object({ id: z.string().uuid("ID tidak valid") }),
  body: z.object({
    name: z.string().min(3).optional(),
    platform: z.enum(EVENT_PLATFORMS).optional(),
    accountLink: z.string().url().optional(),
    startsAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const eventIdSchema = z.object({
  params: z.object({ id: z.string().uuid("ID tidak valid") }),
});
