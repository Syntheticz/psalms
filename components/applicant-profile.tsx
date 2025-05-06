"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit } from "lucide-react";
import { ProfileAboutSection } from "./profile/profile-about-section";
import { ProfileExperienceSection } from "./profile/profile-experience-section";
import { ProfileEducationSection } from "./profile/profile-education-section";
import { ProfileCertificatesSection } from "./profile/profile-certificates-section";
import { ProfileSkillsSection } from "./profile/profile-skills-section";
import { ProfileSettingsSection } from "./profile/profile-settings-section";
import { ProfileSidebar } from "./profile/profile-sidebar";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/lib/queries/user";
import { useSession } from "next-auth/react";

export function ApplicantProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const session = useSession();

  // Fetch user profile data
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userInfo", session.data?.user.id || ""],
    queryFn: async () => await fetchUserInfo(session.data?.user.id || ""),
  });

  // Mutation for updating user profile
  // const updateProfileMutation = useUpdateUserProfile({
  //   onSuccess: () => {
  //     setIsEditing(false)
  //     toast.success("Profile updated", {
  //       description: "Your profile has been updated successfully.",
  //     })
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to update profile. Please try again.",
  //     })
  //   },
  // })

  const handleSave = () => {
    if (!userData) return;

    // In a real implementation, you would collect all the form data here
    // and pass it to the mutation
    // updateProfileMutation.mutate(userData)
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !userData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Error loading profile</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error
            ? error.message
            : "Failed to load profile data"}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

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
              {/* <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button> */}
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
          <ProfileSidebar user={userData} isEditing={isEditing} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="space-y-4">
            <TabsList className="w-full md:w-auto overflow-x-auto">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <ProfileAboutSection
                bio={userData.bio || ""}
                isEditing={isEditing}
                userId={userData.id}
              />
            </TabsContent>

            <TabsContent value="experience">
              <ProfileExperienceSection
                userId={userData.id}
                isEditing={isEditing}
              />
            </TabsContent>

            <TabsContent value="education">
              <ProfileEducationSection
                userId={userData.id}
                isEditing={isEditing}
              />
            </TabsContent>

            <TabsContent value="certificates">
              <ProfileCertificatesSection
                userId={userData.id}
                isEditing={isEditing}
              />
            </TabsContent>

            <TabsContent value="skills">
              <ProfileSkillsSection
                userId={userData.id}
                isEditing={isEditing}
              />
            </TabsContent>

            <TabsContent value="settings">
              <ProfileSettingsSection user={userData} isEditing={isEditing} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
