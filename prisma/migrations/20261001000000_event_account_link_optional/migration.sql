-- Make event account_link optional
ALTER TABLE "events" ALTER COLUMN "account_link" DROP NOT NULL;
