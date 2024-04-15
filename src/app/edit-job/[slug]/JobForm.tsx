"use client";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { startOfDay } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { cn } from "@/lib/utils";

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
import { deleteJob, updateJob } from "@/server/services";
import { toast } from "@/components/ui/use-toast";
import { IFullJob } from "@/types";
import { ConfirmDialog } from "@/components/dialogs/confirmDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui";
import text from "@/locales/sw.json";

const JobSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(50).max(5000),
  location: z.string().min(5).max(100),
  date: z.date().refine((date) => startOfDay(date) >= startOfDay(new Date()), {
    message: text.editJob.date,
  }),
  startTime: z.string().min(1, { message: text.editJob.startTime }),
  endTime: z.string().min(1, { message: text.editJob.endTime }),
  payRate: z.coerce.number({}).int().positive().min(1).max(2000),
  active: z.boolean(),
});

export default function EditJobForm({ job }: { job: IFullJob }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (typeof job.date === "string") {
    job.date = new Date(job.date);
  }
  const [descriptionLength, setDescriptionLength] = useState(
    job.description.length,
  );
  const [date, setDate] = useState<Date>(job.date);
  const form = useForm<z.infer<typeof JobSchema>>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      title: job.title,
      location: job.location,
      date: job.date,
      startTime: job.startTime,
      endTime: job.endTime,
      payRate: job.payRate,
      description: job.description,
      active: job.active,
    },
  });

  const deleteTheJob = async () => {
    setLoading(true);
    try {
      await deleteJob(job.id);
    } catch (e) {
      toast({
        title: text.editJob.errorOnDeletingTheJob,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: text.editJob.jobDeleted,
      variant: "success",
    });
    router.replace("/my-jobs");
    router.refresh();
  };
  async function onSubmit(data: z.infer<typeof JobSchema>) {
    setLoading(true);
    try {
      await updateJob(job.id, data);
      toast({
        title: text.editJob.yourJobWasUpdatedSuccessfully,
        variant: "success",
      });
    } catch (e) {
      toast({
        title: text.editJob.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  }
  return (
    <Form {...form}>
      <p className="text-2xl font-bold flex flex-row  justify-between">
        {text.editJob.editYourJob}{" "}
        <ConfirmDialog confirmDelete={deleteTheJob}></ConfirmDialog>
      </p>
      <form className="pt-10" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <div className="grid gap-3 md:grid-cols-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{text.editJob.title}</FormLabel>
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
                  <FormLabel>{text.editJob.hourlyRate}</FormLabel>
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
                  <FormLabel>{text.editJob.location}</FormLabel>
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
                <FormLabel>{text.editJob.jobDescription}</FormLabel>

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
                      <FormLabel>{text.editJob.date}</FormLabel>

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
                              <span>{text.editJob.pickADate}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => {
                              setDate(date || new Date());
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
                      <FormLabel>{text.editJob.startTime}</FormLabel>
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
                      <FormLabel>{text.editJob.endTime}</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col justify-between pt-6  w-36">
              <div className="flex items-center gap-3 pb-4   ">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <>
                      <Switch
                        id="airplane-mode"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="airplane-mode">
                        {field.value
                          ? text.editJob.jobPublic
                          : text.editJob.jobHidden}
                      </Label>
                    </>
                  )}
                />
              </div>
              {loading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Button type="submit">{text.editJob.update}</Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
