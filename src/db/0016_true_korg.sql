ALTER TABLE "application" DROP CONSTRAINT "application_candidate_candidate_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application" ADD CONSTRAINT "application_candidate_candidate_id_fk" FOREIGN KEY ("candidate") REFERENCES "candidate"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
