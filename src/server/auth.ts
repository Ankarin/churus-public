"use server";
import { redirect, RedirectType } from "next/navigation";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createRouteHandlerClient({ cookies });
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<void | string> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return error.message;
  else {
    redirect("/", RedirectType.replace);
  }
}

export async function logout(): Promise<void | string> {
  const { error } = await supabase.auth.signOut();

  if (error) return error.message;
  else {
    redirect("/", RedirectType.replace);
  }
}

export async function signup({
  userType,
  email,
  password,
  origin,
}: {
  userType: "candidate" | "employer";
  email: string;
  password: string;
  origin: string;
}): Promise<void | string> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { userType },
      emailRedirectTo: `${origin}/api/confirm-callback`,
    },
  });
  if (error) return error.message;
  else {
    redirect("/confirm", RedirectType.replace);
  }
}

export async function forgot({
  email,
  origin,
}: {
  email: string;
  origin: string;
}): Promise<string> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/reset-callback`,
  });
  if (error) return error.message;
  else {
    return "success";
  }
}
export async function reset({
  password,
}: {
  password: string;
}): Promise<string | void> {
  const { error } = await supabase.auth.updateUser({ password: password });
  if (error) return error.message;
}
