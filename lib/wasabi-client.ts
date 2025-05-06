import { S3Client } from "@aws-sdk/client-s3";

export const wasabiClient = new S3Client({
  region: "ap-southeast-1",
  endpoint: "https://s3.ap-southeast-1.wasabisys.com",
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID!,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY!,
  },
});
