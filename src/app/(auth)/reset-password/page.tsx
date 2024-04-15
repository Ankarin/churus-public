"use client";
import { reset } from "@/server/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { toast } from "@/components/ui/use-toast";
import text from "@/locales/sw.json"; // Import the JSON file

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: text.resetPassword.invalidPassword }),
    confirmPassword: z
      .string()
      .min(8, { message: text.resetPassword.invalidPassword }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: text.resetPassword.passwordMismatch,
      path: ["confirmPassword"],
    },
  );

export default function Page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res: string | void = await reset({ password: data.password });
    if (res) {
      toast({
        variant: "destructive",
        title: res,
      });
    } else {
      toast({
        variant: "success",
        title: text.resetPassword.reset,
      });
      router.replace("/settings");
    }
  }

  return (
    <Form {...form}>
      <p className={"font-semibold text-xl"}>
        {text.resetPassword.resetPassword}
      </p>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full pt-5  space-y-6"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text.resetPassword.newPassword}</FormLabel>
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
              <FormLabel>{text.resetPassword.confirmNewPassword}</FormLabel>
              <FormControl>
                <Input type={"password"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{text.resetPassword.reset}</Button>
      </form>
    </Form>
  );
}
