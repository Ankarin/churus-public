import React from "react";
import text from "@/locales/en.json"; // Import the JSON file

export default function Page() {
  return (
    <p className={"mx-auto text-center"}>
      {text.confirmChange.confirmEmailChange}
    </p>
  );
}
