"use server";

import { JobPostingFormValues } from "@/app/employer/jobs/new/page";
import { prisma } from "../prisma";
import { auth } from "@/auth";
import { JobWithRelation } from "../types/job";

export async function fetchUserData() {
  const session = await auth();
  if (!session) throw new Error("User is unauthenticated!");
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) throw new Error("User not found!");

  return user;
}

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
  } = data;
  await prisma.job.create({
    data: {
      company_address,
      company_name,
      contact,
      description,
      industry_field,
      job_title,
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
