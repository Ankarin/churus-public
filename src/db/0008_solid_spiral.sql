CREATE TABLE IF NOT EXISTS "job" (
	"id" uuid PRIMARY KEY DEFAULT 'uuid_generate_v4()' NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"employer" uuid,
	"locationg" text,
	"date" date,
	"startTime" text,
	"entTime" text,
	"payRate" integer NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	CONSTRAINT "job_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job" ADD CONSTRAINT "job_employer_employer_id_fk" FOREIGN KEY ("employer") REFERENCES "employer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
