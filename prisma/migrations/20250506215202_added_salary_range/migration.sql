/*
  Warnings:

  - Added the required column `salary_range` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "salary_range" TEXT NOT NULL;
