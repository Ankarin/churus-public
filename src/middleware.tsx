"use server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { UserResponse } from "@supabase/gotrue-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data }: UserResponse = await supabase.auth.getUser();
  const userType = data?.user?.user_metadata?.userType; // Adjust this line to match where you store the userType
  const isCompleted = data?.user?.user_metadata?.profileCompleted;
  const path = req.nextUrl.pathname;
  const isUser = data.user;
  const isEmployer = userType === "employer";
  if (!isCompleted && path === "/post-job") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }
  if (
    !isUser &&
    (path === "/profile" || path === "/reset-password" || path === "/settings")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (
    !isEmployer &&
    isUser &&
    (path === "/post-job" || path === "/edit-job" || path === "/my-jobs")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (isUser && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/open-jobs", req.url));
  } else if (
    !isEmployer &&
    !isUser &&
    (path === "/post-job" || path === "/edit-job" || path === "/my-jobs")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/profile",
    "/reset-password",
    "/settings",
    "/post-job",
    "/edit-job",
    "/edit-job/:id*",
    "/my-jobs",
    "/open-jobs",
    "/job-candidates",
    "/job-candidates/:id*",
  ],
};
