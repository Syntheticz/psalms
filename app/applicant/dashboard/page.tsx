"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, FileText, User } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  evaluateJobForApplicant,
  fetchEvaluatedJobs,
} from "@/lib/queries/jobs";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserApplication,
  fetchUserApplicationForDashboard,
} from "@/lib/queries/application";
import { format, formatDate } from "date-fns";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function ApplicantDashboard() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - would come from your API in a real implementation
  const { data: recommendedJobs } = useQuery({
    queryKey: ["recommendedJobs"],
    queryFn: async () => await fetchEvaluatedJobs(),
  });

  const { data: applications } = useQuery({
    queryKey: ["applicationDashboard"],
    queryFn: async () => await fetchUserApplicationForDashboard(),
  });

  if (!applications && !recommendedJobs) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  function getAvgMatchScore() {
    if (!recommendedJobs) return 0;
    return recommendedJobs.length > 0
      ? recommendedJobs.reduce((acc, num) => acc + num.matchScore, 0) /
          recommendedJobs.length
      : 0;
  }

  const handleEvaluate = async () => {
    if (session.data?.user.role === "APPLICANT") {
      if (session.data?.user.isVerified) {
        try {
          setIsLoading(true);
          await evaluateJobForApplicant(session.data.user.id || "");
          toast.success("Evaluation Success!");
          setIsLoading(false);
        } catch (error) {
          toast.error("Evaluation Failed!");
          console.log(error);
          setIsLoading(false);
        }
      } else {
        toast.error("Evaluation Failed!");
        setIsLoading(false);
      }
    } else {
      toast.error("Evaluation Failed!");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 bg-background">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          Welcome back, {session.data?.user.name}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Here's what's happening with your job search
        </p>
      </div>{" "}
      <div className="flex justify-center mb-12">
        <Button
          size="lg"
          className="rounded-full"
          onClick={() => handleEvaluate()}
          disabled={isLoading}
        >
          {isLoading ? "Evaluating..." : "Evaluate Now"}
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Match Score
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getAvgMatchScore()}%</div>
                <p className="text-xs text-muted-foreground">
                  Average match score across all jobs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Applications
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {applications?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total applications submitted
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Top Job Matches</CardTitle>
                <CardDescription>
                  Jobs that best match your profile based on fuzzy logic
                  evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedJobs && recommendedJobs.length > 0
                    ? recommendedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 rounded-md border p-3 sm:p-4"
                        >
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {job.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {job.company} • {job.location}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {job.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col justify-between sm:items-end">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium text-green-600">
                                {job.matchScore}%
                              </span>
                              <Progress
                                value={job.matchScore}
                                className="w-16 h-2"
                              />
                            </div>
                            <Link href={`/applicant/jobs/${job.id}`}>
                              <Button size="sm" className="mt-2">
                                View Job
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/applicant/jobs" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Recommendations
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Track the status of your job applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 sm:h-80 md:h-72 lg:h-80">
                  <div className="space-y-4">
                    {applications && applications.length > 0
                      ? applications.map((app) => (
                          <div
                            key={app.id}
                            className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 rounded-md border p-3 sm:p-4"
                          >
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {app.jobTitle}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {app.company}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Applied:{" "}
                                {format(app.appliedDate, "EEE, MMM d, yyyy")}
                              </p>
                            </div>
                            <div className="flex flex-row justify-between items-center sm:flex-col sm:items-end">
                              <Badge
                                variant={
                                  app.status === "SHORTLISTED"
                                    ? "default"
                                    : app.status === "REVIEW"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {app.status}
                              </Badge>
                              {app.interviewDate && (
                                <p className="text-xs text-muted-foreground ml-2 sm:ml-0 sm:mt-1">
                                  Interview: {app.interviewDate}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Link href="/applicant/applications" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Applications
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Recommendations</CardTitle>
              <CardDescription>
                Personalized job recommendations based on your profile and
                preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedJobs?.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col space-y-2 rounded-md border p-3 sm:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.company} • {job.location}
                        </p>
                      </div>
                      <Badge className="bg-green-600 self-start mt-1 sm:mt-0">
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-sm">{job.salary}</p>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Posted {job.postedDate}
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                      <Link
                        href={`/applicant/jobs/${job.id}/apply`}
                        className="w-full sm:w-auto"
                      >
                        <Button className="w-full sm:w-auto">Apply Now</Button>
                      </Link>
                      <Link
                        href={`/applicant/jobs/${job.id}`}
                        className="w-full sm:w-auto"
                      >
                        <Button variant="outline" className="w-full sm:w-auto">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Tracker</CardTitle>
              <CardDescription>
                Monitor the status of your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications?.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col space-y-2 rounded-md border p-3 sm:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="font-medium">{app.jobTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {app.company}
                        </p>
                      </div>
                      <Badge
                        variant={
                          app.status === "SHORTLISTED"
                            ? "default"
                            : app.status === "REVIEW"
                            ? "secondary"
                            : "destructive"
                        }
                        className="self-start mt-1 sm:mt-0"
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Applied Date:</p>
                        <p>{format(app.appliedDate, "EEE, MMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interview Date:</p>
                        <p>{app.interviewDate || "Not scheduled"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                      <Link
                        href={`/applicant/applications/${app.id}`}
                        className="w-full sm:w-auto"
                      >
                        <Button variant="outline" className="w-full sm:w-auto">
                          View Application
                        </Button>
                      </Link>
                      {app.status === "SHORTLISTED" && (
                        <Link
                          href={`/applicant/applications/${app.id}/interview`}
                          className="w-full sm:w-auto"
                        >
                          <Button className="w-full sm:w-auto">
                            Prepare for Interview
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
