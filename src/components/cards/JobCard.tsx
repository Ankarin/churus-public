"use client";
import { IFullJob } from "@/types";
import { Card } from "@/components/ui/card";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import text from "@/locales/sw.json";

interface JobCardProps {
  job: IFullJob;
  isMine?: boolean;
}

export default function JobCard({ job, isMine }: JobCardProps) {
  return (
    <Card key={job.id} className="p-3">
      <div className="md:flex ">
        <Link target="_blank" href={job.employer?.website || "#"}>
          <p className="cursor-pointer pr-4 text-semibold text-blue-600">
            {job.employer?.companyName}
          </p>
        </Link>
        <p className="flex pr-2 items-center">
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
            Expired
          </Badge>
        )}
        {isMine && !job.active ? (
          <Badge className="ml-2 bg-yellow-300 hover:bg-yellow-300">
            {text.jobCard.hidden}
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
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: job.description }}
      />
      <div className="flex flex-row justify-end">
        {job.hasApplied && (
          <Badge className="mr-4 bg-green-500 hover:bg-green-500">
            {text.jobCard.youveApplied}
          </Badge>
        )}

        <p className="mr-4">
          {job.applicationCount} {text.jobCard.candidates}
        </p>
        <Link href={`/job/${job.id}`} className="hover:underline text-blue-600">
          {text.jobCard.readMore}
        </Link>
      </div>
    </Card>
  );
}
