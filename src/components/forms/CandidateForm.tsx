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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { saveCandidateData } from "@/server/services";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "@/components/ui/use-toast";
import { ICandidate } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import text from "@/locales/sw.json"; // Import the JSON file

const supabase = createClientComponentClient();

const EmployerSchema = z.object({
  fullName: z.string().min(3),
  phoneNumber: z
    .string()
    .refine((value) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value), {
      message: text.candidateForm.fileError,
    }),
  email: z.string().email(),
  description: z.string().optional(),
});
export default function CandidateForm({
  data,
  defaultEmail,
}: {
  data: ICandidate | null;
  defaultEmail: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cv, setCv] = useState<{
    url: string;
    filename: string;
  }>({
    url: data?.cv || "",
    filename: data?.cvFilename || "",
  }); // Add object type
  const [fileError, setFileError] = useState(false);
  const form = useForm<z.infer<typeof EmployerSchema>>({
    resolver: zodResolver(EmployerSchema),
    defaultValues: {
      fullName: data?.fullName,
      phoneNumber: data?.phoneNumber,
      email: data?.email || defaultEmail,
      description: data?.description,
    },
  });
  async function loadCV(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      throw new Error(text.candidateForm.fileError);
    }
    const file = e.target.files[0];
    setFile(file);

    const path = `${Date.now()}-${file.name}`;
    setCv({
      url: `cv/${path}`,
      filename: file.name,
    });
    setFileError(false);
  }
  async function onSubmit(data: z.infer<typeof EmployerSchema>) {
    setLoading(true);
    if (!file && !cv.url) {
      setFileError(true);
      setLoading(false);
      return;
    } else {
      setFileError(false);
    }

    // Upload file to Supabase storage
    if (file) {
      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(cv.url, file);

      if (uploadError) {
        console.error("Error uploading file: ", uploadError);
        toast({
          title: uploadError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }
    try {
      // Save form data to the database
      const res = await saveCandidateData({
        ...data,
        cv: cv.url,
        cvFilename: cv.filename,
        description: data.description || "",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Sorry, something went wrong",
        variant: "destructive",
      });
    }
    toast({
      title: "Your profile has been updated",
      variant: "success",
    });
    setLoading(false);
    router.refresh();
  }

  const downloadFile = async () => {
    const { data } = supabase.storage.from("cvs").getPublicUrl(cv.url);
    window.open(data.publicUrl);
  };
  const changeCV = () => {
    setCv({
      url: "",
      filename: "",
    });
  };

  return (
    <Form {...form}>
      <form className="pt-10" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 ">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.candidateForm.fullName}</FormLabel>
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
                <FormLabel>{text.candidateForm.phoneNumber}</FormLabel>
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
                <FormLabel>{text.candidateForm.contactEmail}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.candidateForm.info}</FormLabel>
                <FormControl>
                  <>
                    <Textarea
                      placeholder={text.candidateForm.info}
                      {...field}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fileError ? (
            <p className="text-destructive">{text.candidateForm.fullCV}</p>
          ) : (
            <p>{text.candidateForm.fullCV}</p>
          )}
          {cv.url && !file ? (
            <p>
              <span
                onClick={downloadFile}
                className="cursor-pointer text-blue-600"
              >
                {cv.filename}
              </span>
              <span
                className="cursor-pointer text-destructive ml-5"
                onClick={changeCV}
              >
                {text.candidateForm.change}
              </span>
            </p>
          ) : (
            ""
          )}
          {cv.url && !file ? (
            ""
          ) : (
            <Input
              type="file"
              onChange={loadCV}
              accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          )}
          {fileError && (
            <p className="text-destructive text-sm">
              {text.candidateForm.fileError}
            </p>
          )}
        </div>
        <div className="flex justify-end pt-6">
          {loading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : (
            <Button type="submit">{text.candidateForm.save}</Button>
          )}
        </div>
      </form>
    </Form>
  );
}
