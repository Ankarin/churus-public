"use client";
import { signup } from "@/server/auth";
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
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import text from "@/locales/sw.json"; // Import the JSON file
import { Checkbox } from "@/components/ui/checkbox";

const FormSchema = z
  .object({
    userType: z.enum(["candidate", "employer"]),
    email: z.string().email({ message: text.signup.invalidEmail }),
    password: z.string().min(8, { message: text.signup.password }),
    confirmPassword: z
      .string()
      .min(8, { message: text.signup.confirmPassword }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: text.signup.passwordMismatch,
      path: ["confirmPassword"],
    }
  );

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userType: "candidate",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const origin: string = window.location.origin;
    const res: string | void = await signup({ origin, ...data });
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
      <p className={"font-semibold text-xl"}> {text.signup.signUp}</p>
      <p className={"pb-4 pt-1"}>
        {text.signup.alreadyHaveAnAccount}{" "}
        <Link href={"/login"} className={"text-blue-600 cursor-pointer"}>
          {text.signup.signIn}
        </Link>
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full pt-5  space-y-6"
      >
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue="candidate"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="candidate" id="r1" />
                    <Label htmlFor="r1">{text.signup.imLookingForAJob}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employer" id="r2" />
                    <Label htmlFor="r2">{text.signup.iWantToHire}</Label>
                  </div>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text.signup.email}</FormLabel>
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
              <FormLabel>{text.signup.password}</FormLabel>
              <FormControl>
                <Input type={"password"} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text.signup.confirmPassword}</FormLabel>
              <FormControl>
                <Input type={"password"} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={checked}
            onCheckedChange={() => setChecked(!checked)}
            id="terms"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Jag accepterar{" "}
            <Link target="_blank" className="underline" href="/terms.pdf">
              användarvillkor
            </Link>{" "}
            och{" "}
            <Link target="_blank" className="underline" href="/integrity.pdf">
              integritetspolicy.
            </Link>
          </label>
        </div>
        {loading ? (
          <Loader2 className="h-10 w-10 animate-spin" />
        ) : (
          <Button disabled={!checked} type="submit">
            {text.signup.signUp}
          </Button>
        )}
      </form>
    </Form>
  );
}
