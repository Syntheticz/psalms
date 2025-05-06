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
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Building,
  Users,
  Plus,
  Trash2,
  Upload,
  Edit,
  File,
  Download,
} from "lucide-react";
import { CompanyFormData } from "@/components/company-form";
import { ContactPerson, SocialMedia } from "@prisma/client";

type ProfileProps = {
  initialData: CompanyFormData;
};

export default function EmployerProfileClient({ initialData }: ProfileProps) {
  console.log(initialData);
  const [company, setCompany] = useState<CompanyFormData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Call server action to update company
      // await updateCompany(company);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving company data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBenefit = async () => {
    if (!newBenefit.trim()) return;

    try {
      // const benefit = await addBenefit({
      //   content: newBenefit,
      //   companyId: company.id
      // });
      // setCompany({
      //   ...company,
      //   benefits: [...company.benefits, benefit]
      // });
      // setNewBenefit("");
    } catch (error) {
      console.error("Error adding benefit:", error);
    }
  };

  const handleDeleteBenefit = async (benefitId: string) => {
    try {
      // await deleteBenefit(benefitId);
      setCompany({
        ...company,
        benefits: company.benefits?.filter((b) => b.id !== benefitId),
      });
    } catch (error) {
      console.error("Error deleting benefit:", error);
    }
  };

  const handleInputChange = (field: keyof CompanyFormData, value: any) => {
    setCompany({
      ...company,
      [field]: value,
    });
  };

  const handleSocialMediaChange = (
    field: "linkedin" | "twitter" | "facebook",
    value: string | null
  ) => {
    setCompany((prev) => ({
      ...prev,
      socialMedia: {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        linkedin:
          field === "linkedin" ? value : prev.socialMedia?.linkedin ?? null,
        twitter:
          field === "twitter" ? value : prev.socialMedia?.twitter ?? null,
        facebook:
          field === "facebook" ? value : prev.socialMedia?.facebook ?? null,
      },
    }));
  };

  const handleContactPersonChange = (
    field: keyof ContactPerson,
    value: string
  ) => {
    setCompany({
      ...company,
      contactPerson: {
        ...company.contactPerson,
        [field]: value,
      },
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information and branding
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
                    src={
                      company.logo
                        ? company.logo
                        : `/placeholder.svg?height=96&width=96&text=${company.name.charAt(
                            0
                          )}`
                    }
                    alt={company.name}
                  />
                  <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{company.name}</h2>
                <p className="text-muted-foreground">{company.industry}</p>
                {company.location && (
                  <p className="flex items-center text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.location}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {company.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                    <span>{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                    <span>{company.phone}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-muted-foreground mr-3" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-muted-foreground mr-3" />
                    <span>{company.size}</span>
                  </div>
                )}
                {company.founded && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-muted-foreground mr-3" />
                    <span>Founded in {company.founded}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Person</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {company.contactPerson.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{company.contactPerson.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {company.contactPerson.email}
                  </p>
                  {company.contactPerson.contactNumber && (
                    <p className="text-sm text-muted-foreground">
                      {company.contactPerson.contactNumber}
                    </p>
                  )}
                </div>
                {isEditing && (
                  <Button variant="outline" size="icon" className="ml-auto">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          {/* 
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
                    <p className="font-medium">Company Brochure.pdf</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on Apr 10, 2023
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {isEditing && (
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              )}
            </CardContent>
          </Card> */}
        </div>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="space-y-4">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About Company</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={company.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Write about your company..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p>{company.description || "No description available."}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Employee Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {company.benefits?.map((benefit) => (
                      <li
                        key={benefit.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-1 rounded-full mr-2">
                            <Plus className="h-3 w-3 text-primary" />
                          </div>
                          <span>{benefit.content}</span>
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteBenefit(benefit.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>

                  {isEditing && (
                    <div className="mt-4 flex gap-2">
                      <Input
                        placeholder="Add a new benefit"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                      />
                      <Button onClick={handleAddBenefit}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Branding</CardTitle>
                  <CardDescription>
                    Customize your company's appearance on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={
                            company.logo
                              ? company.logo
                              : `/placeholder.svg?height=64&width=64&text=${company.name.charAt(
                                  0
                                )}`
                          }
                        />
                        <AvatarFallback>
                          {company.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="social">Social Media</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-5 w-5 text-[#0077B5]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <Input
                            value={company.socialMedia?.linkedin || ""}
                            onChange={(e) =>
                              handleSocialMediaChange(
                                "linkedin",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-5 w-5 text-[#1DA1F2]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                          <Input
                            value={company.socialMedia?.twitter || ""}
                            onChange={(e) =>
                              handleSocialMediaChange("twitter", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-5 w-5 text-[#1877F2]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <Input
                            value={company.socialMedia?.facebook || ""}
                            onChange={(e) =>
                              handleSocialMediaChange(
                                "facebook",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Update your company details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={company.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={company.industry || ""}
                        onChange={(e) =>
                          handleInputChange("industry", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Company Size</Label>
                      <Input
                        id="size"
                        value={company.size || ""}
                        onChange={(e) =>
                          handleInputChange("size", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="founded">Founded Year</Label>
                      <Input
                        id="founded"
                        type="number"
                        value={company.founded?.toString() || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "founded",
                            parseInt(e.target.value) || null
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={company.location || ""}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={company.website || ""}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={company.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={company.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Person Information</CardTitle>
                  <CardDescription>
                    Update contact person details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Name</Label>
                    <Input
                      id="contactName"
                      value={company.contactPerson.name}
                      onChange={(e) =>
                        handleContactPersonChange("name", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={company.contactPerson.email}
                      onChange={(e) =>
                        handleContactPersonChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      value={company.contactPerson.contactNumber || ""}
                      onChange={(e) =>
                        handleContactPersonChange(
                          "contactNumber",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
