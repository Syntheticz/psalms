import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ApplicantData {
  education: string[]; // Array of educational qualifications
  skills: string[]; // Array of skills
  experience: string[]; // Array of experience entries (empty in this case)
  certificates: string[]; // Array of certificates
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const applicantId = searchParams.get("applicantId") as string;

  const user = await prisma.user.findFirst({
    where: { id: applicantId },
    include: {
      UserInfo: {
        include: {
          certificates: true,
          education: true,
          experience: true,
          skills: true,
        },
      },
    },
  });

  if (!user)
    return NextResponse.json({
      user: null,
      success: false,
    });

  const applicant = user.UserInfo;
  if (!applicant)
    return NextResponse.json({
      user: null,
      success: false,
    });

  const finalApplicant: ApplicantData = {
    certificates: applicant.certificates.map((item) => item.name),
    education: applicant.education.map((item) => item.degree),
    experience: applicant.experience.map((item) => item.description),
    skills: applicant.skills.map((item) => item.name),
  };

  try {
    return NextResponse.json({
      applicant: finalApplicant,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return Response.json({
      job: null,
      success: false,
    });
  }
}

export type RegistrationInfoGETResponse = Awaited<
  ReturnType<typeof GET>
> extends NextResponse<infer T>
  ? T
  : never;
