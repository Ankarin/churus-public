import React, { Suspense } from "react";
import JobList from "@/components/lists/JobList";
import ContentLayout from "@/app/contentLayout";
import { getMyJobs } from "@/server/services";
import text from "@/locales/sw.json"; // Import the JSON file

const MyJobsList = async () => {
  const jobs = await getMyJobs();
  return jobs && jobs.length > 0 ? <JobList isMine={true} jobs={jobs} /> : null;
};

export default function MyJobs() {
  return (
    <ContentLayout>
      <p className="text-2xl font-semibold pb-8  flex justify-between">
        {text.myJobsPage.myJobs}
      </p>
      <Suspense fallback={<div>{text.myJobsPage.loading}</div>}>
        <MyJobsList />
      </Suspense>
    </ContentLayout>
  );
}
