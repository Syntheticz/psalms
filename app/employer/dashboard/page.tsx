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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  FileText,
  User,
  Settings,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { fetchJobPostings, fetchTopCandidates } from "@/lib/queries/jobs";
import { useQuery } from "@tanstack/react-query";

export default function EmployerDashboard() {
  const { data: jobPostings } = useQuery({
    queryKey: ["jobPostings"],
    queryFn: async () => await fetchJobPostings(),
  });

  const { data: topCandidates } = useQuery({
    queryKey: ["topCandidates"],
    queryFn: async () => await fetchTopCandidates(),
  });

  const averageMatchScore = topCandidates
    ? topCandidates.reduce((sum, item) => sum + item.matchScore, 0) /
        topCandidates.length || 0
    : 0;
  return (
    <div className="container mx-auto py-6 px-4 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your job postings and candidates
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Jobs
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobPostings?.filter((job) => job.status === "Active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Applications
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobPostings?.reduce(
                    (total, job) => total + job.applications,
                    0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Candidates
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobPostings?.reduce(
                    (total, job) => total + job.topCandidates,
                    0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Match Score
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageMatchScore}%</div>
                <Progress value={averageMatchScore} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Job Postings</CardTitle>
                <CardDescription>
                  Your active and recent job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPostings?.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center space-x-4 rounded-md border p-4"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {job.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {job.department} • {job.location}
                        </p>
                        <div className="flex items-center pt-1">
                          <Badge
                            variant={
                              job.status === "Active" ? "default" : "secondary"
                            }
                            className="mr-2"
                          >
                            {job.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Posted: {job.postedDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">
                            {job.applications} Applications
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {job.topCandidates} Top Candidates
                          </span>
                        </div>
                        <Link href={`/employer/jobs/${job.id}`}>
                          <Button size="sm" className="mt-2">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/employer/jobs" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Job Postings
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Candidates</CardTitle>
                <CardDescription>
                  Highest matching candidates for your jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {topCandidates?.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center space-x-4 rounded-md border p-4"
                      >
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${candidate.name.charAt(
                              0
                            )}`}
                          />
                          <AvatarFallback>
                            {candidate.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {candidate.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {candidate.position}
                          </p>
                        </div>
                        <div>
                          <Badge className="bg-green-600 mb-1">
                            {candidate.matchScore}%
                          </Badge>
                          <div>
                            <Badge
                              variant={
                                candidate.status === "SHORTLISTED"
                                  ? "default"
                                  : candidate.status === "REVIEW"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {candidate.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Link href="/employer/candidates" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Candidates
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Job Postings</CardTitle>
                <CardDescription>
                  Manage your active and closed job postings
                </CardDescription>
              </div>
              <Link href="/employer/jobs/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search jobs..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Active
                  </Button>
                  <Button variant="ghost" size="sm">
                    Closed
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium border-b">
                  <div className="col-span-4">Job Title</div>
                  <div className="col-span-2">Department</div>
                  <div className="col-span-2">Posted Date</div>
                  <div className="col-span-1 text-center">Applications</div>
                  <div className="col-span-1 text-center">Top Matches</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {jobPostings?.map((job) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/50"
                  >
                    <div className="col-span-4">
                      <div className="font-medium">{job.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {job.location}
                      </div>
                    </div>
                    <div className="col-span-2">{job.department}</div>
                    <div className="col-span-2">{job.postedDate}</div>
                    <div className="col-span-1 text-center">
                      {job.applications}
                    </div>
                    <div className="col-span-1 text-center">
                      {job.topCandidates}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Link href={`/employer/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/employer/jobs/${job.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Candidates</CardTitle>
              <CardDescription>
                Review and manage candidates with the highest match scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search candidates..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    All
                  </Button>
                  <Button variant="ghost" size="sm">
                    Shortlisted
                  </Button>
                  <Button variant="ghost" size="sm">
                    Under Review
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {topCandidates?.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center space-x-4 rounded-md border p-4"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${candidate.name.charAt(
                          0
                        )}`}
                      />
                      <AvatarFallback>
                        {candidate.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="font-medium truncate">{candidate.name}</p>
                        <Badge
                          variant={
                            candidate.status === "SHORTLISTED"
                              ? "default"
                              : candidate.status === "REVIEW"
                              ? "secondary"
                              : "outline"
                          }
                          className="ml-2"
                        >
                          {candidate.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Applied for: {candidate.position}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className="bg-green-600 mb-2">
                        {candidate.matchScore}% Match
                      </Badge>
                      <div className="flex gap-2">
                        <Link href={`/employer/candidates/${candidate.id}`}>
                          <Button size="sm">View Profile</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            {/* <CardFooter>
              <Link href="/employer/candidates" className="w-full">
                <Button variant="outline" className="w-full">
                  View All Candidates
                </Button>
              </Link>
            </CardFooter> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
