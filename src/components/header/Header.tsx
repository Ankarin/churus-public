"use client";
import Link from "next/link";
import Auth from "@/components/header/Auth";
import ThemeToggle from "@/components/header/ThemeToggle";
import { User } from "@supabase/gotrue-js";
import UserDropdown from "@/components/header/UserDropdown";
import { userType } from "@/types";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/header/MobileNav";
import text from "@/locales/sw.json";
import logoWhite from "../../../public/logo-white.svg";
import logoBlack from "../../../public/logo-black.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
export function Header({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme"),
  );

  useEffect(() => {
    localStorage.setItem("theme", theme as string);
    setCurrentTheme(theme as string);
  }, [theme]);
  useEffect(() => {
    console.log(theme);
  });
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const links =
    user?.user_metadata.userType === userType.employer
      ? [
          { href: "/open-jobs", label: text.header.jobs },
          { href: "/post-job", label: text.header.postJob },
          { href: "/my-jobs", label: text.header.myJobs },
        ]
      : [{ href: "/open-jobs", label: text.header.jobs }];
  return (
    <div className="sticky h-16 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl h-full px-2 flex items-center mx-auto justify-between">
        <div className="flex gap-6 items-center">
          <Link
            href="/"
            className="capitalize text-xl font-bold cursor-pointer flex gap-1 items-center"
          >
            {currentTheme === "light" ? (
              <Image src={logoBlack} alt="" width="30" height="30"></Image>
            ) : (
              <Image src={logoWhite} alt="" width="30" height="30"></Image>
            )}
            CHURES
          </Link>

          {
            <div className="gap-6 items-center  hidden md:flex ">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          }
        </div>
        <div className="flex gap-6 items-center">
          <div className="hidden md:flex  gap-6 items-center">
            <ThemeToggle></ThemeToggle>
            {!user ? <Auth></Auth> : <UserDropdown user={user}></UserDropdown>}
          </div>
          <div onClick={toggleMenu}>
            <MobileNav user={user}></MobileNav>
          </div>
        </div>
      </div>
    </div>
  );
}
