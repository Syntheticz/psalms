"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createApplication } from "@/lib/queries/application";
import { fetchJobForApplicant } from "@/lib/queries/jobs";
import { useQuery } from "@tanstack/react-query";
import {
  BookmarkIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  EyeIcon,
  MapPinIcon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { notFound, useParams } from "next/navigation";

import React from "react";
import { toast } from "sonner";

export default function page() {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading } = useQuery({
    queryKey: ["JobDataApplicant"],
    queryFn: async () => await fetchJobForApplicant(id),
    enabled: !!id,
  });

  if (!isLoading && !job) {
    notFound();
  }

  async function handleApplication() {
    try {
      await createApplication(job?.jobId || "", job?.id || "");
      toast.success("Applied Succesfully!");
    } catch (error) {
      toast.error("There was an error!");
    }
  }

  // Format date
  const formattedDate =
    job &&
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(job.createdAt);

  return (
    job && (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main job details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-bold">
                      {job.job_title}
                    </CardTitle>
                    <CardDescription className="text-lg mt-1">
                      <span className="flex items-center gap-1">
                        <BuildingIcon className="h-4 w-4" />
                        {job.company_name}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                      {job.industry_field}
                    </Badge>
                    {job.isActive ? (
                      <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="px-3 py-1">
                        Closed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{job.company_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Posted on {formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{job.salary_range}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{job.metrics?.applications} applicants</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">{job.description}</p>

                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">
                    Priority Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.priority_categories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card>
              <CardHeader>
                <CardTitle>Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.qualifications.map((qualification) => (
                  <div key={qualification.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      {qualification.priority && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-semibold text-base">
                          {qualification.requirement}
                          {qualification.priority && (
                            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                              Priority
                            </Badge>
                          )}
                        </h4>

                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-muted-foreground">
                            Possible Credentials:
                          </h5>
                          <ul className="list-disc list-inside text-sm mt-1 ml-2">
                            {qualification.possible_credentials.map(
                              (credential, idx) => (
                                <li key={idx}>{credential}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {qualification.categories.map((category, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{job.contact}</p>
              </CardContent>
            </Card>
          </div>

          {/* Application sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleApplication()}
                >
                  <SendIcon className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
                {/* <Button variant="outline" className="w-full" size="lg">
                  <BookmarkIcon className="mr-2 h-4 w-4" />
                  Save Job
                </Button> */}

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h3 className="font-medium">Job Metrics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Views
                        </span>
                      </div>
                      <p className="text-xl font-semibold mt-1">
                        {job.metrics?.views}
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Applications
                        </span>
                      </div>
                      <p className="text-xl font-semibold mt-1">
                        {job.metrics?.applications}
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Saved
                        </span>
                      </div>
                      <p className="text-xl font-semibold mt-1">
                        {job.metrics?.saved}
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Qualified
                        </span>
                      </div>
                      <p className="text-xl font-semibold mt-1">
                        {job.metrics?.qualified}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Your match score
                  </span>
                  <Badge className="text-lg px-3 py-1">{job.score}%</Badge>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${job.score}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm mt-4">
                  Your profile matches {job.score}% of the qualifications for
                  this position.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed Match
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  );
}
