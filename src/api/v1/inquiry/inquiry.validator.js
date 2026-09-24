import { z } from "zod";

const GMV_RANGES = ["< 10 Juta", "10-30 Juta", "30-100 Juta", "> 100 Juta"];
const FOLLOWER_RANGES = ["< 1.000", "1.000 - 10.000", "10.000 - 50.000", "50.000 - 100.000", "> 100.000"];
const MCN_PLATFORMS = ["TIKTOK_SHOP", "SHOPEE"];

export const submitMcnSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    fullName: z.string().min(2, "Nama minimal 2 karakter"),
    phone: z.string().min(8, "No HP tidak valid"),
    accountLink: z.string().url("Link akun harus berupa URL valid"),
    domicile: z.string().min(2, "Domisili wajib diisi"),
    gmvRange: z.enum(GMV_RANGES, { errorMap: () => ({ message: "Pilih range GMV" }) }),
    followersRange: z.enum(FOLLOWER_RANGES, { errorMap: () => ({ message: "Pilih range followers" }) }),
    platform: z.enum(MCN_PLATFORMS, { errorMap: () => ({ message: "Pilih platform" }) }),
  }),
});

export const submitPasSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    fullName: z.string().min(2, "Nama minimal 2 karakter"),
    username: z.string().min(2, "Username wajib diisi"),
    gmvRange: z.enum(GMV_RANGES, { errorMap: () => ({ message: "Pilih range GMV" }) }),
    domicile: z.string().min(2, "Domisili wajib diisi"),
  }),
});

export const submitBrandSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    brandName: z.string().min(2, "Nama brand minimal 2 karakter"),
    storeLink: z.string().url("Link toko harus berupa URL valid"),
    productCategory: z.string().min(2, "Kategori produk wajib diisi"),
    picName: z.string().min(2, "Nama PIC wajib diisi"),
    picRole: z.string().min(2, "Role PIC wajib diisi"),
    picContact: z.string().min(8, "Kontak PIC tidak valid"),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({ id: z.string().uuid("ID tidak valid") }),
  body: z.object({
    status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "REJECTED"]),
    notes: z.string().optional(),
  }),
});
