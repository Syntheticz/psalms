"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExperienceForm } from "./forms/experience-form";
// import { useExperiences } from "@/lib/api/queries"
// import { useDeleteExperience } from "@/lib/api/mutations"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/lib/queries/user";

interface ProfileExperienceSectionProps {
  userId: string;
  isEditing: boolean;
}

export function ProfileExperienceSection({
  userId,
  isEditing,
}: ProfileExperienceSectionProps) {
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(
    null
  );
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(
    null
  );

  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experience", userId],
    queryFn: async () => {
      const record = await fetchUserInfo(userId);
      return record?.experience;
    },
  });

  // const deleteExperienceMutation = useDeleteExperience({
  //   onSuccess: () => {
  //     toast.success("Experience deleted", {
  //       description: "The experience entry has been removed from your profile.",
  //     })
  //     setExperienceToDelete(null)
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to delete experience. Please try again.",
  //     })
  //   },
  // })

  // const handleDelete = () => {
  //   if (experienceToDelete) {
  //     deleteExperienceMutation.mutate({
  //       userId,
  //       experienceId: experienceToDelete,
  //     });
  //   }
  // };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Work Experience</CardTitle>
          {isEditing && !isAddingExperience && !editingExperienceId && (
            <Button size="sm" onClick={() => setIsAddingExperience(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isAddingExperience && isEditing ? (
            <ExperienceForm
              userId={userId}
              onCancel={() => setIsAddingExperience(false)}
              onSuccess={() => setIsAddingExperience(false)}
            />
          ) : (
            <>
              {experiences && experiences.length > 0 ? (
                experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    {isEditing && !editingExperienceId && (
                      <div className="absolute right-0 top-0 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingExperienceId(exp.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setExperienceToDelete(exp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {editingExperienceId === exp.id ? (
                      <ExperienceForm
                        userId={userId}
                        experience={exp}
                        onCancel={() => setEditingExperienceId(null)}
                        onSuccess={() => setEditingExperienceId(null)}
                      />
                    ) : (
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
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No work experience added yet.
                  {isEditing && (
                    <Button
                      variant="link"
                      className="p-0 h-auto ml-1"
                      onClick={() => setIsAddingExperience(true)}
                    >
                      Add your first experience
                    </Button>
                  )}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!experienceToDelete}
        onOpenChange={(open) => !open && setExperienceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this experience entry from your
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
