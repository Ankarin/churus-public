import { User } from "@supabase/gotrue-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";
import { logout } from "@/server/auth";
import text from "@/locales/sw.json"; // Import the JSON file

export default function UserDropdown({ user }: { user: User }) {
  const out = async () => {
    await logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="cursor-pointer">{user.email}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-4">
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{text.userDropdown.profile}</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{text.userDropdown.settings}</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={out} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{text.userDropdown.logOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
