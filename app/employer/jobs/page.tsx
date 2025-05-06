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
  Eye,
  Users,
  BookmarkCheck,
  CheckCircle,
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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { JobWithRelation } from "@/lib/types/job";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/lib/queries/jobs";

export default function EmployerJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState<string | null>(null);

  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => await fetchJobs(),
  });

  // Get unique industry fields for filtering
  const industries = Array.from(
    new Set(jobs?.map((job) => job.industry_field))
  );

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      !filterIndustry || job.industry_field === filterIndustry;

    return matchesSearch && matchesIndustry;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              {filterIndustry
                ? `Industry: ${filterIndustry}`
                : "Filter by Industry"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Select Industry</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterIndustry(null)}>
              All Industries
            </DropdownMenuItem>
            {industries.map((industry) => (
              <DropdownMenuItem
                key={industry}
                onClick={() => setFilterIndustry(industry)}
              >
                {industry}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="closed">Closed Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredJobs?.filter((job) => job.isActive).length === 0 ? (
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
                <div className="col-span-2">Industry</div>
                <div className="col-span-2">Posted Date</div>
                <div className="col-span-3 text-center">Metrics</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {filteredJobs &&
                filteredJobs
                  .filter((job) => job.isActive)
                  .map((job) => (
                    <div
                      key={job.id}
                      className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/50 border-b last:border-0"
                    >
                      <div className="col-span-4">
                        <div className="font-medium">{job.job_title}</div>
                        <div className="text-xs text-muted-foreground">
                          {job.company_name} •{" "}
                          {job.company_address.split(",")[0]}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline">{job.industry_field}</Badge>
                      </div>
                      <div className="col-span-2">
                        {formatDate(job.createdAt)}
                      </div>
                      <div className="col-span-3 flex justify-center gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span>{job.metrics?.views}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Views</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{job.metrics?.applications}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Applications</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
                                <span>{job.metrics?.saved}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Saved</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                <span>{job.metrics?.qualified}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Qualified Candidates</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="col-span-1 flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
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
                                href={`/employer/jobs/${job.id}`}
                                className="flex w-full items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
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
                              <Link
                                href={`/employer/jobs/${job.id}/applicants`}
                                className="flex w-full items-center"
                              >
                                <Users className="mr-2 h-4 w-4" />
                                View Applicants
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
          {filteredJobs?.filter((job) => !job.isActive).length === 0 ? (
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
                <div className="col-span-2">Industry</div>
                <div className="col-span-2">Closed Date</div>
                <div className="col-span-3 text-center">Metrics</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {filteredJobs &&
                filteredJobs
                  .filter((job) => !job.isActive)
                  .map((job) => (
                    <div
                      key={job.id}
                      className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/50 border-b last:border-0"
                    >
                      <div className="col-span-4">
                        <div className="font-medium">{job.job_title}</div>
                        <div className="text-xs text-muted-foreground">
                          {job.company_name} •{" "}
                          {job.company_address.split(",")[0]}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline">{job.industry_field}</Badge>
                      </div>
                      <div className="col-span-2">
                        {formatDate(job.updatedAt)}
                      </div>
                      <div className="col-span-3 flex justify-center gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span>{job.metrics?.views}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Views</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{job.metrics?.applications}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Applications</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                <span>{job.metrics?.qualified}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Qualified Candidates</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="col-span-1 flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
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
                                href={`/employer/jobs/${job.id}`}
                                className="flex w-full items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/employer/jobs/${job.id}/applicants`}
                                className="flex w-full items-center"
                              >
                                <Users className="mr-2 h-4 w-4" />
                                View Applicants
                              </Link>
                            </DropdownMenuItem>
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
