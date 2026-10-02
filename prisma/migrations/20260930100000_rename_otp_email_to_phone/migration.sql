-- Create AdminRole enum if not exists
DO $$ BEGIN
  CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add role column to admins if not exists
ALTER TABLE "admins" ADD COLUMN IF NOT EXISTS "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';

-- Create admin_logs table if not exists
CREATE TABLE IF NOT EXISTS "admin_logs" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "detail" TEXT NOT NULL,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "admin_logs" ADD CONSTRAINT "admin_logs_admin_id_fkey"
    FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create otp_codes if not exists (first deploy to fresh DB)
CREATE TABLE IF NOT EXISTS "otp_codes" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- Rename email → phone (OTP now sent via WhatsApp)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'otp_codes' AND column_name = 'email'
  ) THEN
    ALTER TABLE "otp_codes" RENAME COLUMN "email" TO "phone";
  END IF;
END $$;
