import React from "react";
import text from "@/locales/sw.json"; // Import the JSON file

export default function Page() {
  return (
    <p className={"mx-auto text-center"}>
      {text.confirm.pleaseConfirmYourEmail}
    </p>
  );
}
