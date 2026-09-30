-- Migrate old domicile data to regency column
UPDATE "inquiries"
SET "regency" = "domicile"
WHERE "regency" IS NULL AND "domicile" IS NOT NULL;

-- Drop the domicile column
ALTER TABLE "inquiries" DROP COLUMN "domicile";
