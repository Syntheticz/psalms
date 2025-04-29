"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function ApplicantJobs() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - would come from your API in a real implementation
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      location: "Remote",
      matchScore: 92,
      postedDate: "2 days ago",
      salary: "$120,000 - $150,000",
      skills: ["React", "Node.js", "TypeScript"],
      type: "Full-time",
      description:
        "We are looking for a Senior Software Engineer to join our team and help build scalable web applications...",
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
      type: "Full-time",
      description:
        "Join our team to develop cutting-edge web applications using modern technologies...",
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
      type: "Full-time",
      description:
        "We're seeking a talented Frontend Engineer to create beautiful and responsive user interfaces...",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "Cloud Systems",
      location: "Remote",
      matchScore: 81,
      postedDate: "5 days ago",
      salary: "$115,000 - $145,000",
      skills: ["Docker", "Kubernetes", "AWS"],
      type: "Full-time",
      description:
        "Help us build and maintain our cloud infrastructure and CI/CD pipelines...",
    },
    {
      id: 5,
      title: "Mobile Developer",
      company: "App Creators",
      location: "Austin, TX",
      matchScore: 75,
      postedDate: "1 week ago",
      salary: "$95,000 - $125,000",
      skills: ["React Native", "iOS", "Android"],
      type: "Full-time",
      description:
        "Join our mobile team to build cross-platform applications using React Native...",
    },
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto py-4 md:py-6 px-3 md:px-4 bg-background">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Find Your Perfect Job</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Browse jobs matched to your skills and preferences
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, skills, or companies..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="recommended" className="space-y-4">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="recent">Recently Posted</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No jobs found</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                      <div>
                        <h3 className="text-base md:text-lg font-medium">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground">{job.company}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                            {job.postedDate}
                          </div>
                          <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                            <DollarSign className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-600 self-start sm:self-auto">
                        {job.matchScore}% Match
                      </Badge>
                    </div>

                    <div className="mt-3 md:mt-4">
                      <p className="text-xs md:text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3 md:mt-4">
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

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/50 p-3 md:p-4 border-t gap-3">
                    <div className="flex items-center">
                      <span className="text-xs md:text-sm font-medium mr-2">
                        Match Score:
                      </span>
                      <Progress
                        value={job.matchScore}
                        className="w-20 md:w-24 h-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Save
                      </Button>
                      <Link href={`/applicant/jobs/${job.id}`}>
                        <Button size="sm" className="text-xs">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Posted Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Recently posted jobs will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your saved jobs will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
