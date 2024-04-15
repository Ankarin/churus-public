ALTER TABLE "job" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "job" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "job" DROP COLUMN IF EXISTS "locationg";