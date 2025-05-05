"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  BarChart3,
  Building,
  Calendar,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Phone,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { JobWithRelation } from "@/lib/types/job";
import { useQuery } from "@tanstack/react-query";
import { fetchJobById, fetchJobs } from "@/lib/queries/jobs";
import { notFound } from "next/navigation";

export default function EmployerJobViewPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real application, you would fetch the job data based on the ID
  const { id } = params;
  // const job = await getJobById(id);
  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
    enabled: !!id, // ensures query runs only when id is defined
  });

  console.log(isLoading);
  const [isActive, setIsActive] = useState(job?.isActive);

  const toggleJobStatus = () => {
    setIsActive(!isActive);
    toast(`Job ${!isActive ? "activated" : "deactivated"}`, {
      description: `The job posting has been ${
        !isActive ? "activated" : "deactivated"
      }.`,
    });
  };

  const handleDeleteJob = () => {
    toast("Job deleted", {
      description: "The job posting has been deleted.",
    });
    // In a real app, you would redirect to the jobs list page after deletion
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "qualified":
        return "bg-green-500";
      case "interviewed":
        return "bg-purple-500";
      case "rejected":
        return "bg-red-500";
      case "hired":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!isLoading && !job) {
    notFound();
  }

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Link
            href="/employer/jobs"
            className="mr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold">{job?.job_title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="job-status"
              checked={isActive}
              onCheckedChange={toggleJobStatus}
            />
            <label htmlFor="job-status" className="text-sm font-medium">
              {isActive ? "Active" : "Inactive"}
            </label>
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Job
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate Job</DropdownMenuItem>
              <DropdownMenuItem>Promote Job</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteJob}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {/* <TabsTrigger value="applicants">
                Applicants ({job.applicants.length})
              </TabsTrigger> */}
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Job Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>
                    Posted on {format(job.createdAt, "MMMM d, yyyy")} • Last
                    updated {format(job.updatedAt, "MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center text-sm">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{job.industry_field}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{job.company_address}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        Posted {format(job.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{job.contact}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">
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
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Job Description
                    </h3>
                    <p className="text-sm whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Qualifications</CardTitle>
                  <CardDescription>
                    Requirements and credentials for this position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {job.qualifications.map((qualification) => (
                    <div key={qualification.id} className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            qualification.priority ? "bg-primary" : "bg-muted"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium">
                            {qualification.requirement}
                            {qualification.priority && (
                              <Badge className="ml-2" variant="outline">
                                Priority
                              </Badge>
                            )}
                          </h4>

                          {qualification.possible_credentials.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">
                                Accepted Credentials:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {qualification.possible_credentials.map(
                                  (credential, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {credential}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {qualification.categories.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">
                                Categories:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {qualification.categories.map(
                                  (category, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {category}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {qualification.id !==
                        job.qualifications[job.qualifications.length - 1]
                          .id && <Separator className="my-2" />}
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Qualifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="applicants" className="space-y-6 mt-6">
              {/* Applicants Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Applicants Overview</CardTitle>
                  <CardDescription>
                    {job.metrics.applications} total applications •{" "}
                    {job.metrics.qualified} qualified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Application Pipeline</span>
                        <span>{job.metrics.applications} total</span>
                      </div>
                      <div className="flex h-2 items-center gap-1">
                        <div
                          className="h-full bg-blue-500 rounded-sm"
                          style={{
                            width: `${
                              ((job.metrics.applications -
                                job.metrics.qualified) *
                                100) /
                              job.metrics.applications
                            }%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
                          <span>
                            New (
                            {job.metrics.applications - job.metrics.qualified})
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                          <span>Qualified ({job.metrics.qualified})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applicants List Card */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Applicants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="font-medium text-sm">
                              {applicant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{applicant.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {applicant.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(
                                  applicant.status
                                )}`}
                              />
                              <span className="text-sm">
                                {getStatusText(applicant.status)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {format(applicant.appliedAt, "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="w-12 text-center">
                            <div className="text-sm font-medium">
                              {applicant.matchScore}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Match
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">View All Applicants</Button>
                </CardFooter>
              </Card> */}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              {/* Analytics Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Performance</CardTitle>
                  <CardDescription>
                    Last 30 days • Posted on{" "}
                    {format(job.createdAt, "MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Views</p>
                      <p className="text-2xl font-bold">{job.metrics.views}</p>
                      <p className="text-xs text-green-600">
                        +12% from last week
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Applications
                      </p>
                      <p className="text-2xl font-bold">
                        {job.metrics.applications}
                      </p>
                      <p className="text-xs text-green-600">
                        +5% from last week
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Qualified</p>
                      <p className="text-2xl font-bold">
                        {job.metrics.qualified}
                      </p>
                      <p className="text-xs text-green-600">
                        +8% from last week
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Conversion Rate
                      </p>
                      <p className="text-2xl font-bold">
                        {(
                          (job.metrics.applications / job.metrics.views) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                      <p className="text-xs text-red-600">-2% from last week</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <h3 className="text-sm font-medium">Application Funnel</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Views</span>
                        <span>{job.metrics.views}</span>
                      </div>
                      <Progress value={100} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span>Applications</span>
                        <span>
                          {job.metrics.applications} (
                          {(
                            (job.metrics.applications / job.metrics.views) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <Progress
                        value={
                          (job.metrics.applications / job.metrics.views) * 100
                        }
                        className="h-2"
                      />

                      <div className="flex justify-between text-sm">
                        <span>Qualified</span>
                        <span>
                          {job.metrics.qualified} (
                          {(
                            (job.metrics.qualified / job.metrics.views) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <Progress
                        value={
                          (job.metrics.qualified / job.metrics.views) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Candidate Sources Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Sources</CardTitle>
                  <CardDescription>
                    Where your applicants are coming from
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary rounded-full mr-2" />
                        <span>Direct</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">42%</span>
                        <Progress value={42} className="w-24 h-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                        <span>LinkedIn</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">28%</span>
                        <Progress value={28} className="w-24 h-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                        <span>Indeed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">15%</span>
                        <Progress value={15} className="w-24 h-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                        <span>Glassdoor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">10%</span>
                        <Progress value={10} className="w-24 h-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-2" />
                        <span>Other</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">5%</span>
                        <Progress value={5} className="w-24 h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                  <Eye className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold">{job.metrics.views}</span>
                  <span className="text-xs text-muted-foreground">Views</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold">
                    {job.metrics.applications}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Applications
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                  <BarChart3 className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold">
                    {(
                      (job.metrics.applications / job.metrics.views) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Conversion
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold">
                    {Math.floor(
                      (new Date().getTime() - job.createdAt.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Days Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Applicants
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Job Posting
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Export Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Similar Jobs Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Other Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-medium">Junior Full Stack Developer</h4>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-muted-foreground">
                      15 applications
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full">
                View All Your Jobs
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
