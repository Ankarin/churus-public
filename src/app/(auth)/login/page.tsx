"use client";
import { toast } from "@/components/ui/use-toast";
import { login } from "@/server/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import text from "@/locales/sw.json"; // Import the JSON file

const FormSchema = z.object({
  email: z.string().email({ message: text.login.invalidEmail }),
  password: z.string().min(8, { message: text.login.password }),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const res: string | void = await login(data);
    if (res) {
      toast({
        variant: "destructive",
        title: res,
      });
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <p className={"font-semibold text-xl"}>{text.login.logIn}</p>
      <p className={"pb-4 pt-1"}>
        {text.login.dontHaveAnAccount}{" "}
        <Link href={"/signup"} className={"text-blue-600 cursor-pointer"}>
          {text.login.signUp}
        </Link>
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full pt-5  space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text.login.email}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text.login.password}</FormLabel>
              <FormControl>
                <Input type={"password"} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Link href={"/forgot"} className={"text-blue-600 cursor-pointer "}>
          {text.login.forgotPassword}
        </Link>

        <br />

        {loading ? (
          <Loader2 className="h-10 w-10 animate-spin" />
        ) : (
          <Button type="submit">{text.login.logIn}</Button>
        )}
      </form>
    </Form>
  );
}
