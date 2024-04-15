"use client";
import { Button } from "@/components/ui";
import text from "@/locales/sw.json";
import Link from "next/link";
export default function LandingActions() {
  return (
    <div className="flex flex-row justify-center pt-6 gap-5">
      <Link href="/open-jobs">
        <Button>{text.landingActions.openJobs}</Button>
      </Link>
      <Link href="/signup">
        <Button variant="outline">{text.landingActions.getStarted}</Button>
      </Link>
    </div>
  );
}
