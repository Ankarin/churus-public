ALTER TABLE "application" DROP CONSTRAINT "application_job_job_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application" ADD CONSTRAINT "application_job_job_id_fk" FOREIGN KEY ("job") REFERENCES "job"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
