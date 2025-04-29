"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Briefcase,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function ApplicantApplications() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - would come from your API in a real implementation
  const applications = [
    {
      id: 101,
      jobTitle: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      location: "Remote",
      appliedDate: "2023-04-01",
      status: "Shortlisted",
      interviewDate: "2023-04-15",
      feedback: "Great technical skills, moving to next round.",
      nextSteps: "Technical interview scheduled.",
    },
    {
      id: 102,
      jobTitle: "Full Stack Developer",
      company: "Digital Innovations",
      location: "New York, NY",
      appliedDate: "2023-03-28",
      status: "Under Review",
      interviewDate: null,
      feedback: null,
      nextSteps: "Application is being reviewed by the hiring team.",
    },
    {
      id: 103,
      jobTitle: "Frontend Engineer",
      company: "Creative Web Solutions",
      location: "San Francisco, CA",
      appliedDate: "2023-03-15",
      status: "Rejected",
      interviewDate: null,
      feedback:
        "We found candidates with more experience in our specific tech stack.",
      nextSteps: null,
    },
    {
      id: 104,
      jobTitle: "DevOps Engineer",
      company: "Cloud Systems",
      location: "Remote",
      appliedDate: "2023-03-10",
      status: "Interview Scheduled",
      interviewDate: "2023-04-20",
      feedback:
        "Resume looks promising, would like to discuss your experience further.",
      nextSteps: "Prepare for the technical interview.",
    },
    {
      id: 105,
      jobTitle: "Mobile Developer",
      company: "App Creators",
      location: "Austin, TX",
      appliedDate: "2023-02-28",
      status: "Offer Received",
      interviewDate: "2023-03-15",
      feedback: "Excellent cultural fit and technical skills.",
      nextSteps: "Review offer letter and respond by April 10.",
    },
  ];

  const filteredApplications = applications.filter(
    (app) =>
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Shortlisted":
      case "Interview Scheduled":
      case "Offer Received":
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case "Under Review":
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      default:
        return (
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
      case "Interview Scheduled":
        return "default";
      case "Under Review":
        return "secondary";
      case "Rejected":
        return "destructive";
      case "Offer Received":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 bg-background">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Application Tracker</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Monitor the status of your job applications
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
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

      <Tabs defaultValue="all" className="space-y-4">
        <div className="overflow-x-auto -mx-3 px-3">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All Applications
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs sm:text-sm">
              Active
            </TabsTrigger>
            <TabsTrigger value="interviews" className="text-xs sm:text-sm">
              Interviews
            </TabsTrigger>
            <TabsTrigger value="offers" className="text-xs sm:text-sm">
              Offers
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-10">
                <Briefcase className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium">
                  No applications found
                </h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-0">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium">
                          {app.jobTitle}
                        </h3>
                        <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground mt-1">
                          <Building className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="mr-2">{app.company}</span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{app.location}</span>
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={getStatusColor(app.status) as never}
                        className="self-start sm:self-auto text-xs sm:text-sm px-2 py-1"
                      >
                        <span className="flex items-center">
                          {getStatusIcon(app.status)}
                          <span className="ml-1">{app.status}</span>
                        </span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Applied Date
                        </p>
                        <div className="flex items-center mt-1">
                          <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm">
                            {app.appliedDate}
                          </span>
                        </div>
                      </div>

                      {app.interviewDate && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Interview Date
                          </p>
                          <div className="flex items-center mt-1">
                            <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <span className="text-xs sm:text-sm">
                              {app.interviewDate}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {(app.feedback || app.nextSteps) && (
                      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-muted rounded-md">
                        {app.feedback && (
                          <div className="mb-2">
                            <p className="text-xs sm:text-sm font-medium">
                              Feedback:
                            </p>
                            <p className="text-xs sm:text-sm">{app.feedback}</p>
                          </div>
                        )}

                        {app.nextSteps && (
                          <div>
                            <p className="text-xs sm:text-sm font-medium">
                              Next Steps:
                            </p>
                            <p className="text-xs sm:text-sm">
                              {app.nextSteps}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end bg-muted/50 p-3 sm:p-4 border-t">
                    <div className="flex gap-2">
                      <Link href={`/applicant/jobs/${app.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 sm:text-sm"
                        >
                          View Job
                        </Button>
                      </Link>
                      <Link href={`/applicant/applications/${app.id}`}>
                        <Button size="sm" className="text-xs h-8 sm:text-sm">
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

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Active Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-sm">
                Your active applications will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-sm">
                Your scheduled interviews will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Job Offers</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-sm">Your job offers will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
