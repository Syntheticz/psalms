/*
  Warnings:

  - You are about to drop the column `isVerified` on the `UserInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "isVerified";
