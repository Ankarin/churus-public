"use client";
import { Card } from "@/components/ui";
import { CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoSection({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle className="pb-8">{title}:</CardTitle>

        {points.map((point, index) => (
          <div
            key={index}
            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-2 rounded-full bg-sky-500" />
            <p className="text-sm font-medium leading-none">{point}</p>
          </div>
        ))}
      </CardHeader>
    </Card>
  );
}
