import * as React from "react";
import {
  LogOut,
  Menu,
  Minus,
  Plus,
  Settings,
  User as UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { User } from "@supabase/gotrue-js";
import { userType } from "@/types";
import Link from "next/link";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { logout } from "@/server/auth";
import text from "@/locales/sw.json"; // Import the JSON file

export function MobileNav({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const links =
    user?.user_metadata.userType === userType.employer
      ? [
          { href: "/open-jobs", label: text.mobileNav.jobs },
          { href: "/post-job", label: text.mobileNav.postJob },
          { href: "/my-jobs", label: text.mobileNav.myJobs },
        ]
      : [{ href: "/open-jobs", label: text.mobileNav.jobs }];

  const out = async () => {
    await logout();
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Menu size={24} color="currentColor" className="md:hidden" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{user?.email}</DrawerTitle>
            <DrawerDescription>{text.mobileNav.welcome}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0  min-h-72">
            <div className="flex flex-col  text-2xl  items-center justify-center gap-4">
              <DrawerClose asChild>
                <Link href={"/"}>{text.mobileNav.home}</Link>
              </DrawerClose>
              {links.map((link) => (
                <DrawerClose key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DrawerClose>
              ))}

              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DrawerClose asChild>
                    <Link href="/profile">
                      <span>{text.mobileNav.myProfile}</span>
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link href="/settings">
                      <span>{text.mobileNav.settings}</span>
                    </Link>
                  </DrawerClose>

                  <DrawerClose asChild>
                    <span className="cursor-pointer" onClick={out}>
                      {text.mobileNav.logOut}
                    </span>
                  </DrawerClose>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <DrawerFooter>
            {!user && (
              <DrawerClose asChild>
                <Button>
                  <Link href="/login">{text.mobileNav.getStarted}</Link>
                </Button>
              </DrawerClose>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
