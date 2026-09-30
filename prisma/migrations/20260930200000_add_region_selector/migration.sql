-- Create provinces table
CREATE TABLE "regions_provinces" (
  "id"   TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "regions_provinces_pkey" PRIMARY KEY ("id")
);

-- Create regencies table
CREATE TABLE "regions_regencies" (
  "id"          TEXT NOT NULL,
  "province_id" TEXT NOT NULL,
  "name"        TEXT NOT NULL,
  CONSTRAINT "regions_regencies_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "regions_regencies_province_id_fkey"
    FOREIGN KEY ("province_id") REFERENCES "regions_provinces"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Add province and regency columns to inquiries
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "province" TEXT;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "regency"  TEXT;
