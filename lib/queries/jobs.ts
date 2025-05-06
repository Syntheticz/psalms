"use server";

import { JobPostingFormValues } from "@/app/employer/jobs/new/page";
import { prisma } from "../prisma";
import { auth } from "@/auth";
import { JobWithRelation } from "../types/job";
import { formatDistanceToNow } from "date-fns";
import { fetchUserData } from "./user";

export async function createNewJobPosting(data: JobPostingFormValues) {
  const session = await auth();

  if (!session) throw new Error("User is unauthenticated!");

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) throw new Error("There is no existing user.");

  const {
    company_address,
    company_name,
    contact,
    description,
    industry_field,
    job_title,
    priority_categories,
    qualifications,
    customMaxSalary,
    customMinSalary,
    salaryRange,
  } = data;

  await prisma.job.create({
    data: {
      company_address,
      company_name,
      contact,
      description,
      industry_field,
      job_title,
      salary_range:
        salaryRange === "others"
          ? customMinSalary + " - " + customMaxSalary
          : salaryRange,
      qualifications: {
        createMany: {
          data: qualifications.map((item) => ({ ...item, id: undefined })),
        },
      },
      metrics: {
        create: {
          applications: 0,
          qualified: 0,
          saved: 0,
          views: 0,
        },
      },
      priority_categories,
      userId: user.id,
    },
  });
}

export async function fetchJobById(id: string) {
  const data = await prisma.job.findFirst({
    where: { id },
    include: {
      qualifications: true,
      metrics: true,
    },
  });

  if (!data) throw new Error("There is no job posted!");

  return data as JobWithRelation;
}

export async function fetchJobs() {
  const user = await fetchUserData();

  const data = prisma.job.findMany({
    where: {
      userId: user.id,
    },
    include: {
      metrics: true,
      qualifications: true,
    },
  });

  return data;
}

export async function fetchUserInfo(id: string) {
  return prisma.userInfo.findFirst({
    where: {
      id,
    },
    include: {
      certificates: true,
      education: true,
      experience: true,
      hardSkills: true,
      skills: true,
      softSkills: true,
      technicalSkills: true,
    },
  });
}

export async function evaluateJobForApplicant(applicantId: string) {
  const rawJobs = await prisma.job.findMany({
    select: { id: true },
  });
  const data: Array<{ id: string; score: number }> = [];
  console.log(rawJobs);

  const jobIds = rawJobs.map((item) => item.id);
  for (let index = 0; index < jobIds.length; index++) {
    const job = jobIds[index];
    const link = `http://0.0.0.0:5000/api?jobId=${job}&applicantId=${applicantId}`;
    const response = await fetch(link);
    const jsonData = await response.json();
    if (!jsonData) throw new Error("There were no data found!");

    const existingRecord = await prisma.jobScore.findFirst({
      where: {
        userId: applicantId,
        jobId: jsonData.id,
      },
    });

    if (!existingRecord) {
      await prisma.jobScore.create({
        data: {
          score: Math.round(jsonData.score),
          jobId: jsonData.id,
          userId: applicantId,
        },
      });
      data.push(jsonData);
    }
  }

  return data;
}

export async function fetchEvaluatedJobs() {
  const user = await fetchUserData();

  const res = await prisma.jobScore.findMany({
    where: { userId: user.id },
    include: {
      job: true,
    },
  });

  return res.map((item) => ({
    id: item.id,
    title: item.job.job_title,
    company: item.job.company_name,
    location: item.job.company_address,
    matchScore: item.score,
    postedDate: formatDistanceToNow(item.job.createdAt, { addSuffix: true }),
    salary: item.job.salary_range,
    skills: item.job.priority_categories.map((cat) => cat),
  }));
}

export async function fetchJobForApplicant(id: string) {
  const data = await prisma.jobScore.findFirst({
    where: { id: id },
    include: {
      job: {
        include: {
          qualifications: true,
          metrics: true,
        },
      },
    },
  });

  if (!data) {
    throw new Error("Job not found");
  }

  return {
    id: data.id,
    jobId: data.job.id,
    company_name: data.job.company_name,
    company_address: data.job.company_address,
    contact: data.job.contact,
    description: data.job.description,
    job_title: data.job.job_title,
    industry_field: data.job.industry_field,
    salary_range: data.job.salary_range,
    priority_categories: data.job.priority_categories,
    isActive: true,
    createdAt: data.job.createdAt,
    score: data.score,
    qualifications: data.job.qualifications.map((item) => ({
      id: item.id,
      requirement: item.requirement,
      possible_credentials: item.possible_credentials,
      categories: item.categories,
      priority: item.priority,
    })),
    metrics: data.job.metrics,
  };
}
