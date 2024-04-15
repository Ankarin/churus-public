"use server";
import { getUser, setProfileCompleted } from "@/server/supabase";
import { db } from "@/db";
import { application, candidate, employer, job } from "@/db/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";
import {
  ICandidateCreate,
  IEmployerCreate,
  IFullJob,
  IJobCreate,
} from "@/types";

export const getEmployerData = async (id: string) => {
  const res = await db.select().from(employer).where(eq(employer.id, id));
  return res[0];
};

export const getCandidateData = async (id: string) => {
  const res = await db.select().from(candidate).where(eq(candidate.id, id));
  return res[0];
};

export const saveCandidateData = async (data: ICandidateCreate) => {
  const user = await getUser();
  if (!user) {
    return;
  }

  // Check if the user profile is completed
  const profileCompleted = user.user_metadata?.profileCompleted;

  if (profileCompleted) {
    // If the profile is completed, update the existing record
    return db.update(candidate).set(data).where(eq(candidate.id, user.id));
  } else {
    // If the profile is not completed, insert a new record and update the userMetadata
    const insertResult = await db
      .insert(candidate)
      .values({ ...data, id: user.id });

    // Update userMetadata to indicate that the profile is completed
    const { error } = await setProfileCompleted();

    if (error) {
      console.error("Error updating user metadata:", error);
      return error;
    }
    return insertResult;
  }
};

export const saveEmployerData = async (data: IEmployerCreate) => {
  const user = await getUser();
  if (!user) {
    return;
  }

  // Check if the user profile is completed
  const profileCompleted = user.user_metadata?.profileCompleted;

  if (profileCompleted) {
    // If the profile is completed, update the existing record
    return db.update(employer).set(data).where(eq(employer.id, user.id));
  } else {
    // If the profile is not completed, insert a new record and update the userMetadata
    const insertResult = await db
      .insert(employer)
      .values({ ...data, id: user.id });

    // Update userMetadata to indicate that the profile is completed
    const { error } = await setProfileCompleted();

    if (error) {
      console.error("Error updating user metadata:", error);
      return error;
    }
    return insertResult;
  }
};

export const deleteJob = async (id: string) => {
  return db.delete(job).where(eq(job.id, id));
};

export const makeJobInactive = async (id: string) => {
  return db.update(job).set({ active: false }).where(eq(job.id, id));
};

export const addJob = async (data: IJobCreate) => {
  const user = await getUser();
  if (!user) {
    return;
  }
  const date = data.date instanceof Date ? data.date.toISOString() : data.date;
  return db.insert(job).values({
    ...data,
    employer: user.id,
    date: date,
  });
};

export const updateJob = async (id: string, data: IJobCreate) => {
  const date = data.date instanceof Date ? data.date.toISOString() : data.date;
  return db
    .update(job)
    .set({ ...data, date: date })
    .where(eq(job.id, id));
};

export const getJob = async (id: string) => {
  const user = await getUser();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time part to 00:00:00.00
  const candidateId =
    user?.user_metadata?.userType === "candidate"
      ? user.id
      : "00000000-0000-0000-0000-000000000000";
  const res = await db
    .select({
      id: job.id,
      title: job.title,
      description: job.description,
      employer: {
        companyName: employer.companyName,
        id: employer.id,
        website: employer.website,
      },
      location: job.location,
      date: job.date,
      startTime: job.startTime,
      endTime: job.endTime,
      payRate: job.payRate,
      active: job.active,
      applicationCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${application}
        WHERE ${application.job} = ${job.id}
      )`,
      hasApplied: sql<boolean>`(
      SELECT EXISTS(
      SELECT 1
      FROM ${application}
      WHERE ${application.job} = ${job.id} AND ${
        application.candidate
      } = ${sql`${candidateId}`}
                                     )
                                 )`,
    })
    .from(job)
    .leftJoin(employer, eq(job.employer, employer.id))
    .where(eq(job.id, id));
  return res[0]; // This should return an object that matches the IJob type
};

const processJobs = (jobs: IFullJob[]) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time part to 00:00:00.000
  const activeJobs = jobs.filter(
    (job) => new Date(job.date).getTime() >= currentDate.getTime(),
  );
  const inactiveJobs = jobs.filter((job) => new Date(job.date) < currentDate);
  inactiveJobs.forEach((job) => (job.expired = true));
  activeJobs.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  inactiveJobs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return [...activeJobs, ...inactiveJobs];
};

export const getJobs = async () => {
  const user = await getUser();

  const candidateId =
    user?.user_metadata?.userType === "candidate"
      ? user.id
      : "00000000-0000-0000-0000-000000000000";
  const jobs = await db
    .select({
      id: job.id,
      title: job.title,
      description: job.description,
      employer: {
        companyName: employer.companyName,
        id: employer.id,
        website: employer.website,
      },
      location: job.location,
      date: job.date,
      startTime: job.startTime,
      endTime: job.endTime,
      payRate: job.payRate,
      active: job.active,
      applicationCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${application}
        WHERE ${application.job} = ${job.id}
      )`,
      hasApplied: sql<boolean>`(
        SELECT EXISTS(
          SELECT 1
          FROM ${application}
          WHERE ${application.job} = ${job.id} AND ${
            application.candidate
          } = ${sql`${candidateId}`}
        )
      )`,
    })
    .from(job)
    .leftJoin(employer, eq(job.employer, employer.id))
    .where(eq(job.active, true))
    .orderBy(job.date);
  return processJobs(jobs);
};

export const getMyJobs = async () => {
  const user = await getUser();
  if (!user) {
    return;
  }
  const candidateId =
    user.user_metadata?.userType === "candidate"
      ? user.id
      : "00000000-0000-0000-0000-000000000000";
  const jobs = await db
    .select({
      id: job.id,
      title: job.title,
      description: job.description,
      employer: {
        companyName: employer.companyName,
        id: employer.id,
        website: employer.website,
      },
      location: job.location,
      date: job.date,
      startTime: job.startTime,
      endTime: job.endTime,
      payRate: job.payRate,
      active: job.active,
      applicationCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${application}
        WHERE ${application.job} = ${job.id}
      )`,
      hasApplied: sql<boolean>`(
        SELECT EXISTS(
          SELECT 1
          FROM ${application}
          WHERE ${application.job} = ${job.id} AND ${
            application.candidate
          } = ${sql`${candidateId}`}
        )
      )`,
    })
    .from(job)
    .leftJoin(employer, eq(job.employer, employer.id))
    .where(eq(job.employer, user.id))
    .orderBy(job.date);
  return processJobs(jobs);
};

export const jobApply = async (candidateId: string, jobId: string) => {
  return db.insert(application).values({
    candidate: candidateId,
    job: jobId,
  });
};

export const getApplicationsByJobId = async (jobId: string) => {
  return db
    .select({
      id: application.id,
      job: application.job,
      appliedAt: application.appliedAt,
      candidate: {
        id: candidate.id,
        fullName: candidate.fullName,
        description: candidate.description,
        phoneNumber: candidate.phoneNumber,
        email: candidate.email,
        cv: candidate.cv,
        cvFilename: candidate.cvFilename,
      },
    })
    .from(application)
    .leftJoin(candidate, eq(application.candidate, candidate.id))
    .where(eq(application.job, jobId))
    .orderBy(desc(application.appliedAt));
};
