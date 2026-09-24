-- CreateEnum
CREATE TYPE "InquiryCategory" AS ENUM ('MCN_AGENCY', 'PASUKAN_AFFILIATE', 'BRAND_SELLER');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "category" "InquiryCategory" NOT NULL,
    "platform" TEXT,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "account_link" TEXT,
    "username" TEXT,
    "domicile" TEXT NOT NULL,
    "gmv_range" TEXT,
    "followers_range" TEXT,
    "brand_name" TEXT,
    "store_link" TEXT,
    "product_category" TEXT,
    "pic_name" TEXT,
    "pic_role" TEXT,
    "pic_contact" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
