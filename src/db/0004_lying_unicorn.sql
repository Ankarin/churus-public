ALTER TABLE "candidate" ALTER COLUMN "fullName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "candidate" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "candidate" ALTER COLUMN "phoneNumber" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "candidate" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employer" ALTER COLUMN "companyName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employer" ALTER COLUMN "phoneNumber" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employer" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employer" ALTER COLUMN "website" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employer" ALTER COLUMN "verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "employer" DROP COLUMN IF EXISTS "description";