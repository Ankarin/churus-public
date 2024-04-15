import ContentLayout from "@/app/contentLayout";
import { getUser } from "@/server/supabase";
import { redirect, RedirectType } from "next/navigation";
import FullJobCard from "@/app/job/[slug]/FulJobCard";
import { getJob, jobApply } from "@/server/services";
import { IFullJob } from "@/types";

export default async function JobPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getUser();
  const job: IFullJob = await getJob(params.slug);
  if (!job) redirect("/", RedirectType.replace);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time part to 00:00:00.000
  job.expired = new Date(job.date) < currentDate;

  const userType = user?.user_metadata.userType;
  let isMine = !user ? false : user.id === job.employer?.id;
  const profileCompleted = await user?.user_metadata?.profileCompleted;
  return (
    <ContentLayout>
      <FullJobCard
        job={job}
        userType={userType}
        isMine={isMine}
        profileCompleted={profileCompleted}
        userId={user?.id ?? ""}
      />
    </ContentLayout>
  );
}
