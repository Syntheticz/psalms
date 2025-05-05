"use server";

import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { userProfileSchema } from "../validation/user-profile-schema";
import { z } from "zod";
import { auth } from "@/auth";
import { CompanyFormData } from "@/components/company-form";
type UserProfileFormValues = z.infer<typeof userProfileSchema>;

const HASH_VALUE = 10 as const;
type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  role: "EMPLOYER" | "APPLICANT";
  terms: boolean;
  companyName?: string | undefined;
};

export async function createUser(data: SignupFormValues) {
  const password = await bcrypt.hash(data.password, HASH_VALUE);
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  await prisma.user.create({
    data: {
      password,
      role: data.role,
      email: data.email,
      name: data.name,
    },
  });
}

export async function fetchUserRoleByEmail(email: string) {
  const data = await prisma.user.findFirst({
    where: { email },
    select: {
      role: true,
    },
  });

  if (!data) {
    throw new Error("User does not exist!");
  }

  return data.role;
}

export async function saveApplicantInformation(data: UserProfileFormValues) {
  const {
    certificates,
    education,
    email,
    experience,
    hardSkills,
    name,
    skills,
    softSkills,
    technicalSkills,
    bio,
    location,
    phone,
    website,
  } = data;
  const session = await auth();
  if (!session) {
    throw new Error("User is not logged in!");
  }
  const userData = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  if (!userData) {
    throw new Error("User does not exist!");
  }

  await prisma.userInfo.upsert({
    where: { email: userData.email || "" },
    create: {
      email,
      name,
      bio,
      phone,
      location,
      website,
      userId: userData.id,
      education: {
        createMany: {
          data: education.map((item) => ({ ...item })),
        },
      },

      certificates: {
        createMany: {
          data: certificates.map((item) => ({ ...item, url: "" })),
        },
      },
      experience: {
        createMany: {
          data: experience.map((item) => ({ ...item })),
        },
      },
      hardSkills: {
        createMany: {
          data: hardSkills.map((item) => ({ ...item })),
        },
      },
      softSkills: {
        createMany: {
          data: softSkills.map((item) => ({ ...item })),
        },
      },

      skills: {
        createMany: {
          data: skills.map((item) => ({ ...item })),
        },
      },
      technicalSkills: {
        createMany: {
          data: technicalSkills.map((item) => ({ ...item })),
        },
      },
    },
    update: {
      // Update top‑level fields
      name: name,
      bio: bio,
      phone: phone,
      location: location,
      website: website,

      // If you also want to replace nested lists on update, do this:
      education: {
        deleteMany: {},
        createMany: {
          data: education.map((item) => ({
            ...item,
          })),
        },
      },
      certificates: {
        deleteMany: {},
        createMany: {
          data: certificates.map((item) => ({
            ...item,
            url: "",
          })),
        },
      },
      experience: {
        deleteMany: {},
        createMany: { data: data.experience },
      },
      hardSkills: {
        deleteMany: {},
        createMany: { data: data.hardSkills },
      },
      softSkills: {
        deleteMany: {},
        createMany: { data: data.softSkills },
      },
      skills: {
        deleteMany: {},
        createMany: { data: data.skills },
      },
      technicalSkills: {
        deleteMany: {},
        createMany: { data: data.technicalSkills },
      },
    },
  });
}

export async function saveEmployerProfile(data: CompanyFormData) {
  const session = await auth();

  const userData = await prisma.user.findFirst({
    where: { email: session?.user.email },
  });

  if (!userData) {
    throw new Error("User does not exist!");
  }
  const {
    contactPersonId,
    createdAt,
    description,
    email,
    founded,
    id,
    industry,
    location,
    logo,
    name,
    phone,
    profileCompletion,
    size,
    contactPerson,
    updatedAt,
    website,
    benefits,
    socialMedia,
  } = data;

  await prisma.$transaction(async (tx) => {
    const socialMediaInfo = await tx.socialMedia.upsert({
      where: {
        id: socialMedia?.id || "",
      },
      create: {
        facebook: socialMedia?.facebook,
        linkedin: socialMedia?.linkedin,
        twitter: socialMedia?.twitter,
      },
      update: {
        facebook: socialMedia?.facebook,
        linkedin: socialMedia?.linkedin,
        twitter: socialMedia?.twitter,
      },
    });

    const contactPersonInfo = await tx.contactPerson.upsert({
      where: {
        id: contactPerson.id,
      },
      create: {
        email: contactPerson.email,
        name: contactPerson.name,
        contactNumber: contactPerson.contactNumber,
      },
      update: {
        email: contactPerson.email,
        name: contactPerson.name,
        contactNumber: contactPerson.contactNumber,
      },
    });

    await tx.company.upsert({
      where: { id },
      create: {
        name,
        description,
        email,
        founded,
        industry,
        location,
        logo,
        phone,
        size,
        website,
        userId: userData.id,
        contactPersonId: contactPersonInfo.id,
        socialMediaId: socialMediaInfo.id,
        benefits: {
          createMany: {
            data:
              benefits?.map((item) => ({ content: item.content || "" })) || [],
          },
        },
      },
      update: {
        name,
        description,
        email,
        founded,
        industry,
        location,
        logo,
        phone,
        size,
        website,
        benefits: {
          deleteMany: {},
          createMany: {
            data:
              benefits?.map((item) => ({ content: item.content || "" })) || [],
          },
        },
      },
    });
  });
}

export async function fetchUserCompany() {
  const session = await auth();
  if (!session) throw new Error("User is unauthorized");

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
    include: {
      Company: {
        include: { benefits: true, contactPerson: true, socialMedia: true },
      },
    },
  });

  if (!user) throw new Error("User is not found");
  return user.Company[0];
}
