// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { wasabiClient } from "@/lib/wasabi-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma"; // Adjust path as needed
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: {
      UserInfo: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: "resumefuzzyjobseeker",
    Key: file.name,
    Body: buffer,
    ContentType: file.type,
  });

  console.log(command);

  console.log(wasabiClient);

  const signedUrl = await getSignedUrl(wasabiClient, command, {
    expiresIn: 60,
  });

  const publicUrl = `https://s3.ap-southeast-1.wasabisys.com/resumefuzzyjobseeker/${file.name}`;

  // Save metadata in DB
  await prisma.fileAttatchment.create({
    data: {
      url: publicUrl,
      name: file.name,
      size: file.size,
      type: getFileTypeEnum(file.type),
      UserInfo: { connect: { id: user.UserInfo?.id || "" } }, // Adjust relation if needed
    },
  });

  return Response.json({ signedUrl });
}

function getFileTypeEnum(mime: string): "IMAGE" | "PDF" | "DOCX" | "DOC" {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime === "application/pdf") return "PDF";
  if (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "DOCX";
  if (mime === "application/msword") return "DOC";
  throw new Error("Unsupported file type");
}
