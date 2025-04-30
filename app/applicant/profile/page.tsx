"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Upload,
  Edit,
  File,
  Download,
  Award,
  CheckCircle,
} from "lucide-react";

export default function ApplicantProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock user data - would come from your API in a real implementation
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    bio: "Experienced software engineer with a passion for building user-friendly web applications. Specialized in React, Node.js, and TypeScript.",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "GraphQL",
      "AWS",
      "Docker",
      "JavaScript",
      "HTML/CSS",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "CI/CD",
      "Agile Methodologies",
    ],
    experience: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "Tech Innovations Inc.",
        location: "San Francisco, CA",
        startDate: "Jan 2020",
        endDate: "Present",
        description:
          "Lead frontend development for a SaaS platform with over 50,000 users. Implemented new features, improved performance, and mentored junior developers.",
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "Web Solutions LLC",
        location: "Austin, TX",
        startDate: "Mar 2017",
        endDate: "Dec 2019",
        description:
          "Developed responsive web applications using React and Redux. Collaborated with designers and backend developers to implement new features.",
      },
      {
        id: 3,
        title: "Junior Web Developer",
        company: "Digital Agency",
        location: "Chicago, IL",
        startDate: "Jun 2015",
        endDate: "Feb 2017",
        description:
          "Built websites and web applications for various clients using HTML, CSS, and JavaScript.",
      },
    ],
    education: [
      {
        id: 1,
        degree: "Master of Computer Science",
        institution: "Stanford University",
        location: "Stanford, CA",
        startDate: "2013",
        endDate: "2015",
        description:
          "Focused on Human-Computer Interaction and Web Technologies.",
      },
      {
        id: 2,
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Illinois",
        location: "Urbana-Champaign, IL",
        startDate: "2009",
        endDate: "2013",
        description:
          "Graduated with honors. Participated in ACM programming competitions.",
      },
    ],
    certificates: [
      {
        id: 1,
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "May 2023",
        expiryDate: "May 2026",
        credentialId: "AWS-SA-12345",
        url: "https://aws.amazon.com/verification",
      },
      {
        id: 2,
        name: "Professional Scrum Master I",
        issuer: "Scrum.org",
        issueDate: "January 2022",
        expiryDate: "No Expiration",
        credentialId: "PSM-I-87654",
        url: "https://www.scrum.org/certificates",
      },
      {
        id: 3,
        name: "React and Redux Professional Certification",
        issuer: "Frontend Masters",
        issueDate: "March 2021",
        expiryDate: "March 2024",
        credentialId: "FM-RR-54321",
        url: "https://frontendmasters.com/certificates",
      },
    ],
    technicalSkills: [
      { id: 1, name: "React", category: "Technical" },
      { id: 2, name: "TypeScript", category: "Technical" },
      { id: 3, name: "Node.js", category: "Technical" },
      { id: 4, name: "GraphQL", category: "Technical" },
      { id: 5, name: "AWS", category: "Technical" },
      { id: 6, name: "Docker", category: "Technical" },
      { id: 7, name: "MongoDB", category: "Technical" },
      { id: 8, name: "PostgreSQL", category: "Technical" },
      { id: 9, name: "REST API Design", category: "Technical" },
    ],
    softSkills: [
      { id: 1, name: "Team Leadership", category: "Soft" },
      { id: 2, name: "Project Management", category: "Soft" },
      { id: 3, name: "Problem Solving", category: "Soft" },
      { id: 4, name: "Communication", category: "Soft" },
      { id: 5, name: "Mentoring", category: "Soft" },
      { id: 6, name: "Agile Methodologies", category: "Soft" },
      { id: 7, name: "Time Management", category: "Soft" },
    ],
    hardSkills: [
      { id: 1, name: "System Design", category: "Hard" },
      { id: 2, name: "Database Optimization", category: "Hard" },
      { id: 3, name: "UI/UX Design", category: "Hard" },
      { id: 4, name: "Frontend Architecture", category: "Hard" },
      { id: 5, name: "Backend Architecture", category: "Hard" },
      { id: 6, name: "Data Analysis", category: "Hard" },
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Intermediate" },
      { language: "French", proficiency: "Basic" },
    ],
    profileCompletion: 85,
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      // Show success message
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6 px-4 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and resume
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src="/placeholder.svg?height=96&width=96"
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">
                  Senior Frontend Developer
                </p>
                <p className="flex items-center text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-muted-foreground mr-3" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.website.replace("https://", "")}
                  </a>
                </div>
              </div>

              {/* <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Profile Completion
                  </span>
                  <span className="text-sm font-medium">
                    {user.profileCompletion}%
                  </span>
                </div>
                <Progress value={user.profileCompletion} className="h-2" />
              </div> */}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm" className="h-6">
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.languages.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{item.language}</span>
                  <Badge variant="secondary">{item.proficiency}</Badge>
                </div>
              ))}
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded mr-3">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Resume.pdf</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on Apr 10, 2023
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="space-y-4">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      defaultValue={user.bio}
                      placeholder="Write a short bio about yourself..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p>{user.bio}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Work Experience</CardTitle>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Experience
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {user.experience.map((exp) => (
                    <div key={exp.id} className="relative">
                      {isEditing && (
                        <div className="absolute right-0 top-0 flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <Briefcase className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{exp.title}</h3>
                          <p className="text-muted-foreground">
                            {exp.company} • {exp.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {exp.startDate} - {exp.endDate}
                          </p>
                          <p className="mt-2 text-sm">{exp.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Education</CardTitle>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {user.education.map((edu) => (
                    <div key={edu.id} className="relative">
                      {isEditing && (
                        <div className="absolute right-0 top-0 flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-muted-foreground">
                            {edu.institution} • {edu.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          <p className="mt-2 text-sm">{edu.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Certificates & Licenses</CardTitle>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Certificate
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {user.certificates.map((cert) => (
                    <div key={cert.id} className="relative">
                      {isEditing && (
                        <div className="absolute right-0 top-0 flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <Award className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{cert.name}</h3>
                          <p className="text-muted-foreground">{cert.issuer}</p>
                          <p className="text-sm text-muted-foreground">
                            Issued: {cert.issueDate} • Expires:{" "}
                            {cert.expiryDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Credential ID: {cert.credentialId}
                          </p>
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm mt-1 inline-block"
                          >
                            See credential
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Technical Skills</CardTitle>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Technical Skill
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.technicalSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="group relative inline-flex"
                      >
                        <Badge variant="outline" className="pr-8">
                          {skill.name}
                        </Badge>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Hard Skills</CardTitle>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Hard Skill
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.hardSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="group relative inline-flex"
                      >
                        <Badge variant="outline" className="pr-8">
                          {skill.name}
                        </Badge>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Soft Skills</CardTitle>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Soft Skill
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.softSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="group relative inline-flex"
                      >
                        <Badge variant="secondary" className="pr-8">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {skill.name}
                        </Badge>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={user.phone} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={user.location} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue={user.website} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
