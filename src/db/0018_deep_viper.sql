ALTER TABLE "job" RENAME COLUMN "status" TO "active";--> statement-breakpoint
ALTER TABLE "job" ALTER COLUMN "active" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "job" ALTER COLUMN "active" SET DEFAULT true;