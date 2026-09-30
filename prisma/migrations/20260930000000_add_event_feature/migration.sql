-- AlterEnum (cannot be inside a transaction in PostgreSQL)
ALTER TYPE "InquiryCategory" ADD VALUE IF NOT EXISTS 'EVENT';

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "account_link" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "event_id" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "event_name" TEXT;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
