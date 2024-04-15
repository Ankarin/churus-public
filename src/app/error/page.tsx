import React from "react";
import text from "@/locales/sw.json";
export default function Error() {
  return (
    <p className={"mx-auto text-center"}>
      {text.error.sorrySomethingWentWrong}
    </p>
  );
}
