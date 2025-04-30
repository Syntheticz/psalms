"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Archive,
  Trash2,
  Briefcase,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function EmployerJobs() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - would come from your API in a real implementation
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      postedDate: "April 1, 2023",
      applications: 42,
      status: "Active",
      topCandidates: 8,
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      postedDate: "March 25, 2023",
      applications: 28,
      status: "Active",
      topCandidates: 5,
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      postedDate: "March 20, 2023",
      applications: 35,
      status: "Active",
      topCandidates: 7,
    },
    {
      id: 4,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Chicago, IL",
      postedDate: "March 15, 2023",
      applications: 19,
      status: "Closed",
      topCandidates: 3,
    },
    {
      id: 5,
      title: "Data Scientist",
      department: "Data",
      location: "Boston, MA",
      postedDate: "March 10, 2023",
      applications: 31,
      status: "Active",
      topCandidates: 6,
    },
    {
      id: 6,
      title: "Customer Success Manager",
      department: "Customer Support",
      location: "Austin, TX",
      postedDate: "March 5, 2023",
      applications: 24,
      status: "Closed",
      topCandidates: 4,
    },
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 px-4 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">
            Manage your active and closed job postings
          </p>
        </div>
        <Link href="/employer/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="closed">Closed Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredJobs.filter((job) => job.status === "Active").length ===
          0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No active jobs found</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Try adjusting your search or post a new job.
                </p>
                <Link href="/employer/jobs/new" className="mt-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post a Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium border-b bg-muted/50">
                <div className="col-span-4">Job Title</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Posted Date</div>
                <div className="col-span-1 text-center">Applications</div>
                <div className="col-span-1 text-center">Top Matches</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {filteredJobs
                .filter((job) => job.status === "Active")
                .map((job) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/50 border-b last:border-0"
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link
                              href={`/employer/jobs/${job.id}/edit`}
                              className="flex w-full items-center"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Close Job
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {filteredJobs.filter((job) => job.status === "Closed").length ===
          0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Archive className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No closed jobs found</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Closed jobs will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium border-b bg-muted/50">
                <div className="col-span-4">Job Title</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Closed Date</div>
                <div className="col-span-1 text-center">Applications</div>
                <div className="col-span-1 text-center">Hired</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {filteredJobs
                .filter((job) => job.status === "Closed")
                .map((job) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/50 border-b last:border-0"
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
                    <div className="col-span-1 text-center">1</div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Link href={`/employer/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Reopen Job
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
