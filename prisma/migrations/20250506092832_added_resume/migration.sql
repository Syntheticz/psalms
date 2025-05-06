-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "fileAttatchmentId" TEXT;

-- AddForeignKey
ALTER TABLE "UserInfo" ADD CONSTRAINT "UserInfo_fileAttatchmentId_fkey" FOREIGN KEY ("fileAttatchmentId") REFERENCES "FileAttatchment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
