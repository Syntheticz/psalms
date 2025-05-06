    "use client"

    import { useQuery } from "@tanstack/react-query"
    import { Badge } from "@/components/ui/badge"
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import { Building, Clock, MapPin, Phone, Save, User } from "lucide-react"
    import  QualificationsList from "./qualifications-list"
    import MetricsDisplay  from "./metrics-display"
    import { formatDistanceToNow } from "date-fns"
    import { Skeleton } from "@/components/ui/skeleton"
    import { fetchJobById } from "@/lib/queries/jobs"
    import { notFound, useParams } from "next/navigation"



    export default function JobDetails() {
    const {id} = useParams<{id : string}>()

    const {
        data: job,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["job", id],
        queryFn: () => fetchJobById(id),
    })

    if (isLoading) {
        return <JobDetailsSkeleton />
    }


    if (error) {
        return (
        <Card className="w-full">
            <CardContent className="pt-6">
            <div className="text-center text-destructive">
                <p>Error loading job details. Please try again later.</p>
            </div>
            </CardContent>
        </Card>
        )
    }

    if(!isLoading &&!job) {
        notFound()
    }

    if(!job){
        notFound()
    }

    return (
        <div className="space-y-8">
        <Card className="w-full">
            <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                <div className="flex items-center gap-2">
                    <Badge variant={job.isActive ? "default" : "secondary"}>{job.isActive ? "Active" : "Inactive"}</Badge>
                    <span className="text-sm text-muted-foreground">
                    Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <CardTitle className="mt-2 text-2xl md:text-3xl">{job.job_title}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {job.company_name}
                </CardDescription>
                </div>
                <MetricsDisplay metrics={job.metrics} />
            </div>
            </CardHeader>
            <CardContent>
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Industry</h3>
                    <p className="text-muted-foreground">{job.industry_field}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Priority Categories</h3>
                    <div className="flex flex-wrap gap-2">
                    {job.priority_categories.map((category: string, index: number) => (
                        <Badge key={index} variant="outline">
                        {category}
                        </Badge>
                    ))}
                    </div>
                </div>
                </TabsContent>
                <TabsContent value="qualifications" className="pt-4">
                <QualificationsList qualifications={job.qualifications} />
                </TabsContent>
                <TabsContent value="company" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Company Name</span>
                    </div>
                    <p className="pl-7">{job.company_name}</p>
                    </div>
                    <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Address</span>
                    </div>
                    <p className="pl-7">{job.company_address}</p>
                    </div>
                    <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Contact</span>
                    </div>
                    <p className="pl-7">{job.contact}</p>
                    </div>
                </div>
                </TabsContent>
            </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t p-4">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
                <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last updated {formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })}
                </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {job.metrics.applications} Applicants
                </Badge> */}
                <Badge variant="outline" className="flex items-center gap-1">
                <Save className="h-3 w-3" />
                {job.metrics.saved} Saved
                </Badge>
            </div>
            </CardFooter>
        </Card>
        </div>
    )
    }

    function JobDetailsSkeleton() {
    return (
        <Card className="w-full">
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-64 mt-2" />
                <Skeleton className="h-4 w-40 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-16 w-24" />
                <Skeleton className="h-16 w-24" />
                <Skeleton className="h-16 w-24" />
                <Skeleton className="h-16 w-24" />
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
        </CardFooter>
        </Card>
    )
    }
