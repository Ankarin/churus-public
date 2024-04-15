"use client";

import "react-quill/dist/quill.snow.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { IFullJob } from "@/types";
import { useRouter } from "next/navigation";
import { jobApply } from "@/server/services";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import text from "@/locales/sw.json";

interface JobCardProps {
  job: IFullJob;
  userType: string;
  isMine: boolean;
  profileCompleted: boolean;
  userId: string;
}

export default function JobCard({
  job,
  userType,
  isMine,
  profileCompleted,
  userId,
}: JobCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const applyForJob = async () => {
    setLoading(true);
    if (!userType) {
      router.replace("/login");
      return;
    }
    if (!profileCompleted) {
      router.replace("/profile");
      return;
    }
    try {
      await jobApply(userId, job.id);
    } catch (e) {
      toast({
        title: text.fullJobCard.sorrySomethingWentWrong,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    toast({
      title: text.fullJobCard.youveAppliedForTheJob,
      variant: "success",
    });
    setLoading(false);
    router.refresh();
  };
  const editJob = () => {
    router.push(`/edit-job/${job.id}`);
  };
  return (
    <Card key={job.id} className="p-3">
      <div className="md:flex ">
        <Link target="_blank" href={job.employer?.website || "#"}>
          <p className="cursor-pointer pr-4 text-semibold text-blue-600">
            {job.employer?.companyName}
          </p>
        </Link>
        <p className="flex pr-4 items-center">
          <ClockIcon height="20" className="mr-1 " width="20" />
          {new Intl.DateTimeFormat("us", {
            month: "long",
            day: "2-digit",
          }).format(new Date(job.date))}
          ,
          <span className={"ml-1"}>
            {job.startTime} - {job.endTime}
          </span>
        </p>
        <p className="flex">
          <MapPinIcon height="20" className="mr-1 " width="20" />
          {job.location}
        </p>

        {job.expired && (
          <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-500">
            {text.fullJobCard.expired}
          </Badge>
        )}

        {isMine && !job.active ? (
          <Badge className="ml-2 bg-yellow-300 hover:bg-yellow-300">
            {text.fullJobCard.hidden}
          </Badge>
        ) : (
          ""
        )}
      </div>
      <div className="flex">
        <Link href={`/job/${job.id}`}>
          <p
            color="blue"
            className="cursor-pointer text-2xl font-bold text-blue-600"
          >
            {job.title}
          </p>
        </Link>
        <p className="pl-4 text-green-600 font-bold text-2xl">
          {job.payRate}/hr
        </p>
      </div>
      <section
        className="text-muted-foreground"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: job.description }}
      />
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          {text.fullJobCard.applied}: {job.applicationCount}{" "}
          {text.fullJobCard.candidates}
        </div>
        <div className="flex flex-row">
          {userType !== "employer" && (
            <>
              {job.hasApplied ? (
                // eslint-disable-next-line react/jsx-no-undef
                <Badge className="mr-4 bg-green-500 hover:bg-green-500">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  {text.fullJobCard.youveApplied}
                </Badge>
              ) : (
                <>
                  {!job.expired && (
                    <>
                      {loading ? (
                        <Loader2 className="h-10 w-10 animate-spin" />
                      ) : (
                        <Button onClick={applyForJob}>
                          {text.fullJobCard.applied}
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}

          {isMine && (
            <>
              <Link href={`/job-candidates/${job.id}`}>
                <Button className="mr-5" variant="link">
                  {text.fullJobCard.capCandidates}
                </Button>
              </Link>
              <Button onClick={editJob}>{text.fullJobCard.edit}</Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
