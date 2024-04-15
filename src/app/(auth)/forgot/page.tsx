"use client";
import { toast } from "@/components/ui/use-toast";
import { forgot } from "@/server/auth";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import text from "@/locales/sw.json"; // Import the JSON file

const FormSchema = z.object({
  email: z.string().email({ message: text.forgotPassword.invalidEmail }),
});

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });
  const [loading, setLoading] = useState(false);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const origin: string = window.location.origin;
    const res: string = await forgot({ origin, ...data });
    if (res === "success") {
      toast({
        title: text.forgotPassword.enterYourEmail,
        variant: "default",
      });
    } else {
      toast({
        variant: "destructive",
        title: res,
      });
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <p className={"font-semibold text-xl"}>
        {text.forgotPassword.forgotPassword}
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full pt-5 space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text.forgotPassword.email}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {loading ? (
          <Loader2 className="h-10 w-10 animate-spin" />
        ) : (
          <Button type="submit">{text.forgotPassword.sendResetLink}</Button>
        )}
      </form>
    </Form>
  );
}
