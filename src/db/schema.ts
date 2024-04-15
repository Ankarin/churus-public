import {
  boolean,
  pgTable,
  text,
  uuid,
  integer,
  date,
  unique,
} from "drizzle-orm/pg-core";

export const candidate = pgTable("candidate", {
  id: uuid("id").primaryKey().unique(),
  fullName: text("fullName").notNull(),
  description: text("description").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  email: text("email").notNull(),
  cv: text("cv"),
  cvFilename: text("cvFilename"),
});

export const employer = pgTable("employer", {
  id: uuid("id").primaryKey().unique(),
  companyName: text("companyName").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  email: text("email").notNull(),
  website: text("website").notNull(),
  verified: boolean("verified").notNull().default(false),
});

export const job = pgTable("job", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  employer: uuid("employer")
    .references(() => employer.id)
    .notNull(),
  location: text("location").notNull(),
  date: date("date").notNull(),
  startTime: text("startTime").notNull(),
  endTime: text("entTime").notNull(),
  payRate: integer("payRate").notNull(),
  active: boolean("active").notNull().default(true),
});

export const application = pgTable(
  "application",
  {
    id: uuid("id").primaryKey().defaultRandom().unique(),
    candidate: uuid("candidate")
      .references(() => candidate.id, { onDelete: "cascade" })
      .notNull(),
    job: uuid("job")
      .references(() => job.id, { onDelete: "cascade" })
      .notNull(),
    appliedAt: date("appliedAt").notNull().defaultNow(),
  },
  (t) => ({
    applicationUnique: unique().on(t.job, t.candidate),
  }),
);
