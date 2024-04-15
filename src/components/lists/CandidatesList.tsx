import { IApplication, IApplicationForList } from "@/types";
import CandidateCard from "@/components/cards/CandidateCard";

export default function CandidatesList({
  applications,
}: {
  applications: IApplicationForList[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {(
        applications.filter((app) => app.candidate !== null) as IApplication[]
      ).map((application: IApplication) => (
        <CandidateCard key={application.id} candidate={application.candidate} />
      ))}
    </div>
  );
}
