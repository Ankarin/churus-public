export interface IJob {
  id: string;
  title: string;
  description: string;
  employer: string;
  location: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  payRate: number;
  status: boolean;
}

export interface IFullJob {
  id: string;
  title: string;
  description: string;
  employer: IInJobEmployer | null;
  location: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  payRate: number;
  active: boolean;
  applicationCount: number;
  hasApplied: boolean;
  expired?: boolean;
}

export interface ICandidate {
  id: string;
  fullName: string;
  description: string;
  phoneNumber: string;
  email: string;
  cv: string | null;
  cvFilename: string | null;
}

export interface IApplication {
  id: string;
  job: string;
  appliedAt: string;
  candidate: ICandidate;
}
export interface IApplicationForList {
  id: string;
  job: string;
  appliedAt: string;
  candidate: ICandidate | null;
}

export enum userType {
  candidate = "candidate",
  employer = "employer",
}

export interface IJobCreate extends Omit<IJob, "id" | "status" | "employer"> {}

export interface ICandidateCreate extends Omit<ICandidate, "id"> {}

export interface IEmployer {
  id: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  website: string;
  verified: boolean;
}

export interface IInJobEmployer
  extends Omit<IEmployer, "verified" | "phoneNumber" | "email"> {}

export interface IEmployerCreate extends Omit<IEmployer, "id" | "verified"> {}

export enum JobStatus {
  Active = "active",
  Inactive = "inactive",
}
