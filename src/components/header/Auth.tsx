import Link from "next/link";
import { Button } from "@/components/ui/button";
import text from "@/locales/sw.json";

export default function Auth() {
  return (
    <div className="flex flex-row gap-3">
      <Link href="/login">
        <Button>{text.auth.logIn}</Button>
      </Link>
      <Link href="/signup">
        <Button variant="outline">{text.auth.signUp}</Button>
      </Link>
    </div>
  );
}
