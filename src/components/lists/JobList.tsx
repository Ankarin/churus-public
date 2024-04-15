import JobCard from "@/components/cards/JobCard";
import { IFullJob, IJob } from "@/types";

export default function JobList({
  jobs,
  isMine,
}: {
  jobs: IFullJob[];
  isMine?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {jobs.map((job: IFullJob) => (
        <JobCard isMine={isMine} key={job.id} job={job} />
      ))}
    </div>
  );
}
