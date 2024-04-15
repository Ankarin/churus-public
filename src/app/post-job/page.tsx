"use client";
import ContentLayout from "@/app/contentLayout";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { startOfDay } from "date-fns";
import dynamic from "next/dynamic";
import text from "@/locales/sw.json"; // Import the JSON file

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addJob } from "@/server/services";
import { toast } from "@/components/ui/use-toast";
import { router } from "next/client";

const JobSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(50).max(5000),
  location: z.string().min(5).max(100),
  date: z.date().refine((date) => startOfDay(date) >= startOfDay(new Date()), {
    message: text.postJob.dateCannotBeInThePast,
  }),
  startTime: z.string().min(1, { message: text.postJob.startTimeIsRequired }),
  endTime: z.string().min(1, { message: text.postJob.endTimeIsRequired }),
  payRate: z.coerce.number({}).int().positive().min(1).max(2000),
});

export default function PostJob() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [date, setDate] = useState<Date>();
  const form = useForm<z.infer<typeof JobSchema>>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      title: "",
      location: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      payRate: 0,
      description: "",
    },
  });
  async function onSubmit(data: z.infer<typeof JobSchema>) {
    setLoading(true);
    try {
      await addJob(data);
      toast({
        title: text.postJob.jobPostedSuccessfully,
        variant: "success",
      });
      router.replace("/my-jobs");
      router.refresh();
    } catch (e) {
      toast({
        title: text.postJob.error,
        variant: "destructive",
      });
    }
  }
  return (
    <ContentLayout>
      <p className="text-2xl font-bold">{text.postJob.createANewJob}</p>
      <Form {...form}>
        <form className="pt-10" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-3 md:grid-cols-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{text.postJob.title}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{text.postJob.hourlyRate}</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{text.postJob.location}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{text.postJob.jobDescription}</FormLabel>

                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={(content) => {
                        field.onChange(content);
                        setDescriptionLength(content.length);
                      }}
                      className="myQuillEditor"
                    />
                  </FormControl>
                  <p>{descriptionLength} / 5000</p>
                  <FormMessage />
                </FormItem>
              )}
              name="description"
            ></FormField>

            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-col justify-center gap-3">
                <div className="flex flex-col gap-3">
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{text.postJob.date}</FormLabel>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>{text.postJob.pickADate}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(date) => {
                                setDate(date);
                                field.onChange(date);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                    name="date"
                  ></FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{text.postJob.startTime}</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{text.postJob.endTime}</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                {loading ? (
                  <Loader2 className="h-10 w-10 animate-spin" />
                ) : (
                  <Button type="submit">{text.postJob.post}</Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
