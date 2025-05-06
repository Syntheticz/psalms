/*
  Warnings:

  - You are about to drop the column `companyId` on the `SocialMedia` table. All the data in the column will be lost.
  - Added the required column `socialMediaId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SocialMedia" DROP CONSTRAINT "SocialMedia_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "socialMediaId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SocialMedia" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_socialMediaId_fkey" FOREIGN KEY ("socialMediaId") REFERENCES "SocialMedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
