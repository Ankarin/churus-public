import ContentLayout from "@/app/contentLayout";
import { getApplicationsByJobId, getJob } from "@/server/services";
import React, { Suspense } from "react";
import CandidatesList from "@/components/lists/CandidatesList";
import JobCard from "@/components/cards/JobCard";
import text from "@/locales/sw.json"; // Import the JSON file

const Applications = async ({ id }: { id: string }) => {
  const applications = await getApplicationsByJobId(id);
  return applications && applications.length > 0 ? (
    <CandidatesList applications={applications} />
  ) : null;
};
export default async function JobCandidates({
  params,
}: {
  params: { slug: string };
}) {
  const job = await getJob(params.slug);
  if (!job) {
    return <div>{text.jobCandidatesPage.jobNotFound}</div>;
  }
  return (
    <ContentLayout>
      <JobCard job={job} />
      <p className="text-2xl font-semibold py-8">
        {text.jobCandidatesPage.yourCandidates}
      </p>
      <Suspense fallback={<div>{text.jobCandidatesPage.loading}</div>}>
        <Applications id={params.slug}></Applications>
      </Suspense>
    </ContentLayout>
  );
}
