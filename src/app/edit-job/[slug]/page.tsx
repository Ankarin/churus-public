import ContentLayout from "@/app/contentLayout";
import { getUser } from "@/server/supabase";
import { redirect, RedirectType } from "next/navigation";
import { getJob } from "@/server/services";
import EditJobForm from "@/app/edit-job/[slug]/JobForm";

export default async function JobPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getUser();
  const job = await getJob(params.slug);
  if (!job) {
    redirect("/", RedirectType.replace);
  }
  const isMine = user?.id === job.employer?.id;
  if (!isMine) {
    redirect("/", RedirectType.replace);
  }
  return (
    <ContentLayout>
      <EditJobForm job={job}></EditJobForm>
    </ContentLayout>
  );
}
