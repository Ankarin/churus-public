import React, { Suspense } from "react";
import JobList from "@/components/lists/JobList";
import ContentLayout from "@/app/contentLayout";
import { getJobs } from "@/server/services";
import text from "@/locales/sw.json";

const JobsList = async () => {
  const jobs = await getJobs();
  return jobs && jobs.length > 0 ? <JobList jobs={jobs} /> : null;
};

export default function Jobs() {
  return (
    <ContentLayout>
      <p className="text-2xl font-semibold pb-8">
        {text.openJobsPage.openJobs}
      </p>
      <Suspense fallback={<div>{text.openJobsPage.loading}</div>}>
        <JobsList />
      </Suspense>
    </ContentLayout>
  );
}
