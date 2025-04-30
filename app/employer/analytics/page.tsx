"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Filter } from "lucide-react";

// // Mock data for charts
// const applicationData = [
//   { name: "Jan", count: 12 },
//   { name: "Feb", count: 19 },
//   { name: "Mar", count: 25 },
//   { name: "Apr", count: 32 },
//   { name: "May", count: 28 },
//   { name: "Jun", count: 35 },
//   { name: "Jul", count: 42 },
//   { name: "Aug", count: 38 },
//   { name: "Sep", count: 45 },
//   { name: "Oct", count: 50 },
//   { name: "Nov", count: 48 },
//   { name: "Dec", count: 52 },
// ];

// const sourceData = [
//   { name: "Job Board", value: 45 },
//   { name: "Company Website", value: 25 },
//   { name: "Referral", value: 15 },
//   { name: "Social Media", value: 10 },
//   { name: "Other", value: 5 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// const jobPerformanceData = [
//   {
//     name: "Software Engineer",
//     applications: 120,
//     interviews: 25,
//     offers: 8,
//   },
//   {
//     name: "Product Manager",
//     applications: 85,
//     interviews: 18,
//     offers: 5,
//   },
//   {
//     name: "UX Designer",
//     applications: 95,
//     interviews: 20,
//     offers: 6,
//   },
//   {
//     name: "Data Scientist",
//     applications: 75,
//     interviews: 15,
//     offers: 4,
//   },
//   {
//     name: "Marketing",
//     applications: 65,
//     interviews: 12,
//     offers: 3,
//   },
// ];

// const timeToHireData = [
//   { name: "Jan", days: 35 },
//   { name: "Feb", days: 32 },
//   { name: "Mar", days: 30 },
//   { name: "Apr", days: 28 },
//   { name: "May", days: 25 },
//   { name: "Jun", days: 22 },
//   { name: "Jul", days: 20 },
//   { name: "Aug", days: 18 },
//   { name: "Sep", days: 15 },
//   { name: "Oct", days: 14 },
//   { name: "Nov", days: 12 },
//   { name: "Dec", days: 10 },
// ];

export default function EmployerAnalytics() {
  return (
    <div className="container mx-auto py-6 px-4 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track and analyze your recruitment metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 12 Months
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Time to Hire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 days</div>
                <p className="text-xs text-muted-foreground">
                  -3 days from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.2%</div>
                <p className="text-xs text-muted-foreground">
                  +0.5% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>
                  Monthly application volume for the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Applications Over Time Chart
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Application Sources</CardTitle>
                <CardDescription>
                  Where candidates are finding your jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Application Sources Chart
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
                <CardDescription>
                  Applications, interviews, and offers by job
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Job Performance Chart</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Time to Hire Trend</CardTitle>
                <CardDescription>
                  Average days to hire over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Time to Hire Trend Chart
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Analytics</CardTitle>
              <CardDescription>
                Detailed metrics about your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed application analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Analytics</CardTitle>
              <CardDescription>
                Performance metrics for your job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed job analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Analytics</CardTitle>
              <CardDescription>
                Insights about your candidate pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed candidate analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
