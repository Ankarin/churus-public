"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Card } from "@/components/ui/card";
import { ICandidate } from "@/types";
import text from "@/locales/sw.json"; // Import the JSON file

interface CandidateCardProps {
  candidate: ICandidate;
}

const supabase = createClientComponentClient();

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const downloadCv = () => {
    if (candidate.cv != null) {
      const { data } = supabase.storage.from("cvs").getPublicUrl(candidate.cv);
      window.open(data.publicUrl);
    }
  };
  return (
    <Card key={candidate.id} className="p-3 ">
      <div className="flex justify-between">
        <p className="cursor-pointer text-blue-600">{candidate.fullName}</p>
        {candidate.cv && (
          <span onClick={downloadCv} className="hover:underline cursor-pointer">
            {text.candidateCard.fullCv}
          </span>
        )}
      </div>
      <div className="flex  gap-3">
        <p className="cursor-pointer" color="blue">
          {candidate.email}
        </p>
        <p className="cursor-pointer" color="blue">
          {candidate.phoneNumber}
        </p>
      </div>

      <p className="text-muted-foreground">{candidate.description}</p>
    </Card>
  );
}
