import JobDetails from "@/components/job/job-details"
import { Suspense } from "react"

export default function JobPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <Suspense fallback={<div className="flex justify-center py-10">Loading job details...</div>}>
        <JobDetails />
      </Suspense>
    </div>
  )
}
