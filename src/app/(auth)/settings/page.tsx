"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import text from "@/locales/sw.json"; // Import the JSON file

const FormSchema = z.object({
  email: z.string().email({ message: text.settings.invalidEmail }),
});

const supabase = createClientComponentClient();
export default function Settings() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      email: data.email,
    });
    if (error) {
      toast({
        title: error.message,
        variant: "destructive",
      });
    } else {
      router.replace("/confirm-change");
    }
    setLoading(false);
  };
  return (
    <>
      <p className="text-2xl font-bold ">{text.settings.settings}</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full pt-5  space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.settings.newEmail}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{text.settings.changeEmail}</Button>
        </form>
      </Form>
      <Link className="mt-10" href="/reset-password ">
        {loading ? (
          <Loader2 className="h-10 w-10 animate-spin" />
        ) : (
          <Button className="mt-5" variant="destructive">
            {text.settings.resetPassword}
          </Button>
        )}
      </Link>
    </>
  );
}
