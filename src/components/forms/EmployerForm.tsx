"use client";
import { Button, Form, Input } from "@/components/ui";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IEmployer } from "@/types";
import { saveEmployerData } from "@/server/services";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import text from "@/locales/sw.json"; // Import the JSON file

const EmployerSchema = z.object({
  companyName: z.string().min(2),
  website: z.string().url(),
  phoneNumber: z
    .string()
    .refine((value) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value), {
      message: text.employerForm.invalidPhoneNumber,
    }),
  email: z.string().email(),
});
export default function EmployerForm({
  data,
  defaultEmail,
}: {
  data: IEmployer | null;
  defaultEmail: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof EmployerSchema>>({
    resolver: zodResolver(EmployerSchema),
    defaultValues: {
      companyName: data?.companyName,
      website: data?.website,
      phoneNumber: data?.phoneNumber,
      email: data?.email || defaultEmail,
    },
  });
  async function onSubmit(data: z.infer<typeof EmployerSchema>) {
    setLoading(true);
    try {
      // Save form data to the database
      const res = await saveEmployerData({
        ...data,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: text.employerForm.sorrySomethingWentWrong,
        variant: "destructive",
      });
    }
    toast({
      title: text.employerForm.yourProfileHasBeenUpdated,
      variant: "success",
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form className="pt-10" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-3 ">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.employerForm.companyName}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.employerForm.companyWebsite}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.employerForm.contactPhoneNumber}</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>{text.employerForm.contactEmail}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-6">
          {loading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : (
            <Button type="submit">{text.employerForm.save}</Button>
          )}
        </div>
      </form>
    </Form>
  );
}
