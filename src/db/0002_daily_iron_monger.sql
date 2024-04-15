CREATE TABLE IF NOT EXISTS "candidate" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fullName" text,
	"description" text,
	"phoneNumber" text,
	"email" text,
	"cv" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employer" (
	"id" uuid PRIMARY KEY NOT NULL,
	"companyName" text,
	"description" text,
	"phoneNumber" text,
	"email" text,
	"website" text
);
--> statement-breakpoint
DROP TABLE "users";