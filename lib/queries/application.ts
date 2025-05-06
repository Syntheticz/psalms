"use server";

import { format } from "date-fns";
import { prisma } from "../prisma";
import { fetchUserData } from "./user";

export async function createApplication(jobID: string, jobScoreId: string) {
  const user = await fetchUserData();

  await prisma.appliedJobs.create({
    data: {
      status: "RECEIVED",
      jobId: jobID,
      jobScoreId: jobScoreId,
      userId: user.id,
    },
  });
}

export async function fetchUserApplication() {
  const user = await fetchUserData();
  return await prisma.appliedJobs.findMany({
    where: {
      userId: user.id,
    },
  });
}

export async function fetchUserApplicationForDashboard() {
  const user = await fetchUserData();
  const applications = await prisma.appliedJobs.findMany({
    where: {
      userId: user.id,
    },
    include: {
      job: true,
      jobScore: true,
    },
  });

  return applications.map((item) => ({
    id: item.id,
    jobTitle: item.job.job_title,
    company: item.job.company_name,
    appliedDate: item.createdAt,
    status: item.status,
    interviewDate: null,
  }));
}

export async function fetchUserApplicationForApplication() {
  const user = await fetchUserData();
  const applications = await prisma.appliedJobs.findMany({
    where: {
      userId: user.id,
    },
    include: {
      job: true,
      jobScore: true,
    },
  });

  return applications.map((item) => ({
    id: item.jobScore?.id,
    jobTitle: item.job.job_title,
    company: item.job.company_name,
    location: item.job.company_address,
    appliedDate: format(item.createdAt, "EEE, MMM d, yyyy"),
    status: item.status,
    interviewDate: null,
  }));
}
