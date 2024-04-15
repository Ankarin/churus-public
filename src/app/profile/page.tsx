import ContentLayout from "@/app/contentLayout";
import { getCandidateData, getEmployerData } from "@/server/services";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { userType } from "@/types";
import CandidateForm from "@/components/forms/CandidateForm";
import { getUser } from "@/server/supabase";
import CandidateCard from "@/components/cards/CandidateCard";
import EmployerForm from "@/components/forms/EmployerForm";
import text from "@/locales/sw.json"; // Import the JSON file

export default async function ProfilePage() {
  const user = await getUser();
  let employer;
  let candidate;
  if (user) {
    if (user?.user_metadata.userType === "candidate") {
      candidate = await getCandidateData(user.id);
    } else {
      employer = await getEmployerData(user.id);
    }
  }

  return (
    <ContentLayout>
      {!user?.user_metadata?.profileCompleted ? (
        <Alert>
          <AlertTitle>{text.profilePage.helloThere}</AlertTitle>
        </Alert>
      ) : (
        ""
      )}

      <div className="pt-10">
        <p className="text-2xl font-bold pb-10 ">
          {text.profilePage.your} {user?.user_metadata.userType}{" "}
          {text.profilePage.account}
        </p>
        {user?.user_metadata.userType === userType.employer && (
          <EmployerForm
            data={employer ?? null}
            defaultEmail={user?.email ?? ""}
          />
        )}
        {user?.user_metadata.userType === userType.candidate && (
          <>
            {candidate && <CandidateCard candidate={candidate} />}
            <CandidateForm
              data={candidate ?? null}
              defaultEmail={user?.email ?? ""}
            />
          </>
        )}
      </div>
    </ContentLayout>
  );
}
