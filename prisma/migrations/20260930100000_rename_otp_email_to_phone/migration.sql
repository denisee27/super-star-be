-- Rename email → phone in otp_codes table (OTP now sent via WhatsApp)
ALTER TABLE "otp_codes" RENAME COLUMN "email" TO "phone";
