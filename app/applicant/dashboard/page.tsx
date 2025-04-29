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

export default function ApplicantDashboard() {
  const session = useSession();
  // Mock data - would come from your API in a real implementation
  const recommendedJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      location: "Remote",
      matchScore: 92,
      postedDate: "2 days ago",
      salary: "$120,000 - $150,000",
      skills: ["React", "Node.js", "TypeScript"],
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Digital Innovations",
      location: "New York, NY",
      matchScore: 87,
      postedDate: "1 week ago",
      salary: "$100,000 - $130,000",
      skills: ["JavaScript", "Python", "AWS"],
    },
    {
      id: 3,
      title: "Frontend Engineer",
      company: "Creative Web Solutions",
      location: "San Francisco, CA",
      matchScore: 78,
      postedDate: "3 days ago",
      salary: "$110,000 - $140,000",
      skills: ["React", "CSS", "UI/UX"],
    },
  ];

  const applications = [
    {
      id: 101,
      jobTitle: "Data Scientist",
      company: "Data Analytics Co.",
      appliedDate: "2023-04-01",
      status: "Shortlisted",
      interviewDate: "2023-04-15",
    },
    {
      id: 102,
      jobTitle: "Machine Learning Engineer",
      company: "AI Innovations",
      appliedDate: "2023-03-28",
      status: "Under Review",
      interviewDate: null,
    },
    {
      id: 103,
      jobTitle: "Backend Developer",
      company: "Server Solutions",
      appliedDate: "2023-03-15",
      status: "Rejected",
      interviewDate: null,
    },
  ];

  return (
    <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 bg-background">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Welcome back, John!</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Here's what's happening with your job search
        </p>
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
                <div className="text-2xl font-bold">85%</div>
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
                <div className="text-2xl font-bold">{applications.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total applications submitted
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Interviews
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {applications.filter((app) => app.interviewDate).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Scheduled interviews
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
                  {recommendedJobs.map((job) => (
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
                  ))}
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
                    {applications.map((app) => (
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
                            Applied: {app.appliedDate}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between items-center sm:flex-col sm:items-end">
                          <Badge
                            variant={
                              app.status === "Shortlisted"
                                ? "default"
                                : app.status === "Under Review"
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
                    ))}
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
                {recommendedJobs.map((job) => (
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
                {applications.map((app) => (
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
                          app.status === "Shortlisted"
                            ? "default"
                            : app.status === "Under Review"
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
                        <p>{app.appliedDate}</p>
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
                      {app.status === "Shortlisted" && (
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
