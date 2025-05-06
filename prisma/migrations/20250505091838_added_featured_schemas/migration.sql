-- AlterTable
ALTER TABLE "AppliedJobs" ADD COLUMN     "jobScoreId" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "metrics" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "applications" INTEGER NOT NULL DEFAULT 0,
    "saved" INTEGER NOT NULL DEFAULT 0,
    "qualified" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metrics_jobId_key" ON "metrics"("jobId");

-- AddForeignKey
ALTER TABLE "AppliedJobs" ADD CONSTRAINT "AppliedJobs_jobScoreId_fkey" FOREIGN KEY ("jobScoreId") REFERENCES "JobScore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
